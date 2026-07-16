import React, { useState, useEffect } from 'react';
import './BloqueioQuimico.css';

export default function BloqueioQuimico() {
    const [bloqueios, setBloqueios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sucesso, setSucesso] = useState('');
    const [abaAtiva, setAbaAtiva] = useState('pendentes');

    // Estados para o Modal de Lançamento de Boletim (Executado)
    const [modalAberto, setModalAberto] = useState(false);
    const [bloqueioSelecionado, setBloqueioSelecionado] = useState(null);

    // Estados para o Modal de NÃO REALIZAÇÃO (Cancelamento/Justificativa)
    const [modalCancelamentoAberto, setModalCancelamentoAberto] = useState(false);
    const [justificativaCancelamento, setJustificativaCancelamento] = useState('');
    const [agenteRelator, setAgenteRelator] = useState('');

    // Campos do Boletim de Campo (Sucesso)
    const [inseticida, setInseticida] = useState('Fludora');
    const [equipamento, setEquipamento] = useState('Nebulizador Motorizado');
    const [dataRealizacao, setDataRealizacao] = useState('');
    const [equipeBorrifacao, setEquipeBorrifacao] = useState('');

    // 🟢 CORREÇÃO: Adicionado o campo "combustivel" de volta ao estado inicial
    const [linhasQuarteirao, setLinhasQuarteirao] = useState([
        { id: 1, numeroQuarteirao: '', imoveisBloqueados: '', tempoAplicacao: '', mlMinuto: '', combustivel: '' }
    ]);

    useEffect(() => {
        buscarBloqueiosProgramados();
    }, []);

    const buscarBloqueiosProgramados = () => {
        setLoading(true);
        setTimeout(() => {
            // 🟢 CORREÇÃO: Mock atualizado com Paciente, Quarteirão e Zona
            const dadosSupervisor = [
                {
                    id: 101,
                    paciente: 'MARIA DA SILVA',
                    bairro: 'ALPHAVILLE I',
                    distrito: 'DIS. NORTE',
                    quarteirao: 12,
                    zona: 'URBANA',
                    endereco: 'Rua das Orquídeas, Qd 5, Lt 12',
                    suspeita: 'Dengue',
                    tipoBloqueio: 'Mecânico + Químico (Borrifação)',
                    status: 'programado',
                    dataExecucao: '2026-07-16',
                    horaExecucao: '08:00',
                    supervisorResponsavel: 'PEDRO ALMEIDA'
                },
                {
                    id: 102,
                    paciente: 'ROBERTO CARLOS',
                    bairro: 'COND. ATHENAS',
                    distrito: 'DIS. SUL',
                    quarteirao: 5,
                    zona: 'URBANA',
                    endereco: 'Casa 45',
                    suspeita: 'Zika',
                    tipoBloqueio: 'Mecânico + Químico (Borrifação)',
                    status: 'programado',
                    dataExecucao: '2026-07-16',
                    horaExecucao: '09:30',
                    supervisorResponsavel: 'PEDRO ALMEIDA'
                }
            ];
            setBloqueios(dadosSupervisor);
            setLoading(false);
        }, 600);
    };

    // 🟢 FUNÇÕES DO FLUXO DE EXECUÇÃO (SUCESSO)
    const handleAbrirExecucao = (bloqueio) => {
        setBloqueioSelecionado(bloqueio);
        setInseticida('Fludora');
        setEquipamento('Nebulizador Motorizado');
        const hoje = new Date().toISOString().split('T')[0];
        setDataRealizacao(hoje);
        setEquipeBorrifacao('');
        setLinhasQuarteirao([{ id: Date.now(), numeroQuarteirao: '', imoveisBloqueados: '', tempoAplicacao: '', mlMinuto: '', combustivel: '' }]);
        setModalAberto(true);
    };

    const handleAdicionarLinha = () => {
        setLinhasQuarteirao([...linhasQuarteirao, { id: Date.now(), numeroQuarteirao: '', imoveisBloqueados: '', tempoAplicacao: '', mlMinuto: '', combustivel: '' }]);
    };

    const handleRemoverLinha = (id) => {
        if (linhasQuarteirao.length === 1) return;
        setLinhasQuarteirao(linhasQuarteirao.filter(linha => linha.id !== id));
    };

    const handleAlterarLinha = (id, campo, valor) => {
        setLinhasQuarteirao(prev => prev.map(linha => linha.id === id ? { ...linha, [campo]: valor } : linha));
    };

    const calcularTotais = () => {
        let totalTempo = 0;
        let totalCaldaMl = 0;

        linhasQuarteirao.forEach(linha => {
            const tempo = parseFloat(linha.tempoAplicacao) || 0;
            const vazao = parseFloat(linha.mlMinuto) || 0;
            totalTempo += tempo;
            totalCaldaMl += (tempo * vazao);
        });

        let consumoProduto = 0;
        let unidadeProduto = '';

        if (inseticida === 'Fludora') {
            consumoProduto = totalCaldaMl * (100 / 8000);
            unidadeProduto = 'g';
        } else if (inseticida === 'Alfacipermetrina') {
            consumoProduto = totalCaldaMl * (30 / 20000);
            unidadeProduto = 'ml';
        } else if (inseticida === 'Cielo ULV') {
            consumoProduto = totalCaldaMl;
            unidadeProduto = 'ml';
        }

        return {
            totalTempo,
            totalCaldaLitros: (totalCaldaMl / 1000).toFixed(2),
            consumoProduto: consumoProduto.toFixed(1),
            unidadeProduto
        };
    };

    const handleSalvarExecucao = (e) => {
        e.preventDefault();
        if (!equipamento || !dataRealizacao || !equipeBorrifacao) {
            alert("Por favor, preencha os dados do cabeçalho obrigatórios.");
            return;
        }
        const temLinhaInvalida = linhasQuarteirao.some(l => !l.numeroQuarteirao || !l.imoveisBloqueados || !l.tempoAplicacao || !l.mlMinuto);
        if (temLinhaInvalida) {
            alert("Por favor, preencha o Quarteirão, Imóveis, Tempo e Vazão (ml/min) em todas as linhas.");
            return;
        }

        const totais = calcularTotais();
        const bloqueioExecutado = {
            ...bloqueioSelecionado,
            status: 'executado',
            dadosExecucao: {
                inseticida, equipamento,
                dataRealizacao: dataRealizacao.split('-').reverse().join('/'),
                equipeBorrifacao, quarteiroesTrabalhados: linhasQuarteirao,
                totalImoveis: linhasQuarteirao.reduce((acc, curr) => acc + parseInt(curr.imoveisBloqueados || 0), 0),
                totalTempo: totais.totalTempo, totalCalda: totais.totalCaldaLitros,
                consumoConcentrado: `${totais.consumoProduto} ${totais.unidadeProduto}`,
                dataEncerramento: new Date().toLocaleDateString('pt-BR')
            }
        };

        setBloqueios(prev => prev.map(b => b.id === bloqueioSelecionado.id ? bloqueioExecutado : b));
        setSucesso(`Boletim de borrifação enviado com sucesso!`);
        setModalAberto(false);
        setBloqueioSelecionado(null);
        setTimeout(() => setSucesso(''), 5000);
    };

    // 🔴 FUNÇÕES DO FLUXO DE NÃO REALIZAÇÃO (CANCELAMENTO)
    const handleAbrirCancelamento = (bloqueio) => {
        setBloqueioSelecionado(bloqueio);
        setJustificativaCancelamento('');
        setAgenteRelator('');
        setModalCancelamentoAberto(true);
    };

    const handleSalvarCancelamento = (e) => {
        e.preventDefault();
        if (!justificativaCancelamento.trim() || !agenteRelator.trim()) return;

        const bloqueioCancelado = {
            ...bloqueioSelecionado,
            status: 'nao_realizado',
            dadosCancelamento: {
                justificativa: justificativaCancelamento,
                agenteRelator: agenteRelator,
                dataEncerramento: new Date().toLocaleDateString('pt-BR'),
                horaEncerramento: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            }
        };

        setBloqueios(prev => prev.map(b => b.id === bloqueioSelecionado.id ? bloqueioCancelado : b));
        setSucesso(`Bloqueio de borrifação no bairro ${bloqueioSelecionado.bairro} registrado como NÃO REALIZADO.`);
        setModalCancelamentoAberto(false);
        setBloqueioSelecionado(null);
        setTimeout(() => setSucesso(''), 5000);
    };

    // 🟢 FILTRAGEM DE ABAS
    const bloqueiosFiltrados = bloqueios.filter(b => {
        if (abaAtiva === 'pendentes') return b.status === 'programado';
        return b.status === 'executado' || b.status === 'nao_realizado';
    });

    const qtdPendentes = bloqueios.filter(b => b.status === 'programado').length;
    const qtdConcluidos = bloqueios.filter(b => b.status === 'executado' || b.status === 'nao_realizado').length;

    return (
        <div className="bq-content">
            <header className="bq-header">
                <h1>
                    <i className="fas fa-shield-alt"></i> Execução de Bloqueio Químico (Borrifação)
                </h1>
                <p>Painel de Campo: Registro de aplicações espaciais, boletins de imóveis e relatórios de impedimento.</p>
            </header>

            <div className="bq-abas">
                <button
                    className={`bq-aba ${abaAtiva === 'pendentes' ? 'ativa' : ''}`}
                    onClick={() => setAbaAtiva('pendentes')}
                >
                    <i className="fas fa-route"></i> Rotas Pendentes ({qtdPendentes})
                </button>
                <button
                    className={`bq-aba ${abaAtiva === 'concluidos' ? 'ativa' : ''}`}
                    onClick={() => setAbaAtiva('concluidos')}
                >
                    <i className="fas fa-check-double"></i> Concluídos / Justificados ({qtdConcluidos})
                </button>
            </div>

            {sucesso && (
                <div className="bq-alerta-sucesso">
                    <i className="fas fa-check-circle"></i> {sucesso}
                </div>
            )}

            {loading ? (
                <div className="bq-loading"><i className="fas fa-spinner fa-spin"></i> Carregando rotas operacionais...</div>
            ) : bloqueiosFiltrados.length === 0 ? (
                <div className="bq-vazio">
                    <i className="fas fa-clipboard-check"></i>
                    <p>{abaAtiva === 'pendentes' ? "Nenhuma rota pendente para a sua equipe hoje." : "Nenhum relatório foi fechado ainda."}</p>
                </div>
            ) : (
                <div className="bq-grade-demandas">
                    {bloqueiosFiltrados.map(bloqueio => (
                        <div key={bloqueio.id} className={`bq-card-demanda card-status-${bloqueio.status}`}>
                            <div className="bq-card-badges">
                                <span className="badge-distrito"><i className="fas fa-map-marker-alt"></i> {bloqueio.distrito}</span>
                                <span className={`badge-doenca ${bloqueio.suspeita.toLowerCase()}`}>{bloqueio.suspeita}</span>
                            </div>

                            <div className="bq-card-corpo">
                                <h3>{bloqueio.bairro}</h3>
                                {/* 🟢 CORREÇÃO: Exibe o paciente e o quarteirão no Card */}
                                <p className="bq-txt-endereco"><strong>Paciente:</strong> {bloqueio.paciente}</p>
                                <p className="bq-txt-endereco"><strong>Local:</strong> Quart. {bloqueio.quarteirao} - {bloqueio.endereco}</p>

                                {bloqueio.status === 'programado' && (
                                    <div className="bq-info-escala">
                                        <p><i className="fas fa-calendar-alt"></i> <strong>Programado para:</strong> {bloqueio.dataExecucao.split('-').reverse().join('/')} às {bloqueio.horaExecucao}</p>
                                        <p><i className="fas fa-user-shield"></i> <strong>Supervisor Resp.:</strong> {bloqueio.supervisorResponsavel}</p>
                                    </div>
                                )}

                                {/* Exibição para Bloqueio SUCESSO */}
                                {bloqueio.status === 'executado' && (
                                    <div className="bq-boletim-resumo">
                                        <hr className="bq-divisor-card" />
                                        <h4><i className="fas fa-file-signature"></i> Resumo do Boletim Técnico</h4>
                                        <div className="bq-boletim-dados">
                                            <p><strong>Data Realização:</strong> {bloqueio.dadosExecucao.dataRealizacao}</p>
                                            <p><strong>Aplicação:</strong> {bloqueio.dadosExecucao.totalImoveis} imóveis em {bloqueio.dadosExecucao.totalTempo} min</p>
                                            <p className="bq-destaque-consumo">
                                                <i className="fas fa-flask"></i> <strong>Consumo:</strong> {bloqueio.dadosExecucao.consumoConcentrado} de {bloqueio.dadosExecucao.inseticida}
                                            </p>
                                            <p><i className="fas fa-spray-can"></i> <strong>Equipe:</strong> {bloqueio.dadosExecucao.equipeBorrifacao}</p>
                                        </div>
                                        <small className="bq-data-envio">Enviado em {bloqueio.dadosExecucao.dataEncerramento}</small>
                                    </div>
                                )}

                                {/* Exibição para Bloqueio NÃO REALIZADO */}
                                {bloqueio.status === 'nao_realizado' && (
                                    <div className="bq-boletim-resumo cancelado">
                                        <hr className="bq-divisor-card cancelado" />
                                        <h4><i className="fas fa-exclamation-triangle"></i> Bloqueio Não Realizado</h4>
                                        <div className="bq-boletim-dados">
                                            <p><strong>Agente Relator:</strong> {bloqueio.dadosCancelamento.agenteRelator}</p>
                                            <p><strong>Justificativa Técnica:</strong> {bloqueio.dadosCancelamento.justificativa}</p>
                                        </div>
                                        <small className="bq-data-envio cancelado">Registrado em {bloqueio.dadosCancelamento.dataEncerramento} às {bloqueio.dadosCancelamento.horaEncerramento}</small>
                                    </div>
                                )}
                            </div>

                            <div className="bq-card-acao">
                                {bloqueio.status === 'programado' && (
                                    <div className="bq-botoes-acao-dupla">
                                        <button className="btn-executar" onClick={() => handleAbrirExecucao(bloqueio)} title="Registrar Borrifação">
                                            <i className="fas fa-check"></i> Executado
                                        </button>
                                        <button className="btn-nao-realizado" onClick={() => handleAbrirCancelamento(bloqueio)} title="Justificar Não Realização">
                                            <i className="fas fa-times"></i> Não Realizado
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ========================================================= */}
            {/* 🟢 JANELA MODAL DO BOLETIM (SUCESSO)                      */}
            {/* ========================================================= */}
            {modalAberto && bloqueioSelecionado && (
                <div className="bq-modal-overlay">
                    <div className="bq-modal-card bq-modal-largo">
                        <div className="bq-modal-header">
                            <h3><i className="fas fa-clipboard-list"></i> Boletim Técnico de Campo (Bloqueio Químico)</h3>
                            <button className="bq-btn-fechar" onClick={() => setModalAberto(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSalvarExecucao}>
                            <div className="bq-modal-body select-scroll">

                                <div className="bq-resumo-localizacao">
                                    <p><strong>Paciente Notificado:</strong> {bloqueioSelecionado.paciente}</p>
                                    <p><strong>Localidade:</strong> Quart. {bloqueioSelecionado.quarteirao}, {bloqueioSelecionado.bairro} ({bloqueioSelecionado.distrito})</p>
                                    <p><strong>Endereço de Referência:</strong> {bloqueioSelecionado.endereco}</p>
                                </div>

                                <div className="bq-subtitulo-form">Informações Gerais</div>
                                <div className="bq-form-linha-tripla">
                                    <div className="bq-form-group">
                                        <label>Inseticida Utilizado <span className="obrigatorio">*</span></label>
                                        <select value={inseticida} onChange={(e) => setInseticida(e.target.value)}>
                                            <option value="Fludora">Fludora</option>
                                            <option value="Cielo ULV">Cielo ULV</option>
                                            <option value="Alfacipermetrina">Alfacipermetrina</option>
                                        </select>
                                    </div>

                                    <div className="bq-form-group">
                                        <label>Equipamento Utilizado <span className="obrigatorio">*</span></label>
                                        <select value={equipamento} onChange={(e) => setEquipamento(e.target.value)} required>
                                            <option value="Nebulizador Motorizado">Nebulizador Motorizado</option>
                                            <option value="Nebulizador Manual">Nebulizador Manual</option>
                                        </select>
                                    </div>

                                    <div className="bq-form-group">
                                        <label>Data da Realização <span className="obrigatorio">*</span></label>
                                        <input
                                            type="date"
                                            value={dataRealizacao}
                                            onChange={(e) => setDataRealizacao(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="bq-subtitulo-form-tabela">
                                    <span>Produtividade por Quarteirão</span>
                                    <button type="button" className="btn-adicionar-linha" onClick={handleAdicionarLinha}>
                                        <i className="fas fa-plus"></i> Adicionar Quarteirão
                                    </button>
                                </div>

                                <div className="bq-tabela-dinamica-container">
                                    <table className="bq-tabela-boletim">
                                        <thead>
                                            <tr>
                                                <th>Nº Quarteirão <span className="obrigatorio">*</span></th>
                                                <th>Imóveis Bloqueados <span className="obrigatorio">*</span></th>
                                                <th>Tempo Aplic. (Min) <span className="obrigatorio">*</span></th>
                                                <th>Vazão (ml/min) <span className="obrigatorio">*</span></th>
                                                <th>Combustível Gasto</th>
                                                <th className="col-remover">Ação</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {linhasQuarteirao.map((linha) => (
                                                <tr key={linha.id}>
                                                    <td>
                                                        <input type="number" placeholder="Ex: 15" value={linha.numeroQuarteirao} onChange={(e) => handleAlterarLinha(linha.id, 'numeroQuarteirao', e.target.value)} required />
                                                    </td>
                                                    <td>
                                                        <input type="number" placeholder="Ex: 24" value={linha.imoveisBloqueados} onChange={(e) => handleAlterarLinha(linha.id, 'imoveisBloqueados', e.target.value)} required />
                                                    </td>
                                                    <td>
                                                        <input type="number" placeholder="Ex: 8" value={linha.tempoAplicacao} onChange={(e) => handleAlterarLinha(linha.id, 'tempoAplicacao', e.target.value)} required />
                                                    </td>
                                                    <td>
                                                        <input type="number" placeholder="Ex: 1000" value={linha.mlMinuto} onChange={(e) => handleAlterarLinha(linha.id, 'mlMinuto', e.target.value)} required />
                                                    </td>
                                                    <td>
                                                        <input type="text" placeholder="Ex: 300ml" value={linha.combustivel} onChange={(e) => handleAlterarLinha(linha.id, 'combustivel', e.target.value)} />
                                                    </td>
                                                    <td className="col-remover">
                                                        <button type="button" className="btn-remover-linha" onClick={() => handleRemoverLinha(linha.id)} title="Remover quarteirão">
                                                            <i className="fas fa-trash-alt"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="bq-painel-calculo">
                                    <div className="bq-calculo-item">
                                        <span>Volume de Calda Aplicada:</span>
                                        <strong>{calcularTotais().totalCaldaLitros} Litros</strong>
                                    </div>
                                    <div className="bq-calculo-item destaque">
                                        <span>Consumo do Concentrado:</span>
                                        <strong>{calcularTotais().consumoProduto} {calcularTotais().unidadeProduto} de {inseticida}</strong>
                                    </div>
                                </div>

                                <div className="bq-form-group">
                                    <label>Equipe de Borrifação: <span className="obrigatorio">*</span></label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Carlos Souza, Marcos Lima..."
                                        value={equipeBorrifacao}
                                        onChange={(e) => setEquipeBorrifacao(e.target.value)}
                                        required
                                    />
                                </div>

                            </div>

                            <div className="bq-modal-footer">
                                <button type="button" className="btn-cancelar" onClick={() => setModalAberto(false)}>Cancelar</button>
                                <button type="submit" className="btn-confirmar-boletim">
                                    <i className="fas fa-save"></i> Enviar Boletim Técnico
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================================================= */}
            {/* 🔴 JANELA MODAL DE CANCELAMENTO / NÃO REALIZAÇÃO          */}
            {/* ========================================================= */}
            {modalCancelamentoAberto && bloqueioSelecionado && (
                <div className="bq-modal-overlay">
                    <div className="bq-modal-card">
                        <div className="bq-modal-header cancelamento-header">
                            <h3><i className="fas fa-exclamation-triangle"></i> Registrar Não Realização de Bloqueio</h3>
                            <button className="bq-btn-fechar" onClick={() => setModalCancelamentoAberto(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSalvarCancelamento}>
                            <div className="bq-modal-body">

                                <div className="bq-resumo-localizacao cancelamento-resumo">
                                    <p><strong>Paciente Notificado:</strong> {bloqueioSelecionado.paciente}</p>
                                    <p><strong>Localidade:</strong> Quart. {bloqueioSelecionado.quarteirao}, {bloqueioSelecionado.bairro} ({bloqueioSelecionado.distrito})</p>
                                    <p><strong>Endereço Alvo:</strong> {bloqueioSelecionado.endereco}</p>
                                </div>

                                <div className="bq-form-group mt-10">
                                    <label>Nome do Agente Relator <span className="obrigatorio">*</span></label>
                                    <input
                                        type="text"
                                        placeholder="Seu nome"
                                        value={agenteRelator}
                                        onChange={(e) => setAgenteRelator(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="bq-form-group">
                                    <label>Justificativa Técnica / Motivo do Impedimento <span className="obrigatorio">*</span></label>
                                    <textarea
                                        rows="4"
                                        placeholder="Ex: Não foi possível realizar o bloqueio devido a fortes chuvas no horário programado. / Ex: Endereço não localizado, morador se mudou."
                                        value={justificativaCancelamento}
                                        onChange={(e) => setJustificativaCancelamento(e.target.value)}
                                        required
                                    ></textarea>
                                </div>

                            </div>

                            <div className="bq-modal-footer">
                                <button type="button" className="btn-cancelar" onClick={() => setModalCancelamentoAberto(false)}>Cancelar</button>
                                <button type="submit" className="btn-confirmar-cancelamento">
                                    <i className="fas fa-paper-plane"></i> Enviar Justificativa
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}