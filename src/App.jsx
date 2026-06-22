import { useState, useEffect } from 'react';
import './App.css';
import { db } from './core/dbLocal';
import { Network } from '@capacitor/network'; // 👈 Importação do plugin de rede nativo
import Login from './features/auth/Login';
import Cadastro from './features/tecnica/CadastroUsuario.jsx'
import CampoMenu from './features/campo/CampoMenu';
import GestaoDashboard from './features/gestao/GestaoDashboard';
import CampoDashboard from './features/campo/CampoDashboard';
import TecnicaDashboard from './features/tecnica/PainelTecnico.jsx';
import ResumoSemanal from './features/campo/ResumoSemanal';
import Ovitrampa from './features/campo/Ovitrampa.jsx';
import DistribuidorTrabalho from './features/tecnica/DistribuidorTrabalho';
import MenuBoletins from './features/campo/MenuBoletins.jsx';
import SolicitarBloqueio from './features/campo/SolicitarBloqueio';
import BoletimBloqueio from './features/campo/BoletimBloqueio';
import BoletimPE from './features/campo/BoletimPE.jsx';

function App() {
  const [telaAtual, setTelaAtual] = useState('login');
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    // Essa linha força o navegador a "acordar" e criar o banco visivelmente
    db.open().then(() => {
      console.log("Banco de dados criado e aberto com sucesso!");
    }).catch(err => {
      console.error("Erro ao abrir o banco:", err);
    });
  }, []);

  // 🛡️ REFRESH DE SEGURANÇA: Se der F5, o agente vai direto para o MENU agora
  useEffect(() => {
    const cargoSalvo = localStorage.getItem('userCargo');
    if (cargoSalvo) {
      if (cargoSalvo === 'GESTAO') setTelaAtual('gestao');
      else if (cargoSalvo === 'TECNICO') setTelaAtual('tecnica');
      else if (cargoSalvo === 'AGENTE_CAMPO') setTelaAtual('campo_menu'); // Direct para o Menu!
    }
  }, []);

  // 🔄 OUVINTE DE REDE: Dispara a sincronização assim que o Wi-Fi conecta
  useEffect(() => {
    const ouvinteRede = Network.addListener('networkStatusChange', async (status) => {
      // Executa apenas se houver conectividade e se o tipo for Wi-Fi
      if (status.connected && status.connectionType === 'wifi') {
        console.log('🔄 Wi-Fi detectado! Iniciando sincronização automática...');
        await executarSincronizacaoSilenciosa();
      }
    });

    return () => {
      ouvinteRede.remove();
    };
  }, []);

  // 🚀 ENGINE DE SINCRONIZAÇÃO AUTOMÁTICA (PUSH & PULL)
  const executarSincronizacaoSilenciosa = async () => {
    const loginAgente = localStorage.getItem('userLogin');
    if (!loginAgente) return;

    try {
      // ========================================================
      // ETAPA PUSH: Descarrega os malotes fechados no Dexie para o Java
      // ========================================================
      const resumos = await db.resumos_pendentes_envio.toArray();
      if (resumos.length > 0) {
        const resPush = await fetch('https://sistema-uvz-backend.onrender.com/api/resumos/lote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(resumos)
        });
        
        if (resPush.ok) {
          // Limpa a tabela de envios locais se o servidor confirmou o recebimento
          await db.resumos_pendentes_envio.bulkDelete(resumos.map(r => r.id));
          console.log('✅ Resumos pendentes enviados e limpos do armazenamento local.');
        }
      }

      // ========================================================
      // ETAPA PULL: Coleta as fichas rateadas de mutirões do servidor
      // ========================================================
      const resPull = await fetch(`https://sistema-uvz-backend.onrender.com/api/visitas/parceiro/${loginAgente}`);
      if (resPull.ok) {
        const fichasNovas = await resPull.json();
        
        if (fichasNovas.length > 0) {
          // Aloca as frações da produção direto na gaveta do agente parceiro
          await db.fichas_soltas.bulkAdd(fichasNovas);
          console.log(`✅ ${fichasNovas.length} fichas de parceria adicionadas ao Dexie.`);
          
          // Confirma a baixa do lote no backend para evitar duplicidade no próximo ciclo
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

      {telaAtual === 'cadastro' && (
        <Cadastro setTelaAtual={setTelaAtual} setMensagem={setMensagem} />
      )}

      {telaAtual === 'tecnica' && (
       <TecnicaDashboard setTelaAtual={setTelaAtual} />
      )}

      {telaAtual === 'gestao' && (
        <GestaoDashboard setTelaAtual={setTelaAtual} />
      )}

      {/* ROTEAMENTO DO AGENTE DE CAMPO */}
      {telaAtual === 'campo_menu' && (
        <CampoMenu setTelaAtual={setTelaAtual} />
      )}

      {telaAtual === 'menu_boletins' && (
        <MenuBoletins setTelaAtual={setTelaAtual} />
      )}

      {telaAtual === 'solicitar_bloqueio' && (
        <SolicitarBloqueio setTelaAtual={setTelaAtual} />
      )}

      {telaAtual === 'campo_formulario_zoonoses' && (
        <CampoDashboard setTelaAtual={setTelaAtual} />
      )}

      {telaAtual === 'boletim_bloqueio' && (
        <BoletimBloqueio setTelaAtual={setTelaAtual} />
      )}

      {telaAtual === 'boletim_pe' && (
        <BoletimPE setTelaAtual={setTelaAtual} />
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