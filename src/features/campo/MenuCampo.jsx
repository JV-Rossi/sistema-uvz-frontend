import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MenuCampo.css';

export default function MenuCampo({ setTelaAtual }) {
  const usuarioNome = localStorage.getItem('userLogin');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.hash = '/';
    window.location.reload();
  };

  return (
    <div className="container-menu-campo">

      <div className="cabecalho-menu">
        <h1>Painel do Agente</h1>
        <p>Selecione o serviço para abertura de boletim</p>
        {usuarioNome && <p className="identificacao-agente">👤 Agente: {usuarioNome}</p>}
      </div>

      {/* 🎛️ GRADE DE SERVIÇOS (ESTILO CARD SUS ACCESSIBLE) */}
      <div className="grade-cards">

        {/* CARD 1: Gaveta de Boletins */}
        <div className="card-menu" onClick={() => setTelaAtual('menu_boletins')}>
          <div className="card-icone icone-amarelo">
            <i className="fas fa-clipboard-list"></i>
          </div>
          <strong className="card-titulo">Boletins</strong>
          <small className="card-subtitulo">Todos os serviços</small>
        </div>

        {/* CARD 2: Solicitar Bloqueio Rápido */}
        <div className="card-menu" onClick={() => setTelaAtual('solicitar_bloqueio')}>
          <div className="card-icone icone-vermelho">
            <i className="fas fa-bullhorn"></i>
          </div>
          <strong className="card-titulo">Solicitar Bloqueio</strong>
          <small className="card-subtitulo">Denunciar foco</small>
        </div>

        {/* CARD 3: Resumo Semanal */}
        <div className="card-menu" onClick={() => setTelaAtual('resumo_semanal')}>
          <div className="card-icone icone-azul">
            <i className="fas fa-calendar-alt"></i>
          </div>
          <strong className="card-titulo">Resumo Semanal</strong>
          <small className="card-subtitulo">Controle do trabalho</small>
        </div>

        {/* CARD 4: Amostragem com Ovitrampas */}
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