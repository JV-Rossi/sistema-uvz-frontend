import React, { useState } from 'react';

// 🟢 IMPORT DO CSS COMPARTILHADO (Mesma pasta: src/shared/components/)
import './PainelOperacionalBase.css';

export default function PainelOperacionalBase({
    titulo,
    subtitulo,
    icone = "fa-tasks",
    itens = [],
    loading = false,
    sucesso = '',
    erro = '',
    abaAtiva,
    setAbaAtiva,
    textoAbaPendentes = "Pendentes",
    textoAbaConcluidos = "Concluídos / Justificados",

    // Injeções dinâmicas dos Cards
    renderCardBadges,
    renderCardCorpo,
    renderResumoExecutado,
    renderResumoCancelado,

    // Configurações do Modal de Execução / Laudo
    tituloModalExecucao = "Boletim / Laudo Técnico",
    renderFormExecucao,

    // Configurações do Modal Padrão de Cancelamento / Não Realização
    tituloModalCancelamento = "Registrar Não Realização / Impedimento",
    onConfirmarCancelamento,
    renderFormCancelamentoCustom
}) {
    const [modalExecucaoAberto, setModalExecucaoAberto] = useState(false);
    const [modalCancelamentoAberto, setModalCancelamentoAberto] = useState(false);
    const [itemSelecionado, setItemSelecionado] = useState(null);

    // Handlers de Abertura e Fechamento
    const handleAbrirExecucao = (item) => {
        setItemSelecionado(item);
        setModalExecucaoAberto(true);
    };

    const handleAbrirCancelamento = (item) => {
        setItemSelecionado(item);
        setModalCancelamentoAberto(true);
    };

    const fecharModais = () => {
        setModalExecucaoAberto(false);
        setModalCancelamentoAberto(false);
        setItemSelecionado(null);
    };

    // Filtros de Abas
    const itensFiltrados = itens.filter(i => {
        if (abaAtiva === 'pendentes') return i.status === 'programado' || i.status === 'pendente';
        return i.status === 'executado' || i.status === 'nao_realizado';
    });

    const qtdPendentes = itens.filter(i => i.status === 'programado' || i.status === 'pendente').length;
    const qtdConcluidos = itens.filter(i => i.status === 'executado' || i.status === 'nao_realizado').length;

    return (
        <div className="po-content">
            
            {/* 1. CABEÇALHO DA PÁGINA */}
            <header className="po-header">
                <h1><i className={`fas ${icone}`}></i> {titulo}</h1>
                <p>{subtitulo}</p>
            </header>

            {/* 2. NAVEGAÇÃO DE ABAS */}
            <div className="po-abas">
                <button
                    className={`po-aba ${abaAtiva === 'pendentes' ? 'ativa' : ''}`}
                    onClick={() => setAbaAtiva('pendentes')}
                >
                    <i className="fas fa-clock mr-1"></i> {textoAbaPendentes} ({qtdPendentes})
                </button>
                <button
                    className={`po-aba ${abaAtiva === 'concluidos' ? 'ativa' : ''}`}
                    onClick={() => setAbaAtiva('concluidos')}
                >
                    <i className="fas fa-check-double mr-1"></i> {textoAbaConcluidos} ({qtdConcluidos})
                </button>
            </div>

            {/* 3. MENSAGENS DE FEEDBACK */}
            {sucesso && <div className="po-alerta-sucesso"><i className="fas fa-check-circle"></i> {sucesso}</div>}
            {erro && <div className="br-message is-danger mb-4"><i className="fas fa-times-circle"></i> {erro}</div>}

            {/* 4. LISTA DE CARDS / DEMANDAS */}
            {loading ? (
                <div className="po-loading">
                    <i className="fas fa-spinner fa-spin mr-2"></i> Carregando registros...
                </div>
            ) : itensFiltrados.length === 0 ? (
                <div className="po-vazio">
                    <i className="fas fa-clipboard-check"></i>
                    <p>{abaAtiva === 'pendentes' ? "Nenhuma demanda pendente no momento." : "Nenhum histórico encontrado nesta seção."}</p>
                </div>
            ) : (
                <div className="po-grade-demandas">
                    {itensFiltrados.map(item => (
                        <div key={item.id} className={`po-card-demanda card-status-${item.status}`}>
                            
                            {/* Badges superiores */}
                            <div className="po-card-badges">
                                {renderCardBadges && renderCardBadges(item)}
                            </div>

                            {/* Corpo principal do card */}
                            <div className="po-card-corpo">
                                {renderCardCorpo && renderCardCorpo(item)}

                                {/* Exibição de resumos para itens já finalizados */}
                                {item.status === 'executado' && renderResumoExecutado && renderResumoExecutado(item)}
                                {item.status === 'nao_realizado' && renderResumoCancelado && renderResumoCancelado(item)}
                            </div>

                            {/* Botões de Ação Dupla (SÓ PARA PENDENTES) */}
                            <div className="po-card-acao">
                                {(item.status === 'programado' || item.status === 'pendente') && (
                                    <div className="po-botoes-acao-dupla">
                                        <button className="btn-executar" onClick={() => handleAbrirExecucao(item)}>
                                            <i className="fas fa-check"></i> Executado / Laudo
                                        </button>
                                        <button className="btn-nao-realizado" onClick={() => handleAbrirCancelamento(item)}>
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
            {/* 🟢 MODAL 1: EXECUÇÃO / LAUDO TÉCNICO                      */}
            {/* ========================================================= */}
            {modalExecucaoAberto && itemSelecionado && (
                <div className="po-modal-overlay">
                    <div className="po-modal-card po-modal-largo">
                        <div className="po-modal-header">
                            <h3><i className="fas fa-clipboard-list mr-2"></i> {tituloModalExecucao}</h3>
                            <button className="po-btn-fechar" onClick={fecharModais}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        {renderFormExecucao && renderFormExecucao(itemSelecionado, fecharModais)}
                    </div>
                </div>
            )}

            {/* ========================================================= */}
            {/* 🔴 MODAL 2: CANCELAMENTO / NÃO REALIZAÇÃO (PADRÃO)         */}
            {/* ========================================================= */}
            {modalCancelamentoAberto && itemSelecionado && (
                <div className="po-modal-overlay">
                    <div className="po-modal-card">
                        
                        {/* Cabeçalho Vermelho do Modal */}
                        <div className="po-modal-header cancelamento-header">
                            <h3><i className="fas fa-exclamation-triangle mr-2"></i> {tituloModalCancelamento}</h3>
                            <button className="po-btn-fechar" onClick={fecharModais}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        {/* Se a página enviou um formulário customizado, usa ele. Senão, usa o Form Padrão! */}
                        {renderFormCancelamentoCustom ? (
                            renderFormCancelamentoCustom(itemSelecionado, fecharModais)
                        ) : (
                            <FormCancelamentoPadrao
                                item={itemSelecionado}
                                onSalvar={(dadosCancelamento) => {
                                    if (onConfirmarCancelamento) {
                                        onConfirmarCancelamento(itemSelecionado.id, dadosCancelamento);
                                    }
                                    fecharModais();
                                }}
                                onCancelar={fecharModais}
                            />
                        )}

                    </div>
                </div>
            )}

        </div>
    );
}

/* ==========================================================================
   SUB-COMPONENTE INTERNO: FORMULÁRIO DE CANCELAMENTO PADRÃO
   ========================================================================== */
function FormCancelamentoPadrao({ item, onSalvar, onCancelar }) {
    const [agenteRelator, setAgenteRelator] = useState('');
    const [justificativa, setJustificativa] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!agenteRelator.trim() || !justificativa.trim()) return;

        onSalvar({
            agenteRelator,
            justificativa,
            dataEncerramento: new Date().toLocaleDateString('pt-BR'),
            horaEncerramento: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="po-modal-body">
                
                {/* Resumo visual do local afetado */}
                <div className="po-resumo-localizacao cancelamento-resumo">
                    {item.paciente && <p><strong>Paciente / Solicitante:</strong> {item.paciente || item.municipe}</p>}
                    <p><strong>Localidade:</strong> {item.bairro} ({item.distrito || 'Cuiabá'})</p>
                    <p><strong>Endereço:</strong> {item.endereco}</p>
                </div>

                {/* Nome do Agente que relata */}
                <div className="po-form-group mt-10">
                    <label>Nome do Agente Relator <span className="obrigatorio">*</span></label>
                    <input
                        type="text"
                        placeholder="Digite seu nome completo"
                        value={agenteRelator}
                        onChange={(e) => setAgenteRelator(e.target.value)}
                        required
                    />
                </div>

                {/* Justificativa técnica */}
                <div className="po-form-group">
                    <label>Justificativa Técnica / Motivo do Impedimento <span className="obrigatorio">*</span></label>
                    <textarea
                        rows="4"
                        placeholder="Ex: Imóvel fechado durante 3 tentativas. / Ex: Recusa expressa do morador. / Ex: Condições climáticas adversas (chuva forte)."
                        value={justificativa}
                        onChange={(e) => setJustificativa(e.target.value)}
                        required
                    ></textarea>
                </div>

            </div>

            {/* Rodapé do Modal */}
            <div className="po-modal-footer">
                <button type="button" className="btn-cancelar" onClick={onCancelar}>
                    Cancelar
                </button>
                <button type="submit" className="btn-confirmar-cancelamento">
                    <i className="fas fa-paper-plane mr-1"></i> Enviar Justificativa
                </button>
            </div>
        </form>
    );
}