import React, { useState } from 'react';

export default function FiltroTabelaOvitrampas() {
    const [resultados, setResultados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null);
    const [avancadoAberto, setAvancadoAberto] = useState(false);

    const [filtros, setFiltros] = useState({ termoGeral: '', bairro: '', ano: new Date().getFullYear().toString(), status: '' });

    const colunas = [
        { id: 'id', label: 'ID' }, { id: 'agente', label: 'Agente/Lab' }, { id: 'quarteirao', label: 'Quarteirão' },
        { id: 'armadilha', label: 'Cód. Armadilha' }, { id: 'dataInstalacao', label: 'Instalação' }, 
        { id: 'dataColeta', label: 'Coleta' }, { id: 'ovos', label: 'Qtd Ovos' }, { id: 'status', label: 'Status' }
    ];

    const [colunasAtivas, setColunasAtivas] = useState({
        id: true, agente: true, quarteirao: true, armadilha: true, dataInstalacao: true, dataColeta: true, ovos: true, status: true
    });

    const handleInputChange = (e) => setFiltros(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const consultar = async (e) => {
        e.preventDefault();
        setLoading(true); setErro(null);
        try {
            const params = new URLSearchParams();
            Object.keys(filtros).forEach(key => filtros[key] && params.append(key, filtros[key]));
            const baseUrl = process.env.REACT_APP_API_URL || 'https://seu-backend-no-render.com/api';
            
            const res = await fetch(`${baseUrl}/ovoscopia/pesquisa?${params.toString()}`);
            if (!res.ok) throw new Error('Falha ao consultar ovitrampas.');
            setResultados(await res.json());
        } catch (err) { setErro(err.message); } finally { setLoading(false); }
    };

    const exportar = () => {
        const ativas = colunas.filter(c => colunasAtivas[c.id]);
        let csv = ativas.map(c => c.label).join(';') + '\n';
        resultados.forEach(row => csv += ativas.map(c => row[c.id] ?? '').join(';') + '\n');
        const link = document.createElement("a");
        link.href = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' }));
        link.setAttribute("download", `extracao_ovitrampas_${filtros.ano}.csv`);
        link.click();
    };

    return (
        <>
            <div className="modulo-header">
                <div><h2>Monitoramento de Ovitrampas</h2><p>Contagem de ovos e status laboratorial.</p></div>
                <button className="btn-excel" onClick={exportar} disabled={resultados.length === 0}>🟢 Exportar (.csv)</button>
            </div>
            <form onSubmit={consultar} className="filtro-consulta-form">
                <div className="filtro-grupo"><label>Cód. Armadilha / Agente:</label><input type="text" name="termoGeral" value={filtros.termoGeral} onChange={handleInputChange} /></div>
                <div className="filtro-grupo"><label>Bairro:</label><input type="text" name="bairro" value={filtros.bairro} onChange={handleInputChange} /></div>
                <div className="filtro-grupo"><label>Ano:</label><input type="number" name="ano" value={filtros.ano} onChange={handleInputChange} /></div>
                <div className="filtro-grupo">
                    <label>Status:</label>
                    <select name="status" value={filtros.status} onChange={handleInputChange}>
                        <option value="">Todos</option><option value="Lido">Lido (Finalizado)</option><option value="Aguardando Leitura">Aguardando Leitura</option>
                    </select>
                </div>
                <div className="btn-filtrar-container"><button type="submit" className="btn-filtrar" disabled={loading}>{loading ? 'Buscando...' : '🔍 Filtrar'}</button></div>
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
                        {resultados.length === 0 ? <tr><td colSpan={10} className="txt-center" style={{ padding: '30px' }}>Nenhuma armadilha carregada.</td></tr> : (
                            resultados.map(row => (
                                <tr key={row.id}>
                                    {colunas.map(c => colunasAtivas[c.id] && (
                                        <td key={c.id} style={c.id === 'ovos' ? { fontWeight: 'bold' } : {}}>
                                            {c.id === 'status' ? <span className={`badge-status ${row.status === 'Lido' ? 'lido' : 'aguardando'}`}>{row.status}</span> : (row[c.id] ?? '-')}
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