import { useState } from 'react';
// import { db } from '../../core/dbLocal'; <-- Deixando preparado para o Dexie

export function useOvitrampa() {
    // 1. ESTADO BASE (Mockup avançado, pronto para ser substituído pelo Dexie)
    const [moradores, setMoradores] = useState([
        { id: 1, nome: 'Maria Oliveira', endereco: 'Rua das Flores, 105', quarteirao: '012A', armadilha: 'OV-098', status: 'INSTALADA' },
        { id: 2, nome: 'José dos Santos', endereco: 'Av. Central, 440', quarteirao: '005', armadilha: 'OV-042', status: 'AGUARDANDO_COLETA_2' },
        { id: 3, nome: 'Ana Souza', endereco: 'Rua Cuiabá, 12', quarteirao: '022', armadilha: 'OV-115', status: 'PRONTA_LEITURA' },
        { id: 4, nome: 'Carlos Lima', endereco: 'Travessa 3, s/n', quarteirao: '014', armadilha: '-', status: 'SEM_ARMADILHA' },
    ]);

    // 2. ESTADOS DOS FILTROS DA TELA
    const [termoBusca, setTermoBusca] = useState('');
    const [filtroQuarteirao, setFiltroQuarteirao] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('Todos os Status');

    // 3. FUNÇÕES DE AÇÃO RÁPIDA (CRUD)
    const removerMorador = (id) => {
        const confirmacao = window.confirm("Tem certeza que deseja remover a armadilha deste imóvel?");
        if (confirmacao) {
            setMoradores(moradores.filter((morador) => morador.id !== id));
            // No futuro: await db.ovitrampas.delete(id);
        }
    };

    const avancarCicloArmadilha = (id, acao) => {
        console.log(`Registrando [${acao}] para a armadilha no imóvel ID: ${id}`);
        // Aqui entrará a lógica de mudar de INSTALADA para AGUARDANDO_COLETA_2, etc.
        alert(`Ação "${acao}" registrada no tablet!`);
    };

    // 4. MOTOR DE FILTRAGEM (O que a tela realmente vai desenhar)
    const moradoresFiltrados = moradores.filter(m => {
        const bateBusca = m.endereco.toLowerCase().includes(termoBusca.toLowerCase()) || 
                          m.nome.toLowerCase().includes(termoBusca.toLowerCase());
        
        const bateQuarteirao = filtroQuarteirao === '' || m.quarteirao.includes(filtroQuarteirao);
        
        const bateStatus = filtroStatus === 'Todos os Status' ||
                           (filtroStatus === 'Instaladas' && m.status === 'INSTALADA') ||
                           (filtroStatus === 'Prontas para Leitura' && m.status === 'PRONTA_LEITURA');

        return bateBusca && bateQuarteirao && bateStatus;
    });

    return {
        moradoresFiltrados,
        termoBusca, setTermoBusca,
        filtroQuarteirao, setFiltroQuarteirao,
        filtroStatus, setFiltroStatus,
        removerMorador,
        avancarCicloArmadilha
    };
}