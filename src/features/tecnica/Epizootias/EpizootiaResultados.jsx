import React, { useState, useEffect } from 'react';

// 🟢 IMPORTS DOS ESTILOS (Mesmos da Bancada Técnica)
import '../../../shared/components/Formularios.css';
import '../administrativo/formularios-os/FormAnaliseBase.css';

export default function EpizootiaResultados({ osSelecionada, amostra, onSalvar, onCancelar }) {
    const item = amostra || osSelecionada;

    // Detecta se a amostra passou por DPP e precisa do fluxo do LACEN
    const requerLabExterno = item?.statusEncerramento === 'aguardando_lab_externo';

    const [dataEncerramento, setDataEncerramento] = useState(new Date().toISOString().split('T')[0]);
    const [responsavelEncerramento, setResponsavelEncerramento] = useState('');
    
    // --- DADOS DO LACEN (Obrigatório se DPP Positivo) ---
    const [protocoloLacen, setProtocoloLacen] = useState('');
    const [dataLacen, setDataLacen] = useState('');
    const [resultadoLacen, setResultadoLacen] = useState('Pendente / Em Análise');
    const [pdfLacen, setPdfLacen] = useState(null);
    const [nomePdfLacen, setNomePdfLacen] = useState('');

    // --- LAUDOS PARTICULARES (Array dinâmico) ---
    const [laudosParticulares, setLaudosParticulares] = useState([]);

    const [animais, setAnimais] = useState([]);
    const [observacoesEncerramento, setObservacoesEncerramento] = useState('');

    // Sincroniza a tabela com os animais e resultados definidos na bancada DPP
    useEffect(() => {
        if (item?.dadosAnalise?.resultadosAnimais?.length > 0) {
            setAnimais(item.dadosAnalise.resultadosAnimais.map(a => {
                const isNaoReagente = a.resultadoDpp === 'Não Reagente';
                return {
                    id: a.id,
                    identificacaoAnimal: a.identificacaoAnimal,
                    resultadoDpp: a.resultadoDpp || 'Não Reagente',
                    // Se foi negativo no DPP, já fixa como liberado e não encaminhado ao ELISA
                    resultadoElisaFinal: isNaoReagente ? 'Não Realizado (DPP -)' : 'Reagente (+)',
                    desfechoZoosanitario: isNaoReagente ? 'Liberado / Triagem Negativa' : 'Sem Retorno'
                };
            }));
        } else {
            setAnimais([
                {
                    id: Date.now(),
                    identificacaoAnimal: item?.municipe ? `Cão #1 (Tutor: ${item.municipe})` : 'Cão #1',
                    resultadoDpp: requerLabExterno ? 'Reagente' : 'Não Reagente',
                    resultadoElisaFinal: requerLabExterno ? 'Reagente (+)' : 'Não Realizado (DPP -)',
                    desfechoZoosanitario: requerLabExterno ? 'Sem Retorno' : 'Liberado / Triagem Negativa'
                }
            ]);
        }
    }, [item, requerLabExterno]);

    const handleAnimalChange = (id, campo, valor) => {
        setAnimais(prev => prev.map(a => {
            if (a.id !== id) return a;
            const atualizado = { ...a, [campo]: valor };

            // Sugere desfecho coerente com a troca do resultado final
            if (campo === 'resultadoElisaFinal') {
                if (valor === 'Reagente (+)') {
                    atualizado.desfechoZoosanitario = 'Eutanásia';
                } else if (valor === 'Não Reagente (-)') {
                    atualizado.desfechoZoosanitario = 'Liberado / Triagem Negativa';
                }
            }
            return atualizado;
        }));
    };

    // 📄 FUNÇÃO AUXILIAR PARA LEITURA DE PDF
    const handleArquivoPdf = (file, callbackSucesso) => {
        if (!file) return;
        if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
            alert('Por favor, selecione exclusivamente um arquivo no formato PDF.');
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            callbackSucesso(reader.result, file.name);
        };
        reader.readAsDataURL(file);
    };

    // 📄 PDF DO LACEN
    const handlePdfLacenChange = (e) => {
        const file = e.target.files[0];
        handleArquivoPdf(file, (base64, nome) => {
            setPdfLacen(base64);
            setNomePdfLacen(nome);
        });
    };

    const handleRemoverPdfLacen = () => {
        setPdfLacen(null);
        setNomePdfLacen('');
    };

    // 📄 PDF E REGISTRO DE LAUDO PARTICULAR
    const handleAddLaudoParticular = () => {
        setLaudosParticulares(prev => [
            ...prev,
            { 
                id: Date.now(), 
                clinica: '', 
                protocolo: '', 
                data: '', 
                metodo: 'ELISA / EIE',
                resultado: 'Reagente (+)',
                pdfBase64: null,
                nomePdf: ''
            }
        ]);
    };

    const handleRemoveLaudoParticular = (id) => {
        setLaudosParticulares(prev => prev.filter(l => l.id !== id));
    };

    const handleLaudoParticularChange = (id, campo, valor) => {
        setLaudosParticulares(prev => prev.map(l => l.id === id ? { ...l, [campo]: valor } : l));
    };

    const handlePdfParticularChange = (id, e) => {
        const file = e.target.files[0];
        handleArquivoPdf(file, (base64, nome) => {
            setLaudosParticulares(prev => prev.map(l => l.id === id ? {
                ...l,
                pdfBase64: base64,
                nomePdf: nome
            } : l));
        });
    };

    const handleRemoverPdfParticular = (id) => {
        setLaudosParticulares(prev => prev.map(l => l.id === id ? {
            ...l,
            pdfBase64: null,
            nomePdf: ''
        } : l));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!responsavelEncerramento.trim()) {
            alert('Por favor, informe o técnico responsável pelo encerramento.');
            return;
        }

        if (requerLabExterno && !protocoloLacen.trim()) {
            alert('O Nº do Protocolo GAL (LACEN) é obrigatório para amostras encaminhadas à contraprova.');
            return;
        }

        const payloadEncerramento = {
            amostraId: item?.id,
            codigoTubo: item?.codigoTubo,
            dataEncerramento,
            responsavelEncerramento,
            tipoEncerramento: requerLabExterno ? 'CONFIRMATORIO_LACEN' : 'TRIAGEM_NEGATIVA_LOCAL',
            dadosLacen: requerLabExterno ? {
                protocolo: protocoloLacen,
                data: dataLacen,
                resultado: resultadoLacen,
                pdfBase64: pdfLacen,
                nomePdf: nomePdfLacen
            } : null,
            laudosParticulares: requerLabExterno ? laudosParticulares : [],
            animaisDesfecho: animais,
            observacoesEncerramento,
            statusFinal: 'executado'
        };

        if (onSalvar) {
            onSalvar(payloadEncerramento);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="po-form-container p-2">
            {/* CABEÇALHO RESUMO DA AMOSTRA */}
            {item && (
                <div className="br-card p-3 mb-3 bg-light border-left-primary border rounded">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <div>
                            <span className="badge-distrito"><i className="fas fa-vial mr-1"></i> {item.codigoTubo}</span>
                            <span className="ml-2 font-weight-bold text-primary">{item.tipoAmostra || 'Triagem DPP - Leishmaniose Canina'}</span>
                        </div>
                        <div className="text-small text-muted">
                            <i className="fas fa-user mr-1"></i> Tutor: <strong>{item.municipe}</strong> | Entrada: <strong>{item.dataEntrada}</strong>
                        </div>
                    </div>
                </div>
            )}

            {/* SEÇÃO 1: DADOS DO ENCERRAMENTO TÉCNICO */}
            <div className="po-card-secao mb-4 border rounded p-3 bg-white shadow-sm">
                <div className="po-subtitulo-form border-bottom pb-2 mb-3 text-primary font-weight-bold">
                    <i className="fas fa-user-check mr-2"></i> 1. Identificação do Encerramento
                </div>

                <div className="po-form-linha-dupla">
                    <div className="po-form-group">
                        <label>Data de Conclusão <span className="obrigatorio">*</span></label>
                        <input
                            type="date"
                            value={dataEncerramento}
                            onChange={(e) => setDataEncerramento(e.target.value)}
                            required
                        />
                    </div>

                    <div className="po-form-group">
                        <label>Técnico Responsável <span className="obrigatorio">*</span></label>
                        <input
                            type="text"
                            placeholder="Nome completo do responsável"
                            value={responsavelEncerramento}
                            onChange={(e) => setResponsavelEncerramento(e.target.value)}
                            required
                        />
                    </div>
                </div>
            </div>

            {/* SEÇÃO 2: LACEN E PARTICULARES (EXIBIDO SE HOUVE DPP POSITIVO) */}
            {requerLabExterno && (
                <>
                    {/* BLOCO LACEN (OBRIGATÓRIO COM PDF) */}
                    <div className="po-card-secao mb-4 border rounded p-3 bg-white shadow-sm">
                        <div className="po-subtitulo-form border-bottom pb-2 mb-3 text-primary font-weight-bold">
                            <i className="fas fa-hospital mr-2"></i> 2. Laudo Oficial LACEN (Obrigatório)
                        </div>

                        <div className="po-form-linha-tripla">
                            <div className="po-form-group">
                                <label>Nº do Protocolo GAL <span className="obrigatorio">*</span></label>
                                <input
                                    type="text"
                                    placeholder="Ex: GAL-2026-99412"
                                    value={protocoloLacen}
                                    onChange={(e) => setProtocoloLacen(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="po-form-group">
                                <label>Data da Liberação</label>
                                <input
                                    type="date"
                                    value={dataLacen}
                                    onChange={(e) => setDataLacen(e.target.value)}
                                />
                            </div>

                            <div className="po-form-group">
                                <label>Resultado LACEN</label>
                                <select
                                    value={resultadoLacen}
                                    onChange={(e) => setResultadoLacen(e.target.value)}
                                >
                                    <option value="Pendente / Em Análise">Pendente / Em Análise</option>
                                    <option value="Reagente (+)">Reagente (+)</option>
                                    <option value="Não Reagente (-)">Não Reagente (-)</option>
                                </select>
                            </div>
                        </div>

                        {/* ANEXO PDF LACEN */}
                        <div className="po-form-group mt-3 pt-2 border-top">
                            <label className="font-weight-bold mb-1 d-block">
                                <i className="fas fa-paperclip mr-1 text-primary"></i> Anexo do Laudo Oficial (PDF do GAL/LACEN)
                            </label>
                            {!pdfLacen ? (
                                <div>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        id="pdf-lacen-input"
                                        className="d-none"
                                        onChange={handlePdfLacenChange}
                                    />
                                    <label 
                                        htmlFor="pdf-lacen-input" 
                                        className="br-button secondary small mb-0 w-100 d-flex justify-content-center align-items-center cursor-pointer"
                                        style={{ borderStyle: 'dashed', padding: '10px' }}
                                    >
                                        <i className="fas fa-file-pdf mr-2 text-danger fa-lg"></i> Clique para Anexar o Laudo LACEN em PDF
                                    </label>
                                </div>
                            ) : (
                                <div className="d-flex align-items-center justify-content-between bg-light border border-success rounded p-2 px-3">
                                    <span className="text-success font-weight-bold text-small text-truncate">
                                        <i className="fas fa-file-pdf mr-2 text-danger fa-lg"></i> {nomePdfLacen}
                                    </span>
                                    <button
                                        type="button"
                                        className="btn-remover-linha p-1"
                                        title="Remover arquivo PDF"
                                        onClick={handleRemoverPdfLacen}
                                    >
                                        <i className="fas fa-times mr-1"></i> Remover PDF
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* BLOCO LAUDOS PARTICULARES (OPCIONAL/DINÂMICO COM MÉTODO E PDF) */}
                    <div className="po-card-secao mb-4 border rounded p-3 bg-white shadow-sm">
                        <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3 flex-wrap gap-2">
                            <span className="po-subtitulo-form text-primary font-weight-bold m-0">
                                <i className="fas fa-file-medical mr-2"></i> Laudos Particulares Anexos (Opcional)
                            </span>
                            <button
                                type="button"
                                className="br-button primary small"
                                onClick={handleAddLaudoParticular}
                            >
                                <i className="fas fa-plus mr-1"></i> Adicionar Laudo Particular
                            </button>
                        </div>

                        {laudosParticulares.length === 0 ? (
                            <p className="text-muted text-small font-italic mb-0 p-2">
                                Nenhum laudo de laboratório particular foi anexado pelo tutor.
                            </p>
                        ) : (
                            laudosParticulares.map((laudo, idx) => (
                                <div key={laudo.id} className="p-3 mb-3 border rounded bg-light">
                                    <div className="d-flex justify-content-between align-items-center mb-2 pb-1 border-bottom">
                                        <strong className="text-secondary" style={{ fontSize: '13px' }}>
                                            <i className="fas fa-file-alt mr-1"></i> Laudo Particular #{idx + 1}
                                        </strong>
                                        <button
                                            type="button"
                                            className="btn-remover-linha"
                                            title="Remover Laudo"
                                            onClick={() => handleRemoveLaudoParticular(laudo.id)}
                                        >
                                            <i className="fas fa-trash-alt mr-1"></i> Remover Laudo
                                        </button>
                                    </div>

                                    {/* LINHA 1: IDENTIFICAÇÃO DO LAUDO */}
                                    <div className="po-form-linha-tripla">
                                        <div className="po-form-group">
                                            <label>Laboratório <span className="obrigatorio">*</span></label>
                                            <input
                                                type="text"
                                                placeholder="Ex: Laboratório de Análises Clínicas"
                                                value={laudo.clinica}
                                                onChange={(e) => handleLaudoParticularChange(laudo.id, 'clinica', e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="po-form-group">
                                            <label>Nº do Laudo <span className="obrigatorio">*</span></label>
                                            <input
                                                type="text"
                                                placeholder="Ex: LVD-2026-554"
                                                value={laudo.protocolo}
                                                onChange={(e) => handleLaudoParticularChange(laudo.id, 'protocolo', e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="po-form-group">
                                            <label>Data do Exame <span className="obrigatorio">*</span></label>
                                            <input
                                                type="date"
                                                value={laudo.data}
                                                onChange={(e) => handleLaudoParticularChange(laudo.id, 'data', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* LINHA 2: MÉTODO, RESULTADO E ANEXO PDF */}
                                    <div className="po-form-linha-tripla mt-2">
                                        <div className="po-form-group">
                                            <label>Método Utilizado <span className="obrigatorio">*</span></label>
                                            <select
                                                value={laudo.metodo || 'ELISA / EIE'}
                                                onChange={(e) => handleLaudoParticularChange(laudo.id, 'metodo', e.target.value)}
                                            >
                                                <option value="ELISA / EIE">ELISA / EIE</option>
                                                <option value="RIFI (Imunofluorescência)">RIFI (Imunofluorescência)</option>
                                                <option value="Teste Rápido Imunocromatográfico">Teste Rápido Imunocromatográfico</option>
                                                <option value="PCR (Biologia Molecular)">PCR (Biologia Molecular)</option>
                                                <option value="Outro Método">Outro Método</option>
                                            </select>
                                        </div>

                                        <div className="po-form-group">
                                            <label>Resultado do Exame <span className="obrigatorio">*</span></label>
                                            <select
                                                className={`font-weight-bold ${laudo.resultado?.includes('Reagente') ? 'text-danger' : 'text-success'}`}
                                                value={laudo.resultado}
                                                onChange={(e) => handleLaudoParticularChange(laudo.id, 'resultado', e.target.value)}
                                            >
                                                <option value="Reagente (+)">Reagente (+)</option>
                                                <option value="Não Reagente (-)">Não Reagente (-)</option>
                                            </select>
                                        </div>

                                        {/* ANEXO PDF PARTICULAR */}
                                        <div className="po-form-group">
                                            <label>Anexo do Laudo (PDF)</label>
                                            {!laudo.pdfBase64 ? (
                                                <div>
                                                    <input
                                                        type="file"
                                                        accept="application/pdf"
                                                        id={`pdf-particular-${laudo.id}`}
                                                        className="d-none"
                                                        onChange={(e) => handlePdfParticularChange(laudo.id, e)}
                                                    />
                                                    <label 
                                                        htmlFor={`pdf-particular-${laudo.id}`} 
                                                        className="br-button secondary small mb-0 w-100 d-flex justify-content-center align-items-center cursor-pointer"
                                                        style={{ borderStyle: 'dashed' }}
                                                    >
                                                        <i className="fas fa-file-pdf mr-2 text-danger"></i> Anexar PDF
                                                    </label>
                                                </div>
                                            ) : (
                                                <div className="d-flex align-items-center justify-content-between bg-white border border-success rounded p-1 px-2">
                                                    <span className="text-success font-weight-bold text-small text-truncate" style={{ maxWidth: '170px' }}>
                                                        <i className="fas fa-file-pdf mr-1 text-danger"></i> {laudo.nomePdf}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        className="btn-remover-linha p-1"
                                                        title="Remover PDF"
                                                        onClick={() => handleRemoverPdfParticular(laudo.id)}
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}

            {/* SEÇÃO 3: DESFECHO POR ANIMAL */}
            <div className="po-card-secao mb-4 border rounded p-3 bg-white shadow-sm">
                <div className="po-subtitulo-form border-bottom pb-2 mb-3 text-primary font-weight-bold">
                    <i className="fas fa-paw mr-2"></i> 3. Desfecho por Animal
                </div>

                <div className="table-responsive">
                    <table className="triato-analise-table">
                        <thead>
                            <tr>
                                <th style={{ width: '5%' }}>#</th>
                                <th style={{ width: '35%' }}>Identificação do Animal</th>
                                <th style={{ width: '15%' }}>DPP (Bancada)</th>
                                <th style={{ width: '22%' }}>Resultado Considerado</th>
                                <th style={{ width: '23%' }}>Desfecho do Caso</th>
                            </tr>
                        </thead>
                        <tbody>
                            {animais.map((animal, index) => {
                                const isNaoReagenteDpp = animal.resultadoDpp === 'Não Reagente';

                                return (
                                    <tr 
                                        key={animal.id} 
                                        style={isNaoReagenteDpp ? { backgroundColor: '#f1f3f5', color: '#6c757d' } : {}}
                                    >
                                        <td className="text-center font-weight-bold">{index + 1}</td>
                                        
                                        <td>
                                            <input
                                                type="text"
                                                className="triato-input-texto"
                                                value={animal.identificacaoAnimal}
                                                disabled={isNaoReagenteDpp}
                                                style={isNaoReagenteDpp ? { backgroundColor: '#e9ecef', cursor: 'not-allowed', color: '#6c757d' } : {}}
                                                onChange={(e) => handleAnimalChange(animal.id, 'identificacaoAnimal', e.target.value)}
                                            />
                                        </td>
                                        
                                        <td className="text-center">
                                            <span className={`badge ${animal.resultadoDpp === 'Reagente' ? 'badge-danger text-danger font-weight-bold' : 'badge-secondary text-muted font-weight-bold'}`}>
                                                {animal.resultadoDpp}
                                            </span>
                                        </td>
                                        
                                        <td>
                                            {isNaoReagenteDpp ? (
                                                <span className="text-muted small font-italic d-block p-1">
                                                    <i className="fas fa-ban mr-1 text-muted"></i> Não enviado ao LACEN
                                                </span>
                                            ) : (
                                                <select
                                                    className={`triato-select-grid font-weight-bold ${animal.resultadoElisaFinal?.includes('Reagente') ? 'text-danger' : 'text-success'}`}
                                                    value={animal.resultadoElisaFinal}
                                                    onChange={(e) => handleAnimalChange(animal.id, 'resultadoElisaFinal', e.target.value)}
                                                >
                                                    <option value="Reagente (+)">Reagente (+)</option>
                                                    <option value="Não Reagente (-)">Não Reagente (-)</option>
                                                    <option value="Aguardando Laudo">Aguardando Laudo</option>
                                                </select>
                                            )}
                                        </td>
                                        
                                        {/* 🟢 DESFECHO DO CASO COM AS 4 OPÇÕES SOLICITADAS */}
                                        <td>
                                            {isNaoReagenteDpp ? (
                                                <span 
                                                    className="badge badge-light text-success border border-success d-block p-2" 
                                                    style={{ fontSize: '11px', textAlign: 'center', backgroundColor: '#e8f5e9' }}
                                                >
                                                    <i className="fas fa-check-circle mr-1"></i> Liberado (Triagem Negativa)
                                                </span>
                                            ) : (
                                                <select
                                                    className="triato-select-grid font-weight-bold"
                                                    value={animal.desfechoZoosanitario}
                                                    onChange={(e) => handleAnimalChange(animal.id, 'desfechoZoosanitario', e.target.value)}
                                                >
                                                    <option value="Óbito natural">Óbito natural</option>
                                                    <option value="Eutanásia">Eutanásia</option>
                                                    <option value="Tratamento particular">Tratamento particular</option>
                                                    <option value="Sem Retorno">Sem Retorno</option>
                                                </select>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* SEÇÃO 4: OBSERVAÇÕES E PARECER TÉCNICO */}
            <div className="po-card-secao mb-4 border rounded p-3 bg-white shadow-sm">
                <label className="font-weight-bold text-dark d-block mb-2">
                    <i className="fas fa-sticky-note mr-2 text-primary"></i> Observações e Parecer Técnico Conclusivo:
                </label>
                <textarea
                    rows="3"
                    className="br-input triato-textarea-obs"
                    placeholder="Relate divergências entre exames, número de notificação gerada ou orientações fornecidas ao munícipe..."
                    value={observacoesEncerramento}
                    onChange={(e) => setObservacoesEncerramento(e.target.value)}
                ></textarea>
            </div>

            {/* RODAPÉ COM BOTÕES DE AÇÃO */}
            <div className="po-modal-footer d-flex justify-content-end gap-2 mt-3 pt-3 border-top">
                {onCancelar && (
                    <button type="button" className="btn-cancelar mr-2" onClick={onCancelar}>
                        Cancelar
                    </button>
                )}
                <button type="submit" className="btn-confirmar-boletim">
                    <i className="fas fa-check-double mr-1"></i> Concluir e Arquivar Encerramento
                </button>
            </div>
        </form>
    );
}