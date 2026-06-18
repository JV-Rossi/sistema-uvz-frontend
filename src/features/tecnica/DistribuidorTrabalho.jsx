import React, { useState } from 'react';
import './DistribuidorTrabalho.css';

export default function DistribuidorTrabalho() {
    const [bairro, setBairro] = useState('');
    const [listaImoveis, setListaImoveis] = useState('');
    const [qtdAgentes, setQtdAgentes] = useState('');
    
    const [resultados, setResultados] = useState([]);
    const [resumo, setResumo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');

    const gerarEscalaAutomatica = async (e) => {
        e.preventDefault();
        setErro('');
        setLoading(true);

        if (!bairro.trim() || !listaImoveis || !qtdAgentes || parseInt(qtdAgentes) <= 0) {
            setErro("Por favor, preencha todos os campos corretamente.");
            setLoading(false);
            return;
        }

        const imoveisPorQuarteirao = listaImoveis
            .split(',')
            .map(n => parseInt(n.trim()))
            .filter(n => !isNaN(n));

        if (imoveisPorQuarteirao.length === 0) {
            setErro("Insira números válidos separados por vírgula para os imóveis.");
            setLoading(false);
            return;
        }

        const totalImoveis = imoveisPorQuarteirao.reduce((a, b) => a + b, 0);
        const metaPorAgente = totalImoveis / parseInt(qtdAgentes);

        setResumo({
            totalQ: imoveisPorQuarteirao.length,
            totalI: totalImoveis,
            mediaIdeal: metaPorAgente.toFixed(1)
        });

        try {
            // Se estiver em produção, altere para a URL do seu Render
            const API_URL = "https://sistema-uvz-backend.onrender.com/api/mutiroes/distribuir"; 
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bairro: bairro,
                    imoveisPorQuarteirao: imoveisPorQuarteirao,
                    quantidadeAgentes: parseInt(qtdAgentes)
                })
            });

            if (!response.ok) throw new Error("Erro ao processar a distribuição no servidor.");

            const dadosSalvos = await response.json();
            setResultados(dadosSalvos);

        } catch (err) {
            setErro(err.message || "Não foi possível conectar ao servidor backend.");
            setResumo(null);
        } finally {
            setLoading(false);
        }
    };

    const limparCalculadora = () => {
        setBairro('');
        setListaImoveis('');
        setQtdAgentes('');
        setResultados([]);
        setResumo(null);
        setErro('');
    };

    return (
        <main className="distribuidor-content">
            <section className="distribuidor-view">
                <header className="distribuidor-header">
                    <h1>Distribuidor de Trabalho</h1>
                    <p>Gere escalas equilibradas agrupando quarteirões inteiros por média de produtividade.</p>
                </header>

                <div className="layout-split">
                    {/* formulário principal (painel escuro) */}
                    <form onSubmit={gerarEscalaAutomatica} className="panel-dark-form">
                        
                        <div className="form-section">
                            <h4>Configuração da Área de Trabalho</h4>
                            <hr className="divider" />
                            
                            <div className="input-field-group">
                                <label>Nome do Bairro / Localidade do Mutirão</label>
                                <input 
                                    type="text" 
                                    value={bairro}
                                    onChange={(e) => setBairro(e.target.value)}
                                    placeholder="Ex: CPA IV, Dom Aquino, Centro"
                                />
                            </div>

                            <div className="input-field-group">
                                <label>Nº de Imóveis por Quarteirão (Separe por vírgula: Q1, Q2...)</label>
                                <input 
                                    type="text" 
                                    value={listaImoveis}
                                    onChange={(e) => setListaImoveis(e.target.value)}
                                    placeholder="Ex: 25, 30, 15, 40, 22"
                                />
                            </div>
                        </div>

                        <div className="form-section">
                            <h4>Alocação Inteligente de Agentes</h4>
                            <hr className="divider" />

                            <div className="input-field-group">
                                <label>Quantidade de Agentes Disponíveis para o Mutirão</label>
                                <input 
                                    type="number" 
                                    value={qtdAgentes}
                                    onChange={(e) => setQtdAgentes(e.target.value)}
                                    placeholder="Ex: 10"
                                />
                            </div>
                        </div>

                        {erro && <p className="calc-error-msg">⚠️ {erro}</p>}

                        <button type="submit" className="btn-submit-vibrant" disabled={loading}>
                            {loading ? "Processando Escala..." : "Gerar Divisão por Equipes"}
                        </button>
                    </form>

                    {/* painel de resultados (aparece acoplado na direita ou abaixo) */}
                    {resumo && (
                        <div className="panel-dark-results">
                            <div className="stats-badge-container">
                                <div className="stat-card">
                                    <span className="stat-label">📍 Bairro</span>
                                    <span className="stat-value highlight-text">{bairro}</span>
                                </div>
                                <div className="stat-grid-mini">
                                    <div className="stat-subcard">
                                        <span>Total Q: <strong>{resumo.totalQ}</strong></span>
                                    </div>
                                    <div className="stat-subcard">
                                        <span>Total Imóveis: <strong>{resumo.totalI}</strong></span>
                                    </div>
                                </div>
                                <div className="stat-card border-top-green">
                                    <span className="stat-label">📊 Meta Ideal</span>
                                    <span className="stat-value green-neon">{resumo.mediaIdeal} <small>imóveis/agente</small></span>
                                </div>
                            </div>

                            <h3>Sugestão de Distribuição por Equipes</h3>
                            <table className="tabela-dengue-dark">
                                <thead>
                                    <tr>
                                        <th>Equipe</th>
                                        <th>Quarteirões</th>
                                        <th>Total Imóveis</th>
                                        <th>Qtd. Agentes</th>
                                        <th>Média Real</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultados.map((item) => (
                                        <tr key={item.equipe}>
                                            <td>Equipe {item.equipe}</td>
                                            <td className="text-dimmed">{item.quarteiroes}</td>
                                            <td>{item.totalImoveis}</td>
                                            <td><span className="agent-count-pill">{item.qtdAgentes}</span></td>
                                            <td className="green-neon-soft">{item.mediaReal}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="panel-actions-row">
                                <button onClick={limparCalculadora} className="btn-action-grey">
                                    🧹 Limpar Simulação
                                </button>
                                <button onClick={() => window.print()} className="btn-action-print">
                                    🖨️ Imprimir Escala
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}