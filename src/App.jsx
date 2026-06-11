import { useState, useEffect } from 'react';
import './App.css';

import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import CampoMenu from './pages/CampoMenu';
import GestaoDashboard from './pages/GestaoDashboard';
import CampoDashboard from './pages/CampoDashboard';
import TecnicaDashboard from './pages/TecnicaDashboard';
import ResumoSemanal from './pages/ResumoSemanal';
import OvitrampaDashboard from './pages/OvitrampaDashboard';

function App() {
  const [telaAtual, setTelaAtual] = useState('login');
  const [mensagem, setMensagem] = useState('');

  // 🛡️ REFRESH DE SEGURANÇA: Se der F5, o agente vai direto para o MENU agora
  useEffect(() => {
    const cargoSalvo = localStorage.getItem('userCargo');
    if (cargoSalvo) {
      if (cargoSalvo === 'GESTAO') setTelaAtual('gestao');
      else if (cargoSalvo === 'TECNICO') setTelaAtual('tecnica');
      else if (cargoSalvo === 'AGENTE_CAMPO') setTelaAtual('campo_menu'); // Direct para o Menu!
    }
  }, []);

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh' }}>

      {telaAtual === 'login' && (
        <Login setTelaAtual={setTelaAtual} setMensagem={setMensagem} />
      )}

      {telaAtual === 'cadastro' && (
        <Cadastro setTelaAtual={setTelaAtual} setMensagem={setMensagem} />
      )}

      {telaAtual === 'gestao' && <GestaoDashboard />}
      {telaAtual === 'tecnica' && <TecnicaDashboard />}

      {/* ROTEAMENTO DO AGENTE DE CAMPO */}
      {telaAtual === 'campo_menu' && (
        <CampoMenu setTelaAtual={setTelaAtual} />
      )}

      {telaAtual === 'campo_formulario_zoonoses' && (
        <CampoDashboard setTelaAtual={setTelaAtual} />
      )}

      {telaAtual === 'resumo_semanal' && (
        <ResumoSemanal setTelaAtual={setTelaAtual} />
      )}

      {telaAtual === 'ovitrampas' && (
        <OvitrampaDashboard setTelaAtual={setTelaAtual} />
      )}

      {/* MENSAGEM DE STATUS */}
      {(telaAtual === 'login' || telaAtual === 'cadastro') && mensagem && (
        <p style={{ marginTop: '20px', fontWeight: 'bold', textAlign: 'center', color: '#ffc107' }}>
          {mensagem}
        </p>
      )}

    </div>
  );
}

export default App;