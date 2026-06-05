import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import GestaoDashboard from './pages/GestaoDashboard.jsx'
import TecnicaDashboard from './pages/TecnicaDashboard.jsx'
import CampoDashboard from './pages/CampoDashboard.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* A rota raiz '/' carrega a nossa tela de Login/Cadastro */}
        <Route path="/" element={<App />} />
        
        {/* Rotas específicas para cada nível de acesso */}
        <Route path="/dashboard-gestao" element={<GestaoDashboard />} />
        <Route path="/dashboard-tecnica" element={<TecnicaDashboard />} />
        <Route path="/dashboard-campo" element={<CampoDashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)