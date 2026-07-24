import React, { useState } from 'react';

export default function FiltroTabelaResumos() {
    const [resultados, setResultados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null);
    const [avancadoAberto, setAvancadoAberto] = useState(false);

    const [filtros, setFiltros] = useState({
        nomeAgente: '', bairro: '', semana: '', ciclo: '', ano: new Date().getFullYear().toString(), regional: ''
    });

    const colunas = [
        { id: 'id', label: 'ID' }, { id: 'titularLogin', label: 'Nome do Agente' }, { id: 'bairro', label: 'Bairro' }, { id: 'dataFechamento', label: 'Data Fech.' },
        { id: 'totalImoveis', label: 'Total Imóveis' }, { id: 'trabalhados', label: 'Trabalhados' }, { id: 'naoTrabalhados', label: 'Não Trabalhados' },
        { id: 'depInspecionados', label: 'Dep. Insp.' }, { id: 'depEliminados', label: 'Dep. Elim.' }, { id: 'imoveisTratados', label: 'Imóv. Tratados' }, { id: 'larvicidaTotal', label: 'Larvicida (g)' }
    ];

    const [colunasAtivas, setColunasAtivas] = useState({
        id: true, titularLogin: true, bairro: true, dataFechamento: true, totalImoveis: true, trabalhados: true, naoTrabalhados: true, depInspecionados: true, depEliminados: true, imoveisTratados: true, larvicidaTotal: true
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
    };

    const processarResumoJson = (jsonStr) => {
        let metricas = { trabalhados: 0, naoTrabalhados: 0, depInspecionados: 0, depEliminados: 0, imoveisTratados: 0, larvicidaTotal: 0 };
        try {
            if (!jsonStr) return metricas;
            const matriz = JSON.parse(jsonStr);
            Object.values(matriz).forEach(fichas => {
                if (Array.isArray(fichas)) {
                    fichas.forEach(ficha => {
                        const total = Number(ficha.total_imoveis || 0);
                        const naoTrab = Number(ficha.imoveis_fechados || 0) + Number(ficha.imoveis_recusados || 0);
                        metricas.naoTrabalhados += naoTrab;
                        metricas.trabalhados += (total - naoTrab);
                        metricas.depInspecionados += Number(ficha.depositos_inspecionados || 0);
                        metricas.depEliminados += Number(ficha.depositos_eliminados || 0);
                        metricas.imoveisTratados += Number(ficha.imoveis_tratados || 0);
                        metricas.larvicidaTotal += Number(ficha.larvicida_gramas || 0);
                    });
                }
            });
        } catch (e) { console.error(e); }
        return metricas;
    };

    const consultar = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErro(null);
        try {
            const params = new URLSearchParams();
            if (filtros.nomeAgente) params.append('login', filtros.nomeAgente);
            if (filtros.bairro) params.append('bairro', filtros.bairro);
            if (filtros.semana) params.append('semana', filtros.semana);
            if (filtros.ciclo) params.append('ciclo', filtros.ciclo);
            if (filtros.ano) params.append('ano', filtros.ano);
            if (filtros.regional) params.append('regional', filtros.regional);

            const baseUrl = process.env.REACT_APP_API_URL || 'https://seu-backend-no-render.com/api';
            const res = await fetch(`${baseUrl}/resumos-semanais/pesquisa?${params.toString()}`);
            if (!res.ok) throw new Error('Falha ao consultar resumos.');
            
            const dados = await res.json();
            const processados = dados.map(item => ({ ...item, ...processarResumoJson(item.distribuicaoJson) }));
            setResultados(processados);
        } catch (err) { setErro(err.message); }
        finally { setLoading(false); }
    };

    const exportar = () => {
        const ativas = colunas.filter(c => colunasAtivas[c.id]);
        let csv = ativas.map(c => c.label).join(';') + '\n';
        resultados.forEach(row => {
            csv += ativas.map(c => row[c.id] ?? '').join(';') + '\n';
        });
        const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `consolidado_semanal_${filtros.ano}.csv`);
        link.click();
    };

    return (
        <>
            <div className="modulo-header">
                <div>
                    <h2>Indicadores de Produção Semanal</h2>
                    <p>Consolidado de cobertura, depósitos eliminados e controle químico da semana.</p>
                </div>
                <button className="btn-excel" onClick={exportar} disabled={resultados.length === 0}>Efetuar Exportação Semanal (.csv)</button>
            </div>

            <form onSubmit={consultar} className="filtro-consulta-form">
                <div className="filtro-grupo"><label>Nome do Agente:</label><input type="text" name="nomeAgente" value={filtros.nomeAgente} onChange={handleInputChange} placeholder="Nome..." /></div>
                <div className="filtro-grupo"><label>Bairro:</label><input type="text" name="bairro" value={filtros.bairro} onChange={handleInputChange} placeholder="Ex: Tijucal" /></div>
                <div className="filtro-grupo"><label>Semana:</label><input type="number" name="semana" value={filtros.semana} onChange={handleInputChange} placeholder="1-53" /></div>
                <div className="filtro-grupo">
                    <label>Ciclo:</label>
                    <select name="ciclo" value={filtros.ciclo} onChange={handleInputChange}>
                        <option value="">Todos</option><option value="1">Ciclo 1</option><option value="2">Ciclo 2</option><option value="3">Ciclo 3</option><option value="4">Ciclo 4</option><option value="5">Ciclo 5</option><option value="6">Ciclo 6</option>
                    </select>
                </div>
                <div className="filtro-grupo"><label>Ano:</label><input type="number" name="ano" value={filtros.ano} onChange={handleInputChange} /></div>
                <div className="filtro-grupo"><label>Regional:</label><input type="text" name="regional" value={filtros.regional} onChange={handleInputChange} placeholder="Ex: Sul" /></div>
                <div className="btn-filtrar-container"><button type="submit" className="btn-filtrar" disabled={loading}>{loading ? 'Calculando...' : '🔍 Filtrar'}</button></div>
            </form>

            <div className="secao-avancada">
                <button type="button" className="toggle-avancado-btn" onClick={() => setAvancadoAberto(!avancadoAberto)}>{avancadoAberto ? '▲ Ocultar Colunas' : '⚙️ Customizar Colunas / Pesquisa Avançada'}</button>
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
                            <tr><td colSpan={20} className="txt-center" style={{ padding: '30px', color: '#656575' }}>Nenhum resumo semanal carregado.</td></tr>
                        ) : (
                            resultados.map(row => (
                                <tr key={row.id}>
                                    {colunas.map(c => colunasAtivas[c.id] && (
                                        <td key={c.id} style={c.id === 'trabalhados' ? { color: '#4caf50', fontWeight: 'bold' } : c.id === 'naoTrabalhados' ? { color: '#ff4d4d' } : {}}>
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