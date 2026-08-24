import React, { useState, useEffect } from 'react';
import api from '../../../core/api';

export default function TabelaResumoPNCD() {
  const [tipoAtividade, setTipoAtividade] = useState('ROTINA'); // 'ROTINA' ou 'PE'
  const [regional, setRegional] = useState('Norte');
  const [ano, setAno] = useState(2026);
  const [semana, setSemana] = useState('02');
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [baixando, setBaixando] = useState(false);

  // 🔄 Busca dinâmica conforme o tipo de atividade selecionado
  const carregarDados = async () => {
    setCarregando(true);
    const endpoint = tipoAtividade === 'ROTINA'
      ? '/relatorios/resumo-semanal/dados'
      : '/relatorios/resumo-pe/dados';

    try {
      const response = await api.get(endpoint, {
        params: { regional, ano, semana }
      });
      setDados(response.data || []);
    } catch (error) {
      console.error('Erro ao buscar dados do relatório:', error);
      setDados([]);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [tipoAtividade, regional, ano, semana]);

  // 📥 Download dinâmico da planilha (.xls)
  const handleBaixarExcel = async () => {
    setBaixando(true);
    const endpoint = tipoAtividade === 'ROTINA'
      ? '/relatorios/resumo-semanal/exportar-excel'
      : '/relatorios/resumo-pe/exportar-excel';

    const prefixoArquivo = tipoAtividade === 'ROTINA' ? 'Resumo_Semanal' : 'Resumo_PE';

    try {
      const response = await api.get(endpoint, {
        params: { regional, ano },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${prefixoArquivo}_${regional.toUpperCase()}_${ano}.xls`);
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

  // --- CÁLCULO DE KPIS DINÂMICOS ---
  // Rotina
  const totalImoveisRotina = dados.reduce((acc, item) => acc + (item.totalImoveis || 0), 0);
  const totalFocosRotina = dados.reduce((acc, item) => acc + (item.focos || 0), 0);
  const totalDepositosRotina = dados.reduce((acc, item) => acc + (item.totalDepositos || 0), 0);
  const totalLarvicidaRotina = dados.reduce((acc, item) => acc + (item.larvicidaGramas || 0), 0);

  // P.E.
  const totalPeTrabalhados = dados.reduce((acc, item) => acc + (item.pontosEstrategicos || 0), 0);
  const totalImoveisPositivosPe = dados.reduce((acc, item) => acc + (item.imoveisPositivos || 0), 0);
  const totalTubosPe = dados.reduce((acc, item) => acc + (item.tubos || 0), 0);
  const totalDepositosPositivosPe = dados.reduce((acc, item) => acc + (item.totalPositivos || 0), 0);
  const totalEliminadosPe = dados.reduce((acc, item) => acc + (item.depositosEliminados || 0), 0);
  const totalLarvicidaPe = dados.reduce((acc, item) => acc + (item.larvicidaGramas || 0), 0);

  return (
    <div style={{ padding: '20px', fontFamily: '"rawline", sans-serif', width: '100%' }}>
      
      {/* Cabeçalho */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#1351B4', margin: 0, fontWeight: 700 }}>
          <i className="fas fa-table mr-2"></i> Relatório Consolidado — PNCD
        </h2>
        <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0 0' }}>
          Acompanhamento dos boletins de campo consolidados por semana epidemiológica
        </p>
      </div>

      {/* Barra de Filtros com Seletor de Atividade */}
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
          
          {/* SELETOR DE ATIVIDADE */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', color: '#1351B4', marginBottom: '4px' }}>
              ATIVIDADE
            </label>
            <select
              value={tipoAtividade}
              onChange={(e) => setTipoAtividade(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '6px', border: '2px solid #1351B4', fontSize: '14px', fontWeight: 'bold', color: '#1351B4', background: '#f0f7ff' }}
            >
              <option value="ROTINA">Rotina Domiciliar</option>
              <option value="PE">Pontos Estratégicos (P.E.)</option>
            </select>
          </div>

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
            background: tipoAtividade === 'ROTINA' ? '#1351B4' : '#0d9488',
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
          {baixando ? 'Gerando Planilha...' : `Baixar Planilha ${tipoAtividade === 'ROTINA' ? 'Rotina' : 'P.E.'} (.xls)`}
        </button>
      </div>

      {/* Cartões de Indicadores (KPIs) Adaptáveis */}
      {tipoAtividade === 'ROTINA' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div style={{ background: '#ffffff', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #1351B4', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>IMÓVEIS TRABALHADOS</span>
            <h3 style={{ margin: '8px 0 0', fontSize: '24px', color: '#0f172a' }}>{totalImoveisRotina}</h3>
          </div>
          <div style={{ background: '#ffffff', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #dc2626', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>FOCOS DETECTADOS</span>
            <h3 style={{ margin: '8px 0 0', fontSize: '24px', color: '#dc2626' }}>{totalFocosRotina}</h3>
          </div>
          <div style={{ background: '#ffffff', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #d97706', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>DEPÓSITOS INSPECIONADOS</span>
            <h3 style={{ margin: '8px 0 0', fontSize: '24px', color: '#0f172a' }}>{totalDepositosRotina}</h3>
          </div>
          <div style={{ background: '#ffffff', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #7c3aed', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>LARVICIDA (BTI)</span>
            <h3 style={{ margin: '8px 0 0', fontSize: '24px', color: '#0f172a' }}>{totalLarvicidaRotina.toFixed(1)} g</h3>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div style={{ background: '#ffffff', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #0d9488', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>P.E. INSPECIONADOS</span>
            <h3 style={{ margin: '8px 0 0', fontSize: '24px', color: '#0f172a' }}>{totalPeTrabalhados}</h3>
          </div>
          <div style={{ background: '#ffffff', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #dc2626', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>IMÓVEIS POSITIVOS</span>
            <h3 style={{ margin: '8px 0 0', fontSize: '24px', color: '#dc2626' }}>{totalImoveisPositivosPe}</h3>
          </div>
          <div style={{ background: '#ffffff', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>TUBOS / AMOSTRAS</span>
            <h3 style={{ margin: '8px 0 0', fontSize: '24px', color: '#0f172a' }}>{totalTubosPe}</h3>
          </div>
          <div style={{ background: '#ffffff', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #f97316', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>DEP. POSITIVOS</span>
            <h3 style={{ margin: '8px 0 0', fontSize: '24px', color: '#0f172a' }}>{totalDepositosPositivosPe}</h3>
          </div>
          <div style={{ background: '#ffffff', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #16a34a', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>DEP. ELIMINADOS</span>
            <h3 style={{ margin: '8px 0 0', fontSize: '24px', color: '#16a34a' }}>{totalEliminadosPe}</h3>
          </div>
          <div style={{ background: '#ffffff', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #7c3aed', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>LARVICIDA (BTI)</span>
            <h3 style={{ margin: '8px 0 0', fontSize: '24px', color: '#0f172a' }}>{totalLarvicidaPe.toFixed(1)} g</h3>
          </div>
        </div>
      )}

      {/* Grade Tabular Formatada */}
      <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', overflowX: 'auto', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        {tipoAtividade === 'ROTINA' ? (
          /* TABELA DE ROTINA */
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
                    Nenhum registro de Rotina para a <strong>Regional {regional}</strong> na <strong>Semana {semana}</strong>.
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
        ) : (
          /* TABELA DE PONTOS ESTRATÉGICOS (P.E.) */
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'center', minWidth: '1100px' }}>
            <thead>
              <tr style={{ background: '#f0fdfa', color: '#134e4a', borderBottom: '2px solid #99f6e4' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Bairro</th>
                <th>Quart. Trab.</th>
                <th>PE Inspec.</th>
                <th style={{ color: '#dc2626' }}>Recus.</th>
                <th style={{ color: '#dc2626' }}>Fech.</th>
                <th style={{ color: '#2563eb' }}>Tubos</th>
                <th style={{ color: '#dc2626' }}>Imóv. Pos.</th>
                <th style={{ background: '#e6fffa' }}>A2+</th>
                <th style={{ background: '#e6fffa' }}>B+</th>
                <th style={{ background: '#e6fffa' }}>C+</th>
                <th style={{ background: '#e6fffa' }}>D1+</th>
                <th style={{ background: '#e6fffa' }}>D2+</th>
                <th style={{ background: '#e6fffa' }}>E+</th>
                <th style={{ fontWeight: 'bold', color: '#dc2626' }}>Total Pos.</th>
                <th>IIP (%)</th>
                <th>IB</th>
                <th>Dep. Insp.</th>
                <th style={{ color: '#16a34a' }}>Dep. Elim.</th>
                <th>Dep. Trat.</th>
                <th>Imóv. Trat.</th>
                <th>Larvicida (g)</th>
              </tr>
            </thead>
            <tbody>
              {carregando ? (
                <tr>
                  <td colSpan="21" style={{ padding: '30px', color: '#64748b' }}>
                    <i className="fas fa-spinner fa-spin mr-2"></i> Carregando dados quinzenais de PE da semana {semana}...
                  </td>
                </tr>
              ) : dados.length === 0 ? (
                <tr>
                  <td colSpan="21" style={{ padding: '30px', color: '#64748b' }}>
                    Nenhum registro de Ponto Estratégico para a <strong>Regional {regional}</strong> na <strong>Semana {semana}</strong>.
                  </td>
                </tr>
              ) : (
                dados.map((linha, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                    <td style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 'bold', color: '#1e293b' }}>{linha.bairro}</td>
                    <td>{linha.quarteiroesTrabalhados}</td>
                    <td style={{ fontWeight: 'bold', color: '#0d9488' }}>{linha.pontosEstrategicos}</td>
                    <td style={{ color: '#dc2626' }}>{linha.recusados}</td>
                    <td style={{ color: '#dc2626' }}>{linha.fechados}</td>
                    <td style={{ fontWeight: 'bold', color: '#2563eb' }}>{linha.tubos}</td>
                    <td style={{ fontWeight: 'bold', color: linha.imoveisPositivos > 0 ? '#dc2626' : '#64748b' }}>{linha.imoveisPositivos}</td>
                    <td>{linha.a2Positivos}</td>
                    <td>{linha.bPositivos}</td>
                    <td>{linha.cPositivos}</td>
                    <td>{linha.d1Positivos}</td>
                    <td>{linha.d2Positivos}</td>
                    <td>{linha.ePositivos}</td>
                    <td style={{ fontWeight: 'bold', color: linha.totalPositivos > 0 ? '#dc2626' : '#64748b' }}>{linha.totalPositivos}</td>
                    <td>{linha.indicePredial ? linha.indicePredial.toFixed(1) : '0.0'}%</td>
                    <td>{linha.indiceBreteau ? linha.indiceBreteau.toFixed(1) : '0.0'}</td>
                    <td>{linha.depositosInspecionados}</td>
                    <td style={{ color: '#16a34a', fontWeight: 'bold' }}>{linha.depositosEliminados}</td>
                    <td>{linha.depositosTratados}</td>
                    <td>{linha.imoveisTratados}</td>
                    <td>{linha.larvicidaGramas ? linha.larvicidaGramas.toFixed(1) : '0.0'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}