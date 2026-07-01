import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx'
import GestaoDashboard from './features/gestao/GestaoDashboard.jsx';
import TecnicaPainel from './features/tecnica/PainelTecnico.jsx';
import CampoDashboard from './features/tecnica/CadastroUsuario.jsx';
import './index.css'
import './shared/assets/rawline.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* A rota raiz '/' carrega a nossa tela de Login/Cadastro */}
        <Route path="/" element={<App />} />
        
        {/* Rotas específicas para cada nível de acesso */}
        <Route path="/dashboard-gestao" element={<GestaoDashboard />} />
        <Route path="/painel-tecnica" element={<TecnicaPainel />} />
        <Route path="/dashboard-campo" element={<CampoDashboard />} />
      </Routes>
    </Router>
  </React.StrictMode>,
)