import React, { useState, useEffect } from 'react';
import './FormAnaliseBase.css';

export default function FormAnaliseLarva({ amostra, onSubmitLaudo, onCancelar }) {
    const [tecnicoAnalista, setTecnicoAnalista] = useState('');
    const [dataAnalise, setDataAnalise] = useState(new Date().toISOString().split('T')[0]);

    // Contadores de larvas e pupas
    const [aegyptiLarvas, setAegyptiLarvas] = useState(0);
    const [aegyptiPupas, setAegyptiPupas] = useState(0);
    const [albopictusLarvas, setAlbopictusLarvas] = useState(0);
    const [albopictusPupas, setAlbopictusPupas] = useState(0);
    
    const [outrosEspecificar, setOutrosEspecificar] = useState('');
    const [resultadoFinal, setResultadoFinal] = useState('NEGATIVO');
    const [observacoes, setObservacoes] = useState('');

    // 🟢 Atualização automática do resultado com base nas contagens
    useEffect(() => {
        const totalVetores = (parseInt(aegyptiLarvas) || 0) +
                             (parseInt(aegyptiPupas) || 0) +
                             (parseInt(albopictusLarvas) || 0) +
                             (parseInt(albopictusPupas) || 0);

        setResultadoFinal(totalVetores > 0 ? 'POSITIVO' : 'NEGATIVO');
    }, [aegyptiLarvas, aegyptiPupas, albopictusLarvas, albopictusPupas]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!tecnicoAnalista.trim()) {
            alert("Por favor, preencha o nome do técnico responsável pela análise.");
            return;
        }

        const qAedesLarvas = parseInt(aegyptiLarvas) || 0;
        const qAedesPupas = parseInt(aegyptiPupas) || 0;
        const qAlboLarvas = parseInt(albopictusLarvas) || 0;
        const qAlboPupas = parseInt(albopictusPupas) || 0;
        const totalExemplares = qAedesLarvas + qAedesPupas + qAlboLarvas + qAlboPupas;

        const laudoCompleto = {
            amostraId: amostra?.id,
            codigoTubo: amostra?.codigoTubo,
            tecnicoAnalista,
            dataAnalise,
            discriminacao: {
                aegyptiLarvas: qAedesLarvas,
                aegyptiPupas: qAedesPupas,
                albopictusLarvas: qAlboLarvas,
                albopictusPupas: qAlboPupas,
                outrosEspecificar
            },
            resumo: {
                totalAegypti: qAedesLarvas + qAedesPupas,
                totalAlbopictus: qAlboLarvas + qAlboPupas,
                totalExemplares,
                resultadoGeral: resultadoFinal
            },
            observacoes
        };

        if (onSubmitLaudo) {
            onSubmitLaudo(laudoCompleto);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="po-form-container p-2">

            {/* CABEÇALHO RESUMO DA AMOSTRA */}
            {amostra && (
                <div className="br-card p-3 mb-3 bg-light border-left-primary">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <div>
                            <span className="badge-distrito"><i className="fas fa-vial mr-1"></i> {amostra.codigoTubo || amostra.id}</span>
                            <span className="ml-2 font-weight-bold">{amostra.origem || 'Coleta de Campo'}</span>
                        </div>
                        <div className="text-small text-muted">
                            <i className="fas fa-user-check mr-1"></i> Coletor: <strong>{amostra.agenteColetor || amostra.agente || 'Não informado'}</strong> | Entrada: <strong>{amostra.dataEntrada || amostra.dataColeta || 'Recente'}</strong>
                        </div>
                    </div>
                </div>
            )}

            {/* SEÇÃO 1: DADOS DA ANÁLISE DE BANCADA */}
            <div className="po-card-secao mb-4 border rounded p-3 bg-white shadow-sm">
                <div className="po-subtitulo-form border-bottom pb-2 mb-3 text-primary font-weight-bold">
                    <i className="fas fa-microscope mr-2"></i> 1. Identificação Técnica do Laboratório
                </div>

                <div className="po-form-linha-dupla">
                    <div className="po-form-group">
                        <label>Técnico Responsável / Laboratorista <span className="obrigatorio">*</span></label>
                        <input
                            type="text"
                            placeholder="Digite o nome completo do examinador"
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
                </div>
            </div>

            {/* SEÇÃO 2: DISCRIMINAÇÃO DE ESPÉCIES (LARVAS E PUPAS) */}
            <div className="po-card-secao mb-4 border rounded p-3 bg-white shadow-sm">
                <div className="po-subtitulo-form border-bottom pb-2 mb-3 text-primary font-weight-bold">
                    <i className="fas fa-bug mr-2"></i> 2. Discriminação Taxonômica (Larvas e Pupas)
                </div>

                <div className="po-form-linha-dupla">
                    {/* BLOCO AEDES AEGYPTI */}
                    <div className="p-3 border rounded bg-light">
                        <h5 className="text-danger font-weight-bold mb-3 border-bottom pb-1">
                            <i className="fas fa-virus mr-1"></i> Aedes aegypti
                        </h5>
                        <div className="po-form-group mb-2">
                            <label>Qtd. Larvas:</label>
                            <input
                                type="number"
                                min="0"
                                value={aegyptiLarvas}
                                onChange={(e) => setAegyptiLarvas(e.target.value)}
                            />
                        </div>
                        <div className="po-form-group">
                            <label>Qtd. Pupas:</label>
                            <input
                                type="number"
                                min="0"
                                value={aegyptiPupas}
                                onChange={(e) => setAegyptiPupas(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* BLOCO AEDES ALBOPICTUS */}
                    <div className="p-3 border rounded bg-light">
                        <h5 className="text-primary font-weight-bold mb-3 border-bottom pb-1">
                            <i className="fas fa-bug mr-1"></i> Aedes albopictus
                        </h5>
                        <div className="po-form-group mb-2">
                            <label>Qtd. Larvas:</label>
                            <input
                                type="number"
                                min="0"
                                value={albopictusLarvas}
                                onChange={(e) => setAlbopictusLarvas(e.target.value)}
                            />
                        </div>
                        <div className="po-form-group">
                            <label>Qtd. Pupas:</label>
                            <input
                                type="number"
                                min="0"
                                value={albopictusPupas}
                                onChange={(e) => setAlbopictusPupas(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* BLOCO OUTROS ACHADOS */}
                <div className="mt-3 po-form-group">
                    <label>Outras Ocorrências / Achados Microscópicos:</label>
                    <input
                        type="text"
                        placeholder="Ex: Presença de larvas de Culex quinquefasciatus, predadores, etc."
                        value={outrosEspecificar}
                        onChange={(e) => setOutrosEspecificar(e.target.value)}
                    />
                </div>
            </div>

            {/* SEÇÃO 3: CONCLUSÃO E PARECER TÉCNICO */}
            <div className="po-card-secao mb-4 border rounded p-3 bg-white shadow-sm">
                <div className="po-subtitulo-form border-bottom pb-2 mb-3 text-primary font-weight-bold">
                    <i className="fas fa-clipboard-check mr-2"></i> 3. Parecer e Resultado do Laudo
                </div>

                <div className="po-form-linha-dupla mb-3">
                    <div className="po-form-group">
                        <label>Conclusão Analítica Automática:</label>
                        <select
                            className={`triato-select-grid font-weight-bold ${resultadoFinal === 'POSITIVO' ? 'select-res-positivo' : 'select-res-negativo'}`}
                            value={resultadoFinal}
                            onChange={(e) => setResultadoFinal(e.target.value)}
                        >
                            <option value="POSITIVO">⚠️ POSITIVO (Larvas/Pupas Encontradas)</option>
                            <option value="NEGATIVO">✅ NEGATIVO (Ausência de Vetores)</option>
                        </select>
                    </div>

                    <div className="po-form-group">
                        <label>Total de Vetores Identificados:</label>
                        <input
                            type="text"
                            disabled
                            className="bg-light font-weight-bold text-center"
                            value={`${(parseInt(aegyptiLarvas)||0) + (parseInt(aegyptiPupas)||0) + (parseInt(albopictusLarvas)||0) + (parseInt(albopictusPupas)||0)} exemplar(es)`}
                        />
                    </div>
                </div>

                <div className="po-form-group">
                    <label>Observações Adicionais do Laboratório:</label>
                    <textarea
                        rows="3"
                        className="br-input triato-textarea-obs"
                        placeholder="Observações sobre o estado da amostra, preservação no álcool ou notas do exame..."
                        value={observacoes}
                        onChange={(e) => setObservacoes(e.target.value)}
                    ></textarea>
                </div>
            </div>

            {/* RODAPÉ E AÇÕES */}
            <div className="po-modal-footer d-flex justify-content-end gap-2 mt-3 pt-3 border-top">
                {onCancelar && (
                    <button type="button" className="btn-cancelar" onClick={onCancelar}>
                        Cancelar
                    </button>
                )}
                <button type="submit" className="btn-confirmar-boletim">
                    <i className="fas fa-check-circle mr-1"></i> Emitir Laudo de Larvas
                </button>
            </div>
        </form>
    );
}