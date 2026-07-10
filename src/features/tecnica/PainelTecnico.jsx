import React, { useState } from 'react';
import OrdemServico from './OrdemServico';
import CadastroUsuario from '../tecnica/CadastroUsuario';
import GerenciarUsuarios from './GerenciarUsuarios';
import DistribuidorTrabalho from '../tecnica/DistribuidorTrabalho';
import ProgramacaoBloqueios from './ProgramacaoBloqueios';
import ConsultasExportacoes from '../tecnica/ConsultasExportacoes';
import AnaliseLarvas from './AnaliseLarvas';
import ValidacaoBloqueios from './ValidacaoBloqueios'; // Importação do componente ValidacaoBloqueios
import './PainelTecnico.css';

export default function PainelTecnico({ setTelaAtual }) {
    // 1. Controle de TELA: Inicia na tela de 'inicio' (vazia/profissional)
    const [abaAtiva, setAbaAtiva] = useState('inicio');

    // 2. Controle de PASTA: Inicia como 'null' (todas fechadas)
    const [pastaAberta, setPastaAberta] = useState(null);

    // Função que abre e fecha as pastas do menu
    const togglePasta = (nomeDaPasta) => {
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
        <div className="tecnico-container ds-gov-layout">

            {/* ⬅️ BARRA LATERAL (Padrão br-menu do GovBR) */}
            <aside className="tecnico-sidebar br-menu">

                {/* Bloco do Logo Alinhado e Clicável */}
                <button
                    className="sidebar-logo-btn"
                    onClick={() => {
                        setAbaAtiva('inicio');   // Reseta para a tela vazia/profissional
                        setPastaAberta(null);    // Fecha todas as pastas
                    }}
                    title="Ir para o início"
                >
                    <div className="logo-container">
                        <h2 className="text-weight-semi-bold mb-0">CVSA - Cuiabá</h2>
                        <span className="text-small text-muted">Sistema Integrado Base</span>
                    </div>
                </button>

                <nav className="sidebar-menu mt-3">

                    {/* 📁 SETOR: ADMINISTRATIVO */}
                    <div className="menu-folder">
                        <button className={`folder-btn br-button block ${pastaAberta === 'administrativo' ? 'active' : ''}`} onClick={() => togglePasta('administrativo')}>
                            <i className={`fas ${pastaAberta === 'administrativo' ? 'fa-folder-open' : 'fa-folder'} mr-2`} aria-hidden="true"></i>
                            Administrativo
                            <i className={`fas ${pastaAberta === 'administrativo' ? 'fa-angle-up' : 'fa-angle-down'} ml-auto`} aria-hidden="true"></i>
                        </button>

                        {pastaAberta === 'administrativo' && (
                            <div className="folder-content pl-3">

                                <button
                                    className={`menu-btn br-button block ${abaAtiva === 'ordem-servico' ? 'active text-primary' : ''}`}
                                    onClick={() => setAbaAtiva('ordem-servico')}
                                >
                                    <i className="fas fa-headset mr-2" aria-hidden="true"></i> Ordem de Serviço
                                </button>

                                <button
                                    className={`menu-btn br-button block ${abaAtiva === 'equipe' ? 'active text-primary' : ''}`}
                                    onClick={() => setAbaAtiva('equipe')}
                                >
                                    <i className="fas fa-user-plus mr-2" aria-hidden="true"></i> Cadastro de Equipe
                                </button>

                                <button
                                    className={`menu-btn br-button block ${abaAtiva === 'gerenciar-equipe' ? 'active text-primary' : ''}`}
                                    onClick={() => setAbaAtiva('gerenciar-equipe')}
                                >
                                    <i className="fas fa-user-edit mr-2" aria-hidden="true"></i> Gerenciar Usuários
                                </button>

                            </div>
                        )}
                    </div>

                    {/* 📁 SETOR: ENTOMOLOGIA (Laboratório) */}
                    <div className="menu-folder">
                        <button className={`folder-btn br-button block ${pastaAberta === 'entomologia' ? 'active' : ''}`} onClick={() => togglePasta('entomologia')}>
                            <i className={`fas ${pastaAberta === 'entomologia' ? 'fa-folder-open' : 'fa-folder'} mr-2`} aria-hidden="true"></i>
                            Entomologia
                            <i className={`fas ${pastaAberta === 'entomologia' ? 'fa-angle-up' : 'fa-angle-down'} ml-auto`} aria-hidden="true"></i>
                        </button>
                        {pastaAberta === 'entomologia' && (
                            <div className="folder-content pl-3">
                                <button
                                    className={`menu-btn br-button block ${abaAtiva === 'laboratorio-ovos' ? 'active text-primary' : ''}`}
                                    onClick={() => setAbaAtiva('laboratorio-ovos')}
                                >
                                    <i className="fas fa-microscope mr-2" aria-hidden="true"></i> Lançamento de Ovos
                                </button>
                                <button
                                    className={`menu-btn br-button block ${abaAtiva === 'laboratorio-larvas' ? 'active text-primary' : ''}`}
                                    onClick={() => setAbaAtiva('laboratorio-larvas')}
                                >
                                    <i className="fas fa-vial mr-2" aria-hidden="true"></i> Análise de Larvas
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 📁 SETOR: SUPERVISORES */}
                    <div className="menu-folder">
                        <button className={`folder-btn br-button block ${pastaAberta === 'supervisao' ? 'active' : ''}`} onClick={() => togglePasta('supervisao')}>
                            <i className={`fas ${pastaAberta === 'supervisao' ? 'fa-folder-open' : 'fa-folder'} mr-2`} aria-hidden="true"></i>
                            Supervisores
                            <i className={`fas ${pastaAberta === 'supervisao' ? 'fa-angle-up' : 'fa-angle-down'} ml-auto`} aria-hidden="true"></i>
                        </button>

                        {pastaAberta === 'supervisao' && (
                            <div className="folder-content pl-3">
                                {/* Botão Existente */}
                                <button
                                    className={`menu-btn br-button block ${abaAtiva === 'mutirao' ? 'active text-primary' : ''}`}
                                    onClick={() => setAbaAtiva('mutirao')}
                                >
                                    <i className="fas fa-clipboard-list mr-2" aria-hidden="true"></i> Distribuição de Mutirão
                                </button>

                                <button
                                    className={`menu-btn br-button block ${abaAtiva === 'programacao_bloqueios' ? 'active text-primary' : ''}`}
                                    onClick={() => setAbaAtiva('programacao-bloqueios')}
                                >
                                    <i className="fas fa-calendar-alt mr-2" aria-hidden="true"></i> Planejamento de Bloqueios
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 📁 SETOR: RESPONSÁVEIS TÉCNICOS */}
                    <div className="menu-folder">
                        <button className={`folder-btn br-button block ${pastaAberta === 'responsaveis' ? 'active' : ''}`} onClick={() => togglePasta('responsaveis')}>
                            <i className={`fas ${pastaAberta === 'responsaveis' ? 'fa-folder-open' : 'fa-folder'} mr-2`} aria-hidden="true"></i>
                            Resp. Técnicos
                            <i className={`fas ${pastaAberta === 'responsaveis' ? 'fa-angle-up' : 'fa-angle-down'} ml-auto`} aria-hidden="true"></i>
                        </button>
                        {pastaAberta === 'responsaveis' && (
                            <div className="folder-content pl-3">
                                <button
                                    className={`menu-btn br-button block ${abaAtiva === 'dashboards' ? 'active text-primary' : ''}`}
                                    onClick={() => setAbaAtiva('dashboards')}
                                >
                                    <i className="fas fa-chart-pie mr-2" aria-hidden="true"></i> Indicadores e Relatórios
                                </button>

                                <button
                                    className={`menu-btn br-button block ${abaAtiva === 'consultas' ? 'active text-primary' : ''}`}
                                    onClick={() => setAbaAtiva('consultas')}
                                >
                                    <i className="fas fa-search mr-2" aria-hidden="true"></i> Consultas & Exportação
                                </button>

                                <button
                                    className={`menu-btn br-button block ${abaAtiva === 'validacao-bloqueios' ? 'active text-primary' : ''}`}
                                    onClick={() => setAbaAtiva('validacao-bloqueios')}
                                >
                                    <i className="fas fa-shield-alt mr-2" aria-hidden="true"></i> Validação de Bloqueios
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 📁 SETOR: BORRIFAÇÃO */}
                    <div className="menu-folder">
                        <button className={`folder-btn br-button block ${pastaAberta === 'borrifacao' ? 'active' : ''}`} onClick={() => togglePasta('borrifacao')}>
                            <i className={`fas ${pastaAberta === 'borrifacao' ? 'fa-folder-open' : 'fa-folder'} mr-2`} aria-hidden="true"></i>
                            Borrifação
                            <i className={`fas ${pastaAberta === 'borrifacao' ? 'fa-angle-up' : 'fa-angle-down'} ml-auto`} aria-hidden="true"></i>
                        </button>
                        {pastaAberta === 'borrifacao' && (
                            <div className="folder-content pl-3">
                                <button className={`menu-btn br-button block ${abaAtiva === 'retirada_bti' ? 'active text-primary' : ''}`} onClick={() => setAbaAtiva('retirada_bti')}>
                                    <i className="fas fa-spray-can mr-2" aria-hidden="true"></i> Retirada de BTIs
                                </button>
                                <button className={`menu-btn br-button block ${abaAtiva === 'estoque_borrifacao' ? 'active text-primary' : ''}`} onClick={() => setAbaAtiva('estoque_borrifacao')}>
                                    <i className="fas fa-box mr-2" aria-hidden="true"></i> Controle de Estoque
                                </button>
                                <button className={`menu-btn br-button block ${abaAtiva === 'bloqueio_quimico' ? 'active text-primary' : ''}`} onClick={() => setAbaAtiva('bloqueio_quimico')}>
                                    <i className="fas fa-shield-alt mr-2" aria-hidden="true"></i> Bloqueio Químico
                                </button>
                                <button className={`menu-btn br-button block ${abaAtiva === 'pe_borrifacao' ? 'active text-primary' : ''}`} onClick={() => setAbaAtiva('pe_borrifacao')}>
                                    <i className="fas fa-map-marker-alt mr-2" aria-hidden="true"></i> Pontos Estratégicos (P.E)
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 📁 SETOR: ANIMAIS DOMÉSTICOS */}
                    <div className="menu-folder">
                        <button className={`folder-btn br-button block ${pastaAberta === 'animais_domesticos' ? 'active' : ''}`} onClick={() => togglePasta('animais_domesticos')}>
                            <i className={`fas ${pastaAberta === 'animais_domesticos' ? 'fa-folder-open' : 'fa-folder'} mr-2`} aria-hidden="true"></i>
                            Animais Domésticos
                            <i className={`fas ${pastaAberta === 'animais_domesticos' ? 'fa-angle-up' : 'fa-angle-down'} ml-auto`} aria-hidden="true"></i>
                        </button>
                        {pastaAberta === 'animais_domesticos' && (
                            <div className="folder-content pl-3">
                                <button className={`menu-btn br-button block ${abaAtiva === 'vacinacao_animal' ? 'active text-primary' : ''}`} onClick={() => setAbaAtiva('vacinacao_animal')}>
                                    <i className="fas fa-syringe mr-2" aria-hidden="true"></i> Controle de Vacinação
                                </button>
                                <button className={`menu-btn br-button block ${abaAtiva === 'eutanasia_animal' ? 'active text-primary' : ''}`} onClick={() => setAbaAtiva('eutanasia_animal')}>
                                    <i className="fas fa-book-dead mr-2" aria-hidden="true"></i> Controle de Eutanásia
                                </button>
                                <button className={`menu-btn br-button block ${abaAtiva === 'leishmaniose_animal' ? 'active text-primary' : ''}`} onClick={() => setAbaAtiva('leishmaniose_animal')}>
                                    <i className="fas fa-dog mr-2" aria-hidden="true"></i> Controle de Leishmaniose
                                </button>
                                <button className={`menu-btn br-button block ${abaAtiva === 'temperatura_vacinas' ? 'active text-primary' : ''}`} onClick={() => setAbaAtiva('temperatura_vacinas')}>
                                    <i className="fas fa-thermometer-half mr-2" aria-hidden="true"></i> Temperatura de Vacinas
                                </button>
                            </div>
                        )}
                    </div>

                </nav>

                <div className="sidebar-saida mt-auto p-3 border-top">
                    <button className="br-button danger block" onClick={() => setTelaAtual('login')}>
                        <i className="fas fa-sign-out-alt mr-2" aria-hidden="true"></i> Sair do Sistema
                    </button>
                </div>
            </aside>

            {/* ➡️ ÁREA DE TRABALHO (DIREITA) */}
            <main className="tecnico-conteudo p-4">

                {/* TELA INICIAL */}
                {abaAtiva === 'inicio' && (
                    <div className="br-message is-info mt-5" role="alert">
                        <div className="icon">
                            <i className="fas fa-info-circle fa-lg" aria-hidden="true"></i>
                        </div>
                        <div className="content" aria-label="Informação.">
                            <span className="message-title text-weight-semi-bold">Bem-vindo(a) ao Painel da Equipe Técnica.</span>
                            <span className="message-body">
                                {' '}Utilize o menu lateral para acessar os módulos de Entomologia, Supervisão e ferramentas administrativas. O sistema de monitoramento está operando normalmente.
                            </span>
                        </div>
                    </div>
                )}

                {/* ORDEM DE SERVIÇO */}
                {abaAtiva === 'ordem-servico' && (
                    <div className="br-card">
                        <OrdemServico setAbaAtiva={setAbaAtiva} />
                    </div>
                )}

                {/* CADASTRO DE USUÁRIO */}
                {abaAtiva === 'equipe' && (
                    <div className="br-card">
                        <CadastroUsuario setTelaAtual={setTelaAtual} />
                    </div>
                )}

                {/* 🎯 GERENCIAR USUÁRIOS: Totalmente livre e fluida */}
                {abaAtiva === 'gerenciar-equipe' && (
                    <GerenciarUsuarios setTelaAtual={setTelaAtual} />
                )}

                {/* CONSULTAS */}
                {abaAtiva === 'consultas' && (
                    <div className="br-card">
                        <div className="card-header border-bottom p-3">
                            <ConsultasExportacoes setTelaAtual={setTelaAtual} />
                        </div>
                        <div className="card-content p-3">
                            <p>Ferramenta de consultas ativada.</p>
                        </div>
                    </div>
                )}

                {/* LABORATÓRIO OVOS */}
                {abaAtiva === 'laboratorio' && (
                    <div className="br-card">
                        <div className="card-header border-bottom p-3">
                            <h2 className="text-weight-semi-bold">Laboratório - Contagem de Ovos</h2>
                            <p className="text-small mb-0">Insira os resultados microscópicos das palhetas recolhidas no campo.</p>
                        </div>
                        <div className="card-content p-3">
                            <p>Formulário de lançamento de ovos ativado.</p>
                        </div>
                    </div>
                )}

                {/* MUTIRÃO */}
                {abaAtiva === 'mutirao' && (
                    <div className="br-card">
                        <DistribuidorTrabalho setTelaAtual={setTelaAtual} />
                    </div>
                )}

                {/* PROGRAMAÇÃO DE BLOQUEIOS */}
                {abaAtiva === 'programacao-bloqueios' && (
                    <div className="br-card">
                        <ProgramacaoBloqueios setTelaAtual={setTelaAtual} />
                    </div>
                )}

                {abaAtiva === 'validacao-bloqueios' && (
                    <div className="br-card">
                        <ValidacaoBloqueios setAbaAtiva={setAbaAtiva} />
                    </div>
                )}

                {/* DASHBOARDS */}
                {abaAtiva === 'dashboards' && (
                    <div className="br-card">
                        <div className="card-header border-bottom p-3">
                            <h2 className="text-weight-semi-bold">Painel da Responsabilidade Técnica</h2>
                            <p className="text-small mb-0">Visão consolidada dos índices de infestação do município.</p>
                        </div>
                        <div className="card-content p-3">
                            <p>Gráficos e relatórios entrarão aqui.</p>
                        </div>
                    </div>
                )}

                {/* LABORATÓRIO LARVAS */}
                {abaAtiva === 'laboratorio-larvas' && (
                    <div className="br-card">
                        <AnaliseLarvas setAbaAtiva={setAbaAtiva} />
                    </div>
                )}

            </main>
        </div>
    );
}