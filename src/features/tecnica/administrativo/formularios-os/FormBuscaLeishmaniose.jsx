import React, { useState } from 'react';
import '../../../../shared/components/Formularios.css';
import './FormBuscaBase.css';

const estadoInicialAnimal = () => ({
    id: Date.now() + Math.random(),
    nome: '',
    especie: 'cao', // Fixo como cão (rotina exclusiva de LVC na CVSA)
    raca: '',
    sexo: 'macho',
    idade: '',
    porte: 'medio',
    corPelo: '',
    domiciliado: 'domiciliado',
    origem: '',
    quandoAdoeceu: '',
    saiSolto: 'nao',
    
    // Imunização Antirrábica
    vacinadoRaiva: 'sim',
    localVacina: 'campanha',
    ultimaVacina: '',
    
    // 🟢 CAMPOS DE COLETA PARA O LABORATÓRIO / BANCADA DPP
    coletouSangue: 'sim', // 'sim', 'nao', 'recusa', 'inviavel'
    codigoTubo: '',       // Ex: DPP-2026-042
    motivoNaoColeta: '',
    
    // Quadro Clínico
    sintomas: [],
    feridas: [],
    outrosSintomas: '',
    fotoBase64: null,
    nomeFoto: ''
});

export default function FormBuscaLeishmaniose({ osSelecionada, onSubmitLaudo, onCancelar }) {
    // 🧠 1. DADOS DA VISITA E LOCALIZAÇÃO
    const [formData, setFormData] = useState({
        nomeMunicipio: 'CUIABÁ',
        nomeLocalidade: osSelecionada?.bairro || '',
        dataAtividade: new Date().toISOString().split('T')[0],
        equipeResponsavel: osSelecionada?.equipeAlocada || '',
        atividade: 'Realizada',
        denuncia: 'Sim',
        quarteirao: osSelecionada?.quarteirao || '',
        numeroImovel: '',
        complemento: '',
        nomeMorador: osSelecionada?.municipe || '',
        coordenadas: null, 

        // 🧠 2. FATORES AMBIENTAIS E EPIDEMIOLÓGICOS DO IMÓVEL
        pessoasCasa: '',
        moradorComorbidade: 'nao',
        moradorLeishmaniose: 'nao', 
        possuiMuro: 'sim',
        localCaes: 'quintal',
        teveLeishmaniose: 'nao',
        qtdLeishmaniose: '',
        quandoLeishmaniose: '', 
        outrosAnimais: '',
        fatoresAmbientais: {
            arvoreFrutifera: false,
            galinheiro: false,
            matoAlto: false,
            coletaLixo: true,
            esgotoTratado: true
        },

        observacoes: ''
    });

    const [carregandoGPS, setCarregandoGPS] = useState(false);

    // 🧠 3. LISTA DE ANIMAIS VISTORIADOS
    const [animais, setAnimais] = useState([estadoInicialAnimal()]);

    // HANDLERS
    const handleChange = (campo, valor) => {
        setFormData(prev => ({ ...prev, [campo]: valor }));
    };

    const handleFatorAmbientalToggle = (chave) => {
        setFormData(prev => ({
            ...prev,
            fatoresAmbientais: {
                ...prev.fatoresAmbientais,
                [chave]: !prev.fatoresAmbientais[chave]
            }
        }));
    };

    // 📍 CAPTURA DE GPS
    const capturarGPS = () => {
        setCarregandoGPS(true);
        if (!navigator.geolocation) {
            alert("Seu dispositivo não suporta GPS.");
            setCarregandoGPS(false);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (posicao) => {
                handleChange('coordenadas', {
                    lat: posicao.coords.latitude,
                    lng: posicao.coords.longitude
                });
                setCarregandoGPS(false);
            },
            (erro) => {
                alert(`⚠️ Falha no GPS. Verifique a permissão do navegador.\nErro: ${erro.message}`);
                setCarregandoGPS(false);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
    };

    // HANDLERS DE ANIMAIS
    const handleAdicionarAnimal = () => {
        setAnimais(prev => [...prev, estadoInicialAnimal()]);
    };

    const handleRemoverAnimal = (id) => {
        if (animais.length === 1) return;
        setAnimais(prev => prev.filter(a => a.id !== id));
    };

    const handleAnimalChange = (id, campo, valor) => {
        setAnimais(prev => prev.map(a => a.id === id ? { ...a, [campo]: valor } : a));
    };

    const handleCheckboxArray = (id, tipoArray, item, isChecked) => {
        setAnimais(prev => prev.map(a => {
            if (a.id !== id) return a;
            return {
                ...a,
                [tipoArray]: isChecked
                    ? [...a[tipoArray], item]
                    : a[tipoArray].filter(i => i !== item)
            };
        }));
    };

    // 📸 UPLOAD DE FOTO DO ANIMAL
    const handleFotoChange = (id, e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAnimais(prev => prev.map(a => a.id === id ? {
                    ...a,
                    fotoBase64: reader.result,
                    nomeFoto: file.name
                } : a));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoverFoto = (id) => {
        setAnimais(prev => prev.map(a => a.id === id ? {
            ...a,
            fotoBase64: null,
            nomeFoto: ''
        } : a));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validação: se marcou que coletou sangue, o código do tubo é obrigatório para o laboratório
        for (let i = 0; i < animais.length; i++) {
            const a = animais[i];
            if (a.coletouSangue === 'sim' && !a.codigoTubo.trim()) {
                alert(`Por favor, informe o Nº do Tubo / Amostra coletada para o animal #${i + 1} (${a.nome || 'Sem nome'}).`);
                return;
            }
        }

        const totalAmostrasColetadas = animais.filter(a => a.coletouSangue === 'sim').length;

        const payload = {
            osId: osSelecionada?.id,
            ...formData,
            animais,
            totalAnimaisVistoriados: animais.length,
            totalAmostrasColetadas
        };

        if (onSubmitLaudo) {
            onSubmitLaudo(payload);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="po-form-container p-2">

            {/* RESUMO DO CHAMADO O.S. */}
            {osSelecionada && (
                <div className="po-card-secao mb-4 p-3 bg-light border-left-primary border rounded">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <div>
                            <span className="badge-distrito"><i className="fas fa-paw mr-1"></i> O.S. #{osSelecionada.id}</span>
                            <span className="ml-2 font-weight-bold text-primary">{osSelecionada.servico}</span>
                        </div>
                        <div className="text-small text-muted">
                            <i className="fas fa-user mr-1"></i> Tutor/Solicitante: <strong>{osSelecionada.municipe}</strong> | Local: <strong>{osSelecionada.bairro}, {osSelecionada.endereco}</strong>
                        </div>
                    </div>
                </div>
            )}

            {/* SEÇÃO 1: LOCALIZAÇÃO E DADOS DA VISITA */}
            <div className="po-card-secao mb-4 border rounded p-3 bg-white shadow-sm">
                <div className="po-subtitulo-form border-bottom pb-2 mb-3 text-primary font-weight-bold d-flex justify-content-between align-items-center">
                    <span><i className="fas fa-map-marker-alt mr-2"></i> 1. LOCALIZAÇÃO E DADOS DA VISITA DE CAMPO</span>
                    
                    <button 
                        type="button" 
                        onClick={capturarGPS}
                        disabled={carregandoGPS}
                        className={`br-button small ${formData.coordenadas ? 'bg-success text-white border-success' : 'primary'}`}
                    >
                        <i className={`fas ${carregandoGPS ? 'fa-spinner fa-spin' : 'fa-satellite-dish'} mr-2`}></i>
                        {formData.coordenadas ? 'GPS Capturado' : 'Capturar GPS'}
                    </button>
                </div>

                {formData.coordenadas && (
                    <div className="text-success font-weight-bold mb-3 d-flex align-items-center text-small">
                        <i className="fas fa-check-circle mr-2"></i>
                        Lat: {formData.coordenadas.lat.toFixed(6)} | Lng: {formData.coordenadas.lng.toFixed(6)}
                    </div>
                )}

                <div className="po-form-linha-tripla">
                    <div className="po-form-group">
                        <label>Município</label>
                        <input type="text" value={formData.nomeMunicipio} disabled className="bg-light" />
                    </div>

                    <div className="po-form-group">
                        <label>Localidade / Bairro <span className="obrigatorio">*</span></label>
                        <input
                            type="text"
                            placeholder="Ex: Pedra 90"
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

                <div className="po-form-group mt-3">
                    <label>Agente(s) / Equipe Responsável pela Vistoria <span className="obrigatorio">*</span></label>
                    <input
                        type="text"
                        placeholder="Ex: CARLOS ALBERTO, ANA PAULA"
                        value={formData.equipeResponsavel}
                        onChange={(e) => handleChange('equipeResponsavel', e.target.value)}
                        required
                    />
                </div>

                <div className="po-form-linha-tripla mt-3">
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
                            <option value="Sim">Sim (Atendimento a Notificação)</option>
                            <option value="Não">Não (Inquérito de Rotina)</option>
                        </select>
                    </div>

                    <div className="po-form-group">
                        <label>Quarteirão <span className="obrigatorio">*</span></label>
                        <input
                            type="number"
                            placeholder="Ex: 22"
                            value={formData.quarteirao}
                            onChange={(e) => handleChange('quarteirao', e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="po-form-linha-tripla mt-3">
                    <div className="po-form-group">
                        <label>Nº do Imóvel <span className="obrigatorio">*</span></label>
                        <input
                            type="text"
                            placeholder="Ex: 105 ou S/N"
                            value={formData.numeroImovel}
                            onChange={(e) => handleChange('numeroImovel', e.target.value)}
                            required
                        />
                    </div>

                    <div className="po-form-group">
                        <label>Complemento</label>
                        <input
                            type="text"
                            placeholder="Ex: Casa B, Fundos"
                            value={formData.complemento}
                            onChange={(e) => handleChange('complemento', e.target.value)}
                        />
                    </div>

                    <div className="po-form-group">
                        <label>Nome do Tutor / Responsável <span className="obrigatorio">*</span></label>
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
                    <i className="fas fa-home mr-2"></i> 2. CARACTERIZAÇÃO EPIDEMIOLÓGICA E VETORIAL DO IMÓVEL
                </div>

                <div className="po-form-linha-tripla mb-3 pb-3 border-bottom" style={{ alignItems: 'flex-end' }}>
                    <div className="po-form-group">
                        <label>Nº de Residentes na Casa</label>
                        <input
                            type="number"
                            min="1"
                            placeholder="Qtd de pessoas"
                            value={formData.pessoasCasa}
                            onChange={(e) => handleChange('pessoasCasa', e.target.value)}
                        />
                    </div>

                    <div className="po-form-group">
                        <label>Morador possui comorbidade?</label>
                        <select value={formData.moradorComorbidade} onChange={(e) => handleChange('moradorComorbidade', e.target.value)}>
                            <option value="nao">Não</option>
                            <option value="sim">Sim</option>
                        </select>
                    </div>

                    <div className="po-form-group">
                        <label>Morador já teve Leishmaniose?</label>
                        <select value={formData.moradorLeishmaniose} onChange={(e) => handleChange('moradorLeishmaniose', e.target.value)}>
                            <option value="nao">Não / Nunca teve</option>
                            <option value="tegumentar">Sim (Tegumentar / Pele)</option>
                            <option value="visceral">Sim (Visceral / Calazar)</option>
                        </select>
                    </div>
                </div>

                <div className="po-form-linha-tripla mb-3" style={{ alignItems: 'flex-end' }}>
                    <div className="po-form-group">
                        <label>Possui Muro Fechado?</label>
                        <select value={formData.possuiMuro} onChange={(e) => handleChange('possuiMuro', e.target.value)}>
                            <option value="sim">Sim (Alvenaria/Muro)</option>
                            <option value="nao">Não (Cerca/Aberto)</option>
                        </select>
                    </div>

                    <div className="po-form-group">
                        <label>Permanência dos Cães</label>
                        <select value={formData.localCaes} onChange={(e) => handleChange('localCaes', e.target.value)}>
                            <option value="quintal">Quintal / Peridomicílio</option>
                            <option value="casa">Dentro de Casa / Intradomicílio</option>
                            <option value="rua">Soltos na Rua / Livre Acesso</option>
                        </select>
                    </div>

                    <div className="po-form-group">
                        <label>Cães Positivos no Histórico?</label>
                        <select value={formData.teveLeishmaniose} onChange={(e) => handleChange('teveLeishmaniose', e.target.value)}>
                            <option value="nao">Não / Sem histórico</option>
                            <option value="sim">Sim (Histórico positivo prévio)</option>
                        </select>
                    </div>
                </div>

                <div className="po-form-linha-tripla mb-3" style={{ alignItems: 'flex-end' }}>
                    {formData.teveLeishmaniose === 'sim' && (
                        <>
                            <div className="po-form-group">
                                <label>Qtd. Positivados Anterior</label>
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="Qtd de cães"
                                    value={formData.qtdLeishmaniose}
                                    onChange={(e) => handleChange('qtdLeishmaniose', e.target.value)}
                                />
                            </div>

                            <div className="po-form-group">
                                <label>Quando ocorreu? (Data)</label>
                                <input
                                    type="text"
                                    placeholder="Ex: 2024 ou 05/2023"
                                    value={formData.quandoLeishmaniose}
                                    onChange={(e) => handleChange('quandoLeishmaniose', e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    <div className="po-form-group" style={{ gridColumn: formData.teveLeishmaniose === 'sim' ? 'auto' : 'span 3' }}>
                        <label>Outros Animais no Imóvel (Aves, Criações...)</label>
                        <input
                            type="text"
                            placeholder="Ex: Galinhas, cavalos, pássaros..."
                            value={formData.outrosAnimais}
                            onChange={(e) => handleChange('outrosAnimais', e.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-4 pt-3 border-top">
                    <label className="font-weight-bold text-dark mb-2 d-block">
                        Fatores Favoráveis ao Vetor (Lutzomyia longipalpis) no Peridomicílio:
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
                        {[
                            { chave: 'arvoreFrutifera', label: 'Árvores Frutíferas / Matéria Orgânica' },
                            { chave: 'galinheiro', label: 'Galinheiro / Criação de Animais' },
                            { chave: 'matoAlto', label: 'Mato Alto / Sombreamento / Umidade' },
                            { chave: 'coletaLixo', label: 'Coleta Regular de Lixo' },
                            { chave: 'esgotoTratado', label: 'Rede de Esgoto Tratado' }
                        ].map(fator => (
                            <div key={fator.chave} className="d-flex align-items-center bg-light border rounded px-3 py-2">
                                <input
                                    type="checkbox"
                                    id={`fator-${fator.chave}`}
                                    checked={formData.fatoresAmbientais[fator.chave]}
                                    onChange={() => handleFatorAmbientalToggle(fator.chave)}
                                    className="mr-2"
                                />
                                <label htmlFor={`fator-${fator.chave}`} className="mb-0 font-weight-500 cursor-pointer" style={{ fontSize: '13px' }}>
                                    {fator.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* SEÇÃO 3: REGISTRO CLÍNICO E COLETA POR ANIMAL */}
            <div className="po-card-secao mb-4 border rounded p-3 bg-white shadow-sm">
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                    <span className="po-subtitulo-form text-primary font-weight-bold m-0">
                        <i className="fas fa-stethoscope mr-2"></i> 3. REGISTRO CLÍNICO E COLETA SANGUÍNEA (CANINOS)
                    </span>
                    <button type="button" className="br-button primary small" onClick={handleAdicionarAnimal}>
                        <i className="fas fa-plus mr-1"></i> Adicionar Cão
                    </button>
                </div>

                {animais.map((animal, idx) => (
                    <div key={animal.id} className="p-3 mb-4 border rounded bg-light">
                        <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                            <span className="font-weight-bold text-primary" style={{ fontSize: '1rem' }}>
                                <i className="fas fa-dog mr-2"></i> Cão #{idx + 1}
                            </span>
                            {animais.length > 1 && (
                                <button type="button" className="btn-remover-linha" onClick={() => handleRemoverAnimal(animal.id)}>
                                    <i className="fas fa-trash-alt mr-1"></i> Remover Animal
                                </button>
                            )}
                        </div>

                        {/* LINHA 1: IDENTIFICAÇÃO E FOTO */}
                        <div className="po-form-linha-tripla mb-3">
                            <div className="po-form-group">
                                <label>Nome do Cão <span className="obrigatorio">*</span></label>
                                <input
                                    type="text"
                                    placeholder="Ex: Rex"
                                    value={animal.nome}
                                    onChange={(e) => handleAnimalChange(animal.id, 'nome', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="po-form-group">
                                <label>Raça</label>
                                <input
                                    type="text"
                                    placeholder="Ex: SRD / Pitbull"
                                    value={animal.raca}
                                    onChange={(e) => handleAnimalChange(animal.id, 'raca', e.target.value)}
                                />
                            </div>
                            
                            <div className="po-form-group">
                                <label>Foto do Animal (Opcional)</label>
                                {!animal.fotoBase64 ? (
                                    <div className="d-flex align-items-center">
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            id={`foto-${animal.id}`} 
                                            className="d-none"
                                            onChange={(e) => handleFotoChange(animal.id, e)}
                                        />
                                        <label htmlFor={`foto-${animal.id}`} className="br-button secondary small mb-0 w-100 d-flex justify-content-center">
                                            <i className="fas fa-camera mr-2"></i> Anexar Imagem
                                        </label>
                                    </div>
                                ) : (
                                    <div className="d-flex align-items-center justify-content-between bg-white border rounded p-1">
                                        <span className="text-success text-small ml-2 text-truncate" style={{maxWidth: '120px'}}>
                                            <i className="fas fa-image mr-1"></i> {animal.nomeFoto}
                                        </span>
                                        <button type="button" className="btn-remover-linha p-1" onClick={() => handleRemoverFoto(animal.id)}>
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* LINHA 2: CARACTERÍSTICAS FÍSICAS */}
                        <div className="po-form-linha-tripla mb-3">
                            <div className="po-form-group">
                                <label>Sexo</label>
                                <select value={animal.sexo} onChange={(e) => handleAnimalChange(animal.id, 'sexo', e.target.value)}>
                                    <option value="macho">Macho</option>
                                    <option value="femea">Fêmea</option>
                                </select>
                            </div>

                            <div className="po-form-group">
                                <label>Idade Aproximada</label>
                                <input
                                    type="text"
                                    placeholder="Ex: 3 anos"
                                    value={animal.idade}
                                    onChange={(e) => handleAnimalChange(animal.id, 'idade', e.target.value)}
                                />
                            </div>

                            <div className="po-form-group">
                                <label>Porte</label>
                                <select value={animal.porte} onChange={(e) => handleAnimalChange(animal.id, 'porte', e.target.value)}>
                                    <option value="pequeno">Pequeno</option>
                                    <option value="medio">Médio</option>
                                    <option value="grande">Grande</option>
                                </select>
                            </div>
                        </div>
                        
                        {/* LINHA 3: PELAGEM E SITUAÇÃO */}
                        <div className="po-form-linha-tripla mb-3">
                            <div className="po-form-group">
                                <label>Cor da Pelagem</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Caramelo, Preta"
                                    value={animal.corPelo}
                                    onChange={(e) => handleAnimalChange(animal.id, 'corPelo', e.target.value)}
                                />
                            </div>

                            <div className="po-form-group">
                                <label>Situação do Animal</label>
                                <select value={animal.domiciliado} onChange={(e) => handleAnimalChange(animal.id, 'domiciliado', e.target.value)}>
                                    <option value="domiciliado">Domiciliado (Possui tutor)</option>
                                    <option value="errante">Errante / De rua</option>
                                </select>
                            </div>

                            <div className="po-form-group">
                                <label>Acesso à Rua Solto Sem Guia?</label>
                                <select value={animal.saiSolto} onChange={(e) => handleAnimalChange(animal.id, 'saiSolto', e.target.value)}>
                                    <option value="nao">Não (Fica no quintal/preso)</option>
                                    <option value="sim">Sim (Sai solto na rua)</option>
                                </select>
                            </div>
                        </div>

                        {/* 🟢 SUB-BLOCO: COLETA DE SANGUE PARA A BANCADA DO LABORATÓRIO (DPP) */}
                        <div className="p-3 mb-3 bg-white rounded border" style={{ borderLeft: '4px solid #0288d1' }}>
                            <div className="font-weight-bold text-primary mb-2" style={{ fontSize: '0.9rem' }}>
                                <i className="fas fa-vial mr-1"></i> Coleta Sanguínea para Triagem DPP (Laboratório CVSA)
                            </div>
                            <div className="po-form-linha-dupla">
                                <div className="po-form-group">
                                    <label>Amostra Coletada? <span className="obrigatorio">*</span></label>
                                    <select 
                                        value={animal.coletouSangue} 
                                        onChange={(e) => handleAnimalChange(animal.id, 'coletouSangue', e.target.value)}
                                    >
                                        <option value="sim">Sim (Sangue Coletado no Tubo)</option>
                                        <option value="nao">Não Coletado (Sem Indicação / Assintomático)</option>
                                        <option value="recusa">Recusada pelo Tutor</option>
                                        <option value="inviavel">Inviável (Agressividade / Difícil Acesso)</option>
                                    </select>
                                </div>

                                {animal.coletouSangue === 'sim' ? (
                                    <div className="po-form-group">
                                        <label>Nº do Tubo / Código da Amostra <span className="obrigatorio">*</span></label>
                                        <input
                                            type="text"
                                            placeholder="Ex: DPP-2026-042 ou Lote/Tubo nº"
                                            value={animal.codigoTubo}
                                            onChange={(e) => handleAnimalChange(animal.id, 'codigoTubo', e.target.value)}
                                            required
                                        />
                                    </div>
                                ) : (
                                    <div className="po-form-group">
                                        <label>Motivo da Não Coleta</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: Tutor assinou recusa / Animal agressivo"
                                            value={animal.motivoNaoColeta}
                                            onChange={(e) => handleAnimalChange(animal.id, 'motivoNaoColeta', e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* SUB-BLOCO: IMUNIZAÇÃO ANTIRRÁBICA */}
                        <div className="p-3 mb-3 bg-white rounded border">
                            <div className="font-weight-bold text-secondary mb-2" style={{ fontSize: '0.9rem' }}>
                                <i className="fas fa-syringe mr-1"></i> Imunização Antirrábica
                            </div>
                            <div className="po-form-linha-tripla">
                                <div className="po-form-group">
                                    <label>Vacinado Contra Raiva?</label>
                                    <select value={animal.vacinadoRaiva} onChange={(e) => handleAnimalChange(animal.id, 'vacinadoRaiva', e.target.value)}>
                                        <option value="sim">Sim (Vacinado)</option>
                                        <option value="nao">Não Vacinado</option>
                                        <option value="desconhecido">Desconhecido</option>
                                    </select>
                                </div>

                                {animal.vacinadoRaiva === 'sim' && (
                                    <>
                                        <div className="po-form-group">
                                            <label>Local da Imunização</label>
                                            <select value={animal.localVacina} onChange={(e) => handleAnimalChange(animal.id, 'localVacina', e.target.value)}>
                                                <option value="campanha">Campanha Oficial SUS</option>
                                                <option value="clinica">Clínica Particular</option>
                                                <option value="loja">Agropecuária / Loja</option>
                                            </select>
                                        </div>

                                        <div className="po-form-group">
                                            <label>Ano/Mês da Última Dose</label>
                                            <input
                                                type="text"
                                                placeholder="Ex: 2025/10"
                                                value={animal.ultimaVacina}
                                                onChange={(e) => handleAnimalChange(animal.id, 'ultimaVacina', e.target.value)}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* SUB-BLOCO: QUADRO CLÍNICO E LESÕES */}
                        <div className="p-3 bg-white rounded border">
                            <p className="font-weight-bold text-danger mb-2" style={{ fontSize: '0.85rem' }}>
                                <i className="fas fa-notes-medical mr-1"></i> Sinais Clínicos Compatíveis com Leishmaniose Visceral Canina (LVC):
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '8px' }} className="mb-3">
                                {[
                                    'Sem sintomas',
                                    'Magreza / Emagrecimento',
                                    'Unhas grandes (Onicogrifose)',
                                    'Queda de pelo / Alopecia',
                                    'Descamação / Caspa',
                                    'Apatia / Prostração',
                                    'Febre',
                                    'Cegueira / Queratoconjuntivite'
                                ].map(sintoma => (
                                    <div key={sintoma} className="d-flex align-items-center">
                                        <input
                                            type="checkbox"
                                            id={`${animal.id}-${sintoma}`}
                                            checked={animal.sintomas.includes(sintoma)}
                                            onChange={e => handleCheckboxArray(animal.id, 'sintomas', sintoma, e.target.checked)}
                                            className="mr-2"
                                        />
                                        <label htmlFor={`${animal.id}-${sintoma}`} className="mb-0 font-weight-500 cursor-pointer" style={{ fontSize: '13px' }}>
                                            {sintoma}
                                        </label>
                                    </div>
                                ))}
                            </div>

                            <p className="font-weight-bold text-secondary mb-2 border-top pt-2" style={{ fontSize: '0.85rem' }}>
                                Localização das Lesões de Pele / Feridas (Se houver):
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px' }} className="mb-3">
                                {[
                                    'Nas orelhas',
                                    'No nariz / Focinho',
                                    'Ao redor dos olhos',
                                    'Nas patas',
                                    'No corpo / Dorso',
                                    'Na cauda'
                                ].map(ferida => (
                                    <div key={ferida} className="d-flex align-items-center">
                                        <input
                                            type="checkbox"
                                            id={`${animal.id}-f-${ferida}`}
                                            checked={animal.feridas.includes(ferida)}
                                            onChange={e => handleCheckboxArray(animal.id, 'feridas', ferida, e.target.checked)}
                                            className="mr-2"
                                        />
                                        <label htmlFor={`${animal.id}-f-${ferida}`} className="mb-0 font-weight-500 cursor-pointer" style={{ fontSize: '13px' }}>
                                            {ferida}
                                        </label>
                                    </div>
                                ))}
                            </div>

                            <div className="po-form-group">
                                <label>Outros Sintomas / Lesões (Especificar)</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Esplenomegalia, linfoadenopatia palpável..."
                                    value={animal.outrosSintomas}
                                    onChange={(e) => handleAnimalChange(animal.id, 'outrosSintomas', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* SEÇÃO 4: OBSERVAÇÕES TÉCNICAS */}
            <div className="po-card-secao mb-4 border rounded p-3 bg-white shadow-sm">
                <label className="font-weight-bold text-dark d-block mb-2">
                    <i className="fas fa-comment-alt mr-2 text-primary"></i> Observações Técnicas do Atendimento e Parecer Zoosanitário:
                </label>
                <textarea
                    rows="3"
                    className="br-input triato-textarea-obs"
                    placeholder="Relate recusas de coleta, orientação verbal repassada ao tutor, condições ambientais críticas do imóvel ou termos assinados..."
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
                    <i className="fas fa-save mr-1"></i> Salvar Vistoria de Epizootias
                </button>
            </div>
        </form>
    );
}