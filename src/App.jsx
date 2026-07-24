import { useState, useEffect } from 'react';
import './App.css';
import { db } from './core/dbLocal';
import { Network } from '@capacitor/network'; 

// 📁 AUTENTICAÇÃO E GESTÃO
import Login from './features/auth/Login';
import RecuperarSenha from './features/auth/RecuperarSenha';
import PainelGestao from './features/gestao/PainelGestao.jsx';

// 📁 MÓDULO TÉCNICO (Caminhos atualizados)
import PainelTecnico from './features/tecnica/PainelTecnico.jsx';
import Cadastro from './features/tecnica/administrativo/CadastroUsuario.jsx';
import GerenciarUsuarios from './features/tecnica/administrativo/GerenciarUsuarios';
import DistribuidorTrabalho from './features/tecnica/supervisao/DistribuidorTrabalho';
import GeradorReuniaoSemanal from './features/tecnica/supervisao/GeradorReuniaoSemanal';
import ProgramacaoBloqueios from './features/tecnica/supervisao/ProgramacaoBloqueios';

// 📁 MÓDULO DE CAMPO
import MenuCampo from './features/campo/MenuCampo';
import MenuBoletins from './features/campo/MenuBoletins.jsx';
import BoletimRotina from './features/campo/BoletimRotina';
import BoletimBloqueio from './features/campo/BoletimBloqueio';
import BoletimPE from './features/campo/BoletimPE.jsx';
import BoletimLira from './features/campo/BoletimLira.jsx';
import OrdemServicoCampo from './features/campo/OrdemServicoCampo.jsx';
import ResumoSemanal from './features/campo/ResumoSemanal';
import Ovitrampa from './features/campo/Ovitrampa.jsx';

function App() {
  const [telaAtual, setTelaAtual] = useState('login');
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    // Força o navegador a abrir e inicializar o IndexedDB local (Dexie)
    db.open().then(() => {
      console.log("Banco de dados criado e aberto com sucesso!");
    }).catch(err => {
      console.error("Erro ao abrir o banco:", err);
    });
  }, []);

  // 🛡️ REFRESH DE SEGURANÇA: Se der F5, redireciona para a tela correspondente do perfil
  useEffect(() => {
    const cargoSalvo = localStorage.getItem('userCargo');
    if (cargoSalvo) {
      if (cargoSalvo === 'GESTAO') setTelaAtual('gestao');
      else if (cargoSalvo === 'TECNICO') setTelaAtual('tecnica');
      else if (cargoSalvo === 'AGENTE_CAMPO') setTelaAtual('campo_menu');
    }
  }, []);

  // 🔄 OUVINTE DE REDE: Dispara a sincronização assim que o Wi-Fi conecta
  useEffect(() => {
    const ouvinteRedePromise = Network.addListener('networkStatusChange', async (status) => {
      if (status.connected && status.connectionType === 'wifi') {
        console.log('🔄 Wi-Fi detectado! Iniciando sincronização automática...');
        await executarSincronizacaoSilenciosa();
      }
    });

    return () => {
      ouvinteRedePromise.then(handle => {
        if (handle) {
          handle.remove();
        }
      });
    };
  }, []);

  // 🚀 ENGINE DE SINCRONIZAÇÃO AUTOMÁTICA (PUSH & PULL)
  const executarSincronizacaoSilenciosa = async () => {
    const loginAgente = localStorage.getItem('userLogin');
    if (!loginAgente) return;

    try {
      // 1. PUSH: Envia resumos acumulados no Dexie para o servidor
      const resumos = await db.resumos_pendentes_envio.toArray();
      if (resumos.length > 0) {
        const resPush = await fetch('https://sistema-uvz-backend.onrender.com/api/resumos/lote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(resumos)
        });

        if (resPush.ok) {
          await db.resumos_pendentes_envio.bulkDelete(resumos.map(r => r.id));
          console.log('✅ Resumos pendentes enviados e limpos do armazenamento local.');
        }
      }

      // 2. PULL: Busca fichas rateadas de mutirão atribuídas ao agente
      const resPull = await fetch(`https://sistema-uvz-backend.onrender.com/api/visitas/parceiro/${loginAgente}`);
      if (resPull.ok) {
        const fichasNovas = await resPull.json();

        if (fichasNovas.length > 0) {
          await db.fichas_soltas.bulkAdd(fichasNovas);
          console.log(`✅ ${fichasNovas.length} fichas de parceria adicionadas ao Dexie.`);

          await fetch(`https://sistema-uvz-backend.onrender.com/api/visitas/parceiro/confirmar/${loginAgente}`, {
            method: 'POST'
          });
        }
      }
    } catch (error) {
      console.error('Falha na sincronização silenciosa:', error);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh' }}>

      {telaAtual === 'login' && (
        <Login setTelaAtual={setTelaAtual} setMensagem={setMensagem} />
      )}

      {telaAtual === 'recuperar_senha' && (
        <RecuperarSenha setTelaAtual={setTelaAtual} />
      )}

      {telaAtual === 'cadastro' && (
        <Cadastro setTelaAtual={setTelaAtual} setMensagem={setMensagem} />
      )}

      {telaAtual === 'gerenciar_equipe' && (
        <GerenciarUsuarios setTelaAtual={setTelaAtual} />
      )}

      {telaAtual === 'programacao_bloqueios' && (
        <ProgramacaoBloqueios setTelaAtual={setTelaAtual} />
      )}

      {telaAtual === 'tecnica' && (
        <PainelTecnico setTelaAtual={setTelaAtual} />
      )}

      {telaAtual === 'gestao' && (
        <PainelGestao setTelaAtual={setTelaAtual} />
      )}

      {/* ROTEAMENTO DO AGENTE DE CAMPO */}
      {telaAtual === 'campo_menu' && (
        <MenuCampo setTelaAtual={setTelaAtual} />
      )}

      {telaAtual === 'menu_boletins' && (
        <MenuBoletins setTelaAtual={setTelaAtual} />
      )}

      {telaAtual === 'campo_formulario' && (
        <OrdemServicoCampo setTelaAtual={setTelaAtual} />
      )}

      {telaAtual === 'campo_formulario_zoonoses' && (
        <BoletimRotina setTelaAtual={setTelaAtual} />
      )}

      {telaAtual === 'boletim_bloqueio' && (
        <BoletimBloqueio setTelaAtual={setTelaAtual} />
      )}

      {telaAtual === 'boletim_pe' && (
        <BoletimPE setTelaAtual={setTelaAtual} />
      )}

      {telaAtual === 'boletim_lira' && (
        <BoletimLira setTelaAtual={setTelaAtual} />
      )}

      {telaAtual === 'resumo_semanal' && (
        <ResumoSemanal setTelaAtual={setTelaAtual} />
      )}

      {telaAtual === 'ovitrampas' && (
        <Ovitrampa setTelaAtual={setTelaAtual} />
      )}

      {/* MENSAGEM DE STATUS */}
      {(telaAtual === 'login' || telaAtual === 'cadastro') && mensagem && (
        <p style={{ marginTop: '20px', fontWeight: 'bold', textAlign: 'center', color: '#ffc107' }}>
          {mensagem}
        </p>
      )}

    </div>
  );
}

export default App;