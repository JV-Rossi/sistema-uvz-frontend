import { useState } from 'react';
import api from '../../core/api';
import './Autenticacao.css'; // 👈 Importando o CSS unificado

export default function Login({ setTelaAtual, setMensagem }) {
  const [loginMatricula, setLoginMatricula] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensagem('');

    try {
      const response = await api.post('/usuarios/login', {
        matricula: loginMatricula,
        password: loginPassword
      });

      if (response.data.startsWith("SUCESSO:")) {
        let cargoUsuario = response.data.split(":")[1].trim();

        if (cargoUsuario === "Equipe tecnica") cargoUsuario = "EQUIPE_TECNICA";
        if (cargoUsuario === "Agente de campo") cargoUsuario = "AGENTE_CAMPO";
        if (cargoUsuario === "Gestão" || cargoUsuario === "Gestao") cargoUsuario = "GESTAO";

        localStorage.setItem('userCargo', cargoUsuario);
        localStorage.setItem('userMatricula', loginMatricula);

        if (cargoUsuario === 'GESTAO') {
          setTelaAtual('gestao');
        } else if (cargoUsuario === 'TECNICO' || cargoUsuario === 'EQUIPE_TECNICA') {
          localStorage.setItem('userCargo', 'TECNICO');
          setTelaAtual('tecnica');
        } else if (cargoUsuario === 'AGENTE_CAMPO') {
          setTelaAtual('campo_menu');
        }

        window.location.hash = '/';

      } else {
        setMensagem('❌ Matrícula ou senha incorretos.');
      }
    } catch (error) {
      console.error(error);
      setMensagem('❌ Erro ao conectar com o servidor Java.');
    }
  };

  return (
    <div className="auth-screen">

      {/* 🏞️ LADO ESQUERDO: Painel com a imagem dos agentes de Cuiabá */}
      <div className="auth-side-image"></div>

      {/* 📝 LADO DIREITO: Painel limpo com o formulário de login */}
      <div className="auth-side-form">
        <div className="auth-container">
          <h2 className="auth-title">CVSA - Sistema de Controle de Acesso</h2>

          <form onSubmit={handleLogin} className="auth-form">
            <div className="auth-group">
              <label className="auth-label">Matrícula:</label>
              <input
                type="text"
                value={loginMatricula}
                onChange={(e) => setLoginMatricula(e.target.value)}
                placeholder="Digite sua matrícula"
                required
                className="auth-input"
              />
            </div>

            <div className="auth-group">
              <label className="auth-label">Senha:</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="auth-input"
              />
            </div>

            <button type="submit" className="auth-btn btn-submit">
              Entrar no Sistema
            </button>
          </form>

          <div className="auth-footer">
            <button
              type="button"
              onClick={() => { setTelaAtual('recuperar_senha'); setMensagem(''); }}
              className="auth-link"
            >
              Esqueci minha senha
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}