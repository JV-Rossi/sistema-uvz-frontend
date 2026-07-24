import React, { useState } from 'react';

export default function FiltroTabelaConstituicao() {
    const [resultados, setResultados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null);
    const [avancadoAberto, setAvancadoAberto] = useState(false);

    const [filtros, setFiltros] = useState({ bairro: '', quarteirao: '', ano: new Date().getFullYear().toString() });

    const colunas = [
        { id: 'id', label: 'ID' }, { id: 'bairro', label: 'Bairro' }, { id: 'zona', label: 'Zona Geográfica' },
        { id: 'quarteirao', label: 'Quarteirão (Nº)' }, { id: 'dataConstituicao', label: 'Data Mapeamento' }, 
        { id: 'totalCasas', label: 'Residências' }, { id: 'totalComercios', label: 'Comércios' }, 
        { id: 'totalTerrenos', label: 'Terrenos Baldios' }, { id: 'totalImoveisCadastrados', label: 'Soma Total' },
        { id: 'agenteResponsavel', label: 'Agente Mapeador' }
    ];

    const [colunasAtivas, setColunasAtivas] = useState({
        id: true, bairro: true, zona: true, quarteirao: true, dataConstituicao: true, totalCasas: true, totalComercios: true, totalTerrenos: true, totalImoveisCadastrados: true, agenteResponsavel: true
    });

    const handleInputChange = (e) => setFiltros(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const consultar = async (e) => {
        e.preventDefault();
        setLoading(true); setErro(null);
        try {
            const params = new URLSearchParams();
            Object.keys(filtros).forEach(key => filtros[key] && params.append(key, filtros[key]));
            const baseUrl = process.env.REACT_APP_API_URL || 'https://seu-backend-no-render.com/api';
            
            const res = await fetch(`${baseUrl}/constituicao/pesquisa?${params.toString()}`);
            if (!res.ok) throw new Error('Falha ao consultar bases de Constituição.');
            setResultados(await res.json());
        } catch (err) { setErro(err.message); } finally { setLoading(false); }
    };

    const exportar = () => {
        const ativas = colunas.filter(c => colunasAtivas[c.id]);
        let csv = ativas.map(c => c.label).join(';') + '\n';
        resultados.forEach(row => csv += ativas.map(c => row[c.id] ?? '').join(';') + '\n');
        const link = document.createElement("a");
        link.href = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' }));
        link.setAttribute("download", `extracao_constituicao_${filtros.ano}.csv`);
        link.click();
    };

    return (
        <>
            <div className="modulo-header">
                <div><h2>Constituição Geográfica e Mapeamento</h2><p>Contagem territorial de residências, terrenos e comércios por quarteirão.</p></div>
                <button className="btn-excel" onClick={exportar} disabled={resultados.length === 0}>🟢 Exportar Malha (.csv)</button>
            </div>
            <form onSubmit={consultar} className="filtro-consulta-form">
                <div className="filtro-grupo"><label>Bairro:</label><input type="text" name="bairro" value={filtros.bairro} onChange={handleInputChange} /></div>
                <div className="filtro-grupo"><label>Nº Quarteirão:</label><input type="text" name="quarteirao" value={filtros.quarteirao} onChange={handleInputChange} placeholder="Ex: 001" /></div>
                <div className="filtro-grupo"><label>Ano do Mapeamento:</label><input type="number" name="ano" value={filtros.ano} onChange={handleInputChange} /></div>
                <div className="btn-filtrar-container"><button type="submit" className="btn-filtrar" disabled={loading}>{loading ? 'Calculando...' : '🔍 Filtrar Área'}</button></div>
            </form>

            <div className="secao-avancada">
                <button type="button" className="toggle-avancado-btn" onClick={() => setAvancadoAberto(!avancadoAberto)}>{avancadoAberto ? '▲ Ocultar Colunas' : '⚙️ Customizar Colunas'}</button>
                {avancadoAberto && (
                    <div className="painel-colunas"><div className="grid-checkbox-colunas">
                        {colunas.map(c => <label key={c.id} className="label-checkbox"><input type="checkbox" checked={!!colunasAtivas[c.id]} onChange={() => setColunasAtivas(p => ({ ...p, [c.id]: !p[c.id] }))} />{c.label}</label>)}
                    </div></div>
                )}
            </div>
            {erro && <div className="erro-mensagem">⚠️ {erro}</div>}
            <div className="tabela-scroll-container">
                <table className="tabela-tecnica">
                    <thead><tr>{colunas.map(c => colunasAtivas[c.id] && <th key={c.id}>{c.label}</th>)}</tr></thead>
                    <tbody>
                        {resultados.length === 0 ? <tr><td colSpan={10} className="txt-center" style={{ padding: '30px' }}>Nenhum quarteirão mapeado.</td></tr> : (
                            resultados.map(row => (
                                <tr key={row.id}>
                                    {colunas.map(c => colunasAtivas[c.id] && (
                                        <td key={c.id} style={c.id === 'totalImoveisCadastrados' ? { fontWeight: 'bold', color: '#4caf50' } : {}}>
                                            {row[c.id] ?? '-'}
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