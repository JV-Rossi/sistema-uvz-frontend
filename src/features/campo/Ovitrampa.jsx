import React from 'react';
import { useOvitrampa } from './useOvitrampa';
import './Ovitrampa.css';

export default function OvitrampaDashboard({ setTelaAtual }) {
    const {
        moradoresFiltrados,
        termoBusca, setTermoBusca,
        filtroQuarteirao, setFiltroQuarteirao,
        filtroStatus, setFiltroStatus,
        removerMorador,
        avancarCicloArmadilha
    } = useOvitrampa();

    // Renderizador visual limpo
    const renderizarStatus = (status) => {
        switch (status) {
            case 'INSTALADA': return <span className="badge instalada">🟢 Instalada</span>;
            case 'AGUARDANDO_COLETA_2': return <span className="badge aguardando">🟡 Aguardando 2ª Coleta</span>;
            case 'PRONTA_LEITURA': return <span className="badge pronta">🔵 Pronta p/ Leitura</span>;
            case 'SEM_ARMADILHA': return <span className="badge sem-armadilha">⚪ Sem Armadilha Ativa</span>;
            default: return <span className="badge sem-armadilha">Desconhecido</span>;
        }
    };

    return (
        <div className="container-ovitrampa">
            <button className="btn-voltar" onClick={() => setTelaAtual('campo_menu')}>
                ⬅️ Voltar
            </button>

            {/* Cabeçalho */}
            <div className="header-ovitrampa">
                <div>
                    <h1 className="titulo-ovitrampa">🦟 Monitoramento de Ovitrampas</h1>
                    <p className="subtitulo-ovitrampa">Unidade de Vigilância em Zoonoses - Cuiabá</p>
                </div>
                <button className="btn-novo-cadastro">
                    ➕ Novo Cadastro de Imóvel
                </button>
            </div>

            {/* Card Principal */}
            <div className="card-tabela">
                
                {/* Barra de Filtros Funcional */}
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

                {/* Tabela de Dados */}
                <table className="tabela-ovitrampa">
                    <thead>
                        <tr>
                            <th>Morador</th>
                            <th>Endereço</th>
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
                                <td style={{ color: '#bbb' }}>{m.endereco}</td>
                                <td style={{ color: '#bbb' }}>{m.quarteirao}</td>
                                <td style={{ color: '#4fc3f7', fontWeight: 'bold' }}>{m.armadilha}</td>
                                <td>{renderizarStatus(m.status)}</td>
                                <td style={{ textAlign: 'right' }}>
                                    {m.status === 'INSTALADA' && (
                                        <button className="btn-acao" onClick={() => avancarCicloArmadilha(m.id, 'Registrar 1ª Coleta')}>📥 Registrar 1ª Coleta</button>
                                    )}
                                    {m.status === 'AGUARDANDO_COLETA_2' && (
                                        <button className="btn-acao" onClick={() => avancarCicloArmadilha(m.id, 'Registrar 2ª Coleta')}>📥 Registrar 2ª Coleta</button>
                                    )}
                                    {m.status === 'PRONTA_LEITURA' && (
                                        <button className="btn-acao azul" onClick={() => avancarCicloArmadilha(m.id, 'Lançar Ovos')}>🔬 Lançar Ovos</button>
                                    )}
                                    {m.status === 'SEM_ARMADILHA' && (
                                        <button className="btn-acao cinza" onClick={() => avancarCicloArmadilha(m.id, 'Instalar Nova')}>🛠️ Instalar</button>
                                    )}

                                    <button
                                        onClick={() => removerMorador(m.id)}
                                        className="btn-remover"
                                        title="Remover Morador"
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {moradoresFiltrados.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#777' }}>
                                    Nenhuma armadilha encontrada com estes filtros.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}