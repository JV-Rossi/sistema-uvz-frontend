import React, { useState, useEffect } from 'react';
import { tabelaBairros } from '../../shared/utils/dadosBairros';
import { listaAgentes as listaAgentesOficiais } from '../../shared/utils/dadosAgentes';
import { db } from '../../core/dbLocal';
import './FormularioBoletimBase.css';

export default function FormularioBoletimBase({
    titulo,
    subtitulo,
    tipoBoletim, // 'ROTINA', 'PE' ou 'BLOQUEIO'
    setTelaAtual,
    opcoesCategoriasCustomizadas, // Se passado, substitui as categorias padrão
    exibirCamposExtra // Para futuras expansões se houver campos exclusivos de uma stack
}) {

    // ==========================================
    // 🧠 GESTÃO DE ESTADO CENTRALIZADA
    // ==========================================
    const nomeLogado = localStorage.getItem('userLogin') || '';
    const titularPadronizado = nomeLogado.toUpperCase();

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
        larvicidaGrama: 0
    });

    const [listaImoveis, setListaImoveis] = useState([]);

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
            larvicidaGrama: 0
        }));
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

    const bairrosFiltrados = tabelaBairros.filter(b => b.regional === cabecalho.regional);
    const agentesFiltrados = listaAgentesOficiais.filter(a => a.regional === cabecalho.regional);
    const qtdAgentesValidos = cabecalho.agentes.filter(a => a && a.trim() !== '').length;

    return (
        <div className="br-container-lg p-3 fundo-claro-gov">

            {/* BOTÃO VOLTAR */}
            <button className="br-button secondary mb-3" type="button" onClick={() => setTelaAtual('campo_menu')}>
                <i className="fas fa-arrow-left mr-1"></i> Voltar
            </button>

            {/* TÍTULO CORPORATIVO */}
            <div className="mb-4 p-3 bg-white shadow-sm rounded" style={{ borderLeft: '5px solid #1351b4' }}>
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
                            <div className="br-input">
                                <label>Bairro / Localidade</label>
                                <input
                                    type="text"
                                    list="bairros-motor"
                                    placeholder={cabecalho.regional ? "🔍 Buscar bairro..." : "Escolha a Regional"}
                                    disabled={!cabecalho.regional}
                                    value={cabecalho.bairro}
                                    onChange={(e) => setCabecalho({ ...cabecalho, bairro: e.target.value })}
                                />
                                <datalist id="bairros-motor">
                                    {bairrosFiltrados.map(b => <option key={b.nome} value={b.nome} />)}
                                </datalist>
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
                                <label>Código Ficha</label>
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
                                    <div className="br-input flex-grow-1">
                                        <input
                                            type="text"
                                            list="agentes-motor"
                                            placeholder="Nome do ACE Parceiro"
                                            value={agente}
                                            onChange={(e) => handleNomeAgente(index, e.target.value)}
                                        />
                                    </div>
                                    <button className="br-button circle small" type="button" onClick={(e) => removerAgente(index, e)}>
                                        <i className="fas fa-times text-danger"></i>
                                    </button>
                                </div>
                            );
                        })}
                        <datalist id="agentes-motor">
                            {agentesFiltrados.map(a => <option key={a.matricula} value={a.nome}>{a.matricula}</option>)}
                        </datalist>

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
                <div
                    className="br-card p-3 mb-4 d-flex justify-content-between align-items-center shadow-sm"
                    style={{ backgroundColor: '#0c326f', cursor: 'pointer', border: 'none', borderRadius: '8px' }}
                    onClick={() => setHeaderMinimizado(false)}
                >
                    <span className="text-weight-semi-bold" style={{ color: '#ffffff', fontSize: '15px' }}>
                        <i className="fas fa-map-pin mr-2" style={{ color: '#ffb74d' }}></i>
                        {cabecalho.bairro || 'Sem Bairro'} | Qtd ACE: {qtdAgentesValidos}
                    </span>
                    <span className="text-weight-bold" style={{ color: '#ffb74d', fontSize: '14px' }}>
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
                            <label>Logradouro / Endereço</label>
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
                            <label>Situação / Visita</label>
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
                                <div className="d-flex align-items-center" style={{ gap: '6px' }}>
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
                    <div className="br-card p-3 mb-3 bg-warning-pastel border border-warning" style={{ borderLeft: '5px solid #ffb74d !important' }}>
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
                <div className="p-3 border rounded mb-3 bg-danger-pastel border-danger" style={{ borderLeft: '5px solid #ef5350 !important' }}>
                    <div className="br-checkbox">
                        <input
                            id="check-eliminados" type="checkbox"
                            checked={imovelAtual.teveDepositoEliminado}
                            onChange={(e) => setCabecalho && setImovelAtual({ ...imovelAtual, teveDepositoEliminado: e.target.checked })}
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
                                        <div className="d-flex align-items-center" style={{ gap: '6px' }}>
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

                {/* OBSERVAÇÕES */}
                <div className="br-input mb-3">
                    <label>Observações do Imóvel (Opcional)</label>
                    <textarea
                        rows="2" placeholder="Ex: Cão bravo, imóvel fechado para imobiliária, foco destruído..."
                        value={imovelAtual.observacao}
                        onChange={e => setImovelAtual({ ...imovelAtual, observacao: e.target.value })}
                        style={{ border: '1px solid #ccc', borderRadius: '4px', width: '100%', padding: '8px' }}
                    />
                </div>

                <button className="br-button secondary block text-weight-bold" type="button" onClick={handleAdicionarImovel} style={{ borderColor: '#e67e22', color: '#e67e22' }}>
                    <i className="fas fa-plus-circle mr-1"></i> Salvar Imóvel na Ficha
                </button>
            </div>

            {/* ================= BLOCÃO 3: REVISÃO DA FOLHA DO DIA ================= */}
            {listaImoveis.length > 0 && (
                <div className="br-card p-3 mb-4 border-success" style={{ borderTop: '4px solid #107e3e !important' }}>
                    <div className="text-weight-bold text-up-01 text-success mb-2">
                        <i className="fas fa-folder-open mr-2"></i> 3. Resumo da Ficha Atual ({listaImoveis.length} imóveis)
                    </div>
                    <div className="p-2 border rounded bg-secondary-01 mb-3" style={{ maxHeight: '160px', overflowY: 'auto' }}>
                        {listaImoveis.map((imv, idx) => (
                            <div key={idx} className="py-1 text-down-01 border-bottom border-secondary-03 text-secondary-08">
                                <i className="fas fa-circle text-primary-default mr-1" style={{ fontSize: '8px' }}></i>
                                Qrt <strong>{imv.quarteirao}</strong> &bull; {imv.endereco}, Nº {imv.numero} ({imv.tipo}) &bull; Recipientes: {imv.a2 + imv.b + imv.c + imv.d1 + imv.d2 + imv.e} vistos.
                            </div>
                        ))}
                    </div>

                    <button className="br-button primary block bg-success text-white border-success text-weight-bold" type="button" onClick={handleFinalizarEEnviar}>
                        <i className="fas fa-save mr-2"></i> FINALIZAR E SALVAR BOLETIM DA RUA
                    </button>
                </div>
            )}
        </div>
    );
}