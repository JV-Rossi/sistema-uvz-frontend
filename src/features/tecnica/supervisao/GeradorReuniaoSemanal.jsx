import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GeradorReuniaoSemanal.css';

// Função para gerar os 20 dias úteis (Mon-Fri por 4 semanas) a partir de uma data inicial (YYYY-MM-DD)
const gerarDiasApartirDeData = (dataStr) => {
if (!dataStr) return {};
const [ano, mes, dia] = dataStr.split('-').map(Number);
let dataAtual = new Date(ano, mes - 1, dia);

const novosDias = {};
let contador = 1;

for (let semana = 1; semana <= 4; semana++) {
    for (let diaSem = 0; diaSem < 5; diaSem++) {
        const diaF = String(dataAtual.getDate()).padStart(2, '0');
        const mesF = String(dataAtual.getMonth() + 1).padStart(2, '0');
        novosDias[`[D${contador}]`] = `${diaF}/${mesF}`;
        contador++;
        dataAtual.setDate(dataAtual.getDate() + 1);
    }
    // Pula o fim de semana (sábado e domingo = +2 dias)
    dataAtual.setDate(dataAtual.getDate() + 2);
}
return novosDias;


};

export default function GeradorReuniaoSemanal() {
const [carregando, setCarregando] = useState(false);

// Data de início padrão (exemplo: 06/07/2026)
const [dataInicioCiclo, setDataInicioCiclo] = useState("2026-07-06");

// Slide 1: Geral
const [geral, setGeral] = useState({
    "[SEMANA_EPIDEMIOLOGICA]": "27ª SEMANA",
    "[CICLO_ANO]": "4º CICLO/2026"
});

// Slide 2: Dias do Cronograma (inicia calculado dinamicamente)
const [dias, setDias] = useState(() => gerarDiasApartirDeData("2026-07-06"));

// Slide 2: Atividades do Cronograma (Apenas D1 com exemplo, o restante em branco)
const [atividades, setAtividades] = useState({
    "[S1_SEG]": "PA / PE / ROTINA",
    "[S1_TER]": "", "[S1_QUA]": "", "[S1_QUI]": "", "[S1_SEX]": "",
    "[S2_SEG]": "", "[S2_TER]": "", "[S2_QUA]": "", "[S2_QUI]": "", "[S2_SEX]": "",
    "[S3_SEG]": "", "[S3_TER]": "", "[S3_QUA]": "", "[S3_QUI]": "", "[S3_SEX]": "",
    "[S4_SEG]": "", "[S4_TER]": "", "[S4_QUA]": "", "[S4_QUI]": "", "[S4_SEX]": ""
});

// Slide 3: Distritos
const [distritos, setDistritos] = useState({
    "[LOCAL_NORTE]": "CRAS CPA 3",
    "[LOCAL_SUL]": "Auditório Arena Pantanal",
    "[LOCAL_LESTE]": "UFMT",
    "[LOCAL_OESTE]": "Cine Teatro Passaredo"
});

// Slide 4: Vetorial
const [vetorial, setVetorial] = useState({
    "[IMOVEIS_VISTORIADOS]": "457.196",
    "[IMOVEIS_TRATADOS]": "47.961",
    "[DEPOSITOS_ELIMINADOS]": "14.540"
});

// Atualiza os dias do cronograma quando a data de início é alterada
const handleDataInicioChange = (e) => {
    const novaData = e.target.value;
    setDataInicioCiclo(novaData);
    if (novaData) {
        setDias(gerarDiasApartirDeData(novaData));
    }
};

const handleChange = (setState) => (chave, valor) => {
    setState(prev => ({ ...prev, [chave]: valor }));
};

const handleGerarPowerPoint = async () => {
    setCarregando(true);
    try {
        const payload = {
            ...geral, ...dias, ...atividades, ...distritos, ...vetorial
        };

        const response = await axios.post('https://sistema-uvz-backend.onrender.com/api/relatorios/gerar-powerpoint', payload, {
            responseType: 'blob'
        });

        const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.presentationml.presentation" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `REUNIAO_SEMANAL_${geral["[SEMANA_EPIDEMIOLOGICA]"].replace(' ', '_')}.pptx`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Erro ao gerar a apresentação:", error);
        alert("Erro ao tentar gerar o PowerPoint. Verifique a conexão com o servidor da UVZ.");
    } finally {
        setCarregando(false);
    }
};

const renderCelulaDia = (diaTag, ativTag) => (
    <td>
        <input 
            type="text" 
            className="form-control" 
            value={dias[diaTag] || ''} 
            onChange={e => handleChange(setDias)(diaTag, e.target.value)}
            style={{ color: 'var(--gov-azul-primario)', textAlign: 'center', marginBottom: '8px', fontWeight: '600' }}
        />
        <input 
            type="text" 
            className="form-control" 
            placeholder="Atividade"
            value={atividades[ativTag] || ''} 
            onChange={e => handleChange(setAtividades)(ativTag, e.target.value)}
            style={{ textAlign: 'center', color: '#333' }}
        />
    </td>
);

return (
    <div className="gerador-container p-4">
        
        <h2>
            <i className="fas fa-file-powerpoint text-danger" style={{ marginRight: '10px' }}></i>
            Gerador de Reunião Semanal (PPTX)
        </h2>

        {/* SEÇÃO 1: CABEÇALHO DA REUNIÃO */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
            <div>
                <label style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>Semana Epidemiológica</label>
                <input type="text" className="form-control" value={geral["[SEMANA_EPIDEMIOLOGICA]"]} onChange={e => handleChange(setGeral)("[SEMANA_EPIDEMIOLOGICA]", e.target.value)} />
            </div>
            <div>
                <label style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>Ciclo / Ano</label>
                <input type="text" className="form-control" value={geral["[CICLO_ANO]"]} onChange={e => handleChange(setGeral)("[CICLO_ANO]", e.target.value)} />
            </div>
        </div>

        {/* SEÇÃO 2: CRONOGRAMA COM GERADOR AUTOMÁTICO DE DATAS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '25px', marginBottom: '10px' }}>
            <h4 style={{ margin: 0 }}><i className="far fa-calendar-alt" style={{ marginRight: '8px' }}></i> CRONOGRAMA DE ATIVIDADES DO CICLO</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--gov-azul-escuro)' }}>
                    Início do Ciclo (1ª Segunda):
                </label>
                <input 
                    type="date" 
                    className="form-control" 
                    value={dataInicioCiclo} 
                    onChange={handleDataInicioChange}
                    style={{ width: '160px', padding: '4px 8px' }}
                />
            </div>
        </div>

        <div className="table-responsive">
            <table className="table text-center">
                <thead>
                    <tr>
                        <th>SEMANA</th>
                        <th>SEGUNDA-FEIRA</th>
                        <th>TERÇA-FEIRA</th>
                        <th>QUARTA-FEIRA</th>
                        <th>QUINTA-FEIRA</th>
                        <th>SEXTA-FEIRA</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="semana-label">Semana 1</td>
                        {renderCelulaDia("[D1]", "[S1_SEG]")}
                        {renderCelulaDia("[D2]", "[S1_TER]")}
                        {renderCelulaDia("[D3]", "[S1_QUA]")}
                        {renderCelulaDia("[D4]", "[S1_QUI]")}
                        {renderCelulaDia("[D5]", "[S1_SEX]")}
                    </tr>
                    <tr>
                        <td className="semana-label">Semana 2</td>
                        {renderCelulaDia("[D6]", "[S2_SEG]")}
                        {renderCelulaDia("[D7]", "[S2_TER]")}
                        {renderCelulaDia("[D8]", "[S2_QUA]")}
                        {renderCelulaDia("[D9]", "[S2_QUI]")}
                        {renderCelulaDia("[D10]", "[S2_SEX]")}
                    </tr>
                    <tr>
                        <td className="semana-label">Semana 3</td>
                        {renderCelulaDia("[D11]", "[S3_SEG]")}
                        {renderCelulaDia("[D12]", "[S3_TER]")}
                        {renderCelulaDia("[D13]", "[S3_QUA]")}
                        {renderCelulaDia("[D14]", "[S3_QUI]")}
                        {renderCelulaDia("[D15]", "[S3_SEX]")}
                    </tr>
                    <tr>
                        <td className="semana-label">Semana 4</td>
                        {renderCelulaDia("[D16]", "[S4_SEG]")}
                        {renderCelulaDia("[D17]", "[S4_TER]")}
                        {renderCelulaDia("[D18]", "[S4_QUA]")}
                        {renderCelulaDia("[D19]", "[S4_QUI]")}
                        {renderCelulaDia("[D20]", "[S4_SEX]")}
                    </tr>
                </tbody>
            </table>
        </div>

        {/* SEÇÃO 3: PONTOS DE APOIO */}
        <h4><i className="fas fa-map-marker-alt" style={{ marginRight: '8px' }}></i> PONTOS DE APOIO (P.A)</h4>
        <div className="distritos-grid">
            <div className="distrito-card norte">
                <label><i className="far fa-compass"></i> Distrito Norte</label>
                <input type="text" className="form-control" value={distritos["[LOCAL_NORTE]"]} onChange={e => handleChange(setDistritos)("[LOCAL_NORTE]", e.target.value)} />
            </div>
            <div className="distrito-card sul">
                <label><i className="far fa-compass"></i> Distrito Sul</label>
                <input type="text" className="form-control" value={distritos["[LOCAL_SUL]"]} onChange={e => handleChange(setDistritos)("[LOCAL_SUL]", e.target.value)} />
            </div>
            <div className="distrito-card leste">
                <label><i className="far fa-compass"></i> Distrito Leste</label>
                <input type="text" className="form-control" value={distritos["[LOCAL_LESTE]"]} onChange={e => handleChange(setDistritos)("[LOCAL_LESTE]", e.target.value)} />
            </div>
            <div className="distrito-card oeste">
                <label><i className="far fa-compass"></i> Distrito Oeste</label>
                <input type="text" className="form-control" value={distritos["[LOCAL_OESTE]"]} onChange={e => handleChange(setDistritos)("[LOCAL_OESTE]", e.target.value)} />
            </div>
        </div>

        {/* SEÇÃO 4: DADOS VETORIAIS */}
        <h4><i className="fas fa-bug" style={{ marginRight: '8px' }}></i> RESULTADOS DE CONTROLE VETORIAL</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <div>
                <label style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>Imóveis Vistoriados</label>
                <input type="text" className="form-control" value={vetorial["[IMOVEIS_VISTORIADOS]"]} onChange={e => handleChange(setVetorial)("[IMOVEIS_VISTORIADOS]", e.target.value)} />
            </div>
            <div>
                <label style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>Imóveis Tratados</label>
                <input type="text" className="form-control" value={vetorial["[IMOVEIS_TRATADOS]"]} onChange={e => handleChange(setVetorial)("[IMOVEIS_TRATADOS]", e.target.value)} />
            </div>
            <div>
                <label style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>Depósitos Eliminados</label>
                <input type="text" className="form-control" value={vetorial["[DEPOSITOS_ELIMINADOS]"]} onChange={e => handleChange(setVetorial)("[DEPOSITOS_ELIMINADOS]", e.target.value)} />
            </div>
        </div>

        {/* BOTÃO SUBMIT */}
        <div className="text-right mt-4 pt-3" style={{ borderTop: '1px solid var(--gov-cinza-borda)' }}>
            <button className="btn-gov-salvar" onClick={handleGerarPowerPoint} disabled={carregando}>
                {carregando ? (
                    <><span className="spinner" style={{ marginRight: '8px' }}><i className="fas fa-circle-notch"></i></span> Gerando Arquivo...</>
                ) : (
                    <><i className="fas fa-download" style={{ marginRight: '8px' }}></i> Gerar PowerPoint Semanal</>
                )}
            </button>
        </div>

    </div>
);


}