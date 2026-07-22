import React, { useState } from 'react';

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
    numeroHabitantes: '',
    distanciaMata: 'menos_200m',
    situacaoCasa: 'Habitada',
    tipoParede: '1',
    tipoTeto: '1',
    tipoPiso: '2',
    anexos: {
        galinheiro: { tem: false, qtd: '' },
        chiqueiro: { tem: false, qtd: '' },
        curral: { tem: false, qtd: '' },
        paiol: { tem: false, qtd: '' }
    },
    intradomicilio: {
        houveColeta: 'Não', // 🟢 BOOLEANO (Sim / Não)
        coletado: 'Triatomíneo',
        coletadoOutrosQual: '',
        localEncontrado: 'Quarto',
        localEncontradoQual: ''
    },
    peridomicilio: {
        houveColeta: 'Não', // 🟢 BOOLEANO (Sim / Não)
        coletado: 'Triatomíneo',
        coletadoOutrosQual: '',
        localEncontrado: 'Galinheiro',
        localEncontradoQual: ''
    }
};

export default function FormTriatomineos({ onSubmitLaudo, onCancelar }) {
    const [formData, setFormData] = useState(estadoInicial);

    const handleChange = (campo, valor) => {
        setFormData(prev => ({ ...prev, [campo]: valor }));
    };

    const handleNestedChange = (secao, campo, valor) => {
        setFormData(prev => ({
            ...prev,
            [secao]: { ...prev[secao], [campo]: valor }
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
            
            {/* ========================================================= */}
            {/* SEÇÃO 1: DADOS DA VISITA E LOCALIZAÇÃO                     */}
            {/* ========================================================= */}
            <div className="po-card-secao mb-3 border rounded p-3 bg-white shadow-sm">
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

            {/* ========================================================= */}
            {/* SEÇÃO 2: CARACTERIZAÇÃO DO IMÓVEL                         */}
            {/* ========================================================= */}
            <div className="po-card-secao mb-3 border rounded p-3 bg-white shadow-sm">
                <div className="po-subtitulo-form border-bottom pb-2 mb-3 text-secondary font-weight-bold">
                    <i className="fas fa-home mr-2"></i> 2. Estrutura e Eco-epidemiologia do Imóvel
                </div>

                <div className="po-form-linha-tripla">
                    <div className="po-form-group">
                        <label>Tipo de Parede <span className="obrigatorio">*</span></label>
                        <select value={formData.tipoParede} onChange={(e) => handleChange('tipoParede', e.target.value)}>
                            <option value="1">1. Alvenaria C/ Reboco</option>
                            <option value="2">2. Alvenaria S/ Reboco</option>
                            <option value="3">3. Barro C/ Reboco (Taipa)</option>
                            <option value="4">4. Barro S/ Reboco</option>
                            <option value="5">5. Madeira</option>
                            <option value="6">6. Outros</option>
                        </select>
                    </div>

                    <div className="po-form-group">
                        <label>Tipo de Teto <span className="obrigatorio">*</span></label>
                        <select value={formData.tipoTeto} onChange={(e) => handleChange('tipoTeto', e.target.value)}>
                            <option value="1">1. Telha (Cerâmica/Cimento)</option>
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
                            <option value="3">3. Cerâmica / Porcelanato</option>
                            <option value="4">4. Outros</option>
                        </select>
                    </div>
                </div>

                {/* Seleção de Anexos Peridomiciliares */}
                <div className="mt-3">
                    <label className="font-weight-bold text-dark mb-2">Anexos Presentes no Peridomicílio:</label>
                    <div className="d-flex flex-wrap gap-3 align-items-center bg-light p-2 rounded">
                        {['galinheiro', 'chiqueiro', 'curral', 'paiol'].map(anexoKey => (
                            <div key={anexoKey} className="d-flex align-items-center bg-white border rounded px-3 py-1">
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

            {/* ========================================================= */}
            {/* SEÇÃO 3: INTRADOMICÍLIO (COM BOOLEANO DE COLETA)          */}
            {/* ========================================================= */}
            <div className="po-card-secao mb-3 border rounded p-3 bg-white shadow-sm" style={{ borderLeft: '5px solid #dc3545' }}>
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                    <span className="font-weight-bold text-danger" style={{ fontSize: '15px' }}>
                        <i className="fas fa-bed mr-2"></i> 3. Intradomicílio
                    </span>
                    <span className={`badge ${formData.intradomicilio.houveColeta === 'Sim' ? 'badge-danger' : 'badge-secondary'} p-2`}>
                        {formData.intradomicilio.houveColeta === 'Sim' ? 'COLETA POSITIVA' : 'PESQUISA NEGATIVA'}
                    </span>
                </div>

                {/* 🔴 PERGUNTA CHAVE: HOUVE COLETA? */}
                <div className="po-form-linha-dupla align-items-center">
                    <div className="po-form-group">
                        <label className="font-weight-bold">Houve Coleta / Encontro de Espécimes no Intradomicílio? <span className="obrigatorio">*</span></label>
                        <select 
                            value={formData.intradomicilio.houveColeta} 
                            onChange={(e) => handleNestedChange('intradomicilio', 'houveColeta', e.target.value)}
                            className={formData.intradomicilio.houveColeta === 'Sim' ? 'border-danger font-weight-bold text-danger' : ''}
                        >
                            <option value="Não">Não (Pesquisa Negativa no Intradomicílio)</option>
                            <option value="Sim">Sim (Foi encontrado / capturado)</option>
                        </select>
                    </div>

                    {/* SÓ EXIBE SE HOUVE COLETA = SIM */}
                    {formData.intradomicilio.houveColeta === 'Sim' && (
                        <div className="po-form-group">
                            <label>O que foi coletado? <span className="obrigatorio">*</span></label>
                            <select 
                                value={formData.intradomicilio.coletado} 
                                onChange={(e) => handleNestedChange('intradomicilio', 'coletado', e.target.value)}
                            >
                                <option value="Triatomíneo">Triatomíneo (Barbeiro)</option>
                                <option value="Ovo">Ovo</option>
                                <option value="Vestígios/Muda">Vestígios / Exúvia (Muda)</option>
                                <option value="Outros">Outros</option>
                            </select>
                        </div>
                    )}
                </div>

                {/* DETALHES ADICIONAIS QUANDO HÁ COLETA */}
                {formData.intradomicilio.houveColeta === 'Sim' && (
                    <div className="po-form-linha-dupla mt-2 pt-2 border-top">
                        <div className="po-form-group">
                            <label>Local Encontrado no Intradomicílio <span className="obrigatorio">*</span></label>
                            <select 
                                value={formData.intradomicilio.localEncontrado} 
                                onChange={(e) => handleNestedChange('intradomicilio', 'localEncontrado', e.target.value)}
                            >
                                <option value="Quarto">Quarto / Dormitório</option>
                                <option value="Sala">Sala de Estar/Jantar</option>
                                <option value="Cozinha">Cozinha</option>
                                <option value="Banheiro">Banheiro</option>
                                <option value="Outros">Outros cômodos</option>
                            </select>
                        </div>

                        {formData.intradomicilio.localEncontrado === 'Outros' && (
                            <div className="po-form-group">
                                <label>Especifique o Local:</label>
                                <input 
                                    type="text" 
                                    placeholder="Ex: Corredor, Dispensa"
                                    value={formData.intradomicilio.localEncontradoQual}
                                    onChange={(e) => handleNestedChange('intradomicilio', 'localEncontradoQual', e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ========================================================= */}
            {/* SEÇÃO 4: PERIDOMICÍLIO (COM BOOLEANO DE COLETA)           */}
            {/* ========================================================= */}
            <div className="po-card-secao mb-3 border rounded p-3 bg-white shadow-sm" style={{ borderLeft: '5px solid #0056b3' }}>
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                    <span className="font-weight-bold text-primary" style={{ fontSize: '15px' }}>
                        <i className="fas fa-tree mr-2"></i> 4. Peridomicílio
                    </span>
                    <span className={`badge ${formData.peridomicilio.houveColeta === 'Sim' ? 'badge-primary' : 'badge-secondary'} p-2`}>
                        {formData.peridomicilio.houveColeta === 'Sim' ? 'COLETA POSITIVA' : 'PESQUISA NEGATIVA'}
                    </span>
                </div>

                {/* 🔵 PERGUNTA CHAVE: HOUVE COLETA? */}
                <div className="po-form-linha-dupla align-items-center">
                    <div className="po-form-group">
                        <label className="font-weight-bold">Houve Coleta / Encontro de Espécimes no Peridomicílio? <span className="obrigatorio">*</span></label>
                        <select 
                            value={formData.peridomicilio.houveColeta} 
                            onChange={(e) => handleNestedChange('peridomicilio', 'houveColeta', e.target.value)}
                            className={formData.peridomicilio.houveColeta === 'Sim' ? 'border-primary font-weight-bold text-primary' : ''}
                        >
                            <option value="Não">Não (Pesquisa Negativa no Peridomicílio)</option>
                            <option value="Sim">Sim (Foi encontrado / capturado)</option>
                        </select>
                    </div>

                    {/* SÓ EXIBE SE HOUVE COLETA = SIM */}
                    {formData.peridomicilio.houveColeta === 'Sim' && (
                        <div className="po-form-group">
                            <label>O que foi coletado? <span className="obrigatorio">*</span></label>
                            <select 
                                value={formData.peridomicilio.coletado} 
                                onChange={(e) => handleNestedChange('peridomicilio', 'coletado', e.target.value)}
                            >
                                <option value="Triatomíneo">Triatomíneo (Barbeiro)</option>
                                <option value="Ovo">Ovo</option>
                                <option value="Vestígios/Muda">Vestígios / Exúvia (Muda)</option>
                                <option value="Outros">Outros</option>
                            </select>
                        </div>
                    )}
                </div>

                {/* DETALHES ADICIONAIS QUANDO HÁ COLETA */}
                {formData.peridomicilio.houveColeta === 'Sim' && (
                    <div className="po-form-linha-dupla mt-2 pt-2 border-top">
                        <div className="po-form-group">
                            <label>Local Encontrado no Peridomicílio <span className="obrigatorio">*</span></label>
                            <select 
                                value={formData.peridomicilio.localEncontrado} 
                                onChange={(e) => handleNestedChange('peridomicilio', 'localEncontrado', e.target.value)}
                            >
                                <option value="Galinheiro">Galinheiro</option>
                                <option value="Chiqueiro">Chiqueiro</option>
                                <option value="Entulho/Madeira">Pilha de Entulho / Madeira</option>
                                <option value="Paiol">Paiol / Depósito</option>
                                <option value="Outros">Outros anexos</option>
                            </select>
                        </div>

                        {formData.peridomicilio.localEncontrado === 'Outros' && (
                            <div className="po-form-group">
                                <label>Especifique o Local:</label>
                                <input 
                                    type="text" 
                                    placeholder="Ex: Árvore, Canil"
                                    value={formData.peridomicilio.localEncontradoQual}
                                    onChange={(e) => handleNestedChange('peridomicilio', 'localEncontradoQual', e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* RODAPÉ DO FORMULÁRIO */}
            <div className="po-modal-footer d-flex justify-content-end gap-2 mt-3 pt-3 border-top">
                {onCancelar && (
                    <button type="button" className="btn-cancelar" onClick={onCancelar}>
                        Cancelar
                    </button>
                )}
                <button type="submit" className="btn-confirmar-boletim">
                    <i className="fas fa-save mr-1"></i> Salvar Laudo de Triatomíneos
                </button>
            </div>
        </form>
    );
}