import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import api from '../../../core/api';
import './MonitorTemperatura.css';

export default function MonitorTemperatura({ setAbaAtiva, setTelaAtual }) {
  // Estados - Tempo Real
  const [leituraAtual, setLeituraAtual] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroConexao, setErroConexao] = useState(false);
  const [filtroTabela, setFiltroTabela] = useState('TODOS'); 

  // Estados - Consolidado e Navegação de Abas
  const [abaView, setAbaView] = useState('TEMPO_REAL'); // 'TEMPO_REAL' ou 'CONSOLIDADO'
  const [historicoConsolidado, setHistoricoConsolidado] = useState([]);
  const [carregandoConsolidado, setCarregandoConsolidado] = useState(false);

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // 1. Busca dos dados em tempo real
  const carregarTelemetria = async () => {
    try {
      setCarregando(true);
      setErroConexao(false);
      const [resAtual, resHist] = await Promise.all([
        api.get('/telemetria/atual?deviceId=GELADEIRA_VACINAS_01'),
        api.get('/telemetria/historico')
      ]);

      if (resAtual.status === 200 && resAtual.data) setLeituraAtual(resAtual.data);
      if (resHist.status === 200 && Array.isArray(resHist.data)) setHistorico(resHist.data);
    } catch (error) {
      console.error('Erro ao consultar telemetria da geladeira:', error);
      setErroConexao(true);
    } finally {
      setCarregando(false);
    }
  };

  // 2. Busca dos dados consolidados (Somente quando a aba for ativada)
  const buscarConsolidado = async () => {
    try {
      setCarregandoConsolidado(true);
      const res = await api.get('/telemetria/historico-consolidado');
      if (res.status === 200) {
        setHistoricoConsolidado(res.data);
      }
    } catch (error) {
      console.error('Erro ao buscar dados consolidados:', error);
    } finally {
      setCarregandoConsolidado(false);
    }
  };

  // Polling de tempo real
  useEffect(() => {
    if (abaView === 'TEMPO_REAL') {
      carregarTelemetria();
      const timer = setInterval(carregarTelemetria, 10000);
      return () => clearInterval(timer);
    }
  }, [abaView]);

  // Buscar consolidado ao trocar de aba
  useEffect(() => {
    if (abaView === 'CONSOLIDADO') {
      buscarConsolidado();
    }
  }, [abaView]);

  // Gráfico Chart.js
  useEffect(() => {
    if (abaView !== 'TEMPO_REAL' || !chartRef.current || historico.length === 0) return;

    const dadosOrdenados = [...historico].reverse();
    const labels = dadosOrdenados.map((item) => item.dataHora ? new Date(item.dataHora).toLocaleTimeString('pt-BR') : '');
    const temperaturas = dadosOrdenados.map((item) => item.temperatura);
    const coresPontos = temperaturas.map((val) => val >= 2.0 && val <= 8.0 ? '#16a34a' : '#dc2626');

    if (chartInstanceRef.current) {
      chartInstanceRef.current.data.labels = labels;
      chartInstanceRef.current.data.datasets[0].data = temperaturas;
      chartInstanceRef.current.data.datasets[0].pointBackgroundColor = coresPontos;
      chartInstanceRef.current.update();
      return;
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Temperatura (°C)',
          data: temperaturas,
          borderColor: '#1351b4',
          backgroundColor: 'rgba(19, 81, 180, 0.08)',
          borderWidth: 2.5,
          fill: true,
          tension: 0.35,
          pointRadius: 4.5,
          pointHoverRadius: 7,
          pointBackgroundColor: coresPontos,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 1.5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            suggestedMin: 0, suggestedMax: 10,
            ticks: { callback: (val) => `${val.toFixed(1)} °C`, stepSize: 2 },
            grid: {
              color: (ctx) => (ctx.tick.value === 2 || ctx.tick.value === 8) ? 'rgba(22, 163, 74, 0.45)' : 'rgba(0, 0, 0, 0.06)',
              lineWidth: (ctx) => (ctx.tick.value === 2 || ctx.tick.value === 8) ? 2 : 1
            }
          },
          x: { grid: { display: false }, ticks: { autoSkip: true, maxTicksLimit: 10, maxRotation: 45 } }
        },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => `Temperatura: ${ctx.parsed.y.toFixed(2)} °C` } } }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [historico, abaView]);

  const handleVoltar = () => {
    if (setAbaAtiva) setAbaAtiva('inicio');
    else if (setTelaAtual) setTelaAtual('campo_menu');
  };

  const temp = leituraAtual?.temperatura;
  const isForaDaFaixa = temp !== undefined && (temp < 2.0 || temp > 8.0);

  const historicoFiltrado = historico.filter((item) => {
    const fora = item.temperatura < 2.0 || item.temperatura > 8.0;
    if (filtroTabela === 'CRITICOS') return fora;
    if (filtroTabela === 'NORMAIS') return !fora;
    return true;
  });

  return (
    <div className="br-container-lg p-0 fundo-claro-gov">
      <button className="br-button secondary mb-3" type="button" onClick={handleVoltar}>
        <i className="fas fa-arrow-left mr-1"></i> Voltar ao Início
      </button>

      {/* CABEÇALHO DO SETOR COM OS BOTÕES DE ABA CORRIGIDOS */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 p-3 bg-white border rounded shadow-sm">
        <div>
          <h1 className="text-up-02 text-weight-bold text-primary-default mb-1">
            <i className="fas fa-snowflake text-info mr-2"></i> Setor de Epizootias — Cadeia de Frio
          </h1>
          <p className="text-down-01 text-secondary-07 mb-0">
            Monitoramento térmico automatizado da conservação de <strong>Vacinas Antirrábicas</strong> (UVZ Cuiabá)
          </p>
        </div>
        
        {/* BOTÕES DE NAVEGAÇÃO DE ABAS PADRÃO GOV.BR */}
        <div className="mt-3 mt-md-0 d-flex space-x-2">
          <button 
            className={`br-button small ${abaView === 'TEMPO_REAL' ? 'primary' : 'secondary'}`} 
            type="button" 
            onClick={() => setAbaView('TEMPO_REAL')}
          >
            <i className="fas fa-bolt mr-1"></i> Tempo Real
          </button>
          
          <button 
            className={`br-button small ml-2 ${abaView === 'CONSOLIDADO' ? 'primary' : 'secondary'}`} 
            type="button" 
            onClick={() => setAbaView('CONSOLIDADO')}
          >
            <i className="fas fa-calendar-check mr-1"></i> Histórico Consolidado
          </button>
        </div>
      </div>

      {erroConexao && (
        <div className="br-message is-danger mb-4">
          <div className="icon"><i className="fas fa-times-circle fa-lg"></i></div>
          <div className="content">
            <span className="message-title">Falha de Conexão:</span>
            <span className="message-body"> Não foi possível se comunicar com o backend do sistema.</span>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ABA: TEMPO REAL E HISTÓRICO RECENTE                         */}
      {/* ========================================================= */}
      {abaView === 'TEMPO_REAL' && (
        <>
          {/* PAINEL EM TEMPO REAL */}
          <div className={`br-card p-4 mb-4 card-termometro ${isForaDaFaixa ? 'alerta-critico' : 'status-seguro'}`}>
            <div className="row align-items-center">
              <div className="col-12 col-md-7 mb-3 mb-md-0">
                <span className="text-uppercase text-weight-bold text-secondary-07 text-down-01 d-block mb-1">
                  Sensor DS18B20 — Leitura Instantânea
                </span>
                <div className={`display-temperatura ${isForaDaFaixa ? 'text-temp-perigo' : 'text-temp-segura'}`}>
                  {temp !== undefined ? `${temp.toFixed(1)} °C` : '-- °C'}
                </div>
                <div className="mt-2 text-down-01 text-secondary-08">
                  Faixa Normativa do Ministério da Saúde: <strong>+2,0 °C a +8,0 °C</strong>
                </div>
              </div>
              <div className="col-12 col-md-5 text-md-right">
                <div className="mb-3">
                  {isForaDaFaixa ? (
                    <span className="tag-temperatura critico"><i className="fas fa-exclamation-triangle"></i> RISCO TÉRMICO</span>
                  ) : (
                    <span className="tag-temperatura seguro"><i className="fas fa-check-circle"></i> CONSERVAÇÃO IDEAL</span>
                  )}
                </div>
                <div className="text-down-02 text-secondary-07">
                  <div>Identificador: <strong>{leituraAtual?.deviceId || 'GELADEIRA_VACINAS_01'}</strong></div>
                  <div>Status do Sensor: <strong>{leituraAtual?.sensorStatus || 'OPERACIONAL'}</strong></div>
                  <div>Último: <strong>{leituraAtual?.dataHora ? new Date(leituraAtual.dataHora).toLocaleTimeString('pt-BR') : '--:--:--'}</strong></div>
                </div>
              </div>
            </div>
          </div>

          {/* GRÁFICO */}
          <div className="br-card p-4 mb-4 bg-white border rounded shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
              <div className="text-weight-bold text-primary-default text-up-01">
                <i className="fas fa-chart-line text-info mr-2"></i> Evolução Térmica — Histórico Recente
              </div>
            </div>
            <div style={{ position: 'relative', height: '280px', width: '100%' }}>
              <canvas ref={chartRef}></canvas>
            </div>
          </div>

          {/* TABELA TEMPO REAL */}
          <div className="br-card p-3 bg-white border rounded shadow-sm">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 border-bottom pb-2">
              <div className="text-weight-bold text-primary-default text-up-01 mb-2 mb-md-0">
                <i className="fas fa-list-ol mr-2"></i> Últimas 50 Medições
              </div>
              <div className="d-flex align-items-center space-x-2">
                <span className="text-down-02 text-secondary-06 mr-2 font-weight-bold">Filtro:</span>
                <select className="form-control form-control-sm" value={filtroTabela} onChange={(e) => setFiltroTabela(e.target.value)}>
                  <option value="TODOS">Todas</option>
                  <option value="CRITICOS">Fora do Limite</option>
                  <option value="NORMAIS">Normais</option>
                </select>
              </div>
            </div>

            <div className="table-responsive" style={{ maxHeight: '420px', overflowY: 'auto' }}>
              <table className="table table-sm table-hover">
                <thead>
                  <tr><th>Data / Hora</th><th>Temperatura</th><th>Faixa Térmica</th><th>Estado</th></tr>
                </thead>
                <tbody>
                  {historicoFiltrado.map((item) => {
                    const fora = item.temperatura < 2.0 || item.temperatura > 8.0;
                    return (
                      <tr key={item.id} style={{ backgroundColor: fora ? '#fff5f5' : 'transparent' }}>
                        <td>{new Date(item.dataHora).toLocaleString('pt-BR')}</td>
                        <td className={`font-weight-bold ${fora ? 'text-danger' : 'text-success'}`}>{item.temperatura.toFixed(2)} °C</td>
                        <td>{fora ? <span className="badge bg-danger">Fora do Limite</span> : <span className="badge bg-success">Ideal</span>}</td>
                        <td>{item.sensorStatus}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* ABA: HISTÓRICO CONSOLIDADO (LONGO PRAZO)                    */}
      {/* ========================================================= */}
      {abaView === 'CONSOLIDADO' && (
        <div className="br-card p-4 bg-white border rounded shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
            <div>
              <h2 className="text-up-01 text-weight-bold text-primary-default mb-1">
                <i className="fas fa-database text-info mr-2"></i> Relatório de Auditoria de Longo Prazo
              </h2>
              <span className="text-down-01 text-secondary-06">
                Resumo diário contendo os picos térmicos da geladeira (Armazenamento permanente e otimizado).
              </span>
            </div>
            <button className="br-button secondary small" type="button" onClick={buscarConsolidado} disabled={carregandoConsolidado}>
              <i className={`fas fa-sync-alt mr-1 ${carregandoConsolidado ? 'fa-spin' : ''}`}></i> Atualizar
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-hover text-center align-middle">
              <thead className="bg-light">
                <tr>
                  <th>Data de Referência</th>
                  <th>Pico Máximo</th>
                  <th>Pico Mínimo</th>
                  <th>Classificação do Dia</th>
                </tr>
              </thead>
              <tbody>
                {historicoConsolidado.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-4 text-secondary-06">
                      {carregandoConsolidado ? "Carregando dados..." : "Nenhum histórico consolidado gerado ainda (a rotina rodará na próxima madrugada)."}
                    </td>
                  </tr>
                ) : (
                  historicoConsolidado.map((item) => (
                    <tr key={item.id}>
                      <td className="font-weight-bold">
                        {new Date(item.dataReferencia + 'T12:00:00').toLocaleDateString('pt-BR')}
                      </td>
                      <td className={item.tempMax > 8.0 ? 'text-danger font-weight-bold' : 'text-secondary-07'}>
                        {item.tempMax.toFixed(2)} °C
                      </td>
                      <td className={item.tempMin < 2.0 ? 'text-danger font-weight-bold' : 'text-secondary-07'}>
                        {item.tempMin.toFixed(2)} °C
                      </td>
                      <td>
                        {item.statusDia === 'CRITICO' ? (
                          <span className="badge bg-danger py-1 px-3" style={{ fontSize: '13px' }}>
                            <i className="fas fa-exclamation-triangle mr-1"></i> CRÍTICO
                          </span>
                        ) : (
                          <span className="badge bg-success py-1 px-3" style={{ fontSize: '13px' }}>
                            <i className="fas fa-check-circle mr-1"></i> NORMAL
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}