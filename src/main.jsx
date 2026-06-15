import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx'
import GestaoDashboard from './features/gestao/GestaoDashboard.jsx';
import TecnicaDashboard from './features/tecnica/TecnicaDashboard.jsx';
import CampoDashboard from './features/tecnica/Cadastro.jsx';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* A rota raiz '/' carrega a nossa tela de Login/Cadastro */}
        <Route path="/" element={<App />} />
        
        {/* Rotas específicas para cada nível de acesso */}
        <Route path="/dashboard-gestao" element={<GestaoDashboard />} />
        <Route path="/dashboard-tecnica" element={<TecnicaDashboard />} />
        <Route path="/dashboard-campo" element={<CampoDashboard />} />
      </Routes>
    </Router>
  </React.StrictMode>,
)