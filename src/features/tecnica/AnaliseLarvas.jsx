import React, { useState } from 'react';

export default function AnaliseLarvas() {
    // Dados mocados simulando o que veio dos agentes de campo via API
    const [tubitosAguardando, setTubitosAguardando] = useState([
        { id: "TUB-2026-001", agente: "Carlos Silva", bairro: "CPA IV", quarteirao: "12A", dataColeta: "02/07/2026", imovel: "Nº 142" },
        { id: "TUB-2026-002", agente: "Ana Maria", bairro: "Alvorada", quarteirao: "05", dataColeta: "03/07/2026", imovel: "Nº 88 (Oficina)" },
        { id: "TUB-2026-003", agente: "Carlos Silva", bairro: "CPA IV", quarteirao: "14", dataColeta: "03/07/2026", imovel: "Nº 19" }
    ]);

    const [tubitoSelecionado, setTubitoSelecionado] = useState(null);

    // Estado do formulário de análise técnica laboratorial
    const [laudo, setLaudo] = useState({
        aegyptiLarvas: 0,
        aegyptiPupas: 0,
        albopictusLarvas: 0,
        albopictusPupas: 0,
        outrosLarvas: 0,
        outrosPupas: 0,
        resultadoFinal: 'POSITIVO' // POSITIVO / NEGATIVO
    });

    const handleInputChange = (field, val) => {
        const num = parseInt(val) || 0;
        setLaudo(prev => {
            const novo = { ...prev, [field]: num };
            // Lógica inteligente: se somar qualquer vetor de vetor biológico > 0, vira POSITIVO automaticamente
            const totalVetores = novo.aegyptiLarvas + novo.aegyptiPupas + novo.albopictusLarvas + novo.albopictusPupas + novo.outrosLarvas + novo.outrosPupas;
            novo.resultadoFinal = totalVetores > 0 ? 'POSITIVO' : 'NEGATIVO';
            return novo;
        });
    };

    const salvarAnalise = (e) => {
        e.preventDefault();
        alert(`Laudo do Tubito ${tubitoSelecionado.id} salvo com sucesso no banco de dados da UVZ!`);
        // Remove da lista de pendências local após processado
        setTubitosAguardando(prev => prev.filter(t => t.id !== tubitoSelecionado.id));
        setTubitoSelecionado(null);
    };

    return (
        <div className="container-cadastro-user">
            {/* 🔬 Cabeçalho da Bancada */}
            <header className="pb-3 mb-4 border-bottom">
                <h1 className="text-weight-semi-bold mb-1" style={{ color: '#1351B4' }}>
                    <i className="fas fa-vials mr-2"></i> Laboratório de Entomologia — Vetores
                </h1>
                <p className="mb-0 text-muted">Recebimento, triagem e lançamento de exames microscópicos de amostras de larvas/pupas.</p>
            </header>

            {!tubitoSelecionado ? (
                /* 📨 TELA 1: LISTAGEM DE NOTIFICAÇÕES RECEBIDAS DE CAMPO */
                <div>
                    <div className="br-card p-3 mb-3" style={{ backgroundColor: '#F4F8FB', borderLeft: '4px solid #1351B4' }}>
                        <p className="mb-0 font-weight-bold" style={{ color: '#1351B4' }}>
                            <i className="fas fa-bell mr-2"></i> Notificações de Campo: {tubitosAguardando.length} tubito(s) aguardando análise entomológica.
                        </p>
                    </div>

                    <div className="tabela-scroll-container">
                        <table className="tabela-tecnica">
                            <thead>
                                <tr>
                                    <th>Cód. Tubito</th>
                                    <th>Agente de Campo</th>
                                    <th>Localidade / Bairro</th>
                                    <th>Imóvel / Quadra</th>
                                    <th>Data Coleta</th>
                                    <th className="txt-center">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tubitosAguardando.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="txt-center text-muted py-4">Nenhum tubito pendente de análise no momento.</td>
                                    </tr>
                                ) : (
                                    tubitosAguardando.map((tubito) => (
                                        <tr key={tubito.id}>
                                            <td className="font-weight-bold" style={{ color: '#1351B4' }}>{tubito.id}</td>
                                            <td>{tubito.agente}</td>
                                            <td>{tubito.bairro}</td>
                                            <td>{tubito.imovel} (Qdr. {tubito.quarteirao})</td>
                                            <td>{tubito.dataColeta}</td>
                                            <td className="txt-center">
                                                <button 
                                                    className="br-button primary" 
                                                    style={{ borderRadius: '4px', padding: '6px 12px', fontSize: '13px' }}
                                                    onClick={() => setTubitoSelecionado(tubito)}
                                                >
                                                    <i className="fas fa-microscope mr-1"></i> Analisar Amostra
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
                /* 🔬 TELA 2: FORMULÁRIO DE LAUDO DO TUBITO SELECIONADO */
                <div className="form-wrapper">
                    <button 
                        className="toggle-avancado-btn mb-3" 
                        onClick={() => setTubitoSelecionado(null)}
                        style={{ border: 'none', background: 'none', color: '#1351B4', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        <i className="fas fa-arrow-left mr-2"></i> Voltar para a lista de tubitos
                    </button>

                    <div className="br-card p-3 mb-4" style={{ backgroundColor: '#F8F9FA', border: '1px solid #CCCCCC' }}>
                        <h4 className="text-primary mb-2">Amostra sob Análise: <strong>{tubitoSelecionado.id}</strong></h4>
                        <div className="grid-form" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', fontSize: '14px' }}>
                            <div><strong>Coletado por:</strong> {tubitoSelecionado.agente}</div>
                            <div><strong>Localização:</strong> {tubitoSelecionado.bairro}</div>
                            <div><strong>Ponto:</strong> {tubitoSelecionado.imovel} (Q. {tubitoSelecionado.quarteirao})</div>
                        </div>
                    </div>

                    <form onSubmit={salvarAnalise} className="form-cadastro-equipe">
                        <div className="sessao-titulo mb-3">Discriminação de Espécies (Contagem Microscópica)</div>
                        
                        <div className="grid-form mb-4">
                            {/* Bloco Aedes Aegypti */}
                            <div className="form-group p-3" style={{ border: '1px solid #CCCCCC', borderRadius: '4px', backgroundColor: '#FAFAFA' }}>
                                <h4 style={{ color: '#0C326F', borderBottom: '2px solid #1351B4', paddingBottom: '4px' }}>Aedes aegypti</h4>
                                <label className="mt-2">Qtd. Larvas:</label>
                                <input type="number" min="0" className="br-input" value={laudo.aegyptiLarvas} onChange={(e) => handleInputChange('aegyptiLarvas', e.target.value)} />
                                <label className="mt-2">Qtd. Pupas:</label>
                                <input type="number" min="0" className="br-input" value={laudo.aegyptiPupas} onChange={(e) => handleInputChange('aegyptiPupas', e.target.value)} />
                            </div>

                            {/* Bloco Aedes Albopictus */}
                            <div className="form-group p-3" style={{ border: '1px solid #CCCCCC', borderRadius: '4px', backgroundColor: '#FAFAFA' }}>
                                <h4 style={{ color: '#0C326F', borderBottom: '2px solid #1351B4', paddingBottom: '4px' }}>Aedes albopictus</h4>
                                <label className="mt-2">Qtd. Larvas:</label>
                                <input type="number" min="0" className="br-input" value={laudo.albopictusLarvas} onChange={(e) => handleInputChange('albopictusLarvas', e.target.value)} />
                                <label className="mt-2">Qtd. Pupas:</label>
                                <input type="number" min="0" className="br-input" value={laudo.albopictusPupas} onChange={(e) => handleInputChange('albopictusPupas', e.target.value)} />
                            </div>

                            {/* Bloco Outros */}
                            <div className="form-group p-3" style={{ border: '1px solid #CCCCCC', borderRadius: '4px', backgroundColor: '#FAFAFA' }} className="span-2">
                                <h4 style={{ color: '#555555', borderBottom: '2px solid #888888', paddingBottom: '4px' }}>Outras Espécies (Culex / etc)</h4>
                                <div className="grid-form">
                                    <div className="form-group">
                                        <label>Qtd. Larvas:</label>
                                        <input type="number" min="0" className="br-input" value={laudo.outrosLarvas} onChange={(e) => handleInputChange('outrosLarvas', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Qtd. Pupas:</label>
                                        <input type="number" min="0" className="br-input" value={laudo.outrosPupas} onChange={(e) => handleInputChange('outrosPupas', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Resultado Final Consolidado */}
                        <div className="form-group mb-4">
                            <label className="font-weight-bold">Conclusão Analítica do Laudo:</label>
                            <select 
                                className="br-select" 
                                value={laudo.resultadoFinal} 
                                onChange={(e) => setLaudo(prev => ({ ...prev, resultadoFinal: e.target.value }))}
                                style={{
                                    backgroundColor: laudo.resultadoFinal === 'POSITIVO' ? '#FFF3E0' : '#E3F2FD',
                                    color: laudo.resultadoFinal === 'POSITIVO' ? '#E65100' : '#1351B4',
                                    fontWeight: 'bold',
                                    border: laudo.resultadoFinal === 'POSITIVO' ? '2px solid #FFCC80' : '2px solid #85B4F2'
                                }}
                            >
                                <option value="POSITIVO">⚠️ AMBOSTRE/LAUDO POSITIVO PARA VETORES</option>
                                <option value="NEGATIVO">✅ AMOSTRA NEGATIVA (SEM FOCO VIVO)</option>
                            </select>
                        </div>

                        <div className="form-actions" style={{ display: 'flex', gap: '12px' }}>
                            <button type="submit" className="br-button primary block-mobile">
                                <i className="fas fa-check-circle mr-2"></i> Finalizar e Emitir Laudo
                            </button>
                            <button type="button" className="br-button secondary block-mobile" onClick={() => setTubitoSelecionado(null)} style={{ backgroundColor: '#fff', color: '#333', border: '1px solid #888' }}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}