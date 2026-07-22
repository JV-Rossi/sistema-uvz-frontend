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

        // Envia o objeto formatado para o componente pai salvar
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
        <form onSubmit={handleSubmit}>
            <div className="po-modal-body select-scroll">
                
                {/* 1. RESUMO DA LOCALIZAÇÃO DO CHAMADO */}
                <div className="po-resumo-localizacao">
                    <p><strong>Paciente Notificado:</strong> {bloqueio.paciente}</p>
                    <p><strong>Localidade:</strong> Quart. {bloqueio.quarteirao}, {bloqueio.bairro} ({bloqueio.distrito})</p>
                    <p><strong>Endereço de Referência:</strong> {bloqueio.endereco}</p>
                </div>

                {/* 2. INFORMAÇÕES GERAIS DA APLICAÇÃO */}
                <div className="po-subtitulo-form">Informações Gerais</div>
                <div className="po-form-linha-tripla">
                    <div className="po-form-group">
                        <label>Inseticida Utilizado <span className="obrigatorio">*</span></label>
                        <select value={inseticida} onChange={(e) => setInseticida(e.target.value)}>
                            <option value="Fludora">Fludora</option>
                            <option value="Cielo ULV">Cielo ULV</option>
                            <option value="Alfacipermetrina">Alfacipermetrina</option>
                        </select>
                    </div>

                    <div className="po-form-group">
                        <label>Equipamento Utilizado <span className="obrigatorio">*</span></label>
                        <select value={equipamento} onChange={(e) => setEquipamento(e.target.value)} required>
                            <option value="Nebulizador Motorizado">Nebulizador Motorizado</option>
                            <option value="Nebulizador Manual">Nebulizador Manual</option>
                        </select>
                    </div>

                    <div className="po-form-group">
                        <label>Data da Realização <span className="obrigatorio">*</span></label>
                        <input
                            type="date"
                            value={dataRealizacao}
                            onChange={(e) => setDataRealizacao(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* 3. PRODUTIVIDADE POR QUARTEIRÃO (TABELA DINÂMICA) */}
                <div className="po-subtitulo-form-tabela">
                    <span>Produtividade por Quarteirão</span>
                    <button type="button" className="btn-adicionar-linha" onClick={handleAdicionarLinha}>
                        <i className="fas fa-plus mr-1"></i> Adicionar Quarteirão
                    </button>
                </div>

                <div className="po-tabela-dinamica-container">
                    <table className="po-tabela-boletim">
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
                                        <input
                                            type="number"
                                            placeholder="Ex: 15"
                                            value={linha.numeroQuarteirao}
                                            onChange={(e) => handleAlterarLinha(linha.id, 'numeroQuarteirao', e.target.value)}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            placeholder="Ex: 24"
                                            value={linha.imoveisBloqueados}
                                            onChange={(e) => handleAlterarLinha(linha.id, 'imoveisBloqueados', e.target.value)}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            placeholder="Ex: 8"
                                            value={linha.tempoAplicacao}
                                            onChange={(e) => handleAlterarLinha(linha.id, 'tempoAplicacao', e.target.value)}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            placeholder="Ex: 1000"
                                            value={linha.mlMinuto}
                                            onChange={(e) => handleAlterarLinha(linha.id, 'mlMinuto', e.target.value)}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            placeholder="Ex: 300ml"
                                            value={linha.combustivel}
                                            onChange={(e) => handleAlterarLinha(linha.id, 'combustivel', e.target.value)}
                                        />
                                    </td>
                                    <td className="col-remover">
                                        <button
                                            type="button"
                                            className="btn-remover-linha"
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

                {/* 4. PAINEL DE CÁLCULO EM TEMPO REAL */}
                <div className="po-painel-calculo">
                    <div className="po-calculo-item">
                        <span>Volume de Calda Aplicada:</span>
                        <strong>{totais.totalCaldaLitros} Litros</strong>
                    </div>
                    <div className="po-calculo-item destaque">
                        <span>Consumo do Concentrado:</span>
                        <strong>{totais.consumoProduto} {totais.unidadeProduto} de {inseticida}</strong>
                    </div>
                </div>

                {/* 5. DADOS DA EQUIPE RESPONSÁVEL */}
                <div className="po-form-group">
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

            {/* RODAPÉ E BOTÕES DE AÇÃO */}
            <div className="po-modal-footer">
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