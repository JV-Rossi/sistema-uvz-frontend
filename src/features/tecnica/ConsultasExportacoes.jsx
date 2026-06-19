import React, { useState } from 'react';
import FiltroTabelaVisitas from './FiltroTabelaVisitas';
import FiltroTabelaResumos from './FiltroTabelaResumos';
import FiltroTabelaOvitrampas from './FiltroTabelaOvitrampas';
import FiltroTabelaPE from './FiltroTabelaPE';
import FiltroTabelaBloqueio from './FiltroTabelaBloqueio';
import FiltroTabelaConstituicao from './FiltroTabelaConstituicao';
import FiltroTabelaMutirao from './FiltroTabelaMutirao';
import './ConsultasExportacoes.css';

export default function ConsultasExportacoes() {
    const [fonteDados, setFonteDados] = useState('visitas');

    return (
        <div className="modulo-card consultas-container">
            <div className="selecao-base-dados" style={{ backgroundColor: '#1a1a1e', padding: '15px', borderRadius: '8px', border: '1px solid #2a2a30', marginBottom: '10px' }}>
                <label style={{ color: '#aeaebe', fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                    1. Selecione a Base de Dados para Consulta e Extração:
                </label>
                <select 
                    value={fonteDados} 
                    onChange={(e) => setFonteDados(e.target.value)}
                    style={{ width: '100%', padding: '10px', backgroundColor: '#222226', color: '#fff', border: '1px solid #007bff', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    <option value="visitas">📍 Base de Imóveis e Visitas de Rotina (ACE)</option>
                    <option value="resumos">📊 Base de Resumos Semanais (Lotes Fechados)</option>
                    <option value="ovitrampas">🦟 Base de Ovitrampas (Instalação e Laboratório)</option>
                    <option value="pe">🏢 Pontos Estratégicos (PE - Borracharias, Cemitérios...)</option>
                    <option value="bloqueio">🚫 Bloqueio de Foco / Casos Notificados</option>
                    <option value="mutirao">🚛 Mutirão de Limpeza</option>
                    <option value="constituicao">📋 Constituição (Pesquisa Especial)</option>
                </select>
            </div>

            {/* RENDERIZAÇÃO DINÂMICA (ROTEAMENTO) */}
            {fonteDados === 'visitas' && <FiltroTabelaVisitas />}
            {fonteDados === 'resumos' && <FiltroTabelaResumos />}
            {fonteDados === 'ovitrampas' && <FiltroTabelaOvitrampas />}
            {fonteDados === 'pe' && <FiltroTabelaPE />}
            {fonteDados === 'bloqueio' && <FiltroTabelaBloqueio />}
            {fonteDados === 'mutirao' && <FiltroTabelaMutirao />}
            {fonteDados === 'constituicao' && <FiltroTabelaConstituicao />}
        </div>
    );
}