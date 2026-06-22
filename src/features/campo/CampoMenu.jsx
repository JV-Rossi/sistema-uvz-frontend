import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CampoMenu({ setTelaAtual }) {
  const usuarioNome = localStorage.getItem('userLogin');

  const navigate = useNavigate(); // 👈 1. Inicializa o navigate aqui dentro

  // Função de logout que reaproveitamos dos outros painéis
  const handleLogout = () => {
    // 1. Limpa todas as credenciais gravadas
    localStorage.clear();
    sessionStorage.clear();

    // 2. Força o navegador a recarregar apontando diretamente para a rota inicial limpa
    window.location.hash = '/';
    window.location.reload();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '500px', margin: '0 auto', color: '#fff', textAlign: 'center' }}>

      <div style={{ marginBottom: '30px', marginTop: '20px' }}>
        <h1>Painel do Agente</h1>
        <p style={{ color: '#aaa' }}>Selecione o serviço para abertura de boletim</p>
        {usuarioNome && <p style={{ color: '#28a745', fontSize: '14px', fontWeight: 'bold' }}>👤 Agente: {usuarioNome}</p>}
      </div>

      {/* 🎛️ GRADE DE BOTÕES (MENU INSPIRADO NO SEU PRINT) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>

        {/* CARD 1: Boletim de campo */}
        <div
          onClick={() => setTelaAtual('campo_formulario_zoonoses')}
          style={{ background: '#222', padding: '20px', borderRadius: '12px', cursor: 'pointer', border: '1px solid #333', transition: '0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}
        >
          <div style={{ fontSize: '30px', background: '#e67e22', width: '55px', height: '55px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📋</div>
          <strong style={{ fontSize: '15px', letterSpacing: '0.5px' }}>Boletim de Campo</strong>
          <small style={{ color: '#aaa', fontSize: '11px' }}>Trabalho de rotina</small>
        </div>

        {/* CARD 2: Bloqueio de foco */}
        <div
          onClick={() => setTelaAtual('menu_bloqueio')} // 👈 Agora ele navega para o sub-menu
          style={{ background: '#222', padding: '20px', borderRadius: '12px', cursor: 'pointer', border: '1px solid #333', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}
        >
          <div style={{ fontSize: '30px', background: '#2ecc71', width: '55px', height: '55px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🎯</div>
          <strong style={{ fontSize: '15px', letterSpacing: '0.5px' }}>Bloqueio de foco</strong>
          <small style={{ color: '#aaa', fontSize: '11px', textAlign: 'center' }}>Solicitar ou executar</small>
        </div>

        {/* CARD 3: Resumo Semanal */}
        <div
          onClick={() => setTelaAtual('resumo_semanal')}
          style={{ background: '#222', padding: '20px', borderRadius: '12px', cursor: 'pointer', border: '1px solid #333', opacity: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}
        >
          <div style={{ fontSize: '30px', background: '#3498db', width: '55px', height: '55px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📅</div>
          <strong style={{ fontSize: '15px', letterSpacing: '0.5px' }}>Resumo Semanal</strong>
          <small style={{ color: '#aaa', fontSize: '11px' }}>Controle do trabalho</small>
        </div>

        {/* CARD 4: Amostragem com Ovitrampas */}
        <div
          onClick={() => setTelaAtual('ovitrampas')}
          style={{ background: '#222', padding: '20px', borderRadius: '12px', cursor: 'pointer', border: '1px solid #333', opacity: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}
        >
          <div style={{ fontSize: '30px', background: '#e74c3c', width: '55px', height: '55px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🧺</div>
          <strong style={{ fontSize: '15px', letterSpacing: '0.5px' }}>Amost. com Ovitrampas</strong>
          <small style={{ color: '#aaa', fontSize: '11px' }}>Armadilha de ovos</small>
        </div>

      </div>

      <hr style={{ borderColor: '#333', margin: '20px 0' }} />

      <button onClick={handleLogout} style={{ padding: '12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}>
        Desconectar do Sistema
      </button>

    </div>
  );
}