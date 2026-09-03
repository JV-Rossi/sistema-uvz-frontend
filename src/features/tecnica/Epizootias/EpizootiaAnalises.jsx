import React, { useState, useEffect } from 'react';

// 🟢 IMPORTS DOS COMPONENTES E ESTILOS DE LABORATÓRIO
import PainelOperacionalBase from '../../../shared/components/PainelOperacionalBase';
import '../../../shared/components/Formularios.css';
import '../administrativo/formularios-os/FormAnaliseBase.css';

// IMPORT DO MODAL DE RESULTADOS/ENCERRAMENTO
import EpizootiaResultados from './EpizootiaResultados'; 

export default function EpizootiaAnalises() {
    const [amostras, setAmostras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sucesso, setSucesso] = useState('');
    const [abaAtiva, setAbaAtiva] = useState('pendentes');

    // ESTADO PARA CONTROLAR A ABERTURA DO MODAL DE ENCERRAMENTO
    const [amostraEncerramento, setAmostraEncerramento] = useState(null);

    useEffect(() => {
        setTimeout(() => {
            setAmostras([
                {
                    id: 601,
                    codigoTubo: 'DPP-2026-042',
                    tipoAmostra: 'Triagem DPP - Leishmaniose Canina',
                    origem: 'Vistoria Zoosanitária (Pedra 90)',
                    agenteColetor: 'CARLOS ALBERTO',
                    municipe: 'JOÃO DA SILVA',
                    dataEntrada: '05/08/2026',
                    qtdExemplares: 2,
                    status: 'pendente'
                },
                {
                    id: 602,
                    codigoTubo: 'DPP-2026-018',
                    tipoAmostra: 'Triagem DPP - Leishmaniose Canina',
                    origem: 'Busca Ativa (CPA III)',
                    agenteColetor: 'ANA PAULA',
                    municipe: 'MARIA AUXILIADORA',
                    dataEntrada: '08/08/2026',
                    qtdExemplares: 3,
                    status: 'pendente'
                }
            ]);
            setLoading(false);
        }, 500);
    }, []);

    // 1️⃣ Salva a Triagem DPP de Bancada e move para "Encerramentos"
    const handleSalvarAnalise = (id, dadosAnalise) => {
        setAmostras(prev => prev.map(item => {
            if (item.id !== id) return item;

            const precisaLabExterno = dadosAnalise.resumo.requerLabExterno;

            return {
                ...item,
                status: 'encerramento',
                dadosAnalise,
                statusEncerramento: precisaLabExterno ? 'aguardando_lab_externo' : 'pronto_para_alta'
            };
        }));

        const msgSucesso = dadosAnalise.resumo.requerLabExterno
            ? `Triagem #${id} concluída! Amostra REAGENTE enviada para Encerramentos (Obrigatório LACEN).`
            : `Triagem #${id} concluída! Amostras NEGATIVAS encaminhadas para Encerramento direto.`;

        setSucesso(msgSucesso);
        setTimeout(() => setSucesso(''), 5000);
    };

    // 2️⃣ Recebe os dados do formulário EpizootiaResultados (Modal) e finaliza o serviço
    const handleSalvarEncerramento = (id, dadosEncerramento) => {
        setAmostras(prev => prev.map(item => {
            if (item.id !== id) return item;

            return {
                ...item,
                status: 'executado',
                dataEncerramento: dadosEncerramento.dataEncerramento,
                dadosEncerramento 
            };
        }));

        setSucesso(`Serviço #${id} encerrado com sucesso e arquivado em Concluídos!`);
        setTimeout(() => setSucesso(''), 4000);
    };

    const handleInviabilizarAmostra = (id, dadosCancelamento) => {
        setAmostras(prev => prev.map(item => item.id === id ? {
            ...item,
            status: 'nao_realizado',
            dadosCancelamento
        } : item));

        setSucesso(`Amostra #${id} registrada como Inviabilizada / Hemolisada / Descartada.`);
        setTimeout(() => setSucesso(''), 4000);
    };

    return (
        <>
            <PainelOperacionalBase
                titulo="Epizootias e Zoonoses - Bancada e Retaguarda Diagnóstica"
                subtitulo="Triagem Rápida DPP Local e Controle de Amostras para Laboratório de Referência"
                icone="fa-vial"
                itens={amostras}
                loading={loading}
                sucesso={sucesso}
                abaAtiva={abaAtiva}
                setAbaAtiva={setAbaAtiva}

                textoAbaPendentes="Fila de Análise"
                textoAbaEncerramentos="Encerramentos"
                textoAbaConcluidos="Serviços Concluídos"

                tituloModalExecucao="Bancada Técnica: Testagem Rápida DPP (LVC)"
                onConfirmarCancelamento={handleInviabilizarAmostra}

                renderCardBadges={(item) => (
                    <>
                        <span className="badge-distrito"><i className="fas fa-vial"></i> {item.codigoTubo}</span>
                        <span className="badge-doenca leishmaniose">
                            {item.tipoAmostra}
                        </span>
                        {item.statusEncerramento === 'aguardando_lab_externo' && item.status !== 'executado' && (
                            <span className="badge-alerta" style={{ backgroundColor: '#dc3545', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>
                                <i className="fas fa-hourglass-half mr-1"></i> Aguardando LACEN
                            </span>
                        )}
                        {item.status === 'executado' && (
                            <span className="badge-concluido" style={{ backgroundColor: '#28a745', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>
                                <i className="fas fa-check-double mr-1"></i> Finalizado
                            </span>
                        )}
                    </>
                )}

                renderCardCorpo={(item) => (
                    <>
                        <h3>{item.origem}</h3>
                        <p className="po-txt-endereco"><strong>Tutor:</strong> {item.municipe}</p>
                        <p className="po-txt-endereco"><strong>Agente Coletor:</strong> {item.agenteColetor}</p>
                        <p className="po-txt-endereco"><strong>Entrada:</strong> {item.dataEntrada}</p>
                        <p className="po-txt-detalhe"><strong>Qtd Tubos:</strong> {item.qtdExemplares} exemplar(es)</p>
                    </>
                )}

                /* 🟢 CARD LIMPO E MODERNO */
                renderResumoExecutado={(item) => {
                    const temReagente = item.dadosAnalise?.resumo?.requerLabExterno;
                    const totalReagentes = item.dadosAnalise?.resumo?.totalReagentes || 0;
                    const totalNaoReagentes = item.dadosAnalise?.resumo?.totalNaoReagentes || 0;

                    return (
                        <div style={{
                            marginTop: '12px',
                            padding: '12px',
                            backgroundColor: '#f8fafc',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0'
                        }}>
                            {/* LINHA DE STATUS DO DPP */}
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    <i className="fas fa-vial mr-1"></i> Triagem DPP
                                </span>
                                <span style={{
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    backgroundColor: temReagente ? '#fee2e2' : '#dcfce7',
                                    color: temReagente ? '#b91c1c' : '#15803d'
                                }}>
                                    {temReagente ? 'Reagente (+)' : 'Não Reagente (-)'}
                                </span>
                            </div>

                            {/* PILLS COM AS CONTAGENS */}
                            <div className="d-flex gap-2 mb-3" style={{ fontSize: '12px' }}>
                                <span style={{
                                    backgroundColor: totalReagentes > 0 ? '#fff1f2' : '#f1f5f9',
                                    color: totalReagentes > 0 ? '#e11d48' : '#64748b',
                                    border: `1px solid ${totalReagentes > 0 ? '#fecdd3' : '#e2e8f0'}`,
                                    padding: '3px 8px',
                                    borderRadius: '5px',
                                    fontWeight: '600'
                                }}>
                                    {totalReagentes} Reagente(s)
                                </span>
                                <span style={{
                                    backgroundColor: totalNaoReagentes > 0 ? '#f0fdf4' : '#f1f5f9',
                                    color: totalNaoReagentes > 0 ? '#16a34a' : '#64748b',
                                    border: `1px solid ${totalNaoReagentes > 0 ? '#bbf7d0' : '#e2e8f0'}`,
                                    padding: '3px 8px',
                                    borderRadius: '5px',
                                    fontWeight: '600'
                                }}>
                                    {totalNaoReagentes} Negativo(s)
                                </span>
                            </div>

                            {/* CASO JÁ ESTEJA NA ABA "CONCLUÍDOS" */}
                            {item.status === 'executado' && item.dadosEncerramento && (
                                <div style={{
                                    padding: '8px 10px',
                                    backgroundColor: '#fff',
                                    borderRadius: '6px',
                                    border: '1px solid #cbd5e1',
                                    fontSize: '12px',
                                    color: '#334155'
                                }}>
                                    {item.dadosEncerramento.dadosLacen ? (
                                        <div><strong>GAL:</strong> {item.dadosEncerramento.dadosLacen.protocolo}</div>
                                    ) : (
                                        <div className="text-success"><i className="fas fa-check mr-1"></i> Arquivado por Triagem Negativa</div>
                                    )}
                                    <div className="text-muted text-small mt-1">
                                        Encerrado por {item.dadosEncerramento.responsavelEncerramento}
                                    </div>
                                </div>
                            )}

                            {/* BOTÃO LIMPO DE AÇÃO NA ABA "ENCERRAMENTOS" */}
                            {item.status === 'encerramento' && (
                                <button
                                    type="button"
                                    style={{
                                        width: '100%',
                                        padding: '9px 14px',
                                        backgroundColor: temReagente ? '#0288d1' : '#2e7d32',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontWeight: '600',
                                        fontSize: '13px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                                    }}
                                    onClick={() => setAmostraEncerramento(item)}
                                >
                                    <i className={`fas ${temReagente ? 'fa-file-signature' : 'fa-check-double'}`}></i>
                                    {temReagente ? 'Inserir Laudo' : 'Concluir e Arquivar'}
                                </button>
                            )}
                        </div>
                    );
                }}

                renderFormExecucao={(item, fecharModal) => (
                    <FormAnaliseEpizootias 
                        amostra={item} 
                        onSubmitLaudo={(dadosLaudo) => { 
                            handleSalvarAnalise(item.id, dadosLaudo); 
                            fecharModal(); 
                        }} 
                        onCancelar={fecharModal} 
                    />
                )}
            />

            {/* MODAL DE ENCERRAMENTO */}
            {amostraEncerramento && (
                <div className="po-modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 9999, padding: '16px'
                }}>
                    <div className="po-modal-conteudo" style={{
                        backgroundColor: '#fff', borderRadius: '8px', maxWidth: '1000px', width: '100%', maxHeight: '90vh',
                        display: 'flex', flexDirection: 'column', boxShadow: '0 10px 25px rgba(0,0,0,0.3)', overflow: 'hidden'
                    }}>
                        <div className="po-modal-header d-flex justify-content-between align-items-center p-3 border-bottom bg-light">
                            <h3 className="m-0 text-primary font-weight-bold" style={{ fontSize: '1.2rem' }}>
                                <i className="fas fa-file-medical-alt mr-2"></i>
                                Encerramento de Amostra #{amostraEncerramento.id}
                            </h3>
                            <button 
                                type="button" 
                                onClick={() => setAmostraEncerramento(null)} 
                                style={{ border: 'none', background: 'transparent', fontSize: '1.6rem', cursor: 'pointer', color: '#fff' }}
                            >
                                &times;
                            </button>
                        </div>
                        <div className="po-modal-body p-3" style={{ overflowY: 'auto' }}>
                            <EpizootiaResultados
                                amostra={amostraEncerramento}
                                onSalvar={(dados) => { 
                                    handleSalvarEncerramento(amostraEncerramento.id, dados); 
                                    setAmostraEncerramento(null); 
                                }}
                                onCancelar={() => setAmostraEncerramento(null)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// ------------------------------------------------------------------
// COMPONENTE DE FORMULÁRIO DE BANCADA
// ------------------------------------------------------------------
function FormAnaliseEpizootias({ amostra, onSubmitLaudo, onCancelar }) {
    const [tecnicoAnalista, setTecnicoAnalista] = useState('');
    const [dataAnalise, setDataAnalise] = useState(new Date().toISOString().split('T')[0]);
    const [metodoKit, setMetodoKit] = useState('DPP - Teste Rápido Imunocromatográfico (Bio-Manguinhos)');
    const [loteKit, setLoteKit] = useState('');
    const [observacoes, setObservacoes] = useState('');
    
    const [resultadosAnimais, setResultadosAnimais] = useState(() => {
        const qtd = amostra?.qtdExemplares || 1;
        return Array.from({ length: qtd }, (_, i) => ({
            id: Date.now() + i,
            identificacaoAnimal: `Cão #${i + 1} (${amostra?.municipe ? 'Tutor: ' + amostra.municipe : 'Canino'})`,
            especie: 'CÃO',
            resultadoDpp: 'Não Reagente'
        }));
    });

    const handleAdicionarLinha = () => {
        setResultadosAnimais(prev => [
            ...prev,
            {
                id: Date.now() + Math.random(),
                identificacaoAnimal: `Cão #${prev.length + 1}`,
                especie: 'CÃO',
                resultadoDpp: 'Não Reagente'
            }
        ]);
    };

    const handleRemoverLinha = (id) => {
        if (resultadosAnimais.length === 1) return;
        setResultadosAnimais(prev => prev.filter(item => item.id !== id));
    };

    const handleLinhaChange = (id, campo, valor) => {
        setResultadosAnimais(prev => prev.map(item => {
            if (item.id !== id) return item;
            return { ...item, [campo]: valor };
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!tecnicoAnalista.trim()) {
            alert("Por favor, preencha o nome do examinador da bancada.");
            return;
        }

        const totalExemplares = resultadosAnimais.length;
        const totalReagentes = resultadosAnimais.filter(a => a.resultadoDpp === 'Reagente').length;
        const totalNaoReagentes = resultadosAnimais.filter(a => a.resultadoDpp === 'Não Reagente').length;

        const requerLabExterno = totalReagentes > 0; 

        const resultadoGeral = requerLabExterno 
            ? 'REAGENTE (+) - AGUARDA LACEN' 
            : 'NÃO REAGENTE (-)';

        const laudoTriagem = {
            amostraId: amostra?.id,
            codigoTubo: amostra?.codigoTubo,
            tecnicoAnalista,
            dataAnalise,
            metodoKit,
            loteKit,
            resultadosAnimais,
            resumo: {
                totalExemplares,
                totalReagentes,
                totalNaoReagentes,
                resultadoGeral,
                requerLabExterno
            },
            observacoes
        };

        if (onSubmitLaudo) {
            onSubmitLaudo(laudoTriagem);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="po-form-container p-2">
            {amostra && (
                <div className="br-card p-3 mb-3 bg-light border-left-primary border rounded">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <div>
                            <span className="badge-distrito"><i className="fas fa-vial mr-1"></i> {amostra.codigoTubo}</span>
                            <span className="ml-2 font-weight-bold text-primary">{amostra.tipoAmostra}</span>
                        </div>
                        <div className="text-small text-muted">
                            <i className="fas fa-user mr-1"></i> Tutor: <strong>{amostra.municipe}</strong> | Entrada: <strong>{amostra.dataEntrada}</strong>
                        </div>
                    </div>
                </div>
            )}

            <div className="po-card-secao mb-4 border rounded p-3 bg-white shadow-sm">
                <div className="po-subtitulo-form border-bottom pb-2 mb-3 text-primary font-weight-bold">
                    <i className="fas fa-microscope mr-2"></i> 1. Identificação Técnica da Triagem Rápida (DPP)
                </div>

                <div className="po-form-linha-tripla">
                    <div className="po-form-group">
                        <label>Examinador <span className="obrigatorio">*</span></label>
                        <input
                            type="text"
                            value={tecnicoAnalista}
                            onChange={(e) => setTecnicoAnalista(e.target.value)}
                            required
                        />
                    </div>
                    <div className="po-form-group">
                        <label>Data da Leitura <span className="obrigatorio">*</span></label>
                        <input
                            type="date"
                            value={dataAnalise}
                            onChange={(e) => setDataAnalise(e.target.value)}
                            required
                        />
                    </div>
                    <div className="po-form-group">
                        <label>Metodologia</label>
                        <input
                            type="text"
                            value={metodoKit}
                            readOnly
                            style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                        />
                    </div>
                </div>

                <div className="po-form-group mt-3">
                    <label>Nº do Lote do Kit DPP <span className="obrigatorio">*</span></label>
                    <input
                        type="text"
                        placeholder="Ex: 26DPP015Z"
                        value={loteKit}
                        onChange={(e) => setLoteKit(e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="po-card-secao mb-4 border rounded p-3 bg-white shadow-sm">
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3 flex-wrap gap-2">
                    <span className="po-subtitulo-form text-primary font-weight-bold m-0">
                        <i className="fas fa-vial mr-2"></i> 2. Leitura Rápida DPP por Amostra
                    </span>
                    <button
                        type="button"
                        className="br-button primary small"
                        onClick={handleAdicionarLinha}
                    >
                        <i className="fas fa-plus mr-1"></i> Adicionar Animal
                    </button>
                </div>

                <div className="table-responsive">
                    <table className="triato-analise-table">
                        <thead>
                            <tr>
                                <th style={{ width: '8%' }}>#</th>
                                <th style={{ width: '60%' }}>Identificação do Animal / Amostra</th>
                                <th style={{ width: '22%' }}>Resultado DPP</th>
                                <th style={{ width: '10%', textAlign: 'center' }}>Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultadosAnimais.map((ra, index) => (
                                <tr key={ra.id}>
                                    <td className="text-center font-weight-bold">{index + 1}</td>
                                    <td>
                                        <input
                                            type="text"
                                            className="triato-input-texto"
                                            value={ra.identificacaoAnimal}
                                            onChange={(e) => handleLinhaChange(ra.id, 'identificacaoAnimal', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <select
                                            className={`triato-select-grid font-weight-bold ${ra.resultadoDpp === 'Reagente' ? 'text-danger' : 'text-success'}`}
                                            value={ra.resultadoDpp}
                                            onChange={(e) => handleLinhaChange(ra.id, 'resultadoDpp', e.target.value)}
                                        >
                                            <option value="Não Reagente">Não Reagente (-)</option>
                                            <option value="Reagente">Reagente (+)</option>
                                        </select>
                                    </td>
                                    <td className="text-center">
                                        <button
                                            type="button"
                                            className="btn-remover-linha"
                                            title="Remover Amostra"
                                            onClick={() => handleRemoverLinha(ra.id)}
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="triato-resumo-bancada mt-3 p-2 rounded bg-light border d-flex justify-content-around text-center flex-wrap gap-2">
                    <div>
                        <small className="text-muted d-block text-uppercase font-weight-bold">Amostras Testadas</small>
                        <span className="h6 font-weight-bold">{resultadosAnimais.length}</span>
                    </div>
                    <div>
                        <small className="text-success d-block text-uppercase font-weight-bold">Não Reagentes (-)</small>
                        <span className="h6 text-success font-weight-bold">{resultadosAnimais.filter(e => e.resultadoDpp === 'Não Reagente').length}</span>
                    </div>
                    <div>
                        <small className="text-danger d-block text-uppercase font-weight-bold">Reagentes (+)</small>
                        <span className="h6 text-danger font-weight-bold">{resultadosAnimais.filter(e => e.resultadoDpp === 'Reagente').length}</span>
                    </div>
                </div>
            </div>

            <div className="po-card-secao mb-4 border rounded p-3 bg-white shadow-sm">
                <label className="font-weight-bold text-dark d-block mb-2">
                    <i className="fas fa-sticky-note mr-2 text-primary"></i> Observações da Bancada:
                </label>
                <textarea
                    rows="3"
                    className="br-input triato-textarea-obs"
                    placeholder="Ex: Soro límpido. Amostra encaminhada ao LACEN via GAL..."
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                ></textarea>
            </div>

            <div className="po-modal-footer d-flex justify-content-end gap-2 mt-3 pt-3 border-top">
                {onCancelar && (
                    <button type="button" className="btn-cancelar mr-2" onClick={onCancelar}>
                        Cancelar
                    </button>
                )}
                <button type="submit" className="btn-confirmar-boletim">
                    <i className="fas fa-share-square mr-1"></i> Salvar e Prosseguir
                </button>
            </div>
        </form>
    );
}