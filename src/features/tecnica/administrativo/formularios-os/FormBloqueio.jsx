import React from 'react';

export default function FormBloqueio({ dadosBloqueio, setDadosBloqueio }) {
    const handleChange = (campo, valor) => {
        setDadosBloqueio(prev => ({
            ...prev,
            [campo]: valor
        }));
    };

    return (
        <div className="os-subform-card mt-4 border-top pt-3">
            <h3 className="text-weight-semi-bold os-section-title text-danger">
                <i className="fas fa-biohazard mr-2"></i> Dados Complementares - Bloqueio de Foco
            </h3>
            <div className="os-grid">
                <div className="br-input">
                    <label>Nome do Paciente</label>
                    <input
                        type="text"
                        placeholder="Nome completo do paciente"
                        value={dadosBloqueio?.paciente || ''}
                        onChange={(e) => handleChange('paciente', e.target.value)}
                    />
                </div>

                <div className="br-input">
                    <label>Suspeita Notificada <span className="text-danger">*</span></label>
                    <select
                        className="br-select"
                        value={dadosBloqueio?.suspeita || ''}
                        onChange={(e) => handleChange('suspeita', e.target.value)}
                    >
                        <option value="">Selecione...</option>
                        <option value="Dengue">Dengue</option>
                        <option value="Zika">Zika</option>
                        <option value="Chikungunya">Chikungunya</option>
                    </select>
                </div>

                <div className="br-input">
                    <label>Data de Início dos Sintomas</label>
                    <input
                        type="date"
                        value={dadosBloqueio?.dataSintomas || ''}
                        onChange={(e) => handleChange('dataSintomas', e.target.value)}
                    />
                </div>

                <div className="br-input">
                    <label>Ponto de Referência do Imóvel</label>
                    <input
                        type="text"
                        placeholder="Ex: Próximo à escola X, em frente ao mercado Y"
                        value={dadosBloqueio?.referencia || ''}
                        onChange={(e) => handleChange('referencia', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}