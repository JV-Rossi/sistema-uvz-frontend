import React, { useState } from 'react';
import axios from 'axios';

// 🟢 IMPORT DO CSS LOCAL
import './GeradorReuniaoSemanal.css';

export default function GeradorReuniaoSemanal({ setTelaAtual }) {
    const [carregando, setCarregando] = useState(false);

    // ==========================================
    // ESTADOS PARA AS VARIÁVEIS TEXTUAIS
    // ==========================================
    const [geral, setGeral] = useState({
        "[SEMANA_EPIDEMIOLOGICA]": "27ª SEMANA",
        "[CICLO_ANO]": "4º CICLO/2026"
    });

    const [dias, setDias] = useState({
        "[D1]": "06/07", "[D2]": "07/07", "[D3]": "08/07", "[D4]": "09/07", "[D5]": "10/07",
        "[D6]": "13/07", "[D7]": "14/07", "[D8]": "15/07", "[D9]": "16/07", "[D10]": "17/07",
        "[D11]": "20/07", "[D12]": "21/07", "[D13]": "22/07", "[D14]": "23/07", "[D15]": "24/07",
        "[D16]": "27/07", "[D17]": "28/07", "[D18]": "29/07", "[D19]": "30/07", "[D20]": "31/07"
    });

    const [atividades, setAtividades] = useState({
        "[S1_SEG]": "PA / PE / ROTINA", "[S1_TER]": "PA / ROTINA", "[S1_QUA]": "PA / PE / ROTINA", "[S1_QUI]": "PA / ROTINA", "[S1_SEX]": "PA / PE / ROTINA",
        "[S2_SEG]": "PA / ROTINA", "[S2_TER]": "PA / ROTINA", "[S2_QUA]": "PA / PE / ROTINA", "[S2_QUI]": "PA / ROTINA", "[S2_SEX]": "PA / PE / ROTINA",
        "[S3_SEG]": "PA / PE / ROTINA", "[S3_TER]": "PA / ROTINA", "[S3_QUA]": "PA / PE / ROTINA", "[S3_QUI]": "PA / ROTINA", "[S3_SEX]": "PA / PE / ROTINA",
        "[S4_SEG]": "PA / ROTINA", "[S4_TER]": "PA / ROTINA", "[S4_QUA]": "PA / PE / ROTINA", "[S4_QUI]": "PA / ROTINA", "[S4_SEX]": "PA / PE / ROTINA"
    });

    const [epidemiologico, setEpidemiologico] = useState({
        "[DENGUE_NOT]": "970", "[DENGUE_CONF]": "419", "[DENGUE_OB_CONF]": "01", "[DENGUE_OB_INV]": "00", "[DENGUE_INCIDENCIA]": "50,7",
        "[CHIK_NOT]": "102", "[CHIK_CONF]": "99", "[CHIK_OB_CONF]": "00", "[CHIK_OB_INV]": "00", "[CHIK_INCIDENCIA]": "7,2",
        "[ZIKA_NOT]": "08", "[ZIKA_CONF]": "03", "[ZIKA_OB_CONF]": "00", "[ZIKA_OB_INV]": "00", "[ZIKA_INCIDENCIA]": "0,4"
    });

    const [vetorial, setVetorial] = useState({
        "[IMOVEIS_VISTORIADOS]": "457.196", "[IMOVEIS_TRATADOS]": "47.961", "[DEPOSITOS_TRATADOS]": "53.738", "[DEPOSITOS_ELIMINADOS]": "14.540"
    });

    const [analise, setAnalise] = useState({
        "[RED_DENGUE_PERCENT]": "41,1", "[RED_CHIK_PERCENT]": "99", "[OBITOS_CONFIRMADOS_TOTAL]": "1"
    });

    const [distritos, setDistritos] = useState({
        "[LOCAL_NORTE]": "CRAS CPA 3", "[LOCAL_SUL]": "Auditório Arena Pantanal", "[LOCAL_LESTE]": "UFMT", "[LOCAL_OESTE]": "Cine Teatro Passaredo"
    });

    // ==========================================
    // ESTADOS PARA AS IMAGENS (GRÁFICOS)
    // ==========================================
    const [imagens, setImagens] = useState({
        "[GRAFICO_SLIDE_5]": "",
        "[GRAFICO_SLIDE_6]": ""
    });

    // Converte arquivo de imagem para Base64
    const handleUploadImagem = (chave, evento) => {
        const file = evento.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagens(prev => ({ ...prev, [chave]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (setState) => (chave, valor) => {
        setState(prev => ({ ...prev, [chave]: valor }));
    };

    const handleGerarPowerPoint = async () => {
        setCarregando(true);
        try {
            const payload = {
                ...geral, ...dias, ...atividades, ...epidemiologico, ...vetorial, ...analise, ...distritos, ...imagens
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
            alert("Erro ao tentar gerar o PowerPoint. Verifique se o servidor Java está rodando ou se a URL está correta.");
        } finally {
            setCarregando(false);
        }
    };

    const renderDiaCalendario = (diaTag, ativTag) => (
        <td className="p-2 align-middle">
            <input type="text" className="form-control form-control-sm mb-1 text-primary font-weight-bold" placeholder="Dia" value={dias[diaTag]} onChange={e => handleChange(setDias)(diaTag, e.target.value)} />
            <input type="text" className="form-control form-control-sm" placeholder="Atividade" value={atividades[ativTag]} onChange={e => handleChange(setAtividades)(ativTag, e.target.value)} />
        </td>
    );

    return (
        <div className="gerador-container p-4 m-3 shadow-sm bg-white rounded">

            <h2 className="text-primary border-bottom pb-2 mb-4">
                <i className="fas fa-file-powerpoint mr-2 text-danger"></i>
                Gerador de Reunião Semanal (PPTX)
            </h2>

            {/* SEÇÃO GERAL #1*/}
            <div className="row mb-4">
                <div className="col-md-6">
                    <label>Semana Epidemiológica</label>
                    <input type="text" className="form-control" value={geral["[SEMANA_EPIDEMIOLOGICA]"]} onChange={e => handleChange(setGeral)("[SEMANA_EPIDEMIOLOGICA]", e.target.value)} />
                </div>
                <div className="col-md-6">
                    <label>Ciclo / Ano</label>
                    <input type="text" className="form-control" value={geral["[CICLO_ANO]"]} onChange={e => handleChange(setGeral)("[CICLO_ANO]", e.target.value)} />
                </div>
            </div>

            {/* SEÇÃO CALENDÁRIO #2 */}
            <h5 className="text-secondary"><i className="fas fa-calendar-alt mr-2"></i> Cronograma de Atividades (Slide 2)</h5>
            <div className="table-responsive mb-4">
                <table className="table table-bordered text-center">
                    <thead className="thead-light">
                        <tr>
                            <th>Semana</th><th>Segunda</th><th>Terça</th><th>Quarta</th><th>Quinta</th><th>Sexta</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td className="semana-label align-middle">Semana 1</td>{renderDiaCalendario("[D1]", "[S1_SEG]")}{renderDiaCalendario("[D2]", "[S1_TER]")}{renderDiaCalendario("[D3]", "[S1_QUA]")}{renderDiaCalendario("[D4]", "[S1_QUI]")}{renderDiaCalendario("[D5]", "[S1_SEX]")}</tr>
                        <tr><td className="semana-label align-middle">Semana 2</td>{renderDiaCalendario("[D6]", "[S2_SEG]")}{renderDiaCalendario("[D7]", "[S2_TER]")}{renderDiaCalendario("[D8]", "[S2_QUA]")}{renderDiaCalendario("[D9]", "[S2_QUI]")}{renderDiaCalendario("[D10]", "[S2_SEX]")}</tr>
                        <tr><td className="semana-label align-middle">Semana 3</td>{renderDiaCalendario("[D11]", "[S3_SEG]")}{renderDiaCalendario("[D12]", "[S3_TER]")}{renderDiaCalendario("[D13]", "[S3_QUA]")}{renderDiaCalendario("[D14]", "[S3_QUI]")}{renderDiaCalendario("[D15]", "[S3_SEX]")}</tr>
                        <tr><td className="semana-label align-middle">Semana 4</td>{renderDiaCalendario("[D16]", "[S4_SEG]")}{renderDiaCalendario("[D17]", "[S4_TER]")}{renderDiaCalendario("[D18]", "[S4_QUA]")}{renderDiaCalendario("[D19]", "[S4_QUI]")}{renderDiaCalendario("[D20]", "[S4_SEX]")}</tr>
                    </tbody>
                </table>
            </div>

            {/* SEÇÃO EPIDEMIOLÓGICA #3 */}
            <h5 className="text-secondary"><i className="fas fa-clipboard-list mr-2"></i> Situação Epidemiológica (Slide 3)</h5>
            <div className="table-responsive mb-4">
                <table className="table table-bordered table-sm text-center">
                    <thead className="thead-light">
                        <tr>
                            <th>Patologia</th><th>Notificados</th><th>Confirmados</th><th>Óbitos Conf.</th><th>Óbitos Inv.</th><th>Incidência</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="align-middle font-weight-bold">Dengue</td>
                            <td><input type="text" className="form-control form-control-sm" value={epidemiologico["[DENGUE_NOT]"]} onChange={e => handleChange(setEpidemiologico)("[DENGUE_NOT]", e.target.value)} /></td>
                            <td><input type="text" className="form-control form-control-sm" value={epidemiologico["[DENGUE_CONF]"]} onChange={e => handleChange(setEpidemiologico)("[DENGUE_CONF]", e.target.value)} /></td>
                            <td><input type="text" className="form-control form-control-sm" value={epidemiologico["[DENGUE_OB_CONF]"]} onChange={e => handleChange(setEpidemiologico)("[DENGUE_OB_CONF]", e.target.value)} /></td>
                            <td><input type="text" className="form-control form-control-sm" value={epidemiologico["[DENGUE_OB_INV]"]} onChange={e => handleChange(setEpidemiologico)("[DENGUE_OB_INV]", e.target.value)} /></td>
                            <td><input type="text" className="form-control form-control-sm" value={epidemiologico["[DENGUE_INCIDENCIA]"]} onChange={e => handleChange(setEpidemiologico)("[DENGUE_INCIDENCIA]", e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td className="align-middle font-weight-bold text-success">Chikungunya</td>
                            <td><input type="text" className="form-control form-control-sm" value={epidemiologico["[CHIK_NOT]"]} onChange={e => handleChange(setEpidemiologico)("[CHIK_NOT]", e.target.value)} /></td>
                            <td><input type="text" className="form-control form-control-sm" value={epidemiologico["[CHIK_CONF]"]} onChange={e => handleChange(setEpidemiologico)("[CHIK_CONF]", e.target.value)} /></td>
                            <td><input type="text" className="form-control form-control-sm" value={epidemiologico["[CHIK_OB_CONF]"]} onChange={e => handleChange(setEpidemiologico)("[CHIK_OB_CONF]", e.target.value)} /></td>
                            <td><input type="text" className="form-control form-control-sm" value={epidemiologico["[CHIK_OB_INV]"]} onChange={e => handleChange(setEpidemiologico)("[CHIK_OB_INV]", e.target.value)} /></td>
                            <td><input type="text" className="form-control form-control-sm" value={epidemiologico["[CHIK_INCIDENCIA]"]} onChange={e => handleChange(setEpidemiologico)("[CHIK_INCIDENCIA]", e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td className="align-middle font-weight-bold text-warning">Zika Vírus</td>
                            <td><input type="text" className="form-control form-control-sm" value={epidemiologico["[ZIKA_NOT]"]} onChange={e => handleChange(setEpidemiologico)("[ZIKA_NOT]", e.target.value)} /></td>
                            <td><input type="text" className="form-control form-control-sm" value={epidemiologico["[ZIKA_CONF]"]} onChange={e => handleChange(setEpidemiologico)("[ZIKA_CONF]", e.target.value)} /></td>
                            <td><input type="text" className="form-control form-control-sm" value={epidemiologico["[ZIKA_OB_CONF]"]} onChange={e => handleChange(setEpidemiologico)("[ZIKA_OB_CONF]", e.target.value)} /></td>
                            <td><input type="text" className="form-control form-control-sm" value={epidemiologico["[ZIKA_OB_INV]"]} onChange={e => handleChange(setEpidemiologico)("[ZIKA_OB_INV]", e.target.value)} /></td>
                            <td><input type="text" className="form-control form-control-sm" value={epidemiologico["[ZIKA_INCIDENCIA]"]} onChange={e => handleChange(setEpidemiologico)("[ZIKA_INCIDENCIA]", e.target.value)} /></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* SEÇÃO VETORIAL E ANÁLISE #4 */}
            <div className="row mb-4">
                <div className="col-md-7">
                    <h5 className="text-secondary"><i className="fas fa-home mr-2"></i> Controle Vetorial (Slide 4)</h5>
                    <div className="row">
                        <div className="col-6 mb-2"><label>Imóveis Vistoriados</label><input type="text" className="form-control form-control-sm" value={vetorial["[IMOVEIS_VISTORIADOS]"]} onChange={e => handleChange(setVetorial)("[IMOVEIS_VISTORIADOS]", e.target.value)} /></div>
                        <div className="col-6 mb-2"><label>Imóveis Tratados</label><input type="text" className="form-control form-control-sm" value={vetorial["[IMOVEIS_TRATADOS]"]} onChange={e => handleChange(setVetorial)("[IMOVEIS_TRATADOS]", e.target.value)} /></div>
                        <div className="col-6 mb-2"><label>Depósitos Tratados</label><input type="text" className="form-control form-control-sm" value={vetorial["[DEPOSITOS_TRATADOS]"]} onChange={e => handleChange(setVetorial)("[DEPOSITOS_TRATADOS]", e.target.value)} /></div>
                        <div className="col-6 mb-2"><label>Depósitos Eliminados</label><input type="text" className="form-control form-control-sm" value={vetorial["[DEPOSITOS_ELIMINADOS]"]} onChange={e => handleChange(setVetorial)("[DEPOSITOS_ELIMINADOS]", e.target.value)} /></div>
                    </div>
                </div>
            </div>

            {/* SEÇÃO ANEXO DE IMAGENS #5 E #6 */}
            <h5 className="text-secondary mt-4"><i className="fas fa-chart-area mr-2"></i> Anexar Gráficos (Slides 5 e 6)</h5>
            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="p-3 border rounded bg-light text-center">
                        <label className="font-weight-bold d-block">Gráfico do Slide 5</label>
                        <input type="file" accept="image/*" className="form-control-file mb-2" onChange={e => handleUploadImagem("[GRAFICO_SLIDE_5]", e)} />
                        {imagens["[GRAFICO_SLIDE_5]"] && (
                            <img src={imagens["[GRAFICO_SLIDE_5]"]} alt="Preview 5" style={{ maxHeight: '150px', maxWidth: '100%', borderRadius: '8px', marginTop: '10px' }} />
                        )}
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="p-3 border rounded bg-light text-center">
                        <label className="font-weight-bold d-block">Gráfico do Slide 6</label>
                        <input type="file" accept="image/*" className="form-control-file mb-2" onChange={e => handleUploadImagem("[GRAFICO_SLIDE_6]", e)} />
                        {imagens["[GRAFICO_SLIDE_6]"] && (
                            <img src={imagens["[GRAFICO_SLIDE_6]"]} alt="Preview 6" style={{ maxHeight: '150px', maxWidth: '100%', borderRadius: '8px', marginTop: '10px' }} />
                        )}
                    </div>
                </div>
            </div>

            {/* SEÇÃO DISTRITOS */}
            <h5 className="text-secondary"><i className="fas fa-map-marker-alt mr-2"></i> Pontos de Encontro (Slide 8)</h5>
            <div className="distritos-grid mb-4">
                <div className="distrito-card norte">
                    <label><i className="fas fa-compass mr-1"></i> Distrito Norte</label><input type="text" className="form-control" value={distritos["[LOCAL_NORTE]"]} onChange={e => handleChange(setDistritos)("[LOCAL_NORTE]", e.target.value)} />
                </div>
                <div className="distrito-card sul">
                    <label><i className="fas fa-compass mr-1"></i> Distrito Sul</label><input type="text" className="form-control" value={distritos["[LOCAL_SUL]"]} onChange={e => handleChange(setDistritos)("[LOCAL_SUL]", e.target.value)} />
                </div>
                <div className="distrito-card leste">
                    <label><i className="fas fa-compass mr-1"></i> Distrito Leste</label><input type="text" className="form-control" value={distritos["[LOCAL_LESTE]"]} onChange={e => handleChange(setDistritos)("[LOCAL_LESTE]", e.target.value)} />
                </div>
                <div className="distrito-card oeste">
                    <label><i className="fas fa-compass mr-1"></i> Distrito Oeste</label><input type="text" className="form-control" value={distritos["[LOCAL_OESTE]"]} onChange={e => handleChange(setDistritos)("[LOCAL_OESTE]", e.target.value)} />
                </div>
            </div>

            <hr className="my-4" />

            <div className="text-right">
                <button className="btn btn-primary btn-lg px-5 shadow-sm" onClick={handleGerarPowerPoint} disabled={carregando}>
                    {carregando ? <><i className="fas fa-spinner fa-spin mr-2"></i> Montando PowerPoint...</> : <><i className="fas fa-download mr-2"></i> Gerar PowerPoint Semanal</>}
                </button>
            </div>
        </div>
    );
}