import React, { useState, useEffect } from 'react';

// 🟢 IMPORT: Base compartilhada da Validação do R.T.
import ValidacaoRTBase from '../../../shared/components/ValidacaoRTBase';

export default function ValidacaoSinantropia({ setAbaAtiva }) {
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
        setTimeout(() => {
            const dadosSimulados = [
                { id: 101, data: '20/07/2026', atendente: 'RECEPÇÃO UVZ', municipe: 'CARLOS EDUARDO', telefone: '(65) 99222-3333', bairro: 'CPA II', quarteirao: 14, distrito: 'DIS. NORTE', endereco: 'Rua 14, nº 210', tipoImovel: 'Residencial', acaoEspecie: 'Barbeiro', status: 'pendente' },
                { id: 102, data: '21/07/2026', atendente: 'RECEPÇÃO UVZ', municipe: 'MARIA AUXILIADORA', telefone: '(65) 98111-4444', bairro: 'TIJUCAL', quarteirao: 5, distrito: 'DIS. SUL', endereco: 'Av. Espigão, nº 50', tipoImovel: 'Comercial', acaoEspecie: 'Escorpião', status: 'pendente' }
            ];
            setSolicitacoes(filtroStatus === 'pendente' ? dadosSimulados : []);
            setLoading(false);
        }, 600);
    };

    const handleConfirmarRecusa = (item, justificativa) => {
        setSucesso(`Solicitação #${item.id} recusada com sucesso.`);
        setSolicitacoes(prev => prev.filter(s => s.id !== item.id));
        setTimeout(() => setSucesso(''), 4000);
    };

    const handleConfirmarAceite = (item) => {
        setSucesso(`Solicitação #${item.id} aprovada! Encaminhada para a lista de Busca Ativa em Campo.`);
        setSolicitacoes(prev => prev.filter(s => s.id !== item.id));
        setTimeout(() => setSucesso(''), 4000);
    };

    const getCorEspecie = (especie) => {
        if (especie === 'Barbeiro') return 'bg-danger text-white';
        if (especie === 'Escorpião') return 'bg-warning text-dark';
        return 'bg-primary text-white';
    };

    return (
        <ValidacaoRTBase
            titulo="Validação de Visitas Zoosanitárias (Sinantropia)"
            subtitulo="Painel do R.T. para triagem e autorização de chamados da população."
            icone="fa-bug"
            solicitacoes={solicitacoes}
            loading={loading}
            erro={erro}
            sucesso={sucesso}
            filtroStatus={filtroStatus}
            setFiltroStatus={setFiltroStatus}
            colunaCasoHeader="Demanda / Espécie"
            podeConfirmarAceite={true}
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
                    <p><strong>Munícipe / Solicitante:</strong> {item.municipe}</p>
                    <p><strong>Tipo de Imóvel:</strong> {item.tipoImovel}</p>
                    <p><strong>Demanda / Espécie:</strong> {item.acaoEspecie}</p>
                    <p><strong>Local:</strong> {item.endereco} - {item.bairro} ({item.distrito})</p>

                    <div className="br-message is-info mt-3 p-2 border rounded bg-light">
                        <small className="text-muted">
                            <i className="fas fa-info-circle mr-1 text-primary"></i> 
                            Ao aprovar, esta solicitação ficará disponível na aba <strong>Busca Ativa </strong>. A equipe de agentes responsáveis pela vistoria será informada diretamente no preenchimento do formulário de campo.
                        </small>
                    </div>
                </>
            )}
            onConfirmarRecusa={handleConfirmarRecusa}
            onConfirmarAceite={handleConfirmarAceite}
        />
    );
}