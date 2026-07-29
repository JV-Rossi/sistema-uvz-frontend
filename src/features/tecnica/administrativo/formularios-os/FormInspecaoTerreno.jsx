import React, { useState } from 'react';

export default function FormInspecaoTerreno({ dadosTerreno, setDadosTerreno }) {
    const [previewFoto, setPreviewFoto] = useState(dadosTerreno?.fotoBase64 || null);

    const handleChange = (campo, valor) => {
        setDadosTerreno(prev => ({
            ...prev,
            [campo]: valor
        }));
    };

    // 📸 Manipulador para upload de foto
    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewFoto(reader.result);
                handleChange('fotoBase64', reader.result);
                handleChange('nomeArquivo', file.name);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoverFoto = () => {
        setPreviewFoto(null);
        handleChange('fotoBase64', null);
        handleChange('nomeArquivo', '');
    };

    return (
        <div className="os-subform-card mt-4 border-top pt-3">
            <h3 className="text-weight-semi-bold os-section-title text-primary">
                <i className="fas fa-trash-restore mr-2"></i> Detalhes da Solicitação de Inspeção
            </h3>

            <div className="os-grid">
                {/* TIPO DE OCORRÊNCIA / IMÓVEL */}
                <div className="br-input">
                    <label>Tipo de Imóvel / Terreno <span className="text-danger">*</span></label>
                    <select
                        className="br-select"
                        value={dadosTerreno?.tipoOcorrencia || ''}
                        onChange={(e) => handleChange('tipoOcorrencia', e.target.value)}
                    >
                        <option value="">Selecione...</option>
                        <option value="Terreno Baldio">Terreno Baldio</option>
                        <option value="Casa / Imóvel de Acumulador">Casa / Imóvel de Acumulador</option>
                        <option value="Imóvel Abandonado">Imóvel Abandonado</option>
                        <option value="Outro">Outro</option>
                    </select>
                </div>

                {/* ORIGEM DO REGISTRO */}
                <div className="br-input">
                    <label>Origem do Registro / Denúncia <span className="text-danger">*</span></label>
                    <select
                        className="br-select"
                        value={dadosTerreno?.origemRegistro || ''}
                        onChange={(e) => handleChange('origemRegistro', e.target.value)}
                    >
                        <option value="">Selecione...</option>
                        <option value="Denúncia de Munícipe (Telefone / Presencial)">Denúncia de Munícipe (Telefone / Presencial)</option>
                        <option value="Solicitação via WhatsApp">Solicitação via WhatsApp</option>
                        <option value="Ofício / Protocolo Institucional">Ofício / Protocolo Institucional</option>
                        <option value="Demanda Interna / Mapeamento">Demanda Interna / Mapeamento</option>
                    </select>
                </div>

                {/* PONTO DE REFERÊNCIA */}
                <div className="br-input os-grid-full">
                    <label>Ponto de Referência do Local</label>
                    <input
                        type="text"
                        placeholder="Ex: Próximo ao mercado X, ao lado da casa verde nº 120"
                        value={dadosTerreno?.referencia || ''}
                        onChange={(e) => handleChange('referencia', e.target.value)}
                    />
                </div>

                {/* 🟢 DROPZONE MODERNO DE UPLOAD DE FOTO */}
                <div className="br-input os-grid-full">
                    <label>Anexar Imagem / Foto da Denúncia (Opcional)</label>
                    
                    {!previewFoto ? (
                        <div className="upload-dropzone">
                            <input
                                type="file"
                                accept="image/*"
                                id="input-foto-terreno"
                                className="d-none"
                                onChange={handleFotoChange}
                            />
                            <label htmlFor="input-foto-terreno" className="upload-label">
                                <div className="upload-icon-wrapper">
                                    <i className="fas fa-cloud-upload-alt"></i>
                                </div>
                                <div className="upload-text">
                                    <strong>Clique aqui para selecionar a foto</strong> ou escolha do dispositivo
                                </div>
                                <span className="upload-hint">Anexe registros fotográficos recebidos da denúncia</span>
                            </label>
                        </div>
                    ) : (
                        <div className="upload-preview-card">
                            <img
                                src={previewFoto}
                                alt="Foto do Terreno / Denúncia"
                                className="upload-preview-img"
                            />
                            <div className="upload-preview-info">
                                <span className="upload-filename">
                                    <i className="fas fa-image text-primary mr-1"></i> {dadosTerreno?.nomeArquivo || 'imagem_anexada.jpg'}
                                </span>
                                <button
                                    type="button"
                                    className="btn-remover-foto"
                                    onClick={handleRemoverFoto}
                                >
                                    <i className="fas fa-trash-alt mr-1"></i> Remover Imagem
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}