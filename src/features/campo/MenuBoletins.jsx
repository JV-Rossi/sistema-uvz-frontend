import React from 'react';
import './MenuBoletins.css';

export default function MenuBoletins({ setTelaAtual }) {
  
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
          <h2>Boletins de Trabalho</h2>
          <p>Selecione o tipo de boletim que deseja preencher</p>
        </div>
      </div>

      {/* 🏛️ Grade de Cards Horizontais */}
      <div className="grade-boletins">

        {/* Opção 1: Rotina Normal */}
        <div
          className="card-boletim"
          role="button"
          tabIndex="0"
          onClick={() => setTelaAtual('campo_formulario_zoonoses')}
          onKeyDown={(e) => handleKeyDown(e, 'campo_formulario_zoonoses')}
        >
          <div className="area-icone">
            <i className="fas fa-clipboard-list" aria-hidden="true"></i>
          </div>
          <div className="conteudo-boletim">
            <h3>Rotina (Visita Domiciliar)</h3>
            <p>Boletim padrão para registro de visitas do ciclo normal.</p>
          </div>
        </div>

        {/* Opção 2: Pontos Estratégicos */}
        <div
          className="card-boletim"
          role="button"
          tabIndex="0"
          onClick={() => setTelaAtual('boletim_pe')}
          onKeyDown={(e) => handleKeyDown(e, 'boletim_pe')}
        >
          <div className="area-icone">
            <i className="fas fa-industry" aria-hidden="true"></i>
          </div>
          <div className="conteudo-boletim">
            <h3>Pontos Estratégicos (PE)</h3>
            <p>Boletim quinzenal para borracharias, ferros-velhos e cemitérios.</p>
          </div>
        </div>

        {/* Opção 3: Execução de Bloqueio */}
        <div
          className="card-boletim"
          role="button"
          tabIndex="0"
          onClick={() => setTelaAtual('boletim_bloqueio')}
          onKeyDown={(e) => handleKeyDown(e, 'boletim_bloqueio')}
        >
          <div className="area-icone">
            <i className="fas fa-bullseye" aria-hidden="true"></i>
          </div>
          <div className="conteudo-boletim">
            <h3>Execução de Bloqueio</h3>
            <p>Acessar bloqueios pendentes e registrar a execução de campo.</p>
          </div>
        </div>

      </div>
    </div>
  );
}