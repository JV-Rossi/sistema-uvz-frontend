import React, { useState } from 'react';
import './FormBuscaTriatomineos.css';

const estadoInicialAmbiente = {
    coletado: {
        triatomineo: 0,
        ovo: 0,
        vestigiosMuda: 0,
        outrosNome: '',
        outrosQtd: 0
    },
    localEncontrado: {
        sala: false,
        quarto: false,
        cozinha: false,
        banheiro: false,
        outrosNome: '',
        outrosChecked: false
    }
};

const estadoInicial = {
    nomeMunicipio: 'CUIABÁ',
    nomeLocalidade: '',
    dataAtividade: new Date().toISOString().split('T')[0],
    atividade: 'Realizada',
    denuncia: 'Sim',
    quarteirao: '',
    numeroImovel: '',
    complemento: '',
    nomeMorador: '',
    tipoParede: '1',
    tipoTeto: '1',
    tipoPiso: '2',
    anexos: {
        galinheiro: { tem: false, qtd: '' },
        chiqueiro: { tem: false, qtd: '' },
        curral: { tem: false, qtd: '' },
        paiol: { tem: false, qtd: '' }
    },
    intradomicilio: JSON.parse(JSON.stringify(estadoInicialAmbiente)),
    peridomicilio: JSON.parse(JSON.stringify(estadoInicialAmbiente)),
    observacoes: ''
};

export default function FormBuscaTriatomineos({ onSubmitLaudo, onCancelar }) {
    const [formData, setFormData] = useState(estadoInicial);

    const handleChange = (campo, valor) => {
        setFormData(prev => ({ ...prev, [campo]: valor }));
    };

    const handleAmbienteChange = (ambiente, secao, campo, valor) => {
        setFormData(prev => ({
            ...prev,
            [ambiente]: {
                ...prev[ambiente],
                [secao]: {
                    ...prev[ambiente][secao],
                    [campo]: valor
                }
            }
        }));
    };

    const handleAnexoToggle = (itemKey) => {
        setFormData(prev => ({
            ...prev,
            anexos: {
                ...prev.anexos,
                [itemKey]: {
                    ...prev.anexos[itemKey],
                    tem: !prev.anexos[itemKey].tem,
                    qtd: !prev.anexos[itemKey].tem ? '1' : ''
                }
            }
        }));
    };

    const handleAnexoQtdChange = (itemKey, qtd) => {
        setFormData(prev => ({
            ...prev,
            anexos: {
                ...prev.anexos,
                [itemKey]: { ...prev.anexos[itemKey], qtd }
            }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmitLaudo) {
            onSubmitLaudo(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="po-form-container p-2">

            {/* SEÇÃO 1: DADOS DA VISITA E LOCALIZAÇÃO */}
            <div className="po-card-secao mb-4 border rounded p-3 bg-white shadow-sm">
                <div className="po-subtitulo-form border-bottom pb-2 mb-3 text-primary font-weight-bold">
                    <i className="fas fa-map-marker-alt mr-2"></i> 1. Localização e Dados da Visita
                </div>

                <div className="po-form-linha-tripla">
                    <div className="po-form-group">
                        <label>Município</label>
                        <input type="text" value={formData.nomeMunicipio} disabled className="bg-light" />
                    </div>

                    <div className="po-form-group">
                        <label>Localidade / Bairro <span className="obrigatorio">*</span></label>
                        <input
                            type="text"
                            placeholder="Ex: CPA II"
                            value={formData.nomeLocalidade}
                            onChange={(e) => handleChange('nomeLocalidade', e.target.value)}
                            required
                        />
                    </div>

                    <div className="po-form-group">
                        <label>Data da Atividade <span className="obrigatorio">*</span></label>
                        <input
                            type="date"
                            value={formData.dataAtividade}
                            onChange={(e) => handleChange('dataAtividade', e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="po-form-linha-tripla mt-2">
                    <div className="po-form-group">
                        <label>Situação da Visita <span className="obrigatorio">*</span></label>
                        <select value={formData.atividade} onChange={(e) => handleChange('atividade', e.target.value)}>
                            <option value="Realizada">Realizada</option>
                            <option value="Fechada">Fechada / Ausente</option>
                            <option value="Recusada">Recusada pelo Morador</option>
                        </select>
                    </div>

                    <div className="po-form-group">
                        <label>É Decorrente de Denúncia? <span className="obrigatorio">*</span></label>
                        <select value={formData.denuncia} onChange={(e) => handleChange('denuncia', e.target.value)}>
                            <option value="Sim">Sim (Atendimento a Chamado)</option>
                            <option value="Não">Não (Pesquisa de Rotina)</option>
                        </select>
                    </div>

                    <div className="po-form-group">
                        <label>Quarteirão <span className="obrigatorio">*</span></label>
                        <input
                            type="number"
                            placeholder="Ex: 14"
                            value={formData.quarteirao}
                            onChange={(e) => handleChange('quarteirao', e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="po-form-linha-tripla mt-2">
                    <div className="po-form-group">
                        <label>Nº do Imóvel <span className="obrigatorio">*</span></label>
                        <input
                            type="text"
                            placeholder="Ex: 210 ou S/N"
                            value={formData.numeroImovel}
                            onChange={(e) => handleChange('numeroImovel', e.target.value)}
                            required
                        />
                    </div>

                    <div className="po-form-group">
                        <label>Complemento</label>
                        <input
                            type="text"
                            placeholder="Ex: Casa A, Lote 12"
                            value={formData.complemento}
                            onChange={(e) => handleChange('complemento', e.target.value)}
                        />
                    </div>

                    <div className="po-form-group">
                        <label>Nome do Morador Responsável <span className="obrigatorio">*</span></label>
                        <input
                            type="text"
                            placeholder="Nome completo do morador"
                            value={formData.nomeMorador}
                            onChange={(e) => handleChange('nomeMorador', e.target.value)}
                            required
                        />
                    </div>
                </div>
            </div>

            {/* SEÇÃO 2: CARACTERIZAÇÃO DO IMÓVEL */}
            <div className="po-card-secao mb-4 border rounded p-3 bg-white shadow-sm">
                <div className="po-subtitulo-form border-bottom pb-2 mb-3 text-secondary font-weight-bold">
                    <i className="fas fa-home mr-2"></i> 2. Estrutura do Imóvel e Anexos
                </div>

                <div className="po-form-linha-tripla">
                    <div className="po-form-group">
                        <label>Tipo de Parede <span className="obrigatorio">*</span></label>
                        <select value={formData.tipoParede} onChange={(e) => handleChange('tipoParede', e.target.value)}>
                            <option value="1">1. Alvenaria C/ Reboco</option>
                            <option value="2">2. Alvenaria S/ Reboco</option>
                            <option value="3">3. Taipa C/ Reboco</option>
                            <option value="4">4. Taipa S/ Reboco</option>
                            <option value="5">5. Madeira</option>
                            <option value="6">6. Outros</option>
                        </select>
                    </div>

                    <div className="po-form-group">
                        <label>Tipo de Teto <span className="obrigatorio">*</span></label>
                        <select value={formData.tipoTeto} onChange={(e) => handleChange('tipoTeto', e.target.value)}>
                            <option value="1">1. Telha</option>
                            <option value="2">2. Palha / Sapé</option>
                            <option value="3">3. Madeira</option>
                            <option value="4">4. Metálico / Zinco</option>
                            <option value="5">5. Outros</option>
                        </select>
                    </div>

                    <div className="po-form-group">
                        <label>Tipo de Piso <span className="obrigatorio">*</span></label>
                        <select value={formData.tipoPiso} onChange={(e) => handleChange('tipoPiso', e.target.value)}>
                            <option value="1">1. Chão Batido</option>
                            <option value="2">2. Cimento</option>
                            <option value="3">3. Cerâmica</option>
                            <option value="4">4. Outros</option>
                        </select>
                    </div>
                </div>

                <div className="mt-3">
                    <label className="font-weight-bold text-dark mb-2">Anexos Presentes no Peridomicílio:</label>
                    <div className="d-flex flex-wrap gap-3 align-items-center bg-light p-2 rounded">
                        {['galinheiro', 'chiqueiro', 'curral', 'paiol'].map(anexoKey => (
                            <div key={anexoKey} className="d-flex align-items-center bg-white border rounded px-3 py-1 mr-2">
                                <input
                                    type="checkbox"
                                    id={`anexo-${anexoKey}`}
                                    checked={formData.anexos[anexoKey].tem}
                                    onChange={() => handleAnexoToggle(anexoKey)}
                                    className="mr-2"
                                />
                                <label htmlFor={`anexo-${anexoKey}`} className="mb-0 text-capitalize font-weight-500 mr-2">
                                    {anexoKey}
                                </label>
                                {formData.anexos[anexoKey].tem && (
                                    <input
                                        type="number"
                                        placeholder="Qtd"
                                        style={{ width: '60px', padding: '2px 6px', fontSize: '12px' }}
                                        value={formData.anexos[anexoKey].qtd}
                                        onChange={(e) => handleAnexoQtdChange(anexoKey, e.target.value)}
                                        min="1"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* SEÇÃO 3: REGISTROS DA PESQUISA ENTOMOLÓGICA */}
            <div className="po-card-secao mb-4 border rounded p-3 bg-white shadow-sm">
                <div className="po-subtitulo-form border-bottom pb-2 mb-3 text-primary font-weight-bold">
                    <i className="fas fa-bug mr-2"></i> 3. Registros da Pesquisa Entomológica (Busca Ativa)
                </div>

                <div className="triato-secoes-empilhadas">
                    {/* INTRADOMICÍLIO */}
                    <TabelaAmbiente
                        titulo="Intradomicílio"
                        icone="fa-home"
                        corTag="danger"
                        dados={formData.intradomicilio}
                        onChange={(secao, campo, val) =>
                            handleAmbienteChange('intradomicilio', secao, campo, val)
                        }
                    />

                    {/* PERIDOMICÍLIO */}
                    <TabelaAmbiente
                        titulo="Peridomicílio"
                        icone="fa-tree"
                        corTag="primary"
                        dados={formData.peridomicilio}
                        onChange={(secao, campo, val) =>
                            handleAmbienteChange('peridomicilio', secao, campo, val)
                        }
                    />
                </div>
            </div>

            {/* OBSERVAÇÕES DE CAMPO */}
            <div className="po-card-secao mb-4 border rounded p-3 bg-white shadow-sm">
                <label className="font-weight-bold text-dark d-block mb-2">
                    <i className="fas fa-comment-alt mr-2 text-primary"></i> Observações de Campo:
                </label>
                <textarea
                    rows="3"
                    className="br-input triato-textarea-obs"
                    placeholder="Informações adicionais da vistoria..."
                    value={formData.observacoes}
                    onChange={(e) => handleChange('observacoes', e.target.value)}
                ></textarea>
            </div>

            {/* RODAPÉ DO FORMULÁRIO */}
            <div className="po-modal-footer d-flex justify-content-end gap-2 mt-3 pt-3 border-top">
                {onCancelar && (
                    <button type="button" className="btn-cancelar mr-2" onClick={onCancelar}>
                        Cancelar
                    </button>
                )}
                <button type="submit" className="btn-confirmar-boletim">
                    <i className="fas fa-save mr-1"></i> Salvar Busca Ativa de Triatomíneos
                </button>
            </div>
        </form>
    );
}

{/* SUBCOMPONENTE DA TABELA */}
function TabelaAmbiente({ titulo, icone, corTag, dados, onChange }) {
    return (
        <div className={`triato-bloco-card border-${corTag} mb-4`}>
            <div className={`triato-bloco-header header-${corTag}`}>
                <i className={`fas ${icone} mr-2`}></i> {titulo}
            </div>

            <div className="triato-tabelas-grid">
                {/* TABELA 1: COLETADO (QUANTITATIVO) */}
                <div className="triato-tabela-box">
                    <table className="triato-table">
                        <thead>
                            <tr>
                                <th colSpan="2">Coletado (Qtd.)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="label-col">Triatomíneo</td>
                                <td className="input-col">
                                    <input
                                        type="number"
                                        min="0"
                                        className="triato-input-qtd"
                                        value={dados.coletado.triatomineo}
                                        onChange={(e) => onChange('coletado', 'triatomineo', parseInt(e.target.value) || 0)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="label-col">Ovo</td>
                                <td className="input-col">
                                    <input
                                        type="number"
                                        min="0"
                                        className="triato-input-qtd"
                                        value={dados.coletado.ovo}
                                        onChange={(e) => onChange('coletado', 'ovo', parseInt(e.target.value) || 0)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="label-col">Vestígios / Muda</td>
                                <td className="input-col">
                                    <input
                                        type="number"
                                        min="0"
                                        className="triato-input-qtd"
                                        value={dados.coletado.vestigiosMuda}
                                        onChange={(e) => onChange('coletado', 'vestigiosMuda', parseInt(e.target.value) || 0)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="label-col p-1">
                                    <input
                                        type="text"
                                        placeholder="Outros / Qual?"
                                        className="triato-input-texto"
                                        value={dados.coletado.outrosNome}
                                        onChange={(e) => onChange('coletado', 'outrosNome', e.target.value)}
                                    />
                                </td>
                                <td className="input-col">
                                    <input
                                        type="number"
                                        min="0"
                                        className="triato-input-qtd"
                                        value={dados.coletado.outrosQtd}
                                        onChange={(e) => onChange('coletado', 'outrosQtd', parseInt(e.target.value) || 0)}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* TABELA 2: LOCAL ENCONTRADO (CHECKBOX) */}
                <div className="triato-tabela-box">
                    <table className="triato-table">
                        <thead>
                            <tr>
                                <th colSpan="2">Local Encontrado (Assinalar)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="label-col">Sala</td>
                                <td className="input-col">
                                    <input
                                        type="checkbox"
                                        className="triato-checkbox"
                                        checked={dados.localEncontrado.sala}
                                        onChange={(e) => onChange('localEncontrado', 'sala', e.target.checked)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="label-col">Quarto</td>
                                <td className="input-col">
                                    <input
                                        type="checkbox"
                                        className="triato-checkbox"
                                        checked={dados.localEncontrado.quarto}
                                        onChange={(e) => onChange('localEncontrado', 'quarto', e.target.checked)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="label-col">Cozinha</td>
                                <td className="input-col">
                                    <input
                                        type="checkbox"
                                        className="triato-checkbox"
                                        checked={dados.localEncontrado.cozinha}
                                        onChange={(e) => onChange('localEncontrado', 'cozinha', e.target.checked)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="label-col">Banheiro</td>
                                <td className="input-col">
                                    <input
                                        type="checkbox"
                                        className="triato-checkbox"
                                        checked={dados.localEncontrado.banheiro}
                                        onChange={(e) => onChange('localEncontrado', 'banheiro', e.target.checked)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="label-col p-1">
                                    <input
                                        type="text"
                                        placeholder="Outros / Qual?"
                                        className="triato-input-texto"
                                        value={dados.localEncontrado.outrosNome}
                                        onChange={(e) => onChange('localEncontrado', 'outrosNome', e.target.value)}
                                    />
                                </td>
                                <td className="input-col">
                                    <input
                                        type="checkbox"
                                        className="triato-checkbox"
                                        checked={dados.localEncontrado.outrosChecked}
                                        onChange={(e) => onChange('localEncontrado', 'outrosChecked', e.target.checked)}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}