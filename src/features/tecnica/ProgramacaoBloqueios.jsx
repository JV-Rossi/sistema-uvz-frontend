import React, { useState, useEffect } from 'react';
import './ProgramacaoBloqueios.css';

export default function ProgramacaoBloqueios() {
  const [demandas, setDemandas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sucesso, setSucesso] = useState('');
  const [filtroAbas, setFiltroAbas] = useState('pendente'); 
  const [filtroDistrito, setFiltroDistrito] = useState('TODOS');

  // Estados para o formulário de programação
  const [modalAberto, setModalAberto] = useState(false);
  const [demandaSelecionada, setDemandaSelecionada] = useState(null);
  
  // Campos do formulário
  const [dataAgendada, setDataAgendada] = useState('');
  const [horarioAgendado, setHorarioAgendado] = useState('');
  const [equipeEscalada, setEquipeEscalada] = useState('');
  const [nomeSupervisor, setNomeSupervisor] = useState('');

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const dadosIniciais = [
        { 
          id: 101, 
          dataValidacao: '09/07/2026', 
          bairro: 'ALPHAVILLE I', 
          distrito: 'DIS. NORTE', 
          endereco: 'Rua das Orquídeas, Qd 5, Lt 12', 
          suspeita: 'Dengue', 
          tipoBloqueio: 'Mecânico + Químico (Borrifação)',
          status: 'pendente' 
        },
        { 
          id: 102, 
          dataValidacao: '09/07/2026', 
          bairro: 'COND. ATHENAS', 
          distrito: 'DIS. SUL', 
          endereco: 'Casa 45', 
          suspeita: 'Zika', 
          tipoBloqueio: 'Mecânico + Químico (Borrifação)',
          status: 'pendente' 
        },
        { 
          id: 103, 
          dataValidacao: '08/07/2026', 
          bairro: 'CENTRO', 
          distrito: 'DIS. LESTE', 
          endereco: 'Av. Mato Grosso, 1500', 
          suspeita: 'Chikungunya', 
          tipoBloqueio: 'Mecânico + Químico (Borrifação)',
          status: 'programado',
          dataExecucao: '2026-07-15',
          horaExecucao: '07:30',
          equipe: 'Carlos Souza, Marcos Lima',
          supervisorResponsavel: 'PEDRO ALMEIDA'
        }
      ];
      setDemandas(dadosIniciais);
      setLoading(false);
    }, 600);
  }, []);

  // Lógica de filtro corrigida (agora compara singular com singular!)
  const demandasFiltradas = demandas.filter(demanda => {
    const atendeAba = demanda.status === filtroAbas;
    const atendeDistrito = filtroDistrito === 'TODOS' || demanda.distrito === filtroDistrito;
    return atendeAba && atendeDistrito;
  });

  const handleAbrirProgramacao = (demanda) => {
    setDemandaSelecionada(demanda);
    setDataAgendada('');
    setHorarioAgendado('');
    setEquipeEscalada('');
    setModalAberto(true);
  };

  const handleSalvarProgramacao = (e) => {
    e.preventDefault();

    if (!dataAgendada || !horarioAgendado || !equipeEscalada || !nomeSupervisor) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setDemandas(prev => prev.map(d => {
      if (d.id === demandaSelecionada.id) {
        return {
          ...d,
          status: 'programado',
          dataExecucao: dataAgendada,
          horaExecucao: horarioAgendado,
          equipe: equipeEscalada,
          supervisorResponsavel: nomeSupervisor.toUpperCase()
        };
      }
      return d;
    }));

    setSucesso(`Sucesso! Bloqueio no bairro ${demandaSelecionada.bairro} agendado para ${dataAgendada.split('-').reverse().join('/')} às ${horarioAgendado}.`);
    setModalAberto(false);
    setDemandaSelecionada(null);
    setTimeout(() => setSucesso(''), 4000);
  };

  const handleCancelarEscala = (id) => {
    if (window.confirm("Deseja realmente cancelar esta escala e retornar a demanda para pendente?")) {
      setDemandas(prev => prev.map(d => {
        if (d.id === id) {
          const { dataExecucao, horaExecucao, equipe, supervisorResponsavel, ...resto } = d;
          return { ...resto, status: 'pendente' };
        }
        return d;
      }));
    }
  };

  return (
    <div className="sup-content">
      <header className="sup-header">
        <h1>
          <i className="fas fa-calendar-alt"></i> Planejamento de Bloqueios de Foco
        </h1>
        <p>Painel do Supervisor: Distribuição de equipes, rotas de borrifação e cronogramas operacionais.</p>
      </header>

      {/* TOOLBAR: Alinha abas e filtros perfeitamente na mesma linha */}
      <div className="sup-toolbar">
        <div className="sup-abas">
          <button 
            className={`sup-aba ${filtroAbas === 'pendente' ? 'ativa' : ''}`}
            onClick={() => setFiltroAbas('pendente')}
          >
            <i className="fas fa-hourglass-half"></i> Aguardando Escala ({demandas.filter(d => d.status === 'pendente').length})
          </button>
          <button 
            className={`sup-aba ${filtroAbas === 'programado' ? 'ativa' : ''}`}
            onClick={() => setFiltroAbas('programado')}
          >
            <i className="fas fa-calendar-check"></i> Já Programados ({demandas.filter(d => d.status === 'programado').length})
          </button>
        </div>

        <div className="sup-filtros-container">
          <label htmlFor="filtro-distrito" className="sup-filtro-label">
            <i className="fas fa-filter"></i> Distrito:
          </label>
          <select 
            id="filtro-distrito" 
            value={filtroDistrito} 
            onChange={(e) => setFiltroDistrito(e.target.value)}
            className="sup-select-filtro"
          >
            <option value="TODOS">Todos os Distritos</option>
            <option value="DIS. NORTE">Distrito Norte</option>
            <option value="DIS. SUL">Distrito Sul</option>
            <option value="DIS. LESTE">Distrito Leste</option>
            <option value="DIS. OESTE">Distrito Oeste</option>
          </select>
        </div>
      </div>

      {sucesso && (
        <div className="sup-alerta-sucesso">
          <i className="fas fa-check-circle"></i> {sucesso}
        </div>
      )}

      {loading ? (
        <div className="sup-loading"><i className="fas fa-spinner fa-spin"></i> Carregando ordens de serviço...</div>
      ) : demandasFiltradas.length === 0 ? (
        <div className="sup-vazio">
          <i className="fas fa-inbox"></i>
          <p>Nenhuma ordem de bloqueio encontrada para estes filtros.</p>
        </div>
      ) : (
        <div className="sup-grade-demandas">
          {demandasFiltradas.map(demanda => (
            <div key={demanda.id} className="sup-card-demanda">
              <div className="sup-card-badges">
                <span className="badge-distrito"><i className="fas fa-map-marker-alt"></i> {demanda.distrito}</span>
                <span className={`badge-doenca ${demanda.suspeita.toLowerCase()}`}>{demanda.suspeita}</span>
              </div>
              
              <div className="sup-card-corpo">
                <h3>{demanda.bairro}</h3>
                <p className="sup-txt-endereco"><strong>Endereço:</strong> {demanda.endereco}</p>
                <p className="sup-txt-detalhe"><strong>Tipo Solicitado:</strong> {demanda.tipoBloqueio}</p>
                
                {demanda.status === 'pendente' ? (
                  <small className="sup-data-rt">Validado pelo RT em: {demanda.dataValidacao}</small>
                ) : (
                  <div className="sup-detalhes-agendados">
                    <hr className="sup-divisor-card" />
                    <p className="sup-detalhe-agendamento">
                      <i className="fas fa-calendar-day"></i> <strong>Data:</strong> {demanda.dataExecucao.split('-').reverse().join('/')} às {demanda.horaExecucao}
                    </p>
                    <p className="sup-detalhe-agendamento">
                      <i className="fas fa-users"></i> <strong>Equipe:</strong> {demanda.equipe}
                    </p>
                    <p className="sup-detalhe-agendamento">
                      <i className="fas fa-user-shield"></i> <strong>Resp.:</strong> {demanda.supervisorResponsavel}
                    </p>
                  </div>
                )}
              </div>

              <div className="sup-card-acao">
                {demanda.status === 'pendente' ? (
                  <button className="btn-programar" onClick={() => handleAbrirProgramacao(demanda)}>
                    <i className="fas fa-clock"></i> Definir Equipe e Horário
                  </button>
                ) : (
                  <div className="sup-botoes-acoes-programados">
                    <button className="btn-imprimir" onClick={() => alert('Gerando Ordem de Serviço (PDF) para a equipe...')}>
                      <i className="fas fa-print"></i> OS / Mapa
                    </button>
                    <button className="btn-cancelar-agendamento" onClick={() => handleCancelarEscala(demanda.id)}>
                      <i className="fas fa-undo"></i> Desfazer
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL OPERACIONAL */}
      {modalAberto && demandaSelecionada && (
        <div className="sup-modal-overlay">
          <div className="sup-modal-card">
            <div className="sup-modal-header">
              <h3><i className="fas fa-paste"></i> Escalar Equipe de Bloqueio</h3>
              <button className="sup-btn-fechar" onClick={() => setModalAberto(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSalvarProgramacao}>
              <div className="sup-modal-body">
                <div className="sup-resumo-localizacao">
                  <p><strong>Local:</strong> {demandaSelecionada.bairro} ({demandaSelecionada.distrito})</p>
                  <p><strong>Alvo:</strong> Bloqueio Químico para Suspeita de {demandaSelecionada.suspeita}</p>
                </div>

                <div className="sup-form-group">
                  <label>Seu Nome (Supervisor Responsável) <span className="obrigatorio">*</span></label>
                  <input 
                    type="text" 
                    placeholder="Digite seu nome completo" 
                    value={nomeSupervisor}
                    onChange={(e) => setNomeSupervisor(e.target.value)}
                    required
                  />
                </div>

                <div className="sup-form-linha-dupla">
                  <div className="sup-form-group">
                    <label>Data da Execução <span className="obrigatorio">*</span></label>
                    <input type="date" value={dataAgendada} onChange={(e) => setDataAgendada(e.target.value)} required />
                  </div>
                  <div className="sup-form-group">
                    <label>Horário de Início <span className="obrigatorio">*</span></label>
                    <input type="time" value={horarioAgendado} onChange={(e) => setHorarioAgendado(e.target.value)} required />
                  </div>
                </div>

                <div className="sup-form-group">
                  <label>Agentes Escalados (Borrifadores) <span className="obrigatorio">*</span></label>
                  <textarea 
                    rows="3"
                    placeholder="Ex: Anadir dos Santos, Jussara Ramos..."
                    value={equipeEscalada}
                    onChange={(e) => setEquipeEscalada(e.target.value)}
                    required
                  ></textarea>
                  <small className="sup-input-dica">Insira os nomes dos ACEs separados por vírgula.</small>
                </div>
              </div>

              <div className="sup-modal-footer">
                <button type="button" className="btn-cancelar" onClick={() => setModalAberto(false)}>Cancelar</button>
                <button type="submit" className="btn-confirmar-escala">
                  <i className="fas fa-save"></i> Confirmar e Enviar para o Campo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}