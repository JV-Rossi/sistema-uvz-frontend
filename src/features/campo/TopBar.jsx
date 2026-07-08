import React, { useState, useEffect, useRef } from 'react';
import './TopBar.css';

export default function TopBar() {
  const usuarioNome = localStorage.getItem('userLogin');
  const primeiroNome = usuarioNome ? usuarioNome.split(' ')[0] : 'Agente';
  
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [menuAberto, setMenuAberto] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('pendentes'); // 'pendentes' ou 'historico'
  const [notificacaoAberta, setNotificacaoAberta] = useState(null); // Controla o modal de leitura
  
  const notificacoesRef = useRef(null);

  // Estado das notificações (Simulando banco de dados)
  // Status possíveis: 'pendente' (nova), 'ciente' (lida/em andamento), 'historico' (resolvida/vencida)
  const [notificacoes, setNotificacoes] = useState([
    {
      id: 1,
      remetente: 'Supervisão UVZ',
      tipo: 'delegacao',
      titulo: 'Bloqueio de Foco para o dia 12/07/2026',
      mensagem: 'Foi detectado um alto índice de infestação. Realizar bloqueio no dia 12/07/2026 no quarteirão 45 (Bairro Centro). Equipe: Anadir, Jussara e Alessandra',
      data: '08/07/2026, 08:30',
      status: 'pendente'
    },
    {
      id: 2,
      remetente: 'Supervisão UVZ',
      tipo: 'aviso',
      titulo: 'Encontro do P.A. de Campo',
      mensagem: 'O próximo P.A do distrito será realizado na próxima sexta-feira, 10/07, às 13:30, na sede da UVZ. Comparecer com uniforme',
      data: '07/07/2026, 16:45',
      status: 'pendente'
    },
    {
      id: 3,
      remetente: 'Sistema',
      tipo: 'aviso',
      titulo: 'Mutirão Concluído',
      mensagem: 'Lembrete de mutirão no bairro CPA agendado para o último sábado. Relatórios já enviados.',
      data: '01/07/2026',
      status: 'historico'
    }
  ]);

  const qtdPendentes = notificacoes.filter(n => n.status === 'pendente').length;

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    function handleClickFora(event) {
      if (notificacoesRef.current && !notificacoesRef.current.contains(event.target)) {
        setMenuAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, [notificacoesRef]);

  // Ações do Agente
  const handleDarCiencia = (id) => {
    setNotificacoes(notificacoes.map(n => n.id === id ? { ...n, status: 'ciente' } : n));
  };

  const handleConcluir = (id) => {
    setNotificacoes(notificacoes.map(n => n.id === id ? { ...n, status: 'historico' } : n));
    setNotificacaoAberta(null); // Fecha o modal após concluir
  };

  const getIconeNotificacao = (tipo) => {
    switch(tipo) {
      case 'delegacao': return <i className="fas fa-clipboard-check icone-urgente"></i>;
      case 'aviso': return <i className="fas fa-exclamation-circle icone-aviso"></i>;
      default: return <i className="fas fa-bell"></i>;
    }
  };

  const notificacoesFiltradas = notificacoes.filter(n => 
    abaAtiva === 'pendentes' ? (n.status === 'pendente' || n.status === 'ciente') : n.status === 'historico'
  );

  return (
    <div className="barra-superior">
      <div className="barra-nome">
        <i className="fas fa-user-circle"></i> Olá, {primeiroNome}
      </div>

      <div className="barra-status-internet">
        {isOnline ? (
          <span className="status-online"><i className="fas fa-wifi"></i> Online</span>
        ) : (
          <span className="status-offline"><i className="fas fa-wifi-slash"></i> Offline</span>
        )}
      </div>

      <div className="barra-notificacoes-container" ref={notificacoesRef}>
        <div className="barra-notificacoes" onClick={() => setMenuAberto(!menuAberto)}>
          <i className="fas fa-bell"></i>
          {qtdPendentes > 0 && <span className="badge-notificacao">{qtdPendentes}</span>}
        </div>

        {menuAberto && (
          <div className="menu-notificacoes">
            <div className="menu-notificacoes-cabecalho">
              <h4>Demandas Oficiais</h4>
              <div className="abas-notificacoes">
                <button 
                  className={`aba ${abaAtiva === 'pendentes' ? 'ativa' : ''}`}
                  onClick={() => setAbaAtiva('pendentes')}
                >
                  Ativas
                </button>
                <button 
                  className={`aba ${abaAtiva === 'historico' ? 'ativa' : ''}`}
                  onClick={() => setAbaAtiva('historico')}
                >
                  Histórico
                </button>
              </div>
            </div>
            
            <div className="menu-notificacoes-lista">
              {notificacoesFiltradas.length === 0 ? (
                <div className="notificacao-vazia">Nenhuma demanda nesta aba.</div>
              ) : (
                notificacoesFiltradas.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`notificacao-item ${notif.status === 'pendente' ? 'nao-lida' : ''}`}
                    onClick={() => setNotificacaoAberta(notif)}
                  >
                    <div className="notificacao-icone">
                      {getIconeNotificacao(notif.tipo)}
                    </div>
                    <div className="notificacao-conteudo">
                      <strong>{notif.titulo}</strong>
                      <small className="remetente">{notif.remetente}</small>
                      <span className={`status-badge ${notif.status}`}>{notif.status.toUpperCase()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* 🟢 MODAL DE DETALHAMENTO DA NOTIFICAÇÃO (Abre ao clicar na lista) */}
      {notificacaoAberta && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{notificacaoAberta.titulo}</h3>
              <button className="btn-fechar" onClick={() => setNotificacaoAberta(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-remetente"><strong>De:</strong> {notificacaoAberta.remetente}</p>
              <p className="modal-data"><strong>Recebido em:</strong> {notificacaoAberta.data}</p>
              <hr />
              <p className="modal-mensagem">{notificacaoAberta.mensagem}</p>
            </div>
            <div className="modal-footer">
              {notificacaoAberta.status === 'pendente' && (
                <button className="btn-acao btn-ciencia" onClick={() => handleDarCiencia(notificacaoAberta.id)}>
                  <i className="fas fa-check-double"></i> Confirmar Ciência
                </button>
              )}
              {notificacaoAberta.status === 'ciente' && (
                <button className="btn-acao btn-concluir" onClick={() => handleConcluir(notificacaoAberta.id)}>
                  <i className="fas fa-flag-checkered"></i> Demanda Concluída
                </button>
              )}
              {notificacaoAberta.status === 'historico' && (
                <span className="texto-arquivado"><i className="fas fa-archive"></i> Arquivado no Histórico</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

