import { useState } from 'react';
import { tabelaBairros } from '../../shared/utils/dadosBairros';
import { listaAgentes as listaAgentesOficiais } from '../../shared/utils/dadosAgentes';
import { db } from '../../core/dbLocal';

export default function CampoDashboard({ setTelaAtual }) {

    // 1. Puxa o nome de usuário que foi salvo no login
    const nomeLogado = localStorage.getItem('userLogin') || '';

    // Como padronizamos a nossa lista toda em MAIÚSCULAS, 
    // garantimos que o nome do titular também fique igual.
    const titularPadronizado = nomeLogado.toUpperCase();

    const [regional, setRegional] = useState('');
    const [bairroInput, setBairroInput] = useState('');
    const [dadosOcultos, setDadosOcultos] = useState(null);
    const [erroBairro, setErroBairro] = useState('');

    // 2. Estados do Cabeçalho da Ficha 
    const [headerMinimizado, setHeaderMinimizado] = useState(false);
    const [cabecalho, setCabecalho] = useState({
        regional: '',
        bairro: '',
        zona: '',
        codigo: '',
        desmembramento: '',
        ciclo: '',
        semana: '',
        data: '',
        agentes: [titularPadronizado] // 👈 O array já nasce com o dono da conta
    });

    const salvarBoletimOffline = async () => {
        try {
            // 1. Montar o pacote de dados respeitando a nossa arquitetura (Chave Estrangeira do Titular)
            const pacoteBoletim = {
                titular: localStorage.getItem('userLogin') || 'DESCONHECIDO', // Apenas o Login!
                bairro: cabecalho.bairro,
                regional: cabecalho.regional,
                ciclo: cabecalho.ciclo,
                // O filtro inteligente que já usamos para ignorar caixas vazias:
                equipe_parceiros: cabecalho.agentes.filter(agente => agente && agente.trim() !== ''),
                total_imoveis: typeof totalImoveis !== 'undefined' ? totalImoveis : 0,
                data_registro: new Date().toISOString(), // Marca o exato segundo em que foi salvo
                status_envio: 'pendente' // Uma flag útil para o futuro
            };

            // 2. O PULO DO GATO: Guardar no cofre do Dexie
            await db.boletins_pendentes.add(pacoteBoletim);

            // 3. Feedback visual para o agente no sol quente
            alert('✅ Quarteirão salvo no tablet com sucesso!');

            // Aqui (opcionalmente) você pode colocar a sua lógica para limpar 
            // os campos de imóveis e preparar a tela para a próxima rua.

        } catch (error) {
            console.error('Falha ao trancar no cofre:', error);
            alert('❌ Erro ao tentar salvar os dados no tablet.');
        }
    };

    // 1. Adicionar Colega (Blindado)
    const adicionarAgente = (e) => {
        if (e) e.preventDefault(); // 👈 Isso impede que o botão recarregue ou bugue a tela

        setCabecalho(prev => {
            // 👈 Isso garante que se algum campo apagou a lista por acidente, ela volta a existir
            const listaSegura = Array.isArray(prev.agentes) ? prev.agentes : [''];
            return {
                ...prev,
                agentes: [...listaSegura, ''] // Adiciona um novo espaço no final
            };
        });
    };

    // 2. Remover Colega (Blindado)
    const removerAgente = (indexParaRemover, e) => {
        if (e) e.preventDefault();

        setCabecalho(prev => {
            const listaSegura = Array.isArray(prev.agentes) ? prev.agentes : [''];
            return {
                ...prev,
                agentes: listaSegura.filter((_, index) => index !== indexParaRemover)
            };
        });
    };

    // 3. Atualizar Nome do Agente (Blindado)
    const handleNomeAgente = (index, novoNome) => {
        setCabecalho(prev => {
            const listaSegura = Array.isArray(prev.agentes) ? [...prev.agentes] : [''];
            listaSegura[index] = novoNome;
            return { ...prev, agentes: listaSegura };
        });
    };

    // 3. Estados do formulário do imóvel atual que está sendo digitado
    const [imovelAtual, setImovelAtual] = useState({
        quarteirao: '',
        endereco: '',
        numero: '',
        complemento: '',
        tipo: 'CASA',
        pendencia: 'NAO',
        // Inspecionados:
        a2: 0, b: 0, c: 0, d1: 0, d2: 0, e: 0,
        //Controle de Eliminados e Observação
        teveDepositoEliminado: false,
        a2_elim: 0, b_elim: 0, c_elim: 0, d1_elim: 0, d2_elim: 0, e_elim: 0,
        observacao: '',
        // Tratamento:
        larvicidaGrama: 0
    });

    // 4. Lista de imóveis já adicionados na folha atual
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

        //Miniminiza o cabeçalho ao enviar a primeira casa
        if (listaImoveis.length === 0) {
            setHeaderMinimizado(true);
        }

        // 1. Joga o imóvel atual para dentro da lista de imóveis visitados
        setListaImoveis([...listaImoveis, imovelAtual]);

        // 2. 🔄 O RESET: Limpa os campos da tela para o próximo vizinho
        setImovelAtual(prev => ({
            ...prev,
            numero: '',
            complemento: '',
            a2: 0, b: 0, c: 0, d1: 0, d2: 0, e: 0,
            teveDepositoEliminado: false,
            a2_elim: 0, b_elim: 0, c_elim: 0, d1_elim: 0, d2_elim: 0, e_elim: 0,
            observacao: '',
            larvicidaGrama: 0
        }));
    };

    const handleEnviarBoletimCompleto = async () => {
        if (listaImoveis.length === 0) {
            alert('⚠️ Adicione pelo menos um imóvel antes de fechar o boletim!');
            return;
        }

        // 🎯 1. TRADUTOR DE EQUIPE: Cruza os nomes digitados com as matrículas oficiais
        // Nota: Substitua a palavra 'agentes' abaixo pelo nome do seu estado array 
        // que guarda os nomes dos parceiros (aquele usado no seu .map dos inputs)
        const equipeComMatriculas = agentes.map(nomeDigitado => {
            if (!nomeDigitado || nomeDigitado.trim() === '') return null;

            // Procura o parceiro na lista combinando o Nome exato + a Regional selecionada no cabeçalho
            const correspondente = listaAgentes.find(a =>
                a.nome.toLowerCase() === nomeDigitado.trim().toLowerCase() &&
                a.regional.toLowerCase() === cabecalho.regional?.toLowerCase()
            );

            return {
                nome: nomeDigitado.trim(),
                matricula: correspondente ? correspondente.matricula : 'MATRICULA_NAO_ENCONTRADA'
            };
        }).filter(Boolean); // Limpa campos nulos ou vazios que o agente possa ter deixado por engano

        // 2. Monta o pacote aplicando a nossa nova arquitetura baseada em Matrículas
        const payloadOffline = {
            ...cabecalho,
            imoveis: listaImoveis,
            // Mudamos de titular_login para titular_matricula para blindar o banco contra homônimos
            titular_matricula: localStorage.getItem('userMatricula') || 'DESCONHECIDO',
            // Injetamos a lista de parceiros contendo [ {nome: "...", matricula: "..."}, ... ]
            equipe_parceiros: equipeComMatriculas,
            data_registro: new Date().toISOString() // Importante para a ordenação depois
        };

        try {
            // 3. 🚀 CORTAMOS A INTERNET: Dispara os dados direto para a gaveta local do Dexie
            await db.fichas_soltas.add(payloadOffline);

            alert('✅ Ficha guardada na gaveta do tablet com sucesso!');
            setListaImoveis([]); // Limpa a tela para a próxima rua

            // Se o seu estado de parceiros for p.ex. 'setAgentes', limpe-o aqui para resetar o formulário:
            // setAgentes([]); 

            // Se a sua intenção é voltar para o menu após salvar, mantenha esta linha:
            if (typeof setTelaAtual === 'function') {
                setTelaAtual('campo_menu');
            }
        } catch (error) {
            console.error("Erro ao salvar ficha no Dexie:", error);
            alert('❌ Ocorreu um erro ao tentar trancar a ficha no armazenamento do tablet.');
        }
    };

    // 1. O Filtro agora olha para dentro do cabecalho
    const bairrosFiltrados = tabelaBairros.filter(b => b.regional === cabecalho.regional);

    //Filtro para agentes
    const agentesFiltrados = listaAgentesOficiais
        ? listaAgentesOficiais.filter(a => a.regional === cabecalho.regional)
        : [];

    const qtdAgentesValidos = cabecalho.agentes.filter
        (agente => agente && agente.trim() !== '').length;


    // 2. Atualiza a Regional dentro do cabecalho com segurança
    const handleRegionalChange = (e) => {
        const novaRegional = e.target.value;

        setCabecalho(prev => ({
            ...prev,
            regional: novaRegional,
            bairro: '',    // Limpa o bairro antigo
            estrato: ''    // Limpa o estrato antigo
        }));

        setErroBairro('');
    };

    // 3. Atualiza o Bairro dentro do cabecalho e já vincula o estrato
    const handleBairroChange = (e) => {
        const valorDigitado = e.target.value;

        // Procura se o que o agente digitou bate exatamente com a lista
        const bairroEncontrado = bairrosFiltrados.find(b => b.nome === valorDigitado);

        if (bairroEncontrado) {
            // Achou o bairro! Salva o nome e puxa o estrato escondido
            setCabecalho(prev => ({
                ...prev,
                bairro: valorDigitado,
                estrato: bairroEncontrado.estrato
            }));
            setErroBairro('');
        } else {
            // Bairro não encontrado ou digitado incompleto
            setCabecalho(prev => ({
                ...prev,
                bairro: valorDigitado,
                estrato: '' // Deixa vazio até ele acertar
            }));

            // Só mostra o erro se ele tiver digitado alguma coisa
            if (valorDigitado !== '') {
                setErroBairro('⚠️ Escolha um bairro válido para esta Regional.');
            } else {
                setErroBairro('');
            }
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '15px', color: '#fff', fontFamily: 'sans-serif', background: '#111', borderRadius: '10px' }}>

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

            <h2>📋 Novo Boletim de Campo</h2>
            <p style={{ color: '#aaa', fontSize: '14px' }}>Substituindo a Ficha Entomológica de Papel</p>


            {/* ================= BLOCÃO 1: CABEÇALHO (DINÂMICO) ================= */}
            {!headerMinimizado ? (
                // --- MODO EXPANDIDO ---
                <div style={{ background: '#222', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #333' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#42a5f5', fontSize: '16px' }}>📍 Dados da Folha / Ciclo</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                        {/* 1. CAMPO DA REGIONAL */}
                        <div>
                            <label style={{ fontSize: '12px' }}>Regional:</label>
                            <select
                                value={cabecalho.regional || ''}
                                onChange={handleRegionalChange}
                                style={styleInput}
                            >
                                <option value="">Selecione...</option>
                                <option value="Norte">Norte</option>
                                <option value="Sul">Sul</option>
                                <option value="Leste">Leste</option>
                                <option value="Oeste">Oeste</option>
                            </select>
                        </div>
                        {/* 2. CAMPO DO BAIRRO */}
                        <div>
                            <label style={{ fontSize: '12px' }}>Localidade / Bairro:</label>
                            <input
                                type="text"
                                list="lista-bairros"
                                value={cabecalho.bairro}
                                onChange={handleBairroChange}
                                placeholder={cabecalho.regional ? "🔍 Pesquisar bairro..." : "Bloqueado"}
                                disabled={!cabecalho.regional}
                                style={{
                                    ...styleInput,
                                    borderColor: erroBairro ? '#e74c3c' : (styleInput.borderColor || '#444'),
                                    cursor: cabecalho.regional ? 'text' : 'not-allowed',
                                    opacity: cabecalho.regional ? 1 : 0.6
                                }}
                            />
                            <datalist id="lista-bairros">
                                {bairrosFiltrados.map((b) => (
                                    <option key={b.nome} value={b.nome} />
                                ))}
                            </datalist>
                            {erroBairro && <span style={{ color: '#e74c3c', fontSize: '11px', display: 'block', marginTop: '4px' }}>{erroBairro}</span>}
                        </div>
                        {/* 3. CAMPO DA ZONA */}
                        <div>
                            <label style={{ fontSize: '12px' }}>Zona:</label>
                            <input
                                type="text"
                                value={cabecalho.zona}
                                onChange={e => setCabecalho({ ...cabecalho, zona: e.target.value })}
                                style={styleInput}
                            />
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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                        <div>
                            <label style={{ fontSize: '12px' }}>Ciclo:</label>
                            <input type="text" value={cabecalho.ciclo} onChange={e => setCabecalho({ ...cabecalho, ciclo: e.target.value })} style={styleInput} />
                        </div>
                        <div>
                            <label style={{ fontSize: '12px' }}>Semana:</label>
                            <input type="text" value={cabecalho.semana} onChange={e => setCabecalho({ ...cabecalho, semana: e.target.value })} style={styleInput} />
                        </div>
                    </div>

                    {/* ============================================================ */}
                    {/* 🔴 PARTE 3: CAIXA DE EQUIPE (COM TRAVA DE REGIONAL) 🔴 */}
                    {/* ============================================================ */}
                    <div style={{ marginTop: '5px', marginBottom: '20px', padding: '15px', background: '#1a1a1a', borderRadius: '8px', border: '1px solid #333' }}>
                        <h4 style={{ color: '#4fc3f7', marginBottom: '15px', marginTop: 0, fontSize: '14px' }}>👥 Equipe em Campo</h4>

                        {cabecalho.agentes.map((agente, index) => {
                            // 👈 Oculta a caixa do Agente Titular (posição 0) da interface
                            if (index === 0) return null;

                            return (
                                <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '12px', color: '#aaa', display: 'block', marginBottom: '4px' }}>
                                            Agente Parceiro {index}:
                                        </label>
                                        <input
                                            type="text"
                                            list="lista-agentes-oficiais"
                                            value={agente}
                                            onChange={(e) => handleNomeAgente(index, e.target.value)}
                                            placeholder={cabecalho.regional ? "🔍 Pesquisar ACE parceiro..." : "⚠️ Escolha a Regional primeiro"}
                                            disabled={!cabecalho.regional} // 👈 Trava a digitação
                                            style={{
                                                ...styleInput,
                                                cursor: cabecalho.regional ? 'text' : 'not-allowed',
                                                opacity: cabecalho.regional ? 1 : 0.6
                                            }}
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={(e) => removerAgente(index, e)}
                                        style={{
                                            background: 'transparent', border: 'none', color: '#e74c3c',
                                            cursor: 'pointer', marginTop: '18px', fontSize: '16px', padding: '0 5px'
                                        }}
                                        title="Remover colega"
                                    >
                                        ✖️
                                    </button>
                                </div>
                            );
                        })}


                        <datalist id="lista-agentes-oficiais">
                            {agentesFiltrados && agentesFiltrados.map((agente) => (
                                // O value preenche o input com o nome, o texto interno ajuda o agente a confirmar o crachá
                                <option key={agente.matricula} value={agente.nome}>
                                    Matrícula: {agente.matricula}
                                </option>
                            ))}
                        </datalist>

                        <button
                            type="button"
                            onClick={(e) => adicionarAgente(e)}
                            disabled={!cabecalho.regional} // 👈 SUA IDEIA APLICADA: Trava o clique do botão
                            style={{
                                background: cabecalho.regional ? '#333' : '#111',
                                color: cabecalho.regional ? '#fff' : '#555',
                                border: cabecalho.regional ? '1px dashed #666' : '1px dashed #333',
                                padding: '8px',
                                borderRadius: '4px',
                                cursor: cabecalho.regional ? 'pointer' : 'not-allowed',
                                width: '100%',
                                fontSize: '13px',
                                marginTop: '5px'
                            }}
                        >
                            ➕ Adicionar Colega à Equipe
                        </button>



                        {/* Calculadora (Agora totalmente blindada contra crashes e caixas vazias) */}
                        {qtdAgentesValidos > 1 && (typeof totalImoveis !== 'undefined' && totalImoveis > 0) && (
                            <div style={{ marginTop: '15px', padding: '10px', background: '#2c3e50', borderRadius: '6px', textAlign: 'center' }}>
                                <span style={{ color: '#ecf0f1', fontSize: '13px' }}>
                                    Total: <strong>{totalImoveis}</strong> imóveis ÷ <strong>{qtdAgentesValidos}</strong> agentes
                                </span>
                                <br />
                                <strong style={{ color: '#2ecc71', fontSize: '15px', display: 'block', marginTop: '4px' }}>
                                    = {(totalImoveis / qtdAgentesValidos).toFixed(1)} imóveis para cada
                                </strong>
                            </div>
                        )}
                    </div>
                    {/* ================= FIM DA PARTE 3 ================= */}

                    <button
                        type="button"
                        onClick={() => setHeaderMinimizado(true)}
                        style={{ width: '100%', padding: '10px', background: '#42a5f5', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        Confirmar Dados e Ocultar ⏫
                    </button>
                </div>
            ) : (
                // --- MODO MINIMIZADO ---
                <div
                    onClick={() => setHeaderMinimizado(false)}
                    style={{ background: '#1a237e', padding: '10px 15px', borderRadius: '6px', marginBottom: '20px', border: '1px solid #3949ab', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                        📍 {cabecalho.bairro || 'Sem Bairro'} | Ciclo: {cabecalho.ciclo} | Equipe: {cabecalho.agentes.filter(agente => agente && agente.trim() !== '').length}
                    </span>
                    <span style={{ fontSize: '12px', color: '#90caf9' }}>Editar ✏️</span>
                </div>
            )}

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

                {/* ========================================================================= */}
                {/* CAIXA DE MARCAÇÃO PARA DEPÓSITO ELIMINADO E SEUS CONTADORES */}
                <div style={{ marginTop: '15px', background: '#252525', padding: '10px', borderRadius: '6px', borderLeft: '4px solid #ef5350' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', color: '#ef5350' }}>
                        <input
                            type="checkbox"
                            checked={imovelAtual.teveDepositoEliminado}
                            onChange={(e) => setImovelAtual({ ...imovelAtual, teveDepositoEliminado: e.target.checked })}
                            style={{ width: '18px', height: '18px' }}
                        />
                        Houve Depósito Eliminado?
                    </label>

                    {/* SE A CAIXA FOR MARCADA, ESSA TELA APARECE MAGICA E AUTOMATICAMENTE */}
                    {imovelAtual.teveDepositoEliminado && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '15px' }}>
                            {['a2', 'b', 'c', 'd1', 'd2', 'e'].map(dep => {
                                const depElim = `${dep}_elim`; // Junta o nome (ex: vira 'a2_elim')
                                return (
                                    <div key={depElim} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px', background: '#333', borderRadius: '4px' }}>
                                        <span style={{ fontWeight: 'bold', textTransform: 'uppercase', color: '#ef5350' }}>{dep}:</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {/* A sua função alterarContador já é inteligente o suficiente para entender o nome novo! */}
                                            <button type="button" onClick={() => alterarContador(depElim, '-')} style={{ ...btnContador, background: '#555' }}>-</button>
                                            <span style={{ fontSize: '16px', minWidth: '20px', textAlign: 'center' }}>{imovelAtual[depElim]}</span>
                                            <button type="button" onClick={() => alterarContador(depElim, '+')} style={{ ...btnContador, background: '#555' }}>+</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ========================================================================= */}
                {/*  CAIXA DE TEXTO PARA OBSERVAÇÕES */}
                <div style={{ marginTop: '15px', marginBottom: '15px' }}>
                    <label style={{ fontSize: '12px' }}>Observações do Imóvel (Opcional):</label>
                    <textarea
                        rows="2"
                        placeholder="Ex: ocorrência de escorpião, casa abandonada..."
                        value={imovelAtual.observacao}
                        onChange={e => setImovelAtual({ ...imovelAtual, observacao: e.target.value })}
                        style={{ ...styleInput, resize: 'vertical', fontFamily: 'inherit' }}
                    />
                </div>
                {/* ========================================================================= */}

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