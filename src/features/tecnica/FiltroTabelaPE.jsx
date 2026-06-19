import React, { useState } from 'react';

export default function FiltroTabelaPE() {
    const [resultados, setResultados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null);
    const [avancadoAberto, setAvancadoAberto] = useState(false);

    const [filtros, setFiltros] = useState({ nomePE: '', tipoPE: '', bairro: '', ano: new Date().getFullYear().toString() });

    // Colunas exclusivas do Ponto Estratégico
    const colunas = [
        { id: 'id', label: 'ID' }, { id: 'nomePE', label: 'Nome do Local' }, { id: 'tipoPE', label: 'Classificação' },
        { id: 'bairro', label: 'Bairro' }, { id: 'dataInspecao', label: 'Última Inspeção' }, 
        { id: 'focosEncontrados', label: 'Focos' }, { id: 'larvicidaAplicado', label: 'Larvicida (g)' }, { id: 'agente', label: 'Agente Responsável' }
    ];

    const [colunasAtivas, setColunasAtivas] = useState({
        id: true, nomePE: true, tipoPE: true, bairro: true, dataInspecao: true, focosEncontrados: true, larvicidaAplicado: true, agente: true
    });

    const handleInputChange = (e) => setFiltros(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const consultar = async (e) => {
        e.preventDefault();
        setLoading(true); setErro(null);
        try {
            const params = new URLSearchParams();
            Object.keys(filtros).forEach(key => filtros[key] && params.append(key, filtros[key]));
            const baseUrl = process.env.REACT_APP_API_URL || 'https://seu-backend-no-render.com/api';
            
            // Endpoint imaginário para PEs. Adapte conforme o seu Java.
            const res = await fetch(`${baseUrl}/pontos-estrategicos/pesquisa?${params.toString()}`);
            if (!res.ok) throw new Error('Falha ao consultar Pontos Estratégicos.');
            setResultados(await res.json());
        } catch (err) { setErro(err.message); } finally { setLoading(false); }
    };

    const exportar = () => {
        const ativas = colunas.filter(c => colunasAtivas[c.id]);
        let csv = ativas.map(c => c.label).join(';') + '\n';
        resultados.forEach(row => csv += ativas.map(c => row[c.id] ?? '').join(';') + '\n');
        const link = document.createElement("a");
        link.href = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' }));
        link.setAttribute("download", `extracao_PEs_${filtros.ano}.csv`);
        link.click();
    };

    return (
        <>
            <div className="modulo-header">
                <div><h2>Monitoramento de Pontos Estratégicos (PE)</h2><p>Borracharias, ferros-velhos e locais de alto risco.</p></div>
                <button className="btn-excel" onClick={exportar} disabled={resultados.length === 0}>🟢 Exportar PEs (.csv)</button>
            </div>
            <form onSubmit={consultar} className="filtro-consulta-form">
                <div className="filtro-grupo"><label>Nome do PE / Local:</label><input type="text" name="nomePE" value={filtros.nomePE} onChange={handleInputChange} /></div>
                <div className="filtro-grupo"><label>Bairro:</label><input type="text" name="bairro" value={filtros.bairro} onChange={handleInputChange} /></div>
                <div className="filtro-grupo">
                    <label>Tipo de Estabelecimento:</label>
                    <select name="tipoPE" value={filtros.tipoPE} onChange={handleInputChange}>
                        <option value="">Todos</option><option value="BORRACHARIA">Borracharia</option><option value="FERRO_VELHO">Ferro-Velho</option><option value="CEMITERIO">Cemitério</option><option value="RECICLAGEM">Reciclagem</option>
                    </select>
                </div>
                <div className="filtro-grupo"><label>Ano:</label><input type="number" name="ano" value={filtros.ano} onChange={handleInputChange} /></div>
                <div className="btn-filtrar-container"><button type="submit" className="btn-filtrar" disabled={loading}>{loading ? 'Buscando...' : '🔍 Filtrar PE'}</button></div>
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
                        {resultados.length === 0 ? <tr><td colSpan={10} className="txt-center" style={{ padding: '30px' }}>Nenhum PE carregado.</td></tr> : (
                            resultados.map(row => (
                                <tr key={row.id}>
                                    {colunas.map(c => colunasAtivas[c.id] && (
                                        <td key={c.id} style={c.id === 'focosEncontrados' && row[c.id] > 0 ? { color: '#ff4d4d', fontWeight: 'bold' } : {}}>
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