import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx'
import PainelGestao from './features/gestao/PainelGestao.jsx';
import PainelTecnico from './features/tecnica/PainelTecnico.jsx';
import MenuCampo from './features/tecnica/CadastroUsuario.jsx';
import './index.css'
import './shared/assets/rawline.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* A rota raiz '/' carrega a nossa tela de Login/Cadastro */}
        <Route path="/" element={<App />} />
        
        {/* Rotas específicas para cada nível de acesso */}
        <Route path="/painel-gestao" element={<PainelGestao />} />
        <Route path="/painel-tecnica" element={<PainelTecnico />} />
        <Route path="/painel-campo" element={<MenuCampo />} />
      </Routes>
    </Router>
  </React.StrictMode>,
)