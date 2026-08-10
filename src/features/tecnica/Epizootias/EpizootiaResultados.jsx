import React, { useState } from 'react';

export default function EpizootiaResultados({ osSelecionada, onSalvar, onCancelar }) {
    const [dataVisita, setDataVisita] = useState(new Date().toISOString().split('T')[0]);
    const [agenteResponsavel, setAgenteResponsavel] = useState('');
    const [observacoesVisita, setObservacoesVisita] = useState('');

    const [animais, setAnimais] = useState([
        {
            id: Date.now(),
            nomeAnimal: '',
            especie: 'CÃO',
            sexo: 'MACHO',
            vacinadoRaiva: 'NAO',
            loteVacina: '',
            testeLeishmaniose: 'NAO_REALIZADO',
            conduta: 'MANTIDO_NO_LOCAL'
        }
    ]);

    const handleAdicionarAnimal = () => {
        setAnimais(prev => [
            ...prev,
            {
                id: Date.now() + Math.random(),
                nomeAnimal: '',
                especie: 'CÃO',
                sexo: 'MACHO',
                vacinadoRaiva: 'NAO',
                loteVacina: '',
                testeLeishmaniose: 'NAO_REALIZADO',
                conduta: 'MANTIDO_NO_LOCAL'
            }
        ]);
    };

    const handleRemoverAnimal = (id) => {
        if (animais.length === 1) return;
        setAnimais(prev => prev.filter(a => a.id !== id));
    };

    const handleAnimalChange = (id, campo, valor) => {
        setAnimais(prev => prev.map(a => a.id === id ? { ...a, [campo]: valor } : a));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            osId: osSelecionada?.id,
            dataVisita,
            agenteResponsavel,
            observacoesVisita,
            totalAnimaisVistoriados: animais.length,
            animais
        };
        if (onSalvar) onSalvar(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="po-form-container p-3 bg-white rounded border">
            {/* CABEÇALHO RESUMO */}
            {osSelecionada && (
                <div className="po-card-secao mb-3 p-3 bg-light border rounded">
                    <div className="text-primary font-weight-bold mb-1">
                        <i className="fas fa-info-circle mr-2"></i> Chamado #{osSelecionada.id} — {osSelecionada.servico}
                    </div>
                    <div><strong>Tutor / Solicitante:</strong> {osSelecionada.municipe}</div>
                    <div><strong>Endereço:</strong> {osSelecionada.bairro}, {osSelecionada.endereco}</div>
                </div>
            )}

            {/* SEÇÃO 1: CABEÇALHO DA VISITA */}
            <div className="po-card-secao mb-3 border rounded p-3 bg-white">
                <h4 className="text-primary font-weight-bold mb-3" style={{ fontSize: '1rem' }}>
                    <i className="fas fa-calendar-alt mr-2"></i> 1. Dados da Visita de Campo
                </h4>
                <div className="row">
                    <div className="col-12 col-md-4 mb-2">
                        <div className="br-input">
                            <label>Data da Visita <span className="text-danger">*</span></label>
                            <input
                                type="date"
                                value={dataVisita}
                                onChange={e => setDataVisita(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="col-12 col-md-8 mb-2">
                        <div className="br-input">
                            <label>Agente / Veterinário Responsável <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                placeholder="Ex: CARLOS ALBERTO"
                                value={agenteResponsavel}
                                onChange={e => setAgenteResponsavel(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* SEÇÃO 2: LISTA DE ANIMAIS */}
            <div className="po-card-secao mb-3 border rounded p-3 bg-white">
                <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                    <h4 className="text-primary font-weight-bold mb-0" style={{ fontSize: '1rem' }}>
                        <i className="fas fa-paw mr-2"></i> 2. Animais Vistoriados
                    </h4>
                    <button type="button" className="br-button secondary small" onClick={handleAdicionarAnimal}>
                        <i className="fas fa-plus mr-1"></i> Adicionar Animal
                    </button>
                </div>

                {animais.map((animal, idx) => (
                    <div key={animal.id} className="p-3 mb-3 border rounded bg-light">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="font-weight-bold text-primary">Animal #{idx + 1}</span>
                            {animais.length > 1 && (
                                <button type="button" className="br-button circle small text-danger" onClick={() => handleRemoverAnimal(animal.id)}>
                                    <i className="fas fa-trash"></i>
                                </button>
                            )}
                        </div>

                        <div className="row">
                            <div className="col-12 col-md-3 mb-2">
                                <div className="br-input small">
                                    <label>Nome / Identificação</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Rex"
                                        value={animal.nomeAnimal}
                                        onChange={e => handleAnimalChange(animal.id, 'nomeAnimal', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-6 col-md-2 mb-2">
                                <div className="br-select w-100 small">
                                    <label>Espécie</label>
                                    <select value={animal.especie} onChange={e => handleAnimalChange(animal.id, 'especie', e.target.value)}>
                                        <option value="CÃO">Cão</option>
                                        <option value="GATO">Gato</option>
                                        <option value="OUTRO">Outro</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-6 col-md-2 mb-2">
                                <div className="br-select w-100 small">
                                    <label>Sexo</label>
                                    <select value={animal.sexo} onChange={e => handleAnimalChange(animal.id, 'sexo', e.target.value)}>
                                        <option value="MACHO">Macho</option>
                                        <option value="FEMEA">Fêmea</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-6 col-md-2 mb-2">
                                <div className="br-select w-100 small">
                                    <label>Vacina Antirrábica</label>
                                    <select value={animal.vacinadoRaiva} onChange={e => handleAnimalChange(animal.id, 'vacinadoRaiva', e.target.value)}>
                                        <option value="SIM">Aplicada Hoje</option>
                                        <option value="JA_VACINADO">Já Vacinado</option>
                                        <option value="NAO">Não Vacinado</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-6 col-md-3 mb-2">
                                <div className="br-select w-100 small">
                                    <label>Teste Leishmaniose</label>
                                    <select value={animal.testeLeishmaniose} onChange={e => handleAnimalChange(animal.id, 'testeLeishmaniose', e.target.value)}>
                                        <option value="NAO_REALIZADO">Não Realizado</option>
                                        <option value="NAO_REAGENTE">Não Reagente (-)</option>
                                        <option value="REAGENTE">Reagente (+)</option>
                                        <option value="INCONCLUSIVO">Inconclusivo</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* PARECER TÉCNICO */}
            <div className="po-card-secao mb-3 border rounded p-3 bg-white">
                <label className="font-weight-bold d-block mb-2 text-dark">Observações / Parecer Técnico:</label>
                <textarea
                    rows="3"
                    className="br-input w-100"
                    placeholder="Relate sintomas, condutas adotadas ou orientações repassadas ao morador..."
                    value={observacoesVisita}
                    onChange={e => setObservacoesVisita(e.target.value)}
                ></textarea>
            </div>

            {/* BOTÕES */}
            <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                {onCancelar && (
                    <button type="button" className="br-button secondary" onClick={onCancelar}>
                        Cancelar
                    </button>
                )}
                <button type="submit" className="br-button primary">
                    <i className="fas fa-save mr-1"></i> Salvar Resultado da Visita
                </button>
            </div>
        </form>
    );
}