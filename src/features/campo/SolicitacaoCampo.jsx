import React from 'react';
import './SolicitacaoCampo.css'; // Você pode copiar o CSS do MenuBoletins para este arquivo

export default function SolicitacaoCampo({ setTelaAtual }) {
  
  const handleKeyDown = (e, rota) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setTelaAtual(rota);
    }
  };

  return (
    <div className="menu-container">
      
      {/* 🏛️ Cabeçalho Padrão Gov.br */}
      <div className="header-boletins">
        <button
          className="btn-voltar"
          type="button"
          aria-label="Voltar para o menu principal"
          onClick={() => setTelaAtual('campo_menu')}
        >
          <i className="fas fa-arrow-left" aria-hidden="true"></i>
          Voltar
        </button>
        
        <div className="titulos-header">
          <h2>Solicitação de Ordem de Serviço (O.S.)</h2>
          <p>Selecione a categoria para abertura da ordem de serviço de campo</p>
        </div>
      </div>

      {/* 🏛️ Grade de Cards Horizontais */}
      <div className="grade-boletins">


         {/* Opção 1: Arboviroses */}
        <div
          className="card-boletim"
          role="button"
          tabIndex="0"
          onClick={() => setTelaAtual('os_arboviroses')}
          onKeyDown={(e) => handleKeyDown(e, 'os_arboviroses')}
        >
          <div className="area-icone">
            <i className="fas fa-virus" aria-hidden="true"></i>
          </div>
          <div className="conteudo-boletim">
            <h3>Arboviroses</h3>
            <p>Abertura de O.S. para focos de Dengue, Zika, Chikungunya e vistorias estratégicas.</p>
          </div>
        </div>

         {/* Opção 2: Sinantrópicos e Peçonhentos */}
        <div
          className="card-boletim"
          role="button"
          tabIndex="0"
          onClick={() => setTelaAtual('os_sinantropicos_peconhentos')}
          onKeyDown={(e) => handleKeyDown(e, 'os_sinantropicos_peconhentos')}
        >
          <div className="area-icone">
            <i className="fas fa-spider" aria-hidden="true"></i>
          </div>
          <div className="conteudo-boletim">
            <h3>Sinantrópicos e Peçonhentos</h3>
            <p>Demandas para controle de escorpiões, aranhas, morcegos, pombos e roedores.</p>
          </div>
        </div>

        {/* Opção 3: Animais Domésticos */}
        <div
          className="card-boletim"
          role="button"
          tabIndex="0"
          onClick={() => setTelaAtual('os_animais_domesticos')}
          onKeyDown={(e) => handleKeyDown(e, 'os_animais_domesticos')}
        >
          <div className="area-icone">
            <i className="fas fa-paw" aria-hidden="true"></i>
          </div>
          <div className="conteudo-boletim">
            <h3>Animais Domésticos</h3>
            <p>Solicitações envolvendo cães, gatos e controle populacional/zoonoses.</p>
          </div>
        </div>

      </div>
    </div>
  );
}