import { useState } from 'react';

export default function ResumoSemanal({ setTelaAtual }) {
    // 1. ESTADO DA MATRIZ (Gavetas vazias prontas para receber várias fichas)
    const [matriz, setMatriz] = useState({
        seg_mat: [], seg_vesp: [],
        ter_mat: [], ter_vesp: [],
        qua_mat: [], qua_vesp: [],
        qui_mat: [], qui_vesp: [],
        sex_mat: [], sex_vesp: [],
    });

    const [quadranteAtivo, setQuadranteAtivo] = useState(null);

    // Banco de Fichas Simulado
    const [fichasPendentes, setFichasPendentes] = useState([
        { id: 1, codigo: '282', imoveis: 25 },
        { id: 2, codigo: '283', imoveis: 18 },
        { id: 3, codigo: '284', imoveis: 22 }
    ]);

    // LÓGICA: Adicionar e Remover Fichas
    const handleSelecionarFicha = (fichaEscolhida) => {
        setMatriz({
            ...matriz,
            [quadranteAtivo]: [...matriz[quadranteAtivo], fichaEscolhida]
        });
        setFichasPendentes(fichasPendentes.filter(f => f.id !== fichaEscolhida.id));
        setQuadranteAtivo(null);
    };

    const handleRemoverFicha = (idQuadrante, fichaParaRemover, e) => {
        e.stopPropagation();
        setFichasPendentes([...fichasPendentes, fichaParaRemover]);
        setMatriz({
            ...matriz,
            [idQuadrante]: matriz[idQuadrante].filter(f => f.id !== fichaParaRemover.id)
        });
    };

    // =========================================================================
    // 🌟 OTIMIZAÇÃO: Mini-componente para não repetir código visual
    // =========================================================================
    const Quadrante = ({ id }) => (
        <div
            onClick={() => setQuadranteAtivo(id)}
            style={matriz[id].length > 0 ? styleQuadrantePreenchido : styleQuadranteVazio}
        >
            {matriz[id].length > 0 ? (
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
    );

    return (
        <div style={{ padding: '10px', background: '#111', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
            <h2 style={{ color: '#42a5f5', textAlign: 'center', margin: '10px 0 20px 0' }}>📅 Matriz Semanal</h2>

            {/* GRID DA MATRIZ */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '80px repeat(5, 1fr)',
                gap: '8px',
                overflowX: 'auto',
                paddingBottom: '20px'
            }}>
                <div></div> {/* Espaço vazio do canto */}
                {['Seg', 'Ter', 'Qua', 'Qui', 'Sex'].map(dia => (
                    <div key={dia} style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '14px', paddingBottom: '5px', borderBottom: '2px solid #333' }}>
                        {dia}
                    </div>
                ))}

                {/* Turno Matutino */}
                <div style={styleTurnoHeader}>☀️ Mat</div>
                {['seg_mat', 'ter_mat', 'qua_mat', 'qui_mat', 'sex_mat'].map(id => (
                    <Quadrante key={id} id={id} />
                ))}

                {/* Turno Vespertino */}
                <div style={styleTurnoHeader}>🌙 Vesp</div>
                {['seg_vesp', 'ter_vesp', 'qua_vesp', 'qui_vesp', 'sex_vesp'].map(id => (
                    <Quadrante key={id} id={id} />
                ))}
            </div>

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