import React from 'react';

export default function MenuBoletins({ setTelaAtual }) {
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
        <h2 style={{ margin: 0 }}>Boletins de Trabalho</h2>
      </div>

      <p style={{ color: '#ccc', marginBottom: '25px', fontSize: '16px' }}>
        Selecione o tipo de boletim que deseja preencher:
      </p>

      {/* 🔀 Opções de Boletins */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

        {/* Opção 1: Rotina Normal (LIRAa/LI) */}
        <div
          onClick={() => setTelaAtual('campo_formulario_zoonoses')} // 👈 Rota do seu form de visitas normal
          style={{ background: '#222', padding: '20px', borderRadius: '12px', cursor: 'pointer', border: '1px solid #333', display: 'flex', alignItems: 'center', gap: '20px' }}
        >
          <div style={{ fontSize: '30px', background: '#f39c12', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>📝</div>
          <div>
            <strong style={{ fontSize: '18px', display: 'block', marginBottom: '5px' }}>Rotina (Visita Domiciliar)</strong>
            <small style={{ color: '#aaa', fontSize: '13px', lineHeight: '1.4', display: 'block' }}>
              Boletim padrão para registro de visitas do ciclo normal.
            </small>
          </div>
        </div>

        {/* Opção 2: Pontos Estratégicos */}
        <div
          onClick={() => setTelaAtual('boletim_pe')} // 👈 Rota ligada!
          style={{ background: '#222', padding: '20px', borderRadius: '12px', cursor: 'pointer', border: '1px solid #333', display: 'flex', alignItems: 'center', gap: '20px' }}
        >
          <div style={{ fontSize: '30px', background: '#9b59b6', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>🏭</div>
          <div>
            <strong style={{ fontSize: '18px', display: 'block', marginBottom: '5px' }}>Pontos Estratégicos (PE)</strong>
            <small style={{ color: '#aaa', fontSize: '13px', lineHeight: '1.4', display: 'block' }}>
              Boletim quinzenal para borracharias, ferros-velhos e cemitérios.
            </small>
          </div>
        </div>

        {/* Opção 3: Execução de Bloqueio */}
        <div
          onClick={() => setTelaAtual('boletim_bloqueio')}
          style={{ background: '#222', padding: '20px', borderRadius: '12px', cursor: 'pointer', border: '1px solid #333', display: 'flex', alignItems: 'center', gap: '20px' }}
        >
          <div style={{ fontSize: '30px', background: '#3498db', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>🎯</div>
          <div>
            <strong style={{ fontSize: '18px', display: 'block', marginBottom: '5px' }}>Execução de Bloqueio</strong>
            <small style={{ color: '#aaa', fontSize: '13px', lineHeight: '1.4', display: 'block' }}>
              Acessar bloqueios pendentes e registrar a execução de campo.
            </small>
          </div>
        </div>

      </div>
    </div>
  );
}