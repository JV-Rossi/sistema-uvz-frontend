import { useState } from 'react';

export function useOvitrampa() {
    // 1. ESTADO DA LISTA DE IMÓVEIS
    const [moradores, setMoradores] = useState([
        { id: 1, nome: 'Maria Oliveira', endereco: 'Rua das Flores, 105', quarteirao: '012A', armadilha: 'OV-098', status: 'INSTALADA', coordenadas: null },
        { id: 2, nome: 'José dos Santos', endereco: 'Av. Central, 440', quarteirao: '005', armadilha: 'OV-042', status: 'AGUARDANDO_COLETA_2', coordenadas: null },
    ]);

    // 2. ESTADOS DOS FILTROS
    const [termoBusca, setTermoBusca] = useState('');
    const [filtroQuarteirao, setFiltroQuarteirao] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('Todos os Status');

    // 3. ESTADOS PARA O NOVO CADASTRO E GPS
    const [modalCadastroAberto, setModalCadastroAberto] = useState(false);
    const [novoImovel, setNovoImovel] = useState({
        nome: '',
        endereco: '',
        quarteirao: '',
        armadilha: '',
        coordenadas: null // Preparado para receber o GPS
    });
    const [carregandoGPS, setCarregandoGPS] = useState(false);

    // 📍 FUNÇÃO CENTRAL DO GPS (Offline)
    const capturarGPS = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject("Seu dispositivo não suporta GPS.");
                return;
            }
            // enableHighAccuracy: true força o uso do chip GPS físico
            navigator.geolocation.getCurrentPosition(
                (posicao) => {
                    resolve({
                        lat: posicao.coords.latitude,
                        lng: posicao.coords.longitude
                    });
                },
                (erro) => {
                    reject(erro.message);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
            );
        });
    };

    // 📍 AÇÃO: Pegar GPS no Formulário de Novo Imóvel
    const handlePegarGPSNovo = async () => {
        setCarregandoGPS(true);
        try {
            const coords = await capturarGPS();
            setNovoImovel(prev => ({ ...prev, coordenadas: coords }));
        } catch (erro) {
            alert(`⚠️ Falha no GPS: Verifique se a Localização do tablet está ligada.\nErro técnico: ${erro}`);
        } finally {
            setCarregandoGPS(false);
        }
    };

    // 📍 AÇÃO: Atualizar GPS de um imóvel que já está na tabela
    const handleAtualizarGPSMorador = async (id) => {
        try {
            const coords = await capturarGPS();
            setMoradores(prev => prev.map(m => 
                m.id === id ? { ...m, coordenadas: coords } : m
            ));
            alert("📍 Localização do imóvel atualizada com sucesso!");
        } catch (erro) {
            alert("⚠️ Não foi possível capturar o GPS. Vá para uma área descoberta e tente novamente.");
        }
    };

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

        // Define o status inicial
        const temArmadilha = novoImovel.armadilha.trim() !== '';
        const novoRegistro = {
            id: Date.now(),
            nome: novoImovel.nome,
            endereco: novoImovel.endereco,
            quarteirao: novoImovel.quarteirao,
            armadilha: temArmadilha ? novoImovel.armadilha : '-',
            status: temArmadilha ? 'INSTALADA' : 'SEM_ARMADILHA',
            coordenadas: novoImovel.coordenadas // O GPS capturado é salvo aqui!
        };

        setMoradores([...moradores, novoRegistro]);
        setModalCadastroAberto(false);
        setNovoImovel({ nome: '', endereco: '', quarteirao: '', armadilha: '', coordenadas: null });
    };

    // 6. MOTOR DE FILTRAGEM (Protegido contra dados em branco)
    const moradoresFiltrados = moradores.filter(m => {
        const bateBusca = m.endereco?.toLowerCase().includes(termoBusca.toLowerCase()) || 
                          m.nome?.toLowerCase().includes(termoBusca.toLowerCase());
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
        handleSalvarNovoImovel,
        handlePegarGPSNovo,
        handleAtualizarGPSMorador,
        carregandoGPS
    };
}