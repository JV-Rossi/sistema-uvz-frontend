import React, { useState, useEffect } from 'react';

// 🟢 IMPORT DO PAINEL OPERACIONAL BASE E ESTILOS DO SISTEMA UVZ / CVSA
import PainelOperacionalBase from '../../../shared/components/PainelOperacionalBase';
import '../../../shared/components/PainelOperacionalBase.css';
import '../../../shared/components/Formularios.css';

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8080'
    : 'https://sistema-uvz-backend.onrender.com';

export default function InspecaoTerrenos() {
    const [demandas, setDemandas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sucesso, setSucesso] = useState('');
    const [abaAtiva, setAbaAtiva] = useState('pendentes');
    const [fotoExpandida, setFotoExpandida] = useState(null);

    useEffect(() => {
        carregarInspecoes();
    }, []);

    const carregarInspecoes = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/inspecoes-terrenos`);
            if (response.ok) {
                const data = await response.json();

                const formatados = data.map(item => ({
                    id: item.id,
                    ordemServicoId: item.ordemServicoId,
                    tipoOcorrencia: item.tipoOcorrencia || 'Terreno Baldio / Acumulador',
                    origemRegistro: item.origemRegistro || 'Atendimento O.S.',
                    referencia: item.referencia || 'Sem ponto de referência cadastrado',
                    fotoBase64: item.fotoBase64,
                    nomeArquivo: item.nomeArquivo,
                    acessoImovel: item.acessoImovel,
                    focoEncontrado: item.focoEncontrado,
                    status: item.status === 'CONCLUIDO' ? 'executado' : (item.status === 'CANCELADO' ? 'nao_realizado' : 'pendente'),
                    statusOriginal: item.status,
                    equipeAlocada: item.equipeAtribuida || '',
                    observacaoSupervisao: item.observacaoSupervisao,
                    dataExecucao: item.dataExecucao,

                    // 📞 DADOS DA O.S.
                    municipe: item.municipe || item.solicitante || 'Morador / Denunciante',
                    telefone: item.telefone || item.telefoneContato || 'Não informado',
                    distrito: item.distrito || 'DIS. NORTE',
                    bairro: item.bairro || 'Bairro N/I',
                    quarteirao: item.quarteirao ? `Quart. ${item.quarteirao}` : '',
                    endereco: item.endereco || 'Endereço registrado na O.S.',
                    descricaoOS: item.descricao || item.observacaoSolicitacao || 'Sem descrição cadastrada na O.S.',

                    relatorioOficial: item.relatorioOficial || null
                }));
                setDemandas(formatados);
            } else {
                carregarDadosMock();
            }
        } catch (err) {
            console.warn("API indisponível, carregando dados locais para demonstração.");
            carregarDadosMock();
        } finally {
            setLoading(false);
        }
    };

    const carregarDadosMock = () => {
        setDemandas([
            {
                id: 301,
                ordemServicoId: 1045,
                tipoOcorrencia: 'Terreno Baldio',
                municipe: 'JOSE PEREIRA (DENÚNCIA LIMPURB)',
                telefone: '(65) 99234-5678',
                distrito: 'DIS. NORTE',
                bairro: 'CPA III',
                quarteirao: 'Quart. 12',
                endereco: 'Rua 45, Lote 12 - Quadra 08',
                referencia: 'Atrás da Escola Estadual CPA 3',
                descricaoOS: 'Terreno com mato alto, acúmulo de pneus e latas com água parada.',
                status: 'pendente',
                equipeAlocada: '',
                fotoBase64: null
            },
            {
                id: 302,
                ordemServicoId: 1048,
                tipoOcorrencia: 'Casa / Imóvel de Acumulador',
                municipe: 'ASSOCIAÇÃO DE MORADORES (MARIA SANTOS)',
                telefone: '(65) 98112-9900',
                distrito: 'DIS. SUL',
                bairro: 'TIJUCAL',
                quarteirao: 'Quart. 05',
                endereco: 'Av. Espigão, nº 310',
                referencia: 'Em frente ao Moinho de Vento',
                descricaoOS: 'Residência com grande quantidade de recicláveis no quintal. Vizinhos relatam presença de mosquitos.',
                status: 'pendente',
                equipeAlocada: '',
                fotoBase64: null
            }
        ]);
    };

    // 🚀 SALVAR REGISTRO DA VISTORIA EXECUTADA E RELATÓRIO OFICIAL
    const handleSalvarVistoria = async (id, dadosFormulario, fecharModal) => {
        try {
            const payload = {
                status: 'CONCLUIDO',
                equipeAtribuida: dadosFormulario.equipePresente,
                observacaoSupervisao: `[RELATÓRIO Nº ${dadosFormulario.numeroRelatorio}] Locais: ${dadosFormulario.locaisVisitados} | Pacientes: ${dadosFormulario.pacientesOrientacoes}`,

                // Adicionamos o objeto completo do relatório aqui!
                relatorioOficial: dadosFormulario
            };

            await fetch(`${API_BASE_URL}/api/inspecoes-terrenos/${id}/supervisao`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            setDemandas(prev => prev.map(item => item.id === id ? {
                ...item,
                status: 'executado',
                statusOriginal: 'CONCLUIDO',
                equipeAlocada: dadosFormulario.equipePresente,
                observacaoSupervisao: payload.observacaoSupervisao,
                relatorioOficial: dadosFormulario
            } : item));

            setSucesso(`Relatório de Visita Domiciliar Nº ${dadosFormulario.numeroRelatorio} salvo com sucesso!`);
            setTimeout(() => setSucesso(''), 4000);
            fecharModal();
        } catch (err) {
            alert("Erro ao salvar atendimento no servidor.");
        }
    };

    // ❌ REGISTRAR IMPOSSIBILIDADE / CANCELAMENTO
    const handleSalvarCancelamento = async (id, dadosCancelamento) => {
        try {
            await fetch(`${API_BASE_URL}/api/inspecoes-terrenos/${id}/supervisao`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'CANCELADO',
                    observacaoSupervisao: `[IMPOSSIBILIDADE DE ATENDIMENTO] Motivo: ${dadosCancelamento.motivo || 'Sem acesso ao local'}`
                })
            });

            setDemandas(prev => prev.map(item => item.id === id ? {
                ...item,
                status: 'nao_realizado',
                statusOriginal: 'CANCELADO',
                dadosCancelamento
            } : item));

            setSucesso(`Solicitação #${id} registrada como Não Realizada.`);
            setTimeout(() => setSucesso(''), 4000);
        } catch (err) {
            console.error("Erro ao registrar cancelamento:", err);
        }
    };

    // 🖨️ IMPRESSÃO DO RELATÓRIO OFICIAL (PADRÃO MANUAL DE MARCA PREFEITURA DE CUIABÁ)
    const handleImprimirRelatorio = (item) => {
        const rel = item.relatorioOficial || {
            numeroRelatorio: `${item.id}/2026`,
            dataVisita: new Date().toLocaleDateString('pt-BR'),
            horarioVisita: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            locaisVisitados: `${item.bairro || ''} - ${item.endereco || ''}`,
            supervisoresArea: 'Ace Carlos França, Ace Anderson Sena',
            equipePresente: item.equipeAlocada || 'ACE Anderson Sena e Carlos França',
            tiposImoveis: [item.tipoOcorrencia || 'Residencial'],
            pacientesOrientacoes: 'Sim',
            obsPacientes: 'População receptiva às orientações.',
            prestativosLimpeza: 'Sim',
            obsLimpeza: 'Colaboraram com a limpeza e remoção dos focos.',
            fotos: [] // Fotos de campo da vistoria
        };

        const fotoDenuncia = item.fotoBase64 || null; // 🟢 Foto original registrada na abertura da O.S.
        const fotosVistoria = rel.fotos || [];        // 🟢 Fotos anexadas pelos supervisores no laudo

        const janela = window.open('', '_blank', 'width=900,height=1000');
        janela.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Relatório de Visita Domiciliar Nº ${rel.numeroRelatorio}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
                    
                    body { 
                        font-family: 'Plus Jakarta Sans', Arial, sans-serif; 
                        margin: 25px; 
                        color: #1e293b; 
                        font-size: 12px; 
                        line-height: 1.4; 
                    }
                    
                    /* CORES OFICIAIS PREFEITURA DE CUIABÁ (MANUAL DE MARCA) */
                    :root {
                        --verde-cuiaba: #367962; /* Pantone 335 C */
                        --amarelo-cuiaba: #F5C745; /* Pantone 7548 C */
                        --verde-escuro: #22524C;
                    }

                    .header-prefeitura { 
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 15px;
                        border-bottom: 3px solid var(--verde-cuiaba); 
                        padding-bottom: 12px; 
                        margin-bottom: 15px;
                    }

                    .header-titles {
                        text-align: left;
                    }

                    .header-main-title { 
                        font-weight: 800; 
                        font-size: 18px; 
                        color: var(--verde-cuiaba); 
                        text-transform: uppercase; 
                        letter-spacing: 0.5px;
                        margin: 0;
                    }
                    
                    .header-sub { 
                        font-size: 11px; 
                        font-weight: 700; 
                        color: #475569; 
                        margin: 1px 0; 
                        text-transform: uppercase;
                    }

                    .relatorio-num { 
                        font-size: 14px; 
                        font-weight: 800; 
                        text-align: center; 
                        margin: 15px 0; 
                        text-transform: uppercase; 
                        background: #f0fdf4; 
                        color: var(--verde-escuro);
                        padding: 8px; 
                        border: 1px solid #bbf7d0; 
                        border-radius: 4px;
                    }

                    .secao-titulo {
                        font-size: 12px;
                        font-weight: 700;
                        color: var(--verde-cuiaba);
                        border-bottom: 1px solid #cbd5e1;
                        padding-bottom: 4px;
                        margin-top: 15px;
                        margin-bottom: 8px;
                        text-transform: uppercase;
                    }

                    .campo-linha { margin-bottom: 6px; }
                    .campo-label { font-weight: 700; color: #0f172a; }

                    .checkbox-group { margin: 8px 0; padding-left: 10px; }
                    .checkbox-item { display: inline-block; width: 48%; margin-bottom: 4px; font-size: 11.5px; }

                    .anexo-pagina { page-break-before: always; margin-top: 20px; }
                    .anexo-titulo { 
                        font-weight: 800; 
                        font-size: 13px; 
                        color: var(--verde-cuiaba);
                        margin-bottom: 12px; 
                        text-transform: uppercase; 
                        border-bottom: 2px solid var(--verde-cuiaba); 
                        padding-bottom: 4px; 
                    }

                    .foto-box { 
                        margin-bottom: 15px; 
                        border: 1px solid #e2e8f0; 
                        padding: 8px; 
                        background: #f8fafc; 
                        border-radius: 6px;
                        text-align: center;
                    }
                    
                    .foto-img { 
                        max-width: 100%; 
                        max-height: 380px; 
                        object-fit: contain; 
                        border-radius: 4px;
                    }

                    .assinatura-area { margin-top: 40px; text-align: center; }
                    .linha-assinatura { width: 280px; border-top: 1px solid #334155; margin: 0 auto 6px auto; }

                    .footer-ccz { 
                        margin-top: 25px; 
                        font-size: 9.5px; 
                        text-align: center; 
                        color: #64748b; 
                        border-top: 1px solid #e2e8f0; 
                        padding-top: 8px; 
                    }

                    @media print {
                        .no-print { display: none; }
                        body { margin: 10mm; }
                    }
                </style>
            </head>
            <body>
                <div class="no-print" style="margin-bottom: 20px; text-align: right;">
                    <button onclick="window.print()" style="padding: 10px 22px; background: #367962; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 700; font-size: 13px;">
                        🖨️ Imprimir / Salvar PDF
                    </button>
                </div>

                <!-- CABEÇALHO OFICIAL DA PREFEITURA DE CUIABÁ -->
                <div class="header-prefeitura">
                    <svg width="60" height="65" viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <!-- Coroa Superior em Amarelo Pantone 7548 C -->
                        <path d="M20 25 L35 35 L50 15 L65 35 L80 25 L75 42 L25 42 Z" fill="#F5C745"/>
                        <!-- Escudo Verde Pantone 335 C -->
                        <path d="M15 42 H85 V70 C85 90 50 105 50 105 C50 105 15 90 15 70 Z" fill="#367962"/>
                        <!-- Centro Geodésico em Amarelo -->
                        <path d="M50 52 L68 82 L50 74 L32 82 Z" fill="#F5C745"/>
                    </svg>
                    <div class="header-titles">
                        <div class="header-main-title">PREFEITURA DE CUIABÁ</div>
                        <div class="header-sub">SECRETARIA MUNICIPAL DE SAÚDE</div>
                        <div class="header-sub">DIRETORIA DE VIGILÂNCIA EM SAÚDE</div>
                        <div class="header-sub">COORDENADORIA DE VIGILÂNCIA EM SAÚDE AMBIENTAL (CVSA)</div>
                    </div>
                </div>

                <div class="relatorio-num">
                    RELATÓRIO DE VISITA DOMICILIAR Nº ${rel.numeroRelatorio}
                </div>

                <div class="campo-linha"><span class="campo-label">Data da visita:</span> ${rel.dataVisita}</div>
                <div class="campo-linha"><span class="campo-label">Horário da visita:</span> ${rel.horarioVisita} horas</div>
                <div class="campo-linha"><span class="campo-label">Locais visitados:</span> ${rel.locaisVisitados}</div>
                <div class="campo-linha"><span class="campo-label">Supervisores da área:</span> ${rel.supervisoresArea}</div>
                <div class="campo-linha"><span class="campo-label">Equipe presente durante visita:</span> ${rel.equipePresente}</div>

                <div class="secao-titulo">Tipos de imóveis visitados</div>
                <div class="checkbox-group">
                    <div class="checkbox-item">${rel.tiposImoveis?.includes('Residencial') ? '(X)' : '( )'} Residencial</div>
                    <div class="checkbox-item">${rel.tiposImoveis?.includes('Residencial - condomínio') ? '(X)' : '( )'} Residencial - condomínio</div>
                    <div class="checkbox-item">${rel.tiposImoveis?.includes('Terreno baldio') ? '(X)' : '( )'} Terreno baldio</div>
                    <div class="checkbox-item">${rel.tiposImoveis?.includes('Imóvel abandonado') ? '(X)' : '( )'} Imóvel abandonado</div>
                    <div class="checkbox-item">${rel.tiposImoveis?.includes('Comércio') ? '(X)' : '( )'} Comércio</div>
                    <div class="checkbox-item">${rel.tiposImoveis?.includes('Órgão Público') ? '(X)' : '( )'} Órgão Público</div>
                </div>

                <div class="secao-titulo">Conduta de moradores, servidores e comerciantes</div>
                <div style="padding-left: 10px;">
                    <div class="campo-linha">
                        <strong>Foram pacientes com a presença dos servidores e orientações?</strong><br />
                        (${rel.pacientesOrientacoes === 'Sim' ? 'X' : ' '}) Sim &nbsp;&nbsp;&nbsp;&nbsp; (${rel.pacientesOrientacoes === 'Não' ? 'X' : ' '}) Não
                        ${rel.obsPacientes ? ` - <em>${rel.obsPacientes}</em>` : ''}
                    </div>

                    <div class="campo-linha" style="margin-top: 8px;">
                        <strong>Foram prestativos com as solicitações de limpeza?</strong><br />
                        (${rel.prestativosLimpeza === 'Sim' ? 'X' : ' '}) Sim &nbsp;&nbsp;&nbsp;&nbsp; (${rel.prestativosLimpeza === 'Não' ? 'X' : ' '}) Não
                        ${rel.obsLimpeza ? ` - <em>${rel.obsLimpeza}</em>` : ''}
                    </div>
                </div>

                <!-- 🟢 SEÇÃO 1: FOTO REGISTRADA NA SOLICITAÇÃO INICIAL / DENÚNCIA (SE HOUVER) -->
                ${fotoDenuncia ? `
                    <div style="margin-top: 20px;">
                        <div class="anexo-titulo">1. Registro Fotográfico Anexado na Denúncia / Solicitação</div>
                        <div class="foto-box">
                            <img src="${fotoDenuncia}" class="foto-img" alt="Foto da Denúncia" />
                            <div style="font-size: 10px; color: #64748b; margin-top: 4px;">Imagem registrada pelo munícipe ou canal de atendimento na abertura da O.S.</div>
                        </div>
                    </div>
                ` : ''}

                <!-- 🟢 SEÇÃO 2: IMAGENS DA VISTORIA DE CAMPO (SUPERVISÃO) -->
                ${fotosVistoria.length > 0 ? `
                    <div class="${fotoDenuncia ? 'anexo-pagina' : ''}" style="margin-top: 20px;">
                        <div class="anexo-titulo">2. Anexo - Registros Fotográficos da Vistoria de Campo (Máx. 3 fotos)</div>
                        
                        ${fotosVistoria.map((foto, index) => `
                            <div class="foto-box">
                                <img src="${foto}" class="foto-img" alt="Foto Vistoria ${index + 1}" />
                                <div style="font-size: 10px; color: #64748b; margin-top: 4px;">Foto ${index + 1} de ${fotosVistoria.length} - Ponto inspecionado pela equipe técnica</div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                <div class="assinatura-area">
                    <div class="linha-assinatura"></div>
                    <div style="font-weight: 700; color: #0f172a;">${rel.supervisoresArea || 'Supervisor de Campo'}</div>
                    <div style="font-size: 10.5px; color: #64748b;">Coordenadoria de Vigilância em Saúde Ambiental</div>
                </div>

                <div class="footer-ccz">
                    Coordenadoria de Vigilância em Saúde Ambiental<br />
                    Av.: Bernardo Antônio de Oliveira Neto Nº 1781 - Ribeirão do Lipa - Cuiabá-MT. CEP. 78.043-602<br />
                    Tel./Fax: (65) 3318-6059 - e-mail: ccz.saude@cuiaba.mt.gov.br
                </div>
            </body>
            </html>
        `);
        janela.document.close();
    };

    return (
        <>
            <PainelOperacionalBase
                titulo="Central de Inspeções em Terrenos Baldios e Acumuladores"
                subtit="Painel de Supervisão: Acompanhamento direto de solicitações, consulta de contatos e registro de atendimento de campo."
                icone="fa-dumpster"
                itens={demandas}
                loading={loading}
                sucesso={sucesso}
                abaAtiva={abaAtiva}
                setAbaAtiva={setAbaAtiva}
                textoAbaPendentes="Solicitações Pendentes"
                textoAbaConcluidos="Atendimentos Concluídos"
                tituloModalExecucao="Relatório de Visita Domiciliar / Vistoria"
                onConfirmarCancelamento={handleSalvarCancelamento}

                renderCardBadges={(item) => (
                    <>
                        <span className="badge-distrito">
                            <i className="fas fa-map-marker-alt"></i> {item.distrito}
                        </span>
                        <span className={`badge-doenca ${item.tipoOcorrencia.toLowerCase().includes('acumulador') ? 'dengue' : 'zika'}`}>
                            <i className={item.tipoOcorrencia.toLowerCase().includes('acumulador') ? 'fas fa-home' : 'fas fa-tree'}></i> {item.tipoOcorrencia}
                        </span>
                    </>
                )}

                renderCardCorpo={(item) => (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                        <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>
                                {item.bairro}
                                {item.quarteirao && (
                                    <span style={{ fontSize: '0.82rem', fontWeight: 500, color: '#64748b', marginLeft: '6px' }}>
                                        ({item.quarteirao})
                                    </span>
                                )}
                            </h3>
                        </div>

                        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                <i className="fas fa-user" style={{ width: '16px', textAlign: 'center', marginTop: '2px', flexShrink: 0, color: '#2563eb', fontSize: '0.85rem' }}></i>
                                <div style={{ flex: 1, fontSize: '0.85rem', color: '#334155', lineHeight: '1.3' }}>
                                    <strong style={{ color: '#1e293b' }}>Solicitante:</strong> {item.municipe}
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                <i className="fas fa-phone-alt" style={{ width: '16px', textAlign: 'center', marginTop: '2px', flexShrink: 0, color: '#16a34a', fontSize: '0.85rem' }}></i>
                                <div style={{ flex: 1, fontSize: '0.85rem', color: '#334155', lineHeight: '1.3' }}>
                                    <strong style={{ color: '#1e293b' }}>Contato / Tel:</strong> {item.telefone}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '0 2px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                <i className="fas fa-map-marked-alt" style={{ width: '16px', textAlign: 'center', marginTop: '2px', flexShrink: 0, color: '#475569', fontSize: '0.88rem' }}></i>
                                <div style={{ flex: 1, fontSize: '0.85rem', color: '#334155', lineHeight: '1.35' }}>
                                    <strong style={{ color: '#1e293b' }}>Endereço:</strong> {item.endereco}
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                <i className="fas fa-compass" style={{ width: '16px', textAlign: 'center', marginTop: '2px', flexShrink: 0, color: '#d97706', fontSize: '0.88rem' }}></i>
                                <div style={{ flex: 1, fontSize: '0.85rem', color: '#334155', lineHeight: '1.35' }}>
                                    <strong style={{ color: '#1e293b' }}>Ponto de Referência:</strong> {item.referencia}
                                </div>
                            </div>
                        </div>

                        <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderLeft: '4px solid #f59e0b', borderRadius: '6px', padding: '8px 10px', marginTop: '2px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                <i className="fas fa-align-left" style={{ color: '#d97706', fontSize: '0.85rem' }}></i>
                                <strong style={{ fontSize: '0.85rem', color: '#92400e' }}>Relato / Motivo da Solicitação:</strong>
                            </div>
                            <div style={{ fontSize: '0.83rem', color: '#475569', lineHeight: '1.4' }}>
                                {item.descricaoOS}
                            </div>
                        </div>

                        {item.fotoBase64 && (
                            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '6px', marginTop: '2px' }}>
                                <button
                                    type="button"
                                    className="br-button text-primary p-0 border-0 bg-transparent text-left font-weight-bold"
                                    onClick={() => setFotoExpandida(item.fotoBase64)}
                                    style={{ fontSize: '0.83rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                                >
                                    <i className="fas fa-camera" style={{ color: '#2563eb' }}></i> Visualizar Foto Anexada na Denúncia
                                </button>
                            </div>
                        )}
                    </div>
                )}

                renderResumoExecutado={(item) => (
                    <div className="po-boletim-resumo p-2 bg-light rounded mt-2 border border-success">
                        <hr className="po-divisor-card my-1" />
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold' }} className="text-success">
                            <i className="fas fa-check-circle mr-1"></i> Vistoria Realizada
                        </h4>
                        <p className="mb-1" style={{ fontSize: '0.85rem' }}>
                            <strong>Equipe Presente:</strong> {item.equipeAlocada || 'Não informada'}
                        </p>

                        <button
                            type="button"
                            className="btn btn-sm btn-outline-success font-weight-bold mt-2 w-100"
                            onClick={() => handleImprimirRelatorio(item)}
                        >
                            <i className="fas fa-file-pdf mr-1"></i> Imprimir Relatório PDF Oficial
                        </button>
                    </div>
                )}

                renderFormExecucao={(item, fecharModal) => (
                    <FormRelatorioOficial
                        item={item}
                        onSubmit={(dados) => handleSalvarVistoria(item.id, dados, fecharModal)}
                        onCancelar={fecharModal}
                    />
                )}
            />

            {fotoExpandida && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1060 }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header bg-dark text-white p-2">
                                <h6 className="modal-title mb-0"><i className="fas fa-image mr-2"></i> Foto Registrada na Solicitação</h6>
                                <button type="button" className="close text-white" onClick={() => setFotoExpandida(null)}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body text-center p-3">
                                <img src={fotoExpandida} alt="Denúncia" style={{ maxHeight: '75vh', maxWidth: '100%', borderRadius: '4px' }} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// 📝 FORMULÁRIO COM O DESIGN SYSTEM CVSA (Formularios.css)
function FormRelatorioOficial({ item, onSubmit, onCancelar }) {
    const hoje = new Date().toISOString().split('T')[0];
    const horaAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const [numeroRelatorio, setNumeroRelatorio] = useState(`${item.id}/2026`);
    const [dataVisita, setDataVisita] = useState(hoje);
    const [horarioVisita, setHorarioVisita] = useState(horaAtual);
    const [locaisVisitados, setLocaisVisitados] = useState(`${item.bairro} - ${item.endereco}`);
    const [supervisoresArea, setSupervisoresArea] = useState('Ace Carlos França, Ace Anderson Sena');
    const [equipePresente, setEquipePresente] = useState('ACE Anderson Sena e Carlos França');

    const [tiposImoveis, setTiposImoveis] = useState([item.tipoOcorrencia || 'Residencial']);

    const [pacientesOrientacoes, setPacientesOrientacoes] = useState('Sim');
    const [obsPacientes, setObsPacientes] = useState('');
    const [prestativosLimpeza, setPrestativosLimpeza] = useState('Sim');
    const [obsLimpeza, setObsLimpeza] = useState('');

    // 🛑 LIMITE DE MÁXIMO 3 FOTOS
    const [fotos, setFotos] = useState(item.fotoBase64 ? [item.fotoBase64] : []);

    const toggleTipoImovel = (tipo) => {
        setTiposImoveis(prev =>
            prev.includes(tipo) ? prev.filter(t => t !== tipo) : [...prev, tipo]
        );
    };

    const handleUploadFoto = (e) => {
        const files = Array.from(e.target.files);
        if (fotos.length + files.length > 3) {
            alert("Atenção: É permitido anexar no máximo 3 imagens no relatório.");
            return;
        }

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFotos(prev => {
                    if (prev.length >= 3) return prev;
                    return [...prev, reader.result];
                });
            };
            reader.readAsDataURL(file);
        });
    };

    const handleRemoverFoto = (index) => {
        setFotos(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            numeroRelatorio,
            dataVisita,
            horarioVisita,
            locaisVisitados,
            supervisoresArea,
            equipePresente,
            tiposImoveis,
            pacientesOrientacoes,
            obsPacientes,
            prestativosLimpeza,
            obsLimpeza,
            fotos
        });
    };

    return (
        <div className="form-wrapper" style={{
            padding: '0.5rem',
            background: 'transparent',
            maxHeight: '70vh',
            overflowY: 'auto',
            overflowX: 'hidden'
        }}>
            <form onSubmit={handleSubmit}>

                {/* SEÇÃO 1: CABEÇALHO E IDENTIFICAÇÃO */}
                <h3 className="form-section-title" style={{ marginTop: 0 }}>
                    <i className="fas fa-file-alt mr-2"></i> 1. Identificação do Relatório e Equipe
                </h3>

                <div className="form-grid">
                    <div>
                        <label>Relatório Nº <span className="text-danger">*</span></label>
                        <input type="text" required value={numeroRelatorio} onChange={e => setNumeroRelatorio(e.target.value)} placeholder="Ex: 479/2026" />
                    </div>

                    <div>
                        <label>Data da Visita <span className="text-danger">*</span></label>
                        <input type="date" required value={dataVisita} onChange={e => setDataVisita(e.target.value)} />
                    </div>

                    <div className="form-grid-full">
                        <label>Horário da Visita <span className="text-danger">*</span></label>
                        <input type="time" required value={horarioVisita} onChange={e => setHorarioVisita(e.target.value)} />
                    </div>

                    <div className="form-grid-full">
                        <label>Locais Visitados <span className="text-danger">*</span></label>
                        <input type="text" required value={locaisVisitados} onChange={e => setLocaisVisitados(e.target.value)} placeholder="Locais e estabelecimentos visitados" />
                    </div>

                    <div>
                        <label>Supervisores da Área <span className="text-danger">*</span></label>
                        <input type="text" required value={supervisoresArea} onChange={e => setSupervisoresArea(e.target.value)} placeholder="Ex: Ace Carlos França, Ace Anderson Sena" />
                    </div>

                    <div>
                        <label>Equipe Presente durante Visita (ACEs) <span className="text-danger">*</span></label>
                        <input type="text" required value={equipePresente} onChange={e => setEquipePresente(e.target.value)} placeholder="Ex: ACE Anderson Sena e Carlos França" />
                    </div>
                </div>

                {/* SEÇÃO 2: TIPOS DE IMÓVEIS VISITADOS */}
                <h3 className="form-section-title">
                    <i className="fas fa-building mr-2"></i> 2. Tipos de Imóveis Visitados
                </h3>

                <div className="form-subcard">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                        {[
                            'Residencial',
                            'Residencial - condomínio',
                            'Terreno baldio',
                            'Imóvel abandonado',
                            'Comércio',
                            'Órgão Público'
                        ].map(tipo => (
                            <label key={tipo} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 500, margin: 0 }}>
                                <input
                                    type="checkbox"
                                    style={{ width: '18px', height: '18px', accentColor: '#1351B4', cursor: 'pointer' }}
                                    checked={tiposImoveis.includes(tipo)}
                                    onChange={() => toggleTipoImovel(tipo)}
                                />
                                <span>{tipo}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* SEÇÃO 3: CONDUTA E RECEPTIVIDADE */}
                <h3 className="form-section-title">
                    <i className="fas fa-comments mr-2"></i> 3. Conduta de Moradores, Servidores e Comerciantes
                </h3>

                <div className="form-subcard" style={{ background: '#fffef0', borderColor: '#fef08a' }}>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>
                            1. Foram pacientes com a presença dos servidores e orientações?
                        </label>
                        <div className="radio-group" style={{ background: '#ffffff', marginBottom: '0.5rem' }}>
                            <div className="br-radio">
                                <input type="radio" id="pacientes-sim" name="pacientes" value="Sim" checked={pacientesOrientacoes === 'Sim'} onChange={e => setPacientesOrientacoes(e.target.value)} />
                                <label htmlFor="pacientes-sim">Sim</label>
                            </div>
                            <div className="br-radio">
                                <input type="radio" id="pacientes-nao" name="pacientes" value="Não" checked={pacientesOrientacoes === 'Não'} onChange={e => setPacientesOrientacoes(e.target.value)} />
                                <label htmlFor="pacientes-nao">Não</label>
                            </div>
                        </div>
                        <input
                            type="text"
                            placeholder="Exceções / Detalhes (ex: moradores de rua ou recusas)"
                            value={obsPacientes}
                            onChange={e => setObsPacientes(e.target.value)}
                        />
                    </div>

                    <div>
                        <label style={{ fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>
                            2. Foram prestativos com as solicitações de limpeza?
                        </label>
                        <div className="radio-group" style={{ background: '#ffffff', marginBottom: '0.5rem' }}>
                            <div className="br-radio">
                                <input type="radio" id="prestativos-sim" name="prestativos" value="Sim" checked={prestativosLimpeza === 'Sim'} onChange={e => setPrestativosLimpeza(e.target.value)} />
                                <label htmlFor="prestativos-sim">Sim</label>
                            </div>
                            <div className="br-radio">
                                <input type="radio" id="prestativos-nao" name="prestativos" value="Não" checked={prestativosLimpeza === 'Não'} onChange={e => setPrestativosLimpeza(e.target.value)} />
                                <label htmlFor="prestativos-nao">Não</label>
                            </div>
                        </div>
                        <input
                            type="text"
                            placeholder="Exceções / Detalhes das recusas de limpeza"
                            value={obsLimpeza}
                            onChange={e => setObsLimpeza(e.target.value)}
                        />
                    </div>
                </div>

                {/* SEÇÃO 4: ANEXO DE IMAGENS (LÍMITE MÁXIMO 3 FOTOS) */}
                <h3 className="form-section-title">
                    <i className="fas fa-camera mr-2"></i> 4. Anexo - Imagens dos Pontos Visitados (Máx. 3 fotos)
                </h3>

                <div className="form-subcard">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>
                            Fotos anexadas: <strong style={{ color: fotos.length >= 3 ? '#e52207' : '#1351B4' }}>{fotos.length} de 3</strong>
                        </span>
                    </div>

                    {fotos.length < 3 && (
                        <div className="upload-dropzone mb-3">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                id="input-fotos-relatorio"
                                className="d-none"
                                onChange={handleUploadFoto}
                            />
                            <label htmlFor="input-fotos-relatorio" className="upload-label">
                                <div className="upload-icon-wrapper">
                                    <i className="fas fa-cloud-upload-alt"></i>
                                </div>
                                <div className="upload-text">
                                    <strong>Clique para selecionar foto(s)</strong>
                                </div>
                                <span className="upload-hint">Anexe registros fotográficos da vistoria (Máximo 3 fotos)</span>
                            </label>
                        </div>
                    )}

                    {fotos.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px', marginTop: '1rem' }}>
                            {fotos.map((foto, index) => (
                                <div key={index} style={{ position: 'relative', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '4px', background: '#ffffff' }}>
                                    <img src={foto} alt={`Anexo ${index + 1}`} style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '6px' }} />
                                    <button
                                        type="button"
                                        className="btn-remover-foto"
                                        style={{ position: 'absolute', top: '2px', right: '4px', background: '#dc3545', color: '#fff', width: '22px', height: '22px', borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: '12px', padding: 0 }}
                                        onClick={() => handleRemoverFoto(index)}
                                        title="Remover foto"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* BOTÕES DE AÇÃO */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0' }}>
                    <button type="button" className="btn btn-secondary" onClick={onCancelar} style={{ height: '42px', padding: '0 20px', borderRadius: '6px', fontWeight: 600 }}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn btn-success" style={{ height: '42px', padding: '0 24px', borderRadius: '6px', fontWeight: 600, background: '#16a34a', borderColor: '#16a34a' }}>
                        <i className="fas fa-save mr-2"></i> Salvar Relatório Oficial
                    </button>
                </div>

            </form>
        </div>
    );
}
