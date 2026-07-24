import React, { useState, useEffect } from 'react';

// 🟢 IMPORT ATUALIZADO: Apontando para a base compartilhada em src/shared/components/
import ValidacaoRTBase from '../../../shared/components/ValidacaoRTBase';

export default function ValidacaoBloqueios({ setAbaAtiva }) {
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
            setTimeout(() => {
                // Mock de solicitações epidemiológicas de Bloqueio de Foco (Arboviroses)
                const dadosSimulados = [
                    { id: 1, data: '16/07/2026', agente: 'JOAO VITOR ROSSI', paciente: 'MARIA DA SILVA', telefone: '(65) 99999-1111', bairro: 'ALPHAVILLE I', quarteirao: 12, zona: 'URBANA', desmembramento: '', distrito: 'DIS. NORTE', endereco: 'Rua das Orquídeas, Qd 5, Lt 12', suspeita: 'Dengue', dataSintomas: '12/07/2026', status: 'pendente' },
                    { id: 2, data: '16/07/2026', agente: 'CAMILA BENEDITA', paciente: 'ROBERTO CARLOS', telefone: '', bairro: 'COND. ATHENAS', quarteirao: 5, zona: 'URBANA', desmembramento: 'A', distrito: 'DIS. SUL', endereco: 'Casa 45', suspeita: 'Zika', dataSintomas: '14/07/2026', status: 'pendente' },
                    { id: 3, data: '15/07/2026', agente: 'HELIO SIMIAO', paciente: 'ANA JULIA', telefone: '(65) 98888-2222', bairro: 'BRASIL 21', quarteirao: 8, zona: 'PERIURBANA', desmembramento: '', distrito: 'DIS. LESTE', endereco: 'Rua B, Qd 2, Lt 8', suspeita: 'Chikungunya', dataSintomas: '10/07/2026', status: 'pendente' },
                ];
                setSolicitacoes(filtroStatus === 'pendente' ? dadosSimulados : []);
                setLoading(false);
            }, 800);
        } catch (err) {
            setErro("Erro ao carregar as solicitações de bloqueio.");
            setLoading(false);
        }
    };

    const handleConfirmarRecusa = (item, justificativa) => {
        setSucesso(`Solicitação #${item.id} recusada com sucesso. Parecer enviado ao agente.`);
        setSolicitacoes(prev => prev.filter(s => s.id !== item.id));
        setTimeout(() => setSucesso(''), 4000);
    };

    const handleConfirmarAceite = (item) => {
        setSucesso(`Solicitação #${item.id} aprovada e delegada à equipe de campo e borrifadores.`);
        setSolicitacoes(prev => prev.filter(s => s.id !== item.id));
        setTimeout(() => setSucesso(''), 3000);
    };

    const getCorSuspeita = (doenca) => {
        if (doenca === 'Dengue') return 'bg-danger text-white';
        if (doenca === 'Zika') return 'bg-warning text-dark';
        if (doenca === 'Chikungunya') return 'bg-info text-white';
        return 'bg-secondary text-white';
    };

    return (
        <ValidacaoRTBase
            titulo="Validação de Bloqueios"
            subtitulo="Painel do Responsável Técnico para avaliação epidemiológica de solicitações do campo."
            icone="fa-shield-alt"
            solicitacoes={solicitacoes}
            loading={loading}
            erro={erro}
            sucesso={sucesso}
            filtroStatus={filtroStatus}
            setFiltroStatus={setFiltroStatus}
            colunaCasoHeader="Dados do Caso Epidemiológico"
            
            // Renderiza a especificidade da Arbovirose na tabela
            renderDadosCaso={(item) => (
                <>
                    <span className={`br-tag mb-1 ${getCorSuspeita(item.suspeita)}`}>
                        Suspeita: {item.suspeita}
                    </span>
                    <p className="mb-0 text-small mt-1">
                        <strong>Munícipe/Paciente:</strong> {item.paciente}
                    </p>
                    <p className="mb-0 text-small text-muted">
                        <strong>Início Sintomas:</strong> {item.dataSintomas}
                    </p>
                </>
            )}

            // Renderiza os detalhes de saúde no Modal de Aceite/Delegação
            renderInfoModalAceite={(item) => (
                <>
                    <p><strong>Paciente Notificado:</strong> {item.paciente}</p>
                    <p>
                        <strong>Suspeita Epidemiológica:</strong> 
                        <span className={`br-tag ml-2 ${getCorSuspeita(item.suspeita)}`}>
                            {item.suspeita}
                        </span>
                    </p>
                    <p><strong>Data de Início dos Sintomas:</strong> {item.dataSintomas}</p>
                </>
            )}

            onConfirmarRecusa={handleConfirmarRecusa}
            onConfirmarAceite={handleConfirmarAceite}
        />
    );
}