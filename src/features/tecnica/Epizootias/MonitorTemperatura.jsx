import React, { useState, useEffect } from 'react';
import api from '../../../core/api';
import './MonitorTemperatura.css';

export default function MonitorTemperatura({ setAbaAtiva, setTelaAtual }) {
  const [leituraAtual, setLeituraAtual] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroConexao, setErroConexao] = useState(false);

  const carregarTelemetria = async () => {
    try {
      setCarregando(true);
      setErroConexao(false);

      const [resAtual, resHist] = await Promise.all([
        api.get('/telemetria/atual?deviceId=GELADEIRA_VACINAS_01'),
        api.get('/telemetria/historico')
      ]);

      if (resAtual.status === 200 && resAtual.data) {
        setLeituraAtual(resAtual.data);
      }
      if (resHist.status === 200 && Array.isArray(resHist.data)) {
        setHistorico(resHist.data);
      }
    } catch (error) {
      console.error('Erro ao consultar telemetria da geladeira:', error);
      setErroConexao(true);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarTelemetria();
    const timer = setInterval(carregarTelemetria, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleVoltar = () => {
    if (setAbaAtiva) {
      setAbaAtiva('inicio');
    } else if (setTelaAtual) {
      setTelaAtual('campo_menu');
    }
  };

  const temp = leituraAtual?.temperatura;
  const isForaDaFaixa = temp !== undefined && (temp < 2.0 || temp > 8.0);

  return (
    <div className="br-container-lg p-0 fundo-claro-gov">
      
      {/* NAVEGAÇÃO SUPERIOR */}
      <button 
        className="br-button secondary mb-3" 
        type="button" 
        onClick={handleVoltar}
      >
        <i className="fas fa-arrow-left mr-1"></i> Voltar ao Início
      </button>

      {/* CABEÇALHO DO SETOR */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 p-3 bg-white border rounded shadow-sm">
        <div>
          <h1 className="text-up-02 text-weight-bold text-primary-default mb-1">
            <i className="fas fa-snowflake text-info mr-2"></i> Setor de Epizootias — Cadeia de Frio
          </h1>
          <p className="text-down-01 text-secondary-07 mb-0">
            Monitoramento térmico automatizado da conservação de <strong>Vacinas Antirrábicas</strong> (UVZ Cuiabá)
          </p>
        </div>
        <button 
          className="br-button primary small mt-2 mt-md-0" 
          type="button" 
          onClick={carregarTelemetria}
          disabled={carregando}
        >
          <i className={`fas fa-sync-alt mr-1 ${carregando ? 'fa-spin' : ''}`}></i> Atualizar Agora
        </button>
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
                <span className="tag-temperatura critico">
                  <i className="fas fa-exclamation-triangle"></i> RISCO TÉRMICO (ALERTA DISPARADO)
                </span>
              ) : (
                <span className="tag-temperatura seguro">
                  <i className="fas fa-check-circle"></i> CONSERVAÇÃO IDEAL
                </span>
              )}
            </div>

            <div className="text-down-02 text-secondary-07">
              <div>Identificador: <strong>{leituraAtual?.deviceId || 'GELADEIRA_VACINAS_01'}</strong></div>
              <div>Status do Sensor: <strong>{leituraAtual?.sensorStatus || 'OPERACIONAL'}</strong></div>
              <div>Último Registro: <strong>{leituraAtual?.dataHora ? new Date(leituraAtual.dataHora).toLocaleTimeString('pt-BR') : '--:--:--'}</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* HISTÓRICO DE AUDITORIA SANITÁRIA */}
      <div className="br-card p-3 bg-white border rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
          <div className="text-weight-bold text-primary-default text-up-01">
            <i className="fas fa-clipboard-list mr-2"></i> Registro Contínuo de Amostras
          </div>
          <span className="text-down-02 text-secondary-06">Últimas 50 medições</span>
        </div>

        <div className="table-responsive" style={{ maxHeight: '420px', overflowY: 'auto' }}>
          <table className="tabela-historico-temp">
            <thead>
              <tr>
                <th>Data / Hora</th>
                <th>Temperatura</th>
                <th>Faixa Térmica</th>
                <th>Estado do Sensor</th>
                <th>WhatsApp API</th>
              </tr>
            </thead>
            <tbody>
              {historico.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-secondary-06">
                    Nenhuma medição registrada no banco de dados.
                  </td>
                </tr>
              ) : (
                historico.map((item) => {
                  const fora = item.temperatura < 2.0 || item.temperatura > 8.0;
                  return (
                    <tr key={item.id} style={{ backgroundColor: fora ? '#fff5f5' : 'transparent' }}>
                      <td>{new Date(item.dataHora).toLocaleString('pt-BR')}</td>
                      <td className={`font-weight-bold ${fora ? 'text-danger' : 'text-success'}`}>
                        {item.temperatura.toFixed(2)} °C
                      </td>
                      <td>
                        {fora ? (
                          <span className="badge bg-danger text-white">Fora do Limite</span>
                        ) : (
                          <span className="badge bg-success text-white">Ideal (2°C a 8°C)</span>
                        )}
                      </td>
                      <td>{item.sensorStatus}</td>
                      <td>
                        {item.alertaDisparado ? (
                          <span className="text-danger font-weight-bold">
                            <i className="fab fa-whatsapp mr-1"></i> Disparado
                          </span>
                        ) : (
                          <span className="text-secondary-05">Normal</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}