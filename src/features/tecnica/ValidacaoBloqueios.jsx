import React, { useState, useEffect } from 'react';
import './ValidacaoBloqueios.css'; // Reutiliza a estilização de tabelas e modais

export default function ValidacaoSinantropia() {
    const [solicitacoes, setSolicitacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');

    const [filtroStatus, setFiltroStatus] = useState('pendente');
    const [filtroDistrito, setFiltroDistrito] = useState('TODOS'); 

    // Controle do Modal de Recusa
    const [modalRecusaAberto, setModalRecusaAberto] = useState(false);
    const [solicitacaoParaRecusar, setSolicitacaoParaRecusar] = useState(null);
    const [justificativa, setJustificativa] = useState('');

    // Controle do Modal de Delegação para Equipe
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
                // Mock de solicitações de Visita Zoosanitária (Sinantropia)
                const dadosSimulados = [
                    { 
                        id: 101, 
                        data: '20/07/2026', 
                        atendente: 'RECEPÇÃO UVZ', 
                        municipe: 'CARLOS EDUARDO', 
                        telefone: '(65) 99222-3333', 
                        bairro: 'CPA II', 
                        quarteirao: 14, 
                        zona: 'URBANA', 
                        distrito: 'DIS. NORTE', 
                        endereco: 'Rua 14, nº 210', 
                        tipoImovel: 'Residencial',
                        referencia: 'Próximo à praça cultural', 
                        acaoEspecie: 'Barbeiro', 
                        status: 'pendente' 
                    },
                    { 
                        id: 102, 
                        data: '21/07/2026', 
                        atendente: 'RECEPÇÃO UVZ', 
                        municipe: 'MARIA AUXILIADORA', 
                        telefone: '(65) 98111-4444', 
                        bairro: 'TIJUCAL', 
                        quarteirao: 5, 
                        zona: 'URBANA', 
                        distrito: 'DIS. SUL', 
                        endereco: 'Av. Espigão, nº 50', 
                        tipoImovel: 'Comercial',
                        referencia: 'Ao lado da farmácia', 
                        acaoEspecie: 'Escorpião', 
                        status: 'pendente' 
                    },
                    { 
                        id: 103, 
                        data: '21/07/2026', 
                        atendente: 'TELEFONE/CENTRAL', 
                        municipe: 'ESCOLA M. PEDRO SAES', 
                        telefone: '(65) 3617-0000', 
                        bairro: 'DOM AQUINO', 
                        quarteirao: 8, 
                        zona: 'URBANA', 
                        distrito: 'DIS. LESTE', 
                        endereco: 'Rua Comendador Henrique, s/n', 
                        tipoImovel: 'Órgão público',
                        referencia: 'Esquina com a Dom Bosco', 
                        acaoEspecie: 'Morcego', 
                        status: 'pendente' 
                    },
                ];
                setSolicitacoes(filtroStatus === 'pendente' ? dadosSimulados : []);
                setLoading(false);
            }, 800);
        } catch (err) {
            setErro("Erro ao carregar as solicitações de visita.");
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
            setSucesso(`Solicitação #${solicitacaoParaRecusar.id} recusada com sucesso. Justificativa registrada.`);
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
            setSucesso(`Solicitação #${solicitacaoParaDelegar.id} aprovada! Encaminhada para a equipe de Entomologia / Campo.`);
            setSolicitacoes(prev => prev.filter(s => s.id !== solicitacaoParaDelegar.id));
            
            setModalDelegarAberto(false);
            setSolicitacaoParaDelegar(null);
            
            setTimeout(() => setSucesso(''), 3000);
        } catch (err) {
            setErro("Erro ao processar o encaminhamento para a equipe.");
        }
    };

    const getCorEspecie = (especie) => {
        switch (especie) {
            case 'Barbeiro': return 'bg-danger text-white';
            case 'Escorpião': return 'bg-warning text-dark';
            case 'Morcego': return 'bg-dark text-white';
            case 'Caramujo': return 'bg-info text-white';
            case 'Pombo': return 'bg-secondary text-white';
            default: return 'bg-primary text-white';
        }
    };

    return (
        <main className="validacao-content">
            <header className="validacao-header">
                <h1 className="text-weight-semi-bold validacao-title">
                    <i className="fas fa-bug mr-2" aria-hidden="true"></i>
                    Validação de Visitas Zoosanitárias (Sinantropia)
                </h1>
                <p className="validacao-subtitle">
                    Painel do Responsável Técnico para triagem, aceite e encaminhamento de chamados de sinantrópicos para as equipes de campo/entomologia.
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
                    Solicitações {filtroStatus === 'pendente' ? 'Aguardando Avaliação do R.T.' : 'Avaliadas'}
                </h3>

                {loading ? (
                    <div className="validacao-loading">
                        <i className="fas fa-spinner fa-spin fa-2x mb-3 d-block"></i>
                        Carregando solicitações de visita...
                    </div>
                ) : solicitacoesFiltradas.length === 0 ? (
                    <div className="validacao-empty-state br-card">
                        <i className="fas fa-check-double validacao-empty-icon"></i>
                        <h4 className="text-weight-semi-bold">Tudo em dia!</h4>
                        <p>Não há solicitações pendentes no momento para os filtros selecionados.</p>
                    </div>
                ) : (
                    <div className="br-table">
                        <table>
                            <thead className="tabela-validacao">
                                <tr>
                                    <th className="col-data" scope="col">Data/Origem</th>
                                    <th className="col-endereco" scope="col">Localidade e Imóvel</th>
                                    <th className="col-sintoma" scope="col">Demanda / Espécie</th>
                                    <th className="col-agente" scope="col">Solicitante</th>
                                    <th className="col-acoes" scope="col">Decisão do R.T.</th>
                                </tr>
                            </thead>
                            <tbody className="tabela-validacao">
                                {solicitacoesFiltradas.map((item) => (
                                    <tr key={item.id}>
                                        <td data-th="Data/Origem">
                                            <span className="text-weight-bold d-block">{item.data}</span>
                                            <span className="text-small text-muted">{item.atendente}</span>
                                        </td>
                                        
                                        <td data-th="Localidade e Imóvel">
                                            <div className="d-flex align-items-center gap-2 mb-1">
                                                <span className="text-weight-bold">{item.bairro}</span>
                                                <span className="badge-distrito-tabela">{item.distrito}</span>
                                            </div>
                                            <span className="d-block text-small">{item.endereco}</span>
                                            <span className="d-block text-small text-muted mt-1">
                                                <i className="fas fa-building mr-1"></i> <strong>Imóvel:</strong> {item.tipoImovel}
                                                {item.quarteirao && ` | Quart: ${item.quarteirao}`}
                                            </span>
                                            {item.referencia && (
                                                <span className="d-block text-small text-italic text-muted">
                                                    Ref: {item.referencia}
                                                </span>
                                            )}
                                        </td>
                                        
                                        <td data-th="Demanda / Espécie">
                                            <span className={`br-tag mb-1 ${getCorEspecie(item.acaoEspecie)}`}>
                                                {item.acaoEspecie}
                                            </span>
                                        </td>

                                        <td data-th="Solicitante">
                                            <span className="text-weight-semi-bold d-block">{item.municipe}</span>
                                            <span className="text-small text-muted">{item.telefone || 'Sem telefone'}</span>
                                        </td>
                                        
                                        <td data-th="Ação" className="col-acoes-center">
                                            {filtroStatus === 'pendente' ? (
                                                <div className="acoes-botoes-container">
                                                    <button 
                                                        className="br-button danger circle small" 
                                                        title="Recusar Solicitação"
                                                        onClick={() => handleAbrirRecusa(item)}
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                    <button 
                                                        className="br-button success circle small" 
                                                        title="Aceitar e Encaminhar para Equipe/Entomologia"
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
                            <h3><i className="fas fa-file-alt mr-2"></i> Motivo da Recusa da Visita</h3>
                            <button className="btn-fechar-modal" onClick={() => setModalRecusaAberto(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <form onSubmit={handleConfirmarRecusa}>
                            <div className="modal-recusa-body">
                                <div className="info-solicitacao-recusa">
                                    <p><strong>O.S.:</strong> #{solicitacaoParaRecusar.id}</p>
                                    <p><strong>Solicitante:</strong> {solicitacaoParaRecusar.municipe}</p>
                                    <p><strong>Espécie:</strong> {solicitacaoParaRecusar.acaoEspecie}</p>
                                    <p><strong>Localidade:</strong> {solicitacaoParaRecusar.bairro} ({solicitacaoParaRecusar.distrito})</p>
                                </div>

                                <div className="form-group-recusa">
                                    <label htmlFor="justificativaTexto">
                                        Justificativa Técnica do Motivo da Recusa <span className="obrigatorio">*</span>
                                    </label>
                                    <textarea
                                        id="justificativaTexto"
                                        rows="4"
                                        value={justificativa}
                                        onChange={(e) => setJustificativa(e.target.value)}
                                        placeholder="Informe por que esta visita zoosanitária não será realizada..."
                                        required
                                    ></textarea>
                                </div>
                            </div>

                            <div className="modal-recusa-footer">
                                <button type="button" className="br-button secondary" onClick={() => setModalRecusaAberto(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="br-button danger" disabled={!justificativa.trim()}>
                                    <i className="fas fa-paper-plane mr-2"></i> Confirmar Recusa
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL DE ACEITE E ENCAMINHAMENTO */}
            {modalDelegarAberto && solicitacaoParaDelegar && (
                <div className="modal-delegar-overlay">
                    <div className="modal-delegar-card">
                        <div className="modal-delegar-header">
                            <h3><i className="fas fa-user-check mr-2"></i> Aceitar e Designar Equipe</h3>
                            <button className="btn-fechar-modal" onClick={() => setModalDelegarAberto(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <div className="modal-delegar-body">
                            <div className="alerta-delegacao">
                                <i className="fas fa-info-circle"></i>
                                <p>Ao dar o aceite, a solicitação mudará para <strong>Em Andamento</strong> e ficará disponível para a equipe de Entomologia/Campo realizar a visita zoosanitária.</p>
                            </div>

                            <div className="info-solicitacao-delegar">
                                <p><strong>Código da O.S.:</strong> #{solicitacaoParaDelegar.id}</p>
                                <p><strong>Solicitante:</strong> {solicitacaoParaDelegar.municipe} ({solicitacaoParaDelegar.telefone})</p>
                                <p><strong>Espécie/Demanda:</strong> <span className={`br-tag ml-1 ${getCorEspecie(solicitacaoParaDelegar.acaoEspecie)}`}>{solicitacaoParaDelegar.acaoEspecie}</span></p>
                                <p><strong>Local:</strong> {solicitacaoParaDelegar.endereco} - {solicitacaoParaDelegar.bairro}</p>
                                <p><strong>Tipo de Imóvel:</strong> {solicitacaoParaDelegar.tipoImovel}</p>
                            </div>

                            <p className="pergunta-confirmacao">Deseja confirmar o aceite e encaminhar a O.S.?</p>
                        </div>

                        <div className="modal-delegar-footer">
                            <button type="button" className="br-button secondary" onClick={() => setModalDelegarAberto(false)}>
                                Cancelar
                            </button>
                            <button type="button" className="br-button success" onClick={handleConfirmarDelegacao}>
                                <i className="fas fa-check-circle mr-2"></i> Confirmar Aceite
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}