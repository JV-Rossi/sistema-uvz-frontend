import React from 'react';
import { useOvitrampa } from './useOvitrampa';
import './Ovitrampa.css';

export default function Ovitrampa({ setTelaAtual }) {
    const {
        moradoresFiltrados,
        termoBusca, setTermoBusca,
        filtroQuarteirao, setFiltroQuarteirao,
        filtroStatus, setFiltroStatus,
        modalCadastroAberto, setModalCadastroAberto,
        novoImovel, setNovoImovel,
        removerMorador,
        avancarCicloArmadilha,
        handleSalvarNovoImovel,
        // 👇 Novas funções do GPS importadas do Hook
        handlePegarGPSNovo,
        handleAtualizarGPSMorador,
        carregandoGPS
    } = useOvitrampa();

    const renderizerStatus = (status) => {
        switch (status) {
            case 'INSTALADA': return <span className="badge instalada">🟢 Instalada</span>;
            case 'AGUARDANDO_COLETA_2': return <span className="badge aguardando">🟡 Aguardando 2ª Coleta</span>;
            case 'PRONTA_LEITURA': return <span className="badge pronta">🔵 Pronta p/ Leitura</span>;
            case 'SEM_ARMADILHA': return <span className="badge sem-armadilha">⚪ Sem Armadilha</span>;
            default: return <span className="badge sem-armadilha">Desconhecido</span>;
        }
    };

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
                {/* ➕ Botão configurado para abrir o formulário */}
                <button className="btn-novo-cadastro" onClick={() => setModalCadastroAberto(true)}>
                    ➕ Novo Cadastro de Imóvel
                </button>
            </div>

            <div className="card-tabela">
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

                <table className="tabela-ovitrampa">
                    <thead>
                        <tr>
                            <th>Morador</th>
                            <th>Endereço & GPS</th> {/* 👈 Título atualizado */}
                            <th>Quart.</th>
                            <th>Armadilha</th>
                            <th>Status do Ciclo</th>
                            <th style={{ textAlign: 'right' }}>Ações Rápidas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {moradoresFiltrados.map((m) => (
                            <tr key={m.id}>
                                <td style={{ fontWeight: 'bold', color: '#fff' }}>{m.nome}</td>
                                <td>
                                    <div style={{ color: '#bbb' }}>{m.endereco}</div>
                                    {m.coordenadas ? (
                                        <small style={{ color: '#4caf50' }}>
                                            📍 Lat: {m.coordenadas.lat.toFixed(5)} | Lng: {m.coordenadas.lng.toFixed(5)}
                                        </small>
                                    ) : (
                                        <small style={{ color: '#ff9800' }}>
                                            ⚠️ Sem GPS registrado
                                        </small>
                                    )}
                                </td>
                                <td style={{ color: '#bbb' }}>{m.quarteirao}</td>
                                <td style={{ color: '#4fc3f7', fontWeight: 'bold' }}>{m.armadilha}</td>
                                <td>{renderizerStatus(m.status)}</td>
                                <td style={{ textAlign: 'right' }}>

                                    {/* 📍 BOTÃO DE ATUALIZAR GPS DIRETO NA TABELA */}
                                    <button
                                        onClick={() => handleAtualizarGPSMorador(m.id)}
                                        className="btn-acao btn-acao-gps"
                                        title="Atualizar GPS deste imóvel"
                                    >
                                        📍
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

                                    <button onClick={() => removerMorador(m.id)} className="btn-remover" title="Remover">
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 📝 MODAL DE NOVO CADASTRO (Totalmente integrado) */}
            {modalCadastroAberto && (
                <div className="modal-flutuante" style={{ maxWidth: '450px' }}>
                    <h3 style={{ margin: '0 0 20px 0', color: '#4caf50', textAlign: 'center' }}>📝 Cadastrar Imóvel para Ovitrampa</h3>

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

                        {/* 📍 O BLOCO DE GPS ENTRA EXATAMENTE AQUI */}
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

                        {/* 🔘 BOTÕES DE SALVAR E CANCELAR DO FORMULÁRIO */}
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