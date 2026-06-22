import React from 'react';

export default function MenuBloqueio({ setTelaAtual }) {
  return (
    <div style={{ padding: '20px', color: '#fff', maxWidth: '600px', margin: '0 auto' }}>
      
      {/* 🔙 Cabeçalho com botão de voltar */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', gap: '15px' }}>
        <button
          onClick={() => setTelaAtual('campo_menu')}
          style={{ background: '#444', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          ⬅ Voltar
        </button>
        <h2 style={{ margin: 0 }}>Bloqueio de Foco</h2>
      </div>

      <p style={{ color: '#ccc', marginBottom: '25px', fontSize: '16px' }}>
        Selecione a etapa do processo que deseja realizar:
      </p>

      {/* 🔀 Opções do Bloqueio */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* Opção 1: Solicitar */}
        <div
          onClick={() => setTelaAtual('solicitar_bloqueio')}
          style={{ background: '#222', padding: '20px', borderRadius: '12px', cursor: 'pointer', border: '1px solid #333', display: 'flex', alignItems: 'center', gap: '20px' }}
        >
          <div style={{ fontSize: '30px', background: '#e74c3c', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>🚨</div>
          <div>
            <strong style={{ fontSize: '18px', display: 'block', marginBottom: '5px' }}>Solicitar Bloqueio</strong>
            <small style={{ color: '#aaa', fontSize: '13px', lineHeight: '1.4', display: 'block' }}>
              Informar à base sobre um novo foco detectado que exige ação de bloqueio químico ou mecânico.
            </small>
          </div>
        </div>

        {/* Opção 2: Executar (Boletim) */}
        <div
          onClick={() => setTelaAtual('boletim_bloqueio')}
          style={{ background: '#222', padding: '20px', borderRadius: '12px', cursor: 'pointer', border: '1px solid #333', display: 'flex', alignItems: 'center', gap: '20px' }}
        >
          <div style={{ fontSize: '30px', background: '#3498db', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>📋</div>
          <div>
            <strong style={{ fontSize: '18px', display: 'block', marginBottom: '5px' }}>Boletim de Trabalho</strong>
            <small style={{ color: '#aaa', fontSize: '13px', lineHeight: '1.4', display: 'block' }}>
              Acessar os bloqueios pendentes da sua rota e preencher o boletim de execução de campo.
            </small>
          </div>
        </div>

      </div>
    </div>
  );
}