import { useState } from 'react';

export default function CampoDashboard({ setTelaAtual }) {
    // 1. Estados do Cabeçalho da Ficha 
    const [cabecalho, setCabecalho] = useState({
        bairro: '',
        zona: '',
        codigo: '',
        desmembramento: '',
        ciclo: '',
        semana: '',
        data: ''
    });

    // 2. Estados do formulário do imóvel atual que está sendo digitado
    const [imovelAtual, setImovelAtual] = useState({
        quarteirao: '',
        endereco: '',
        numero: '',
        complemento: '',
        tipo: 'CASA',
        pendencia: 'NAO',
        a2: 0, b: 0, c: 0, d1: 0, d2: 0, e: 0,
        depEliminado: 0,
        larvicidaGrama: 0
    });

    // 3. Lista de imóveis já adicionados na folha atual
    const [listaImoveis, setListaImoveis] = useState([]);
    const [mensagemEnvio, setMensagemEnvio] = useState('');

    // Funções auxiliares para aumentar/diminuir números com um toque
    const alterarContador = (campo, operacao) => {
        setImovelAtual(prev => {
            const valorAtual = prev[campo];
            const novoValor = operacao === '+' ? valorAtual + 1 : Math.max(0, valorAtual - 1);
            return { ...prev, [campo]: novoValor };
        });
    };

    // 2. Função de Adicionar Imóvel Ajustada (Sem o imovelTratado)
    const handleAdicionarImovel = (e) => {
        e.preventDefault();

        if (!imovelAtual.endereco || !imovelAtual.numero) {
            alert('⚠️ Digite o endereço e o número do imóvel!');
            return;
        }

        // 1. Joga o imóvel atual para dentro da lista de imóveis visitados
        setListaImoveis([...listaImoveis, imovelAtual]);

        // 2. 🔄 O RESET: Limpa os campos da tela para o próximo vizinho
        setImovelAtual(prev => ({
            ...prev, // Mantém o Quarteirão e o Endereço/Rua intocados!
            numero: '',
            complemento: '',
            a2: 0, b: 0, c: 0, d1: 0, d2: 0, e: 0,
            depEliminado: 0,
            larvicidaGrama: 0 // 🧪 Reseta o larvicida para 0 para a próxima casa!
        }));
    };

    const handleEnviarBoletimCompleto = async () => {
        if (listaImoveis.length === 0) {
            alert('⚠️ Adicione pelo menos um imóvel antes de fechar o boletim!');
            return;
        }

        const payload = {
            ...cabecalho,
            imoveis: listaImoveis
        };

        try {
            // 🚀 Dispara os dados direto para o endpoint em lote do Java
            const resposta = await fetch('http://localhost:8080/api/visitas/lote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (resposta.ok) {
                alert('✅ Boletim enviado com sucesso para o banco de dados!');
                setListaImoveis([]);
                setTelaAtual('campo_menu'); // Volta para o menu do app
            } else {
                alert('❌ O servidor Java recebeu, mas deu erro ao salvar.');
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert('❌ Não foi possível conectar ao Java. O servidor na porta 8080 está rodando?');
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '15px', color: '#fff', fontFamily: 'sans-serif', background: '#111', borderRadius: '10px' }}>

            <h2>📋 Novo Boletim de Campo</h2>
            <p style={{ color: '#aaa', fontSize: '14px' }}>Substituindo a Ficha Entomológica de Papel</p>

            {/* ================= BLOCÃO 1: CABEÇALHO (ATUALIZADO) ================= */}
            <div style={{ background: '#222', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #333' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#42a5f5', fontSize: '16px' }}>📍 Dados da Folha / Ciclo</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <div>
                        <label style={{ fontSize: '12px' }}>Localidade / Bairro:</label>
                        <input type="text" value={cabecalho.bairro} onChange={e => setCabecalho({ ...cabecalho, bairro: e.target.value })} style={styleInput} />
                    </div>
                    <div>
                        <label style={{ fontSize: '12px' }}>Zona:</label>
                        <input type="text" value={cabecalho.zona} onChange={e => setCabecalho({ ...cabecalho, zona: e.target.value })} style={styleInput} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <div>
                        <label style={{ fontSize: '12px' }}>Código:</label>
                        <input type="text" placeholder="Ex: 282" value={cabecalho.codigo} onChange={e => setCabecalho({ ...cabecalho, codigo: e.target.value })} style={styleInput} />
                    </div>
                    <div>
                        <label style={{ fontSize: '12px' }}>Desmembramento:</label>
                        <input type="text" placeholder="Ex: *" value={cabecalho.desmembramento} onChange={e => setCabecalho({ ...cabecalho, desmembramento: e.target.value })} style={styleInput} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                        <label style={{ fontSize: '12px' }}>Ciclo:</label>
                        <input type="text" value={cabecalho.ciclo} onChange={e => setCabecalho({ ...cabecalho, ciclo: e.target.value })} style={styleInput} />
                    </div>
                    <div>
                        <label style={{ fontSize: '12px' }}>Semana:</label>
                        <input type="text" value={cabecalho.semana} onChange={e => setCabecalho({ ...cabecalho, semana: e.target.value })} style={styleInput} />
                    </div>
                </div>
            </div>

            {/* ================= BLOCÃO 2: ADICIONAR IMÓVEL ================= */}
            <div style={{ background: '#1e1e1e', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #444' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#ffb74d', fontSize: '16px' }}>🏠 Registrar Visita no Imóvel</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '10px', marginBottom: '10px' }}>
                    <div>
                        <label style={{ fontSize: '12px' }}>Quarteirão:</label>
                        <input type="text" placeholder="Ex: 1" value={imovelAtual.quarteirao} onChange={e => setImovelAtual({ ...imovelAtual, quarteirao: e.target.value })} style={styleInput} />
                    </div>
                    <div>
                        <label style={{ fontSize: '12px' }}>Logradouro / Endereço:</label>
                        <input type="text" placeholder="Ex: Rua Santana" value={imovelAtual.endereco} onChange={e => setImovelAtual({ ...imovelAtual, endereco: e.target.value })} style={styleInput} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                    <div>
                        <label style={{ fontSize: '12px' }}>Número:</label>
                        <input type="text" placeholder="Ex: 132" value={imovelAtual.numero} onChange={e => setImovelAtual({ ...imovelAtual, numero: e.target.value })} style={styleInput} />
                    </div>
                    <div>
                        <label style={{ fontSize: '12px' }}>Complemento:</label>
                        <input type="text" placeholder="Ex: .1 ou Ap 2" value={imovelAtual.complemento} onChange={e => setImovelAtual({ ...imovelAtual, complemento: e.target.value })} style={styleInput} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                    <div>
                        <label style={{ fontSize: '12px' }}>Tipo de Categoria:</label>
                        <select value={imovelAtual.tipo} onChange={e => setImovelAtual({ ...imovelAtual, tipo: e.target.value })} style={styleInput}>
                            <option value="CASA">Casa (C)</option>
                            <option value="KITNET">Kitnet(KIT)</option>
                            <option value="APARTAMENTO">Apartamento (AP)</option>
                            <option value="COMERCIO">Comércio (CG)</option>
                            <option value="IGREJA">Igreja (I)</option>
                            <option value="TERRENO">Terreno Baldio (TB)</option>
                            <option value="PE">Ponto Estratégico (PE)</option>
                            <option value="ORGAO_PUBLICO">Órgão Público (OP)</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ fontSize: '12px' }}>Situação/Pendência:</label>
                        <select value={imovelAtual.pendencia} onChange={e => setImovelAtual({ ...imovelAtual, pendencia: e.target.value })} style={styleInput}>
                            <option value="NAO">Normal (Visitado)</option>
                            <option value="RECUSADO">Recusado (REC)</option>
                            <option value="FECHADO">Fechado (FEC)</option>
                        </select>
                    </div>
                </div>

                {/* CONTADORES DOS DEPÓSITOS INSPECCIONADOS (Estilo papel) */}
                <h4 style={{ margin: '15px 0 5px 0', fontSize: '14px', color: '#26a69a' }}>🔍 Depósitos Inspecionados por Tipo:</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#252525', padding: '10px', borderRadius: '6px' }}>
                    {['a2', 'b', 'c', 'd1', 'd2', 'e'].map(dep => (
                        <div key={dep} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px' }}>
                            <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{dep}:</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <button type="button" onClick={() => alterarContador(dep, '-')} style={btnContador}>-</button>
                                <span style={{ fontSize: '16px', minWidth: '20px', textAlign: 'center' }}>{imovelAtual[dep]}</span>
                                <button type="button" onClick={() => alterarContador(dep, '+')} style={btnContador}>+</button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 🧪 TRATAMENTO AUTOMÁTICO VINCULADO AO DEPÓSITO A2 */}
                {imovelAtual.a2 > 0 && (
                    <div style={{ background: '#252525', padding: '15px', borderRadius: '6px', marginTop: '15px', borderLeft: '4px solid #ffb74d' }}>
                        <h5 style={{ margin: '0 0 5px 0', color: '#ffb74d', fontSize: '14px' }}>
                            ⚡ Tratamento de Depósito A2 Detectado
                        </h5>
                        <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#aaa' }}>
                            Informe a dosagem de larvicida utilizada para os tambores/tanques inspecionados:
                        </p>

                        <div>
                            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Quantidade de Larvicida (g):</label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                placeholder="Ex: 2.5"
                                value={imovelAtual.larvicidaGrama || ''}
                                onChange={e => setImovelAtual({ ...imovelAtual, larvicidaGrama: parseFloat(e.target.value) || 0 })}
                                style={{ ...styleInput, marginTop: '5px' }}
                            />
                        </div>
                    </div>
                )}

                <button type="button" onClick={handleAdicionarImovel} style={{ marginTop: '15px', width: '100%', padding: '12px', background: '#e67e22', border: 'none', color: '#fff', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}>
                    ➕ Salvar Imóvel na Ficha
                </button>
            </div>

            {/* ================= LISTAGEM PARCIAL DA FOLHA ================= */}
            {listaImoveis.length > 0 && (
                <div style={{ background: '#222', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#a5d6a7' }}>📑 Imóveis na Ficha Atual ({listaImoveis.length})</h3>
                    <div style={{ maxHeight: '150px', overflowY: 'auto', fontSize: '13px' }}>
                        {listaImoveis.map((imv, idx) => (
                            <div key={idx} style={{ padding: '6px 0', borderBottom: '1px solid #333' }}>
                                📍 Qrt {imv.quarteirao} - {imv.endereco}, Nº {imv.numero} ({imv.tipo}) - Depósitos: {imv.a2 + imv.b + imv.c + imv.d1 + imv.d2 + imv.e} inspecionados.
                            </div>
                        ))}
                    </div>

                    <button type="button" onClick={handleEnviarBoletimCompleto} style={{ marginTop: '15px', width: '100%', padding: '12px', background: '#28a745', border: 'none', color: '#fff', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', fontSize: '15px' }}>
                        💾 FINALIZAR E ENVIAR BOLETIM DO DIA
                    </button>
                </div>
            )}

            {mensagemEnvio && <p style={{ textAlign: 'center', color: '#ffeb3b', fontWeight: 'bold' }}>{mensagemEnvio}</p>}

            <button onClick={() => setTelaAtual('campo_menu')} style={{ width: '100%', padding: '10px', background: '#555', border: 'none', color: '#fff', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
                ⬅️ Voltar para o Menu Principal
            </button>

        </div>
    );
}

// Estilos Inline Rápidos e Limpos para o Layout Escuro Celular
const styleInput = {
    width: '100%',
    padding: '10px',
    marginTop: '4px',
    background: '#333',
    color: '#fff',
    border: '1px solid #444',
    borderRadius: '4px',
    boxSizing: 'border-box'
};

const btnContador = {
    width: '32px',
    height: '32px',
    background: '#444',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px'
};