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
            setErro("Por favor, preencha todos os campos obrigatórios corretamente.");
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
            // URL do Backend
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
            
            <header className="pb-3 mb-4 border-bottom">
                <h1 className="text-weight-semi-bold mb-1" style={{ color: '#1351B4' }}>
                    <i className="fas fa-map-marked-alt mr-2" aria-hidden="true"></i>
                    Distribuição de Mutirão
                </h1>
                <p className="mb-0" style={{ color: '#555' }}>
                    Gere escalas equilibradas agrupando quarteirões inteiros por média de produtividade.
                </p>
            </header>

            <div className="layout-split">
                
                {/* 📝 FORMULÁRIO PRINCIPAL */}
                <form onSubmit={gerarEscalaAutomatica} className="br-card p-4 mb-4">
                    
                    <h3 className="sessao-titulo text-weight-semi-bold mt-0 mb-4">Configuração da Área de Trabalho</h3>
                    
                    <div className="grid-form mb-4">
                        <div className="form-group span-2">
                            <label htmlFor="bairro">Nome do Bairro / Localidade <span className="text-danger">*</span></label>
                            <input 
                                id="bairro"
                                className="br-input"
                                type="text" 
                                value={bairro}
                                onChange={(e) => setBairro(e.target.value)}
                                placeholder="Ex: CPA IV, Dom Aquino, Centro"
                            />
                        </div>

                        <div className="form-group span-2">
                            <label htmlFor="listaImoveis">Nº de Imóveis por Quarteirão (Separe por vírgula) <span className="text-danger">*</span></label>
                            <input 
                                id="listaImoveis"
                                className="br-input"
                                type="text" 
                                value={listaImoveis}
                                onChange={(e) => setListaImoveis(e.target.value)}
                                placeholder="Ex: 25, 30, 15, 40, 22"
                            />
                            <span className="text-small text-muted mt-1">Exemplo: Se o quarteirão 1 tem 25 imóveis e o quarteirão 2 tem 30, digite "25, 30".</span>
                        </div>
                    </div>

                    <hr className="divisor-form" />

                    <h3 className="sessao-titulo text-weight-semi-bold mb-4">Alocação de Equipe</h3>

                    <div className="grid-form">
                        <div className="form-group span-2">
                            <label htmlFor="qtdAgentes">Quantidade de Agentes Disponíveis <span className="text-danger">*</span></label>
                            <input 
                                id="qtdAgentes"
                                className="br-input"
                                type="number" 
                                min="1"
                                value={qtdAgentes}
                                onChange={(e) => setQtdAgentes(e.target.value)}
                                placeholder="Ex: 10"
                            />
                        </div>
                    </div>

                    {/* Alerta de Erro Padrão GovBR */}
                    {erro && (
                        <div className="br-message is-danger mt-4" role="alert">
                            <div className="icon">
                                <i className="fas fa-times-circle fa-lg" aria-hidden="true"></i>
                            </div>
                            <div className="content" aria-label="Erro.">
                                <span className="message-title text-weight-semi-bold">Atenção:</span>
                                <span className="message-body"> {erro}</span>
                            </div>
                        </div>
                    )}

                    <div className="mt-4 pt-3 border-top">
                        <button type="submit" className="br-button primary block-mobile" disabled={loading}>
                            {loading ? (
                                <><i className="fas fa-spinner fa-spin mr-2" aria-hidden="true"></i> Processando Escala...</>
                            ) : (
                                <><i className="fas fa-calculator mr-2" aria-hidden="true"></i> Gerar Divisão por Equipes</>
                            )}
                        </button>
                    </div>
                </form>

                {/* 📊 PAINEL DE RESULTADOS */}
                {resumo && (
                    <div className="br-card p-4 mt-4 bg-light-blue">
                        <h3 className="text-weight-semi-bold mb-4 text-primary">
                            <i className="fas fa-clipboard-check mr-2" aria-hidden="true"></i> 
                            Resumo do Mutirão: {bairro}
                        </h3>

                        <div className="stats-grid mb-4">
                            <div className="stat-box br-card p-3 text-center">
                                <span className="d-block text-small text-muted text-weight-semi-bold text-uppercase">Quarteirões</span>
                                <span className="d-block text-large text-primary text-weight-bold">{resumo.totalQ}</span>
                            </div>
                            <div className="stat-box br-card p-3 text-center">
                                <span className="d-block text-small text-muted text-weight-semi-bold text-uppercase">Total de Imóveis</span>
                                <span className="d-block text-large text-primary text-weight-bold">{resumo.totalI}</span>
                            </div>
                            <div className="stat-box br-card p-3 text-center border-success">
                                <span className="d-block text-small text-success text-weight-semi-bold text-uppercase">Meta por Agente</span>
                                <span className="d-block text-large text-success text-weight-bold">{resumo.mediaIdeal}</span>
                            </div>
                        </div>

                        <h4 className="text-weight-semi-bold mb-3">Sugestão de Distribuição</h4>
                        
                        <div className="table-responsive">
                            <table className="tabela-tecnica-dt">
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
                                            <td className="text-weight-semi-bold">Equipe {item.equipe}</td>
                                            <td className="text-muted">{item.quarteiroes}</td>
                                            <td>{item.totalImoveis}</td>
                                            <td><span className="br-tag bg-primary text-white">{item.qtdAgentes}</span></td>
                                            <td className="text-success text-weight-semi-bold">{item.mediaReal}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="form-actions mt-4 pt-3 border-top d-flex gap-3">
                            <button onClick={() => window.print()} className="br-button primary">
                                <i className="fas fa-print mr-2" aria-hidden="true"></i> Imprimir Escala
                            </button>
                            <button onClick={limparCalculadora} className="br-button secondary">
                                <i className="fas fa-eraser mr-2" aria-hidden="true"></i> Limpar Simulação
                            </button>
                        </div>
                    </div>
                )}
                
            </div>
        </main>
    );
}