import React, { useState } from 'react';
import axios from 'axios';
import './GeradorReuniaoSemanal.css'; // Importa o CSS da mesma pasta

export default function GeradorReuniaoSemanal({ setTelaAtual }) {
    const [carregando, setCarregando] = useState(false);
    
    // Estados para o Calendário de Atividades (Slide 2)
    const [calendario, setCalendario] = useState({
        "[S1_SEG]": "PA / PE / ROTINA", 
        "[S1_TER]": "PA / ROTINA", 
        "[S1_QUA]": "PA / PE / ROTINA", 
        "[S1_QUI]": "PA / ROTINA", 
        "[S1_SEX]": "PA / PE / ROTINA",
        "[S2_SEG]": "PA / ROTINA",      
        "[S2_TER]": "PA / ROTINA", 
        "[S2_QUA]": "PA / PE / ROTINA", 
        "[S2_QUI]": "PA / ROTINA", 
        "[S2_SEX]": "PA / PE / ROTINA"
    });

    // Estados para as Localidades dos Distritos (Slide 6)
    const [distritos, setDistritos] = useState({
        "[LOCAL_NORTE]": "CRAS CPA 3",
        "[LOCAL_SUL]": "Auditório da Arena Pantanal",
        "[LOCAL_LESTE]": "UFMT",
        "[LOCAL_OESTE]": "Cine Teatro Passaredo"
    });

    const handleCalendarioChange = (chave, valor) => {
        setCalendario(prev => ({ ...prev, [chave]: valor }));
    };

    const handleDistritoChange = (chave, valor) => {
        setDistritos(prev => ({ ...prev, [chave]: valor }));
    };

    const handleGerarPowerPoint = async () => {
        setCarregando(true);
        try {
            // Unifica os dados para enviar ao Java
            const payload = {
                ...calendario,
                ...distritos,
                "[SEMANA_EPIDEMIOLOGICA]": "27ª SEMANA",
                "[CICLO_ANO]": "4º CICLO/2026"
            };

            // URL do seu backend Render que está configurado no seu App.jsx
            const response = await axios.post('https://sistema-uvz-backend.onrender.com/api/relatorios/gerar-powerpoint', payload, {
                responseType: 'blob' 
            });

            // Força o download no navegador
            const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.presentationml.presentation" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'REUNIÃO_SEMANAL_GERADA.pptx');
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

    return (
        <div className="gerador-container p-4 m-3">
            {/* Botão de Voltar integrado com a rota do seu App.jsx */}
            <button 
                className="btn-gov-voltar mb-4" 
                onClick={() => setTelaAtual('tecnica')}
            >
                <i className="fas fa-arrow-left mr-2"></i> Voltar ao Painel Técnico
            </button>

            <h2>
                <i className="fas fa-file-powerpoint mr-2 text-danger"></i>
                Gerador de Reunião Semanal (PPTX)
            </h2>
            <p className="text-muted small">Preencha os dados operacionais abaixo para atualizar automaticamente os slides da Reunião Semanal.</p>

            <hr className="my-4" />

            {/* SEÇÃO 1: CALENDÁRIO */}
            <h4><i className="fas fa-calendar-alt mr-2 text-primary"></i> Cronograma de Atividades do Ciclo (Slide 2)</h4>
            <div className="table-responsive">
                <table className="table text-center">
                    <thead>
                        <tr>
                            <th>Semana</th>
                            <th>Segunda-feira</th>
                            <th>Terça-feira</th>
                            <th>Quarta-feira</th>
                            <th>Quinta-feira</th>
                            <th>Sexta-feira</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="semana-label">Semana 1</td>
                            <td><input type="text" className="form-control" value={calendario["[S1_SEG]"]} onChange={e => handleCalendarioChange("[S1_SEG]", e.target.value)} /></td>
                            <td><input type="text" className="form-control" value={calendario["[S1_TER]"]} onChange={e => handleCalendarioChange("[S1_TER]", e.target.value)} /></td>
                            <td><input type="text" className="form-control" value={calendario["[S1_QUA]"]} onChange={e => handleCalendarioChange("[S1_QUA]", e.target.value)} /></td>
                            <td><input type="text" className="form-control" value={calendario["[S1_QUI]"]} onChange={e => handleCalendarioChange("[S1_QUI]", e.target.value)} /></td>
                            <td><input type="text" className="form-control" value={calendario["[S1_SEX]"]} onChange={e => handleCalendarioChange("[S1_SEX]", e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td className="semana-label">Semana 2</td>
                            <td><input type="text" className="form-control" value={calendario["[S2_SEG]"]} onChange={e => handleCalendarioChange("[S2_SEG]", e.target.value)} /></td>
                            <td><input type="text" className="form-control" value={calendario["[S2_TER]"]} onChange={e => handleCalendarioChange("[S2_TER]", e.target.value)} /></td>
                            <td><input type="text" className="form-control" value={calendario["[S2_QUA]"]} onChange={e => handleCalendarioChange("[S2_QUA]", e.target.value)} /></td>
                            <td><input type="text" className="form-control" value={calendario["[S2_QUI]"]} onChange={e => handleCalendarioChange("[S2_QUI]", e.target.value)} /></td>
                            <td><input type="text" className="form-control" value={calendario["[S2_SEX]"]} onChange={e => handleCalendarioChange("[S2_SEX]", e.target.value)} /></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <hr className="my-4" />

            {/* SEÇÃO 2: DISTRITOS */}
            <h4><i className="fas fa-map-marker-alt mr-2 text-primary"></i> Pontos de Encontro dos Distritos (Slide 6)</h4>
            <div className="distritos-grid mt-3">
                <div className="distrito-card norte">
                    <label><i className="fas fa-compass mr-1"></i> Distrito Norte</label>
                    <input type="text" className="form-control" value={distritos["[LOCAL_NORTE]"]} onChange={e => handleDistritoChange("[LOCAL_NORTE]", e.target.value)} />
                </div>
                <div className="distrito-card sul">
                    <label><i className="fas fa-compass mr-1"></i> Distrito Sul</label>
                    <input type="text" className="form-control" value={distritos["[LOCAL_SUL]"]} onChange={e => handleDistritoChange("[LOCAL_SUL]", e.target.value)} />
                </div>
                <div className="distrito-card leste">
                    <label><i className="fas fa-compass mr-1"></i> Distrito Leste</label>
                    <input type="text" className="form-control" value={distritos["[LOCAL_LESTE]"]} onChange={e => handleDistritoChange("[LOCAL_LESTE]", e.target.value)} />
                </div>
                <div className="distrito-card oeste">
                    <label><i className="fas fa-compass mr-1"></i> Distrito Oeste</label>
                    <input type="text" className="form-control" value={distritos["[LOCAL_OESTE]"]} onChange={e => handleDistritoChange("[LOCAL_OESTE]", e.target.value)} />
                </div>
            </div>

            <hr className="my-4" />

            {/* BOTÃO SALVAR */}
            <div className="text-right">
                <button 
                    className="btn-gov-salvar" 
                    onClick={handleGerarPowerPoint}
                    disabled={carregando}
                >
                    {carregando ? (
                        <>
                            <i className="fas fa-spinner spinner mr-2"></i> Processando PowerPoint SUS...
                        </>
                    ) : (
                        <>
                            <i className="fas fa-download mr-2"></i> Gerar e Baixar Apresentação
                    </>
                )}
            </button>
        </div>
    </div>
);
}