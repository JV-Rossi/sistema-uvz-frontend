import { useState, useEffect } from 'react';
import api from '../../core/api';
import { db } from '../../core/dbLocal'; // 👈 Importação do nosso cofre offline

export default function ResumoSemanal({ setTelaAtual }) {
    // 1. ESTADO DA MATRIZ (Gavetas prontas para receber várias fichas)
    const [matriz, setMatriz] = useState({
        seg_mat: [], seg_vesp: [],
        ter_mat: [], ter_vesp: [],
        qua_mat: [], qua_vesp: [],
        qui_mat: [], qui_vesp: [],
        sex_mat: [], sex_vesp: [],
    });

    const [quadranteAtivo, setQuadranteAtivo] = useState(null);

    // Banco de Fichas
    const [fichasPendentes, setFichasPendentes] = useState([]);

    // 🔑 CONSTANTE DE PERÍODOS OBRIGATÓRIOS (Movida para o escopo do componente)
    const periodosObrigatorios = [
        'seg_mat', 'seg_vesp',
        'ter_mat', 'ter_vesp',
        'qua_mat', 'qua_vesp',
        'qui_mat', 'qui_vesp',
        'sex_mat', 'sex_vesp'
    ];

    // 📊 REQUISITO MÍNIMO VISUAL: Monitora se há pelo menos 1 ficha em cada período da matriz
    const calendarioPreenchido = periodosObrigatorios.every(periodo => 
        matriz[periodo] && matriz[periodo].length > 0
    );

    // 🔄 FUNÇÃO ISOLADA: Lê o Dexie e atualiza a tela filtrando o que já está alocado
    const carregarFichasDoCofre = async (matrizAtual) => {
        try {
            // 1. Puxa todas as fichas direto do Dexie
            const todasAsFichas = await db.fichas_soltas.toArray();

            // 2. Ordenar as fichas por data de criação (mais antigas primeiro)
            todasAsFichas.sort((a, b) => new Date(a.data_registro) - new Date(b.data_registro));

            // 3. Descobre quais IDs já estão inseridos no meio da matriz para não mostrá-los novamente
            const idsAlocados = Object.values(matrizAtual || matriz)
                .flat()
                .map(ficha => ficha.id);

            // 4. Contadores para numerar sequencialmente por semana
            const contadoresSemana = {};

            const fichasFinais = todasAsFichas
                .filter(ficha => !idsAlocados.includes(ficha.id)) // 🛡️ Esconde o que já está na matriz
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

    // Executa ao abrir a tela
    useEffect(() => {
        carregarFichasDoCofre();
    }, []);

    // 🗓️ 🚀 COMBO DIÁRIO: Atualiza o tablet baixando as fichas espelho dos parceiros
    const handleSalvarEAtualizarDiario = async () => {
        const matricula = localStorage.getItem('userMatricula');

        if (!matricula || matricula === 'DESCONHECIDO') {
            alert('⚠️ Erro: Não foi possível identificar a matrícula do agente logado.');
            return;
        }

        try {
            console.log(`🔄 [Uso Diário] Buscando fichas e parcerias no servidor para: ${matricula}`);

            // 1. Puxa do Java todas as vistorias onde a matrícula é titular ou parceira
            const response = await api.get(`/visitas/agente/${matricula}`);
            const visitasServidor = response.data;

            if (visitasServidor.length === 0) {
                alert('💡 Nenhuma ficha nova ou espelho encontrada para você no servidor hoje.');
                return;
            }

            // 2. Grava ou atualiza no Dexie local
            await db.fichas_soltas.bulkPut(visitasServidor);

            // 3. Recarrega a lista do modal para exibir as novas fichas dos parceiros imediatamente
            await carregarFichasDoCofre();

            alert(`✅ Sincronização diária concluída! ${visitasServidor.length} fichas mapeadas e prontas para alocação.`);

        } catch (error) {
            console.error("Erro no combo diário:", error);
            alert('❌ Falha ao sincronizar. As fichas alocadas continuam seguras no tablet, mas certifique-se de estar no Wi-Fi da UVZ para baixar o trabalho dos parceiros.');
        }
    };

    // LÓGICA: Adicionar e Remover Fichas (Mantida exatamente igual)
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

    // MATEMÁTICA DO PLACAR
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

    // 🌟 CONEXÃO COM O JAVA: Enviar a matriz para o banco (Sexta-feira definitivo)
    const handleEnviarResumoSemanal = async () => {
        // 🛡️ O BLOQUEIO DURO: Avalia a constante reativa do escopo global
        if (!calendarioPreenchido) {
            alert(
                '⚠️ BLOQUEIO DE SEGURANÇA:\n\n' +
                'Não é possível enviar o Resumo Semanal ainda.\n' +
                'O calendário precisa ter pelo menos 1 ficha alocada em CADA período ' +
                '(Manhã e Tarde) de Segunda a Sexta-feira.'
            );
            return; // 🛑 Trava a execução aqui e não deixa disparar o fetch para o Java
        }

        // Se passou pela validação acima, calcula o total e segue o fluxo normal
        const totalImoveis = calcularTotalSemana();

        const payload = {
            totalImoveis: totalImoveis,
            distribuicao: matriz 
        };

        try {
            const resposta = await fetch('https://sistema-uvz-backend.onrender.com/api/resumos-semanais', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
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

    return (
        <div style={{ padding: '10px', background: '#111', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>

            <button
                onClick={() => setTelaAtual('campo_menu')}
                style={{
                    background: '#333',
                    color: '#fff',
                    border: '1px solid #444',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px'
                }}
            >⬅️ VOLTAR</button>

            {/* CABEÇALHO E PLACAR DA SEMANA */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: '#1a237e', padding: '15px', borderRadius: '8px', border: '1px solid #3949ab' }}>
                <div>
                    <h2 style={{ margin: '0', color: '#90caf9', fontSize: '18px' }}>📅 Resumo Semanal</h2>
                    <span style={{ fontSize: '12px', color: '#ccc' }}>Alocação de Fichas</span>
                </div>

                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#a5d6a7', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Produzido</div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff' }}>
                        {calcularTotalSemana()} <span style={{ fontSize: '14px', color: '#aaa', fontWeight: 'normal' }}>imóveis</span>
                    </div>
                </div>
            </div>

            {/* GRID DA MATRIZ */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '80px repeat(5, 1fr)',
                gap: '8px',
                overflowX: 'auto',
                paddingBottom: '20px'
            }}>
                <div></div>
                {['Seg', 'Ter', 'Qua', 'Qui', 'Sex'].map(dia => (
                    <div key={dia} style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '14px', paddingBottom: '5px', borderBottom: '2px solid #333' }}>
                        {dia}
                    </div>
                ))}

                {/* LINHA MATUTINO */}
                <div style={styleTurnoHeader}>☀️ Mat</div>
                {['seg_mat', 'ter_mat', 'qua_mat', 'qui_mat', 'sex_mat'].map(id => (
                    <div
                        key={id}
                        onClick={() => setQuadranteAtivo(id)}
                        style={matriz[id] && matriz[id].length > 0 ? styleQuadrantePreenchido : styleQuadranteVazio}
                    >
                        {matriz[id] && matriz[id].length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                                {matriz[id].map(ficha => (
                                    <div key={ficha.id} style={{ position: 'relative', background: '#2e7d32', padding: '4px', borderRadius: '4px', textAlign: 'center', border: '1px solid #4caf50' }}>
                                        <div
                                            onClick={(e) => handleRemoverFicha(id, ficha, e)}
                                            style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#d32f2f', color: '#fff', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                                        >
                                            X
                                        </div>
                                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#fff' }}>#{ficha.codigo}</span>
                                    </div>
                                ))}
                                <div style={{ fontSize: '14px', textAlign: 'center', color: '#a5d6a7', marginTop: '2px' }}>+</div>
                            </div>
                        ) : '+'}
                    </div>
                ))}

                {/* LINHA VESPERTINO */}
                <div style={styleTurnoHeader}>🌙 Vesp</div>
                {['seg_vesp', 'ter_vesp', 'qua_vesp', 'qui_vesp', 'sex_vesp'].map(id => (
                    <div
                        key={id}
                        onClick={() => setQuadranteAtivo(id)}
                        style={matriz[id] && matriz[id].length > 0 ? styleQuadrantePreenchido : styleQuadranteVazio}
                    >
                        {matriz[id] && matriz[id].length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                                {matriz[id].map(ficha => (
                                    <div key={ficha.id} style={{ position: 'relative', background: '#2e7d32', padding: '4px', borderRadius: '4px', textAlign: 'center', border: '1px solid #4caf50' }}>
                                        <div
                                            onClick={(e) => handleRemoverFicha(id, ficha, e)}
                                            style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#d32f2f', color: '#fff', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                                        >
                                            X
                                        </div>
                                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#fff' }}>#{ficha.codigo}</span>
                                    </div>
                                ))}
                                <div style={{ fontSize: '14px', textAlign: 'center', color: '#a5d6a7', marginTop: '2px' }}>+</div>
                            </div>
                        ) : '+'}
                    </div>
                ))}
            </div>

            {/* 🗓️ BOTÃO 1: USO DIÁRIO */}
            <button
                type="button"
                onClick={handleSalvarEAtualizarDiario}
                style={{
                    width: '100%',
                    padding: '14px',
                    background: '#2980b9', // Azul Processo
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    marginTop: '10px',
                    fontWeight: 'bold',
                    fontSize: '15px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                }}
            >
                 SALVAR E ATUALIZAR 🔄
            </button>

            {/* 🏁 BOTÃO 2: FECHAMENTO DEFINITIVO COM ESTILO DINÂMICO ADAPTADO */}
            <button
                onClick={handleEnviarResumoSemanal}
                style={{
                    width: '100%',
                    padding: '15px',
                    // 🎨 ALTERAÇÃO DE COR: Fica cinza escuro (#333) e muda para o Verde (#28a745) quando válido
                    background: calendarioPreenchido ? '#28a745' : '#333', 
                    // 🎨 TEXTO DINÂMICO: Letras cinza claro se bloqueado, brancas se ativo
                    color: calendarioPreenchido ? '#fff' : '#aaa',
                    border: calendarioPreenchido ? 'none' : '1px solid #444',
                    borderRadius: '6px',
                    // 👆 MUDANÇA DE CURSOR: Avisa visualmente se é clicável ou não
                    cursor: calendarioPreenchido ? 'pointer' : 'not-allowed', 
                    marginTop: '12px',
                    fontWeight: 'bold',
                    fontSize: '15px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                    // 🎨 OPACIDADE REQUISITADA: 0.6 quando bloqueado, 1 quando atingido os requisitos mínimos
                    opacity: calendarioPreenchido ? 1 : 0.6,
                    // ✨ TRANSIÇÃO SUAVE: Faz o botão "acender" gradualmente em 0.3 segundos
                    transition: 'all 0.3s ease'
                }}
            >
                 FINALIZAR RESUMO SEMANAL 🚀
            </button>

            {/* MODAL (MENU FLUTUANTE) */}
            {quadranteAtivo && (
                <div style={styleModal}>
                    <h3 style={{ margin: '0 0 15px 0', color: '#ffb74d', fontSize: '16px', textAlign: 'center' }}>
                        Selecionar Ficha<br />{quadranteAtivo.replace('_', ' ').toUpperCase()}
                    </h3>

                    {fichasPendentes.length === 0 ? (
                        <p style={{ fontSize: '13px', color: '#ccc', textAlign: 'center' }}>Nenhuma ficha pendente.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                            {fichasPendentes.map(ficha => (
                                <div
                                    key={ficha.id}
                                    onClick={() => handleSelecionarFicha(ficha)}
                                    style={{ background: '#222', border: '1px solid #444', padding: '10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                >
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <strong style={{ color: '#42a5f5' }}>{ficha.numeroSequencial}ª Ficha - Sem. {ficha.semana}</strong>
                                        <span style={{ fontSize: '12px', color: '#ffb74d' }}>Área: #{ficha.codigo}</span>
                                    </div>
                                    <span style={{ fontSize: '12px', color: '#aaa' }}>{ficha.imoveis ? ficha.imoveis.length : 0} imóveis</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        onClick={() => setQuadranteAtivo(null)}
                        style={{ width: '100%', padding: '10px', marginTop: '15px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Cancelar
                    </button>
                </div>
            )}
        </div>
    );
}

// =========================================================
// ESTILOS (Fora do componente)
// =========================================================

const styleTurnoHeader = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#222', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold'
};

const styleQuadranteVazio = {
    minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#1a1a1a', border: '2px dashed #333', borderRadius: '6px',
    fontSize: '24px', color: '#444', cursor: 'pointer', padding: '5px'
};

const styleQuadrantePreenchido = {
    minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#1b5e20', border: '1px solid #a5d6a7', borderRadius: '6px',
    cursor: 'pointer', padding: '5px'
};

const styleModal = {
    position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    background: '#333', padding: '20px', borderRadius: '10px',
    boxShadow: '0 0 20px rgba(0,0,0,0.8)', zIndex: 100, width: '80%', maxWidth: '350px'
};