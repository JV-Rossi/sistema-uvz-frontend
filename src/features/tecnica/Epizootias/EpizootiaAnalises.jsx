import React, { useState, useEffect } from 'react';

// 🟢 IMPORTS DOS COMPONENTES E ESTILOS DE LABORATÓRIO
import PainelOperacionalBase from '../../../shared/components/PainelOperacionalBase';
import '../../../shared/components/Formularios.css';
import '../administrativo/formularios-os/FormAnaliseBase.css';

export default function EpizootiaAnalises() {
    const [amostras, setAmostras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sucesso, setSucesso] = useState('');
    const [abaAtiva, setAbaAtiva] = useState('pendentes');

    useEffect(() => {
        setTimeout(() => {
            setAmostras([
                {
                    id: 601,
                    codigoTubo: 'LEISH-2026-042',
                    tipoAmostra: 'Sorologia Leishmaniose (EIE/ELISA)',
                    origem: 'Vistoria Zoosanitária (Pedra 90)',
                    agenteColetor: 'CARLOS ALBERTO',
                    municipe: 'JOÃO DA SILVA',
                    dataEntrada: '05/08/2026',
                    qtdExemplares: 2,
                    status: 'pendente'
                },
                {
                    id: 602,
                    codigoTubo: 'DPP-2026-018',
                    tipoAmostra: 'Teste Rápido DPP',
                    origem: 'Busca Ativa (CPA III)',
                    agenteColetor: 'ANA PAULA',
                    municipe: 'MARIA AUXILIADORA',
                    dataEntrada: '08/08/2026',
                    qtdExemplares: 3,
                    status: 'pendente'
                },
                {
                    id: 603,
                    codigoTubo: 'RAI-2026-005',
                    tipoAmostra: 'Raiva Animal (Amostra)',
                    origem: 'Notificação Epizootia (Lixeira)',
                    agenteColetor: 'JOAO VITOR ROSSI',
                    municipe: 'MARCOS TADEU',
                    dataEntrada: '09/08/2026',
                    qtdExemplares: 1,
                    status: 'pendente'
                }
            ]);
            setLoading(false);
        }, 500);
    }, []);

    // 1️⃣ Envia o Laudo de Bancada e move para "Encerramentos"
    const handleSalvarAnalise = (id, dadosAnalise) => {
        setAmostras(prev => prev.map(item => item.id === id ? {
            ...item,
            status: 'encerramento',
            dadosAnalise
        } : item));

        setSucesso(`Laudo da Amostra #${id} emitido! Encaminhado para Encerramentos.`);
        setTimeout(() => setSucesso(''), 4000);
    };

    // 2️⃣ Conclui o Encerramento e move para "Serviços Concluídos"
    const handleFinalizarEncerramento = (id) => {
        setAmostras(prev => prev.map(item => item.id === id ? {
            ...item,
            status: 'executado',
            dataEncerramento: new Date().toLocaleDateString('pt-BR')
        } : item));

        setSucesso(`Serviço #${id} encerrado e concluído com sucesso!`);
        setTimeout(() => setSucesso(''), 4000);
    };

    const handleInviabilizarAmostra = (id, dadosCancelamento) => {
        setAmostras(prev => prev.map(item => item.id === id ? {
            ...item,
            status: 'nao_realizado',
            dadosCancelamento
        } : item));

        setSucesso(`Amostra #${id} registrada como Inviabilizada / Hemolisada / Não Analisada.`);
        setTimeout(() => setSucesso(''), 4000);
    };

    return (
        <PainelOperacionalBase
            titulo="Epizootias - Análises de Laboratório e Retaguarda"
            subtitulo="Bancada Técnica: Sorologia de Leishmaniose (ELISA/RIFI), Validação DPP e Diagnóstico Zoonótico."
            icone="fa-microscope"
            itens={amostras}
            loading={loading}
            sucesso={sucesso}
            abaAtiva={abaAtiva}
            setAbaAtiva={setAbaAtiva}

            /* 🟢 CONFIGURAÇÃO DAS 3 ABAS SOLICITADAS */
            textoAbaPendentes="Amostras Fila de Análise"
            textoAbaEncerramentos="Encerramentos"
            textoAbaConcluidos="Serviços Concluídos"

            tituloModalExecucao="Laudo Técnico de Análise Zoonótica / Laboratorial"
            onConfirmarCancelamento={handleInviabilizarAmostra}

            renderCardBadges={(item) => (
                <>
                    <span className="badge-distrito"><i className="fas fa-vial"></i> {item.codigoTubo}</span>
                    <span className={`badge-doenca ${item.tipoAmostra.toLowerCase().includes('leish') ? 'leishmaniose' : 'vacinacao'}`}>
                        {item.tipoAmostra}
                    </span>
                </>
            )}

            renderCardCorpo={(item) => (
                <>
                    <h3>{item.origem}</h3>
                    <p className="po-txt-endereco"><strong>Tutor / Solicitante:</strong> {item.municipe}</p>
                    <p className="po-txt-endereco"><strong>Coletor:</strong> {item.agenteColetor}</p>
                    <p className="po-txt-endereco"><strong>Entrada:</strong> {item.dataEntrada}</p>
                    <p className="po-txt-detalhe"><strong>Qtd Recebida:</strong> {item.qtdExemplares} amostra(s)/animal(is)</p>
                </>
            )}

            renderResumoExecutado={(item) => (
                <div className="po-boletim-resumo">
                    <hr className="po-divisor-card" />
                    <h4><i className="fas fa-file-medical-alt"></i> Laudo Laboratorial</h4>
                    <p><strong>Examinador / Laboratorista:</strong> {item.dadosAnalise?.tecnicoAnalista || 'Não informado'}</p>
                    <p><strong>Resultado Geral:</strong> <span className="font-weight-bold text-primary">{item.dadosAnalise?.resumo?.resultadoGeral || 'Concluído'}</span></p>
                    <p className="text-small text-muted">
                        Total Amostras: {item.dadosAnalise?.resumo?.totalExemplares || 0}
                        | Reagentes (+): {item.dadosAnalise?.resumo?.totalReagentes || 0}
                        | Não Reagentes (-): {item.dadosAnalise?.resumo?.totalNaoReagentes || 0}
                    </p>

                    {/* BOTÃO PARA CONCLUIR O SERVIÇO NA ABA "ENCERRAMENTOS" */}
                    {item.status === 'encerramento' && (
                        <button
                            type="button"
                            className="btn-executar mt-3 w-100"
                            style={{ backgroundColor: '#0288d1', color: '#fff' }}
                            onClick={() => handleFinalizarEncerramento(item.id)}
                        >
                            <i className="fas fa-check-double mr-1"></i> Finalizar Encerramento
                        </button>
                    )}
                </div>
            )}

            renderFormExecucao={(item, fecharModal) => (
                <FormAnaliseEpizootias
                    amostra={item}
                    onSubmitLaudo={(dadosLaudo) => {
                        handleSalvarAnalise(item.id, dadosLaudo);
                        fecharModal();
                    }}
                    onCancelar={fecharModal}
                />
            )}
        />
    );
}

function FormAnaliseEpizootias({ amostra, onSubmitLaudo, onCancelar }) {
    const [tecnicoAnalista, setTecnicoAnalista] = useState('');
    const [dataAnalise, setDataAnalise] = useState(new Date().toISOString().split('T')[0]);
    const [metodoKit, setMetodoKit] = useState('ELISA / EIE Confirmatório');
    const [loteKit, setLoteKit] = useState('');
    const [observacoes, setObservacoes] = useState('');

    const [resultadosAnimais, setResultadosAnimais] = useState([
        {
            id: Date.now(),
            identificacaoAnimal: 'Animal #1 (Cão)',
            especie: 'CÃO',
            resultadoExame: 'Não Reagente',
            titulacao: '1:40',
            parecerIndividual: 'Amostra Sorológica Negativa'
        }
    ]);

    const handleAdicionarLinha = () => {
        setResultadosAnimais(prev => [
            ...prev,
            {
                id: Date.now() + Math.random(),
                identificacaoAnimal: `Animal #${prev.length + 1}`,
                especie: 'CÃO',
                resultadoExame: 'Não Reagente',
                titulacao: '1:40',
                parecerIndividual: 'Amostra Sorológica Negativa'
            }
        ]);
    };

    const handleRemoverLinha = (id) => {
        if (resultadosAnimais.length === 1) return;
        setResultadosAnimais(prev => prev.filter(item => item.id !== id));
    };

    const handleLinhaChange = (id, campo, valor) => {
        setResultadosAnimais(prev => prev.map(item => item.id === id ? { ...item, [campo]: valor } : item));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!tecnicoAnalista.trim()) {
            alert("Por favor, preencha o nome do laboratorista / examinador responsável.");
            return;
        }

        const totalExemplares = resultadosAnimais.length;
        const totalReagentes = resultadosAnimais.filter(a => a.resultadoExame === 'Reagente' || a.resultadoExame === 'Positivo').length;
        const totalNaoReagentes = resultadosAnimais.filter(a => a.resultadoExame === 'Não Reagente' || a.resultadoExame === 'Negativo').length;
        const totalInconclusivos = resultadosAnimais.filter(a => a.resultadoExame === 'Inconclusivo').length;

        let resultadoGeral = 'NÃO REAGENTE (-)';
        if (totalReagentes > 0) resultadoGeral = 'REAGENTE (+)';
        else if (totalInconclusivos > 0) resultadoGeral = 'INCONCLUSIVO';

        const laudoCompleto = {
            amostraId: amostra?.id,
            codigoTubo: amostra?.codigoTubo,
            tecnicoAnalista,
            dataAnalise,
            metodoKit,
            loteKit,
            resultadosAnimais,
            resumo: {
                totalExemplares,
                totalReagentes,
                totalNaoReagentes,
                totalInconclusivos,
                resultadoGeral
            },
            observacoes
        };

        if (onSubmitLaudo) {
            onSubmitLaudo(laudoCompleto);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="po-form-container p-2">
            {amostra && (
                <div className="br-card p-3 mb-3 bg-light border-left-primary border rounded">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <div>
                            <span className="badge-distrito"><i className="fas fa-vial mr-1"></i> {amostra.codigoTubo}</span>
                            <span className="ml-2 font-weight-bold text-primary">{amostra.tipoAmostra}</span>
                        </div>
                        <div className="text-small text-muted">
                            <i className="fas fa-user mr-1"></i> Tutor: <strong>{amostra.municipe}</strong> | Coletor: <strong>{amostra.agenteColetor}</strong> | Entrada: <strong>{amostra.dataEntrada}</strong>
                        </div>
                    </div>
                </div>
            )}

            <div className="po-card-secao mb-4 border rounded p-3 bg-white shadow-sm">
                <div className="po-subtitulo-form border-bottom pb-2 mb-3 text-primary font-weight-bold">
                    <i className="fas fa-microscope mr-2"></i> 1. Identificação Técnica de Bancada
                </div>

                <div className="po-form-linha-tripla">
                    <div className="po-form-group">
                        <label>Laboratorista / Examinador <span className="obrigatorio">*</span></label>
                        <input
                            type="text"
                            placeholder="Nome completo do examinador"
                            value={tecnicoAnalista}
                            onChange={(e) => setTecnicoAnalista(e.target.value)}
                            required
                        />
                    </div>

                    <div className="po-form-group">
                        <label>Data do Exame <span className="obrigatorio">*</span></label>
                        <input
                            type="date"
                            value={dataAnalise}
                            onChange={(e) => setDataAnalise(e.target.value)}
                            required
                        />
                    </div>

                    <div className="po-form-group">
                        <label>Método / Kit Utilizado <span className="obrigatorio">*</span></label>
                        <select value={metodoKit} onChange={(e) => setMetodoKit(e.target.value)}>
                            <option value="ELISA / EIE Confirmatório">ELISA / EIE Confirmatório</option>
                            <option value="RIFI (Imunofluorescência Reativa)">RIFI (Imunofluorescência)</option>
                            <option value="DPP Validação Bancada">DPP Validação de Bancada</option>
                            <option value="Imunofluorescência Direta (Raiva)">IFD (Diagnóstico de Raiva)</option>
                        </select>
                    </div>
                </div>

                <div className="po-form-group mt-3">
                    <label>Nº do Lote / Validade do Kit Diagnóstico</label>
                    <input
                        type="text"
                        placeholder="Ex: Lote Biomanguinhos LVC-2026/04"
                        value={loteKit}
                        onChange={(e) => setLoteKit(e.target.value)}
                    />
                </div>
            </div>

            <div className="po-card-secao mb-4 border rounded p-3 bg-white shadow-sm">
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3 flex-wrap gap-2">
                    <span className="po-subtitulo-form text-primary font-weight-bold m-0">
                        <i className="fas fa-vial mr-2"></i> 2. Resultados Analíticos da Bancada por Amostra
                    </span>
                    <button
                        type="button"
                        className="br-button primary small"
                        onClick={handleAdicionarLinha}
                    >
                        <i className="fas fa-plus mr-1"></i> Adicionar Amostra
                    </button>
                </div>

                <div className="table-responsive">
                    <table className="triato-analise-table">
                        <thead>
                            <tr>
                                <th style={{ width: '5%' }}>#</th>
                                <th style={{ width: '25%' }}>Identificação do Animal</th>
                                <th style={{ width: '15%' }}>Espécie</th>
                                <th style={{ width: '25%' }}>Resultado Sorológico</th>
                                <th style={{ width: '20%' }}>Titulação / Corte</th>
                                <th style={{ width: '10%', textAlign: 'center' }}>Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultadosAnimais.map((ra, index) => (
                                <tr key={ra.id}>
                                    <td className="text-center font-weight-bold">{index + 1}</td>
                                    <td>
                                        <input
                                            type="text"
                                            className="triato-input-texto"
                                            placeholder="Ex: Cão Rex / Amostra A"
                                            value={ra.identificacaoAnimal}
                                            onChange={(e) => handleLinhaChange(ra.id, 'identificacaoAnimal', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <select
                                            className="triato-select-grid"
                                            value={ra.especie}
                                            onChange={(e) => handleLinhaChange(ra.id, 'especie', e.target.value)}
                                        >
                                            <option value="CÃO">Cão</option>
                                            <option value="GATO">Gato</option>
                                            <option value="OUTRO">Outro</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select
                                            className="triato-select-grid font-weight-bold"
                                            value={ra.resultadoExame}
                                            onChange={(e) => handleLinhaChange(ra.id, 'resultadoExame', e.target.value)}
                                        >
                                            <option value="Não Reagente">Não Reagente (-)</option>
                                            <option value="Reagente">Reagente (+)</option>
                                            <option value="Inconclusivo">Inconclusivo</option>
                                            <option value="Amostra Inviável">Amostra Inviável/Hemolisada</option>
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            className="triato-input-texto"
                                            placeholder="Ex: 1:80 ou Cut-off 0.850"
                                            value={ra.titulacao}
                                            onChange={(e) => handleLinhaChange(ra.id, 'titulacao', e.target.value)}
                                        />
                                    </td>
                                    <td className="text-center">
                                        <button
                                            type="button"
                                            className="btn-remover-linha"
                                            title="Remover Amostra"
                                            onClick={() => handleRemoverLinha(ra.id)}
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="triato-resumo-bancada mt-3 p-2 rounded bg-light border d-flex justify-content-around text-center flex-wrap gap-2">
                    <div>
                        <small className="text-muted d-block text-uppercase font-weight-bold">Total Amostras</small>
                        <span className="h6 font-weight-bold">{resultadosAnimais.length}</span>
                    </div>
                    <div>
                        <small className="text-success d-block text-uppercase font-weight-bold">Não Reagentes</small>
                        <span className="h6 text-success font-weight-bold">{resultadosAnimais.filter(e => e.resultadoExame === 'Não Reagente').length}</span>
                    </div>
                    <div>
                        <small className="text-danger d-block text-uppercase font-weight-bold">Reagentes (+)</small>
                        <span className="h6 text-danger font-weight-bold">{resultadosAnimais.filter(e => e.resultadoExame === 'Reagente').length}</span>
                    </div>
                    <div>
                        <small className="text-warning d-block text-uppercase font-weight-bold">Inconclusivos</small>
                        <span className="h6 text-warning font-weight-bold">{resultadosAnimais.filter(e => e.resultadoExame === 'Inconclusivo' || e.resultadoExame === 'Amostra Inviável').length}</span>
                    </div>
                </div>
            </div>

            <div className="po-card-secao mb-4 border rounded p-3 bg-white shadow-sm">
                <label className="font-weight-bold text-dark d-block mb-2">
                    <i className="fas fa-sticky-note mr-2 text-primary"></i> Observações / Parecer Técnico do Laboratório:
                </label>
                <textarea
                    rows="3"
                    className="br-input triato-textarea-obs"
                    placeholder="Detalhes adicionais sobre os soros, hemólise, necessidade de nova coleta ou laudamento oficial..."
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                ></textarea>
            </div>

            <div className="po-modal-footer d-flex justify-content-end gap-2 mt-3 pt-3 border-top">
                {onCancelar && (
                    <button type="button" className="btn-cancelar mr-2" onClick={onCancelar}>
                        Cancelar
                    </button>
                )}
                <button type="submit" className="btn-confirmar-boletim">
                    <i className="fas fa-paper-plane mr-1"></i> Emitir Laudo e Enviar para Encerramento
                </button>
            </div>
        </form>
    );
}