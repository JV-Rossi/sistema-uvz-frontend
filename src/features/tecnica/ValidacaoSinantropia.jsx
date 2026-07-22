import React, { useState, useEffect } from 'react';
import ValidacaoRTBase from './ValidacaoRTBase';

export default function ValidacaoSinantropia({ setAbaAtiva }) {
    const [solicitacoes, setSolicitacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('pendente');

    useEffect(() => { buscarSolicitacoes(); }, [filtroStatus]);

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
        setSucesso(`Solicitação #${item.id} aprovada e enviada para a equipe de Sinantropia!`);
        setSolicitacoes(prev => prev.filter(s => s.id !== item.id));
        setTimeout(() => setSucesso(''), 3000);
    };

    const getCorEspecie = (especie) => {
        if (especie === 'Barbeiro') return 'bg-danger text-white';
        if (especie === 'Escorpião') return 'bg-warning text-dark';
        return 'bg-primary text-white';
    };

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
                </>
            )}
            onConfirmarRecusa={handleConfirmarRecusa}
            onConfirmarAceite={handleConfirmarAceite}
        />
    );
}