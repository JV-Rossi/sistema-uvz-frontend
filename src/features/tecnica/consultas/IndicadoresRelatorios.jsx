import React, { useState } from 'react';
import './IndicadoresRelatorios.css';

export default function IndicadoresRelatorios({ setAbaAtiva }) {
    const [periodo, setFiltroPeriodo] = useState('mes');
    const [regional, setRegional] = useState('TODAS');

    return (
        <div className="indicadores-container container-cadastro-user">
            {/* CABEÇALHO */}
            <header className="pb-3 mb-4 border-bottom">
                <h1 className="text-weight-semi-bold mb-1" style={{ color: '#1351B4' }}>
                    <i className="fas fa-chart-pie mr-2" aria-hidden="true"></i>
                    Indicadores e Relatórios Gerenciais
                </h1>
                <p className="mb-0 text-muted">
                    Visão estratégica, métricas de produtividade das equipes e acompanhamento epidemiológico da UVZ.
                </p>
            </header>

            {/* FILTROS DE VISUALIZAÇÃO */}
            <div className="br-card p-4 mb-4">
                <div className="grid-form generic-grid-2-cols">
                    <div className="form-group">
                        <label className="text-weight-semi-bold mb-2">Período de Análise:</label>
                        <select 
                            className="br-select" 
                            value={periodo} 
                            onChange={(e) => setFiltroPeriodo(e.target.value)}
                        >
                            <option value="semana">Última Semana Epidemiológica</option>
                            <option value="mes">Mês Atual</option>
                            <option value="trimestre">Trimestre</option>
                            <option value="ano">Ano Vigente (2026)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="text-weight-semi-bold mb-2">Regional / Distrito:</label>
                        <select 
                            className="br-select" 
                            value={regional} 
                            onChange={(e) => setRegional(e.target.value)}
                        >
                            <option value="TODAS">Todas as Regionais</option>
                            <option value="Norte">Distrito Norte</option>
                            <option value="Sul">Distrito Sul</option>
                            <option value="Leste">Distrito Leste</option>
                            <option value="Oeste">Distrito Oeste</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* PAINEL DE CARDS DE MÉTRICAS */}
            <div className="stats-grid mb-4">
                <div className="br-card p-3 text-center border-left-primary">
                    <span className="d-block text-small text-muted text-uppercase font-weight-bold">Imóveis Vistoriados</span>
                    <span className="d-block text-large text-primary font-weight-bold mt-1">12.450</span>
                </div>
                <div className="br-card p-3 text-center border-left-success">
                    <span className="d-block text-small text-muted text-uppercase font-weight-bold">Tratamentos Focais</span>
                    <span className="d-block text-large text-success font-weight-bold mt-1">1.820</span>
                </div>
                <div className="br-card p-3 text-center border-left-warning">
                    <span className="d-block text-small text-muted text-uppercase font-weight-bold">Bloqueios Concluídos</span>
                    <span className="d-block text-large text-warning font-weight-bold mt-1">94%</span>
                </div>
                <div className="br-card p-3 text-center border-left-danger">
                    <span className="d-block text-small text-muted text-uppercase font-weight-bold">Imóveis Fechados / Recusas</span>
                    <span className="d-block text-large text-danger font-weight-bold mt-1">11,2%</span>
                </div>
            </div>

            {/* SEÇÃO DE RELATÓRIOS GERENCIAIS PARA DOWNLOAD */}
            <div className="br-card p-4">
                <h3 className="text-weight-semi-bold mb-3 text-primary">
                    <i className="fas fa-file-pdf mr-2"></i> Relatórios Consolidados em PDF/Excel
                </h3>

                <div className="list-group">
                    <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                        <div>
                            <strong>Relatório Semanal de Produtividade dos Agentes (ACE)</strong>
                            <p className="mb-0 text-small text-muted">Média de imóveis visitados, recusas e tratamento por agente.</p>
                        </div>
                        <button className="br-button secondary small" onClick={() => alert("Gerando PDF...")}>
                            <i className="fas fa-download mr-1"></i> Baixar PDF
                        </button>
                    </div>

                    <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                        <div>
                            <strong>Boletim Epidemiológico de Arboviroses</strong>
                            <p className="mb-0 text-small text-muted">Casos notificados, confirmados e raio de bloqueio químico executado.</p>
                        </div>
                        <button className="br-button secondary small" onClick={() => alert("Gerando PDF...")}>
                            <i className="fas fa-download mr-1"></i> Baixar PDF
                        </button>
                    </div>

                    <div className="d-flex justify-content-between align-items-center p-3">
                        <div>
                            <strong>Resumo das Vistorias Zoosanitárias e Sinantropia</strong>
                            <p className="mb-0 text-small text-muted">Atendimentos a solicitações de munícipes e laudos de bancada.</p>
                        </div>
                        <button className="br-button secondary small" onClick={() => alert("Gerando PDF...")}>
                            <i className="fas fa-download mr-1"></i> Baixar PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}