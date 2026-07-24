import React, { useState } from 'react';

export default function FiltroTabelaBloqueio() {
    const [resultados, setResultados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null);
    const [avancadoAberto, setAvancadoAberto] = useState(false);

    const [filtros, setFiltros] = useState({ numeroNotificacao: '', bairro: '', ano: new Date().getFullYear().toString(), statusControle: '' });

    const colunas = [
        { id: 'id', label: 'ID' }, { id: 'numeroNotificacao', label: 'Nº SINAN/Notificação' }, { id: 'dataBloqueio', label: 'Data da Ação' },
        { id: 'bairro', label: 'Bairro do Caso' }, { id: 'enderecoCaso', label: 'Endereço Índice' }, { id: 'raioMetros', label: 'Raio (Metros)' }, 
        { id: 'imoveisVisitados', label: 'Imóveis no Raio' }, { id: 'focosEliminados', label: 'Focos Encontrados' },
        { id: 'bombaCostal', label: 'Uso de Bomba?' }, { id: 'agenteResponsavel', label: 'Agente/Equipe' }
    ];

    const [colunasAtivas, setColunasAtivas] = useState({
        id: true, numeroNotificacao: true, dataBloqueio: true, bairro: true, enderecoCaso: true, raioMetros: true, imoveisVisitados: true, focosEliminados: true, bombaCostal: true, agenteResponsavel: true
    });

    const handleInputChange = (e) => setFiltros(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const consultar = async (e) => {
        e.preventDefault();
        setLoading(true); setErro(null);
        try {
            const params = new URLSearchParams();
            Object.keys(filtros).forEach(key => filtros[key] && params.append(key, filtros[key]));
            const baseUrl = process.env.REACT_APP_API_URL || 'https://seu-backend-no-render.com/api';
            
            const res = await fetch(`${baseUrl}/bloqueios/pesquisa?${params.toString()}`);
            if (!res.ok) throw new Error('Falha ao consultar ações de Bloqueio.');
            setResultados(await res.json());
        } catch (err) { setErro(err.message); } finally { setLoading(false); }
    };

    const exportar = () => {
        const ativas = colunas.filter(c => colunasAtivas[c.id]);
        let csv = ativas.map(c => c.label).join(';') + '\n';
        resultados.forEach(row => {
            csv += ativas.map(c => {
                if (c.id === 'bombaCostal') return row[c.id] ? 'SIM' : 'NÃO';
                return row[c.id] ?? '';
            }).join(';') + '\n';
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' }));
        link.setAttribute("download", `extracao_bloqueios_${filtros.ano}.csv`);
        link.click();
    };

    return (
        <>
            <div className="modulo-header">
                <div><h2>Bloqueio de Focos e Casos Notificados</h2><p>Controle vetorial ao redor de casos suspeitos/confirmados.</p></div>
                <button className="btn-excel" onClick={exportar} disabled={resultados.length === 0}>🟢 Exportar Bloqueios (.csv)</button>
            </div>
            <form onSubmit={consultar} className="filtro-consulta-form">
                <div className="filtro-grupo"><label>Nº Notificação (SINAN):</label><input type="text" name="numeroNotificacao" value={filtros.numeroNotificacao} onChange={handleInputChange} /></div>
                <div className="filtro-grupo"><label>Bairro do Caso:</label><input type="text" name="bairro" value={filtros.bairro} onChange={handleInputChange} /></div>
                <div className="filtro-grupo"><label>Ano:</label><input type="number" name="ano" value={filtros.ano} onChange={handleInputChange} /></div>
                <div className="filtro-grupo">
                    <label>Status (Bomba Costal):</label>
                    <select name="statusControle" value={filtros.statusControle} onChange={handleInputChange}>
                        <option value="">Todos</option><option value="com_bomba">Com aplicação</option><option value="sem_bomba">Sem aplicação (Apenas Mecânico)</option>
                    </select>
                </div>
                <div className="btn-filtrar-container"><button type="submit" className="btn-filtrar" disabled={loading}>{loading ? 'Buscando...' : '🔍 Filtrar Bloqueios'}</button></div>
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
                        {resultados.length === 0 ? <tr><td colSpan={10} className="txt-center" style={{ padding: '30px' }}>Nenhum bloqueio registrado.</td></tr> : (
                            resultados.map(row => (
                                <tr key={row.id}>
                                    {colunas.map(c => colunasAtivas[c.id] && (
                                        <td key={c.id}>
                                            {c.id === 'bombaCostal' ? <span className={`badge-status ${row.bombaCostal ? 'aguardando' : 'lido'}`}>{row.bombaCostal ? 'SIM 💨' : 'NÃO'}</span> : (row[c.id] ?? '-')}
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