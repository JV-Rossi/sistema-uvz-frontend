import { useState } from 'react';
import api from '../../core/api';

export default function RecuperarSenha({ setTelaAtual }) {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [status, setStatus] = useState(''); // Controla a cor da mensagem (sucesso ou erro)
  const [carregando, setCarregando] = useState(false);

  const handleRecuperar = async (e) => {
    e.preventDefault();
    setMensagem('');
    setStatus('');
    setCarregando(true);

    try {
      // 🚀 Dispara o pedido para o seu Java (que usará o SMTP para enviar o e-mail)
      // Ajuste a rota '/usuarios/recuperar-senha' no futuro conforme a sua API
      const response = await api.post('/usuarios/recuperar-senha', { email });

      // Ocultamos mensagens específicas de "e-mail não encontrado" por segurança, 
      // para evitar que pessoas de fora descubram quais e-mails estão no sistema.
      setStatus('sucesso');
      setMensagem('✅ Se o e-mail estiver cadastrado, você receberá as instruções de recuperação em instantes.');
      setEmail('');

    } catch (error) {
      console.error(error);
      setStatus('erro');
      setMensagem('❌ Erro ao conectar com o servidor. Tente novamente mais tarde.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', background: '#222', padding: '30px', borderRadius: '8px', color: '#fff', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '10px', color: '#4fc3f7' }}>Recuperar Senha</h2>
      
      <p style={{ color: '#ccc', fontSize: '14px', marginBottom: '20px', textAlign: 'center', lineHeight: '1.5' }}>
        Digite o e-mail associado à sua matrícula. Enviaremos as instruções para você redefinir seu acesso.
      </p>

      <form onSubmit={handleRecuperar} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <div>
          <label style={{ fontWeight: 'bold', fontSize: '14px' }}>E-mail Institucional ou Pessoal:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ex: agente@gmail.com"
            required
            disabled={carregando}
            style={{ width: '100%', padding: '10px', marginTop: '5px', background: '#333', color: '#fff', border: '1px solid #444', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={carregando}
          style={{ 
            padding: '12px', 
            backgroundColor: carregando ? '#555' : '#007bff', 
            color: 'white', 
            border: 'none', 
            cursor: carregando ? 'not-allowed' : 'pointer', 
            fontWeight: 'bold', 
            borderRadius: '4px',
            marginTop: '10px',
            transition: '0.3s'
          }}
        >
          {carregando ? '⏳ Enviando solicitação...' : '✉️ Enviar Link de Recuperação'}
        </button>
      </form>

      {mensagem && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          borderRadius: '4px', 
          background: status === 'sucesso' ? 'rgba(40, 167, 69, 0.2)' : 'rgba(220, 53, 69, 0.2)',
          border: `1px solid ${status === 'sucesso' ? '#28a745' : '#dc3545'}`,
          textAlign: 'center',
          fontSize: '14px',
          color: status === 'sucesso' ? '#2ecc71' : '#ff6b6b'
        }}>
          {mensagem}
        </div>
      )}

      {/* 🔙 Botão de Voltar ao Login */}
      <div style={{ textAlign: 'center', marginTop: '25px' }}>
        <button
          type="button"
          onClick={() => { setTelaAtual('login'); setMensagem(''); }}
          style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', textDecoration: 'underline', fontSize: '14px' }}
        >
          ⬅️ Voltar para a tela de Login
        </button>
      </div>
    </div>
  );
}