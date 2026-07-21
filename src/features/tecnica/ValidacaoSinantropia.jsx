import React, { useState, useEffect } from 'react';
import './ValidacaoBloqueios.css';

export default function ValidacaoSinantropia({ setAbaAtiva }) {
    const [solicitacoes, setSolicitacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');

    const [filtroStatus, setFiltroStatus] = useState('pendente');
    const [filtroDistrito, setFiltroDistrito] = useState('TODOS'); 

    // Controle dos Modais
    const [modalRecusaAberto, setModalRecusaAberto] = useState(false);
    const [solicitacaoParaRecusar, setSolicitacaoParaRecusar] = useState(null);
    const [justificativa, setJustificativa] = useState('');

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
                const dadosSimulados = [
                    { 
                        id: 101, data: '20/07/2026', atendente: 'RECEPÇÃO UVZ', municipe: 'CARLOS EDUARDO', 
                        telefone: '(65) 99222-3333', bairro: 'CPA II', quarteirao: 14, zona: 'URBANA', 
                        distrito: 'DIS. NORTE', endereco: 'Rua 14, nº 210', tipoImovel: 'Residencial', 
                        referencia: 'Próximo à praça cultural', acaoEspecie: 'Barbeiro', status: 'pendente' 
                    },
                    { 
                        id: 102, data: '21/07/2026', atendente: 'RECEPÇÃO UVZ', municipe: 'MARIA AUXILIADORA', 
                        telefone: '(65) 98111-4444', bairro: 'TIJUCAL', quarteirao: 5, zona: 'URBANA', 
                        distrito: 'DIS. SUL', endereco: 'Av. Espigão, nº 50', tipoImovel: 'Comercial', 
                        referencia: 'Ao lado da farmácia', acaoEspecie: 'Escorpião', status: 'pendente' 
                    }
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
            setSucesso(`Solicitação #${solicitacaoParaRecusar.id} recusada com sucesso.`);
            setSolicitacoes(prev => prev.filter(s => s.id !== solicitacaoParaRecusar.id));
            setModalRecusaAberto(false);
            setSolicitacaoParaRecusar(null);
            setJustificativa('');
            setTimeout(() => setSucesso(''), 4000);
        } catch (err) {
            setErro("Erro ao processar a recusa.");
        }
    };

    const handleAbrirDelegacao = (solicitacao) => {
        setSolicitacaoParaDelegar(solicitacao);
        setModalDelegarAberto(true);
    };

    const handleConfirmarDelegacao = async () => {
        if (!solicitacaoParaDelegar) return;

        try {
            setSucesso(`Solicitação #${solicitacaoParaDelegar.id} aprovada e encaminhada.`);
            setSolicitacoes(prev => prev.filter(s => s.id !== solicitacaoParaDelegar.id));
            setModalDelegarAberto(false);
            setSolicitacaoParaDelegar(null);
            setTimeout(() => setSucesso(''), 3000);
        } catch (err) {
            setErro("Erro ao processar o encaminhamento.");
        }
    };

    const getCorEspecie = (especie) => {
        switch (especie) {
            case 'Barbeiro': return 'bg-danger text-white';
            case 'Escorpião': return 'bg-warning text-dark';
            case 'Morcego': return 'bg-dark text-white';
            default: return 'bg-primary text-white';
        }
    };

    return (
        <main className="validacao-content">
            <header className="validacao-header">
                <h1 className="text-weight-semi-bold validacao-title">
                    <i className="fas fa-bug mr-2"></i> Validação de Visitas Zoosanitárias (Sinantropia)
                </h1>
                <p className="validacao-subtitle">
                    Painel do R.T. para triagem e encaminhamento de chamados.
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
                    <select 
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

            {sucesso && <div className="br-message is-success mb-4"><div className="content"><span className="message-body">{sucesso}</span></div></div>}
            {erro && <div className="br-message is-danger mb-4"><div className="content"><span className="message-body">{erro}</span></div></div>}

            <div className="br-card p-4 tabela-validacao-container">
                {loading ? (
                    <div className="validacao-loading"><i className="fas fa-spinner fa-spin mr-2"></i>Carregando...</div>
                ) : (
                    <div className="br-table">
                        <table>
                            <thead className="tabela-validacao">
                                <tr>
                                    <th>Data/Origem</th>
                                    <th>Localidade e Imóvel</th>
                                    <th>Demanda / Espécie</th>
                                    <th>Solicitante</th>
                                    <th>Decisão do R.T.</th>
                                </tr>
                            </thead>
                            <tbody className="tabela-validacao">
                                {solicitacoesFiltradas.map((item) => (
                                    <tr key={item.id}>
                                        <td><strong>{item.data}</strong><br/><small>{item.atendente}</small></td>
                                        <td>
                                            <strong>{item.bairro}</strong> ({item.distrito})<br/>
                                            <small>{item.endereco} - Imóvel: {item.tipoImovel}</small>
                                        </td>
                                        <td>
                                            <span className={`br-tag ${getCorEspecie(item.acaoEspecie)}`}>
                                                {item.acaoEspecie}
                                            </span>
                                        </td>
                                        <td>{item.municipe}<br/><small>{item.telefone}</small></td>
                                        <td className="col-acoes-center">
                                            {filtroStatus === 'pendente' && (
                                                <div className="acoes-botoes-container">
                                                    <button className="br-button danger circle small" title="Recusar" onClick={() => handleAbrirRecusa(item)}>
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                    <button className="br-button success circle small" title="Aceitar" onClick={() => handleAbrirDelegacao(item)}>
                                                        <i className="fas fa-check"></i>
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* MODAL RECUSA */}
            {modalRecusaAberto && solicitacaoParaRecusar && (
                <div className="modal-recusa-overlay">
                    <div className="modal-recusa-card">
                        <h3>Recusar Solicitação #{solicitacaoParaRecusar.id}</h3>
                        <form onSubmit={handleConfirmarRecusa}>
                            <textarea 
                                rows="3" 
                                required 
                                value={justificativa} 
                                onChange={(e) => setJustificativa(e.target.value)} 
                                placeholder="Motivo da recusa..."
                            ></textarea>
                            <div className="mt-3">
                                <button type="button" className="br-button secondary mr-2" onClick={() => setModalRecusaAberto(false)}>Cancelar</button>
                                <button type="submit" className="br-button danger">Confirmar Recusa</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL ACEITE */}
            {modalDelegarAberto && solicitacaoParaDelegar && (
                <div className="modal-delegar-overlay">
                    <div className="modal-delegar-card">
                        <h3>Confirmar Aceite da O.S. #{solicitacaoParaDelegar.id}</h3>
                        <p>Deseja encaminhar esta demanda para a equipe de campo/entomologia?</p>
                        <div className="mt-3">
                            <button type="button" className="br-button secondary mr-2" onClick={() => setModalDelegarAberto(false)}>Cancelar</button>
                            <button type="button" className="br-button success" onClick={handleConfirmarDelegacao}>Confirmar Aceite</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}