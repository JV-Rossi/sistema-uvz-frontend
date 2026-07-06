import React, { useState } from 'react';
import { tabelaBairros } from '../../shared/utils/dadosBairros';
import { listaAgentes as listaAgentesOficiais } from '../../shared/utils/dadosAgentes';
import { db } from '../../core/dbLocal';
import './FormularioBoletimBase.css';
import { Dialog } from '@capacitor/dialog';
import Select from 'react-select';

export default function FormularioBoletimBase({
    titulo,
    subtitulo,
    tipoBoletim, // 'ROTINA', 'PE' ou 'BLOQUEIO'
    setTelaAtual,
    opcoesCategoriasCustomizadas, // Se passado, substitui as categorias padrão
    exibirCamposExtra // Para futuras expansões
}) {

    // ==========================================
    // 🧠 GESTÃO DE ESTADO CENTRALIZADA
    // ==========================================
    const nomeLogado = localStorage.getItem('userLogin') || '';
    const titularPadronizado = nomeLogado.toUpperCase();

    const [listaImoveis, setListaImoveis] = useState([]);
    const [modalRevisaoAberto, setModalRevisaoAberto] = useState(false);

    const [headerMinimizado, setHeaderMinimizado] = useState(false);
    const [erroBairro, setErroBairro] = useState('');

    const [cabecalho, setCabecalho] = useState({
        regional: '',
        bairro: '',
        zona: '',
        codigo: '',
        desmembramento: '',
        data: new Date().toLocaleDateString('pt-BR'),
        agentes: [titularPadronizado]
    });

    const [imovelAtual, setImovelAtual] = useState({
        quarteirao: '',
        endereco: '',
        numero: '',
        complemento: '',
        tipo: tipoBoletim === 'PE' ? 'PE' : 'CASA',
        pendencia: 'NAO',
        a2: 0, b: 0, c: 0, d1: 0, d2: 0, e: 0,
        teveDepositoEliminado: false,
        a2_elim: 0, b_elim: 0, c_elim: 0, d1_elim: 0, d2_elim: 0, e_elim: 0,
        observacao: '',
        larvicidaGrama: 0,
        coletas: [],
        teveColeta: false
    });

    // Estados locais temporários para o tubo atual antes de clicar em "+"
    const [tuboInput, setTuboInput] = useState(''); // Refere-se ao Nº da Amostra
    const [tipoDepositoTubo, setTipoDepositoTubo] = useState('A2'); // Ajustado conforme a etiqueta
    const [larvasInput, setLarvasInput] = useState('');
    const [pupasInput, setPupasInput] = useState('');

    // ==========================================
    // ⚙️ INTERAÇÕES E MANIPULAÇÕES DE FLUXO
    // ==========================================
    const alterarContador = (campo, operacao) => {
        setImovelAtual(prev => {
            const valorAtual = prev[campo] || 0;
            const novoValor = operacao === '+' ? valorAtual + 1 : Math.max(0, valorAtual - 1);
            return { ...prev, [campo]: novoValor };
        });
    };

    const adicionarAgente = (e) => {
        if (e) e.preventDefault();
        setCabecalho(prev => ({
            ...prev,
            agentes: [...prev.agentes, '']
        }));
    };

    const removerAgente = (indexParaRemover, e) => {
        if (e) e.preventDefault();
        setCabecalho(prev => ({
            ...prev,
            agentes: prev.agentes.filter((_, index) => index !== indexParaRemover)
        }));
    };

    const handleNomeAgente = (index, novoNome) => {
        setCabecalho(prev => {
            const novaLista = [...prev.agentes];
            novaLista[index] = novoNome;
            return { ...prev, agentes: novaLista };
        });
    };

    const handleAdicionarImovel = (e) => {
        e.preventDefault();
        if (!imovelAtual.endereco || !imovelAtual.numero || !imovelAtual.quarteirao) {
            alert('⚠️ Preencha Quarteirão, Endereço e Número do imóvel!');
            return;
        }

        if (listaImoveis.length === 0) {
            setHeaderMinimizado(true);
        }

        setListaImoveis([...listaImoveis, imovelAtual]);

        // Reset mantendo dados logísticos repetitivos da rua
        setImovelAtual(prev => ({
            ...prev,
            numero: '',
            complemento: '',
            a2: 0, b: 0, c: 0, d1: 0, d2: 0, e: 0,
            teveDepositoEliminado: false,
            a2_elim: 0, b_elim: 0, c_elim: 0, d1_elim: 0, d2_elim: 0, e_elim: 0,
            observacao: '',
            larvicidaGrama: 0,
            coletas: []
        }));
    };

    // Função para remover um imóvel específico da folha antes de enviar
    const handleRemoverImovel = (indexParaRemover) => {
        const confirmacao = window.confirm("Tem certeza que deseja apagar este imóvel da ficha?");
        if (!confirmacao) return;

        const novaLista = listaImoveis.filter((_, index) => index !== indexParaRemover);

        setListaImoveis(novaLista);

        if (novaLista.length === 0) {
            setModalRevisaoAberto(false);
        }
    };

    const handleFinalizarEEnviar = async () => {
        if (listaImoveis.length === 0) {
            alert('⚠️ Adicione pelo menos um imóvel antes de finalizar o boletim!');
            return;
        }

        const equipeComMatriculas = cabecalho.agentes.map(nomeDigitado => {
            if (!nomeDigitado || nomeDigitado.trim() === '') return null;
            const correspondente = listaAgentesOficiais.find(a =>
                a.nome.toLowerCase() === nomeDigitado.trim().toLowerCase() &&
                a.regional.toLowerCase() === cabecalho.regional?.toLowerCase()
            );
            return {
                nome: nomeDigitado.trim(),
                matricula: correspondente ? correspondente.matricula : 'MATRICULA_NAO_ENCONTRADA'
            };
        }).filter(Boolean);

        const payloadOffline = {
            ...cabecalho,
            tipo_boletim: tipoBoletim,
            imoveis: listaImoveis,
            total_imoveis: listaImoveis.length,
            titular_matricula: localStorage.getItem('userMatricula') || 'DESCONHECIDO',
            equipe_parceiros: equipeComMatriculas,
            data_registro: new Date().toISOString()
        };

        try {
            await db.fichas_soltas.add(payloadOffline);
            alert('✅ Ficha guardada na gaveta local do tablet com sucesso!');
            setListaImoveis([]);
            if (typeof setTelaAtual === 'function') {
                setTelaAtual('campo_menu');
            }
        } catch (error) {
            console.error("Erro ao salvar no Dexie:", error);
            alert('❌ Erro crítico ao armazenar os dados locais no tablet.');
        }
    };

    const traduzirVisita = (status) => {
        if (!status) return 'Desconhecido';
        // Remove espaços em branco acidentais e garante que está tudo maiúsculo para comparar
        const s = status.trim().toUpperCase();
        if (s === 'NAO' || s === 'NÃO') return 'Normal';
        if (s === 'RECUSADO') return 'Recusada';
        if (s === 'FECHADO') return 'Fechada';
        return status;
    };

    // ==========================================
    // 🔍 FILTROS E PREPARAÇÃO PARA O REACT-SELECT
    // ==========================================
    const bairrosFiltrados = tabelaBairros.filter(b => b.regional === cabecalho.regional);
    const agentesFiltrados = listaAgentesOficiais.filter(a => a.regional === cabecalho.regional);
    const qtdAgentesValidos = cabecalho.agentes.filter(a => a && a.trim() !== '').length;

    // Converte as listas filtradas para o formato exigido pelo react-select
    const opcoesBairros = bairrosFiltrados.map(b => ({
        value: b.nome,
        label: b.nome
    }));

    const opcoesAgentes = agentesFiltrados.map(a => ({
        value: a.nome,
        label: `${a.nome} - ${a.matricula}`
    }));

    // Estilos para evitar zoom no celular e sobreposição
    const mobileSelectStyles = {
        control: (base) => ({
            ...base,
            minHeight: '40px',
            fontSize: '16px'
        }),
        menu: (base) => ({
            ...base,
            zIndex: 9999
        })
    };

    // ==========================================
    // 🧪 MANIPULAÇÃO DE TUBOS E COLETAS
    // ==========================================
    const handleAdicionarTubo = (e) => {
        e.preventDefault();
        if (!tuboInput.trim()) {
            alert('⚠️ Digite o Nº da Amostra (Tubo)!');
            return;
        }

        if (imovelAtual.coletas.some(c => c.numeroTubo === tuboInput.trim())) {
            alert('⚠️ Esta amostra já foi adicionada para este imóvel!');
            return;
        }

        setImovelAtual(prev => ({
            ...prev,
            coletas: [...prev.coletas, {
                numeroTubo: tuboInput.trim(),
                deposito: tipoDepositoTubo,
                larvas: larvasInput === '' ? 0 : parseInt(larvasInput, 10),
                pupas: pupasInput === '' ? 0 : parseInt(pupasInput, 10)
            }]
        }));

        // Limpa os campos para o próximo tubo
        setTuboInput('');
        setLarvasInput('');
        setPupasInput('');
    };

    const handleRemoverTubo = (indexParaRemover) => {
        setImovelAtual(prev => ({
            ...prev,
            coletas: prev.coletas.filter((_, idx) => idx !== indexParaRemover)
        }));
    };

    return (
        <div className="br-container-lg p-3 fundo-claro-gov">

            {/* BOTÃO VOLTAR */}
            <button className="br-button secondary mb-3" type="button" onClick={() => setTelaAtual('campo_menu')}>
                <i className="fas fa-arrow-left mr-1"></i> Voltar
            </button>

            {/* TÍTULO CORPORATIVO */}
            <div className="mb-4 p-3 bg-white shadow-sm rounded titulo-boletim-base">
                <h1 className="text-up-03 text-weight-bold text-primary-default mb-2">{titulo}</h1>
                <p className="text-base text-secondary-08 text-weight-medium mb-0">{subtitulo}</p>
            </div>

            {/* ================= BLOCÃO 1: CABEÇALHO LOGÍSTICO ================= */}
            {!headerMinimizado ? (
                <div className="br-card p-3 mb-4">
                    <div className="text-weight-semi-bold text-up-01 text-primary-default mb-3">
                        <i className="fas fa-map-marked-alt mr-2"></i> 1. Localidade e Parcerias
                    </div>

                    <div className="row">
                        <div className="col-12 col-sm-4 mb-3">
                            <div className="br-select w-100">
                                <label>Regional</label>
                                <select
                                    value={cabecalho.regional}
                                    onChange={(e) => setCabecalho({ ...cabecalho, regional: e.target.value, bairro: '' })}
                                >
                                    <option value="">Selecione...</option>
                                    <option value="Norte">Norte</option>
                                    <option value="Sul">Sul</option>
                                    <option value="Leste">Leste</option>
                                    <option value="Oeste">Oeste</option>
                                </select>
                            </div>
                        </div>

                        <div className="col-12 col-sm-4 mb-3">
                            <div className="br-input w-100">
                                <label style={{ display: 'block', marginBottom: '4px' }}>Bairro</label>
                                {/* IMPLEMENTAÇÃO REACT-SELECT PARA BAIRROS */}
                                <Select
                                    options={opcoesBairros}
                                    // O value precisa encontrar o objeto correspondente na lista
                                    value={opcoesBairros.find(opt => opt.value === cabecalho.bairro) || null}
                                    onChange={(selectedOption) => {
                                        // selectedOption pode ser null se o usuário limpar o campo
                                        setCabecalho({ ...cabecalho, bairro: selectedOption ? selectedOption.value : '' })
                                    }}
                                    isDisabled={!cabecalho.regional}
                                    placeholder={cabecalho.regional ? "🔍 Buscar bairro..." : "Escolha a Regional"}
                                    isClearable={true}
                                    isSearchable={true}
                                    styles={mobileSelectStyles}
                                    noOptionsMessage={() => "Nenhum bairro encontrado"}
                                />
                            </div>
                        </div>

                        <div className="col-12 col-sm-4 mb-3">
                            <div className="br-input">
                                <label>Zona</label>
                                <input type="text" value={cabecalho.zona} onChange={e => setCabecalho({ ...cabecalho, zona: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-6">
                            <div className="br-input">
                                <label>Código</label>
                                <input type="text" placeholder="Ex: 282" value={cabecalho.codigo} onChange={e => setCabecalho({ ...cabecalho, codigo: e.target.value })} />
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="br-input">
                                <label>Desmembramento</label>
                                <input type="text" placeholder="Ex: *" value={cabecalho.desmembramento} onChange={e => setCabecalho({ ...cabecalho, desmembramento: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    {/* SEÇÃO DINÂMICA DE PARCEIROS */}
                    <div className="p-3 bg-secondary-02 border rounded mb-3">
                        <div className="text-weight-medium text-down-01 text-secondary-08 mb-3">👥 Agentes em Campo</div>

                        {cabecalho.agentes.map((agente, index) => {
                            if (index === 0) return null; // Oculta o titular logado da edição direta
                            return (
                                <div key={index} className="d-flex align-items-center mb-2" style={{ gap: '8px' }}>
                                    <div className="flex-grow-1">
                                        {/* IMPLEMENTAÇÃO REACT-SELECT PARA AGENTES */}
                                        <Select
                                            options={opcoesAgentes}
                                            value={opcoesAgentes.find(opt => opt.value === agente) || null}
                                            onChange={(selectedOption) => {
                                                handleNomeAgente(index, selectedOption ? selectedOption.value : '')
                                            }}
                                            placeholder="Nome do ACE Parceiro"
                                            isClearable={true}
                                            isSearchable={true}
                                            styles={mobileSelectStyles}
                                            noOptionsMessage={() => "Agente não encontrado"}
                                        />
                                    </div>
                                    <button className="br-button circle small" type="button" onClick={(e) => removerAgente(index, e)}>
                                        <i className="fas fa-times text-danger"></i>
                                    </button>
                                </div>
                            );
                        })}

                        <button className="br-button secondary small block mt-2" type="button" onClick={adicionarAgente}>
                            <i className="fas fa-user-plus mr-1"></i> Vincular Colega à Equipe
                        </button>

                        {qtdAgentesValidos > 1 && listaImoveis.length > 0 && (
                            <div className="mt-3 p-2 bg-success-pastel text-center rounded border border-success">
                                <span className="text-down-01 text-secondary-09">
                                    Produção dividida: <strong>{listaImoveis.length}</strong> imóveis &divide; <strong>{qtdAgentesValidos}</strong> agentes = <strong>{(listaImoveis.length / qtdAgentesValidos).toFixed(1)}</strong> imóveis/cada.
                                </span>
                            </div>
                        )}
                    </div>

                    <button className="br-button primary block" type="button" onClick={() => setHeaderMinimizado(true)}>
                        Fixar Localização e Mapear Visitas <i className="fas fa-chevron-up ml-1"></i>
                    </button>
                </div>

            ) : (
                // --- MODO MINIMIZADO ---
                // (Pode manter o seu código do modo minimizado intacto aqui)
                <div
                    className="br-card p-3 mb-4 d-flex justify-content-between align-items-center shadow-sm cabecalho-minimizado"
                    onClick={() => setHeaderMinimizado(false)}
                >
                    <span className="text-weight-semi-bold cabecalho-minimizado-texto">
                        <i className="fas fa-map-pin mr-2 cabecalho-minimizado-destaque"></i>
                        {cabecalho.bairro || 'Sem Bairro'} | Qtd ACE: {qtdAgentesValidos}
                    </span>
                    <span className="text-weight-bold cabecalho-minimizado-acao">
                        Alterar <i className="fas fa-edit ml-1"></i>
                    </span>
                </div>
            )}

            {/* ================= BLOCÃO 2: ENTRADA DE IMÓVEIS ================= */}
            <div className="br-card p-3 mb-4">
                <div className="text-weight-semi-bold text-up-01 text-warning mb-3">
                    <i className="fas fa-home mr-2"></i> 2. Registro do Imóvel
                </div>

                <div className="row">
                    <div className="col-4 mb-3">
                        <div className="br-input">
                            <label>Quarteirão</label>
                            <input type="text" placeholder="Ex: 12A" value={imovelAtual.quarteirao} onChange={e => setImovelAtual({ ...imovelAtual, quarteirao: e.target.value })} />
                        </div>
                    </div>
                    <div className="col-8 mb-3">
                        <div className="br-input">
                            <label>Endereço</label>
                            <input type="text" placeholder="Ex: Rua Cuiabá" value={imovelAtual.endereco} onChange={e => setImovelAtual({ ...imovelAtual, endereco: e.target.value })} />
                        </div>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-6">
                        <div className="br-input">
                            <label>Número</label>
                            <input type="text" placeholder="Ex: 450" value={imovelAtual.numero} onChange={e => setImovelAtual({ ...imovelAtual, numero: e.target.value })} />
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="br-input">
                            <label>Complemento</label>
                            <input type="text" placeholder="Ex: Fundos" value={imovelAtual.complemento} onChange={e => setImovelAtual({ ...imovelAtual, complemento: e.target.value })} />
                        </div>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-6">
                        <div className="br-select w-100">
                            <label>Tipo de Imóvel</label>
                            <select value={imovelAtual.tipo} onChange={e => setImovelAtual({ ...imovelAtual, tipo: e.target.value })}>
                                {opcoesCategoriasCustomizadas ? opcoesCategoriasCustomizadas.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                )) : (
                                    <>
                                        <option value="CASA">Casa (C)</option>
                                        <option value="KITNET">Kitnet (KIT)</option>
                                        <option value="APARTAMENTO">Apartamento (AP)</option>
                                        <option value="COMERCIO">Comércio (CG)</option>
                                        <option value="IGREJA">Igreja (I)</option>
                                        <option value="TERRENO">Terreno Baldio (TB)</option>
                                        <option value="PE">Ponto Estratégico (PE)</option>
                                        <option value="ORGAO_PUBLICO">Órgão Público (OP)</option>
                                    </>
                                )}
                            </select>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="br-select w-100">
                            <label>Situação da Visita</label>
                            <select value={imovelAtual.pendencia} onChange={e => setImovelAtual({ ...imovelAtual, pendencia: e.target.value })}>
                                <option value="NAO">Normal (Trabalhado)</option>
                                <option value="RECUSADO">Recusado (REC)</option>
                                <option value="FECHADO">Fechado (FEC)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* CONTADORES BIOLÓGICOS (INSPEÇÃO) */}
                <div className="mb-4">
                    <div className="text-weight-medium text-down-01 text-success mb-2">
                        <i className="fas fa-search-dollar mr-1"></i> Depósitos Inspecionados por Categoria:
                    </div>
                    <div className="grid-contadores-motor p-2 border rounded bg-secondary-01">
                        {['a2', 'b', 'c', 'd1', 'd2', 'e'].map(dep => (
                            <div key={dep} className="item-contador-bloco">
                                <span className="text-weight-bold text-uppercase text-secondary-08">{dep}:</span>
                                <div className="d-flex align-items-center botoes-contador-gap">
                                    <button className="br-button circle secondary small" type="button" onClick={() => alterarContador(dep, '-')}><i className="fas fa-minus"></i></button>
                                    <span className="text-weight-bold text-center px-2" style={{ minWidth: '24px' }}>{imovelAtual[dep]}</span>
                                    <button className="br-button circle secondary small" type="button" onClick={() => alterarContador(dep, '+')}><i className="fas fa-plus"></i></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ENGENHARIA DE TRATAMENTO QUÍMICO (LARVICIDA) */}
                {imovelAtual.a2 > 0 && (
                    <div className="br-card p-3 mb-3 bg-warning-pastel border border-warning card-larvicida">
                        <div className="text-weight-bold text-down-01 text-warning mb-1">
                            <i className="fas fa-flask mr-1"></i> Tratamento Focal Vinculado (Depósito A2)
                        </div>
                        <p className="text-down-02 text-secondary-07 mb-2">Lançamento obrigatório de dosagem em gramas para recipientes de armazenamento d'água:</p>
                        <div className="br-input w-50">
                            <input
                                type="number" step="0.1" min="0" placeholder="Ex: 2.5"
                                value={imovelAtual.larvicidaGrama || ''}
                                onChange={e => setImovelAtual({ ...imovelAtual, larvicidaGrama: parseFloat(e.target.value) || 0 })}
                            />
                        </div>
                    </div>
                )}

                {/* SEÇÃO DE ELIMINAÇÃO FÍSICA */}
                <div className="p-3 border rounded mb-3 bg-danger-pastel border-danger card-eliminacao">
                    <div className="br-checkbox">
                        <input
                            id="check-eliminados" type="checkbox"
                            checked={imovelAtual.teveDepositoEliminado}
                            onChange={(e) => setImovelAtual({ ...imovelAtual, teveDepositoEliminado: e.target.checked })}
                        />
                        <label htmlFor="check-eliminados" className="text-weight-bold text-danger">Houve Depósitos Eliminados na Visita?</label>
                    </div>

                    {imovelAtual.teveDepositoEliminado && (
                        <div className="grid-contadores-motor mt-3 p-2 bg-white rounded border">
                            {['a2', 'b', 'c', 'd1', 'd2', 'e'].map(dep => {
                                const depElim = `${dep}_elim`;
                                return (
                                    <div key={depElim} className="item-contador-bloco text-danger">
                                        <span className="text-weight-bold text-uppercase">{dep}:</span>
                                        <div className="d-flex align-items-center botoes-contador-gap">
                                            <button className="br-button circle secondary small text-danger" type="button" onClick={() => alterarContador(depElim, '-')}><i className="fas fa-minus"></i></button>
                                            <span className="text-weight-bold text-center px-2" style={{ minWidth: '24px' }}>{imovelAtual[depElim]}</span>
                                            <button className="br-button circle secondary small text-danger" type="button" onClick={() => alterarContador(depElim, '+')}><i className="fas fa-plus"></i></button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ================= SEÇÃO: CONTROLE DE COLETAS (GERAL) ================= */}
                <div
                    className="p-3 border rounded mb-3"
                    style={{
                        borderLeft: '4px solid #1351b4',
                        /* Fica com um fundo azul bem clarinho quando marcado, igual o vermelho */
                        backgroundColor: imovelAtual.teveColeta ? '#f4f9ff' : '#ffffff'
                    }}
                >
                    {/* GATILHO - CHECKBOX */}
                    <div className="br-checkbox">
                        <input
                            id="checkbox-teve-coleta"
                            type="checkbox"
                            checked={imovelAtual.teveColeta}
                            onChange={e => {
                                const marcado = e.target.checked;
                                setImovelAtual(prev => ({
                                    ...prev,
                                    teveColeta: marcado,
                                    coletas: marcado ? prev.coletas : []
                                }));
                            }}
                        />
                        <label
                            htmlFor="checkbox-teve-coleta"
                            className="text-weight-bold m-0"
                            style={{ color: '#1351b4', cursor: 'pointer' }}
                        >
                            Houve Coleta de Larvas na Visita?
                        </label>
                    </div>

                    {/* ÁREA DOS TUBOS (ABRE DENTRO DO MESMO CARD, MANTENDO A LINHA CONTÍNUA) */}
                    {imovelAtual.teveColeta && (
                        <div className="mt-3 pt-3 animate__animated animate__fadeInFast" style={{ borderTop: '1px solid #bbdefb' }}>
                            <div className="text-weight-bold mb-2" style={{ color: '#1351b4' }}>
                                <i className="fas fa-vial mr-1"></i> Coleta de Larvas (Laboratório / Entomologia)
                            </div>

                            {/* Inputs para nova coleta - Refletindo a Etiqueta da Entomologia */}
                            <div className="row align-items-end mb-3">
                                <div className="col-sm-3 col-6 mb-2">
                                    <div className="br-input small">
                                        <label>Nº Amostra</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: 01"
                                            value={tuboInput}
                                            onChange={e => setTuboInput(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-3 col-6 mb-2">
                                    <div className="br-select w-100 small">
                                        <label>Depósito</label>
                                        <select value={tipoDepositoTubo} onChange={e => setTipoDepositoTubo(e.target.value)}>
                                            <option value="A1">A1</option>
                                            <option value="A2">A2</option>
                                            <option value="B">B</option>
                                            <option value="C">C</option>
                                            <option value="D1">D1</option>
                                            <option value="D2">D2</option>
                                            <option value="E">E</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-2 col-4 mb-2">
                                    <div className="br-input small">
                                        <label>Larvas</label>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            value={larvasInput}
                                            onChange={e => setLarvasInput(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-2 col-4 mb-2">
                                    <div className="br-input small">
                                        <label>Pupas</label>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="0"
                                            value={pupasInput}
                                            onChange={e => setPupasInput(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-2 col-4 mb-2 pl-0">
                                    <button className="br-button primary circle small block w-100" type="button" onClick={handleAdicionarTubo} title="Adicionar amostra">
                                        <i className="fas fa-plus"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Listagem de amostras vinculadas ao imóvel */}
                            {imovelAtual.coletas.length > 0 ? (
                                <div className="p-2 border rounded bg-white">
                                    <div className="text-down-02 text-secondary-06 text-weight-medium mb-1">Amostras vinculadas a esta casa:</div>
                                    <div className="d-flex flex-wrap" style={{ gap: '6px' }}>
                                        {imovelAtual.coletas.map((col, idx) => (
                                            <span key={idx} className="br-tag small tag-tubo-lira d-flex align-items-center">
                                                🧪 Amostra: {col.numeroTubo} | Dep: {col.deposito} | L: {col.larvas} | P: {col.pupas}
                                                <i className="fas fa-times ml-2 text-danger" style={{ cursor: 'pointer' }} onClick={() => handleRemoverTubo(idx)}></i>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-down-02 text-danger text-weight-medium m-0">
                                    <i className="fas fa-exclamation-triangle mr-1"></i> Nenhuma amostra registrada neste imóvel ainda.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* OBSERVAÇÕES */}
                <div className="br-input mb-3">
                    <label>Observações do Imóvel (Opcional)</label>
                    <textarea
                        className="textarea-observacao"
                        rows="2" placeholder="Ex: Cão bravo, imóvel fechado para imobiliária, foco destruído..."
                        value={imovelAtual.observacao}
                        onChange={e => setImovelAtual({ ...imovelAtual, observacao: e.target.value })}
                    />
                </div>

                <button className="br-button secondary block text-weight-bold btn-salvar-imovel" type="button" onClick={handleAdicionarImovel}>
                    <i className="fas fa-plus-circle mr-1"></i> Salvar Imóvel na Ficha
                </button>
            </div>

            {/* ================= BLOCÃO 3: ÚLTIMO IMÓVEL SALVO ================= */}
            {listaImoveis.length > 0 && (
                <div className="br-card p-3 mb-4 border-success card-resumo-sucesso">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="text-weight-bold text-up-01 text-success">
                            <i className="fas fa-check-circle mr-2"></i> Último Imóvel Salvo
                        </div>
                        <div className="br-tag bg-success text-white text-weight-bold">
                            Total: {listaImoveis.length}
                        </div>
                    </div>

                    {/* Exibe apenas a posição mais recente do array */}
                    <div className="p-3 border rounded mb-3 card-ultimo-imovel">
                        {(() => {
                            const ultimoIndex = listaImoveis.length - 1;
                            const ultimo = listaImoveis[ultimoIndex];
                            return (
                                <div className="d-flex justify-content-between align-items-start">
                                    <div className="text-secondary-08">
                                        <div className="text-weight-bold text-up-01 mb-1">
                                            Qrt {ultimo.quarteirao} - {ultimo.endereco}, Nº {ultimo.numero}
                                        </div>
                                        <div className="text-down-01 d-flex flex-wrap container-tags-revisao">
                                            <span><i className="fas fa-home mr-1 text-primary-default"></i> {ultimo.tipo}</span>
                                            <span>
                                                <i className="fas fa-clipboard-check mr-1 text-success"></i>
                                                Visita: {traduzirVisita(ultimo.pendencia)}
                                            </span>
                                            <span><i className="fas fa-search mr-1 text-warning"></i> Inspecionados: {ultimo.a2 + ultimo.b + ultimo.c + ultimo.d1 + ultimo.d2 + ultimo.e}</span>
                                        </div>
                                    </div>
                                    <button
                                        className="br-button circle small bg-white border ml-2"
                                        type="button"
                                        title="Apagar este imóvel"
                                        onClick={() => handleRemoverImovel(ultimoIndex)}
                                    >
                                        <i className="fas fa-trash-alt text-danger"></i>
                                    </button>
                                </div>
                            )
                        })()}
                    </div>

                    <button
                        className="br-button primary block bg-success text-white border-success text-weight-bold"
                        type="button"
                        onClick={() => setModalRevisaoAberto(true)}
                    >
                        <i className="fas fa-list-ol mr-2"></i> REVISAR E FINALIZAR
                    </button>
                </div>
            )}

            {/* ================= MODAL GOV.BR PARA REVISÃO ================= */}
            {modalRevisaoAberto && (
                <div className="br-scrim is-active" onClick={() => setModalRevisaoAberto(true)}>
                    <div className="br-modal modal-revisao-gov" onClick={e => e.stopPropagation()}>

                        <div className="br-modal-header border-bottom">
                            <div className="br-modal-title text-up-02 text-weight-semi-bold text-success">
                                <i className="fas fa-clipboard-list mr-2"></i> Revisão do Boletim
                            </div>
                        </div>

                        <div className="br-modal-body pt-3 pb-3">
                            <p className="text-secondary-07 text-down-01 mb-3">
                                Confira a lista dos <strong>{listaImoveis.length}</strong> imóveis registrados antes de fechar a folha da rua.
                            </p>

                            <div className="br-list lista-modal-scroll">
                                {listaImoveis.map((imv, idx) => (
                                    <div key={idx} className="br-item py-2 border-bottom">
                                        <div className="row align-items-center w-100 m-0">
                                            <div className="col-auto pl-0">
                                                <span className="br-tag bg-secondary-03 text-weight-bold text-secondary-08">{idx + 1}</span>
                                            </div>
                                            <div className="col pl-0 pr-1">
                                                <div className="text-weight-semi-bold text-primary-default text-down-01">
                                                    Qrt {imv.quarteirao} &bull; {imv.endereco}, Nº {imv.numero}
                                                </div>
                                                <div className="text-down-02 mt-1 d-flex flex-wrap container-tags-revisao">
                                                    <span className="br-tag small tag-revisao-clara">{imv.tipo}</span>
                                                    <span className="br-tag small tag-revisao-clara">
                                                        Visita: {traduzirVisita(imv.pendencia)}
                                                    </span>
                                                    <span className="br-tag small tag-revisao-clara">
                                                        Insp: {imv.a2 + imv.b + imv.c + imv.d1 + imv.d2 + imv.e}
                                                    </span>
                                                </div>

                                                {imv.coletas && imv.coletas.length > 0 && (
                                                    <div className="mt-1 d-flex flex-wrap" style={{ gap: '4px', paddingLeft: '2px' }}>
                                                        {imv.coletas.map((c, tIdx) => (
                                                            <span key={tIdx} className="br-tag small bg-primary-lighten text-white text-weight-bold" style={{ fontSize: '10px', backgroundColor: '#1351b4' }}>
                                                                🧪 Tubo: {c.numeroTubo} ({c.deposito})
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-auto px-0">
                                                <button
                                                    className="br-button circle small"
                                                    type="button"
                                                    title="Excluir imóvel"
                                                    onClick={() => handleRemoverImovel(idx)}
                                                >
                                                    <i className="fas fa-trash-alt text-danger"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RODAPÉ DO MODAL — AÇÕES */}
                        <div
                            className="br-modal-footer d-flex flex-wrap justify-content-between pt-3 border-top"
                            style={{ gap: '12px' }}
                        >
                            <button
                                className="br-button secondary flex-grow-1"
                                type="button"
                                onClick={() => setModalRevisaoAberto(false)}
                            >
                                <i className="fas fa-arrow-left mr-1"></i> Voltar
                            </button>

                            <button
                                className="br-button primary bg-success text-white border-success text-weight-bold flex-grow-1"
                                type="button"
                                onClick={handleFinalizarEEnviar}
                            >
                                <i className="fas fa-check-circle mr-1"></i> Confirmar e Enviar
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}