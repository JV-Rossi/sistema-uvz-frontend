import React, { useState } from 'react';
import './AnaliseLarvas.css';

export default function AnaliseLarvas({ setAbaAtiva }) {
    // 📝 Dados mocados atualizados com Bairro e Tipo de Depósito
    const [amostrasAguardando, setAmostrasAguardando] = useState([
        { id: "AMO-2026-089", agente: "Carlos Silva", distrito: "Norte", bairro: "CPA I", tipoTrabalho: "LIRAa", tipoDeposito: "A2", dataColeta: "02/07/2026" },
        { id: "AMO-2026-090", agente: "Ana Maria", distrito: "Leste", bairro: "Pedra 90", tipoTrabalho: "P.E. (Ponto Estratégico)", tipoDeposito: "B", dataColeta: "03/07/2026" },
        { id: "AMO-2026-091", agente: "Carlos Silva", distrito: "Oeste", bairro: "Goiabeiras", tipoTrabalho: "Rotina (ACE)", tipoDeposito: "D1", dataColeta: "03/07/2026" }
    ]);

    const [amostraSelecionada, setAmostraSelecionada] = useState(null);

    // Estado do formulário adaptado com outrosEspecificar como string
    const [laudo, setLaudo] = useState({
        aegyptiLarvas: 0,
        aegyptiPupas: 0,
        albopictusLarvas: 0,
        albopictusPupas: 0,
        outrosEspecificar: '', // Alterado para campo de texto livre
        resultadoFinal: 'POSITIVO',
        laboratorista: ''
    });

    const handleInputChange = (field, val, isNumeric = true) => {
        const value = isNumeric ? (parseInt(val) || 0) : val;

        setLaudo(prev => {
            const novo = { ...prev, [field]: value };

            // O cálculo automático de positividade agora foca estritamente nos vetores alvo
            if (isNumeric) {
                const totalVetores = novo.aegyptiLarvas + novo.aegyptiPupas + novo.albopictusLarvas + novo.albopictusPupas;
                novo.resultadoFinal = totalVetores > 0 ? 'POSITIVO' : 'NEGATIVO';
            }
            return novo;
        });
    };

    const salvarAnalise = (e) => {
        e.preventDefault();
        alert(`Laudo da Amostra ${amostraSelecionada.id} salvo com sucesso no sistema da UVZ!`);
        setAmostrasAguardando(prev => prev.filter(a => a.id !== amostraSelecionada.id));
        setAmostraSelecionada(null);

        // Limpa o formulário para a próxima triagem
        setLaudo({
            aegyptiLarvas: 0,
            aegyptiPupas: 0,
            albopictusLarvas: 0,
            albopictusPupas: 0,
            outrosEspecificar: '',
            resultadoFinal: 'POSITIVO',
            laboratorista: ''
        });
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
                                {amostrasAguardando.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="txt-center text-muted py-4">Nenhuma amostra pendente de análise no momento.</td>
                                    </tr>
                                ) : (
                                    amostrasAguardando.map((amostra) => (
                                        <tr key={amostra.id}>
                                            <td className="font-weight-bold id-amostra-destaque">{amostra.id}</td>
                                            <td>{amostra.agente}</td>
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
                            <div><strong>Coletado por:</strong> {amostraSelecionada.agente}</div>
                            <div><strong>Distrito:</strong> {amostraSelecionada.distrito}</div>
                            <div><strong>Bairro:</strong> {amostraSelecionada.bairro}</div>
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
                                    <label className="text-small d-block mb-1">Especificar:</label>
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
                    </form>
                </div>
            )}
        </div>
    );
}