import React from 'react';

export default function FormLeishmaniose({
    ambienteLeish, setAmbienteLeish, 
    animaisLeish, adicionarAnimal, removerAnimal, 
    handleAnimalChange, handleCheckboxArray
}) {
    return (
        <div className="mt-5 pt-3">
            <div className="br-message is-warning mb-4">
                <div className="icon"><i className="fas fa-exclamation-triangle fa-lg"></i></div>
                <div className="content">
                    <span className="message-title text-weight-semi-bold">Atenção:</span>
                    <span className="message-body"> O Teste de Leishmaniose exige a coleta dos dados epidemiológicos abaixo.</span>
                </div>
            </div>

            {/* --- DADOS DO AMBIENTE --- */}
            <h4 className="text-weight-semi-bold text-secondary mb-3"><i className="fas fa-home mr-2"></i>A. Dados do Ambiente</h4>
            <div className="leish-subcard">
                <div className="os-grid">
                    <div className="br-input"><label>Quantas pessoas residem na casa?</label><input type="number" value={ambienteLeish.pessoasCasa} onChange={e => setAmbienteLeish({...ambienteLeish, pessoasCasa: e.target.value})} /></div>
                    <div className="br-input">
                        <label>Possui muro?</label>
                        <select className="br-select" value={ambienteLeish.possuiMuro} onChange={e => setAmbienteLeish({...ambienteLeish, possuiMuro: e.target.value})}>
                            <option value="">Selecione...</option><option value="sim">Sim</option><option value="nao">Não</option>
                        </select>
                    </div>
                    <div className="br-input"><label>Quantidade de Cães:</label><input type="number" value={ambienteLeish.qtdCaes} onChange={e => setAmbienteLeish({...ambienteLeish, qtdCaes: e.target.value})} /></div>
                    <div className="br-input"><label>Quantidade de Gatos:</label><input type="number" value={ambienteLeish.qtdGatos} onChange={e => setAmbienteLeish({...ambienteLeish, qtdGatos: e.target.value})} /></div>
                    <div className="br-input">
                        <label>Os cães vivem no(a):</label>
                        <select className="br-select" value={ambienteLeish.localCaes} onChange={e => setAmbienteLeish({...ambienteLeish, localCaes: e.target.value})}>
                            <option value="">Selecione...</option><option value="quintal">Quintal</option><option value="casa">Dentro de Casa</option><option value="rua">Soltos na Rua</option>
                        </select>
                    </div>
                    <div className="br-input">
                        <label>Já teve cães com Leishmaniose?</label>
                        <select className="br-select" value={ambienteLeish.teveLeishmaniose} onChange={e => setAmbienteLeish({...ambienteLeish, teveLeishmaniose: e.target.value})}>
                            <option value="">Selecione...</option><option value="sim">Sim</option><option value="nao">Não</option>
                        </select>
                    </div>
                    {ambienteLeish.teveLeishmaniose === 'sim' && (
                        <div className="br-input"><label>Quantos cães positivados no passado?</label><input type="number" value={ambienteLeish.qtdLeishmaniose} onChange={e => setAmbienteLeish({...ambienteLeish, qtdLeishmaniose: e.target.value})} /></div>
                    )}
                </div>

                <p className="text-weight-semi-bold mt-4 mb-3 text-muted">Fatores Ambientais no Imóvel (Marque se houver):</p>
                <div className="d-flex flex-wrap gap-4">
                    {[
                        {id: 'arvoreFrutifera', label: 'Árvore Frutífera'},
                        {id: 'galinheiro', label: 'Galinheiro'},
                        {id: 'matoAlto', label: 'Mato Alto'},
                        {id: 'coletaLixo', label: 'Coleta de Lixo'},
                        {id: 'esgotoTratado', label: 'Esgoto Tratado'}
                    ].map(item => (
                        <div className="br-checkbox" key={item.id}>
                            <input id={`amb-${item.id}`} type="checkbox" checked={ambienteLeish[item.id]} onChange={e => setAmbienteLeish({...ambienteLeish, [item.id]: e.target.checked})} />
                            <label htmlFor={`amb-${item.id}`}>{item.label}</label>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- CARDS DOS ANIMAIS --- */}
            <div className="d-flex justify-content-between align-items-center mb-3 mt-5">
                <h4 className="text-weight-semi-bold text-secondary mb-0"><i className="fas fa-paw mr-2"></i>B. Animais a serem testados</h4>
                <button type="button" className="br-button secondary small" onClick={adicionarAnimal}>
                    <i className="fas fa-plus mr-2"></i> Adicionar Animal
                </button>
            </div>

            {animaisLeish.map((animal, index) => (
                <div key={animal.id} className="animal-card">
                    {/* Header do Card Suavizado */}
                    <div className="animal-card-header">
                        <h5 className="text-weight-semi-bold text-primary mb-0">Animal {index + 1}</h5>
                        {animaisLeish.length > 1 && (
                            <button type="button" className="br-button danger circle small" onClick={() => removerAnimal(animal.id)} title="Remover este animal">
                                <i className="fas fa-trash"></i>
                            </button>
                        )}
                    </div>

                    <div className="animal-card-body">
                        <div className="os-grid">
                            <div className="br-input"><label>Nome do Animal</label><input type="text" value={animal.nome} onChange={e => handleAnimalChange(animal.id, 'nome', e.target.value)} /></div>
                            <div className="br-input">
                                <label>Espécie</label>
                                <select className="br-select" value={animal.especie} onChange={e => handleAnimalChange(animal.id, 'especie', e.target.value)}>
                                    <option value="">Selecione...</option><option value="cao">Cão</option><option value="gato">Gato</option>
                                </select>
                            </div>
                            <div className="br-input"><label>Raça</label><input type="text" value={animal.raca} onChange={e => handleAnimalChange(animal.id, 'raca', e.target.value)} /></div>
                            <div className="br-input">
                                <label>Sexo</label>
                                <select className="br-select" value={animal.sexo} onChange={e => handleAnimalChange(animal.id, 'sexo', e.target.value)}>
                                    <option value="">Selecione...</option><option value="macho">Macho</option><option value="femea">Fêmea</option>
                                </select>
                            </div>
                            <div className="br-input"><label>Idade Aproximada</label><input type="text" value={animal.idade} onChange={e => handleAnimalChange(animal.id, 'idade', e.target.value)} /></div>
                            <div className="br-input">
                                <label>Porte</label>
                                <select className="br-select" value={animal.porte} onChange={e => handleAnimalChange(animal.id, 'porte', e.target.value)}>
                                    <option value="">Selecione...</option><option value="pequeno">Pequeno</option><option value="medio">Médio</option><option value="grande">Grande</option>
                                </select>
                            </div>
                            <div className="br-input"><label>Cor da Pelagem</label><input type="text" value={animal.corPelo} onChange={e => handleAnimalChange(animal.id, 'corPelo', e.target.value)} /></div>
                            <div className="br-input">
                                <label>Situação</label>
                                <select className="br-select" value={animal.domiciliado} onChange={e => handleAnimalChange(animal.id, 'domiciliado', e.target.value)}>
                                    <option value="">Selecione...</option><option value="domiciliado">Domiciliado (Tem dono)</option><option value="errante">Errante (De rua)</option>
                                </select>
                            </div>
                        </div>

                        <div className="os-grid mt-4">
                            <div className="br-input"><label>De onde veio?</label><input type="text" value={animal.origem} onChange={e => handleAnimalChange(animal.id, 'origem', e.target.value)} /></div>
                            <div className="br-input"><label>Quando adoeceu?</label><input type="text" value={animal.quandoAdoeceu} onChange={e => handleAnimalChange(animal.id, 'quandoAdoeceu', e.target.value)} /></div>
                            <div className="br-input">
                                <label>Sai à rua solto?</label>
                                <select className="br-select" value={animal.saiSolto} onChange={e => handleAnimalChange(animal.id, 'saiSolto', e.target.value)}>
                                    <option value="">Selecione...</option><option value="sim">Sim</option><option value="nao">Não</option>
                                </select>
                            </div>
                            <div className="br-input">
                                <label>Vacinado contra a Raiva?</label>
                                <select className="br-select" value={animal.vacinadoRaiva} onChange={e => handleAnimalChange(animal.id, 'vacinadoRaiva', e.target.value)}>
                                    <option value="">Selecione...</option><option value="sim">Sim</option><option value="nao">Não</option>
                                </select>
                            </div>
                            {animal.vacinadoRaiva === 'sim' && (
                                <>
                                    <div className="br-input">
                                        <label>Local da Vacina</label>
                                        <select className="br-select" value={animal.localVacina} onChange={e => handleAnimalChange(animal.id, 'localVacina', e.target.value)}>
                                            <option value="">Selecione...</option><option value="campanha">Campanha</option><option value="clinica">Clínica</option><option value="loja">Loja</option>
                                        </select>
                                    </div>
                                    <div className="br-input"><label>Última Vacina (Ano/Mês)</label><input type="text" value={animal.ultimaVacina} onChange={e => handleAnimalChange(animal.id, 'ultimaVacina', e.target.value)} /></div>
                                </>
                            )}
                        </div>

                        {/* Bloco de Sintomas pontilhado e sem bordas duplas */}
                        <div className="sintomas-container">
                            <p className="text-weight-semi-bold mb-3 text-danger"><i className="fas fa-stethoscope mr-2"></i>Situação Clínica (Sintomas)</p>
                            
                            <div className="os-grid mb-4">
                                {['Sem sintomas', 'Magreza', 'Unhas grandes', 'Queda de pelo', 'Descamação (caspa)', 'Apatia (tristeza)', 'Febre', 'Cegueira'].map(sintoma => (
                                    <div className="br-checkbox" key={sintoma}>
                                        <input id={`${animal.id}-${sintoma}`} type="checkbox" checked={animal.sintomas.includes(sintoma)} onChange={e => handleCheckboxArray(animal.id, 'sintomas', sintoma, e.target.checked)} />
                                        <label htmlFor={`${animal.id}-${sintoma}`}>{sintoma}</label>
                                    </div>
                                ))}
                            </div>

                            <p className="text-weight-semi-bold text-small mb-3 text-muted border-top pt-3">Localização das Feridas (Se houver):</p>
                            <div className="os-grid">
                                {['Nas orelhas', 'No nariz', 'Ao redor dos olhos', 'Nas patas', 'No corpo', 'Na cauda'].map(ferida => (
                                    <div className="br-checkbox" key={ferida}>
                                        <input id={`${animal.id}-f-${ferida}`} type="checkbox" checked={animal.feridas.includes(ferida)} onChange={e => handleCheckboxArray(animal.id, 'feridas', ferida, e.target.checked)} />
                                        <label htmlFor={`${animal.id}-f-${ferida}`}>{ferida}</label>
                                    </div>
                                ))}
                            </div>

                            <div className="br-input mt-4">
                                <label>Outros sintomas ou feridas (Especificar):</label>
                                <input type="text" value={animal.outrosSintomas} onChange={e => handleAnimalChange(animal.id, 'outrosSintomas', e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}