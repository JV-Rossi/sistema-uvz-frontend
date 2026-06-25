import React, { useState } from 'react';
import './Ovitrampa.css';

export default function Ovitrampa({ setTelaAtual }) {
    // ==========================================
    // 🧠 PARTE LÓGICA (CÉREBRO DO COMPONENTE)
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
            case 'INSTALADA': return <span className="badge instalada">🟢 Instalada</span>;
            case 'AGUARDANDO_COLETA_2': return <span className="badge aguardando">🟡 Aguardando 2ª Coleta</span>;
            case 'PRONTA_LEITURA': return <span className="badge pronta">🔵 Pronta p/ Leitura</span>;
            case 'SEM_ARMADILHA': return <span className="badge sem-armadilha">⚪ Sem Armadilha</span>;
            default: return <span className="badge sem-armadilha">Desconhecido</span>;
        }
    };

    // ==========================================
    // 🎨 PARTE VISUAL (CORPO / JSX)
    // ==========================================
    return (
        <div className="container-ovitrampa">
            <button className="btn-voltar" onClick={() => setTelaAtual('campo_menu')}>
                ⬅️ Voltar
            </button>

            <div className="header-ovitrampa">
                <div>
                    <h1 className="titulo-ovitrampa">🦟 Monitoramento Ovitrampas</h1>
                    <p className="subtitulo-ovitrampa">Unidade de Vigilância em Zoonoses - Cuiabá</p>
                </div>
                <button className="btn-novo-cadastro" onClick={() => setModalCadastroAberto(true)}>
                    ➕ Novo Cadastro de Imóvel
                </button>
            </div>

            {/* BARRA DE FILTROS */}
            <div className="barra-filtros">
                <input 
                    type="text" 
                    placeholder="🔍 Buscar por Bairro ou Nome..." 
                    className="input-filtro"
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                />
                <input 
                    type="text" 
                    placeholder="Quarteirão" 
                    className="input-filtro" 
                    style={{ width: '120px' }}
                    value={filtroQuarteirao}
                    onChange={(e) => setFiltroQuarteirao(e.target.value)}
                />
                <select 
                    className="input-filtro"
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value)}
                >
                    <option>Todos os Status</option>
                    <option>Instaladas</option>
                    <option>Prontas para Leitura</option>
                </select>
            </div>

            {/* GRID DE CARTÕES */}
            <div className="grid-cards-moradores">
                {moradoresFiltrados.map((m) => (
                    <div className="card-morador" key={m.id}>
                        <div className="card-header-morador">
                            <h3 className="nome-morador">{m.nome}</h3>
                            {renderizerStatus(m.status)}
                        </div>

                        <div className="card-body-morador">
                            <p className="endereco-morador">🏠 {m.endereco}</p>
                            
                            {m.coordenadas ? (
                                <p className="gps-morador ok">📍 Lat: {m.coordenadas.lat.toFixed(5)} | Lng: {m.coordenadas.lng.toFixed(5)}</p>
                            ) : (
                                <p className="gps-morador alert">⚠️ Sem GPS registrado</p>
                            )}

                            <div className="info-secundaria-morador">
                                <span><strong>Quart:</strong> {m.quarteirao}</span>
                                <span><strong>Armadilha:</strong> <span style={{color: '#4fc3f7'}}>{m.armadilha}</span></span>
                            </div>
                        </div>

                        <div className="card-footer-morador">
                            <div className="acoes-principais">
                                <button 
                                    onClick={() => handleAtualizarGPSMorador(m.id)}
                                    className="btn-acao btn-acao-gps"
                                    title="Atualizar GPS"
                                >
                                    📍 GPS
                                </button>

                                {m.status === 'INSTALADA' && (
                                    <button className="btn-acao" onClick={() => avancarCicloArmadilha(m.id, 'Registrar 1ª Coleta')}>📥 1ª Coleta</button>
                                )}
                                {m.status === 'AGUARDANDO_COLETA_2' && (
                                    <button className="btn-acao" onClick={() => avancarCicloArmadilha(m.id, 'Registrar 2ª Coleta')}>📥 2ª Coleta</button>
                                )}
                                {m.status === 'PRONTA_LEITURA' && (
                                    <button className="btn-acao azul" onClick={() => avancarCicloArmadilha(m.id, 'Lançar Ovos')}>🔬 Contar Ovos</button>
                                )}
                                {m.status === 'SEM_ARMADILHA' && (
                                    <button className="btn-acao cinza" onClick={() => avancarCicloArmadilha(m.id, 'Instalar Nova')}>🛠️ Instalar</button>
                                )}
                            </div>

                            <button onClick={() => removerMorador(m.id)} className="btn-remover-card" title="Remover">
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL DE NOVO CADASTRO */}
            {modalCadastroAberto && (
                <div className="modal-flutuante" style={{ maxWidth: '450px' }}>
                    <h3 style={{ margin: '0 0 20px 0', color: '#4caf50', textAlign: 'center' }}>📝 Cadastrar Imóvel</h3>

                    <form onSubmit={handleSalvarNovoImovel} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <label style={{ fontSize: '12px', color: '#aaa' }}>Nome do Morador *</label>
                        <input
                            type="text"
                            required
                            className="input-filtro"
                            placeholder="Ex: João da Silva"
                            value={novoImovel.nome}
                            onChange={(e) => setNovoImovel({ ...novoImovel, nome: e.target.value })}
                        />

                        <label style={{ fontSize: '12px', color: '#aaa' }}>Endereço Completo *</label>
                        <input
                            type="text"
                            required
                            className="input-filtro"
                            placeholder="Rua, número e bairro"
                            value={novoImovel.endereco}
                            onChange={(e) => setNovoImovel({ ...novoImovel, endereco: e.target.value })}
                        />

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '12px', color: '#aaa' }}>Quarteirão *</label>
                                <input
                                    type="text"
                                    required
                                    className="input-filtro"
                                    placeholder="Ex: 014B"
                                    value={novoImovel.quarteirao}
                                    onChange={(e) => setNovoImovel({ ...novoImovel, quarteirao: e.target.value })}
                                />
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <label style={{ fontSize: '12px', color: '#aaa' }}>Cód. Armadilha (Opcional)</label>
                                <input
                                    type="text"
                                    className="input-filtro"
                                    placeholder="Ex: OV-200"
                                    value={novoImovel.armadilha}
                                    onChange={(e) => setNovoImovel({ ...novoImovel, armadilha: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* BLOCO DE GPS */}
                        <div className="box-gps-modal">
                            <button 
                                type="button" 
                                onClick={handlePegarGPSNovo}
                                disabled={carregandoGPS}
                                className="btn-gps-formulario"
                                style={{ backgroundColor: '#1976d2' }}
                            >
                                {carregandoGPS ? '⏳ Buscando Satélites...' : '📍 Pegar Localização Atual'}
                            </button>
                            
                            {novoImovel.coordenadas && (
                                <p style={{ color: '#4caf50', fontSize: '12px', margin: '8px 0 0 0' }}>
                                    ✅ Coordenadas travadas: {novoImovel.coordenadas.lat.toFixed(4)}, {novoImovel.coordenadas.lng.toFixed(4)}
                                </p>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                            <button 
                                type="button" 
                                onClick={() => setModalCadastroAberto(false)} 
                                style={{ flex: 1, padding: '12px', background: '#444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                style={{ flex: 1, padding: '12px', background: '#4caf50', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Salvar Imóvel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}