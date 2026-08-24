import React, { useState, useEffect } from 'react';
import api from '../../../core/api';

export default function TabelaResumoPNCD() {
  const [regional, setRegional] = useState('Norte');
  const [ano, setAno] = useState(2026);
  const [semana, setSemana] = useState('01');
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [baixando, setBaixando] = useState(false);

  // Busca os dados agrupados no backend
  const carregarDados = async () => {
    setCarregando(true);
    try {
      const response = await api.get('/relatorios/resumo-semanal/dados', {
        params: { regional, ano, semana }
      });
      setDados(response.data || []);
    } catch (error) {
      console.error('Erro ao buscar dados do resumo semanal:', error);
      setDados([]);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [regional, ano, semana]);

  // Download do arquivo .xls oficial
  const handleBaixarExcel = async () => {
    setBaixando(true);
    try {
      const response = await api.get('/relatorios/resumo-semanal/exportar-excel', {
        params: { regional, ano },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Resumo_Semanal_${regional.toUpperCase()}_${ano}.xls`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erro ao baixar planilha:', error);
      alert('Erro ao gerar a planilha Excel no servidor.');
    } finally {
      setBaixando(false);
    }
  };

  // Cálculo dos totais para os cartões de topo
  const totalImoveis = dados.reduce((acc, item) => acc + (item.totalImoveis || 0), 0);
  const totalFocos = dados.reduce((acc, item) => acc + (item.focos || 0), 0);
  const totalDepositos = dados.reduce((acc, item) => acc + (item.totalDepositos || 0), 0);
  const totalLarvicida = dados.reduce((acc, item) => acc + (item.larvicidaGramas || 0), 0);

  return (
    <div style={{ padding: '20px', fontFamily: '"rawline", sans-serif', width: '100%' }}>
      
      {/* Cabeçalho da Seção */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#1351B4', margin: 0, fontWeight: 700 }}>
          <i className="fas fa-table mr-2"></i> Relatório Consolidado — PNCD
        </h2>
        <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0 0' }}>
          Visualização em grade dos boletins de campo consolidados por semana epidemiológica
        </p>
      </div>

      {/* Barra de Filtros e Ação de Exportação */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#ffffff',
        padding: '16px 20px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', color: '#475569', marginBottom: '4px' }}>
              REGIONAL
            </label>
            <select
              value={regional}
              onChange={(e) => setRegional(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
            >
              <option value="Norte">Norte</option>
              <option value="Sul">Sul</option>
              <option value="Leste">Leste</option>
              <option value="Oeste">Oeste</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', color: '#475569', marginBottom: '4px' }}>
              SEMANA EPIDEMIOLÓGICA
            </label>
            <select
              value={semana}
              onChange={(e) => setSemana(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
            >
              {Array.from({ length: 52 }, (_, i) => String(i + 1).padStart(2, '0')).map((sem) => (
                <option key={sem} value={sem}>Semana {sem}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', color: '#475569', marginBottom: '4px' }}>
              ANO
            </label>
            <input
              type="number"
              value={ano}
              onChange={(e) => setAno(Number(e.target.value))}
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '90px', fontSize: '14px' }}
            />
          </div>
        </div>

        <button
          onClick={handleBaixarExcel}
          disabled={baixando}
          style={{
            background: '#1351B4',
            color: '#ffffff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '100px',
            fontWeight: 700,
            fontSize: '14px',
            cursor: baixando ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'background 0.2s'
          }}
        >
          <i className={baixando ? "fas fa-spinner fa-spin" : "fas fa-file-excel"}></i>
          {baixando ? 'Gerando Planilha...' : 'Baixar Planilha PNCD (.xls)'}
        </button>
      </div>

      {/* Cartões de Indicadores (KPIs) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div style={{ background: '#ffffff', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #1351B4', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>IMÓVEIS TRABALHADOS</span>
          <h3 style={{ margin: '8px 0 0', fontSize: '24px', color: '#0f172a' }}>{totalImoveis}</h3>
        </div>
        <div style={{ background: '#ffffff', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #dc2626', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>FOCOS DETECTADOS</span>
          <h3 style={{ margin: '8px 0 0', fontSize: '24px', color: '#dc2626' }}>{totalFocos}</h3>
        </div>
        <div style={{ background: '#ffffff', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #d97706', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>DEPÓSITOS INSPECIONADOS</span>
          <h3 style={{ margin: '8px 0 0', fontSize: '24px', color: '#0f172a' }}>{totalDepositos}</h3>
        </div>
        <div style={{ background: '#ffffff', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #7c3aed', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>LARVICIDA (BTI)</span>
          <h3 style={{ margin: '8px 0 0', fontSize: '24px', color: '#0f172a' }}>{totalLarvicida.toFixed(1)} g</h3>
        </div>
      </div>

      {/* Grade Tabular Formatada */}
      <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', overflowX: 'auto', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'center', minWidth: '950px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', color: '#1e293b', borderBottom: '2px solid #cbd5e1' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Bairro</th>
              <th>Quart. Trab.</th>
              <th>Residências</th>
              <th>Comércios</th>
              <th>Terrenos</th>
              <th>PE</th>
              <th>Total Imóveis</th>
              <th style={{ color: '#dc2626' }}>Fechados</th>
              <th style={{ color: '#dc2626' }}>Recusados</th>
              <th style={{ background: '#f1f5f9' }}>A2</th>
              <th style={{ background: '#f1f5f9' }}>B</th>
              <th style={{ background: '#f1f5f9' }}>C</th>
              <th style={{ background: '#f1f5f9' }}>D1</th>
              <th style={{ background: '#f1f5f9' }}>D2</th>
              <th style={{ background: '#f1f5f9' }}>E</th>
              <th>Focos</th>
              <th>Tratados</th>
              <th>Larvicida (g)</th>
            </tr>
          </thead>
          <tbody>
            {carregando ? (
              <tr>
                <td colSpan="18" style={{ padding: '30px', color: '#64748b' }}>
                  <i className="fas fa-spinner fa-spin mr-2"></i> Carregando dados da semana {semana}...
                </td>
              </tr>
            ) : dados.length === 0 ? (
              <tr>
                <td colSpan="18" style={{ padding: '30px', color: '#64748b' }}>
                  Nenhum registro de visita encontrado para a <strong>Regional {regional}</strong> na <strong>Semana {semana}</strong>.
                </td>
              </tr>
            ) : (
              dados.map((linha, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                  <td style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 'bold', color: '#1e293b' }}>{linha.bairro}</td>
                  <td>{linha.quarteiroesTrabalhados}</td>
                  <td>{linha.totalResidencias}</td>
                  <td>{linha.comercios}</td>
                  <td>{linha.terrenos}</td>
                  <td>{linha.pontosEstrategicos}</td>
                  <td style={{ fontWeight: 'bold', color: '#1351B4' }}>{linha.totalImoveis}</td>
                  <td style={{ color: '#dc2626' }}>{linha.fechados}</td>
                  <td style={{ color: '#dc2626' }}>{linha.recusados}</td>
                  <td>{linha.a2}</td>
                  <td>{linha.b}</td>
                  <td>{linha.c}</td>
                  <td>{linha.d1}</td>
                  <td>{linha.d2}</td>
                  <td>{linha.e}</td>
                  <td style={{ fontWeight: 'bold', color: linha.focos > 0 ? '#dc2626' : '#64748b' }}>{linha.focos}</td>
                  <td>{linha.imoveisTratados}</td>
                  <td>{linha.larvicidaGramas ? linha.larvicidaGramas.toFixed(1) : '0.0'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}