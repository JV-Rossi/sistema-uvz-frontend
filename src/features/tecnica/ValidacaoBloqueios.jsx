import React, { useState, useEffect } from 'react';
import './ValidacaoBloqueios.css';

export default function ValidacaoBloqueios() {
    const [solicitacoes, setSolicitacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');

    const [filtroStatus, setFiltroStatus] = useState('pendente');
    const [filtroDistrito, setFiltroDistrito] = useState('TODOS'); 

    // Estados para o controle do Modal de Recusa
    const [modalRecusaAberto, setModalRecusaAberto] = useState(false);
    const [solicitacaoParaRecusar, setSolicitacaoParaRecusar] = useState(null);
    const [justificativa, setJustificativa] = useState('');

    // Estados para o controle do Modal de Confirmação de Delegação
    const [modalDelegarAberto, setModalDelegarAberto] = useState(false);
    const [solicitacaoParaDelegar, setSolicitacaoParaDelegar] = useState(null);

    useEffect(() => {
        buscarSolicitacoes();
    }, [filtroStatus]);

    const buscarSolicitacoes = async () => {
        setLoading(true);
        setErro('');
        try {
            setTimeout(() => {
                // 🟢 CORREÇÃO: Mock de dados atualizado com Quarteirão, Zona, Telefone e Paciente
                const dadosSimulados = [
                    { id: 1, data: '16/07/2026', agente: 'JOAO VITOR ROSSI', paciente: 'MARIA DA SILVA', telefone: '(65) 99999-1111', bairro: 'ALPHAVILLE I', quarteirao: 12, zona: 'URBANA', desmembramento: '', distrito: 'DIS. NORTE', endereco: 'Rua das Orquídeas, Qd 5, Lt 12', suspeita: 'Dengue', dataSintomas: '12/07/2026', status: 'pendente' },
                    { id: 2, data: '16/07/2026', agente: 'CAMILA BENEDITA', paciente: 'ROBERTO CARLOS', telefone: '', bairro: 'COND. ATHENAS', quarteirao: 5, zona: 'URBANA', desmembramento: 'A', distrito: 'DIS. SUL', endereco: 'Casa 45', suspeita: 'Zika', dataSintomas: '14/07/2026', status: 'pendente' },
                    { id: 3, data: '15/07/2026', agente: 'HELIO SIMIAO', paciente: 'ANA JULIA', telefone: '(65) 98888-2222', bairro: 'BRASIL 21', quarteirao: 8, zona: 'PERIURBANA', desmembramento: '', distrito: 'DIS. LESTE', endereco: 'Rua B, Qd 2, Lt 8', suspeita: 'Chikungunya', dataSintomas: '10/07/2026', status: 'pendente' },
                ];
                setSolicitacoes(filtroStatus === 'pendente' ? dadosSimulados : []);
                setLoading(false);
            }, 800);
        } catch (err) {
            setErro("Erro ao carregar as solicitações.");
            setLoading(false);
        }
    };

    const solicitacoesFiltradas = solicitacoes.filter(item => {
        return filtroDistrito === 'TODOS' || item.distrito === filtroDistrito;
    });

    const handleAbrirRecusa = (solicitacao) => {
        setSolicitacaoParaRecusar(solicitacao);
        setJustificativa('');
        setModalRecusaAberto(true);
    };

    const handleConfirmarRecusa = async (e) => {
        e.preventDefault();
        if (!justificativa.trim()) return;

        try {
            setSucesso(`Solicitação #${solicitacaoParaRecusar.id} recusada com sucesso. Relatório enviado ao agente.`);
            setSolicitacoes(prev => prev.filter(s => s.id !== solicitacaoParaRecusar.id));
            
            setModalRecusaAberto(false);
            setSolicitacaoParaRecusar(null);
            setJustificativa('');

            setTimeout(() => setSucesso(''), 4000);
        } catch (err) {
            setErro("Erro ao processar a recusa da solicitação.");
        }
    };

    const handleAbrirDelegacao = (solicitacao) => {
        setSolicitacaoParaDelegar(solicitacao);
        setModalDelegarAberto(true);
    };

    const handleConfirmarDelegacao = async () => {
        if (!solicitacaoParaDelegar) return;

        try {
            setSucesso(`Solicitação #${solicitacaoParaDelegar.id} aprovada e delegada à equipe de campo e borrifadores.`);
            setSolicitacoes(prev => prev.filter(s => s.id !== solicitacaoParaDelegar.id));
            
            setModalDelegarAberto(false);
            setSolicitacaoParaDelegar(null);
            
            setTimeout(() => setSucesso(''), 3000);
        } catch (err) {
            setErro("Erro ao processar a delegação com borrifação.");
        }
    };

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

            <div className="validacao-toolbar">
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

                <div className="validacao-distrito-container">
                    <label htmlFor="filtro-distrito" className="validacao-distrito-label">
                        <i className="fas fa-filter"></i> Distrito:
                    </label>
                    <select 
                        id="filtro-distrito" 
                        value={filtroDistrito} 
                        onChange={(e) => setFiltroDistrito(e.target.value)}
                        className="validacao-select-filtro"
                    >
                        <option value="TODOS">Todos os Distritos</option>
                        <option value="DIS. NORTE">Distrito Norte</option>
                        <option value="DIS. SUL">Distrito Sul</option>
                        <option value="DIS. LESTE">Distrito Leste</option>
                        <option value="DIS. OESTE">Distrito Oeste</option>
                    </select>
                </div>
            </div>

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

            <div className="br-card p-4 tabela-validacao-container">
                <h3 className="text-weight-semi-bold mb-4 text-primary">
                    Solicitações {filtroStatus === 'pendente' ? 'Aguardando Avaliação' : 'Avaliadas'}
                </h3>

                {loading ? (
                    <div className="validacao-loading">
                        <i className="fas fa-spinner fa-spin fa-2x mb-3 d-block"></i>
                        Carregando dados...
                    </div>
                ) : solicitacoesFiltradas.length === 0 ? (
                    <div className="validacao-empty-state br-card">
                        <i className="fas fa-check-double validacao-empty-icon"></i>
                        <h4 className="text-weight-semi-bold">Tudo em dia!</h4>
                        <p>Não há solicitações para os filtros selecionados.</p>
                    </div>
                ) : (
                    <div className="br-table">
                        <table>
                            <thead className="tabela-validacao">
                                <tr>
                                    <th className="col-data" scope="col">Data</th>
                                    <th className="col-agente" scope="col">Agente Solicitante</th>
                                    <th className="col-endereco" scope="col">Localidade</th>
                                    <th className="col-sintoma" scope="col">Dados do Caso</th>
                                    <th className="col-acoes" scope="col">Ação do Resp. Técnico</th>
                                </tr>
                            </thead>
                            <tbody className="tabela-validacao">
                                {solicitacoesFiltradas.map((item) => (
                                    <tr key={item.id}>
                                        <td data-th="Data">{item.data}</td>
                                        <td data-th="Agente Solicitante" className="text-weight-semi-bold">{item.agente}</td>
                                        
                                        {/* 🟢 CORREÇÃO: Coluna de Localidade com Quarteirão e Zona */}
                                        <td data-th="Localidade">
                                            <div className="d-flex align-items-center gap-2 mb-1">
                                                <span className="text-weight-bold">{item.bairro}</span>
                                                <span className="badge-distrito-tabela">{item.distrito}</span>
                                            </div>
                                            <span className="d-block text-small text-muted">{item.endereco}</span>
                                            <span className="d-block text-small text-muted mt-1">
                                                <i className="fas fa-map-signs mr-1"></i> Quart: {item.quarteirao} 
                                                {item.zona && ` | Zona: ${item.zona}`}
                                                {item.desmembramento && ` | Desm: ${item.desmembramento}`}
                                            </span>
                                        </td>
                                        
                                        {/* 🟢 CORREÇÃO: Coluna de Sintoma exibindo o Paciente */}
                                        <td data-th="Dados do Caso">
                                            <span className={`br-tag mb-1 ${getCorSuspeita(item.suspeita)}`}>
                                                Suspeita: {item.suspeita}
                                            </span>
                                            <p className="mb-0 text-small mt-1">
                                                <strong>Munícipe:</strong> {item.paciente}
                                            </p>
                                            <p className="mb-0 text-small">
                                                <strong>Início Sintomas:</strong> {item.dataSintomas}
                                            </p>
                                        </td>
                                        
                                        <td data-th="Ação" className="col-acoes-center">
                                            {filtroStatus === 'pendente' ? (
                                                <div className="acoes-botoes-container">
                                                    <button 
                                                        className="br-button danger circle small" 
                                                        title="Recusar e Gerar Relatório"
                                                        onClick={() => handleAbrirRecusa(item)}
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                    <button 
                                                        className="br-button success circle small" 
                                                        title="Delegar p/ Supervisor + Borrifação"
                                                        onClick={() => handleAbrirDelegacao(item)}
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

            {/* 🔴 MODAL DA JANELA DE RELATÓRIO DE RECUSA */}
            {modalRecusaAberto && solicitacaoParaRecusar && (
                <div className="modal-recusa-overlay">
                    <div className="modal-recusa-card">
                        <div className="modal-recusa-header">
                            <h3><i className="fas fa-file-alt mr-2"></i> Relatório de Recusa de Bloqueio</h3>
                            <button className="btn-fechar-modal" onClick={() => setModalRecusaAberto(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <form onSubmit={handleConfirmarRecusa}>
                            <div className="modal-recusa-body">
                                <div className="info-solicitacao-recusa">
                                    <p><strong>Solicitação:</strong> #{solicitacaoParaRecusar.id}</p>
                                    <p><strong>Paciente:</strong> {solicitacaoParaRecusar.paciente}</p>
                                    <p><strong>Localidade:</strong> Quart. {solicitacaoParaRecusar.quarteirao}, {solicitacaoParaRecusar.bairro} ({solicitacaoParaRecusar.distrito})</p>
                                </div>

                                <div className="form-group-recusa">
                                    <label htmlFor="justificativaTexto">
                                        Justificativa Técnica do Motivo da Recusa <span className="obrigatorio">*</span>
                                    </label>
                                    <textarea
                                        id="justificativaTexto"
                                        rows="5"
                                        value={justificativa}
                                        onChange={(e) => setJustificativa(e.target.value)}
                                        placeholder="Digite detalhadamente o parecer técnico do porquê este bloqueio foi recusado..."
                                        required
                                    ></textarea>
                                </div>
                            </div>

                            <div className="modal-recusa-footer">
                                <button type="button" className="br-button secondary" onClick={() => setModalRecusaAberto(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="br-button danger" disabled={!justificativa.trim()}>
                                    <i className="fas fa-paper-plane mr-2"></i> Confirmar e Emitir Recusa
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 🟢 MODAL DE CONFIRMAÇÃO DE DELEGAÇÃO */}
            {modalDelegarAberto && solicitacaoParaDelegar && (
                <div className="modal-delegar-overlay">
                    <div className="modal-delegar-card">
                        <div className="modal-delegar-header">
                            <h3><i className="fas fa-paper-plane mr-2"></i> Confirmar Delegação de Bloqueio</h3>
                            <button className="btn-fechar-modal" onClick={() => setModalDelegarAberto(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <div className="modal-delegar-body">
                            <div className="alerta-delegacao">
                                <i className="fas fa-exclamation-triangle"></i>
                                <p><strong>Atenção:</strong> Esta ação aprova tecnicamente a solicitação de bloqueio e a envia imediatamente para o painel de escala dos supervisores de campo.</p>
                            </div>

                            <div className="info-solicitacao-delegar">
                                <p><strong>Código da O.S.:</strong> #{solicitacaoParaDelegar.id}</p>
                                <p><strong>Agente Solicitante:</strong> {solicitacaoParaDelegar.agente}</p>
                                {/* 🟢 CORREÇÃO: Exibição completa no modal do RT */}
                                <p><strong>Paciente Notificado:</strong> {solicitacaoParaDelegar.paciente}</p>
                                <p><strong>Localidade:</strong> {solicitacaoParaDelegar.bairro} ({solicitacaoParaDelegar.distrito}) - Quart. {solicitacaoParaDelegar.quarteirao}</p>
                                <p><strong>Endereço:</strong> {solicitacaoParaDelegar.endereco}</p>
                                <p><strong>Suspeita Epidemiológica:</strong> 
                                    <span className={`br-tag ml-2 ${getCorSuspeita(solicitacaoParaDelegar.suspeita)}`}>
                                        {solicitacaoParaDelegar.suspeita}
                                    </span>
                                </p>
                            </div>

                            <p className="pergunta-confirmacao">Tem certeza que deseja aprovar e prosseguir com a delegação?</p>
                        </div>

                        <div className="modal-delegar-footer">
                            <button type="button" className="br-button secondary" onClick={() => setModalDelegarAberto(false)}>
                                Cancelar
                            </button>
                            <button type="button" className="br-button success" onClick={handleConfirmarDelegacao}>
                                <i className="fas fa-check-circle mr-2"></i> Sim, Confirmar Delegação
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}