import React, { useState } from 'react';
import './SolicitarBloqueio.css';

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
      nome_municipe: solicitante,
      endereco,
      bairro,
      referencia,
      telefone,
      assunto,
      agente_registro: matriculaAgente 
    };

    console.log("🚨 Disparando para o Responsável Técnico:", payload);

    alert(`✅ Solicitação de bloqueio registrada com sucesso!\nMorador: ${solicitante}\nBairro: ${bairro}`);
    
    // Devolve o agente para o menu principal após o envio
    setTelaAtual('campo_menu');
  };

  return (
    <div className="bloqueio-container">
      
      {/* 🏛️ Cabeçalho */}
      <div className="bloqueio-header">
        <button
          className="btn-voltar"
          type="button"
          onClick={() => setTelaAtual('campo_menu')}
        >
          <i className="fas fa-arrow-left" aria-hidden="true"></i>
          Voltar
        </button>
        <h2>
          <i className="fas fa-bullhorn" aria-hidden="true"></i>
          Solicitar Bloqueio
        </h2>
      </div>

      <p className="bloqueio-instrucao">
        Preencha os dados do local e do munícipe. Esta notificação será enviada diretamente para a triagem do Responsável Técnico.
      </p>

      {/* 📝 Formulário */}
      <form onSubmit={handleSolicitar} className="bloqueio-form">
        
        {/* 1. Solicitante */}
        <div className="bloqueio-grupo">
          <label htmlFor="solicitante">Nome do Solicitante (Munícipe):</label>
          <input
            id="solicitante"
            type="text"
            className="bloqueio-input"
            value={solicitante}
            onChange={(e) => setSolicitante(e.target.value)}
            placeholder="Ex: Maria José da Silva"
            required
          />
        </div>

        {/* 2. Endereço */}
        <div className="bloqueio-grupo">
          <label htmlFor="endereco">Endereço do Foco:</label>
          <input
            id="endereco"
            type="text"
            className="bloqueio-input"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            placeholder="Ex: Rua das Flores, Lote 12"
            required
          />
        </div>

        {/* 3. Bairro */}
        <div className="bloqueio-grupo">
          <label htmlFor="bairro">Bairro:</label>
          <input
            id="bairro"
            type="text"
            className="bloqueio-input"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            placeholder="Ex: Jardim Aeroporto"
            required
          />
        </div>

        {/* 4. Referência */}
        <div className="bloqueio-grupo">
          <label htmlFor="referencia">Ponto de Referência:</label>
          <input
            id="referencia"
            type="text"
            className="bloqueio-input"
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
            placeholder="Ex: Em frente à borracharia do Zé"
            required
          />
        </div>

        {/* 5. Telefone */}
        <div className="bloqueio-grupo">
          <label htmlFor="telefone">Telefone de Contato:</label>
          <input
            id="telefone"
            type="tel"
            className="bloqueio-input"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="Ex: (65) 99999-9999"
            required
          />
        </div>

        <button type="submit" className="btn-enviar-bloqueio">
          <i className="fas fa-paper-plane" aria-hidden="true"></i>
          Enviar Solicitação
        </button>

      </form>
    </div>
  );
}