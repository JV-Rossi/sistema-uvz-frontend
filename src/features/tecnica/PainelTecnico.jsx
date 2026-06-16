import React, { useState } from 'react';
import CadastroUsuario from './CadastroUsuario';
import './PainelTecnico.css';

export default function PainelTecnico({ setTelaAtual }) {
    const [abaAtiva, setAbaAtiva] = useState('consultas');

    // Mock de dados brutos das Ovitrampas que vieram do banco de dados
    const [dadosBrutos, setDadosBrutos] = useState([
        { id: 101, agente: 'João Silva', quarteirao: '012A', armadilha: 'OV-098', dataInstalacao: '2026-06-01', dataColeta: '2026-06-15', ovos: 42, status: 'Lido' },
        { id: 102, agente: 'Maria Souza', quarteirao: '005', armadilha: 'OV-042', dataInstalacao: '2026-06-02', dataColeta: '2026-06-16', ovos: 0, status: 'Aguardando Leitura' },
        { id: 103, agente: 'Carlos Lima', quarteirao: '014B', armadilha: 'OV-105', dataInstalacao: '2026-06-02', dataColeta: '2026-06-16', ovos: 115, status: 'Lido' },
    ]);

    // 📥 FUNÇÃO CENTRAL: Exportar dados diretamente para planilha Excel (via CSV)
    const exportarParaExcel = () => {
        // Cabeçalho da planilha
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "ID;Agente de Campo;Quarteirao;Código Armadilha;Data Instalacao;Data Coleta;Quantidade Ovos;Status\n";
        
        // Linhas de dados
        dadosBrutos.forEach(row => {
            csvContent += `${row.id};${row.agente};${row.quarteirao};${row.armadilha};${row.dataInstalacao};${row.dataColeta};${row.ovos};${row.status}\n`;
        });

        // Cria o gatilho de download do arquivo para o computador
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "exportacao_uvz_ovitrampas.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="tecnico-container">
            {/* Menu Lateral Técnico */}
            <aside className="tecnico-sidebar">
                <div className="sidebar-logo">
                    <h2>UVZ - Cuiabá</h2>
                    <span>Módulo Técnico</span>
                </div>

                <nav className="sidebar-menu">
                    <button 
                        className={`menu-btn ${abaAtiva === 'consultas' ? 'ativo' : ''}`}
                        onClick={() => setAbaAtiva('consultas')}
                    >
                        🔍 Consultas & Exportação
                    </button>
                    <button 
                        className={`menu-btn ${abaAtiva === 'laboratorio' ? 'ativo' : ''}`}
                        onClick={() => setAbaAtiva('laboratorio')}
                    >
                        🔬 Lançamento de Ovos
                    </button>
                    <button 
                        className={`menu-btn ${abaAtiva === 'equipe' ? 'ativo' : ''}`}
                        onClick={() => setAbaAtiva('equipe')}
                    >
                        👤 Cadastro de Equipe
                    </button>
                    <button 
                        className={`menu-btn ${abaAtiva === 'mutirao' ? 'ativo' : ''}`}
                        onClick={() => setAbaAtiva('mutirao')}
                    >
                        📋 Distribuição de Mutirão
                    </button>
                </nav>

                <div className="sidebar-saida">
                    <button className="btn-logout" onClick={() => setTelaAtual('login')}>
                        🚪 Sair do Sistema
                    </button>
                </div>
            </aside>

            {/* Painel de Trabalho da Direita */}
            <main className="tecnico-conteudo">
                
                {/* 1. ABA DE CONSULTAS E REQUISIÇÕES */}
                {abaAtiva === 'consultas' && (
                    <div className="modulo-card">
                        <div className="modulo-header">
                            <div>
                                <h2>Base de Dados Integrada</h2>
                                <p>Consulte registros através de requisições ao banco e exporte para análise externa.</p>
                            </div>
                            <button className="btn-excel" onClick={exportarParaExcel}>
                                🟢 Exportar para Excel (.csv)
                            </button>
                        </div>

                        {/* Filtros Avançados de Desktop */}
                        <div className="filtros-desktop-grid">
                            <input type="text" placeholder="Filtrar por Agente ou Armadilha..." className="input-tecnico-dt" />
                            <input type="text" placeholder="Quarteirão" className="input-tecnico-dt" />
                            <input type="date" className="input-tecnico-dt" title="Data Inicial" />
                            <button className="btn-requisicao">Fazer Requisição 🔄</button>
                        </div>

                        {/* Tabela de Dados densa para Desktop */}
                        <div className="tabela-wrapper-dt">
                            <table className="tabela-tecnica-dt">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Agente de Campo</th>
                                        <th>Quarteirão</th>
                                        <th>Cód. Armadilha</th>
                                        <th>Instalação</th>
                                        <th>Coleta</th>
                                        <th>Qtd Ovos</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dadosBrutos.map(d => (
                                        <tr key={d.id}>
                                            <td>{d.id}</td>
                                            <td style={{fontWeight: '600'}}>{d.agente}</td>
                                            <td>{d.quarteirao}</td>
                                            <td style={{color: '#4fc3f7', fontWeight: 'bold'}}>{d.armadilha}</td>
                                            <td>{d.dataInstalacao}</td>
                                            <td>{d.dataColeta}</td>
                                            <td style={{fontWeight: 'bold', color: d.ovos > 0 ? '#ffb74d' : '#fff'}}>{d.ovos}</td>
                                            <td>
                                                <span className={`status-tag ${d.status === 'Lido' ? 'verde' : 'laranja'}`}>
                                                    {d.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* 2. ABA DE LANÇAMENTO DO LABORATÓRIO */}
                {abaAtiva === 'laboratorio' && (
                    <div className="modulo-card">
                        <div className="modulo-header">
                            <h2>Laboratório - Contagem de Ovos</h2>
                            <p>Insira os resultados microscópicos das palhetas recolhidas no campo.</p>
                        </div>
                        
                        <div className="formulario-laboratorio-box">
                            <div className="grid-campos-lab">
                                <div className="grupo-input-lab">
                                    <label>Código da Armadilha / Palheta</label>
                                    <input type="text" placeholder="Ex: OV-042" className="input-tecnico-dt" autoFocus />
                                </div>
                                <div className="grupo-input-lab">
                                    <label>Quantidade de Ovos Contados</label>
                                    <input type="number" placeholder="0" className="input-tecnico-dt" min="0" />
                                </div>
                            </div>
                            <button className="btn-requisicao grid-btn-save">Salvar Leitura e Atualizar Banco 🔬</button>
                        </div>
                    </div>
                )}

                {/* 3. ABA DE CADASTRO DE USUÁRIOS */}
                {abaAtiva === 'equipe' && (
                    <div className="modulo-card-limpo">
                        {/* Reutiliza o componente de cadastro perfeitamente na nossa área principal */}
                        <CadastroUsuario setTelaAtual={setTelaAtual} />
                    </div>
                )}

                {/* 4. ABA DE DISTRIBUIÇÃO DO MUTIRÃO */}
                {abaAtiva === 'mutirao' && (
                    <div className="modulo-card">
                        <div className="modulo-header">
                            <h2>Distribuição de Trabalho - Mutirões</h2>
                            <p>Organize e aloque quarteirões específicos para as equipes de campo.</p>
                        </div>
                        <div className="placeholder-tecnico-fluxo">
                            <p>🛠️ Módulo de mapeamento de mutirão pronto para integração com algoritmo de distribuição por setores.</p>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}