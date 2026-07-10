import React, { useState, useEffect } from 'react';
import './ProgramacaoBloqueios.css';

export default function ProgramacaoBloqueios() {
  const [demandas, setDemandas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sucesso, setSucesso] = useState('');
  const [filtroAbas, setFiltroAbas] = useState('pendentes'); // 'pendentes' ou 'programados'

  // Estados para o formulário de programação
  const [modalAberto, setModalAberto] = useState(false);
  const [demandaSelecionada, setDemandaSelecionada] = useState(null);
  
  // Campos do formulário
  const [dataAgendada, setDataAgendada] = useState('');
  const [horarioAgendado, setHorarioAgendado] = useState('');
  const [equipeEscalada, setEquipeEscalada] = useState('');
  const [nomeSupervisor, setNomeSupervisor] = useState('');

  useEffect(() => {
    buscarDemandasDelegadas();
  }, [filtroAbas]);

  const buscarDemandasDelegadas = () => {
    setLoading(true);
    // Simulando dados vindos da validação do RT (Com acréscimo do Distrito)
    setTimeout(() => {
      const dadosRT = [
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
        }
      ];
      setDemandas(filtroAbas === 'pendentes' ? dadosRT : []);
      setLoading(false);
    }, 600);
  };

  const handleAbrirProgramacao = (demanda) => {
    setDemandaSelecionada(demanda);
    setDataAgendada('');
    setHorarioAgendado('');
    setEquipeEscalada('');
    // Reseta ou mantém o nome do supervisor se ele já digitou antes nesta sessão
    setModalAberto(true);
  };

  const handleSalvarProgramacao = (e) => {
    e.preventDefault();

    if (!dataAgendada || !horarioAgendado || !equipeEscalada || !nomeSupervisor) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Objeto formatado pronto para enviar ao banco de dados/Dexie
    const bloqueioProgramado = {
      demandaId: demandaSelecionada.id,
      bairro: demandaSelecionada.bairro,
      distrito: demandaSelecionada.distrito,
      endereco: demandaSelecionada.endereco,
      suspeita: demandaSelecionada.suspeita,
      dataExecucao: dataAgendada,
      horaExecucao: horarioAgendado,
      equipe: equipeEscalada,
      supervisorResponsavel: nomeSupervisor.toUpperCase(),
      status: 'programado'
    };

    console.log("Enviando para escala de trabalho:", bloqueioProgramado);

    // Feedback visual
    setSucesso(`Sucesso! Bloqueio no bairro ${demandaSelecionada.bairro} agendado para dia ${dataAgendada} às ${horarioAgendado}.`);
    setDemandas(prev => prev.filter(d => d.id !== demandaSelecionada.id));
    
    // Fecha o modal
    setModalAberto(false);
    setDemandaSelecionada(null);
    setTimeout(() => setSucesso(''), 4000);
  };

  return (
    <div className="sup-container">
      <header className="sup-header">
        <h1>
          <i className="fas fa-calendar-alt"></i> Planejamento de Bloqueios de Foco
        </h1>
        <p>Painel do Supervisor: Distribuição de equipes, rotas de borrifação e cronogramas operacionais.</p>
      </header>

      {/* ABAS DO SUPERVISOR */}
      <div className="sup-abas">
        <button 
          className={`sup-aba ${filtroAbas === 'pendentes' ? 'ativa' : ''}`}
          onClick={() => setFiltroAbas('pendentes')}
        >
          <i className="fas fa-hourglass-half"></i> Aguardando Escala ({demandas.length})
        </button>
        <button 
          className={`sup-aba ${filtroAbas === 'programados' ? 'ativa' : ''}`}
          onClick={() => setFiltroAbas('programados')}
        >
          <i className="fas fa-calendar-check"></i> Já Programados
        </button>
      </div>

      {sucesso && (
        <div className="sup-alerta-sucesso">
          <i className="fas fa-check-circle"></i> {sucesso}
        </div>
      )}

      {/* LISTA DE CARDS DE DEMANDAS */}
      {loading ? (
        <div className="sup-loading"><i className="fas fa-spinner fa-spin"></i> Carregando ordens de serviço...</div>
      ) : demandas.length === 0 ? (
        <div className="sup-vazio">
          <i className="fas fa-inbox"></i>
          <p>Nenhuma ordem de bloqueio pendente de cronograma.</p>
        </div>
      ) : (
        <div className="sup-grade-demandas">
          {demandas.map(demanda => (
            <div key={demanda.id} className="sup-card-demanda">
              <div className="sup-card-badges">
                <span className="badge-distrito"><i className="fas fa-map-marker-alt"></i> {demanda.distrito}</span>
                <span className={`badge-doenca ${demanda.suspeita.toLowerCase()}`}>{demanda.suspeita}</span>
              </div>
              
              <div className="sup-card-corpo">
                <h3>{demanda.bairro}</h3>
                <p className="sup-txt-endereco"><strong>Endereço:</strong> {demanda.endereco}</p>
                <p className="sup-txt-detalhe"><strong>Tipo Solicitado:</strong> {demanda.tipoBloqueio}</p>
                <small>Validado pelo RT em: {demanda.dataValidacao}</small>
              </div>

              <div className="sup-card-acao">
                <button className="btn-programar" onClick={() => handleAbrirProgramacao(demanda)}>
                  <i className="fas fa-clock"></i> Definir Equipe e Horário
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🟢 JANELA MODAL: PROGRAMAÇÃO OPERACIONAL */}
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
                
                {/* Resumo Resumido do Local */}
                <div className="sup-resumo-localizacao">
                  <p><strong>Local:</strong> {demandaSelecionada.bairro} ({demandaSelecionada.distrito})</p>
                  <p><strong>Alvo:</strong> Bloqueio Químico para Suspeita de {demandaSelecionada.suspeita}</p>
                </div>

                {/* 1. Campo de Identificação do Supervisor */}
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

                {/* Linha dupla: Data e Horário */}
                <div className="sup-form-linha-dupla">
                  <div className="sup-form-group">
                    <label>Data da Execução <span className="obrigatorio">*</span></label>
                    <input 
                      type="date" 
                      value={dataAgendada}
                      onChange={(e) => setDataAgendada(e.target.value)}
                      required
                    />
                  </div>

                  <div className="sup-form-group">
                    <label>Horário de Início <span className="obrigatorio">*</span></label>
                    <input 
                      type="time" 
                      value={horarioAgendado}
                      onChange={(e) => setHorarioAgendado(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* 3. Escala da Equipe */}
                <div className="sup-form-group">
                  <label>Agentes Escalados (Equipe de Campo / Borrifadores) <span className="obrigatorio">*</span></label>
                  <textarea 
                    rows="3"
                    placeholder="Ex: Anadir dos Santos, Jussara Ramos, Alessandra Lima..."
                    value={equipeEscalada}
                    onChange={(e) => setEquipeEscalada(e.target.value)}
                    required
                  ></textarea>
                  <small className="sup-input-dica">Insira os nomes dos ACEs separados por vírgula.</small>
                </div>

              </div>

              <div className="sup-modal-footer">
                <button type="button" className="btn-cancelar" onClick={() => setModalAberto(false)}>
                  Cancelar
                </button>
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