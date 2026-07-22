import React, { useState } from 'react';

// Estado inicial padrão da ficha de barbeiros
const estadoInicialTriatomineos = {
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
        coletado: 'Triatomíneo',
        coletadoOutrosQual: '',
        localEncontrado: 'Quarto',
        localEncontradoQual: ''
    },
    peridomicilio: {
        coletado: 'Triatomíneo',
        coletadoOutrosQual: '',
        localEncontrado: 'Galinheiro',
        localEncontradoQual: ''
    }
};

export default function FormTriatomineos({ onSubmitLaudo }) {
    const [formData, setFormData] = useState(estadoInicialTriatomineos);

    const handleChange = (campo, valor) => {
        setFormData(prev => ({ ...prev, [campo]: valor }));
    };

    const handleNestedChange = (secao, campo, valor) => {
        setFormData(prev => ({
            ...prev,
            [secao]: { ...prev[secao], [campo]: valor }
        }));
    };

    const handleAnexoChange = (anexoKey, campo, valor) => {
        setFormData(prev => ({
            ...prev,
            anexos: {
                ...prev.anexos,
                [anexoKey]: { ...prev.anexos[anexoKey], [campo]: valor }
            }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmitLaudo(formData); // Envia a ficha preenchida para salvar
    };

    return (
        <form onSubmit={handleSubmit} className="form-triatomineos-container">
            
            {/* 1. VISITA E LOCALIZAÇÃO */}
            <div className="po-subtitulo-form">1. Localização e Visita da Equipe Técnica</div>

            <div className="po-form-linha-tripla">
                <div className="po-form-group">
                    <label>Município</label>
                    <input type="text" value={formData.nomeMunicipio} onChange={(e) => handleChange('nomeMunicipio', e.target.value)} required />
                </div>

                <div className="po-form-group">
                    <label>Localidade / Bairro <span className="obrigatorio">*</span></label>
                    <input type="text" placeholder="Ex: CPA II" value={formData.nomeLocalidade} onChange={(e) => handleChange('nomeLocalidade', e.target.value)} required />
                </div>

                <div className="po-form-group">
                    <label>Data da Atividade <span className="obrigatorio">*</span></label>
                    <input type="date" value={formData.dataAtividade} onChange={(e) => handleChange('dataAtividade', e.target.value)} required />
                </div>
            </div>

            <div className="po-form-linha-tripla">
                <div className="po-form-group">
                    <label>Atividade <span className="obrigatorio">*</span></label>
                    <select value={formData.atividade} onChange={(e) => handleChange('atividade', e.target.value)}>
                        <option value="Realizada">Realizada</option>
                        <option value="Fechada">Fechada</option>
                        <option value="Recusada">Recusada</option>
                    </select>
                </div>

                <div className="po-form-group">
                    <label>Denúncia? <span className="obrigatorio">*</span></label>
                    <select value={formData.denuncia} onChange={(e) => handleChange('denuncia', e.target.value)}>
                        <option value="Sim">Sim</option>
                        <option value="Não">Não</option>
                    </select>
                </div>

                <div className="po-form-group">
                    <label>Quarteirão <span className="obrigatorio">*</span></label>
                    <input type="number" placeholder="Ex: 14" value={formData.quarteirao} onChange={(e) => handleChange('quarteirao', e.target.value)} required />
                </div>
            </div>

            <div className="po-form-linha-tripla">
                <div className="po-form-group">
                    <label>Nº do Imóvel <span className="obrigatorio">*</span></label>
                    <input type="text" placeholder="Ex: 210" value={formData.numeroImovel} onChange={(e) => handleChange('numeroImovel', e.target.value)} required />
                </div>

                <div className="po-form-group">
                    <label>Complemento</label>
                    <input type="text" placeholder="Ex: Casa A" value={formData.complemento} onChange={(e) => handleChange('complemento', e.target.value)} />
                </div>

                <div className="po-form-group">
                    <label>Nome do Morador <span className="obrigatorio">*</span></label>
                    <input type="text" placeholder="Nome do morador" value={formData.nomeMorador} onChange={(e) => handleChange('nomeMorador', e.target.value)} required />
                </div>
            </div>

            {/* ESTRUTURA DO IMÓVEL */}
            <div className="po-subtitulo-form">Estrutura do Imóvel</div>
            <div className="po-form-linha-tripla">
                <div className="po-form-group">
                    <label>Tipo de Parede <span className="obrigatorio">*</span></label>
                    <select value={formData.tipoParede} onChange={(e) => handleChange('tipoParede', e.target.value)}>
                        <option value="1">1. Alvenaria C/ Reboco</option>
                        <option value="2">2. Alvenaria S/ Reboco</option>
                        <option value="3">3. Barro C/ Reboco</option>
                        <option value="4">4. Barro S/ Reboco</option>
                        <option value="5">5. Madeira</option>
                        <option value="6">6. Outros</option>
                    </select>
                </div>

                <div className="po-form-group">
                    <label>Tipo de Teto <span className="obrigatorio">*</span></label>
                    <select value={formData.tipoTeto} onChange={(e) => handleChange('tipoTeto', e.target.value)}>
                        <option value="1">1. Telha</option>
                        <option value="2">2. Palha</option>
                        <option value="3">3. Madeira</option>
                        <option value="4">4. Metálico</option>
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

            {/* 2. INTRADOMICÍLIO */}
            <div className="po-subtitulo-form mt-3" style={{ color: '#c53030' }}>
                <i className="fas fa-home mr-1"></i> 2. Intradomicílio
            </div>

            <div className="po-form-linha-dupla">
                <div className="po-form-group">
                    <label>Coletado <span className="obrigatorio">*</span></label>
                    <select value={formData.intradomicilio.coletado} onChange={(e) => handleNestedChange('intradomicilio', 'coletado', e.target.value)}>
                        <option value="Triatomíneo">Triatomíneo</option>
                        <option value="Ovo">Ovo</option>
                        <option value="Vestígios/Muda">Vestígios/Muda</option>
                        <option value="Outros">Outros</option>
                    </select>
                </div>

                <div className="po-form-group">
                    <label>Local Encontrado <span className="obrigatorio">*</span></label>
                    <select value={formData.intradomicilio.localEncontrado} onChange={(e) => handleNestedChange('intradomicilio', 'localEncontrado', e.target.value)}>
                        <option value="Sala">Sala</option>
                        <option value="Quarto">Quarto</option>
                        <option value="Cozinha">Cozinha</option>
                        <option value="Banheiro">Banheiro</option>
                        <option value="Outros">Outros</option>
                    </select>
                </div>
            </div>

            {/* 3. PERIDOMICÍLIO */}
            <div className="po-subtitulo-form mt-3" style={{ color: '#2b6cb0' }}>
                <i className="fas fa-tree mr-1"></i> 3. Peridomicílio
            </div>

            <div className="po-form-linha-dupla">
                <div className="po-form-group">
                    <label>Coletado <span className="obrigatorio">*</span></label>
                    <select value={formData.peridomicilio.coletado} onChange={(e) => handleNestedChange('peridomicilio', 'coletado', e.target.value)}>
                        <option value="Triatomíneo">Triatomíneo</option>
                        <option value="Ovo">Ovo</option>
                        <option value="Vestígios/Muda">Vestígios/Muda</option>
                        <option value="Outros">Outros</option>
                    </select>
                </div>

                <div className="po-form-group">
                    <label>Local Encontrado <span className="obrigatorio">*</span></label>
                    <select value={formData.peridomicilio.localEncontrado} onChange={(e) => handleNestedChange('peridomicilio', 'localEncontrado', e.target.value)}>
                        <option value="Galinheiro">Galinheiro</option>
                        <option value="Chiqueiro">Chiqueiro</option>
                        <option value="Entulho/Madeira">Entulho/Madeira</option>
                        <option value="Paiol">Paiol</option>
                        <option value="Outros">Outros</option>
                    </select>
                </div>
            </div>

            <div className="po-modal-footer mt-4">
                <button type="submit" className="btn-confirmar-boletim">
                    <i className="fas fa-save mr-1"></i> Salvar Laudo de Triatomíneos
                </button>
            </div>
        </form>
    );
}