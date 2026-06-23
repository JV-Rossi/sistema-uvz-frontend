import React, { useState } from 'react';
import CadastroUsuario from '../tecnica/CadastroUsuario'; // Ajuste o caminho se necessário
import DistribuidorTrabalho from '../tecnica/DistribuidorTrabalho';
import ConsultasExportacoes from '../tecnica/ConsultasExportacoes';
import './PainelTecnico.css';

export default function PainelTecnico({ setTelaAtual }) {
    // 1. Controle de qual TELA está aparecendo na direita
    const [abaAtiva, setAbaAtiva] = useState('equipe');

    // 2. Controle de qual PASTA (setor) está aberta na esquerda
    const [pastaAberta, setPastaAberta] = useState('administrativo');

    // Função que abre e fecha as pastas do menu
    const togglePasta = (nomeDaPasta) => {
        // Se clicar na pasta que já está aberta, ela fecha. Senão, abre a nova.
        setPastaAberta(pastaAberta === nomeDaPasta ? null : nomeDaPasta);
    };

    // (Mock de dados para as consultas)
    const [dadosBrutos] = useState([
        { id: 101, agente: 'João Silva', quarteirao: '012A', armadilha: 'OV-098', dataInstalacao: '2026-06-01', dataColeta: '2026-06-15', ovos: 42, status: 'Lido' },
        { id: 102, agente: 'Maria Souza', quarteirao: '005', armadilha: 'OV-042', dataInstalacao: '2026-06-02', dataColeta: '2026-06-16', ovos: 0, status: 'Aguardando Leitura' },
    ]);

    const exportarParaExcel = () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "ID;Agente de Campo;Quarteirao;Código Armadilha;Data Instalacao;Data Coleta;Quantidade Ovos;Status\n";
        dadosBrutos.forEach(row => {
            csvContent += `${row.id};${row.agente};${row.quarteirao};${row.armadilha};${row.dataInstalacao};${row.dataColeta};${row.ovos};${row.status}\n`;
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "exportacao_uvz.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="tecnico-container">
            {/* ⬅️ BARRA LATERAL COM PASTAS */}
            <aside className="tecnico-sidebar">
                <div className="sidebar-logo">
                    <h2>CVSA - Cuiabá</h2>
                    <span>Sistema Integrado Base</span>
                </div>

                <nav className="sidebar-menu">

                    {/* 📁 SETOR: ADMINISTRATIVO */}
                    <div className="menu-folder">
                        <button className="folder-btn" onClick={() => togglePasta('administrativo')}>
                            {pastaAberta === 'administrativo' ? '📂' : '📁'} Administrativo
                        </button>
                        {pastaAberta === 'administrativo' && (
                            <div className="folder-content">
                                <button
                                    className={`menu-btn ${abaAtiva === 'equipe' ? 'ativo' : ''}`}
                                    onClick={() => setAbaAtiva('equipe')}
                                >
                                    👤 Cadastro de Equipe
                                </button>
                                {/* Espaço para futuras ferramentas administrativas (ex: controle de frota) */}
                            </div>
                        )}
                    </div>

                    {/* 📁 SETOR: ENTOMOLOGIA (Laboratório) */}
                    <div className="menu-folder">
                        <button className="folder-btn" onClick={() => togglePasta('entomologia')}>
                            {pastaAberta === 'entomologia' ? '📂' : '📁'} Entomologia
                        </button>
                        {pastaAberta === 'entomologia' && (
                            <div className="folder-content">
                                <button
                                    className={`menu-btn ${abaAtiva === 'laboratorio' ? 'ativo' : ''}`}
                                    onClick={() => setAbaAtiva('laboratorio')}
                                >
                                    🔬 Lançamento de Ovos
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 📁 SETOR: SUPERVISORES */}
                    <div className="menu-folder">
                        <button className="folder-btn" onClick={() => togglePasta('supervisao')}>
                            {pastaAberta === 'supervisao' ? '📂' : '📁'} Supervisores
                        </button>
                        {pastaAberta === 'supervisao' && (
                            <div className="folder-content">
                                <button
                                    className={`menu-btn ${abaAtiva === 'mutirao' ? 'ativo' : ''}`}
                                    onClick={() => setAbaAtiva('mutirao')}
                                >
                                    📋 Distribuição de Mutirão
                                </button>
                            </div>
                        )}
                    </div>



                    {/* 📁 SETOR: RESPONSÁVEIS TÉCNICOS */}
                    <div className="menu-folder">
                        <button className="folder-btn" onClick={() => togglePasta('responsaveis')}>
                            {pastaAberta === 'responsaveis' ? '📂' : '📁'} Resp. Técnicos
                        </button>
                        {pastaAberta === 'responsaveis' && (
                            <div className="folder-content">
                                <button
                                    className={`menu-btn ${abaAtiva === 'dashboards' ? 'ativo' : ''}`}
                                    onClick={() => setAbaAtiva('dashboards')}
                                >
                                    📊 Indicadores e Relatórios
                                </button>
                                <button
                                    className={`menu-btn ${abaAtiva === 'consultas' ? 'ativo' : ''}`}
                                    onClick={() => setAbaAtiva('consultas')}
                                >
                                    🔍 Consultas & Exportação
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 📁 SETOR: BORRIFAÇÃO */}
                    <div className="menu-folder">
                        <button className="folder-btn" onClick={() => togglePasta('borrifacao')}>
                            {pastaAberta === 'borrifacao' ? '📂' : '📁'} Borrifação
                        </button>
                        {pastaAberta === 'borrifacao' && (
                            <div className="folder-content">
                                <button
                                    className={`menu-btn ${abaAtiva === 'retirada_bti' ? 'ativo' : ''}`}
                                    onClick={() => setAbaAtiva('retirada_bti')}
                                >
                                    🦟 Retirada de BTIs
                                </button>
                                <button
                                    className={`menu-btn ${abaAtiva === 'estoque_borrifacao' ? 'ativo' : ''}`}
                                    onClick={() => setAbaAtiva('estoque_borrifacao')}
                                >
                                    📦 Controle de Estoque
                                </button>
                                <button
                                    className={`menu-btn ${abaAtiva === 'bloqueio_quimico' ? 'ativo' : ''}`}
                                    onClick={() => setAbaAtiva('bloqueio_quimico')}
                                >
                                    💨 Bloqueio Químico
                                </button>
                                <button
                                    className={`menu-btn ${abaAtiva === 'pe_borrifacao' ? 'ativo' : ''}`}
                                    onClick={() => setAbaAtiva('pe_borrifacao')}
                                >
                                    🏭 Pontos Estratégicos (P.E)
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 📁 SETOR: ANIMAIS DOMÉSTICOS */}
                    <div className="menu-folder">
                        <button className="folder-btn" onClick={() => togglePasta('animais_domesticos')}>
                            {pastaAberta === 'animais_domesticos' ? '📂' : '📁'} Animais Domésticos
                        </button>
                        {pastaAberta === 'animais_domesticos' && (
                            <div className="folder-content">
                                <button
                                    className={`menu-btn ${abaAtiva === 'vacinacao_animal' ? 'ativo' : ''}`}
                                    onClick={() => setAbaAtiva('vacinacao_animal')}
                                >
                                    💉 Controle de Vacinação
                                </button>
                                <button
                                    className={`menu-btn ${abaAtiva === 'eutanasia_animal' ? 'ativo' : ''}`}
                                    onClick={() => setAbaAtiva('eutanasia_animal')}
                                >
                                    🌈 Controle de Eutanásia
                                </button>
                                <button
                                    className={`menu-btn ${abaAtiva === 'leishmaniose_animal' ? 'ativo' : ''}`}
                                    onClick={() => setAbaAtiva('leishmaniose_animal')}
                                >
                                    🐶 Controle de Leishmaniose
                                </button>
                                <button
                                    className={`menu-btn ${abaAtiva === 'temperatura_vacinas' ? 'ativo' : ''}`}
                                    onClick={() => setAbaAtiva('temperatura_vacinas')}
                                >
                                    🌡️ Temperatura de Vacinas
                                </button>
                            </div>
                        )}
                    </div>

                </nav>

                <div className="sidebar-saida">
                    <button className="btn-logout" onClick={() => setTelaAtual('login')}>
                        🚪 Sair do Sistema
                    </button>
                </div>
            </aside>

            {/* ➡️ ÁREA DE TRABALHO (DIREITA) */}
            <main className="tecnico-conteudo">

                {abaAtiva === 'equipe' && (
                    <div className="modulo-card-limpo">
                        <CadastroUsuario setTelaAtual={setTelaAtual} />
                    </div>
                )}

                {abaAtiva === 'consultas' && (
                    <div className="modulo-card">
                        <div className="modulo-header">
                            <ConsultasExportacoes setTelaAtual={setTelaAtual} />
                        </div>
                        {/* A tabela densa continua aqui... encurtada no exemplo para focar no menu */}
                        <p>Ferramenta de consultas ativada.</p>
                    </div>
                )}

                {abaAtiva === 'laboratorio' && (
                    <div className="modulo-card">
                        <div className="modulo-header">
                            <h2>Laboratório - Contagem de Ovos</h2>
                            <p>Insira os resultados microscópicos das palhetas recolhidas no campo.</p>
                        </div>
                        <p>Formulário de lançamento de ovos ativado.</p>
                    </div>
                )}

                {abaAtiva === 'mutirao' && (
                    <div className="modulo-card-limpo">
                        <DistribuidorTrabalho setTelaAtual={setTelaAtual} />
                    </div>
                )}

                {abaAtiva === 'dashboards' && (
                    <div className="modulo-card">
                        <div className="modulo-header">
                            <h2>Painel da Responsabilidade Técnica</h2>
                            <p>Visão consolidada dos índices de infestação do município.</p>
                        </div>
                        <p>Gráficos e relatórios entrarão aqui.</p>
                    </div>
                )}

            </main>
        </div>
    );
}