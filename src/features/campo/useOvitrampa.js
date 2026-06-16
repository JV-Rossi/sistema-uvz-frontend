import { useState } from 'react';

export function useOvitrampa() {
    // 1. ESTADO DA LISTA DE IMÓVEIS
    const [moradores, setMoradores] = useState([
        { id: 1, nome: 'Maria Oliveira', endereco: 'Rua das Flores, 105', quarteirao: '012A', armadilha: 'OV-098', status: 'INSTALADA' },
        { id: 2, nome: 'José dos Santos', endereco: 'Av. Central, 440', quarteirao: '005', armadilha: 'OV-042', status: 'AGUARDANDO_COLETA_2' },
        { id: 3, nome: 'Ana Souza', endereco: 'Rua Cuiabá, 12', quarteirao: '022', armadilha: 'OV-115', status: 'PRONTA_LEITURA' },
        { id: 4, nome: 'Carlos Lima', endereco: 'Travessa 3, s/n', quarteirao: '014', armadilha: '-', status: 'SEM_ARMADILHA' },
    ]);

    // 2. ESTADOS DOS FILTROS
    const [termoBusca, setTermoBusca] = useState('');
    const [filtroQuarteirao, setFiltroQuarteirao] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('Todos os Status');

    // 3. ESTADOS PARA O NOVO CADASTRO
    const [modalCadastroAberto, setModalCadastroAberto] = useState(false);
    const [novoImovel, setNovoImovel] = useState({
        nome: '',
        endereco: '',
        quarteirao: '',
        armadilha: ''
    });

    // 4. FUNÇÕES DE CICLO E EXCLUSÃO
    const removerMorador = (id) => {
        const confirmacao = window.confirm("Tem certeza que deseja remover a armadilha deste imóvel?");
        if (confirmacao) {
            setMoradores(moradores.filter((morador) => morador.id !== id));
        }
    };

    const avancarCicloArmadilha = (id, acao) => {
        setMoradores(prev => prev.map(m => {
            if (m.id === id) {
                if (acao === 'Registrar 1ª Coleta') return { ...m, status: 'AGUARDANDO_COLETA_2' };
                if (acao === 'Registrar 2ª Coleta') return { ...m, status: 'PRONTA_LEITURA' };
                if (acao === 'Lançar Ovos') return { ...m, status: 'SEM_ARMADILHA', armadilha: '-' };
                if (acao === 'Instalar Nova') {
                    const codigo = prompt("Digite o código da nova armadilha instalada:");
                    if (!codigo) return m;
                    return { ...m, status: 'INSTALADA', armadilha: codigo };
                }
            }
            return m;
        }));
    };

    // 5. FUNÇÃO PARA SALVAR O NOVO IMÓVEL NO ESTADO
    const handleSalvarNovoImovel = (e) => {
        e.preventDefault();
        
        if (!novoImovel.nome || !novoImovel.endereco || !novoImovel.quarteirao) {
            alert("⚠️ Por favor, preencha Nome, Endereço e Quarteirão.");
            return;
        }

        // Define o status inicial: se informou código de armadilha, entra como INSTALADA, se não, SEM_ARMADILHA
        const temArmadilha = novoImovel.armadilha.trim() !== '';
        const novoRegistro = {
            id: Date.now(), // ID temporário numérico
            nome: novoImovel.nome,
            endereco: novoImovel.endereco,
            quarteirao: novoImovel.quarteirao,
            armadilha: temArmadilha ? novoImovel.armadilha : '-',
            status: temArmadilha ? 'INSTALADA' : 'SEM_ARMADILHA'
        };

        setMoradores([...moradores, novoRegistro]);
        setModalCadastroAberto(false); // Fecha o formulário
        setNovoImovel({ nome: '', endereco: '', quarteirao: '', armadilha: '' }); // Reseta os campos
    };

    // 6. MOTOR DE FILTRAGEM
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
        modalCadastroAberto, setModalCadastroAberto,
        novoImovel, setNovoImovel,
        removerMorador,
        avancarCicloArmadilha,
        handleSalvarNovoImovel
    };
}