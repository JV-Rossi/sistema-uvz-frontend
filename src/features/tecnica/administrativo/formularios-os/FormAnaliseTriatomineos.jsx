import React, { useState } from 'react';
import './FormAnaliseTriatomineos.css';

export default function FormAnaliseTriatomineos({ amostra, onSubmitLaudo, onCancelar }) {
    const [tecnicoAnalista, setTecnicoAnalista] = useState('');
    const [dataAnalise, setDataAnalise] = useState(new Date().toISOString().split('T')[0]);
    const [observacoes, setObservacoes] = useState('');

    // Lista dinâmica de exemplares analisados na bancada
    const [exemplares, setExemplares] = useState([
        {
            id: Date.now(),
            especie: 'Triatoma sordida',
            especieOutra: '',
            localCaptura: 'Intradomicílio',
            estagio: 'Adulto Macho',
            resultado: 'Negativo'
        }
    ]);

    // Handlers para manipular linhas de exemplares
    const handleAdicionarExemplar = () => {
        setExemplares(prev => [
            ...prev,
            {
                id: Date.now() + Math.random(),
                especie: 'Triatoma sordida',
                especieOutra: '',
                localCaptura: 'Intradomicílio',
                estagio: 'Adulto Macho',
                resultado: 'Negativo'
            }
        ]);
    };

    const handleRemoverExemplar = (id) => {
        if (exemplares.length === 1) {
            alert("É necessário manter ao menos 1 exemplar para emissão do laudo.");
            return;
        }
        setExemplares(prev => prev.filter(item => item.id !== id));
    };

    const handleExemplarChange = (id, campo, valor) => {
        setExemplares(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, [campo]: valor };
            }
            return item;
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!tecnicoAnalista.trim()) {
            alert("Por favor, preencha o nome do técnico responsável pela análise.");
            return;
        }

        // Resumo estatístico
        const totalExemplares = exemplares.length;
        const totalPositivos = exemplares.filter(e => e.resultado === 'Positivo').length;
        const totalNegativos = exemplares.filter(e => e.resultado === 'Negativo').length;
        const totalNaoExaminados = exemplares.filter(e => e.resultado === 'Não examinado').length;

        const laudoCompleto = {
            amostraId: amostra?.id,
            codigoTubo: amostra?.codigoTubo,
            tecnicoAnalista,
            dataAnalise,
            exemplares,
            resumo: {
                totalExemplares,
                totalPositivos,
                totalNegativos,
                totalNaoExaminados,
                resultadoGeral: totalPositivos > 0 ? 'POSITIVO' : 'NEGATIVO'
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
                            <span className="badge-distrito"><i className="fas fa-vial mr-1"></i> {amostra.codigoTubo}</span>
                            <span className="ml-2 font-weight-bold">{amostra.origem}</span>
                        </div>
                        <div className="text-small text-muted">
                            <i className="fas fa-user-check mr-1"></i> Coletor: <strong>{amostra.agenteColetor}</strong> | Entrada: <strong>{amostra.dataEntrada}</strong>
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

            {/* SEÇÃO 2: TABELA DINÂMICA DE EXEMPLARES CAPTURADOS */}
            <div className="po-card-secao mb-4 border rounded p-3 bg-white shadow-sm">
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3 flex-wrap gap-2">
                    <span className="po-subtitulo-form text-primary font-weight-bold m-0">
                        <i className="fas fa-bug mr-2"></i> 2. Exame Microscópico e Taxonomia por Exemplar
                    </span>
                    <button
                        type="button"
                        className="br-button primary small"
                        onClick={handleAdicionarExemplar}
                    >
                        <i className="fas fa-plus mr-1"></i> Adicionar Exemplar
                    </button>
                </div>

                <div className="table-responsive">
                    <table className="triato-analise-table">
                        <thead>
                            <tr>
                                <th style={{ width: '5%' }}>#</th>
                                <th style={{ width: '28%' }}>Espécie de Triatomíneo</th>
                                <th style={{ width: '20%' }}>Captura (Local)</th>
                                <th style={{ width: '22%' }}>Estágio / Sexo</th>
                                <th style={{ width: '20%' }}>Resultado (T. cruzi)</th>
                                <th style={{ width: '5%' }}>Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exemplares.map((ex, index) => (
                                <tr key={ex.id} className={`linha-resultado-${ex.resultado.toLowerCase().replace(' ', '-')}`}>
                                    <td className="text-center font-weight-bold">{index + 1}</td>

                                    {/* ESPÉCIE */}
                                    <td>
                                        <select
                                            className="triato-select-grid"
                                            value={ex.especie}
                                            onChange={(e) => handleExemplarChange(ex.id, 'especie', e.target.value)}
                                        >
                                            <option value="Triatoma sordida">Triatoma sordida</option>
                                            <option value="Rhodnius neglectus">Rhodnius neglectus</option>
                                            <option value="Panstrongylus megistus">Panstrongylus megistus</option>
                                            <option value="Triatoma infestans">Triatoma infestans</option>
                                            <option value="Rhodnius prolixus">Rhodnius prolixus</option>
                                            <option value="Outra">Outra / Não Identificada</option>
                                        </select>
                                        {ex.especie === 'Outra' && (
                                            <input
                                                type="text"
                                                className="triato-input-texto mt-1"
                                                placeholder="Qual espécie?"
                                                value={ex.especieOutra}
                                                onChange={(e) => handleExemplarChange(ex.id, 'especieOutra', e.target.value)}
                                            />
                                        )}
                                    </td>

                                    {/* LOCAL DE CAPTURA */}
                                    <td>
                                        <select
                                            className="triato-select-grid"
                                            value={ex.localCaptura}
                                            onChange={(e) => handleExemplarChange(ex.id, 'localCaptura', e.target.value)}
                                        >
                                            <option value="Intradomicílio">Intradomicílio (Intra)</option>
                                            <option value="Peridomicílio">Peridomicílio (Peri)</option>
                                        </select>
                                    </td>

                                    {/* ESTÁGIO */}
                                    <td>
                                        <select
                                            className="triato-select-grid"
                                            value={ex.estagio}
                                            onChange={(e) => handleExemplarChange(ex.id, 'estagio', e.target.value)}
                                        >
                                            <option value="Ninfa">Ninfa</option>
                                            <option value="Adulto Macho">Adulto Macho</option>
                                            <option value="Adulto Fêmea">Adulto Fêmea</option>
                                        </select>
                                    </td>

                                    {/* RESULTADO */}
                                    <td>
                                        <select
                                            className={`triato-select-grid select-res-${ex.resultado.toLowerCase().replace(' ', '-')}`}
                                            value={ex.resultado}
                                            onChange={(e) => handleExemplarChange(ex.id, 'resultado', e.target.value)}
                                        >
                                            <option value="Positivo">Positivo (+)</option>
                                            <option value="Negativo">Negativo (-)</option>
                                            <option value="Não examinado">Não examinado</option>
                                        </select>
                                    </td>

                                    {/* BOTÃO REMOVER */}
                                    <td className="text-center">
                                        <button
                                            type="button"
                                            className="btn-remover-linha"
                                            title="Remover Exemplar"
                                            onClick={() => handleRemoverExemplar(ex.id)}
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* PAINEL RESUMO DA BANCADA */}
                <div className="triato-resumo-bancada mt-3 p-2 rounded bg-light border d-flex justify-content-around text-center flex-wrap gap-2">
                    <div>
                        <small className="text-muted d-block text-uppercase font-weight-bold">Total Exemplares</small>
                        <span className="h6 font-weight-bold">{exemplares.length}</span>
                    </div>
                    <div>
                        <small className="text-success d-block text-uppercase font-weight-bold">Negativos</small>
                        <span className="h6 text-success font-weight-bold">{exemplares.filter(e => e.resultado === 'Negativo').length}</span>
                    </div>
                    <div>
                        <small className="text-danger d-block text-uppercase font-weight-bold">Positivos</small>
                        <span className="h6 text-danger font-weight-bold">{exemplares.filter(e => e.resultado === 'Positivo').length}</span>
                    </div>
                    <div>
                        <small className="text-warning d-block text-uppercase font-weight-bold">Não Examinados</small>
                        <span className="h6 text-warning font-weight-bold">{exemplares.filter(e => e.resultado === 'Não examinado').length}</span>
                    </div>
                </div>
            </div>

            {/* OBSERVAÇÕES / NOTAS TÉCNICAS */}
            <div className="po-card-secao mb-4 border rounded p-3 bg-white shadow-sm">
                <label className="font-weight-bold text-dark d-block mb-2">
                    <i className="fas fa-sticky-note mr-2 text-primary"></i> Observações / Parecer Técnico do Laboratório:
                </label>
                <textarea
                    rows="3"
                    className="br-input triato-textarea-obs"
                    placeholder="Detalhes adicionais sobre vitalidade, estado de conservação ou observações fasmídicas/microscópicas..."
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                ></textarea>
            </div>

            {/* RODAPÉ E AÇÕES */}
            <div className="po-modal-footer d-flex justify-content-end gap-2 mt-3 pt-3 border-top">
                {onCancelar && (
                    <button type="button" className="btn-cancelar mr-2" onClick={onCancelar}>
                        Cancelar
                    </button>
                )}
                <button type="submit" className="btn-confirmar-boletim">
                    <i className="fas fa-check-circle mr-1"></i> Emitir Laudo Laboratorial
                </button>
            </div>
        </form>
    );
}