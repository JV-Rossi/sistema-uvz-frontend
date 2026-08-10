import React, { useState, useEffect } from 'react';

// 🎨 IMPORTS DE ESTILOS GLOBAIS DE FORMULÁRIO
import '../../../shared/components/Formularios.css';

// 🟢 IMPORTS DOS COMPONENTES E FORMULÁRIOS DE CAMPO
import PainelOperacionalBase from '../../../shared/components/PainelOperacionalBase';
import FormVistoriaLeishmaniose from './FormVistoriaLeishmaniose';
import EpizootiaResultados from './EpizootiaResultados';

export default function EpizootiaBusca() {
    const [demandas, setDemandas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sucesso, setSucesso] = useState('');
    const [abaAtiva, setAbaAtiva] = useState('pendentes');

    useEffect(() => {
        setTimeout(() => {
            setDemandas([
                {
                    id: 301,
                    servico: 'Leishmaniose Canina',
                    municipe: 'JOÃO DA SILVA',
                    bairro: 'PEDRA 90',
                    distrito: 'DIS. SUL',
                    quarteirao: 22,
                    endereco: 'Rua 30, nº 105',
                    tipoImovel: 'Residencial',
                    status: 'pendente',
                    dataDesignacao: '10/08/2026',
                    equipeAlocada: 'CARLOS ALBERTO, ANA PAULA',
                    qtdAnimais: 2
                },
                {
                    id: 302,
                    servico: 'Vacinação Antirrábica',
                    municipe: 'MARCOS TADEU',
                    bairro: 'LIXEIRA',
                    distrito: 'DIS. LESTE',
                    quarteirao: 8,
                    endereco: 'Rua das Flores, nº 44',
                    tipoImovel: 'Residencial',
                    status: 'pendente',
                    dataDesignacao: '11/08/2026',
                    equipeAlocada: 'JOAO VITOR ROSSI',
                    qtdAnimais: 1
                }
            ]);
            setLoading(false);
        }, 500);
    }, []);

    const handleSalvarBusca = (id, dadosFormulario) => {
        setDemandas(prev => prev.map(item => item.id === id ? {
            ...item,
            status: 'executado',
            dadosBusca: dadosFormulario
        } : item));

        setSucesso(`Ação de Campo / Epizootias #${id} registrada com sucesso!`);
        setTimeout(() => setSucesso(''), 4000);
    };

    const handleSalvarCancelamento = (id, dadosCancelamento) => {
        setDemandas(prev => prev.map(item => item.id === id ? {
            ...item,
            status: 'nao_realizado',
            dadosCancelamento
        } : item));

        setSucesso(`Visita de Epizootias #${id} registrada como Não Realizada.`);
        setTimeout(() => setSucesso(''), 4000);
    };

    return (
        <PainelOperacionalBase
            titulo="Visitas Zoosanitárias e Monitoramento de Campo (Epizootias)"
            subtitulo="Ações de campo: Testagem de Leishmaniose, Vacinação Antirrábica Focal e Manejo Zoonótico."
            icone="fa-paw"
            itens={demandas}
            loading={loading}
            sucesso={sucesso}
            abaAtiva={abaAtiva}
            setAbaAtiva={setAbaAtiva}
            textoAbaPendentes="Visitas Pendentes"
            textoAbaConcluidos="Visitas Finalizadas"
            tituloModalExecucao="Ficha de Vistoria de Epizootias e Coleta de Dados Caninos/Felinos"
            onConfirmarCancelamento={handleSalvarCancelamento}

            renderCardBadges={(item) => (
                <>
                    <span className="badge-distrito"><i className="fas fa-map-marker-alt"></i> {item.distrito}</span>
                    <span className={`badge-doenca ${item.servico.toLowerCase().includes('leish') ? 'leishmaniose' : 'vacinacao'}`}>
                        {item.servico}
                    </span>
                </>
            )}

            renderCardCorpo={(item) => (
                <>
                    <h3>{item.bairro}</h3>
                    <p className="po-txt-endereco"><strong>Tutor / Solicitante:</strong> {item.municipe}</p>
                    <p className="po-txt-endereco"><strong>Local:</strong> Quart. {item.quarteirao} - {item.endereco}</p>
                    <p className="po-txt-detalhe"><strong>Equipe Designada:</strong> {item.equipeAlocada}</p>
                </>
            )}

            renderResumoExecutado={(item) => (
                <div className="po-boletim-resumo">
                    <hr className="po-divisor-card" />
                    <h4><i className="fas fa-clipboard-check"></i> Resumo da Vistoria</h4>
                    <p><strong>Status:</strong> Visita Realizada</p>
                    {item.dadosBusca && (
                        <p><strong>Animais Vistoriados:</strong> {item.dadosBusca.totalVistoriados || 0}</p>
                    )}
                </div>
            )}

            renderFormExecucao={(item, fecharModal) => {
                if (item.servico.toLowerCase().includes('leish')) {
                    return (
                        <FormVistoriaLeishmaniose
                            osSelecionada={item}
                            onSubmitLaudo={(dados) => {
                                handleSalvarBusca(item.id, dados);
                                fecharModal();
                            }}
                            onCancelar={fecharModal}
                        />
                    );
                }

                return (
                    <EpizootiaResultados
                        osSelecionada={item}
                        onSalvar={(dados) => {
                            handleSalvarBusca(item.id, dados);
                            fecharModal();
                        }}
                        onCancelar={fecharModal}
                    />
                );
            }}
        />
    );
}