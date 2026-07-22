import React, { useState } from 'react';

// Imports de componentes na mesma pasta (./)
import OrdemServico from './OrdemServico';
import CadastroUsuario from './CadastroUsuario';
import GerenciarUsuarios from './GerenciarUsuarios';
import DistribuidorTrabalho from './DistribuidorTrabalho';
import ProgramacaoBloqueios from './ProgramacaoBloqueios';
import GeradorReuniaoSemanal from './GeradorReuniaoSemanal';
import ConsultasExportacoes from './ConsultasExportacoes';
import ValidacaoBloqueios from './ValidacaoBloqueios';
import ValidacaoSinantropia from './ValidacaoSinantropia';
import BloqueioQuimico from './BloqueioQuimico';

// Módulo de Sinantropia (Arquivos na mesma pasta)
import AnaliseLarvas from './AnaliseLarvas'; // Representando Contagem de Ovos/Larvas
import SinantropiaBuscaAtiva from './SinantropiaBuscaAtiva';
import SinantropiaAnalises from './SinantropiaAnalises';

import './PainelTecnico.css';

export default function PainelTecnico({ setTelaAtual }) {
    const [abaAtiva, setAbaAtiva] = useState('inicio');
    const [pastaAberta, setPastaAberta] = useState(null);

    const togglePasta = (nomeDaPasta) => {
        setPastaAberta(pastaAberta === nomeDaPasta ? null : nomeDaPasta);
    };

    return (
        <div className="tecnico-container ds-gov-layout">

            {/* ⬅️ BARRA LATERAL */}
            <aside className="tecnico-sidebar br-menu">

                <button
                    className="sidebar-logo-btn"
                    onClick={() => {
                        setAbaAtiva('inicio');
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

                    {/* 📁 SETOR: ADMINISTRATIVO */}
                    <div className="menu-folder">
                        <button className={`folder-btn br-button block ${pastaAberta === 'administrativo' ? 'active' : ''}`} onClick={() => togglePasta('administrativo')}>
                            <i className={`fas ${pastaAberta === 'administrativo' ? 'fa-folder-open' : 'fa-folder'} mr-2`} aria-hidden="true"></i>
                            Administrativo
                            <i className={`fas ${pastaAberta === 'administrativo' ? 'fa-angle-up' : 'fa-angle-down'} ml-auto`} aria-hidden="true"></i>
                        </button>

                        {pastaAberta === 'administrativo' && (
                            <div className="folder-content pl-3">
                                <button className={`menu-btn br-button block ${abaAtiva === 'ordem-servico' ? 'active text-primary' : ''}`} onClick={() => setAbaAtiva('ordem-servico')}>
                                    <i className="fas fa-headset mr-2" aria-hidden="true"></i> Ordem de Serviço
                                </button>
                                <button className={`menu-btn br-button block ${abaAtiva === 'equipe' ? 'active text-primary' : ''}`} onClick={() => setAbaAtiva('equipe')}>
                                    <i className="fas fa-user-plus mr-2" aria-hidden="true"></i> Cadastro de Equipe
                                </button>
                                <button className={`menu-btn br-button block ${abaAtiva === 'gerenciar-equipe' ? 'active text-primary' : ''}`} onClick={() => setAbaAtiva('gerenciar-equipe')}>
                                    <i className="fas fa-user-edit mr-2" aria-hidden="true"></i> Gerenciar Usuários
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 📁 SETOR: SINANTROPIA */}
                    <div className="menu-folder">
                        <button className={`folder-btn br-button block ${pastaAberta === 'sinantropia' ? 'active' : ''}`} onClick={() => togglePasta('sinantropia')}>
                            <i className={`fas ${pastaAberta === 'sinantropia' ? 'fa-folder-open' : 'fa-folder'} mr-2`} aria-hidden="true"></i>
                            Sinantropia
                            <i className={`fas ${pastaAberta === 'sinantropia' ? 'fa-angle-up' : 'fa-angle-down'} ml-auto`} aria-hidden="true"></i>
                        </button>

                        {pastaAberta === 'sinantropia' && (
                            <div className="folder-content pl-3">
                                <button className={`menu-btn br-button block ${abaAtiva === 'sinantropia-ovos' ? 'active text-primary' : ''}`} onClick={() => setAbaAtiva('sinantropia-ovos')}>
                                    <i className="fas fa-egg mr-2" aria-hidden="true"></i> Contagem de Ovos
                                </button>
                                <button className={`menu-btn br-button block ${abaAtiva === 'sinantropia-busca-ativa' ? 'active text-primary' : ''}`} onClick={() => setAbaAtiva('sinantropia-busca-ativa')}>
                                    <i className="fas fa-search-location mr-2" aria-hidden="true"></i> Busca Ativa (Campo)
                                </button>
                                <button className={`menu-btn br-button block ${abaAtiva === 'sinantropia-analises' ? 'active text-primary' : ''}`} onClick={() => setAbaAtiva('sinantropia-analises')}>
                                    <i className="fas fa-microscope mr-2" aria-hidden="true"></i> Análises do Laboratório
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
                                <button className={`menu-btn br-button block ${abaAtiva === 'mutirao' ? 'active text-primary' : ''}`} onClick={() => setAbaAtiva('mutirao')}>
                                    <i className="fas fa-clipboard-list mr-2" aria-hidden="true"></i> Distribuição de Mutirão
                                </button>
                                <button className={`menu-btn br-button block ${abaAtiva === 'programacao-bloqueios' ? 'active text-primary' : ''}`} onClick={() => setAbaAtiva('programacao-bloqueios')}>
                                    <i className="fas fa-calendar-alt mr-2" aria-hidden="true"></i> Planejamento de Bloqueios
                                </button>
                                <button className={`menu-btn br-button block ${abaAtiva === 'reuniao-semanal' ? 'active text-primary' : ''}`} onClick={() => setAbaAtiva('reuniao-semanal')}>
                                    <i className="fas fa-file-powerpoint mr-2 text-danger" aria-hidden="true"></i> Reunião Semanal (PPTX)
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
                                <button className={`menu-btn br-button block ${abaAtiva === 'dashboards' ? 'active text-primary' : ''}`} onClick={() => setAbaAtiva('dashboards')}>
                                    <i className="fas fa-chart-pie mr-2" aria-hidden="true"></i> Indicadores e Relatórios
                                </button>
                                <button className={`menu-btn br-button block ${abaAtiva === 'consultas' ? 'active text-primary' : ''}`} onClick={() => setAbaAtiva('consultas')}>
                                    <i className="fas fa-search mr-2" aria-hidden="true"></i> Consultas & Exportação
                                </button>
                                <button className={`menu-btn br-button block ${abaAtiva === 'validacao-bloqueios' ? 'active text-primary' : ''}`} onClick={() => setAbaAtiva('validacao-bloqueios')}>
                                    <i className="fas fa-shield-alt mr-2" aria-hidden="true"></i> Validação de Bloqueios
                                </button>
                                <button className={`menu-btn br-button block ${abaAtiva === 'validacao-sinantropia' ? 'active text-primary' : ''}`} onClick={() => setAbaAtiva('validacao-sinantropia')}>
                                    <i className="fas fa-bug mr-2" aria-hidden="true"></i> Validação Sinantropia
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
                                <button className={`menu-btn br-button block ${abaAtiva === 'bloqueio_quimico' ? 'active text-primary' : ''}`} onClick={() => setAbaAtiva('bloqueio_quimico')}>
                                    <i className="fas fa-shield-alt mr-2" aria-hidden="true"></i> Bloqueio Químico
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

            {/* ➡️ ÁREA DE TRABALHO */}
            <main className="tecnico-conteudo p-4">

                {abaAtiva === 'inicio' && (
                    <div className="br-message is-info mt-5" role="alert">
                        <div className="icon"><i className="fas fa-info-circle fa-lg"></i></div>
                        <div className="content">
                            <span className="message-title text-weight-semi-bold">Bem-vindo(a) ao Painel da Equipe Técnica.</span>
                            <span className="message-body"> Utilize o menu lateral para acessar os módulos de Sinantropia, Borrifação e Supervisão.</span>
                        </div>
                    </div>
                )}

                {abaAtiva === 'ordem-servico' && <div className="br-card"><OrdemServico setAbaAtiva={setAbaAtiva} /></div>}
                {abaAtiva === 'equipe' && <div className="br-card"><CadastroUsuario setAbaAtiva={setAbaAtiva} /></div>}
                {abaAtiva === 'gerenciar-equipe' && <GerenciarUsuarios setTelaAtual={setTelaAtual} />}

                {/* SINANTROPIA */}
                {abaAtiva === 'sinantropia-ovos' && <div className="br-card"><AnaliseLarvas setAbaAtiva={setAbaAtiva} /></div>}
                {abaAtiva === 'sinantropia-busca-ativa' && <div className="br-card"><SinantropiaBuscaAtiva setAbaAtiva={setAbaAtiva} /></div>}
                {abaAtiva === 'sinantropia-analises' && <div className="br-card"><SinantropiaAnalises setAbaAtiva={setAbaAtiva} /></div>}

                {/* DEMAIS MÓDULOS */}
                {abaAtiva === 'consultas' && <div className="br-card"><ConsultasExportacoes setTelaAtual={setTelaAtual} /></div>}
                {abaAtiva === 'mutirao' && <div className="br-card"><DistribuidorTrabalho setTelaAtual={setTelaAtual} /></div>}
                {abaAtiva === 'programacao-bloqueios' && <div className="br-card"><ProgramacaoBloqueios setTelaAtual={setTelaAtual} /></div>}
                {abaAtiva === 'reuniao-semanal' && <div className="br-card"><GeradorReuniaoSemanal /></div>}
                {abaAtiva === 'validacao-bloqueios' && <ValidacaoBloqueios setAbaAtiva={setAbaAtiva} />}
                {abaAtiva === 'validacao-sinantropia' && <ValidacaoSinantropia setAbaAtiva={setAbaAtiva} />}
                {abaAtiva === 'bloqueio_quimico' && <div className="br-card"><BloqueioQuimico setAbaAtiva={setAbaAtiva} /></div>}

            </main>
        </div>
    );
}