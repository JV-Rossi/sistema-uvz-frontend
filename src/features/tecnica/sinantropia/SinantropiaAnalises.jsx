import React, { useState, useEffect } from 'react';

// 🟢 IMPORTS DAS COMPONENTES E FORMULÁRIOS DE LABORATÓRIO
import PainelOperacionalBase from '../../../shared/components/PainelOperacionalBase';
import FormAnaliseTriatomineos from '../administrativo/formularios-os/FormAnaliseTriatomineos';
import FormAnaliseEscorpioes from '../administrativo/formularios-os/FormAnaliseEscorpioes'; // 🟢 Novo formulário importado
import FormAnaliseLarva from '../administrativo/formularios-os/FormAnaliseLarva';

export default function SinantropiaAnalises() {
    const [amostras, setAmostras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sucesso, setSucesso] = useState('');
    const [abaAtiva, setAbaAtiva] = useState('pendentes');

    useEffect(() => {
        // Simulação de amostras da bancada do laboratório
        setTimeout(() => {
            setAmostras([
                {
                    id: 501,
                    codigoTubo: 'TB-2026-089',
                    tipoAmostra: 'Barbeiro',
                    origem: 'Busca Ativa (CPA II)',
                    agenteColetor: 'JOAO VITOR ROSSI',
                    dataEntrada: '22/07/2026',
                    qtdExemplares: 3,
                    status: 'pendente'
                },
                {
                    id: 502,
                    codigoTubo: 'ESC-2026-014', // 🟢 Exemplo de amostra de Escorpião
                    tipoAmostra: 'Escorpião',
                    origem: 'Vistoria Zoosanitária (Tijucal)',
                    agenteColetor: 'HELIO SIMIAO',
                    dataEntrada: '23/07/2026',
                    qtdExemplares: 2,
                    status: 'pendente'
                },
                {
                    id: 503,
                    codigoTubo: 'TB-2026-090',
                    tipoAmostra: 'Larvas',
                    origem: 'LIA - Tijucal',
                    agenteColetor: 'CAMILA BENEDITA',
                    dataEntrada: '22/07/2026',
                    qtdExemplares: 12,
                    status: 'pendente'
                }
            ]);
            setLoading(false);
        }, 500);
    }, []);

    const handleSalvarAnalise = (id, dadosAnalise) => {
        setAmostras(prev => prev.map(item => item.id === id ? {
            ...item,
            status: 'executado',
            dadosAnalise
        } : item));

        setSucesso(`Laudo Laboratorial da Amostra #${id} (${dadosAnalise.resumo?.resultadoGeral || 'Emitido'}) emitido com sucesso!`);
        setTimeout(() => setSucesso(''), 4000);
    };

    const handleInviabilizarAmostra = (id, dadosCancelamento) => {
        setAmostras(prev => prev.map(item => item.id === id ? {
            ...item,
            status: 'nao_realizado',
            dadosCancelamento
        } : item));

        setSucesso(`Amostra #${id} registrada como Inviabilizada / Não Analisada.`);
        setTimeout(() => setSucesso(''), 4000);
    };

    return (
        <PainelOperacionalBase
            titulo="Sinantropia - Análises de Laboratório"
            subtitulo="Bancada Técnica: Identificação de espécies, taxonomia e exames de laboratório."
            icone="fa-microscope"
            itens={amostras}
            loading={loading}
            sucesso={sucesso}
            abaAtiva={abaAtiva}
            setAbaAtiva={setAbaAtiva}
            textoAbaPendentes="Amostras Fila de Análise"
            textoAbaConcluidos="Laudos Emitidos"
            tituloModalExecucao="Laudo Técnico de Análise Entomológica / Zoosanitária"
            onConfirmarCancelamento={handleInviabilizarAmostra}

            renderCardBadges={(item) => (
                <>
                    <span className="badge-distrito"><i className="fas fa-vial"></i> {item.codigoTubo}</span>
                    <span className={`badge-doenca ${item.tipoAmostra.toLowerCase()}`}>{item.tipoAmostra}</span>
                </>
            )}

            renderCardCorpo={(item) => (
                <>
                    <h3>{item.origem}</h3>
                    <p className="po-txt-endereco"><strong>Coletor:</strong> {item.agenteColetor}</p>
                    <p className="po-txt-endereco"><strong>Entrada:</strong> {item.dataEntrada}</p>
                    <p className="po-txt-detalhe"><strong>Qtd Recebida:</strong> {item.qtdExemplares} exemplar(es)</p>
                </>
            )}

            renderResumoExecutado={(item) => (
                <div className="po-boletim-resumo">
                    <hr className="po-divisor-card" />
                    <h4><i className="fas fa-file-medical-alt"></i> Laudo Final</h4>
                    <p><strong>Examinador:</strong> {item.dadosAnalise?.tecnicoAnalista || 'Não informado'}</p>
                    <p className="text-small text-muted">
                        Total Exemplares: {item.dadosAnalise?.resumo?.totalExemplares || 0}
                        {item.tipoAmostra === 'Escorpião' ? (
                            <> | Vivos: {item.dadosAnalise?.resumo?.vivos || 0} | Mortos: {item.dadosAnalise?.resumo?.mortos || 0}</>
                        ) : (
                            <> | Positivos: {item.dadosAnalise?.resumo?.totalPositivos || 0}</>
                        )}
                    </p>
                </div>
            )}

            renderFormExecucao={(item, fecharModal) => {
                // 1. LAUDO DE TRIATOMÍNEOS (BARBEIROS)
                if (item.tipoAmostra === 'Barbeiro') {
                    return (
                        <FormAnaliseTriatomineos
                            amostra={item}
                            onSubmitLaudo={(dadosLaudo) => {
                                handleSalvarAnalise(item.id, dadosLaudo);
                                fecharModal();
                            }}
                            onCancelar={fecharModal}
                        />
                    );
                }

                // 2. LAUDO DE ESCORPIÕES (🟢 CONECTADO)
                if (item.tipoAmostra === 'Escorpião') {
                    return (
                        <FormAnaliseEscorpioes
                            amostra={item}
                            onSubmitLaudo={(dadosLaudo) => {
                                handleSalvarAnalise(item.id, dadosLaudo);
                                fecharModal();
                            }}
                            onCancelar={fecharModal}
                        />
                    );
                }

                // 3. LAUDO DE LARVAS 
                if (item.tipoAmostra === 'Larvas' || item.tipoAmostra === 'Larva') {
                    return (
                        <FormAnaliseLarva
                            amostra={item}
                            onSubmitLaudo={(dadosLaudo) => {
                                handleSalvarAnalise(item.id, dadosLaudo);
                                fecharModal();
                            }}
                            onCancelar={fecharModal}
                        />
                    );
                }

                // 3. OUTROS LAUDOS (EM DESENVOLVIMENTO)
                return (
                    <div className="p-4 text-center">
                        <h4>Identificação de Bancada: {item.tipoAmostra} ({item.codigoTubo})</h4>
                        <p className="text-muted">Formulário de laudo específico para <strong>{item.tipoAmostra}</strong> em desenvolvimento.</p>
                        <div className="mt-3">
                            <button
                                className="btn-confirmar-boletim mr-2"
                                onClick={() => {
                                    handleSalvarAnalise(item.id, { resultado: 'Análise Concluída em Bancada' });
                                    fecharModal();
                                }}
                            >
                                Finalizar Laudo Teste
                            </button>
                            <button className="btn-cancelar" onClick={fecharModal}>Cancelar</button>
                        </div>
                    </div>
                );
            }}
        />
    );
}