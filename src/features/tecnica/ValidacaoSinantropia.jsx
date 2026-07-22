import React, { useState, useEffect } from 'react';
import ValidacaoRTBase from './ValidacaoRTBase';

export default function ValidacaoSinantropia({ setAbaAtiva }) {
    const [solicitacoes, setSolicitacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('pendente');

    // Estados para seleção dinâmica de Agentes
    const [agentesDisponiveis, setAgentesDisponiveis] = useState([]);
    const [agentesSelecionados, setAgentesSelecionados] = useState([]);
    const [termoBusca, setTermoBusca] = useState('');

    useEffect(() => { 
        buscarSolicitacoes(); 
        buscarAgentes();
    }, [filtroStatus]);

    const buscarSolicitacoes = async () => {
        setLoading(true);
        setTimeout(() => {
            const dadosSimulados = [
                { id: 101, data: '20/07/2026', atendente: 'RECEPÇÃO UVZ', municipe: 'CARLOS EDUARDO', telefone: '(65) 99222-3333', bairro: 'CPA II', quarteirao: 14, distrito: 'DIS. NORTE', endereco: 'Rua 14, nº 210', tipoImovel: 'Residencial', acaoEspecie: 'Barbeiro', status: 'pendente' },
                { id: 102, data: '21/07/2026', atendente: 'RECEPÇÃO UVZ', municipe: 'MARIA AUXILIADORA', telefone: '(65) 98111-4444', bairro: 'TIJUCAL', quarteirao: 5, distrito: 'DIS. SUL', endereco: 'Av. Espigão, nº 50', tipoImovel: 'Comercial', acaoEspecie: 'Escorpião', status: 'pendente' }
            ];
            setSolicitacoes(filtroStatus === 'pendente' ? dadosSimulados : []);
            setLoading(false);
        }, 600);
    };

    const buscarAgentes = async () => {
        try {
            const response = await fetch('https://sistema-uvz-backend.onrender.com/api/usuarios?perfil=agente_campo');
            if (response.ok) {
                const dados = await response.json();
                setAgentesDisponiveis(dados);
            } else {
                setAgentesDisponiveis([
                    { id: 1, nome: 'JOAO VITOR ROSSI' },
                    { id: 2, nome: 'CAMILA BENEDITA' },
                    { id: 3, nome: 'HELIO SIMIAO' },
                    { id: 4, nome: 'MARCOS VINICIUS' },
                    { id: 5, nome: 'ANA PAULA' }
                ]);
            }
        } catch (err) {
            setAgentesDisponiveis([
                { id: 1, nome: 'JOAO VITOR ROSSI' },
                { id: 2, nome: 'CAMILA BENEDITA' },
                { id: 3, nome: 'HELIO SIMIAO' },
                { id: 4, nome: 'MARCOS VINICIUS' },
                { id: 5, nome: 'ANA PAULA' }
            ]);
        }
    };

    const adicionarAgente = (nomeAgente) => {
        if (!agentesSelecionados.includes(nomeAgente)) {
            setAgentesSelecionados(prev => [...prev, nomeAgente]);
        }
        setTermoBusca('');
    };

    const removerAgente = (nomeAgente) => {
        setAgentesSelecionados(prev => prev.filter(nome => nome !== nomeAgente));
    };

    const handleConfirmarRecusa = (item, justificativa) => {
        setSucesso(`Solicitação #${item.id} recusada com sucesso.`);
        setSolicitacoes(prev => prev.filter(s => s.id !== item.id));
        setTimeout(() => setSucesso(''), 4000);
    };

    const handleConfirmarAceite = (item) => {
        if (agentesSelecionados.length === 0) {
            setErro("Por favor, aloque ao menos um agente para a equipe responsável.");
            setTimeout(() => setErro(''), 4000);
            return;
        }

        const equipeFormada = agentesSelecionados.join(', ');
        setSucesso(`Solicitação #${item.id} aprovada! Alocados: [${equipeFormada}]`);
        setSolicitacoes(prev => prev.filter(s => s.id !== item.id));
        
        setAgentesSelecionados([]);
        setTermoBusca('');
        setTimeout(() => setSucesso(''), 3000);
    };

    const getCorEspecie = (especie) => {
        if (especie === 'Barbeiro') return 'bg-danger text-white';
        if (especie === 'Escorpião') return 'bg-warning text-dark';
        return 'bg-primary text-white';
    };

    const agentesLivres = agentesDisponiveis.filter(a => !agentesSelecionados.includes(a.nome));
    const agentesFiltrados = agentesLivres.filter(a => a.nome.toLowerCase().includes(termoBusca.toLowerCase()));

    return (
        <ValidacaoRTBase
            titulo="Validação de Visitas Zoosanitárias (Sinantropia)"
            subtitulo="Painel do R.T. para triagem e encaminhamento de chamados."
            icone="fa-bug"
            solicitacoes={solicitacoes}
            loading={loading}
            erro={erro}
            sucesso={sucesso}
            filtroStatus={filtroStatus}
            setFiltroStatus={setFiltroStatus}
            colunaCasoHeader="Demanda / Espécie"
            podeConfirmarAceite={agentesSelecionados.length > 0}
            renderDadosCaso={(item) => (
                <>
                    <span className={`br-tag mb-1 ${getCorEspecie(item.acaoEspecie)}`}>
                        Demanda: {item.acaoEspecie}
                    </span>
                    <p className="mb-0 text-small mt-1">
                        <strong>Imóvel:</strong> {item.tipoImovel}
                    </p>
                </>
            )}
            renderInfoModalAceite={(item) => (
                <>
                    <p><strong>Tipo de Imóvel:</strong> {item.tipoImovel}</p>
                    <p><strong>Demanda / Espécie:</strong> {item.acaoEspecie}</p>

                    {/* ALOCAÇÃO DE AGENTES UTILIZANDO APENAS CLASSES CSS */}
                    <div className="alocacao-agentes-container">
                        <label className="alocacao-agentes-label">
                            Designar Agentes Responsáveis <span className="text-danger">*</span>
                        </label>

                        {/* LISTA DE TAGS */}
                        <div className="tags-agentes-wrapper">
                            {agentesSelecionados.map(nome => (
                                <span key={nome} className="br-tag bg-success text-white tag-agente-item">
                                    {nome}
                                    <button
                                        type="button"
                                        className="btn-remover-tag"
                                        onClick={() => removerAgente(nome)}
                                        title="Remover Agente"
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </span>
                            ))}
                        </div>

                        {/* AUTOCOMPLETE */}
                        <div className="autocomplete-container">
                            <input
                                type="text"
                                className="br-input"
                                placeholder="Digite o nome do agente para adicionar..."
                                value={termoBusca}
                                onChange={(e) => setTermoBusca(e.target.value)}
                            />

                            {termoBusca && (
                                <ul className="autocomplete-dropdown">
                                    {agentesFiltrados.length > 0 ? (
                                        agentesFiltrados.map(agente => (
                                            <li
                                                key={agente.id || agente.nome}
                                                className="autocomplete-item"
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    adicionarAgente(agente.nome);
                                                }}
                                            >
                                                <i className="fas fa-user-plus mr-2 text-primary"></i>
                                                {agente.nome}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="autocomplete-empty">
                                            Nenhum agente livre com esse nome.
                                        </li>
                                    )}
                                </ul>
                            )}
                        </div>
                    </div>
                </>
            )}
            onConfirmarRecusa={handleConfirmarRecusa}
            onConfirmarAceite={handleConfirmarAceite}
        />
    );
}