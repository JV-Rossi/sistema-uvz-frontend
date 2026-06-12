import { useState, useEffect } from 'react';
import { db } from '../services/dbLocal'; // 👈 Importação do nosso cofre offline

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

    useEffect(() => {
        const buscarFichasDoBanco = async () => {
            try {
                // 1. CORTAMOS A INTERNET: Puxa todas as fichas direto do Dexie
                const todasAsFichas = await db.fichas_soltas.toArray();

                // 2. Ordenar as fichas por data de criação (mais antigas primeiro)
                // Usamos 'data_registro' que foi o nome que demos na função de salvar
                todasAsFichas.sort((a, b) => new Date(a.data_registro) - new Date(b.data_registro));

                // 3. Contadores para numerar sequencialmente por semana (Ex: 1ª, 2ª da semana 20)
                const contadoresSemana = {};

                const fichasFinais = todasAsFichas.map(ficha => {
                    // Pega o ciclo ou a semana, dependendo de como você chamou no salvamento
                    const sem = ficha.ciclo || ficha.semana || 'Sem Semana';

                    // Se for a primeira vez que vemos esta semana, o contador inicia em 1
                    if (!contadoresSemana[sem]) {
                        contadoresSemana[sem] = 1;
                    } else {
                        contadoresSemana[sem] += 1; // Incrementa para a próxima ficha da mesma semana
                    }

                    return {
                        ...ficha, // Despeja todos os dados da ficha (bairro, imóveis, equipe, etc)
                        id: ficha.id, // O ID numérico gerado automaticamente pelo Dexie
                        semana: sem,
                        numeroSequencial: contadoresSemana[sem] // Guarda se é a 1ª, 2ª...
                    };
                });

                setFichasPendentes(fichasFinais);

            } catch (error) {
                console.error("Erro ao buscar as fichas do cofre offline:", error);
            }
        };

        buscarFichasDoBanco();
    }, []);

    // LÓGICA: Adicionar e Remover Fichas (Mantida exatamente igual)
    const handleSelecionarFicha = (fichaEscolhida) => {
        setMatriz({
            ...matriz,
            [quadranteAtivo]: [...(matriz[quadranteAtivo] || []), fichaEscolhida]
        });
        setFichasPendentes(fichasPendentes.filter(f => f.id !== fichaEscolhida.id));
        setQuadranteAtivo(null);
    };

    const handleRemoverFicha = (idQuadrante, fichaParaRemover, e) => {
        e.stopPropagation();
        setFichasPendentes([...fichasPendentes, fichaParaRemover]);
        setMatriz({
            ...matriz,
            [idQuadrante]: (matriz[idQuadrante] || []).filter(f => f.id !== fichaParaRemover.id)
        });
    };

// MATEMÁTICA DO PLACAR
const calcularTotalSemana = () => {
    let totalImoveis = 0;

    // O Object.values pega todas as listas dentro da matriz e junta
    Object.values(matriz).forEach(gavetaDoTurno => {
        gavetaDoTurno.forEach(ficha => {
            if (ficha.imoveis && Array.isArray(ficha.imoveis)) {
                totalImoveis += ficha.imoveis.length;
            }
        });
    });

    return totalImoveis;
};

// 🌟 CONEXÃO COM O JAVA: Enviar a matriz para o banco
const handleEnviarResumoSemanal = async () => {
    const totalImoveis = calcularTotalSemana();

    // Validação básica: evitar enviar resumo zerado
    if (totalImoveis === 0) {
        alert('⚠️ Aloque pelo menos uma ficha nos dias da semana antes de enviar!');
        return;
    }

    // Monta o pacote de dados exatamente como o backend espera
    const payload = {
        totalImoveis: totalImoveis,
        distribuicao: matriz // Envia as listas de segunda a sexta organizadas
    };

    try {
        // Dispara para o endpoint do seu servidor Java (porta 8080)
        const resposta = await fetch('https://sistema-uvz-backend.onrender.com/api/resumos-semanais', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (resposta.ok) {
            alert('✅ Resumo Semanal salvo e enviado com sucesso para o banco de dados!');
            // Opcional: Volta para o menu após salvar
            setTelaAtual('campo_menu');
        } else {
            alert('❌ O servidor Java encontrou um erro ao processar o resumo.');
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert('❌ Não foi possível conectar ao Java. Certifique-se de que o backend está rodando na porta 8080!');
    }
};

return (
    <div style={{ padding: '10px', background: '#111', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>

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

            {/* ===================================== */}
            {/* LINHA MATUTINO */}
            {/* ===================================== */}
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

            {/* ===================================== */}
            {/* LINHA VESPERTINO */}
            {/* ===================================== */}
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

        {/* 🌟 ADICIONE ESTE BOTÃO VERDE AQUI: */}
        <button
            onClick={handleEnviarResumoSemanal}
            style={{
                width: '100%',
                padding: '15px',
                background: '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                marginTop: '20px',
                fontWeight: 'bold',
                fontSize: '16px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
            }}
        >
            💾 FINALIZAR RESUMO SEMANAL
        </button>

        {/* O seu botão de voltar existente continua aqui embaixo */}
        <button
            onClick={() => setTelaAtual('campo_menu')}
            style={{ width: '100%', padding: '12px', background: '#555', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '10px' }}
        >
            ⬅️ Voltar para o Menu
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