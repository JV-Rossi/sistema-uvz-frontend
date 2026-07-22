import React, { useState } from 'react';
import './ValidacaoRTBase.css';

export default function ValidacaoRTBase({
    titulo,
    subtitulo,
    icone,
    solicitacoes = [],
    loading = false,
    erro = '',
    sucesso = '',
    filtroStatus,
    setFiltroStatus,
    colunaCasoHeader = "Dados do Caso",
    renderDadosCaso,         // Props de Renderização para a Coluna 4
    renderInfoModalAceite,   // Props de Renderização para as infos do Modal de Aceite
    podeConfirmarAceite = true,
    onConfirmarRecusa,
    onConfirmarAceite
}) {
    // Controle dos Modais
    const [modalRecusaAberto, setModalRecusaAberto] = useState(false);
    const [solicitacaoParaRecusar, setSolicitacaoParaRecusar] = useState(null);
    const [justificativa, setJustificativa] = useState('');

    const [modalDelegarAberto, setModalDelegarAberto] = useState(false);
    const [solicitacaoParaDelegar, setSolicitacaoParaDelegar] = useState(null);

    // Handlers para Recusa
    const handleAbrirRecusa = (item) => {
        setSolicitacaoParaRecusar(item);
        setJustificativa('');
        setModalRecusaAberto(true);
    };

    const handleConfirmarRecusaSubmit = (e) => {
        e.preventDefault();
        if (!justificativa.trim() || !solicitacaoParaRecusar) return;
        onConfirmarRecusa(solicitacaoParaRecusar, justificativa);
        setModalRecusaAberto(false);
        setSolicitacaoParaRecusar(null);
        setJustificativa('');
    };

    // Handlers para Aceite / Delegação
    const handleAbrirDelegacao = (item) => {
        setSolicitacaoParaDelegar(item);
        setModalDelegarAberto(true);
    };

    const handleConfirmarDelegacaoSubmit = () => {
        if (!solicitacaoParaDelegar) return;
        onConfirmarAceite(solicitacaoParaDelegar);
        setModalDelegarAberto(false);
        setSolicitacaoParaDelegar(null);
    };

    return (
        <main className="validacao-content">
            {/* CABEÇALHO DA TELA */}
            <header className="validacao-header">
                <h1 className="text-weight-semi-bold validacao-title">
                    <i className={`fas ${icone} mr-2`} aria-hidden="true"></i>
                    {titulo}
                </h1>
                <p className="validacao-subtitle">{subtitulo}</p>
            </header>

            {/* TOOLBAR COM FILTROS DE STATUS */}
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

            {/* TABELA DE DADOS */}
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
                        <p>Não há solicitações para os filtros selecionados.</p>
                    </div>
                ) : (
                    <div className="br-table">
                        <table>
                            <thead className="tabela-validacao">
                                <tr>
                                    <th className="col-data" scope="col">Data</th>
                                    <th className="col-agente" scope="col">Solicitante / Agente</th>
                                    <th className="col-endereco" scope="col">Localidade</th>
                                    <th className="col-sintoma" scope="col">{colunaCasoHeader}</th>
                                    <th className="col-acoes" scope="col">Ação do Resp. Técnico</th>
                                </tr>
                            </thead>
                            <tbody className="tabela-validacao">
                                {solicitacoes.map((item) => (
                                    <tr key={item.id}>
                                        <td data-th="Data">{item.data}</td>

                                        <td data-th="Solicitante / Agente">
                                            <span className="text-weight-semi-bold d-block">{item.municipe || item.agente || item.paciente}</span>
                                            {item.atendente && <span className="d-block text-small text-muted">{item.atendente}</span>}
                                            {item.telefone && <span className="d-block text-small text-muted">{item.telefone}</span>}
                                        </td>

                                        <td data-th="Localidade">
                                            <div className="d-flex align-items-center gap-2 mb-1">
                                                <span className="text-weight-bold">{item.bairro}</span>
                                                {item.distrito && <span className="badge-distrito-tabela">{item.distrito}</span>}
                                            </div>
                                            <span className="d-block text-small text-muted">{item.endereco}</span>
                                            <span className="d-block text-small text-muted mt-1">
                                                <i className="fas fa-map-signs mr-1"></i> Quart: {item.quarteirao}
                                                {item.zona && ` | Zona: ${item.zona}`}
                                                {item.desmembramento && ` | Desm: ${item.desmembramento}`}
                                            </span>
                                            {item.referencia && (
                                                <span className="d-block text-small text-italic text-muted">
                                                    Ref: {item.referencia}
                                                </span>
                                            )}
                                        </td>

                                        {/* RENDERIZAÇÃO DA COLUNA ESPECÍFICA */}
                                        <td data-th={colunaCasoHeader}>
                                            {renderDadosCaso ? renderDadosCaso(item) : null}
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
                                                        title="Aceitar e Delegar"
                                                        onClick={() => handleAbrirDelegacao(item)}
                                                    >
                                                        <i className="fas fa-check"></i>
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

            {/* MODAL DE RECUSA */}
            {modalRecusaAberto && solicitacaoParaRecusar && (
                <div className="modal-recusa-overlay">
                    <div className="modal-recusa-card">
                        <div className="modal-recusa-header">
                            <h3><i className="fas fa-file-alt mr-2"></i> Relatório de Recusa</h3>
                            <button className="btn-fechar-modal" onClick={() => setModalRecusaAberto(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <form onSubmit={handleConfirmarRecusaSubmit}>
                            <div className="modal-recusa-body">
                                <div className="info-solicitacao-recusa">
                                    <p><strong>Solicitação:</strong> #{solicitacaoParaRecusar.id}</p>
                                    <p><strong>Solicitante:</strong> {solicitacaoParaRecusar.municipe || solicitacaoParaRecusar.paciente}</p>
                                    <p><strong>Localidade:</strong> Quart. {solicitacaoParaRecusar.quarteirao}, {solicitacaoParaRecusar.bairro}</p>
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
                                        placeholder="Digite detalhadamente o parecer técnico do porquê foi recusada..."
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

            {/* MODAL DE ACEITE */}
            {modalDelegarAberto && solicitacaoParaDelegar && (
                <div className="modal-delegar-overlay">
                    <div className="modal-delegar-card">
                        <div className="modal-delegar-header">
                            <h3><i className="fas fa-paper-plane mr-2"></i> Confirmar Delegação</h3>
                            <button className="btn-fechar-modal" onClick={() => setModalDelegarAberto(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <div className="modal-delegar-body">
                            <div className="alerta-delegacao">
                                <i className="fas fa-exclamation-triangle"></i>
                                <p><strong>Atenção:</strong> Esta ação aprova tecnicamente a solicitação e a encaminha para a equipe de campo competente.</p>
                            </div>

                            <div className="info-solicitacao-delegar">
                                <p><strong>Código da O.S.:</strong> #{solicitacaoParaDelegar.id}</p>
                                <p><strong>Localidade:</strong> {solicitacaoParaDelegar.bairro} - Quart. {solicitacaoParaDelegar.quarteirao}</p>
                                <p><strong>Endereço:</strong> {solicitacaoParaDelegar.endereco}</p>
                                {renderInfoModalAceite && renderInfoModalAceite(solicitacaoParaDelegar)}
                            </div>

                            <p className="pergunta-confirmacao">Tem certeza que deseja aprovar e prosseguir com a delegação?</p>
                        </div>

                        <div className="modal-delegar-footer">
                            <button type="button" className="br-button secondary" onClick={() => setModalDelegarAberto(false)}>
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className="br-button success"
                                onClick={handleConfirmarDelegacaoSubmit}
                                disabled={!podeConfirmarAceite} // 👈 Trava o botão até selecionar a equipe
                            >
                                <i className="fas fa-check-circle mr-2"></i> Sim, Confirmar Delegação
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}