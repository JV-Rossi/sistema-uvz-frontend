import React, { useState } from 'react';
import './DistribuidorTrabalho.css';

export default function DistribuidorTrabalho() {
    // Estados do Formulário
    const [bairro, setBairro] = useState('');
    const [listaImoveis, setListaImoveis] = useState('');
    const [qtdAgentes, setQtdAgentes] = useState('');
    
    // Estados de Controle da API e Resultados
    const [resultados, setResultados] = useState([]);
    const [resumo, setResumo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');

    const gerarEscalaAutomatica = async (e) => {
        e.preventDefault();
        setErro('');
        setLoading(true);

        // 1. Validação e Tratamento dos Dados (Igual ao seu JS antigo)
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

        // Guardar o resumo estatístico para exibir na tela
        setResumo({
            totalQ: imoveisPorQuarteirao.length,
            totalI: totalImoveis,
            mediaIdeal: metaPorAgente.toFixed(1)
        });

        // 2. Integração com o seu Backend Java Spring Boot
        try {
            // Ajuste a URL abaixo para o link do seu Render em produção se necessário
            const API_URL = "http://localhost:8080/api/mutiroes/distribuir"; 
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bairro: bairro,
                    imoveisPorQuarteirao: imoveisPorQuarteirao,
                    quantidadeAgentes: parseInt(qtdAgentes)
                })
            });

            if (!response.ok) {
                throw new Error("Erro ao processar a distribuição no servidor.");
            }

            const dadosSalvos = await response.json();
            setResultados(dadosSalvos); // Preenche a tabela com o retorno do Java

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

    const imprimirEscala = () => {
        window.print(); // Dispara o print do sistema usando seu CSS de impressão
    };

    return (
        <main className="content">
            <section className="view">
                <header>
                    <h1>Distribuidor de Trabalho</h1>
                    <p>Gere escalas equilibradas salvando automaticamente no histórico da CVSA.</p>
                </header>

                {/* Formulário de Configuração do Mutirão */}
                <form onSubmit={gerarEscalaAutomatica} className="form-panel">
                    <h3>Calculadora de Escala Inteligente</h3>
                    
                    <div className="input-group" style={{ marginBottom: '15px' }}>
                        <label>Nome do Bairro / Localidade do Mutirão</label>
                        <input 
                            type="text" 
                            value={bairro}
                            onChange={(e) => setBairro(e.target.value)}
                            placeholder="Ex: CPA IV, Dom Aquino, Centro"
                        />
                    </div>

                    <div className="input-group" style={{ marginBottom: '15px' }}>
                        <label>Nº de Imóveis por Quarteirão (Separe por vírgula na ordem: Q1, Q2, Q3...)</label>
                        <input 
                            type="text" 
                            value={listaImoveis}
                            onChange={(e) => setListaImoveis(e.target.value)}
                            placeholder="Ex: 25, 30, 15, 40, 22, 18, 35"
                        />
                    </div>

                    <div className="input-group" style={{ marginBottom: '20px' }}>
                        <label>Quantidade de Agentes Disponíveis</label>
                        <input 
                            type="number" 
                            value={qtdAgentes}
                            onChange={(e) => setQtdAgentes(e.target.value)}
                            placeholder="Ex: 10"
                        />
                    </div>

                    {erro && <p className="error-message" style={{ color: '#d32f2f', fontWeight: 'bold', fontSize: '14px' }}>⚠️ {erro}</p>}

                    <button type="submit" className="btn-add" disabled={loading}>
                        {loading ? "Calculando e Salvando..." : "Gerar Divisão por Equipes"}
                    </button>
                </form>

                {/* Painel de Resultados (Só aparece se houver resumo calculado) */}
                {resumo && (
                    <div className="table-panel">
                        <div className="resumo-calculo">
                            <p>📍 <strong>Bairro Selecionado:</strong> <span style={{ textTransform: 'uppercase' }}>{bairro}</span></p>
                            <p>🗺️ <strong>Total de Quarteirões:</strong> {resumo.totalQ}</p>
                            <p>🏠 <strong>Total de Imóveis:</strong> {resumo.totalI}</p>
                            <p>📊 <strong>Meta de Trabalho:</strong> <span className="highlight-verde">{resumo.mediaIdeal}</span> imóveis por agente</p>
                        </div>

                        <h3>Sugestão de Distribuição por Equipes</h3>
                        <table className="tabela-dengue">
                            <thead>
                                <tr className="sub-header">
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
                                        <td>{item.quarteiroes}</td>
                                        <td>{item.totalImoveis}</td>
                                        <td><strong>{item.qtdAgentes}</strong></td>
                                        <td>{item.mediaReal}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="action-buttons" style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
                            <button onClick={limparCalculadora} className="btn-limpar">
                                🧹 Limpar Simulação
                            </button>
                            <button onClick={imprimirEscala} className="btn-pdf">
                                🖨️ Imprimir Escala / Salvar PDF
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
}