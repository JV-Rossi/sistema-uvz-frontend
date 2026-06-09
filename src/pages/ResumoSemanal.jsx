import { useState } from 'react';

export default function ResumoSemanal({ setTelaAtual }) {
    // 1. ESTADOS DA TELA
    const [matriz, setMatriz] = useState({
        seg_mat: null, seg_vesp: null,
        ter_mat: null, ter_vesp: null,
        qua_mat: null, qua_vesp: null,
        qui_mat: null, qui_vesp: null,
        sex_mat: null, sex_vesp: null,
    });

    // Estado para controlar qual quadrante abrirá o menu flutuante (modal)
    const [quadranteAtivo, setQuadranteAtivo] = useState(null);

    //  Banco de Fichas (Fichas que o agente fez, mas ainda não alocou)
    const [fichasPendentes, setFichasPendentes] = useState([
        { id: 1, codigo: '282', imoveis: 25 },
        { id: 2, codigo: '283', imoveis: 18 },
        { id: 3, codigo: '284', imoveis: 22 }
    ]);

    // Função que move a ficha do menu para a matriz
    const handleSelecionarFicha = (fichaEscolhida) => {
        // 1. Grava a ficha no quadrante que estava clicado
        setMatriz({ ...matriz, [quadranteAtivo]: fichaEscolhida });

        // 2. Remove essa ficha da lista do menu (para não usar duas vezes)
        setFichasPendentes(fichasPendentes.filter(f => f.id !== fichaEscolhida.id));

        // 3. Fecha o menu flutuante
        setQuadranteAtivo(null);
    };

    // Função para devolver a ficha pro menu se o usuário errar o dia
    const handleRemoverFicha = (idQuadrante, e) => {
        e.stopPropagation(); // Evita que clicar no "X" abra o menu junto
        const fichaRemovida = matriz[idQuadrante];

        // 1. Devolve a ficha para a lista
        setFichasPendentes([...fichasPendentes, fichaRemovida]);

        // 2. Limpa o quadrante
        setMatriz({ ...matriz, [idQuadrante]: null });
    };

    // 2. RETORNO VISUAL (Obrigatório estar dentro da função principal)
    return (
        <div style={{ padding: '10px', background: '#111', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
            <h2 style={{ color: '#42a5f5', textAlign: 'center' }}>📅 Matriz Semanal</h2>

            {/* --- GRID DA MATRIZ --- */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '80px repeat(5, 1fr)',
                gap: '8px',
                overflowX: 'auto',
                paddingBottom: '20px'
            }}>
                {/* Linha de Cabeçalho (Dias) */}
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
                        onClick={() => !matriz[id] && setQuadranteAtivo(id)}
                        style={matriz[id] ? styleQuadrantePreenchido : styleQuadranteVazio}
                    >
                        {matriz[id] ? (
                            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                {/* Botão de X para remover */}
                                <div
                                    onClick={(e) => handleRemoverFicha(id, e)}
                                    style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#d32f2f', color: '#fff', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', cursor: 'pointer' }}
                                >
                                    X
                                </div>
                                <span style={{ color: '#a5d6a7' }}>#{matriz[id].codigo}</span>
                                <span style={{ fontSize: '10px' }}>{matriz[id].imoveis} imóveis</span>
                            </div>
                        ) : '+'}
                    </div>
                ))}

                {/* LINHA VESPERTINO */}
                <div style={styleTurnoHeader}>🌙 Vesp</div>
                {['seg_vesp', 'ter_vesp', 'qua_vesp', 'qui_vesp', 'sex_vesp'].map(id => (
                    <div
                        key={id}
                        onClick={() => !matriz[id] && setQuadranteAtivo(id)}
                        style={matriz[id] ? styleQuadrantePreenchido : styleQuadranteVazio}
                    >
                        {matriz[id] ? (
                            <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                {/* Botão de X para remover */}
                                <div
                                    onClick={(e) => handleRemoverFicha(id, e)}
                                    style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#d32f2f', color: '#fff', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', cursor: 'pointer' }}
                                >
                                    X
                                </div>
                                <span style={{ color: '#a5d6a7' }}>#{matriz[id].codigo}</span>
                                <span style={{ fontSize: '10px' }}>{matriz[id].imoveis} imóveis</span>
                            </div>
                        ) : '+'}
                    </div>
                ))}
            </div>

            {/* BOTÃO PARA VOLTAR AO MENU */}
            <button
                onClick={() => setTelaAtual('campo_menu')}
                style={{ width: '100%', padding: '12px', background: '#555', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '10px' }}
            >
                ⬅️ Voltar para o Menu
            </button>

            {/* MODAL (MENU FLUTUANTE DE SELEÇÃO DE FICHA) */}
            {quadranteAtivo && (
                <div style={styleModal}>
                    <h3 style={{ margin: '0 0 15px 0', color: '#ffb74d', fontSize: '16px' }}>
                        Selecionar Ficha para {quadranteAtivo.replace('_', ' ').toUpperCase()}
                    </h3>

                    {/* 🌟 LISTA DE FICHAS PENDENTES GERADA AUTOMATICAMENTE */}
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
                                    <strong style={{ color: '#42a5f5' }}>Ficha #{ficha.codigo}</strong>
                                    <span style={{ fontSize: '12px', color: '#aaa' }}>{ficha.imoveis} imóveis</span>
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
} // <--- FIM DA FUNÇÃO ResumoSemanal (O return ficou protegido aqui dentro)


// =========================================================
// 3. ESTILOS (Estes ficam de fora, no final do arquivo)
// =========================================================

const styleTurnoHeader = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#222', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold'
};

const styleQuadranteVazio = {
    height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#1a1a1a', border: '2px dashed #333', borderRadius: '6px',
    fontSize: '24px', color: '#444', cursor: 'pointer'
};

const styleQuadrantePreenchido = {
    height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#1b5e20', border: '1px solid #a5d6a7', borderRadius: '6px',
    fontSize: '13px', fontWeight: 'bold', cursor: 'pointer'
};

const styleModal = {
    position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    background: '#333', padding: '20px', borderRadius: '10px',
    boxShadow: '0 0 20px rgba(0,0,0,0.8)', zIndex: 100, width: '80%', maxWidth: '350px'
};