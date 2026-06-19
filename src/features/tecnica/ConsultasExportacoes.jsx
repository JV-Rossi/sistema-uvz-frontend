import React, { useState } from 'react';
import './ConsultasExportacoes.css';

export default function ConsultasExportacoes() {
    const [resultadosBanco, setResultadosBanco] = useState([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null);
    const [painelAvancadoAberto, setPainelAvancadoAberto] = useState(false);
    
    // Filtros adaptados para o padrão de Vigilância Ambiental (UVZ)
    const [filtros, setFiltros] = useState({
        termoGeral: '',
        bairro: '',
        ano: new Date().getFullYear().toString(), // Já inicia em 2026
        ciclo: '',
        semana: '',
        status: ''
    });

    const colunasDisponiveis = [
        { id: 'id', label: 'ID' },
        { id: 'agente', label: 'Agente de Campo' },
        { id: 'quarteirao', label: 'Quarteirão' },
        { id: 'armadilha', label: 'Código Armadilha' },
        { id: 'dataInstalacao', label: 'Instalação' },
        { id: 'dataColeta', label: 'Coleta' },
        { id: 'ovos', label: 'Qtd Ovos' },
        { id: 'status', label: 'Status' }
    ];

    const [colunasVisiveis, setColunasVisiveis] = useState({
        id: true,
        agente: true,
        quarteirao: true,
        armadilha: true,
        dataInstalacao: true,
        dataColeta: true,
        ovos: true,
        status: true
    });

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://sistema-uvz-backend.onrender.com/api';

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxColunaChange = (colId) => {
        setColunasVisiveis(prev => ({
            ...prev,
            [colId]: !prev[colId]
        }));
    };

    const executarConsulta = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErro(null);

        try {
            const params = new URLSearchParams();
            if (filtros.termoGeral) params.append('termo', filtros.termoGeral);
            if (filtros.bairro) params.append('bairro', filtros.bairro);
            if (filtros.ano) params.append('ano', filtros.ano);
            if (filtros.ciclo) params.append('ciclo', filtros.ciclo);
            if (filtros.semana) params.append('semana', filtros.semana);
            if (filtros.status) params.append('status', filtros.status);

            // A rota no Java agora recebe parâmetros de período epidemiológico
            const response = await fetch(`${API_BASE_URL}/ovoscopia/pesquisa?${params.toString()}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) throw new Error('Não foi possível obter os dados do servidor técnico.');

            const dados = await response.json();
            setResultadosBanco(dados);
        } catch (err) {
            setErro(err.message);
        } finally {
            setLoading(false);
        }
    };

    const exportarParaExcel = () => {
        if (resultadosBanco.length === 0) return;

        const colunasAtivas = colunasDisponiveis.filter(col => colunasVisiveis[col.id]);
        if (colunasAtivas.length === 0) {
            alert("Selecione ao menos uma coluna para exportar.");
            return;
        }

        let csvContent = colunasAtivas.map(col => col.label).join(';') + '\n';
        
        resultadosBanco.forEach(row => {
            const rowData = colunasAtivas.map(col => {
                const valorOriginal = row[col.id];
                if (col.id === 'ovos') return valorOriginal ?? 0;
                return valorOriginal || '';
            });
            csvContent += rowData.join(';') + '\n';
        });

        const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement("a");
        link.setAttribute("href", url);
        // O nome do arquivo agora reflete os parâmetros de UVZ salvos
        const sufixoArquivo = `Ano_${filtros.ano}${filtros.ciclo ? `_Ciclo_${filtros.ciclo}` : ''}`;
        link.setAttribute("download", `extracao_${sufixoArquivo}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="modulo-card consultas-container">
            <div className="modulo-header">
                <div>
                    <h2>Base de Dados Integrada</h2>
                    <p>Consulte registros baseados no calendário epidemiológico municipal e exporte.</p>
                </div>
                <button 
                    className="btn-excel" 
                    onClick={exportarParaExcel}
                    disabled={resultadosBanco.length === 0}
                >
                    🟢 Exportar Planilha Customizada (.csv)
                </button>
            </div>

            {/* Formulário de Filtros Epidemiológicos */}
            <form onSubmit={executarConsulta} className="filtro-consulta-form">
                <div className="filtro-grupo">
                    <label>Agente/Armadilha:</label>
                    <input 
                        type="text" 
                        name="termoGeral" 
                        value={filtros.termoGeral} 
                        onChange={handleFilterChange} 
                        placeholder="Nome ou ID..." 
                    />
                </div>
                <div className="filtro-grupo">
                    <label>Bairro:</label>
                    <input 
                        type="text" 
                        name="bairro" 
                        value={filtros.bairro} 
                        onChange={handleFilterChange} 
                        placeholder="Ex: CPA 1..." 
                    />
                </div>
                
                {/* 📅 NOVOS CAMPOS: CRITÉRIOS DE SAÚDE PÚBLICA */}
                <div className="filtro-grupo">
                    <label>Ano:</label>
                    <input 
                        type="number" 
                        name="ano" 
                        value={filtros.ano} 
                        onChange={handleFilterChange} 
                        placeholder="Ex: 2026"
                        min="2020"
                        max="2030"
                    />
                </div>
                <div className="filtro-grupo">
                    <label>Ciclo:</label>
                    <select name="ciclo" value={filtros.ciclo} onChange={handleFilterChange}>
                        <option value="">Todos os Ciclos</option>
                        <option value="1">Ciclo 1</option>
                        <option value="2">Ciclo 2</option>
                        <option value="3">Ciclo 3</option>
                        <option value="4">Ciclo 4</option>
                        <option value="5">Ciclo 5</option>
                        <option value="6">Ciclo 6</option>
                    </select>
                </div>
                <div className="filtro-grupo">
                    <label>Semana Epidem.:</label>
                    <input 
                        type="number" 
                        name="semana" 
                        value={filtros.semana} 
                        onChange={handleFilterChange} 
                        placeholder="1 a 53" 
                        min="1" 
                        max="53"
                    />
                </div>
                
                <div className="filtro-grupo">
                    <label>Status:</label>
                    <select name="status" value={filtros.status} onChange={handleFilterChange}>
                        <option value="">Todos</option>
                        <option value="Lido">Lido</option>
                        <option value="Aguardando Leitura">Aguardando Leitura</option>
                    </select>
                </div>
                <div className="btn-filtrar-container">
                    <button type="submit" className="btn-filtrar" disabled={loading}>
                        {loading ? 'Buscando...' : '🔍 Filtrar'}
                    </button>
                </div>
            </form>

            {/* Painel Avançado para Colunas */}
            <div className="secao-avancada">
                <button 
                    type="button" 
                    className="toggle-avancado-btn" 
                    onClick={() => setPainelAvancadoAberto(!painelAvancadoAberto)}
                >
                    {painelAvancadoAberto ? '▲ Ocultar Configurações Avançadas' : '▼ Mostrar Pesquisa Avançada & Colunas'}
                </button>

                {painelAvancadoAberto && (
                    <div className="painel-colunas">
                        <p>Selecione quais colunas deseja incluir na visualização e na exportação do relatório:</p>
                        <div className="grid-checkbox-colunas">
                            {colunasDisponiveis.map(col => (
                                <label key={col.id} className="label-checkbox">
                                    <input 
                                        type="checkbox" 
                                        checked={colunasVisiveis[col.id]} 
                                        onChange={() => handleCheckboxColunaChange(col.id)}
                                    />
                                    {col.label}
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {erro && <div className="erro-mensagem">⚠️ {erro}</div>}

            {/* Tabela de Resultados */}
            <div className="tabela-scroll-container">
                <table className="tabela-tecnica">
                    <thead>
                        <tr>
                            {colunasDisponiveis.map(col => colunasVisiveis[col.id] && (
                                <th key={col.id} className={col.id === 'ovos' ? 'txt-center' : ''}>
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {resultadosBanco.length === 0 ? (
                            <tr>
                                <td 
                                    colSpan={Object.values(colunasVisiveis).filter(Boolean).length || 1} 
                                    className="txt-center" 
                                    style={{ padding: '30px', color: '#656575' }}
                                >
                                    {loading ? 'Consultando base de dados centralizada...' : 'Nenhum registro carregado. Filtre por Ano/Ciclo para atualizar.'}
                                </td>
                            </tr>
                        ) : (
                            resultadosBanco.map((row) => (
                                <tr key={row.id}>
                                    {colunasVisiveis.id && <td>{row.id}</td>}
                                    {colunasVisiveis.agente && <td>{row.agente}</td>}
                                    {colunasVisiveis.quarteirao && <td>{row.quarteirao}</td>}
                                    {colunasVisiveis.armadilha && <td>{row.armadilha}</td>}
                                    {colunasVisiveis.dataInstalacao && <td>{row.dataInstalacao}</td>}
                                    {colunasVisiveis.dataColeta && <td>{row.dataColeta}</td>}
                                    {colunasVisiveis.ovos && <td className="txt-center" style={{ fontWeight: 'bold' }}>{row.ovos}</td>}
                                    {colunasVisiveis.status && (
                                        <td>
                                            <span className={`badge-status ${row.status === 'Lido' ? 'lido' : 'aguardando'}`}>
                                                {row.status}
                                            </span>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}