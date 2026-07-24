import React, { useState, useEffect } from 'react';

// 🟢 IMPORTS ATUALIZADOS CONFORME A NOVA ESTRUTURA DE PASTAS
import PainelOperacionalBase from '../../../shared/components/PainelOperacionalBase';
import FormExecucaoBloqueio from '../administrativo/formularios-os/FormExecucaoBloqueio';

export default function BloqueioQuimico() {
    const [bloqueios, setBloqueios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sucesso, setSucesso] = useState('');
    const [abaAtiva, setAbaAtiva] = useState('pendentes');

    useEffect(() => {
        // Simulação de busca dos bloqueios no banco
        setTimeout(() => {
            setBloqueios([
                { id: 101, paciente: 'MARIA DA SILVA', bairro: 'ALPHAVILLE I', distrito: 'DIS. NORTE', quarteirao: 12, endereco: 'Rua das Orquídeas, Qd 5, Lt 12', suspeita: 'Dengue', status: 'programado', dataExecucao: '2026-07-16', horaExecucao: '08:00', supervisorResponsavel: 'PEDRO ALMEIDA' },
                { id: 102, paciente: 'ROBERTO CARLOS', bairro: 'COND. ATHENAS', distrito: 'DIS. SUL', quarteirao: 5, endereco: 'Casa 45', suspeita: 'Zika', status: 'programado', dataExecucao: '2026-07-16', horaExecucao: '09:30', supervisorResponsavel: 'PEDRO ALMEIDA' }
            ]);
            setLoading(false);
        }, 600);
    }, []);

    // Handlers de atualização de estado
    const handleSalvarExecucao = (id, dadosExecucao) => {
        setBloqueios(prev => prev.map(b => b.id === id ? { ...b, status: 'executado', dadosExecucao } : b));
        setSucesso("Boletim de borrifação enviado com sucesso!");
        setTimeout(() => setSucesso(''), 4000);
    };

    const handleSalvarCancelamento = (id, dadosCancelamento) => {
        setBloqueios(prev => prev.map(b => b.id === id ? { ...b, status: 'nao_realizado', dadosCancelamento } : b));
        setSucesso("Bloqueio registrado como NÃO REALIZADO.");
        setTimeout(() => setSucesso(''), 4000);
    };

    return (
        <PainelOperacionalBase
            titulo="Execução de Bloqueio Químico (Borrifação)"
            subtitulo="Painel de Campo: Registro de aplicações espaciais e boletins."
            icone="fa-shield-alt"
            itens={bloqueios}
            loading={loading}
            sucesso={sucesso}
            abaAtiva={abaAtiva}
            setAbaAtiva={setAbaAtiva}
            onConfirmarCancelamento={handleSalvarCancelamento}

            renderCardBadges={(b) => (
                <>
                    <span className="badge-distrito"><i className="fas fa-map-marker-alt"></i> {b.distrito}</span>
                    <span className={`badge-doenca ${b.suspeita.toLowerCase()}`}>{b.suspeita}</span>
                </>
            )}

            renderCardCorpo={(b) => (
                <>
                    <h3>{b.bairro}</h3>
                    <p className="bq-txt-endereco"><strong>Paciente:</strong> {b.paciente}</p>
                    <p className="bq-txt-endereco"><strong>Local:</strong> Quart. {b.quarteirao} - {b.endereco}</p>
                </>
            )}

            renderResumoExecutado={(b) => (
                <div className="bq-boletim-resumo">
                    <hr className="bq-divisor-card" />
                    <h4><i className="fas fa-file-signature"></i> Resumo do Boletim</h4>
                    <p><strong>Aplicação:</strong> {b.dadosExecucao.totalImoveis} imóveis em {b.dadosExecucao.totalTempo} min</p>
                    <p className="bq-destaque-consumo"><i className="fas fa-flask"></i> {b.dadosExecucao.consumoConcentrado} de {b.dadosExecucao.inseticida}</p>
                </div>
            )}

            /* Modal de Execução usando o componente externo */
            renderFormExecucao={(bloqueio, fecharModal) => (
                <FormExecucaoBloqueio
                    bloqueio={bloqueio}
                    onSalvar={(dados) => { handleSalvarExecucao(bloqueio.id, dados); fecharModal(); }}
                    onCancelar={fecharModal}
                />
            )}
        />
    );
}