import { useState } from 'react';
import api from '../../core/api';

export default function Login({ setTelaAtual, setMensagem }) {
  const [loginMatricula, setLoginMatricula] = useState(''); // 👈 Alterado de loginUsername para loginMatricula
  const [loginPassword, setLoginPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensagem('');

    try {
      // 🚀 Dispara a matrícula e a senha para validação no Spring Boot
      const response = await api.post('/usuarios/login', {
        matricula: loginMatricula,
        password: loginPassword
      });

      if (response.data.startsWith("SUCESSO:")) {
        const cargoUsuario = response.data.split(":")[1];

        localStorage.setItem('userCargo', cargoUsuario);
        localStorage.setItem('userMatricula', loginMatricula); // 🔥 CHAVE DE OURO: Gravada para preenchimento automático das vistorias

        // 1. Atualiza o estado da tela localmente
        if (cargoUsuario === 'GESTAO') {
          setTelaAtual('gestao');
        } else if (cargoUsuario === 'TECNICO' || cargoUsuario === 'EQUIPE_TECNICA') {
          localStorage.setItem('userCargo', 'TECNICO');
          setTelaAtual('tecnica');
        } else if (cargoUsuario === 'AGENTE_CAMPO') {
          setTelaAtual('campo_menu'); // 👈 Ajustado para casar com o roteamento do seu App.jsx
        }

        // 2. O PULO DO GATO: Atualiza a URL do navegador e força a renderização limpa do React
        window.location.hash = '/';
        window.location.reload();

      } else {
        setMensagem('❌ Matrícula ou senha incorretos.');
      }
    } catch (error) {
      console.error(error);
      setMensagem('❌ Erro ao conectar com o servidor Java.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', background: '#222', padding: '25px', borderRadius: '8px', color: '#fff' }}>
      <h2>CVSA - Sistema de Controle de Acesso</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* 💳 INPUT ADAPTADO PARA MATRÍCULA */}
        <div>
          <label>Matrícula (Login):</label>
          <input
            type="text"
            value={loginMatricula}
            onChange={(e) => setLoginMatricula(e.target.value)}
            placeholder="Digite sua matrícula"
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px', background: '#333', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}
          />
        </div>

        <div>
          <label>Senha:</label>
          <input
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px', background: '#333', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}
          />
        </div>

        <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '4px' }}>
          Entrar no Sistema
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '15px', color: '#ccc' }}>
        Novo por aqui?{' '}
        <button
          onClick={() => { setTelaAtual('cadastro'); setMensagem(''); }}
          style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' }}
        >
          Cadastre um funcionário
        </button>
      </p>
    </div>
  );
}