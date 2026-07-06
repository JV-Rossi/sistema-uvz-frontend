import React, { useState, useEffect } from 'react';
import api from '../../core/api';
import { db } from '../../core/dbLocal';
import './ResumoSemanal.css';

export default function ResumoSemanal({ setTelaAtual }) {
    // ==========================================
    // 🧠 PARTE LÓGICA (Mantida intacta)
    // ==========================================
    const [matriz, setMatriz] = useState({
        seg_mat: [], seg_vesp: [],
        ter_mat: [], ter_vesp: [],
        qua_mat: [], qua_vesp: [],
        qui_mat: [], qui_vesp: [],
        sex_mat: [], sex_vesp: [],
    });

    const [quadranteAtivo, setQuadranteAtivo] = useState(null);
    const [fichasPendentes, setFichasPendentes] = useState([]);

    const periodosObrigatorios = [
        'seg_mat', 'seg_vesp', 'ter_mat', 'ter_vesp',
        'qua_mat', 'qua_vesp', 'qui_mat', 'qui_vesp',
        'sex_mat', 'sex_vesp'
    ];

    const calendarioPreenchido = periodosObrigatorios.every(periodo =>
        matriz[periodo] && matriz[periodo].length > 0
    );

    const carregarFichasDoCofre = async (matrizAtual) => {
        try {
            const todasAsFichas = await db.fichas_soltas.toArray();
            todasAsFichas.sort((a, b) => new Date(a.data_registro) - new Date(b.data_registro));

            const idsAlocados = Object.values(matrizAtual || matriz)
                .flat()
                .map(ficha => ficha.id);

            const contadoresSemana = {};

            const fichasFinais = todasAsFichas
                .filter(ficha => !idsAlocados.includes(ficha.id))
                .map(ficha => {
                    const sem = ficha.ciclo || ficha.semana || 'Sem Semana';
                    if (!contadoresSemana[sem]) {
                        contadoresSemana[sem] = 1;
                    } else {
                        contadoresSemana[sem] += 1;
                    }

                    return {
                        ...ficha,
                        id: ficha.id,
                        semana: sem,
                        numeroSequencial: contadoresSemana[sem]
                    };
                });

            setFichasPendentes(fichasFinais);
        } catch (error) {
            console.error("Erro ao buscar as fichas do cofre offline:", error);
        }
    };

    useEffect(() => {
        carregarFichasDoCofre();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSalvarEAtualizarDiario = async () => {
        const matricula = localStorage.getItem('userMatricula');

        if (!matricula || matricula === 'DESCONHECIDO') {
            alert('⚠️ Erro: Não foi possível identificar a matrícula do agente logado.');
            return;
        }

        try {
            // =================================================================
            // 🚀 FASE 1: PUSH (Enviar a produção offline do Tablet para a Nuvem)
            // =================================================================
            const todasAsFichasLocais = await db.fichas_soltas.toArray();

            // Filtra as fichas que foram geradas offline neste tablet (não sincronizadas)
            const fichasParaSubir = todasAsFichasLocais.filter(ficha => !ficha.sincronizado);

            if (fichasParaSubir.length > 0) {
                console.log(`📤 Encontradas ${fichasParaSubir.length} fichas offline. Iniciando upload da equipe...`);

                for (const ficha of fichasParaSubir) {
                    // Desestrutura para remover o ID temporário do Dexie e a flag de controle
                    const { id, sincronizado, ...dadosEnvio } = ficha;

                    // Garante que a matrícula de quem coletou permaneça intacta no lote
                    dadosEnvio.titularMatricula = dadosEnvio.titularMatricula || matricula;

                    // Dispara para o endpoint POST do seu VisitaController
                    const responsePost = await api.post('/visitas', dadosEnvio);

                    if (responsePost.status === 200 || responsePost.status === 201) {
                        // 🔥 ESSENCIAL: Deleta a ficha provisória local. 
                        // Como ela foi salva na nuvem, vamos baixar a cópia oficial com ID do banco logo abaixo.
                        await db.fichas_soltas.delete(ficha.id);
                    }
                }
            }

            // =================================================================
            // 🔄 FASE 2: PULL (Baixar a produção da dupla vinculada ao Servidor)
            // =================================================================
            console.log(`📥 Sincronizando e baixando produção da equipe para a matrícula: ${matricula}`);

            // Esse endpoint chama o seu método findByAgenteVinculado(matricula) no Java
            const responseGet = await api.get(`/visitas/agente/${matricula}`);
            const visitasServidor = responseGet.data;

            if (visitasServidor.length > 0) {
                // Injeta a flag sincronizado: true em todas as fichas vindas da nuvem 
                // para que o tablet saiba que elas já estão salvas e não tente reenviá-las
                const visitasProntas = visitasServidor.map(visita => ({
                    ...visita,
                    sincronizado: true
                }));

                // Alimenta/atualiza o Dexie local do agente logado atual com a base da nuvem
                await db.fichas_soltas.bulkPut(visitasProntas);
            }

            // Recarrega o cofre na tela para renderizar os blocos atualizados na matriz semanal
            await carregarFichasDoCofre();

            alert(`✅ Sincronização de Equipe concluída!\n\n• Sua produção offline foi descarregada no banco central.\n• ${visitasServidor.length} fichas atualizadas da dupla foram sincronizadas neste aparelho.`);

        } catch (error) {
            console.error("Erro no fluxo híbrido de sincronização de equipe:", error);
            alert('❌ Falha ao conectar com o servidor do Render. Suas fichas offline continuam seguras no tablet. Certifique-se de ter sinal de internet para atualizar a produção da dupla.');
        }
    };
    const handleSelecionarFicha = (fichaEscolhida) => {
        const novaMatriz = {
            ...matriz,
            [quadranteAtivo]: [...(matriz[quadranteAtivo] || []), fichaEscolhida]
        };
        setMatriz(novaMatriz);
        setFichasPendentes(fichasPendentes.filter(f => f.id !== fichaEscolhida.id));
        setQuadranteAtivo(null);
    };

    const handleRemoverFicha = (idQuadrante, fichaParaRemover, e) => {
        e.stopPropagation();
        const novaMatriz = {
            ...matriz,
            [idQuadrante]: (matriz[idQuadrante] || []).filter(f => f.id !== fichaParaRemover.id)
        };
        setMatriz(novaMatriz);
        setFichasPendentes([...fichasPendentes, fichaParaRemover]);
    };

    const calcularTotalSemana = () => {
        let totalImoveis = 0;
        Object.values(matriz).forEach(gavetaDoTurno => {
            gavetaDoTurno.forEach(ficha => {
                if (ficha.imoveis && Array.isArray(ficha.imoveis)) {
                    totalImoveis += ficha.imoveis.length;
                }
            });
        });
        return totalImoveis;
    };

    const handleEnviarResumoSemanal = async () => {
        if (!calendarioPreenchido) {
            alert(
                '⚠️ BLOQUEIO DE SEGURANÇA:\n\n' +
                'Não é possível enviar o Resumo Semanal ainda.\n' +
                'O calendário precisa ter pelo menos 1 ficha alocada em CADA período ' +
                '(Manhã e Tarde) de Segunda a Sexta-feira.'
            );
            return;
        }

        const totalImoveis = calcularTotalSemana();
        const payload = {
            totalImoveis: totalImoveis,
            distribuicao: matriz
        };

        try {
            const resposta = await fetch('https://sistema-uvz-backend.onrender.com/api/resumos-semanais', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (resposta.ok) {
                alert('✅ Resumo Semanal enviado com sucesso para a Gestão!');
                setTelaAtual('campo_menu');
            } else {
                alert('❌ O servidor Java encontrou um erro ao processar o resumo.');
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert('❌ Não foi possível conectar ao servidor. Verifique sua conexão.');
        }
    };

    const diasDaSemana = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];
    const turnosMatutino = ['seg_mat', 'ter_mat', 'qua_mat', 'qui_mat', 'sex_mat'];
    const turnosVespertino = ['seg_vesp', 'ter_vesp', 'qua_vesp', 'qui_vesp', 'sex_vesp'];

    // ==========================================
    // 🎨 PARTE VISUAL (Padrão Gov.br)
    // ==========================================
    return (
        <div className="br-container-lg p-3 fundo-claro-gov">
            {/* BOTÃO VOLTAR PADRÃO GOV.BR */}
            <button
                className="br-button secondary mb-3"
                type="button"
                onClick={() => setTelaAtual('campo_menu')}
            >
                <i className="fas fa-arrow-left mr-1" aria-hidden="true"></i> Voltar
            </button>

            {/* CABEÇALHO E PLACAR DA SEMANA (Em formato de br-card) */}
            <div className="br-card p-3 mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h2 className="text-up-02 text-weight-semi-bold text-primary-default mb-0">
                        <i className="fas fa-calendar-alt mr-1"></i> Resumo Semanal
                    </h2>
                    <span className="text-down-01 text-secondary-06">Alocação de Fichas</span>
                </div>
                <div className="text-right">
                    <div className="text-down-02 text-weight-semi-bold text-success text-uppercase">Total Produzido</div>
                    <div className="text-up-05 text-weight-bold text-primary-default">
                        {calcularTotalSemana()} <span className="text-down-01 text-secondary-06 text-weight-regular">imóveis</span>
                    </div>
                </div>
            </div>

            {/* GRID DA MATRIZ */}
            <div className="grid-matriz-gov">
                <div className="grid-header-vazio"></div>
                {diasDaSemana.map(dia => (
                    <div key={dia} className="dia-header text-weight-semi-bold">{dia}</div>
                ))}

                {/* LINHA MATUTINO */}
                <div className="turno-header text-weight-semi-bold">
                    <i className="fas fa-sun text-warning mr-1"></i> Mat
                </div>
                {turnosMatutino.map(id => (
                    <div
                        key={id}
                        onClick={() => setQuadranteAtivo(id)}
                        className={`quadrante-gov ${matriz[id] && matriz[id].length > 0 ? 'preenchido' : 'vazio'}`}
                    >
                        {matriz[id] && matriz[id].length > 0 ? (
                            <div className="d-flex flex-column" style={{ gap: '4px', width: '100%' }}>
                                {matriz[id].map(ficha => (
                                    <div key={ficha.id} className="br-tag interactive bg-primary-light">
                                        <span className="text-weight-semi-bold">#{ficha.codigo}</span>
                                        <button
                                            className="br-button circle small"
                                            type="button"
                                            aria-label="Remover ficha"
                                            onClick={(e) => handleRemoverFicha(id, ficha, e)}
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                ))}
                                <div className="text-center text-primary-default mt-1"><i className="fas fa-plus"></i></div>
                            </div>
                        ) : (
                            <i className="fas fa-plus text-secondary-06"></i>
                        )}
                    </div>
                ))}

                {/* LINHA VESPERTINO */}
                <div className="turno-header text-weight-semi-bold">
                    <i className="fas fa-moon text-primary-default mr-1"></i> Vesp
                </div>
                {turnosVespertino.map(id => (
                    <div
                        key={id}
                        onClick={() => setQuadranteAtivo(id)}
                        className={`quadrante-gov ${matriz[id] && matriz[id].length > 0 ? 'preenchido' : 'vazio'}`}
                    >
                        {matriz[id] && matriz[id].length > 0 ? (
                            <div className="d-flex flex-column" style={{ gap: '4px', width: '100%' }}>
                                {matriz[id].map(ficha => (
                                    <div key={ficha.id} className="br-tag interactive bg-primary-light">
                                        <span className="text-weight-semi-bold">#{ficha.codigo}</span>
                                        <button
                                            className="br-button circle small"
                                            type="button"
                                            aria-label="Remover ficha"
                                            onClick={(e) => handleRemoverFicha(id, ficha, e)}
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                ))}
                                <div className="text-center text-primary-default mt-1"><i className="fas fa-plus"></i></div>
                            </div>
                        ) : (
                            <i className="fas fa-plus text-secondary-06"></i>
                        )}
                    </div>
                ))}
            </div>

            {/* BOTÕES DE AÇÃO (Padrão br-button block) */}
            <div className="mt-4">
                <button
                    type="button"
                    className="br-button block secondary mb-3"
                    onClick={handleSalvarEAtualizarDiario}
                >
                    <i className="fas fa-sync-alt mr-2"></i> Salvar e Atualizar
                </button>

                <button
                    type="button"
                    onClick={handleEnviarResumoSemanal}
                    className="br-button block primary"
                    disabled={!calendarioPreenchido}
                >
                    <i className="fas fa-paper-plane mr-2"></i> Finalizar Resumo Semanal
                </button>
            </div>

            {/* MODAL GOV.BR (MENU FLUTUANTE) */}
            {quadranteAtivo && (
                <div className="br-scrim is-active" onClick={() => setQuadranteAtivo(null)}>
                    <div className="br-modal" onClick={e => e.stopPropagation()}>
                        <div className="br-modal-header">
                            <div className="br-modal-title text-up-01 text-weight-semi-bold">
                                Selecionar Ficha - {quadranteAtivo.replace('_', ' ').toUpperCase()}
                            </div>
                        </div>

                        <div className="br-modal-body">
                            {fichasPendentes.length === 0 ? (
                                <p className="text-center text-secondary-06">Nenhuma ficha pendente encontrada.</p>
                            ) : (
                                <div className="br-list" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                                    {fichasPendentes.map(ficha => (
                                        <div
                                            key={ficha.id}
                                            className="br-item"
                                            role="listitem"
                                            onClick={() => handleSelecionarFicha(ficha)}
                                            style={{ cursor: 'pointer', borderBottom: '1px solid #ededed' }}
                                        >
                                            <div className="row align-items-center">
                                                <div className="col">
                                                    <div className="text-weight-semi-bold text-primary-default">
                                                        {ficha.numeroSequencial}ª Ficha - Sem. {ficha.semana}
                                                    </div>
                                                    <span className="text-down-01 text-secondary-06">Área: #{ficha.codigo}</span>
                                                </div>
                                                <div className="col-auto text-down-01 text-secondary-07">
                                                    {ficha.imoveis ? ficha.imoveis.length : 0} imóveis
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="br-modal-footer justify-content-end">
                            <button
                                className="br-button secondary"
                                type="button"
                                onClick={() => setQuadranteAtivo(null)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}