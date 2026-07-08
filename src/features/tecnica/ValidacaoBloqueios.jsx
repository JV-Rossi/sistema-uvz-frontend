import React, { useState, useEffect } from 'react';
import './ValidacaoBloqueios.css';

export default function ValidacaoBloqueios() {
    const [solicitacoes, setSolicitacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');

    const [filtroStatus, setFiltroStatus] = useState('pendente');

    useEffect(() => {
        buscarSolicitacoes();
    }, [filtroStatus]);

    const buscarSolicitacoes = async () => {
        setLoading(true);
        setErro('');
        try {
            // Simulando o delay do banco de dados com a nova estrutura de Sintomas
            setTimeout(() => {
                const dadosSimulados = [
                    { id: 1, data: '08/07/2026', agente: 'JOAO VITOR ROSSI', bairro: 'ALPHAVILLE I', endereco: 'Rua das Orquídeas, Qd 5, Lt 12', suspeita: 'Dengue', dataSintomas: '02/07/2026', status: 'pendente' },
                    { id: 2, data: '08/07/2026', agente: 'CAMILA BENEDITA', bairro: 'COND. ATHENAS', endereco: 'Casa 45', suspeita: 'Zika', dataSintomas: '05/07/2026', status: 'pendente' },
                    { id: 3, data: '07/07/2026', agente: 'HELIO SIMIAO', bairro: 'BRASIL 21', endereco: 'Rua B, Qd 2, Lt 8', suspeita: 'Chikungunya', dataSintomas: '04/07/2026', status: 'pendente' },
                ];
                setSolicitacoes(filtroStatus === 'pendente' ? dadosSimulados : []);
                setLoading(false);
            }, 800);
        } catch (err) {
            setErro("Erro ao carregar as solicitações.");
            setLoading(false);
        }
    };

    // 🔴 1. Ação: Recusar
    const handleRecusar = async (id) => {
        const justificativa = window.prompt("Motivo da recusa (será enviado ao agente):");
        if (justificativa === null) return; 

        try {
            setSucesso(`Solicitação #${id} recusada. O agente será notificado.`);
            setSolicitacoes(prev => prev.filter(s => s.id !== id));
            setTimeout(() => setSucesso(''), 3000);
        } catch (err) {
            setErro("Erro ao recusar a solicitação.");
        }
    };

    // 🔵 2. Ação: Delegar apenas para Supervisor
    const handleDelegarSupervisor = async (id) => {
        if (!window.confirm("Deseja aprovar e DELEGAR PARA O SUPERVISOR o bloqueio deste imóvel?")) return;

        try {
            setSucesso(`Solicitação #${id} delegada ao Supervisor. Bloqueio Mecânico autorizado.`);
            setSolicitacoes(prev => prev.filter(s => s.id !== id));
            setTimeout(() => setSucesso(''), 3000);
        } catch (err) {
            setErro("Erro ao processar a delegação.");
        }
    };

    // 🟢 3. Ação: Delegar para Supervisor + Borrifação
    const handleDelegarBorrifacao = async (id) => {
        if (!window.confirm("Deseja aprovar e DELEGAR PARA SUPERVISOR + BORRIFAÇÃO (Bloqueio Mecânico e Químico)?")) return;

        try {
            setSucesso(`Solicitação #${id} delegada à equipe de campo e borrifadores.`);
            setSolicitacoes(prev => prev.filter(s => s.id !== id));
            setTimeout(() => setSucesso(''), 3000);
        } catch (err) {
            setErro("Erro ao processar a delegação com borrifação.");
        }
    };

    // Função auxiliar para definir a cor da tag dependendo da doença
    const getCorSuspeita = (doenca) => {
        if (doenca === 'Dengue') return 'bg-danger text-white';
        if (doenca === 'Zika') return 'bg-warning text-dark';
        if (doenca === 'Chikungunya') return 'bg-info text-white';
        return 'bg-secondary text-white';
    };

    return (
        <main className="validacao-content">
            <header className="validacao-header">
                <h1 className="text-weight-semi-bold validacao-title">
                    <i className="fas fa-shield-alt mr-2" aria-hidden="true"></i>
                    Validação de Bloqueios
                </h1>
                <p className="validacao-subtitle">
                    Painel do Responsável Técnico para avaliação epidemiológica de solicitações do campo.
                </p>
            </header>

            {/* ABAS DE NAVEGAÇÃO */}
            <div className="validacao-filtros">
                <button 
                    className={`br-button ${filtroStatus === 'pendente' ? 'primary' : 'secondary'}`} 
                    onClick={() => setFiltroStatus('pendente')}
                >
                    <i className="fas fa-clock mr-2"></i> Pendentes
                </button>
                <button 
                    className={`br-button ${filtroStatus === 'historico' ? 'primary' : 'secondary'}`} 
                    onClick={() => setFiltroStatus('historico')}
                >
                    <i className="fas fa-history mr-2"></i> Histórico Avaliado
                </button>
            </div>

            {/* MENSAGENS DE FEEDBACK */}
            {sucesso && (
                <div className="br-message is-success mb-4" role="alert">
                    <div className="icon"><i className="fas fa-check-circle fa-lg"></i></div>
                    <div className="content"><span className="message-body">{sucesso}</span></div>
                </div>
            )}
            {erro && (
                <div className="br-message is-danger mb-4" role="alert">
                    <div className="icon"><i className="fas fa-times-circle fa-lg"></i></div>
                    <div className="content"><span className="message-body">{erro}</span></div>
                </div>
            )}

            {/* TABELA DE SOLICITAÇÕES */}
            <div className="br-card p-4 tabela-validacao-container">
                <h3 className="text-weight-semi-bold mb-4 text-primary">
                    Solicitações {filtroStatus === 'pendente' ? 'Aguardando Avaliação' : 'Avaliadas'}
                </h3>

                {loading ? (
                    <div className="validacao-loading">
                        <i className="fas fa-spinner fa-spin fa-2x mb-3 d-block"></i>
                        Carregando dados...
                    </div>
                ) : solicitacoes.length === 0 ? (
                    <div className="validacao-empty-state br-card">
                        <i className="fas fa-check-double validacao-empty-icon"></i>
                        <h4 className="text-weight-semi-bold">Tudo em dia!</h4>
                        <p>Não há solicitações pendentes para validação no momento.</p>
                    </div>
                ) : (
                    <div className="br-table" data-search="data-search" data-selection="data-selection">
                        <div className="table-header"></div>
                        <table>
                            <thead className="tabela-validacao">
                                <tr>
                                    <th className="col-data" scope="col">Data</th>
                                    <th className="col-agente" scope="col">Agente Solicitante</th>
                                    <th className="col-endereco" scope="col">Endereço (Imóvel)</th>
                                    <th className="col-sintoma" scope="col">Sintoma</th>
                                    <th className="col-acoes" scope="col">Ação do Resp. Técnico</th>
                                </tr>
                            </thead>
                            <tbody className="tabela-validacao">
                                {solicitacoes.map((item) => (
                                    <tr key={item.id}>
                                        <td data-th="Data">{item.data}</td>
                                        <td data-th="Agente Solicitante" className="text-weight-semi-bold">{item.agente}</td>
                                        <td data-th="Endereço">
                                            <span className="d-block text-weight-bold">{item.bairro}</span>
                                            <span className="text-small text-muted">{item.endereco}</span>
                                        </td>
                                        <td data-th="Sintoma">
                                            {/* Tag dinâmica baseada na doença */}
                                            <span className={`br-tag mb-1 ${getCorSuspeita(item.suspeita)}`}>
                                                Suspeita: {item.suspeita}
                                            </span>
                                            {/* Data do início dos sintomas */}
                                            <p className="mb-0 text-small mt-1">
                                                <strong>Início dos Sintomas:</strong> {item.dataSintomas}
                                            </p>
                                        </td>
                                        <td data-th="Ação" className="col-acoes-center">
                                            {filtroStatus === 'pendente' ? (
                                                <div className="acoes-botoes-container">
                                                    
                                                    {/* BOTÃO: RECUSAR */}
                                                    <button 
                                                        className="br-button danger circle small" 
                                                        title="Recusar Solicitação"
                                                        onClick={() => handleRecusar(item.id)}
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                    
                                                    {/* BOTÃO: DELEGAR PARA SUPERVISOR */}
                                                    <button 
                                                        className="br-button primary circle small" 
                                                        title="Delegar p/ Supervisor (Bloqueio Mecânico)"
                                                        onClick={() => handleDelegarSupervisor(item.id)}
                                                    >
                                                        <i className="fas fa-user-check"></i>
                                                    </button>

                                                    {/* BOTÃO: DELEGAR PARA SUPERVISOR + BORRIFAÇÃO */}
                                                    <button 
                                                        className="br-button success circle small" 
                                                        title="Delegar p/ Sup + Borrifação (Químico)"
                                                        onClick={() => handleDelegarBorrifacao(item.id)}
                                                    >
                                                        <i className="fas fa-spray-can"></i>
                                                    </button>

                                                </div>
                                            ) : (
                                                <span className="text-muted text-small text-uppercase">Já avaliado</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    );
}