import React, { useState, useEffect } from 'react';
import './DistribuidorTrabalho.css';

// Import corrigido para evitar o erro do Vite
import { tabelaBairros } from '../../shared/utils/dadosBairros';

export default function DistribuidorTrabalho() {
    // Estados do Formulário
    const [regional, setRegional] = useState('');
    const [bairro, setBairro] = useState('');
    const [listaImoveis, setListaImoveis] = useState('');
    const [qtdAgentes, setQtdAgentes] = useState('');

    // Estados de Dados do Banco e UI
    const [bairrosFiltrados, setBairrosFiltrados] = useState([]);
    const [agentesDisponiveis, setAgentesDisponiveis] = useState([]);

    // Estado para guardar os agentes selecionados { '1': ['João', 'Maria'], '2': ['Pedro'] }
    const [selecaoAgentes, setSelecaoAgentes] = useState({});
    // Estado para controlar o que está sendo digitado na busca de cada equipe { '1': 'joa', '2': '' }
    const [buscas, setBuscas] = useState({});

    // Estados de Processamento
    const [resultados, setResultados] = useState([]);
    const [resumo, setResumo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');

    // EFEITO: Quando a Regional muda, filtramos os bairros e buscamos os agentes
    useEffect(() => {
        if (!regional) {
            setBairrosFiltrados([]);
            setAgentesDisponiveis([]);
            return;
        }

        const filtrados = tabelaBairros.filter(b => b.regional === regional);
        setBairrosFiltrados(filtrados);

        const buscarAgentesDaRegional = async () => {
            try {
                const API_USUARIOS_URL = `https://sistema-uvz-backend.onrender.com/api/usuarios?perfil=agente_campo&regional=${regional}`;
                const response = await fetch(API_USUARIOS_URL);
                if (!response.ok) throw new Error("Erro ao buscar agentes da regional.");

                const dados = await response.json();
                setAgentesDisponiveis(dados);
            } catch (err) {
                console.error(err);
            }
        };

        buscarAgentesDaRegional();
    }, [regional]);

    const gerarEscalaAutomatica = async (e) => {
        e.preventDefault();
        setErro('');
        setLoading(true);

        if (!regional || !bairro || !listaImoveis || !qtdAgentes || parseInt(qtdAgentes) <= 0) {
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
            setSelecaoAgentes({});
            setBuscas({});

        } catch (err) {
            setErro(err.message || "Não foi possível conectar ao servidor backend.");
            setResumo(null);
        } finally {
            setLoading(false);
        }
    };

    // --- FUNÇÕES DE SELEÇÃO DE AGENTES ---
    const agentesAlocados = Object.values(selecaoAgentes).flat();
    const agentesLivres = agentesDisponiveis.filter(agente => !agentesAlocados.includes(agente.nome));

    const adicionarAgente = (equipe, nomeAgente) => {
        setSelecaoAgentes(prev => {
            const atuais = prev[equipe] || [];
            if (atuais.includes(nomeAgente)) return prev;
            return { ...prev, [equipe]: [...atuais, nomeAgente] };
        });
    };

    const removerAgente = (equipe, nomeAgente) => {
        setSelecaoAgentes(prev => {
            const atuais = prev[equipe] || [];
            return { ...prev, [equipe]: atuais.filter(n => n !== nomeAgente) };
        });
    };

    const handleBuscaChange = (equipe, valor) => {
        setBuscas(prev => ({ ...prev, [equipe]: valor }));
    };

    const limparCalculadora = () => {
        setRegional('');
        setBairro('');
        setListaImoveis('');
        setQtdAgentes('');
        setResultados([]);
        setResumo(null);
        setErro('');
        setSelecaoAgentes({});
        setBuscas({});
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

            <div className="layout-full-width">

                {/* 📝 FORMULÁRIO PRINCIPAL */}
                <form onSubmit={gerarEscalaAutomatica} className="br-card p-4 mb-4">
                    <h3 className="sessao-titulo text-weight-semi-bold mt-0 mb-4">Configuração da Área de Trabalho</h3>

                    <div className="grid-form mb-4">
                        <div className="form-group span-1">
                            <label htmlFor="regional">Regional <span className="text-danger">*</span></label>
                            <select
                                id="regional"
                                className="br-select"
                                value={regional}
                                onChange={(e) => {
                                    setRegional(e.target.value);
                                    setBairro('');
                                }}
                            >
                                <option value="">Selecione...</option>
                                <option value="Norte">Norte</option>
                                <option value="Leste">Leste</option>
                                <option value="Sul">Sul</option>
                                <option value="Oeste">Oeste</option>
                            </select>
                        </div>

                        <div className="form-group span-1">
                            <label htmlFor="bairro">Bairro / Localidade <span className="text-danger">*</span></label>
                            <select
                                id="bairro"
                                className="br-select"
                                value={bairro}
                                onChange={(e) => setBairro(e.target.value)}
                                disabled={!regional}
                            >
                                <option value="">{regional ? "Selecione o Bairro..." : "Selecione uma Regional primeiro"}</option>
                                {bairrosFiltrados.map((item, index) => (
                                    <option key={index} value={item.nome}>{item.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group span-2 mt-3">
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
                            <label htmlFor="qtdAgentes">Quantidade de Agentes Disponíveis na Ação <span className="text-danger">*</span></label>
                            <input
                                id="qtdAgentes"
                                className="br-input"
                                type="number"
                                min="1"
                                value={qtdAgentes}
                                onChange={(e) => setQtdAgentes(e.target.value)}
                                placeholder="Ex: 15"
                            />
                            {agentesDisponiveis.length > 0 && (
                                <span className="text-small text-info mt-2 d-block">
                                    <i className="fas fa-info-circle mr-1"></i>
                                    Temos <strong>{agentesDisponiveis.length}</strong> agentes cadastrados na Regional {regional}.
                                </span>
                            )}
                        </div>
                    </div>

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

                    <div className="mt-4 pt-3 border-top d-flex gap-3">
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
                    <div className="br-card p-4 mt-4 bg-light-blue" style={{ width: '100%' }}>
                        <h3 className="text-weight-semi-bold mb-4 text-primary">
                            <i className="fas fa-clipboard-check mr-2" aria-hidden="true"></i>
                            Resumo do Mutirão: {bairro} ({regional})
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

                        <h4 className="text-weight-semi-bold mb-3">Montagem das Equipes</h4>

                        <div className="table-responsive">
                            <table className="tabela-tecnica-dt" style={{ width: '100%', backgroundColor: '#fff' }}>
                                <thead>
                                    <tr>
                                        <th style={{ width: '10%' }}>Equipe</th>
                                        <th style={{ width: '15%' }}>Quarteirões</th>
                                        <th style={{ width: '10%' }}>Total Imóveis</th>
                                        <th style={{ width: '10%' }}>Meta (Qtd)</th>
                                        {/* A classe ocultar-na-impressao entra aqui */}
                                        <th className="ocultar-na-impressao" style={{ width: '10%' }}>Média Real</th>
                                        <th style={{ width: '45%' }}>Seleção de Agentes (Busca)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultados.map((item) => {
                                        const termoBusca = buscas[item.equipe] || '';
                                        const filtrados = agentesLivres.filter(a => a.nome.toLowerCase().includes(termoBusca.toLowerCase()));

                                        return (
                                            <tr key={item.equipe}>
                                                <td className="text-weight-semi-bold" style={{ verticalAlign: 'top' }}>
                                                    Equipe {item.equipe}
                                                </td>
                                                <td className="text-muted" style={{ verticalAlign: 'top' }}>{item.quarteiroes}</td>
                                                <td style={{ verticalAlign: 'top' }}>{item.totalImoveis}</td>
                                                <td style={{ verticalAlign: 'top' }}>
                                                    <span className="br-tag bg-primary text-white">
                                                        {item.qtdAgentes} {item.qtdAgentes > 1 ? 'Agentes' : 'Agente'}
                                                    </span>
                                                </td>

                                                {/* E a classe ocultar-na-impressao entra aqui também */}
                                                <td className="ocultar-na-impressao text-success text-weight-semi-bold" style={{ verticalAlign: 'top' }}>
                                                    {item.mediaReal}
                                                </td>

                                                <td style={{ verticalAlign: 'top' }}>

                                                    {/* ==========================================
                                                    VISÃO DA TELA (Oculta no Papel) 
                                                     ========================================== */}
                                                    <div className="ocultar-na-impressao">
                                                        <div className="mb-2">
                                                            {(selecaoAgentes[item.equipe] || []).map(nome => (
                                                                <span key={nome} className="br-tag bg-success text-white mr-2 mb-2 d-inline-flex align-items-center" style={{ fontSize: '13px', padding: '4px 10px', borderRadius: '15px' }}>
                                                                    {nome}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removerAgente(item.equipe, nome)}
                                                                        style={{ background: 'none', border: 'none', color: 'white', marginLeft: '8px', cursor: 'pointer', outline: 'none' }}
                                                                        title="Remover Agente"
                                                                    >
                                                                        <i className="fas fa-times"></i>
                                                                    </button>
                                                                </span>
                                                            ))}
                                                        </div>

                                                        <div style={{ position: 'relative' }}>
                                                            <input
                                                                type="text"
                                                                className="br-input"
                                                                placeholder="Pesquise o nome para adicionar..."
                                                                value={termoBusca}
                                                                onChange={(e) => handleBuscaChange(item.equipe, e.target.value)}
                                                                style={{ width: '100%' }}
                                                            />

                                                            {termoBusca && (
                                                                <ul style={{
                                                                    position: 'absolute',
                                                                    top: '100%',
                                                                    left: 0,
                                                                    right: 0,
                                                                    background: '#fff',
                                                                    border: '1px solid #ccc',
                                                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                                                    maxHeight: '180px',
                                                                    overflowY: 'auto',
                                                                    zIndex: 1000,
                                                                    listStyle: 'none',
                                                                    padding: 0,
                                                                    margin: 0,
                                                                    borderRadius: '0 0 4px 4px'
                                                                }}>
                                                                    {filtrados.length > 0 ? (
                                                                        filtrados.map(agente => (
                                                                            <li
                                                                                key={agente.id}
                                                                                style={{ padding: '10px 12px', cursor: 'pointer', borderBottom: '1px solid #eee', fontSize: '14px' }}
                                                                                onMouseDown={(e) => {
                                                                                    e.preventDefault();
                                                                                    adicionarAgente(item.equipe, agente.nome);
                                                                                    handleBuscaChange(item.equipe, '');
                                                                                }}
                                                                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f8ff'}
                                                                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                                                                            >
                                                                                <i className="fas fa-user-plus mr-2 text-primary"></i>
                                                                                {agente.nome}
                                                                            </li>
                                                                        ))
                                                                    ) : (
                                                                        <li style={{ padding: '10px 12px', color: '#999', fontSize: '14px' }}>
                                                                            Nenhum agente livre com esse nome.
                                                                        </li>
                                                                    )}
                                                                </ul>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* ==========================================
                                                        VISÃO DE IMPRESSÃO (Oculta na Tela) 
                                                     ========================================== */}
                                                    <div className="mostrar-na-impressao">
                                                        <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                                                            {(selecaoAgentes[item.equipe] || []).length > 0 ? (
                                                                (selecaoAgentes[item.equipe] || []).map(nome => (
                                                                    <li key={`print-${nome}`} style={{ fontSize: '14px', marginBottom: '4px', color: '#000' }}>
                                                                        • {nome}
                                                                    </li>
                                                                ))
                                                            ) : (
                                                                <li style={{ fontSize: '14px', color: '#666', fontStyle: 'italic' }}>
                                                                    Nenhum agente alocado
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="form-actions mt-4 pt-3 border-top d-flex gap-3 ocultar-na-impressao">
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