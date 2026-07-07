import React, { useState, useEffect } from 'react';
import './AnaliseLarvas.css';
import { listaAgentes as listaAgentesOficiais } from '../../shared/utils/dadosAgentes.js';

// 🌐 Configuração adaptativa da URL da API (Local vs Produção no Render)
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8080'
    : 'https://sistema-uvz-backend.onrender.com';

export default function AnaliseLarvas({ setAbaAtiva }) {
    const [amostrasAguardando, setAmostrasAguardando] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [amostraSelecionada, setAmostraSelecionada] = useState(null);

    // Estado do formulário de laudo técnico
    const [laudo, setLaudo] = useState({
        aegyptiLarvas: 0,
        aegyptiPupas: 0,
        albopictusLarvas: 0,
        albopictusPupas: 0,
        outrosEspecificar: '',
        resultadoFinal: 'POSITIVO',
        laboratorista: ''
    });

    // 🔄 Efeito para buscar as amostras assim que o componente é montado
    useEffect(() => {
        carregarAmostrasPendentes();
    }, []);

    // 🎯 FUNÇÃO AUXILIAR: Converte a matrícula para o Nome Real
    const obterNomeAgente = (matriculaOuTexto) => {
        if (!matriculaOuTexto || matriculaOuTexto === 'Não informado') {
            return 'Não informado';
        }

        const encontrado = listaAgentesOficiais.find(
            a => a.matricula == matriculaOuTexto || a.value == matriculaOuTexto
        );

        // Se achar o objeto, joga o Nome na tela. Se não achar, mantém o número da matrícula.
        return encontrado?.nome || encontrado?.label || matriculaOuTexto;
    };

    // 📥 Busca os tubos pendentes do backend e aplana a estrutura relacional do Java
    const carregarAmostrasPendentes = async () => {
        try {
            setCarregando(true);
            const response = await fetch(`${API_BASE_URL}/api/amostras/pendentes`);
            if (!response.ok) throw new Error('Falha ao obter dados do servidor da UVZ.');

            const dadosDoBanco = await response.json();

            // 🛠️ Mapeamento corrigido para refletir exatamente os atributos de Visita.java
            const amostrasFormatadas = dadosDoBanco.map(tubo => {
                // Monta uma string bonita para o imóvel juntando número e complemento (se houver)
                const numImovel = tubo.visita?.numero || "S/N";
                const compImovel = tubo.visita?.complemento ? ` (${tubo.visita.complemento})` : "";

                return {
                    id: tubo.id,
                    agente: tubo.visita?.titularMatricula || "Não informado", // 👈 Guarda a matrícula bruta vinda do banco
                    distrito: tubo.visita?.regional || "Não informado",       // 👈 Casado com regional
                    bairro: tubo.visita?.bairro || "Não informado",
                    rua: tubo.visita?.endereco || "Não informado",           // 👈 Casado com endereco
                    imovel: `${numImovel}${compImovel}`,                     // 👈 Concatenado número + comp.
                    tipoTrabalho: tubo.visita?.tipoBoletim || "Rotina (ACE)", // 👈 Casado com tipoBoletim
                    tipoDeposito: tubo.deposito,
                    dataColeta: tubo.visita?.dataVisita
                        ? new Date(tubo.visita.dataVisita).toLocaleDateString('pt-BR')
                        : "---"
                };
            });

            setAmostrasAguardando(amostrasFormatadas);
        } catch (error) {
            console.error("Erro na comunicação com a API:", error);
            setAmostrasAguardando([]);
        } finally {
            setCarregando(false);
        }
    };

    const handleInputChange = (field, val, isNumeric = true) => {
        const value = isNumeric ? (parseInt(val) || 0) : val;

        setLaudo(prev => {
            const novo = { ...prev, [field]: value };
            if (isNumeric) {
                const totalVetores = novo.aegyptiLarvas + novo.aegyptiPupas + novo.albopictusLarvas + novo.albopictusPupas;
                novo.resultadoFinal = totalVetores > 0 ? 'POSITIVO' : 'NEGATIVO';
            }
            return novo;
        });
    };

    // 💾 Persiste o laudo técnico preenchido no banco de dados via Spring Boot
    const salvarAnalise = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_BASE_URL}/api/amostras/${amostraSelecionada.id}/laudo`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(laudo),
            });

            if (response.ok) {
                alert(`Laudo da Amostra ${amostraSelecionada.id} saved com sucesso no sistema central da UVZ!`);

                // Remove localmente para sumir da listagem da bancada
                setAmostrasAguardando(prev => prev.filter(a => a.id !== amostraSelecionada.id));
                setAmostraSelecionada(null);

                // Reseta os campos do formulário para o próximo exame
                setLaudo({
                    aegyptiLarvas: 0,
                    aegyptiPupas: 0,
                    albopictusLarvas: 0,
                    albopictusPupas: 0,
                    outrosEspecificar: '',
                    resultadoFinal: 'POSITIVO',
                    laboratorista: ''
                });
            } else {
                alert('Erro ao processar e salvar o laudo no servidor.');
            }
        } catch (error) {
            console.error("Falha de rede ao enviar laudo:", error);
            alert('Não foi possível conectar ao servidor do Render. Verifique a API.');
        }
    };

    return (
        <div className="container-cadastro-user">
            {/* 🔬 Cabeçalho da Bancada */}
            <header className="pb-3 mb-4 border-bottom header-bancada">
                <h1 className="text-weight-semi-bold mb-1 titulo-laboratorio">
                    <i className="fas fa-vials mr-2" aria-hidden="true"></i> Laboratório de Entomologia — Vetores
                </h1>
                <p className="mb-0 text-muted">Recebimento, triagem e lançamento de exames microscópicos de amostras de larvas/pupas.</p>
            </header>

            {!amostraSelecionada ? (
                /* 📨 TELA 1: LISTAGEM DE NOTIFICAÇÕES RECEBIDAS DE CAMPO */
                <div>
                    <div className="br-card p-3 mb-3 card-alerta-notificacao">
                        <p className="mb-0 font-weight-bold">
                            <i className="fas fa-bell mr-2" aria-hidden="true"></i> Notificações de Campo: {amostrasAguardando.length} amostra(s) aguardando análise entomológica.
                        </p>
                    </div>

                    <div className="tabela-scroll-container">
                        <table className="tabela-tecnica">
                            <thead>
                                <tr>
                                    <th>Cód. Amostra</th>
                                    <th>Agente de Campo</th>
                                    <th>Distrito</th>
                                    <th>Tipo de Trabalho</th>
                                    <th>Data Coleta</th>
                                    <th className="txt-center">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {carregando ? (
                                    <tr>
                                        <td colSpan="6" className="txt-center py-4">
                                            <i className="fas fa-spinner fa-spin mr-2"></i> Conectando à bancada digital da UVZ...
                                        </td>
                                    </tr>
                                ) : amostrasAguardando.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="txt-center text-muted py-4">Nenhuma amostra pendente de análise no momento.</td>
                                    </tr>
                                ) : (
                                    amostrasAguardando.map((amostra) => (
                                        <tr key={amostra.id}>
                                            <td className="font-weight-bold id-amostra-destaque">{amostra.id}</td>

                                            {/* 🎯 TRADUÇÃO: Mostra o nome do agente por extenso na tabela */}
                                            <td>{obterNomeAgente(amostra.agente)}</td>

                                            <td>{amostra.distrito}</td>
                                            <td>{amostra.tipoTrabalho}</td>
                                            <td>{amostra.dataColeta}</td>
                                            <td className="txt-center">
                                                <button
                                                    className="br-button primary btn-tabela-analisar"
                                                    onClick={() => setAmostraSelecionada(amostra)}
                                                >
                                                    <i className="fas fa-microscope mr-1" aria-hidden="true"></i> Analisar Amostra
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* 🔬 TELA 2: FORMULÁRIO DE LAUDO DA AMOSTRA SELECIONADA */
                <div className="form-wrapper">
                    <button
                        className="toggle-avancado-btn mb-3 btn-voltar-painel"
                        onClick={() => setAmostraSelecionada(null)}
                    >
                        <i className="fas fa-arrow-left mr-2" aria-hidden="true"></i> Voltar para a lista de amostras
                    </button>

                    <div className="br-card p-3 mb-4 card-informacao-amostra">
                        <h4 className="text-primary mb-2">Amostra sob Análise: <strong>{amostraSelecionada.id}</strong></h4>

                        <div className="grid-info-amostra">
                            {/* 🎯 TRADUÇÃO: Mostra o nome do agente por extenso também na ficha detalhada */}
                            <div><strong>Coletado por:</strong> {obterNomeAgente(amostraSelecionada.agente)}</div>
                            <div><strong>Distrito:</strong> {amostraSelecionada.distrito}</div>
                            <div><strong>Bairro:</strong> {amostraSelecionada.bairro}</div>
                            <div><strong>Rua:</strong> {amostraSelecionada.rua}</div>
                            <div><strong>Imóvel:</strong> {amostraSelecionada.imovel}</div>
                            <div><strong>Tipo de Trabalho:</strong> {amostraSelecionada.tipoTrabalho}</div>
                            <div><strong>Tipo de Depósito:</strong> {amostraSelecionada.tipoDeposito}</div>
                        </div>
                    </div>

                    <form onSubmit={salvarAnalise} className="form-cadastro-equipe">
                        <div className="sessao-titulo mb-3">Discriminação de Espécies</div>

                        <div className="grid-form mb-4">
                            {/* Bloco Aedes Aegypti */}
                            <div className="form-group p-3 card-especie-grupo">
                                <h4 className="titulo-especie-aedes">Aedes aegypti</h4>
                                <label className="mt-2">Qtd. Larvas:</label>
                                <input type="number" min="0" className="br-input" value={laudo.aegyptiLarvas} onChange={(e) => handleInputChange('aegyptiLarvas', e.target.value)} />
                                <label className="mt-2">Qtd. Pupas:</label>
                                <input type="number" min="0" className="br-input" value={laudo.aegyptiPupas} onChange={(e) => handleInputChange('aegyptiPupas', e.target.value)} />
                            </div>

                            {/* Bloco Aedes Albopictus */}
                            <div className="form-group p-3 card-especie-grupo">
                                <h4 className="titulo-especie-aedes">Aedes albopictus</h4>
                                <label className="mt-2">Qtd. Larvas:</label>
                                <input type="number" min="0" className="br-input" value={laudo.albopictusLarvas} onChange={(e) => handleInputChange('albopictusLarvas', e.target.value)} />
                                <label className="mt-2">Qtd. Pupas:</label>
                                <input type="number" min="0" className="br-input" value={laudo.albopictusPupas} onChange={(e) => handleInputChange('albopictusPupas', e.target.value)} />
                            </div>

                            {/* Bloco Outros */}
                            <div className="form-group p-3 span-2 card-especie-grupo">
                                <h4 className="titulo-especie-outros">Outras Ocorrências</h4>
                                <div className="form-group mt-2">
                                    <label className="text-small d-block mb-1">Especificar achados microscópicos:</label>
                                    <input
                                        type="text"
                                        className="br-input"
                                        placeholder="Ex: Presença de larvas de Culex"
                                        value={laudo.outrosEspecificar}
                                        onChange={(e) => handleInputChange('outrosEspecificar', e.target.value, false)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* BLOCO DE FINALIZAÇÃO E ASSINATURA TÉCNICA */}
                        <div className="sessao-titulo mb-3">Encerramento do Laudo Técnico</div>
                        <div className="grid-form mb-4 generic-grid-2-cols">
                            <div className="form-group">
                                <label className="font-weight-bold">Laboratorista Responsável:</label>
                                {/* 🎯 CORREÇÃO: Tag corrigida para <input /> com fechamento perfeito */}
                                <input
                                    type="text"
                                    className="br-input"
                                    placeholder="Digite seu nome completo para assinatura"
                                    value={laudo.laboratorista}
                                    onChange={(e) => handleInputChange('laboratorista', e.target.value, false)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="font-weight-bold">Conclusão Analítica do Laudo:</label>
                                <select
                                    className={`br-select select-laudo-conclusao ${laudo.resultadoFinal === 'POSITIVO' ? 'is-positivo' : 'is-negativo'}`}
                                    value={laudo.resultadoFinal}
                                    onChange={(e) => handleInputChange('resultadoFinal', e.target.value, false)}
                                >
                                    <option value="POSITIVO">⚠️ LAUDO POSITIVO PARA VETORES</option>
                                    <option value="NEGATIVO">✅ AMOSTRA NEGATIVA</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-actions botoes-acoes-laudo">
                            <button type="submit" className="br-button primary block-mobile">
                                <i className="fas fa-check-circle mr-2" aria-hidden="true"></i> Finalizar e Emitir Laudo
                            </button>
                            <button type="button" className="br-button secondary block-mobile btn-cancelar-laudo" onClick={() => setAmostraSelecionada(null)}>
                                Cancelar
                            </button>
                        </div>

                        <div className="form-actions botoes-acoes-laudo">
                            <button type="submit" className="br-button primary block-mobile">
                                <i className="fas fa-check-circle mr-2" aria-hidden="true"></i> Finalizar e Emitir Laudo
                            </button>
                            <button type="button" className="br-button secondary block-mobile btn-cancelar-laudo" onClick={() => setAmostraSelecionada(null)}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}