import React, { useState } from 'react';

// 📁 SETOR: ADMINISTRATIVO
import OrdemServico from './administrativo/OrdemServico';
import CadastroUsuario from './administrativo/CadastroUsuario';
import GerenciarUsuarios from './administrativo/GerenciarUsuarios';

// 📁 SETOR: EPIZOOTIAS
import EpizootiaBusca from './Epizootias/EpizootiaBusca';
import EpizootiaAnalises from './Epizootias/EpizootiaAnalises';
import MonitorTemperatura from './Epizootias/MonitorTemperatura';

// 📁 SETOR: SINANTROPIA
import AnaliseLarvas from './sinantropia/AnaliseLarvas';
import SinantropiaBuscaAtiva from './sinantropia/SinantropiaBuscaAtiva';
import SinantropiaAnalises from './sinantropia/SinantropiaAnalises';

// 📁 SETOR: SUPERVISORES
import DistribuidorTrabalho from './supervisao/DistribuidorTrabalho';
import ProgramacaoBloqueios from './supervisao/ProgramacaoBloqueios';
import GeradorReuniaoSemanal from './supervisao/GeradorReuniaoSemanal';
import InspecaoTerrenos from './supervisao/InspecaoTerrenos';

// 📁 SETOR: RESPONSÁVEIS TÉCNICOS
import ValidacaoBloqueios from './responsaveis-tecnicos/ValidacaoBloqueios';
import ValidacaoSinantropia from './responsaveis-tecnicos/ValidacaoSinantropia';

// 📁 SETOR: CONSULTAS E RELATÓRIOS
import ConsultasExportacoes from './consultas/ConsultasExportacoes';
import IndicadoresRelatorios from './consultas/IndicadoresRelatorios';
import TabelaResumoPNCD from './consultas/TabelaResumoPNCD.jsx';

// 📁 SETOR: BORRIFAÇÃO
import BloqueioQuimico from './borrifacao/BloqueioQuimico';

import './PainelTecnico.css';

export default function PainelTecnico({ setTelaAtual }) {
    const [abaAtiva, setAbaAtiva] = useState('inicio');
    const [pastaAberta, setPastaAberta] = useState(null);
    const [sidebarAberta, setSidebarAberta] = useState(false);

    const togglePasta = (nomeDaPasta) => {
        setPastaAberta(pastaAberta === nomeDaPasta ? null : nomeDaPasta);
    };

    // Navega para a aba e recolhe o menu no celular automaticamente
    const navegarPara = (aba) => {
        setAbaAtiva(aba);
        setSidebarAberta(false);
    };

    return (
        <div className="tecnico-container ds-gov-layout">

            {/* 📱 BARRA SUPERIOR EXCLUSIVA PARA CELULAR / TABLET */}
            <header className="mobile-header">
                <button
                    className="mobile-menu-toggle"
                    onClick={() => setSidebarAberta(!sidebarAberta)}
                    aria-label="Abrir menu"
                >
                    <i className={`fas ${sidebarAberta ? 'fa-times' : 'fa-bars'}`}></i>
                </button>
                <div className="mobile-header-title">
                    <span className="title-bold">CVSA - Cuiabá</span>
                    <span className="title-sub">Painel Técnico</span>
                </div>
            </header>

            {/* 🌑 BACKDROP (Fundo escuro que fecha a sidebar ao tocar fora) */}
            <div
                className={`sidebar-backdrop ${sidebarAberta ? 'ativo' : ''}`}
                onClick={() => setSidebarAberta(false)}
            />

            {/* ⬅️ BARRA LATERAL (DRAWER NO MOBILE) */}
            <aside className={`tecnico-sidebar br-menu ${sidebarAberta ? 'sidebar-aberta' : ''}`}>

                <button
                    className="sidebar-logo-btn"
                    onClick={() => {
                        navegarPara('inicio');
                        setPastaAberta(null);
                    }}
                    title="Ir para o início"
                >
                    <div className="logo-container">
                        <h2 className="text-weight-semi-bold mb-0">CVSA - Cuiabá</h2>
                        <span className="text-small text-muted">Sistema Integrado Base</span>
                    </div>
                </button>

                <nav className="sidebar-menu mt-3">

                    {/* 📁 SETOR 1: ADMINISTRATIVO */}
                    <div className="menu-folder">
                        <button className={`folder-btn br-button block ${pastaAberta === 'administrativo' ? 'active' : ''}`} onClick={() => togglePasta('administrativo')}>
                            <i className={`fas ${pastaAberta === 'administrativo' ? 'fa-folder-open' : 'fa-folder'} mr-2`} aria-hidden="true"></i>
                            Administrativo
                            <i className={`fas ${pastaAberta === 'administrativo' ? 'fa-angle-up' : 'fa-angle-down'} ml-auto`} aria-hidden="true"></i>
                        </button>

                        {pastaAberta === 'administrativo' && (
                            <div className="folder-content pl-3">
                                <button className={`menu-btn br-button block ${abaAtiva === 'ordem-servico' ? 'active text-primary' : ''}`} onClick={() => navegarPara('ordem-servico')}>
                                    <i className="fas fa-headset mr-2" aria-hidden="true"></i> Ordem de Serviço
                                </button>
                                <button className={`menu-btn br-button block ${abaAtiva === 'equipe' ? 'active text-primary' : ''}`} onClick={() => navegarPara('equipe')}>
                                    <i className="fas fa-user-plus mr-2" aria-hidden="true"></i> Cadastro de Equipe
                                </button>
                                <button className={`menu-btn br-button block ${abaAtiva === 'gerenciar-equipe' ? 'active text-primary' : ''}`} onClick={() => navegarPara('gerenciar-equipe')}>
                                    <i className="fas fa-user-edit mr-2" aria-hidden="true"></i> Gerenciar Usuários
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 📁 SETOR 2: SINANTROPIA */}
                    <div className="menu-folder">
                        <button className={`folder-btn br-button block ${pastaAberta === 'sinantropia' ? 'active' : ''}`} onClick={() => togglePasta('sinantropia')}>
                            <i className={`fas ${pastaAberta === 'sinantropia' ? 'fa-folder-open' : 'fa-folder'} mr-2`} aria-hidden="true"></i>
                            Sinantropia
                            <i className={`fas ${pastaAberta === 'sinantropia' ? 'fa-angle-up' : 'fa-angle-down'} ml-auto`} aria-hidden="true"></i>
                        </button>

                        {pastaAberta === 'sinantropia' && (
                            <div className="folder-content pl-3">
                                <button className={`menu-btn br-button block ${abaAtiva === 'sinantropia-ovos' ? 'active text-primary' : ''}`} onClick={() => navegarPara('sinantropia-ovos')}>
                                    <i className="fas fa-egg mr-2" aria-hidden="true"></i> Contagem de Ovos
                                </button>
                                <button className={`menu-btn br-button block ${abaAtiva === 'sinantropia-busca-ativa' ? 'active text-primary' : ''}`} onClick={() => navegarPara('sinantropia-busca-ativa')}>
                                    <i className="fas fa-search-location mr-2" aria-hidden="true"></i> Agendamentos
                                </button>
                                <button className={`menu-btn br-button block ${abaAtiva === 'sinantropia-analises' ? 'active text-primary' : ''}`} onClick={() => navegarPara('sinantropia-analises')}>
                                    <i className="fas fa-microscope mr-2" aria-hidden="true"></i> Análises
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 📁 SETOR 3: EPIZOOTIAS */}
                    <div className="menu-folder">
                        <button className={`folder-btn br-button block ${pastaAberta === 'epizootias' ? 'active' : ''}`} onClick={() => togglePasta('epizootias')}>
                            <i className={`fas ${pastaAberta === 'epizootias' ? 'fa-folder-open' : 'fa-folder'} mr-2`} aria-hidden="true"></i>
                            Epizootias
                            <i className={`fas ${pastaAberta === 'epizootias' ? 'fa-angle-up' : 'fa-angle-down'} ml-auto`} aria-hidden="true"></i>
                        </button>

                        {pastaAberta === 'epizootias' && (
                            <div className="folder-content pl-3">
                                <button className={`menu-btn br-button block ${abaAtiva === 'epizootia-busca' ? 'active text-primary' : ''}`} onClick={() => navegarPara('epizootia-busca')}>
                                    <i className="fas fa-search-location mr-2" aria-hidden="true"></i> Agendamentos
                                </button>
                                <button className={`menu-btn br-button block ${abaAtiva === 'epizootia-analises' ? 'active text-primary' : ''}`} onClick={() => navegarPara('epizootia-analises')}>
                                    <i className="fas fa-microscope mr-2" aria-hidden="true"></i> Análises e Retaguarda
                                </button>
                                <button
                                    className={`menu-btn br-button block ${abaAtiva === 'monitor-temperatura' ? 'active text-primary' : ''}`}
                                    onClick={() => setAbaAtiva('monitor-temperatura')}
                                >
                                    <i className="fas fa-thermometer-half mr-2" aria-hidden="true"></i> Monitor de Temperatura
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 📁 SETOR 4: SUPERVISORES */}
                    <div className="menu-folder">
                        <button className={`folder-btn br-button block ${pastaAberta === 'supervisao' ? 'active' : ''}`} onClick={() => togglePasta('supervisao')}>
                            <i className={`fas ${pastaAberta === 'supervisao' ? 'fa-folder-open' : 'fa-folder'} mr-2`} aria-hidden="true"></i>
                            Supervisores
                            <i className={`fas ${pastaAberta === 'supervisao' ? 'fa-angle-up' : 'fa-angle-down'} ml-auto`} aria-hidden="true"></i>
                        </button>

                        {pastaAberta === 'supervisao' && (
                            <div className="folder-content pl-3">
                                <button className={`menu-btn br-button block ${abaAtiva === 'inspecoes' ? 'active text-primary' : ''}`} onClick={() => navegarPara('inspecoes')}>
                                    <i className="fas fa-search-location mr-2" aria-hidden="true"></i> Inspeções
                                </button>
                                <button className={`menu-btn br-button block ${abaAtiva === 'mutirao' ? 'active text-primary' : ''}`} onClick={() => navegarPara('mutirao')}>
                                    <i className="fas fa-clipboard-list mr-2" aria-hidden="true"></i> Distribuição de Mutirão
                                </button>
                                <button className={`menu-btn br-button block ${abaAtiva === 'programacao-bloqueios' ? 'active text-primary' : ''}`} onClick={() => navegarPara('programacao-bloqueios')}>
                                    <i className="fas fa-calendar-alt mr-2" aria-hidden="true"></i> Planejamento de Bloqueios
                                </button>
                                <button className={`menu-btn br-button block ${abaAtiva === 'reuniao-semanal' ? 'active text-primary' : ''}`} onClick={() => navegarPara('reuniao-semanal')}>
                                    <i className="fas fa-file-powerpoint mr-2 text-danger" aria-hidden="true"></i> Reunião Semanal (PPTX)
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 📁 SETOR 5: RESPONSÁVEIS TÉCNICOS */}
                    <div className="menu-folder">
                        <button className={`folder-btn br-button block ${pastaAberta === 'responsaveis' ? 'active' : ''}`} onClick={() => togglePasta('responsaveis')}>
                            <i className={`fas ${pastaAberta === 'responsaveis' ? 'fa-folder-open' : 'fa-folder'} mr-2`} aria-hidden="true"></i>
                            Resp. Técnicos
                            <i className={`fas ${pastaAberta === 'responsaveis' ? 'fa-angle-up' : 'fa-angle-down'} ml-auto`} aria-hidden="true"></i>
                        </button>

                        {pastaAberta === 'responsaveis' && (
                            <div className="folder-content pl-3">
                                <button className={`menu-btn br-button block ${abaAtiva === 'validacao-bloqueios' ? 'active text-primary' : ''}`} onClick={() => navegarPara('validacao-bloqueios')}>
                                    <i className="fas fa-shield-alt mr-2" aria-hidden="true"></i> Validação de Bloqueios
                                </button>
                                <button className={`menu-btn br-button block ${abaAtiva === 'validacao-sinantropia' ? 'active text-primary' : ''}`} onClick={() => navegarPara('validacao-sinantropia')}>
                                    <i className="fas fa-bug mr-2" aria-hidden="true"></i> Validação Sinantropia
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 📁 SETOR 6: BORRIFAÇÃO */}
                    <div className="menu-folder">
                        <button className={`folder-btn br-button block ${pastaAberta === 'borrifacao' ? 'active' : ''}`} onClick={() => togglePasta('borrifacao')}>
                            <i className={`fas ${pastaAberta === 'borrifacao' ? 'fa-folder-open' : 'fa-folder'} mr-2`} aria-hidden="true"></i>
                            Borrifação
                            <i className={`fas ${pastaAberta === 'borrifacao' ? 'fa-angle-up' : 'fa-angle-down'} ml-auto`} aria-hidden="true"></i>
                        </button>

                        {pastaAberta === 'borrifacao' && (
                            <div className="folder-content pl-3">
                                <button className={`menu-btn br-button block ${abaAtiva === 'bloqueio_quimico' ? 'active text-primary' : ''}`} onClick={() => navegarPara('bloqueio_quimico')}>
                                    <i className="fas fa-shield-alt mr-2" aria-hidden="true"></i> Bloqueio Químico
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 📁 SETOR 7: CONSULTAS E RELATÓRIOS */}
                    <div className="menu-folder">
                        <button className={`folder-btn br-button block ${pastaAberta === 'consultas-relatorios' ? 'active' : ''}`} onClick={() => togglePasta('consultas-relatorios')}>
                            <i className={`fas ${pastaAberta === 'consultas-relatorios' ? 'fa-folder-open' : 'fa-folder'} mr-2`} aria-hidden="true"></i>
                            Consultas & Relatórios
                            <i className={`fas ${pastaAberta === 'consultas-relatorios' ? 'fa-angle-up' : 'fa-angle-down'} ml-auto`} aria-hidden="true"></i>
                        </button>

                        {pastaAberta === 'consultas-relatorios' && (
                            <div className="folder-content pl-3">
                                <button className={`menu-btn br-button block ${abaAtiva === 'dashboards' ? 'active text-primary' : ''}`} onClick={() => navegarPara('dashboards')}>
                                    <i className="fas fa-chart-pie mr-2" aria-hidden="true"></i> Indicadores e Relatórios
                                </button>
                                <button className={`menu-btn br-button block ${abaAtiva === 'consultas' ? 'active text-primary' : ''}`} onClick={() => navegarPara('consultas')}>
                                    <i className="fas fa-search mr-2" aria-hidden="true"></i> Consultas & Exportação
                                </button>
                                <button className={`menu-btn br-button block ${abaAtiva === 'resumo-pncd' ? 'active text-primary' : ''}`} onClick={() => navegarPara('resumo-pncd')}>
                                    <i className="fas fa-table mr-2" aria-hidden="true"></i> Resumo Semanal (PNCD)
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

            {/* ➡️ ÁREA DE TRABALHO (100% DA LARGURA NO CELULAR) */}
            <main className="tecnico-conteudo">

                {/* 🏠 TELA INICIAL */}
                {abaAtiva === 'inicio' && (
                    <div className="br-message is-info mt-2" role="alert">
                        <div className="icon"><i className="fas fa-info-circle fa-lg"></i></div>
                        <div className="content">
                            <span className="message-title text-weight-semi-bold">Bem-vindo(a) ao Painel da Equipe Técnica.</span>
                            <span className="message-body"> Utilize o menu para acessar os módulos operacionais, de supervisão e relatórios.</span>
                        </div>
                    </div>
                )}

                {/* 📁 SETOR 1: ADMINISTRATIVO */}
                {abaAtiva === 'ordem-servico' && <div className="br-card"><OrdemServico setAbaAtiva={setAbaAtiva} /></div>}
                {abaAtiva === 'equipe' && <div className="br-card"><CadastroUsuario setAbaAtiva={setAbaAtiva} /></div>}
                {abaAtiva === 'gerenciar-equipe' && <GerenciarUsuarios setTelaAtual={setTelaAtual} />}

                {/* 📁 SETOR 2: SINANTROPIA */}
                {abaAtiva === 'sinantropia-ovos' && <div className="br-card"><AnaliseLarvas setAbaAtiva={setAbaAtiva} /></div>}
                {abaAtiva === 'sinantropia-busca-ativa' && <div className="br-card"><SinantropiaBuscaAtiva setAbaAtiva={setAbaAtiva} /></div>}
                {abaAtiva === 'sinantropia-analises' && <div className="br-card"><SinantropiaAnalises setAbaAtiva={setAbaAtiva} /></div>}

                {/* 📁 SETOR 3: EPIZOOTIAS */}
                {abaAtiva === 'epizootia-busca' && <div className="br-card"><EpizootiaBusca setAbaAtiva={setAbaAtiva} /></div>}
                {abaAtiva === 'epizootia-analises' && <div className="br-card"><EpizootiaAnalises setAbaAtiva={setAbaAtiva} /></div>}
                {abaAtiva === 'monitor-temperatura' && <MonitorTemperatura setAbaAtiva={setAbaAtiva} setTelaAtual={setTelaAtual} />}

                {/* 📁 SETOR 4: SUPERVISORES */}
                {abaAtiva === 'mutirao' && <div className="br-card"><DistribuidorTrabalho setTelaAtual={setTelaAtual} /></div>}
                {abaAtiva === 'programacao-bloqueios' && <div className="br-card"><ProgramacaoBloqueios setTelaAtual={setTelaAtual} /></div>}
                {abaAtiva === 'reuniao-semanal' && <div className="br-card"><GeradorReuniaoSemanal /></div>}
                {abaAtiva === 'inspecoes' && <div className="br-card"><InspecaoTerrenos /></div>}

                {/* 📁 SETOR 5: RESPONSÁVEIS TÉCNICOS */}
                {abaAtiva === 'validacao-bloqueios' && <ValidacaoBloqueios setAbaAtiva={setAbaAtiva} />}
                {abaAtiva === 'validacao-sinantropia' && <ValidacaoSinantropia setAbaAtiva={setAbaAtiva} />}

                {/* 📁 SETOR 6: BORRIFAÇÃO */}
                {abaAtiva === 'bloqueio_quimico' && <div className="br-card"><BloqueioQuimico setAbaAtiva={setAbaAtiva} /></div>}

                {/* 📁 SETOR 7: CONSULTAS E RELATÓRIOS */}
                {abaAtiva === 'dashboards' && <div className="br-card"><IndicadoresRelatorios setAbaAtiva={setAbaAtiva} /></div>}
                {abaAtiva === 'consultas' && <div className="br-card"><ConsultasExportacoes setTelaAtual={setTelaAtual} /></div>}
                {abaAtiva === 'resumo-pncd' && <TabelaResumoPNCD />}

            </main>
        </div>
    );
}