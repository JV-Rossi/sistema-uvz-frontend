import React, { useState, useEffect } from 'react';
import './OrdemServicoCampo.css';

export default function OrdemServicoCampo({ setTelaAtual }) {
  // Controla a navegação: 'menu', 'sub_arboviroses', 'form_bloqueio', 'form_inspecao', 'sinantropicos', 'animais'
  const [telaAtiva, setTelaAtiva] = useState('menu');

  // Estados Gerais comuns
  const [dataSolicitacao, setDataSolicitacao] = useState('');
  const [agenteSolicitante, setAgenteSolicitante] = useState('JOAO VITOR ROSSI');
  const [bairro, setBairro] = useState('');
  const [endereco, setEndereco] = useState('');
  const [quarteirao, setQuarteirao] = useState('');
  const [zona, setZona] = useState('');
  const [desmembramento, setDesmembramento] = useState('');
  const [observacoes, setObservacoes] = useState('');

  // Estados específicos: Bloqueio Focal
  const [nomeMunicipeSuspeita, setNomeMunicipeSuspeita] = useState('');
  const [telefone, setTelefone] = useState('');
  const [suspeita, setSuspeita] = useState('');
  const [dataSintomas, setDataSintomas] = useState('');

  // Estados específicos: Inspeção em Terreno Baldio / Acumuladores
  const [tipoLocal, setTipoLocal] = useState('TERRENO BALDIO'); // 'TERRENO BALDIO' ou 'ACUMULADOR'
  const [situacaoMato, setSituacaoMato] = useState('BAIXO'); // 'BAIXO', 'MEDIO', 'ALTO'
  const [lixoAcumulado, setLixoAcumulado] = useState(false);
  const [focoLarvasEncontrado, setFocoLarvasEncontrado] = useState(false);
  const [notificacaoEmitida, setNotificacaoEmitida] = useState(false);

  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState('');

  useEffect(() => {
    const hoje = new Date().toISOString().split('T')[0];
    setDataSolicitacao(hoje);
  }, [telaAtiva]);

  const handleVoltarMenuPrincipal = () => {
    setTelaAtiva('menu');
    setSucesso('');
  };

  const handleVoltarSubArboviroses = () => {
    setTelaAtiva('sub_arboviroses');
    setSucesso('');
  };

  const limparFormularioGeral = () => {
    setBairro(''); setEndereco(''); setQuarteirao(''); setZona(''); setDesmembramento(''); setObservacoes('');
    setNomeMunicipeSuspeita(''); setTelefone(''); setSuspeita(''); setDataSintomas('');
    setTipoLocal('TERRENO BALDIO'); setSituacaoMato('BAIXO'); setLixoAcumulado(false);
    setFocoLarvasEncontrado(false); setNotificacaoEmitida(false);
  };

  // Envio do Bloqueio Focal
  const handleSubmitBloqueio = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!bairro || !endereco || !quarteirao || !nomeMunicipeSuspeita || !suspeita || !dataSintomas) {
      alert("Por favor, preencha todos os campos obrigatórios (*).");
      setLoading(false);
      return;
    }

    const payload = {
      data: new Date().toLocaleDateString('pt-BR'),
      agente: agenteSolicitante,
      tipoOrdem: 'BLOQUEIO FOCAL',
      bairro: bairro.toUpperCase(),
      endereco: endereco.toUpperCase(),
      quarteirao, zona: zona.toUpperCase(), desmembramento: desmembramento.toUpperCase(),
      paciente: nomeMunicipeSuspeita.toUpperCase(), telefone, suspeita,
      dataSintomas: dataSintomas.split('-').reverse().join('/'),
      observacoes, status: 'pendente'
    };

    console.log("Transmitindo Bloqueio Focal ao RT:", payload);

    setTimeout(() => {
      setSucesso(`Solicitação de Bloqueio para ${nomeMunicipeSuspeita} enviada com sucesso!`);
      limparFormularioGeral();
      setLoading(false);
      setTimeout(() => setTelaAtiva('menu'), 2500);
    }, 800);
  };

  // Envio da Inspeção de Terreno/Acumulador
  const handleSubmitInspecao = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!bairro || !endereco || !quarteirao) {
      alert("Por favor, preencha todos os campos obrigatórios (*).");
      setLoading(false);
      return;
    }

    const payload = {
      data: new Date().toLocaleDateString('pt-BR'),
      agente: agenteSolicitante,
      tipoOrdem: `INSPEÇÃO - ${tipoLocal}`,
      bairro: bairro.toUpperCase(),
      endereco: endereco.toUpperCase(),
      quarteirao, zona: zona.toUpperCase(), desmembramento: desmembramento.toUpperCase(),
      dadosInspecao: {
        situacaoMato,
        lixoAcumulado,
        focoLarvasEncontrado,
        notificacaoEmitida
      },
      observacoes,
      status: 'pendente'
    };

    console.log("Transmitindo O.S. de Inspeção ao RT:", payload);

    setTimeout(() => {
      setSucesso(`Relatório de Inspeção em ${bairro} transmitido com sucesso!`);
      limparFormularioGeral();
      setLoading(false);
      setTimeout(() => setTelaAtiva('menu'), 2500);
    }, 800);
  };

  return (
    <div className="osc-wrapper">
      <main className="osc-content">

        {/* 📱 TELA 1: MENU PRINCIPAL DE CATEGORIAS */}
        {telaAtiva === 'menu' && (
          <div className="osc-menu-container">
            <header className="osc-header">
              <button
                className="btn-voltar"
                type="button"
                aria-label="Voltar para o menu principal"
                onClick={() => setTelaAtual('campo_menu')}
              >
                <i className="fas fa-arrow-left" aria-hidden="true"></i>
                Voltar
              </button>
              <h1 className="osc-title">Solicitação de Ordem de Serviço (O.S.)</h1>
              <p className="osc-subtitle">Selecione a categoria para abertura da ordem de serviço de campo</p>
              <hr className="osc-divider" />
            </header>

            <div className="osc-cards-grid">
              <div className="osc-card" onClick={() => setTelaAtiva('sub_arboviroses')}>
                <div className="osc-card-icon-wrapper"><i className="fas fa-virus"></i></div>
                <div className="osc-card-text">
                  <h3>Arboviroses</h3>
                  <p>Abertura de O.S. para focos de Dengue, Zika, Chikungunya, Terrenos Baldios e Acumuladores.</p>
                </div>
              </div>

              <div className="osc-card" onClick={() => setTelaAtiva('sinantropicos')}>
                <div className="osc-card-icon-wrapper"><i className="fas fa-spider"></i></div>
                <div className="osc-card-text">
                  <h3>Sinantrópicos e Peçonhentos</h3>
                  <p>Demandas para controle de escorpiões, aranhas, morcegos, pombos e roedores.</p>
                </div>
              </div>

              <div className="osc-card" onClick={() => setTelaAtiva('animais')}>
                <div className="osc-card-icon-wrapper"><i className="fas fa-paw"></i></div>
                <div className="osc-card-text">
                  <h3>Animais Domésticos</h3>
                  <p>Solicitações envolvendo cães, gatos e controle populacional/zoonoses.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 🔄 TELA INTERMEDIÁRIA: SUB-MENU ARBOVIROSES */}
        {telaAtiva === 'sub_arboviroses' && (
          <div className="osc-menu-container">
            <header className="osc-header">
              <button
                className="btn-voltar"
                type="button"
                aria-label="Voltar para o menu principal"
                onClick={() => setTelaAtual('campo_menu')}
              >
                <i className="fas fa-arrow-left" aria-hidden="true"></i>
                Voltar
              </button>
              <h1 className="osc-title">Setor de Arboviroses</h1>
              <p className="osc-subtitle">Selecione o tipo de ação técnica que deseja solicitar:</p>
              <hr className="osc-divider" />
            </header>

            <div className="osc-cards-grid">
              <div className="osc-card" onClick={() => setTelaAtiva('form_bloqueio')}>
                <div className="osc-card-icon-wrapper"><i className="fas fa-shield-alt"></i></div>
                <div className="osc-card-text">
                  <h3>Solicitação de Bloqueio Focal</h3>
                  <p>Direcionado exclusivamente por notificação de caso clínico suspeito (Dengue, Zika, Chikungunya).</p>
                </div>
              </div>

              <div className="osc-card" onClick={() => setTelaAtiva('form_inspecao')}>
                <div className="osc-card-icon-wrapper"><i className="fas fa-trash-alt"></i></div>
                <div className="osc-card-text">
                  <h3>Inspeção em Terreno Baldio / Acumuladores</h3>
                  <p>Vistoria cartográfica de risco, imóveis críticos com acúmulo de lixo ou alta densidade de criadouros.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 📋 TELA 3: FORMULÁRIO 1 - BLOQUEIO FOCAL */}
        {telaAtiva === 'form_bloqueio' && (
          <div className="osc-form-container">
            <header className="osc-form-header">
              <button
                className="btn-voltar"
                type="button"
                aria-label="Voltar para o menu principal"
                onClick={() => setTelaAtual('campo_menu')}
              >
                <i className="fas fa-arrow-left" aria-hidden="true"></i>
                Voltar
              </button>
              <div>
                <h2 className="osc-form-title">Solicitação de Bloqueio Focal</h2>
                <p className="osc-form-subtitle">Vinculado a caso suspeito notificado.</p>
              </div>
            </header>

            {sucesso && <div className="osc-alerta-sucesso"><i className="fas fa-check-circle"></i> {sucesso}</div>}

            <form onSubmit={handleSubmitBloqueio} className="osc-formulario">
              <div className="osc-form-secao">1. Localidade e Cartografia</div>
              <div className="osc-form-linha">
                <div className="osc-form-group">
                  <label>Bairro <span className="obrigatorio">*</span></label>
                  <input type="text" placeholder="Nome do Bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} required />
                </div>
                <div className="osc-form-group">
                  <label>Quarteirão <span className="obrigatorio">*</span></label>
                  <input type="number" placeholder="Nº" value={quarteirao} onChange={(e) => setQuarteirao(e.target.value)} required />
                </div>
              </div>
              <div className="osc-form-linha">
                <div className="osc-form-group"><label>Zona</label><input type="text" placeholder="Urbana/Rural" value={zona} onChange={(e) => setZona(e.target.value)} /></div>
                <div className="osc-form-group"><label>Desmembramento</label><input type="text" placeholder="Código" value={desmembramento} onChange={(e) => setDesmembramento(e.target.value)} /></div>
              </div>
              <div className="osc-form-group">
                <label>Endereço Completo (Imóvel Notificado) <span className="obrigatorio">*</span></label>
                <input type="text" placeholder="Rua, Número, Quadra..." value={endereco} onChange={(e) => setEndereco(e.target.value)} required />
              </div>

              <div className="osc-form-secao mt-3">2. Identificação do Caso Notificado</div>
              <div className="osc-form-linha">
                <div className="osc-form-group">
                  <label>Nome do Munícipe (Paciente) <span className="obrigatorio">*</span></label>
                  <input type="text" placeholder="Nome completo" value={nomeMunicipeSuspeita} onChange={(e) => setNomeMunicipeSuspeita(e.target.value)} required />
                </div>
                <div className="osc-form-group">
                  <label>Telefone para Contato</label>
                  <input type="tel" placeholder="(65) 99999-9999" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                </div>
              </div>
              <div className="osc-form-linha">
                <div className="osc-form-group">
                  <label>Suspeita Clínica <span className="obrigatorio">*</span></label>
                  <select value={suspeita} onChange={(e) => setSuspeita(e.target.value)} required>
                    <option value="">Selecione...</option>
                    <option value="Dengue">Dengue</option>
                    <option value="Zika">Zika Vírus</option>
                    <option value="Chikungunya">Chikungunya</option>
                  </select>
                </div>
                <div className="osc-form-group">
                  <label>Início dos Sintomas (D1) <span className="obrigatorio">*</span></label>
                  <input type="date" value={dataSintomas} onChange={(e) => setDataSintomas(e.target.value)} required />
                </div>
              </div>
              <div className="osc-form-group">
                <label>Observações de Campo</label>
                <textarea rows="2" placeholder="Observações importantes sobre o caso..." value={observacoes} onChange={(e) => setObservacoes(e.target.value)}></textarea>
              </div>
              <div className="osc-form-footer">
                <button type="submit" className="osc-btn-enviar" disabled={loading}>
                  {loading ? <><i className="fas fa-spinner fa-spin"></i> Enviando...</> : <><i className="fas fa-paper-plane"></i> Transmitir para o RT</>}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 📋 TELA 4: FORMULÁRIO 2 - INSPEÇÃO EM TERRENO BALDIO / ACUMULADORES */}
        {telaAtiva === 'form_inspecao' && (
          <div className="osc-form-container">
            <header className="osc-form-header">
              <button
                className="btn-voltar"
                type="button"
                aria-label="Voltar para o menu principal"
                onClick={() => setTelaAtual('campo_menu')}
              >
                <i className="fas fa-arrow-left" aria-hidden="true"></i>
                Voltar
              </button>
              <div>
                <h2 className="osc-form-title">Inspeção de Risco (Terreno / Acumulador)</h2>
                <p className="osc-form-subtitle">Lançamento de focos de degradação e imóveis de monitoramento crítico.</p>
              </div>
            </header>

            {sucesso && <div className="osc-alerta-sucesso"><i className="fas fa-check-circle"></i> {sucesso}</div>}

            <form onSubmit={handleSubmitInspecao} className="osc-formulario">
              <div className="osc-form-secao">1. Localidade e Cartografia</div>
              <div className="osc-form-linha">
                <div className="osc-form-group">
                  <label>Bairro <span className="obrigatorio">*</span></label>
                  <input type="text" placeholder="Nome do Bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} required />
                </div>
                <div className="osc-form-group">
                  <label>Quarteirão <span className="obrigatorio">*</span></label>
                  <input type="number" placeholder="Nº" value={quarteirao} onChange={(e) => setQuarteirao(e.target.value)} required />
                </div>
              </div>
              <div className="osc-form-linha">
                <div className="osc-form-group"><label>Zona</label><input type="text" placeholder="Urbana/Rural" value={zona} onChange={(e) => setZona(e.target.value)} /></div>
                <div className="osc-form-group"><label>Desmembramento</label><input type="text" placeholder="Código" value={desmembramento} onChange={(e) => setDesmembramento(e.target.value)} /></div>
              </div>
              <div className="osc-form-group">
                <label>Endereço Completo do Imóvel Inspecionado <span className="obrigatorio">*</span></label>
                <input type="text" placeholder="Rua, Número, Referência do local..." value={endereco} onChange={(e) => setEndereco(e.target.value)} required />
              </div>

              <div className="osc-form-secao mt-3">2. Situação Encontrada na Vistoria</div>
              <div className="osc-form-linha">
                <div className="osc-form-group">
                  <label>Classificação do Local <span className="obrigatorio">*</span></label>
                  <select value={tipoLocal} onChange={(e) => setTipoLocal(e.target.value)} required>
                    <option value="TERRENO BALDIO">Terreno Baldio</option>
                    <option value="ACUMULADOR">Imóvel de Acumulador Crítico</option>
                  </select>
                </div>
                <div className="osc-form-group">
                  <label>Condição da Vegetação (Mato)</label>
                  <select value={situacaoMato} onChange={(e) => setSituacaoMato(e.target.value)}>
                    <option value="BAIXO">Mato Baixo</option>
                    <option value="MEDIO">Mato Médio</option>
                    <option value="ALTO">Mato Alto</option>
                  </select>
                </div>
              </div>

              {/* Checkboxes de Diagnóstico Rápido */}
              <div className="osc-form-checkboxes">
                <label className="osc-checkbox-label">
                  <input type="checkbox" checked={lixoAcumulado} onChange={(e) => setLixoAcumulado(e.target.checked)} />
                  <span>Presença de Lixo ou Entulho Acumulado</span>
                </label>
                <label className="osc-checkbox-label">
                  <input type="checkbox" checked={focoLarvasEncontrado} onChange={(e) => setFocoLarvasEncontrado(e.target.checked)} />
                  <span><strong>Foco de Larvas de Mosquito Encontrado</strong></span>
                </label>
              </div>

              <div className="osc-form-group">
                <label>Relato Descritivo das Condições Ambientais</label>
                <textarea rows="3" placeholder="Descreva os tipos de recipientes encontrados (pneus, garrafas, caixas d'água abertas), se o local possui dono identificado ou histórico de reclamações..." value={observacoes} onChange={(e) => setObservacoes(e.target.value)}></textarea>
              </div>

              <div className="osc-form-footer">
                <button type="submit" className="osc-btn-enviar-inspecao" disabled={loading}>
                  {loading ? <><i className="fas fa-spinner fa-spin"></i> Transmitindo...</> : <><i className="fas fa-save"></i> Registrar Boletim de Inspeção</>}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}