import { useState } from 'react';
import api from '../../core/api';

export default function Login({ setTelaAtual, setMensagem }) {
  const [loginMatricula, setLoginMatricula] = useState(''); 
  const [loginPassword, setLoginPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensagem('');

    try {
      // Dispara a matrícula e a senha para validação no Spring Boot
      const response = await api.post('/usuarios/login', {
        matricula: loginMatricula,
        password: loginPassword
      });

      if (response.data.startsWith("SUCESSO:")) {
        // Pega o cargo bruto vindo do Java (ex: "Equipe tecnica")
        let cargoUsuario = response.data.split(":")[1].trim();

        // 🔄 TRADUTOR/NORMALIZADOR: Converte o formato do Forms para o padrão do seu React
        if (cargoUsuario === "Equipe tecnica") cargoUsuario = "EQUIPE_TECNICA";
        if (cargoUsuario === "Agente de campo") cargoUsuario = "AGENTE_CAMPO";
        if (cargoUsuario === "Gestão" || cargoUsuario === "Gestao") cargoUsuario = "GESTAO";

        // Salva as credenciais limpas no localStorage
        localStorage.setItem('userCargo', cargoUsuario);
        localStorage.setItem('userMatricula', loginMatricula);

        // 1. Atualiza o estado da tela localmente (O React vai mudar de tela sozinho)
        if (cargoUsuario === 'GESTAO') {
          setTelaAtual('gestao');
        } else if (cargoUsuario === 'TECNICO' || cargoUsuario === 'EQUIPE_TECNICA') {
          localStorage.setItem('userCargo', 'TECNICO'); // Mantém o fallback que você criou
          setTelaAtual('tecnica');
        } else if (cargoUsuario === 'AGENTE_CAMPO') {
          setTelaAtual('campo_menu'); 
        }

        // 2. 🎯 MUDANÇA CRUCIAL: Atualiza a rota interna sem dar um "F5" violento na página
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
    <div style={{ maxWidth: '400px', margin: '50px auto', background: '#222', padding: '25px', borderRadius: '8px', color: '#fff' }}>
      <h2>CVSA - Sistema de Controle de Acesso</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
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

      {/* 🎯 NOVO RODAPÉ: Recuperação de Senha */}
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={() => { setTelaAtual('recuperar_senha'); setMensagem(''); }}
          style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold', fontSize: '14px' }}
        >
          Esqueci minha senha
        </button>
      </p>
    </div>
  );
}