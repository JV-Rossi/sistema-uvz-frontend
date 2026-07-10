import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from './TopBar'; // Importando o novo componente
import './MenuCampo.css';

export default function MenuCampo({ setTelaAtual }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.hash = '/';
    window.location.reload();
  };

  return (
    <div className="container-menu-campo">
      
      {/* 🟢 COMPONENTE DA BARRA SUPERIOR AQUI */}
      <TopBar />

      <div className="cabecalho-menu">
        <h1>Painel do Agente</h1>
        <p>Selecione o serviço necessário para continuar</p>
      </div>

      {/* 🎛️ GRADE DE SERVIÇOS */}
      <div className="grade-cards">
        
        <div className="card-menu" onClick={() => setTelaAtual('menu_boletins')}>
          <div className="card-icone icone-amarelo">
            <i className="fas fa-clipboard-list"></i>
          </div>
          <strong className="card-titulo">Boletins</strong>
          <small className="card-subtitulo">Todos os Boletins</small>
        </div>

        <div className="card-menu" onClick={() => setTelaAtual('solicitacao_campo')}>
          <div className="card-icone icone-vermelho">
            <i className="fas fa-bullhorn"></i>
          </div>
          <strong className="card-titulo">Solicitação</strong>
          <small className="card-subtitulo">Solicitar Ordem de Serviço</small>
        </div>

        <div className="card-menu" onClick={() => setTelaAtual('resumo_semanal')}>
          <div className="card-icone icone-azul">
            <i className="fas fa-calendar-alt"></i>
          </div>
          <strong className="card-titulo">Resumo Semanal</strong>
          <small className="card-subtitulo">Controle do trabalho</small>
        </div>

        <div className="card-menu" onClick={() => setTelaAtual('ovitrampas')}>
          <div className="card-icone icone-vermelho">
            <i className="fas fa-bug"></i>
          </div>
          <strong className="card-titulo">Amostragem Ovitrampas</strong>
          <small className="card-subtitulo">Armadilha de ovos</small>
        </div>

      </div>

      <hr className="linha-divisoria" />

      <button onClick={handleLogout} className="btn-desconectar">
        Desconectar do Sistema
      </button>

    </div>
  );
}