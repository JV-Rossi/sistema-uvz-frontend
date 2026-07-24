import React, { useState, useEffect } from 'react';

// 🟢 IMPORT ATUALIZADO: Apontando para o componente base em src/shared/components/
import PainelOperacionalBase from '../../../shared/components/PainelOperacionalBase';

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

        setSucesso(`Laudo Laboratorial da Amostra #${id} emitido com sucesso!`);
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
            tituloModalExecucao="Laudo Técnico de Análise Entomológica"
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
                    <p><strong>Resultado:</strong> {item.dadosAnalise?.resultado || 'Laudo Emitido'}</p>
                </div>
            )}

            renderFormExecucao={(item, fecharModal) => (
                <div className="p-4 text-center">
                    <h4>Identificação de Bancada: {item.tipoAmostra} ({item.codigoTubo})</h4>
                    <p className="text-muted">Formulário de laudo específico para <strong>{item.tipoAmostra}</strong>.</p>
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
            )}
        />
    );
}