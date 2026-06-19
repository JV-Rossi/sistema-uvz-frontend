import React, { useState } from 'react';

export default function FiltroTabelaVisitas() {
    const [resultados, setResultados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null);
    const [avancadoAberto, setAvancadoAberto] = useState(false);

    const [filtros, setFiltros] = useState({
        termoGeral: '', bairro: '', ano: new Date().getFullYear().toString(), ciclo: '', semana: '', status: ''
    });

    const colunas = [
        { id: 'id', label: 'ID' }, { id: 'dataVisita', label: 'Data Visita' }, { id: 'ciclo', label: 'Ciclo' },
        { id: 'semana', label: 'Semana' }, { id: 'titularMatricula', label: 'Matrícula ACE' }, { id: 'bairro', label: 'Bairro' },
        { id: 'quarteirao', label: 'Quarteirão' }, { id: 'tipo', label: 'Tipo Imóvel' }, { id: 'focoEncontrado', label: 'Foco?' }, { id: 'pendencia', label: 'Pendência' }
    ];

    const [colunasAtivas, setColunasAtivas] = useState({
        id: true, dataVisita: true, ciclo: true, semana: true, titularMatricula: true, bairro: true, quarteirao: true, tipo: true, focoEncontrado: true, pendencia: true
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
    };

    const consultar = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErro(null);
        try {
            const params = new URLSearchParams();
            if (filtros.termoGeral) params.append('termo', filtros.termoGeral);
            if (filtros.bairro) params.append('bairro', filtros.bairro);
            if (filtros.ciclo) params.append('ciclo', filtros.ciclo);
            if (filtros.semana) params.append('semana', filtros.semana);
            if (filtros.ano) params.append('ano', filtros.ano);
            if (filtros.status) params.append('status', filtros.status);

            const baseUrl = process.env.REACT_APP_API_URL || 'https://seu-backend-no-render.com/api';
            const res = await fetch(`${baseUrl}/visitas/pesquisa?${params.toString()}`);
            if (!res.ok) throw new Error('Falha ao consultar visitas.');
            setResultados(await res.json());
        } catch (err) { setErro(err.message); }
        finally { setLoading(false); }
    };

    const exportar = () => {
        const ativas = colunas.filter(c => colunasAtivas[c.id]);
        let csv = ativas.map(c => c.label).join(';') + '\n';
        resultados.forEach(row => {
            csv += ativas.map(c => c.id === 'focoEncontrado' ? (row[c.id] ? 'SIM' : 'NÃO') : (row[c.id] ?? '')).join(';') + '\n';
        });
        const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `extracao_visitas_${filtros.ano}.csv`);
        link.click();
    };

    return (
        <>
            <div className="modulo-header">
                <div>
                    <h2>Histórico de Visitas de Campo</h2>
                    <p>Filtros aplicados à ficha espelho e imóveis trabalhados diários.</p>
                </div>
                <button className="btn-excel" onClick={exportar} disabled={resultados.length === 0}>🟢 Exportar Visitas (.csv)</button>
            </div>

            <form onSubmit={consultar} className="filtro-consulta-form">
                <div className="filtro-grupo"><label>Matrícula / ID:</label><input type="text" name="termoGeral" value={filtros.termoGeral} onChange={handleInputChange} placeholder="Buscar..." /></div>
                <div className="filtro-grupo"><label>Bairro:</label><input type="text" name="bairro" value={filtros.bairro} onChange={handleInputChange} placeholder="Ex: Centro" /></div>
                <div className="filtro-grupo"><label>Ano Epidem.:</label><input type="number" name="ano" value={filtros.ano} onChange={handleInputChange} /></div>
                <div className="filtro-grupo">
                    <label>Ciclo:</label>
                    <select name="ciclo" value={filtros.ciclo} onChange={handleInputChange}>
                        <option value="">Todos</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option>
                    </select>
                </div>
                <div className="filtro-grupo"><label>Semana:</label><input type="number" name="semana" value={filtros.semana} onChange={handleInputChange} placeholder="1-53" /></div>
                <div className="filtro-grupo">
                    <label>Status:</label>
                    <select name="status" value={filtros.status} onChange={handleInputChange}>
                        <option value="">Todos</option><option value="Lido">Normal</option><option value="Aguardando Leitura">Com Foco</option><option value="RECUSADO">Recusado</option>
                    </select>
                </div>
                <div className="btn-filtrar-container"><button type="submit" className="btn-filtrar" disabled={loading}>{loading ? 'Buscando...' : '🔍 Filtrar'}</button></div>
            </form>

            <div className="secao-avancada">
                <button type="button" className="toggle-avancado-btn" onClick={() => setAvancadoAberto(!avancadoAberto)}>{avancadoAberto ? '▲ Ocultar Configurações' : '⚙️ Customizar Colunas / Pesquisa Avançada'}</button>
                {avancadoAberto && (
                    <div className="painel-colunas">
                        <div className="grid-checkbox-colunas">
                            {colunas.map(c => (
                                <label key={c.id} className="label-checkbox">
                                    <input type="checkbox" checked={!!colunasAtivas[c.id]} onChange={() => setColunasAtivas(p => ({ ...p, [c.id]: !p[c.id] }))} />{c.label}
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {erro && <div className="erro-mensagem">⚠️ {erro}</div>}

            <div className="tabela-scroll-container">
                <table className="tabela-tecnica">
                    <thead><tr>{colunas.map(c => colunasAtivas[c.id] && <th key={c.id}>{c.label}</th>)}</tr></thead>
                    <tbody>
                        {resultados.length === 0 ? (
                            <tr><td colSpan={20} className="txt-center" style={{ padding: '30px', color: '#656575' }}>Nenhum dado de visitas carregado.</td></tr>
                        ) : (
                            resultados.map(row => (
                                <tr key={row.id}>
                                    {colunas.map(c => colunasAtivas[c.id] && (
                                        <td key={c.id}>
                                            {c.id === 'focoEncontrado' ? (
                                                <span className={`badge-status ${row.focoEncontrado ? 'aguardando' : 'lido'}`}>{row.focoEncontrado ? 'SIM' : 'NÃO'}</span>
                                            ) : (row[c.id] ?? '-')}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}