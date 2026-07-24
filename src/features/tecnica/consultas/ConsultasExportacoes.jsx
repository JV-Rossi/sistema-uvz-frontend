import React, { useState } from 'react';

// 🟢 IMPORTS ATUALIZADOS: Apontando para a subpasta ./filtros/
import FiltroTabelaVisitas from './filtros/FiltroTabelaVisitas';
import FiltroTabelaResumos from './filtros/FiltroTabelaResumos';
import FiltroTabelaOvitrampas from './filtros/FiltroTabelaOvitrampas';
import FiltroTabelaPE from './filtros/FiltroTabelaPE';
import FiltroTabelaBloqueio from './filtros/FiltroTabelaBloqueio';
import FiltroTabelaConstituicao from './filtros/FiltroTabelaConstituicao';
import FiltroTabelaMutirao from './filtros/FiltroTabelaMutirao';

import './ConsultasExportacoes.css';

export default function ConsultasExportacoes() {
    const [fonteDados, setFonteDados] = useState('visitas');

    return (
        <div className="consultas-container container-cadastro-user">
            
            {/* 📝 CABEÇALHO DO MÓDULO */}
            <header className="pb-3 mb-4 border-bottom">
                <h1 className="text-weight-semi-bold mb-1" style={{ color: '#1351B4' }}>
                    <i className="fas fa-search mr-2" aria-hidden="true"></i>
                    Consultas e Exportações
                </h1>
                <p className="mb-0" style={{ color: '#555' }}>
                    Selecione uma base de dados específica para aplicar filtros avançados e extrair relatórios consolidados.
                </p>
            </header>

            {/* 🗂️ SELETOR DE BASE DE DADOS */}
            <div className="br-card p-4 mb-4 select-base-card">
                <div className="form-group">
                    <label htmlFor="fonteDados" className="text-weight-semi-bold mb-2">
                        1. Selecione a Base de Dados para Consulta e Extração:
                    </label>
                    <select 
                        id="fonteDados"
                        className="br-select"
                        value={fonteDados} 
                        onChange={(e) => setFonteDados(e.target.value)}
                    >
                        <option value="visitas">Base de Imóveis e Visitas de Rotina (ACE)</option>
                        <option value="resumos">Base de Resumos Semanais (Lotes Fechados)</option>
                        <option value="ovitrampas">Base de Ovitrampas (Instalação e Laboratório)</option>
                        <option value="pe">Pontos Estratégicos (PE - Borracharias, Cemitérios...)</option>
                        <option value="bloqueio">Bloqueio de Foco / Casos Notificados</option>
                        <option value="mutirao">Mutirão de Limpeza</option>
                        <option value="constituicao">Constituição (Pesquisa Especial)</option>
                    </select>
                </div>
            </div>

            {/* ⚙️ RENDERIZAÇÃO DINÂMICA DOS SUB-FILTROS */}
            <div className="resultados-consulta-wrapper">
                {fonteDados === 'visitas' && <FiltroTabelaVisitas />}
                {fonteDados === 'resumos' && <FiltroTabelaResumos />}
                {fonteDados === 'ovitrampas' && <FiltroTabelaOvitrampas />}
                {fonteDados === 'pe' && <FiltroTabelaPE />}
                {fonteDados === 'bloqueio' && <FiltroTabelaBloqueio />}
                {fonteDados === 'mutirao' && <FiltroTabelaMutirao />}
                {fonteDados === 'constituicao' && <FiltroTabelaConstituicao />}
            </div>
        </div>
    );
}