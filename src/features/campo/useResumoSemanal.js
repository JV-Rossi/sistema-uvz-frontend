import { useState, useEffect } from 'react';
import api from '../../core/api';
import { db } from '../../core/dbLocal';

export function useResumoSemanal(setTelaAtual) {
    const [matriz, setMatriz] = useState({
        seg_mat: [], seg_vesp: [],
        ter_mat: [], ter_vesp: [],
        qua_mat: [], qua_vesp: [],
        qui_mat: [], qui_vesp: [],
        sex_mat: [], sex_vesp: [],
    });

    const [quadranteAtivo, setQuadranteAtivo] = useState(null);
    const [fichasPendentes, setFichasPendentes] = useState([]);

    const periodosObrigatorios = [
        'seg_mat', 'seg_vesp', 'ter_mat', 'ter_vesp',
        'qua_mat', 'qua_vesp', 'qui_mat', 'qui_vesp',
        'sex_mat', 'sex_vesp'
    ];

    const calendarioPreenchido = periodosObrigatorios.every(periodo => 
        matriz[periodo] && matriz[periodo].length > 0
    );

    const carregarFichasDoCofre = async (matrizAtual) => {
        try {
            const todasAsFichas = await db.fichas_soltas.toArray();
            todasAsFichas.sort((a, b) => new Date(a.data_registro) - new Date(b.data_registro));

            const idsAlocados = Object.values(matrizAtual || matriz)
                .flat()
                .map(ficha => ficha.id);

            const contadoresSemana = {};

            const fichasFinais = todasAsFichas
                .filter(ficha => !idsAlocados.includes(ficha.id))
                .map(ficha => {
                    const sem = ficha.ciclo || ficha.semana || 'Sem Semana';
                    if (!contadoresSemana[sem]) {
                        contadoresSemana[sem] = 1;
                    } else {
                        contadoresSemana[sem] += 1;
                    }

                    return {
                        ...ficha,
                        id: ficha.id,
                        semana: sem,
                        numeroSequencial: contadoresSemana[sem]
                    };
                });

            setFichasPendentes(fichasFinais);
        } catch (error) {
            console.error("Erro ao buscar as fichas do cofre offline:", error);
        }
    };

    useEffect(() => {
        carregarFichasDoCofre();
    }, []);

    const handleSalvarEAtualizarDiario = async () => {
        const matricula = localStorage.getItem('userMatricula');

        if (!matricula || matricula === 'DESCONHECIDO') {
            alert('⚠️ Erro: Não foi possível identificar a matrícula do agente logado.');
            return;
        }

        try {
            console.log(`🔄 [Uso Diário] Buscando fichas e parcerias no servidor para: ${matricula}`);
            const response = await api.get(`/visitas/agente/${matricula}`);
            const visitasServidor = response.data;

            if (visitasServidor.length === 0) {
                alert('💡 Nenhuma ficha nova ou espelho encontrada para você no servidor hoje.');
                return;
            }

            await db.fichas_soltas.bulkPut(visitasServidor);
            await carregarFichasDoCofre();

            alert(`✅ Sincronização diária concluída! ${visitasServidor.length} fichas mapeadas e prontas para alocação.`);
        } catch (error) {
            console.error("Erro no combo diário:", error);
            alert('❌ Falha ao sincronizar. As fichas alocadas continuam seguras no tablet, mas certifique-se de estar no Wi-Fi da UVZ para baixar o trabalho dos parceiros.');
        }
    };

    const handleSelecionarFicha = (fichaEscolhida) => {
        const novaMatriz = {
            ...matriz,
            [quadranteAtivo]: [...(matriz[quadranteAtivo] || []), fichaEscolhida]
        };
        setMatriz(novaMatriz);
        setFichasPendentes(fichasPendentes.filter(f => f.id !== fichaEscolhida.id));
        setQuadranteAtivo(null);
    };

    const handleRemoverFicha = (idQuadrante, fichaParaRemover, e) => {
        e.stopPropagation();
        const novaMatriz = {
            ...matriz,
            [idQuadrante]: (matriz[idQuadrante] || []).filter(f => f.id !== fichaParaRemover.id)
        };
        setMatriz(novaMatriz);
        setFichasPendentes([...fichasPendentes, fichaParaRemover]);
    };

    const calcularTotalSemana = () => {
        let totalImoveis = 0;
        Object.values(matriz).forEach(gavetaDoTurno => {
            gavetaDoTurno.forEach(ficha => {
                if (ficha.imoveis && Array.isArray(ficha.imoveis)) {
                    totalImoveis += ficha.imoveis.length;
                }
            });
        });
        return totalImoveis;
    };

    const handleEnviarResumoSemanal = async () => {
        if (!calendarioPreenchido) {
            alert(
                '⚠️ BLOQUEIO DE SEGURANÇA:\n\n' +
                'Não é possível enviar o Resumo Semanal ainda.\n' +
                'O calendário precisa ter pelo menos 1 ficha alocada em CADA período ' +
                '(Manhã e Tarde) de Segunda a Sexta-feira.'
            );
            return;
        }

        const totalImoveis = calcularTotalSemana();
        const payload = {
            totalImoveis: totalImoveis,
            distribuicao: matriz 
        };

        try {
            const resposta = await fetch('https://sistema-uvz-backend.onrender.com/api/resumos-semanais', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (resposta.ok) {
                alert('✅ Resumo Semanal enviado com sucesso para a Gestão!');
                setTelaAtual('campo_menu');
            } else {
                alert('❌ O servidor Java encontrou um erro ao processar o resumo.');
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert('❌ Não foi possível conectar ao servidor. Verifique sua conexão.');
        }
    };

    return {
        matriz,
        quadranteAtivo,
        setQuadranteAtivo,
        fichasPendentes,
        calendarioPreenchido,
        handleSalvarEAtualizarDiario,
        handleSelecionarFicha,
        handleRemoverFicha,
        calcularTotalSemana,
        handleEnviarResumoSemanal
    };
}