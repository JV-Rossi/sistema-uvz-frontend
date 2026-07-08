import React, { useState, useEffect } from 'react';
import './OrdemServico.css';
import FormLeishmaniose from './FormLeishmaniose';
import FormBloqueio from './FormBloqueio';

export default function OrdemServico() {
    const [dataSolicitacao, setDataSolicitacao] = useState('');
    const [origem, setOrigem] = useState('');
    const [nomeMunicipe, setNomeMunicipe] = useState('');
    const [telefone, setTelefone] = useState('');
    const [distrito, setDistrito] = useState('');
    const [bairro, setBairro] = useState('');
    const [endereco, setEndereco] = useState('');
    const [setorDestino, setSetorDestino] = useState('');
    const [servicoSolicitado, setServicoSolicitado] = useState('');
    const [descricao, setDescricao] = useState('');

    const [ambienteLeish, setAmbienteLeish] = useState({
        outrosAnimais: '', qtdCaes: '', qtdGatos: '', pessoasCasa: '', possuiMuro: '',
        arvoreFrutifera: false, galinheiro: false, matoAlto: false, coletaLixo: false,
        esgotoTratado: false, localCaes: '', teveLeishmaniose: '', qtdLeishmaniose: ''
    });
    const [animaisLeish, setAnimaisLeish] = useState([]);

    const [loading, setLoading] = useState(false);
    const [sucesso, setSucesso] = useState('');
    const [erro, setErro] = useState('');

    useEffect(() => {
        const hoje = new Date().toISOString().split('T')[0];
        setDataSolicitacao(hoje);
    }, []);

    const servicosPorSetor = {
        arboviroses: [
            { id: 'bloqueio_foco', label: 'Solicitação de Bloqueio de Foco' },
            { id: 'inspecao_terreno', label: 'Inspeção em Terreno Baldio / Acúmulo de Lixo' },
            { id: 'bloqueio_quimico', label: 'Solicitação de Fumacê (UBV)' }
        ],
       sinantropicos: [
            { id: 'visita_pombo', label: 'Visita Zoosanitária - Pombos' },
            { id: 'visita_escorpiao', label: 'Visita Zoosanitária - Escorpiões' },
            { id: 'visita_caramujo', label: 'Visita Zoosanitária - Caramujos' },
            { id: 'visita_barbeiro', label: 'Visita Zoosanitária - Barbeiros' },
            { id: 'visita_outros_sinantropicos', label: 'Visita Zoosanitária - Outros' }
        ],
        animais_domesticos: [
            { id: 'teste_leishmaniose', label: 'Solicitação de Teste Rápido para Leishmaniose' },
            { id: 'vacinacao_antirrabica', label: 'Vacinação Antirrábica' },
            { id: 'recolhimento_animal', label: 'Animal Solto / Agressivo em Via Pública' },
            { id: 'avaliacao_eutanasia', label: 'Avaliação para Eutanásia' }
        ]
    };

    useEffect(() => { setServicoSolicitado(''); }, [setorDestino]);

    useEffect(() => {
        if (servicoSolicitado !== 'teste_leishmaniose') {
            setAnimaisLeish([]);
        } else if (animaisLeish.length === 0) {
            adicionarAnimal();
        }
    }, [servicoSolicitado]);

    const adicionarAnimal = () => {
        setAnimaisLeish([...animaisLeish, {
            id: Date.now(), nome: '', especie: '', raca: '', sexo: '', idade: '', porte: '', corPelo: '',
            domiciliado: '', origem: '', quandoAdoeceu: '', saiSolto: '', vacinadoRaiva: '', localVacina: '', ultimaVacina: '',
            sintomas: [], feridas: [], outrosSintomas: ''
        }]);
    };
    const removerAnimal = (id) => setAnimaisLeish(animaisLeish.filter(animal => animal.id !== id));
    const handleAnimalChange = (id, campo, valor) => setAnimaisLeish(animaisLeish.map(a => a.id === id ? { ...a, [campo]: valor } : a));
    const handleCheckboxArray = (id, tipoArray, item, isChecked) => {
        setAnimaisLeish(animaisLeish.map(a => {
            if (a.id !== id) return a;
            return { ...a, [tipoArray]: isChecked ? [...a[tipoArray], item] : a[tipoArray].filter(i => i !== item) };
        }));
    };

    const limparFormulario = () => {
        const hoje = new Date().toISOString().split('T')[0];
        setDataSolicitacao(hoje);
        setOrigem(''); setNomeMunicipe(''); setTelefone(''); setDistrito(''); setBairro(''); setEndereco('');
        setSetorDestino(''); setServicoSolicitado(''); setDescricao('');
        setAmbienteLeish({
            outrosAnimais: '', qtdCaes: '', qtdGatos: '', pessoasCasa: '', possuiMuro: '',
            arvoreFrutifera: false, galinheiro: false, matoAlto: false, coletaLixo: false,
            esgotoTratado: false, localCaes: '', teveLeishmaniose: '', qtdLeishmaniose: ''
        });
        setAnimaisLeish([]); setErro('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro(''); setSucesso(''); setLoading(true);

        if (!dataSolicitacao || !origem || !nomeMunicipe || !distrito || !bairro || !setorDestino || !servicoSolicitado) {
            setErro("Por favor, preencha todos os campos obrigatórios (*).");
            setLoading(false);
            return;
        }

        try {
            setTimeout(() => {
                setSucesso(`O.S. registrada com sucesso! Encaminhada para: ${setorDestino.toUpperCase()}.`);
                limparFormulario();
                setLoading(false);
                setTimeout(() => setSucesso(''), 5000);
            }, 1000);
        } catch (err) {
            setErro("Falha ao registrar a Ordem de Serviço.");
            setLoading(false);
        }
    };

    // Estado do Bloqueio
    const [dadosBloqueio, setDadosBloqueio] = useState({
        referencia: '', paciente: '', suspeita: '', dataSintomas: ''
    });

    return (
        <div className="os-wrapper">
            <main className="os-content">
                <header className="os-header">
                    <h1 className="text-weight-semi-bold os-title"><i className="fas fa-headset mr-2"></i> Abertura de Ordem de Serviço (O.S.)</h1>
                    <p className="os-subtitle">Registre e encaminhe as demandas da população para os setores competentes da UVZ.</p>
                </header>

                {sucesso && <div className="br-message is-success mb-4"><div className="icon"><i className="fas fa-check-circle fa-lg"></i></div><div className="content"><span className="message-body">{sucesso}</span></div></div>}
                {erro && <div className="br-message is-danger mb-4"><div className="icon"><i className="fas fa-times-circle fa-lg"></i></div><div className="content"><span className="message-body">{erro}</span></div></div>}

                <form onSubmit={handleSubmit} className="os-main-card">

                    <h3 className="text-weight-semi-bold os-section-title">1. Dados do Solicitante</h3>
                    <div className="os-grid">
                        <div className="br-input"><label>Data da Solicitação <span className="text-danger">*</span></label><input type="date" value={dataSolicitacao} onChange={(e) => setDataSolicitacao(e.target.value)} /></div>
                        <div className="br-input">
                            <label>Canal de Atendimento <span className="text-danger">*</span></label>
                            <select className="br-select" value={origem} onChange={(e) => setOrigem(e.target.value)}>
                                <option value="">Selecione...</option><option value="presencial">Presencial (Balcão)</option><option value="telefone">Telefone</option><option value="whatsapp">WhatsApp</option>
                            </select>
                        </div>
                        <div className="br-input os-grid-full"><label>Nome do Munícipe <span className="text-danger">*</span></label><input type="text" value={nomeMunicipe} onChange={(e) => setNomeMunicipe(e.target.value)} /></div>
                        <div className="br-input"><label>Telefone para Contato</label><input type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} /></div>
                        <div className="br-input">
                            <label>Distrito <span className="text-danger">*</span></label>
                            <select className="br-select" value={distrito} onChange={(e) => setDistrito(e.target.value)}>
                                <option value="">Selecione...</option><option value="norte">Norte</option><option value="sul">Sul</option><option value="leste">Leste</option><option value="oeste">Oeste</option><option value="rural">Zona Rural</option>
                            </select>
                        </div>
                        <div className="br-input"><label>Bairro <span className="text-danger">*</span></label><input type="text" value={bairro} onChange={(e) => setBairro(e.target.value)} /></div>
                        <div className="br-input"><label>Endereço Completo</label><input type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} /></div>
                    </div>

                    <h3 className="text-weight-semi-bold os-section-title">2. Direcionamento e Serviço</h3>
                    <div className="os-grid">
                        <div className="br-input">
                            <label>Setor de Destino da O.S. <span className="text-danger">*</span></label>
                            <select className="br-select" value={setorDestino} onChange={(e) => setSetorDestino(e.target.value)}>
                                <option value="">Selecione a área técnica...</option>
                                <option value="arboviroses">Arboviroses (Dengue, Zika, Chikungunya)</option>
                                <option value="animais_domesticos">Animais Domésticos (Cães e Gatos)</option>
                                <option value="sinantropicos">Sinantrópicos e Peçonhentos</option>
                            </select>
                        </div>
                        <div className="br-input">
                            <label>Tipo de Ação <span className="text-danger">*</span></label>
                            <select className="br-select" value={servicoSolicitado} onChange={(e) => setServicoSolicitado(e.target.value)} disabled={!setorDestino}>
                                <option value="">{setorDestino ? 'Selecione o serviço...' : 'Escolha o Setor ao lado...'}</option>
                                {setorDestino && servicosPorSetor[setorDestino].map(servico => (
                                    <option key={servico.id} value={servico.id}>{servico.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* INJEÇÃO: LEISHMANIOSE */}
                    {servicoSolicitado === 'teste_leishmaniose' && (
                        <FormLeishmaniose
                            ambienteLeish={ambienteLeish} setAmbienteLeish={setAmbienteLeish}
                            animaisLeish={animaisLeish} adicionarAnimal={adicionarAnimal}
                            removerAnimal={removerAnimal} handleAnimalChange={handleAnimalChange}
                            handleCheckboxArray={handleCheckboxArray}
                        />
                    )}

                    {/* INJEÇÃO: BLOQUEIO DE FOCO */}
                    {servicoSolicitado === 'bloqueio_foco' && (
                        <FormBloqueio
                            dadosBloqueio={dadosBloqueio}
                            setDadosBloqueio={setDadosBloqueio}
                        />
                    )}

                    <h3 className="text-weight-semi-bold os-section-title">Relato</h3>
                    <div className="br-textarea">
                        <label>Observações Gerais / Descrição Livre do Relato</label>
                        <textarea rows="3" placeholder="Descreva os detalhes informados pelo solicitante..." value={descricao} onChange={(e) => setDescricao(e.target.value)}></textarea>
                    </div>

                    <div className="mt-5 pt-4 border-top d-flex gap-3">
                        <button type="submit" className="br-button primary" disabled={loading}>
                            {loading ? <><i className="fas fa-spinner fa-spin mr-2"></i> Gerando Protocolo...</> : <><i className="fas fa-save mr-2"></i> Registrar O.S.</>}
                        </button>
                        <button type="button" onClick={limparFormulario} className="br-button secondary">
                            <i className="fas fa-eraser mr-2"></i> Limpar Formulário
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}