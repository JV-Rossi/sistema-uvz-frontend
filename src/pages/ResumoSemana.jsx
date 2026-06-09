const [matriz, setMatriz] = useState({
    seg_mat: null, seg_vesp: null,
    ter_mat: null, ter_vesp: null,
    qua_mat: null, qua_vesp: null,
    qui_mat: null, qui_vesp: null,
    sex_mat: null, sex_vesp: null,
});

// Estado para controlar qual quadrante está sendo editado no momento
const [quadranteAtivo, setQuadranteAtivo] = useState(null);

return (
    <div style={{ padding: '10px', background: '#111', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
        <h2 style={{ color: '#42a5f5', textAlign: 'center' }}>📅 Matriz Semanal</h2>

        {/* --- GRID DA MATRIZ --- */}
        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '80px repeat(5, 1fr)', // 1ª coluna pros turnos, outras 5 pros dias
            gap: '8px',
            overflowX: 'auto', // Caso a tela seja pequena, ele permite rolar pro lado
            paddingBottom: '20px'
        }}>
            {/* Linha de Cabeçalho (Dias) */}
            <div></div> {/* Espaço vazio em cima dos turnos */}
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
                    onClick={() => setQuadranteAtivo(id)} // 🌟 O Clique que abrirá o modal
                    style={matriz[id] ? styleQuadrantePreenchido : styleQuadranteVazio}
                >
                    {matriz[id] ? `Ficha #${matriz[id].codigo}` : '+'}
                </div>
            ))}

            {/* LINHA VESPERTINO */}
            <div style={styleTurnoHeader}>🌙 Vesp</div>
            {['seg_vesp', 'ter_vesp', 'qua_vesp', 'qui_vesp', 'sex_vesp'].map(id => (
                <div 
                    key={id} 
                    onClick={() => setQuadranteAtivo(id)} 
                    style={matriz[id] ? styleQuadrantePreenchido : styleQuadranteVazio}
                >
                    {matriz[id] ? `Ficha #${matriz[id].codigo}` : '+'}
                </div>
            ))}
        </div>

        {/* LOGICA DO MODAL (PASSO SEGUINTE) */}
        {quadranteAtivo && (
            <div style={styleModal}>
                <h3>Selecionar Ficha para {quadranteAtivo.replace('_', ' ')}</h3>
                <p>Aqui listaremos as fichas disponíveis...</p>
                <button onClick={() => setQuadranteAtivo(null)}>Fechar</button>
            </div>
        )}
    </div>
);

const styleTurnoHeader = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#222',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold'
};

const styleQuadranteVazio = {
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#1a1a1a',
    border: '2px dashed #333',
    borderRadius: '6px',
    fontSize: '24px',
    color: '#444',
    cursor: 'pointer'
};

const styleQuadrantePreenchido = {
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#1b5e20',
    border: '1px solid #a5d6a7',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer'
};

const styleModal = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: '#333',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 20px rgba(0,0,0,0.8)',
    zIndex: 100,
    width: '80%'
};