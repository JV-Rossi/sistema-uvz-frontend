import React, { useState } from 'react';

export default function SolicitarBloqueio({ setTelaAtual }) {
  // 📝 Estados para capturar os dados do formulário
  const [solicitante, setSolicitante] = useState('');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [referencia, setReferencia] = useState('');
  const [telefone, setTelefone] = useState('');

  // 🕵️‍♂️ Dados invisíveis que vão junto com o pacote
  const assunto = 'Controle Aedes';

  const handleSolicitar = (e) => {
    e.preventDefault();

    // Captura quem está logado no tablet na hora do envio
    const matriculaAgente = localStorage.getItem('userMatricula') || 'Desconhecido';

    // 📦 Pacote de dados estruturado que vai para o Java/Supabase
    const payload = {
      nome_municipe: solicitante, // O morador
      endereco,
      bairro,
      referencia,
      telefone,
      assunto,
      agente_registro: matriculaAgente // O agente que preencheu a ficha
    };

    // (Temporário) Apenas para você ver o pacote invisível funcionando no F12
    console.log("🚨 Disparando para o Responsável Técnico:", payload);

    alert(`✅ Solicitação de bloqueio registrada com sucesso!\nMorador: ${solicitante}\nBairro: ${bairro}`);
    
    // Devolve o agente para o menu principal após o envio
    setTelaAtual('campo_menu');
  };

  return (
    <div style={{ padding: '20px', color: '#fff', maxWidth: '600px', margin: '0 auto' }}>
      
      {/* 🔙 Cabeçalho */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', gap: '15px' }}>
        <button
          onClick={() => setTelaAtual('campo_menu')}
          style={{ background: '#444', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          ⬅ Voltar
        </button>
        <h2 style={{ margin: 0, color: '#e74c3c' }}>🚨 Solicitar Bloqueio</h2>
      </div>

      <p style={{ color: '#ccc', marginBottom: '25px', fontSize: '15px', lineHeight: '1.5' }}>
        Preencha os dados do local e do munícipe. Esta notificação será enviada diretamente para a triagem do Responsável Técnico.
      </p>

      {/* 📝 Formulário */}
      <form onSubmit={handleSolicitar} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* 1. Solicitante (Munícipe) */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nome do Solicitante (Munícipe):</label>
          <input
            type="text"
            value={solicitante}
            onChange={(e) => setSolicitante(e.target.value)}
            placeholder="Ex: Maria José da Silva"
            required
            style={{ width: '100%', padding: '12px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '8px' }}
          />
        </div>

        {/* 2. Endereço */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Endereço do Foco:</label>
          <input
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            placeholder="Ex: Rua das Flores, Lote 12"
            required
            style={{ width: '100%', padding: '12px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '8px' }}
          />
        </div>

        {/* 3. Bairro */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Bairro:</label>
          <input
            type="text"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            placeholder="Ex: Jardim Aeroporto"
            required
            style={{ width: '100%', padding: '12px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '8px' }}
          />
        </div>

        {/* 4. Referência */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Ponto de Referência:</label>
          <input
            type="text"
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
            placeholder="Ex: Em frente à borracharia do Zé"
            required
            style={{ width: '100%', padding: '12px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '8px' }}
          />
        </div>

        {/* 5. Telefone */}
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Telefone de Contato:</label>
          <input
            type="tel"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="Ex: (65) 99999-9999"
            required
            style={{ width: '100%', padding: '12px', background: '#222', color: '#fff', border: '1px solid #444', borderRadius: '8px' }}
          />
        </div>

        <button 
          type="submit" 
          style={{ marginTop: '10px', background: '#e74c3c', color: '#fff', padding: '15px', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Enviar Solicitação
        </button>

      </form>
    </div>
  );
}