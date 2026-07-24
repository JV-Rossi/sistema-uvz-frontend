import React, { useState, useEffect } from 'react';

// 🟢 IMPORTS ATUALIZADOS CONFORME A NOVA NOMECLATURA
import PainelOperacionalBase from '../../../shared/components/PainelOperacionalBase';
import FormBuscaTriatomineos from '../administrativo/formularios-os/FormBuscaTriatomineos';

export default function SinantropiaBuscaAtiva() {
    const [demandas, setDemandas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sucesso, setSucesso] = useState('');
    const [abaAtiva, setAbaAtiva] = useState('pendentes');

    useEffect(() => {
        setTimeout(() => {
            setDemandas([
                {
                    id: 201,
                    especie: 'Barbeiro',
                    municipe: 'CARLOS EDUARDO',
                    bairro: 'CPA II',
                    distrito: 'DIS. NORTE',
                    quarteirao: 14,
                    endereco: 'Rua 14, nº 210',
                    tipoImovel: 'Residencial',
                    status: 'pendente',
                    dataDesignacao: '20/07/2026',
                    equipeAlocada: 'JOAO VITOR ROSSI, CAMILA BENEDITA'
                },
                {
                    id: 202,
                    especie: 'Escorpião',
                    municipe: 'MARIA AUXILIADORA',
                    bairro: 'TIJUCAL',
                    distrito: 'DIS. SUL',
                    quarteirao: 5,
                    endereco: 'Av. Espigão, nº 50',
                    tipoImovel: 'Comercial',
                    status: 'pendente',
                    dataDesignacao: '21/07/2026',
                    equipeAlocada: 'HELIO SIMIAO'
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

        setSucesso(`Ação de Busca Ativa em Campo #${id} registrada com sucesso!`);
        setTimeout(() => setSucesso(''), 4000);
    };

    const handleSalvarCancelamento = (id, dadosCancelamento) => {
        setDemandas(prev => prev.map(item => item.id === id ? {
            ...item,
            status: 'nao_realizado',
            dadosCancelamento
        } : item));

        setSucesso(`Visita de Busca Ativa #${id} registrada como Não Realizada.`);
        setTimeout(() => setSucesso(''), 4000);
    };

    return (
        <PainelOperacionalBase
            titulo="Visitas Zoosanitárias e Busca Ativa (Sinantropia)"
            subtitulo="Ações de campo: Inspeção de imóvel, captura de espécimes e manejo de fauna sinantrópica."
            icone="fa-search-location"
            itens={demandas}
            loading={loading}
            sucesso={sucesso}
            abaAtiva={abaAtiva}
            setAbaAtiva={setAbaAtiva}
            textoAbaPendentes="Visitas Pendentes"
            textoAbaConcluidos="Visitas Finalizadas"
            tituloModalExecucao="Ficha de Pesquisa Entomológica / Zoosanitária"
            onConfirmarCancelamento={handleSalvarCancelamento}

            renderCardBadges={(item) => (
                <>
                    <span className="badge-distrito"><i className="fas fa-map-marker-alt"></i> {item.distrito}</span>
                    <span className={`badge-doenca ${item.especie.toLowerCase()}`}>{item.especie}</span>
                </>
            )}

            renderCardCorpo={(item) => (
                <>
                    <h3>{item.bairro}</h3>
                    <p className="po-txt-endereco"><strong>Morador / Solicitante:</strong> {item.municipe}</p>
                    <p className="po-txt-endereco"><strong>Local:</strong> Quart. {item.quarteirao} - {item.endereco}</p>
                    <p className="po-txt-detalhe"><strong>Equipe Designada:</strong> {item.equipeAlocada}</p>
                </>
            )}

            renderResumoExecutado={(item) => (
                <div className="po-boletim-resumo">
                    <hr className="po-divisor-card" />
                    <h4><i className="fas fa-clipboard-check"></i> Resumo da Vistoria</h4>
                    <p><strong>Status:</strong> Visita Realizada</p>
                </div>
            )}

            renderFormExecucao={(item, fecharModal) => {
                if (item.especie === 'Barbeiro') {
                    return (
                        <FormBuscaTriatomineos
                            onSubmitLaudo={(dados) => {
                                handleSalvarBusca(item.id, dados);
                                fecharModal();
                            }}
                            onCancelar={fecharModal}
                        />
                    );
                }

                return (
                    <div className="p-4 text-center">
                        <p>Formulário de Busca Ativa de Campo para <strong>{item.especie}</strong> em desenvolvimento.</p>
                        <button className="btn-cancelar mt-2" onClick={fecharModal}>Fechar</button>
                    </div>
                );
            }}
        />
    );
}