import { useState } from 'react';
import api from '../services/api';

export default function Cadastro({ setTelaAtual, setMensagem }) {
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState(''); // 👈 Alterado de username para matricula
  const [password, setPassword] = useState('');
  const [cargo, setCargo] = useState('AGENTE_CAMPO');

  const handleCadastro = async (e) => {
    e.preventDefault();
    setMensagem('');

    try {
      // 🚀 O payload agora envia a 'matricula' oficial como identificador único de login
      const response = await api.post('/usuarios', {
        nome, 
        matricula, 
        password, 
        cargo
      });

      if (response.status === 200 || response.status === 201) {
        setMensagem(`✅ Usuário ${response.data.nome} cadastrado com sucesso!`);
        setNome(''); setMatricula(''); setPassword('');
        setTelaAtual('login'); // Joga o usuário de volta para o login
      }
    } catch (error) {
      console.error(error);
      setMensagem('❌ Erro ao cadastrar usuário.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', background: '#222', padding: '25px', borderRadius: '8px', color: '#fff' }}>
      <h2>CVSA - Cadastro de Funcionários</h2>
      <form onSubmit={handleCadastro} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <div>
          <label>Nome Completo:</label>
          <input 
            type="text" 
            value={nome} 
            onChange={(e) => setNome(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px', background: '#333', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} 
          />
        </div>

        {/* 💳 INPUT DE LOGIN ATUALIZADO PARA MATRÍCULA */}
        <div>
          <label>Matrícula (Login Oficial):</label>
          <input 
            type="text" 
            value={matricula} 
            onChange={(e) => setMatricula(e.target.value)} 
            placeholder="Ex: 4036465"
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px', background: '#333', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} 
          />
        </div>

        <div>
          <label>Senha:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px', background: '#333', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} 
          />
        </div>

        <div>
          <label>Cargo / Nível de Acesso:</label>
          <select 
            value={cargo} 
            onChange={(e) => setCargo(e.target.value)} 
            style={{ width: '100%', padding: '8px', marginTop: '5px', background: '#333', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}
          >
            <option value="AGENTE_CAMPO">Agente de Campo</option>
            <option value="EQUIPE_TECNICA">Equipe Técnica (Biólogos/Veterinários)</option>
            <option value="GESTAO">Gestão (Diretor/Coordenadora)</option>
          </select>
        </div>

        <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '4px' }}>
          Salvar no Banco de Dados
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '15px', color: '#ccc' }}>
        Já tem conta?{' '}
        <button 
          onClick={() => { setTelaAtual('login'); setMensagem(''); }} 
          style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' }}
        >
          Voltar para o Login
        </button>
      </p>
    </div>
  );
}