import React, { useState } from 'react';
import './Ovitrampa.css';

export default function Ovitrampa({ setTelaAtual }) {
    // ==========================================
    // 🧠 PARTE LÓGICA (Mantida intacta)
    // ==========================================
    
    // 1. ESTADO DA LISTA DE IMÓVEIS
    const [moradores, setMoradores] = useState([
        { id: 1, nome: 'Maria Oliveira', endereco: 'Rua das Flores, 105', quarteirao: '012A', armadilha: 'OV-098', status: 'INSTALADA', coordenadas: null },
        { id: 2, nome: 'José dos Santos', endereco: 'Av. Central, 440', quarteirao: '005', armadilha: 'OV-042', status: 'AGUARDANDO_COLETA_2', coordenadas: null },
    ]);

    // 2. ESTADOS DOS FILTROS
    const [termoBusca, setTermoBusca] = useState('');
    const [filtroQuarteirao, setFiltroQuarteirao] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('Todos os Status');

    // 3. ESTADOS PARA O NOVO CADASTRO E GPS
    const [modalCadastroAberto, setModalCadastroAberto] = useState(false);
    const [novoImovel, setNovoImovel] = useState({
        nome: '',
        endereco: '',
        quarteirao: '',
        armadilha: '',
        coordenadas: null
    });
    const [carregandoGPS, setCarregandoGPS] = useState(false);

    // 📍 FUNÇÃO CENTRAL DO GPS (Offline)
    const capturarGPS = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject("Seu dispositivo não suporta GPS.");
                return;
            }
            navigator.geolocation.getCurrentPosition(
                (posicao) => {
                    resolve({
                        lat: posicao.coords.latitude,
                        lng: posicao.coords.longitude
                    });
                },
                (erro) => {
                    reject(erro.message);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
            );
        });
    };

    // 📍 AÇÃO: Pegar GPS no Formulário de Novo Imóvel
    const handlePegarGPSNovo = async () => {
        setCarregandoGPS(true);
        try {
            const coords = await capturarGPS();
            setNovoImovel(prev => ({ ...prev, coordenadas: coords }));
        } catch (erro) {
            alert(`⚠️ Falha no GPS: Verifique se a Localização do tablet está ligada.\nErro técnico: ${erro}`);
        } finally {
            setCarregandoGPS(false);
        }
    };

    // 📍 AÇÃO: Atualizar GPS de um imóvel que já está na tabela
    const handleAtualizarGPSMorador = async (id) => {
        try {
            const coords = await capturarGPS();
            setMoradores(prev => prev.map(m => 
                m.id === id ? { ...m, coordenadas: coords } : m
            ));
            alert("📍 Localização do imóvel atualizada com sucesso!");
        } catch (erro) {
            alert("⚠️ Não foi possível capturar o GPS. Vá para uma área descoberta e tente novamente.");
        }
    };

    // 4. FUNÇÕES DE CICLO E EXCLUSÃO
    const removerMorador = (id) => {
        const confirmacao = window.confirm("Tem certeza que deseja remover a armadilha deste imóvel?");
        if (confirmacao) {
            setMoradores(moradores.filter((morador) => morador.id !== id));
        }
    };

    const avancarCicloArmadilha = (id, acao) => {
        setMoradores(prev => prev.map(m => {
            if (m.id === id) {
                if (acao === 'Registrar 1ª Coleta') return { ...m, status: 'AGUARDANDO_COLETA_2' };
                if (acao === 'Registrar 2ª Coleta') return { ...m, status: 'PRONTA_LEITURA' };
                if (acao === 'Lançar Ovos') return { ...m, status: 'SEM_ARMADILHA', armadilha: '-' };
                if (acao === 'Instalar Nova') {
                    const codigo = prompt("Digite o código da nova armadilha instalada:");
                    if (!codigo) return m;
                    return { ...m, status: 'INSTALADA', armadilha: codigo };
                }
            }
            return m;
        }));
    };

    // 5. FUNÇÃO PARA SALVAR O NOVO IMÓVEL NO ESTADO
    const handleSalvarNovoImovel = (e) => {
        e.preventDefault();
        
        if (!novoImovel.nome || !novoImovel.endereco || !novoImovel.quarteirao) {
            alert("⚠️ Por favor, preencha Nome, Endereço e Quarteirão.");
            return;
        }

        const temArmadilha = novoImovel.armadilha.trim() !== '';
        const novoRegistro = {
            id: Date.now(),
            nome: novoImovel.nome,
            endereco: novoImovel.endereco,
            quarteirao: novoImovel.quarteirao,
            armadilha: temArmadilha ? novoImovel.armadilha : '-',
            status: temArmadilha ? 'INSTALADA' : 'SEM_ARMADILHA',
            coordenadas: novoImovel.coordenadas
        };

        setMoradores([...moradores, novoRegistro]);
        setModalCadastroAberto(false);
        setNovoImovel({ nome: '', endereco: '', quarteirao: '', armadilha: '', coordenadas: null });
    };

    // 6. MOTOR DE FILTRAGEM
    const moradoresFiltrados = moradores.filter(m => {
        const bateBusca = m.endereco?.toLowerCase().includes(termoBusca.toLowerCase()) || 
                          m.nome?.toLowerCase().includes(termoBusca.toLowerCase());
        const bateQuarteirao = filtroQuarteirao === '' || m.quarteirao.includes(filtroQuarteirao);
        const bateStatus = filtroStatus === 'Todos os Status' ||
                           (filtroStatus === 'Instaladas' && m.status === 'INSTALADA') ||
                           (filtroStatus === 'Prontas para Leitura' && m.status === 'PRONTA_LEITURA');

        return bateBusca && bateQuarteirao && bateStatus;
    });

    const renderizerStatus = (status) => {
        switch (status) {
            case 'INSTALADA': 
                return <span className="br-tag bg-success text-white text-weight-semi-bold"><i className="fas fa-check-circle mr-1"></i> Instalada</span>;
            case 'AGUARDANDO_COLETA_2': 
                return <span className="br-tag bg-warning text-dark text-weight-semi-bold"><i className="fas fa-clock mr-1"></i> 2ª Coleta</span>;
            case 'PRONTA_LEITURA': 
                return <span className="br-tag bg-info text-white text-weight-semi-bold"><i className="fas fa-microscope mr-1"></i> Leitura</span>;
            case 'SEM_ARMADILHA': 
                return <span className="br-tag bg-secondary-04 text-dark"><i className="fas fa-times-circle mr-1"></i> Sem Armadilha</span>;
            default: 
                return <span className="br-tag">Desconhecido</span>;
        }
    };

    // ==========================================
    // 🎨 PARTE VISUAL (Padrão Gov.br)
    // ==========================================
    return (
        <div className="br-container-lg p-3 fundo-claro-gov">
            
            {/* BOTÃO VOLTAR */}
            <button 
                className="br-button secondary mb-4" 
                onClick={() => setTelaAtual('campo_menu')}
            >
                <i className="fas fa-arrow-left mr-1"></i> Voltar
            </button>

            {/* CABEÇALHO */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="text-up-03 text-weight-semi-bold text-primary-default mb-1">
                        <i className="fas fa-bug mr-2"></i> Monitoramento Ovitrampas
                    </h1>
                    <p className="text-down-01 text-secondary-07 mb-0">Unidade de Vigilância em Zoonoses - Cuiabá</p>
                </div>
                <button 
                    className="br-button primary mt-3 mt-sm-0" 
                    onClick={() => setModalCadastroAberto(true)}
                >
                    <i className="fas fa-plus mr-1"></i> Novo Imóvel
                </button>
            </div>

            {/* BARRA DE FILTROS (Estilo Card Gov.br) */}
            <div className="br-card p-3 mb-4 bg-secondary-02">
                <div className="row">
                    <div className="col-12 col-md-5 mb-3 mb-md-0">
                        <div className="br-input">
                            <label>Buscar Morador ou Endereço</label>
                            <input 
                                type="text" 
                                placeholder="Ex: Maria ou Rua das Flores..." 
                                value={termoBusca}
                                onChange={(e) => setTermoBusca(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <div className="br-input">
                            <label>Quarteirão</label>
                            <input 
                                type="text" 
                                placeholder="Ex: 012A" 
                                value={filtroQuarteirao}
                                onChange={(e) => setFiltroQuarteirao(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-6 col-md-4">
                        <div className="br-select w-100">
                            <label>Status da Armadilha</label>
                            <select 
                                value={filtroStatus}
                                onChange={(e) => setFiltroStatus(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                            >
                                <option>Todos os Status</option>
                                <option>Instaladas</option>
                                <option>Prontas para Leitura</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* GRID DE CARTÕES */}
            <div className="grid-cards-gov">
                {moradoresFiltrados.map((m) => (
                    <div className="br-card hover card-morador-estilizado" key={m.id}>
                        
                        {/* CABEÇALHO DO CARD (Fundo Cinza Claro) */}
                        <div className="br-card-header bg-secondary-02 p-3 border-bottom border-secondary-04 d-flex justify-content-between align-items-start">
                            <div>
                                <div className="text-weight-bold text-up-01 text-primary-default mb-1">{m.nome}</div>
                                <div className="text-down-01 text-secondary-07">
                                    Quart: <strong className="text-secondary-09">{m.quarteirao}</strong> &bull; Arm: <strong className="text-primary-default">{m.armadilha}</strong>
                                </div>
                            </div>
                            <button 
                                className="br-button circle small" 
                                aria-label="Remover" 
                                onClick={() => removerMorador(m.id)}
                            >
                                <i className="fas fa-trash-alt text-danger"></i>
                            </button>
                        </div>

                        {/* CORPO DO CARD */}
                        <div className="br-card-content p-3">
                            {/* Status em destaque no topo do corpo */}
                            <div className="mb-3">
                                {renderizerStatus(m.status)}
                            </div>
                            
                            {/* SUB-CAIXA DE LOCALIZAÇÃO (O truque visual) */}
                            <div className="caixa-localizacao-gov p-2 border rounded">
                                <div className="d-flex align-items-start mb-2">
                                    <i className="fas fa-map-marker-alt text-primary-default mr-2 mt-1"></i>
                                    <span className="text-down-01 text-secondary-08 text-weight-medium">{m.endereco}</span>
                                </div>
                                
                                <div>
                                    {m.coordenadas ? (
                                        <div className="text-down-02 text-success text-weight-semi-bold d-flex align-items-center">
                                            <i className="fas fa-satellite-dish mr-2"></i> 
                                            Lat: {m.coordenadas.lat.toFixed(5)} | Lng: {m.coordenadas.lng.toFixed(5)}
                                        </div>
                                    ) : (
                                        <div className="text-down-02 text-warning text-weight-semi-bold d-flex align-items-center">
                                            <i className="fas fa-exclamation-triangle mr-2"></i> Sem GPS registrado
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RODAPÉ E BOTÕES (Alinhamento Flex perfeito) */}
                        <div className="br-card-footer p-3 bg-secondary-01 border-top border-secondary-03 d-flex" style={{ gap: '8px' }}>
                            <button 
                                className="br-button secondary small flex-grow-1" 
                                onClick={() => handleAtualizarGPSMorador(m.id)}
                                title="Atualizar GPS"
                            >
                                <i className="fas fa-map-pin mr-1"></i> GPS
                            </button>

                            {m.status === 'INSTALADA' && (
                                <button className="br-button primary small flex-grow-1" onClick={() => avancarCicloArmadilha(m.id, 'Registrar 1ª Coleta')}>
                                    <i className="fas fa-box-open mr-1"></i> 1ª Coleta
                                </button>
                            )}
                            {m.status === 'AGUARDANDO_COLETA_2' && (
                                <button className="br-button primary small flex-grow-1" onClick={() => avancarCicloArmadilha(m.id, 'Registrar 2ª Coleta')}>
                                    <i className="fas fa-box-open mr-1"></i> 2ª Coleta
                                </button>
                            )}
                            {m.status === 'PRONTA_LEITURA' && (
                                <button className="br-button small text-white flex-grow-1" style={{ backgroundColor: '#1351b4' }} onClick={() => avancarCicloArmadilha(m.id, 'Lançar Ovos')}>
                                    <i className="fas fa-microscope mr-1"></i> Contar Ovos
                                </button>
                            )}
                            {m.status === 'SEM_ARMADILHA' && (
                                <button className="br-button secondary small flex-grow-1" onClick={() => avancarCicloArmadilha(m.id, 'Instalar Nova')}>
                                    <i className="fas fa-tools mr-1"></i> Instalar
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL GOV.BR PARA NOVO CADASTRO */}
            {modalCadastroAberto && (
                <div className="br-scrim is-active" onClick={() => setModalCadastroAberto(false)}>
                    <div className="br-modal" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
                        <div className="br-modal-header border-bottom">
                            <div className="br-modal-title text-up-02 text-weight-semi-bold text-primary-default">
                                <i className="fas fa-clipboard-list mr-2"></i> Cadastrar Novo Imóvel
                            </div>
                        </div>
                        
                        <form onSubmit={handleSalvarNovoImovel}>
                            <div className="br-modal-body pt-4">
                                <div className="br-input mb-3">
                                    <label>Nome do Morador *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Ex: João da Silva"
                                        value={novoImovel.nome}
                                        onChange={(e) => setNovoImovel({ ...novoImovel, nome: e.target.value })}
                                    />
                                </div>

                                <div className="br-input mb-3">
                                    <label>Endereço Completo *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Rua, número e bairro"
                                        value={novoImovel.endereco}
                                        onChange={(e) => setNovoImovel({ ...novoImovel, endereco: e.target.value })}
                                    />
                                </div>

                                <div className="row mb-4">
                                    <div className="col-6">
                                        <div className="br-input">
                                            <label>Quarteirão *</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Ex: 014B"
                                                value={novoImovel.quarteirao}
                                                onChange={(e) => setNovoImovel({ ...novoImovel, quarteirao: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="br-input">
                                            <label>Armadilha</label>
                                            <input
                                                type="text"
                                                placeholder="Opcional"
                                                value={novoImovel.armadilha}
                                                onChange={(e) => setNovoImovel({ ...novoImovel, armadilha: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* BLOCO DE GPS */}
                                <div className="br-card p-3 bg-secondary-02 text-center border">
                                    <button 
                                        type="button" 
                                        onClick={handlePegarGPSNovo}
                                        disabled={carregandoGPS}
                                        className={`br-button block ${carregandoGPS ? 'secondary' : 'primary'}`}
                                    >
                                        <i className={`fas ${carregandoGPS ? 'fa-spinner fa-spin' : 'fa-map-marker-alt'} mr-2`}></i>
                                        {carregandoGPS ? 'Buscando Satélites...' : 'Capturar Coordenadas do Local'}
                                    </button>
                                    
                                    {novoImovel.coordenadas && (
                                        <p className="text-success text-weight-semi-bold text-down-01 mt-2 mb-0">
                                            <i className="fas fa-check-circle mr-1"></i> 
                                            Coordenadas travadas: {novoImovel.coordenadas.lat.toFixed(4)}, {novoImovel.coordenadas.lng.toFixed(4)}
                                        </p>
                                    )}
                                </div>
                            </div>
                            
                            <div className="br-modal-footer justify-content-end border-top pt-3">
                                <button 
                                    className="br-button secondary mr-2" 
                                    type="button" 
                                    onClick={() => setModalCadastroAberto(false)}
                                >
                                    Cancelar
                                </button>
                                <button className="br-button primary" type="submit">
                                    <i className="fas fa-save mr-1"></i> Salvar Imóvel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}