import React, { useState } from 'react';

export default function FormExecucaoBloqueio({ bloqueio, onSalvar, onCancelar }) {
    // Estados dos campos do cabeçalho
    const [inseticida, setInseticida] = useState('Fludora');
    const [equipamento, setEquipamento] = useState('Nebulizador Motorizado');
    const [dataRealizacao, setDataRealizacao] = useState(() => new Date().toISOString().split('T')[0]);
    const [equipeBorrifacao, setEquipeBorrifacao] = useState('');

    // Estado da Tabela Dinâmica de Quarteirões
    const [linhasQuarteirao, setLinhasQuarteirao] = useState([
        { id: Date.now(), numeroQuarteirao: '', imoveisBloqueados: '', tempoAplicacao: '', mlMinuto: '', combustivel: '' }
    ]);

    // --- FUNÇÕES DE MANIPULAÇÃO DA TABELA ---
    const handleAdicionarLinha = () => {
        setLinhasQuarteirao(prev => [
            ...prev,
            { id: Date.now(), numeroQuarteirao: '', imoveisBloqueados: '', tempoAplicacao: '', mlMinuto: '', combustivel: '' }
        ]);
    };

    const handleRemoverLinha = (id) => {
        if (linhasQuarteirao.length === 1) return; // Mantém pelo menos 1 linha
        setLinhasQuarteirao(prev => prev.filter(linha => linha.id !== id));
    };

    const handleAlterarLinha = (id, campo, valor) => {
        setLinhasQuarteirao(prev => prev.map(linha => linha.id === id ? { ...linha, [campo]: valor } : linha));
    };

    // --- CÁLCULO INTELIGENTE DE DOSAGEM ---
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

    // --- SUBMISSÃO E VALIDAÇÃO ---
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!equipamento || !dataRealizacao || !equipeBorrifacao.trim()) {
            alert("Por favor, preencha os dados do cabeçalho obrigatórios.");
            return;
        }

        const temLinhaInvalida = linhasQuarteirao.some(
            l => !l.numeroQuarteirao || !l.imoveisBloqueados || !l.tempoAplicacao || !l.mlMinuto
        );

        if (temLinhaInvalida) {
            alert("Por favor, preencha o Quarteirão, Imóveis, Tempo e Vazão (ml/min) em todas as linhas.");
            return;
        }

        const totais = calcularTotais();

        onSalvar({
            inseticida,
            equipamento,
            dataRealizacao: dataRealizacao.split('-').reverse().join('/'),
            equipeBorrifacao,
            quarteiroesTrabalhados: linhasQuarteirao,
            totalImoveis: linhasQuarteirao.reduce((acc, curr) => acc + parseInt(curr.imoveisBloqueados || 0), 0),
            totalTempo: totais.totalTempo,
            totalCalda: totais.totalCaldaLitros,
            consumoConcentrado: `${totais.consumoProduto} ${totais.unidadeProduto}`,
            dataEncerramento: new Date().toLocaleDateString('pt-BR')
        });
    };

    const totais = calcularTotais();

    return (
        <form onSubmit={handleSubmit} className="po-form-container p-2">
            
            {/* 1. CARD DE RESUMO DO CHAMADO */}
            <div className="po-card-secao mb-3 border rounded p-3 bg-light shadow-sm">
                <div className="d-flex align-items-center mb-2 text-primary font-weight-bold" style={{ fontSize: '1rem' }}>
                    <i className="fas fa-map-marked-alt mr-2"></i> Localização do Chamado
                </div>
                <div className="d-flex flex-wrap gap-3 text-dark" style={{ fontSize: '0.95rem' }}>
                    <span><strong>Paciente:</strong> {bloqueio.paciente || 'Não informado'}</span>
                    <span><strong>Localidade:</strong> Quart. {bloqueio.quarteirao}, {bloqueio.bairro} ({bloqueio.distrito})</span>
                    <span><strong>Endereço:</strong> {bloqueio.endereco}</span>
                </div>
            </div>

            {/* 2. INFORMAÇÕES GERAIS DA APLICAÇÃO */}
            <div className="po-card-secao mb-3 border rounded p-3 bg-white shadow-sm">
                <div className="po-subtitulo-form border-bottom pb-2 mb-3 text-primary font-weight-bold">
                    <i className="fas fa-cogs mr-2"></i> Parâmetros da Aplicação
                </div>

                <div className="po-form-linha-tripla">
                    <div className="po-form-group">
                        <label className="font-weight-bold">Inseticida Utilizado <span className="obrigatorio">*</span></label>
                        <select value={inseticida} onChange={(e) => setInseticida(e.target.value)}>
                            <option value="Fludora">Fludora</option>
                            <option value="Cielo ULV">Cielo ULV</option>
                            <option value="Alfacipermetrina">Alfacipermetrina</option>
                        </select>
                    </div>

                    <div className="po-form-group">
                        <label className="font-weight-bold">Equipamento <span className="obrigatorio">*</span></label>
                        <select value={equipamento} onChange={(e) => setEquipamento(e.target.value)} required>
                            <option value="Nebulizador Motorizado">Nebulizador Motorizado</option>
                            <option value="Nebulizador Manual">Nebulizador Manual</option>
                        </select>
                    </div>

                    <div className="po-form-group">
                        <label className="font-weight-bold">Data da Realização <span className="obrigatorio">*</span></label>
                        <input
                            type="date"
                            value={dataRealizacao}
                            onChange={(e) => setDataRealizacao(e.target.value)}
                            required
                        />
                    </div>
                </div>
            </div>

            {/* 3. PRODUTIVIDADE POR QUARTEIRÃO (TABELA AMPLA) */}
            <div className="po-card-secao mb-3 border rounded p-3 bg-white shadow-sm">
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                    <span className="font-weight-bold text-dark" style={{ fontSize: '1rem' }}>
                        <i className="fas fa-th-list mr-2 text-primary"></i> Produtividade por Quarteirão
                    </span>
                    <button type="button" className="btn btn-sm btn-primary font-weight-bold px-3 py-1" onClick={handleAdicionarLinha}>
                        <i className="fas fa-plus mr-1"></i> Adicionar Quarteirão
                    </button>
                </div>

                {/* Tabela de Alto Contraste e Sem Scrollbar Interna */}
                <div className="table-responsive" style={{ overflowX: 'auto' }}>
                    <table className="table table-bordered table-hover align-middle mb-0" style={{ minWidth: '650px' }}>
                        <thead className="table-light">
                            <tr style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                <th style={{ width: '18%' }}>Nº Quarteirão <span className="text-danger">*</span></th>
                                <th style={{ width: '20%' }}>Imóveis <span className="text-danger">*</span></th>
                                <th style={{ width: '20%' }}>Tempo (Min) <span className="text-danger">*</span></th>
                                <th style={{ width: '20%' }}>Vazão (ml/min) <span className="text-danger">*</span></th>
                                <th style={{ width: '17%' }}>Combustível</th>
                                <th style={{ width: '5%', textAlign: 'center' }}>Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {linhasQuarteirao.map((linha) => (
                                <tr key={linha.id}>
                                    <td>
                                        <input
                                            type="number"
                                            className="form-control form-control-sm"
                                            placeholder="Ex: 15"
                                            value={linha.numeroQuarteirao}
                                            onChange={(e) => handleAlterarLinha(linha.id, 'numeroQuarteirao', e.target.value)}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            className="form-control form-control-sm"
                                            placeholder="Ex: 24"
                                            value={linha.imoveisBloqueados}
                                            onChange={(e) => handleAlterarLinha(linha.id, 'imoveisBloqueados', e.target.value)}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            className="form-control form-control-sm"
                                            placeholder="Ex: 8"
                                            value={linha.tempoAplicacao}
                                            onChange={(e) => handleAlterarLinha(linha.id, 'tempoAplicacao', e.target.value)}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            className="form-control form-control-sm"
                                            placeholder="Ex: 1000"
                                            value={linha.mlMinuto}
                                            onChange={(e) => handleAlterarLinha(linha.id, 'mlMinuto', e.target.value)}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            placeholder="Ex: 300ml"
                                            value={linha.combustivel}
                                            onChange={(e) => handleAlterarLinha(linha.id, 'combustivel', e.target.value)}
                                        />
                                    </td>
                                    <td className="text-center">
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger btn-sm border-0"
                                            onClick={() => handleRemoverLinha(linha.id)}
                                            title="Remover quarteirão"
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 4. PAINEL DE CÁLCULO EM DESTAQUE PARA APRESENTAÇÕES */}
            <div className="po-card-secao mb-3 p-3 rounded border" style={{ backgroundColor: '#f0f9ff', borderColor: '#bae6fd' }}>
                <div className="row text-center align-items-center">
                    <div className="col-md-6 mb-2 mb-md-0 border-end border-info">
                        <span className="text-uppercase text-muted font-weight-bold d-block" style={{ fontSize: '0.8rem' }}>
                            Volume de Calda Aplicada
                        </span>
                        <span className="font-weight-bold text-primary" style={{ fontSize: '1.4rem' }}>
                            <i className="fas fa-tint mr-1"></i> {totais.totalCaldaLitros} Litros
                        </span>
                    </div>
                    <div className="col-md-6">
                        <span className="text-uppercase text-muted font-weight-bold d-block" style={{ fontSize: '0.8rem' }}>
                            Consumo do Concentrado
                        </span>
                        <span className="font-weight-bold text-danger" style={{ fontSize: '1.4rem' }}>
                            <i className="fas fa-flask mr-1"></i> {totais.consumoProduto} {totais.unidadeProduto} <small style={{ fontSize: '0.9rem' }}>de {inseticida}</small>
                        </span>
                    </div>
                </div>
            </div>

            {/* 5. DADOS DA EQUIPE RESPONSÁVEL */}
            <div className="po-card-secao mb-3 border rounded p-3 bg-white shadow-sm">
                <div className="po-form-group">
                    <label className="font-weight-bold">Equipe de Borrifação: <span className="obrigatorio">*</span></label>
                    <input
                        type="text"
                        placeholder="Ex: Carlos Souza, Marcos Lima..."
                        value={equipeBorrifacao}
                        onChange={(e) => setEquipeBorrifacao(e.target.value)}
                        required
                    />
                </div>
            </div>

            {/* RODAPÉ FIXO DE AÇÕES */}
            <div className="po-modal-footer d-flex justify-content-end gap-2 mt-3 pt-3 border-top">
                <button type="button" className="btn-cancelar" onClick={onCancelar}>
                    Cancelar
                </button>
                <button type="submit" className="btn-confirmar-boletim">
                    <i className="fas fa-save mr-1"></i> Enviar Boletim Técnico
                </button>
            </div>
        </form>
    );
}