import React, { useState, useEffect } from 'react';
import api from '../../core/api';
import { db } from '../../core/dbLocal';
import './ResumoSemanal.css';

export default function ResumoSemanal({ setTelaAtual }) {
    // ==========================================
    // 🧠 PARTE LÓGICA (CÉREBRO DO COMPONENTE)
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
            console.log(`🔄 [Uso Diário] Buscando fichas e parcerias no servidor para: ${matricula}`);
            const response = await api.get(`/visitas/agente/${matricula}`);
            const visitasServidor = response.data;

            if (visitasServidor.length === 0) {
                alert('💡 Nenhuma ficha nova ou espelho encontrada para você no servidor hoje.');
                return;
            }

            await db.fichas_soltas.bulkPut(visitasServidor);
            await carregarFichasDoCofre();

            alert(`✅ Sincronização diária concluída! ${visitasServidor.length} fichas mapeadas e prontas para alocação.`);
        } catch (error) {
            console.error("Erro no combo diário:", error);
            alert('❌ Falha ao sincronizar. As fichas alocadas continuam seguras no tablet, mas certifique-se de estar no Wi-Fi da UVZ para baixar o trabalho dos parceiros.');
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
    // 🎨 PARTE VISUAL (CORPO / JSX)
    // ==========================================
    return (
        <div className="container-resumo">
            <button className="btn-voltar" onClick={() => setTelaAtual('campo_menu')}>
                ⬅️ VOLTAR
            </button>

            {/* CABEÇALHO E PLACAR DA SEMANA */}
            <div className="placar-semana">
                <div>
                    <h2 style={{ margin: '0', color: '#90caf9', fontSize: '18px' }}>📅 Resumo Semanal</h2>
                    <span style={{ fontSize: '12px', color: '#ccc' }}>Alocação de Fichas</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#a5d6a7', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Produzido</div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff' }}>
                        {calcularTotalSemana()} <span style={{ fontSize: '14px', color: '#aaa', fontWeight: 'normal' }}>imóveis</span>
                    </div>
                </div>
            </div>

            {/* GRID DA MATRIZ */}
            <div className="grid-matriz">
                <div></div>
                {diasDaSemana.map(dia => (
                    <div key={dia} className="dia-header">{dia}</div>
                ))}

                {/* LINHA MATUTINO */}
                <div className="turno-header">☀️ Mat</div>
                {turnosMatutino.map(id => (
                    <div
                        key={id}
                        onClick={() => setQuadranteAtivo(id)}
                        className={matriz[id] && matriz[id].length > 0 ? 'quadrante-preenchido' : 'quadrante-vazio'}
                    >
                        {matriz[id] && matriz[id].length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                                {matriz[id].map(ficha => (
                                    <div key={ficha.id} className="ficha-alocada">
                                        <div className="btn-remover-ficha" onClick={(e) => handleRemoverFicha(id, ficha, e)}>
                                            X
                                        </div>
                                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#fff' }}>#{ficha.codigo}</span>
                                    </div>
                                ))}
                                <div style={{ fontSize: '14px', textAlign: 'center', color: '#a5d6a7', marginTop: '2px' }}>+</div>
                            </div>
                        ) : '+'}
                    </div>
                ))}

                {/* LINHA VESPERTINO */}
                <div className="turno-header">🌙 Vesp</div>
                {turnosVespertino.map(id => (
                    <div
                        key={id}
                        onClick={() => setQuadranteAtivo(id)}
                        className={matriz[id] && matriz[id].length > 0 ? 'quadrante-preenchido' : 'quadrante-vazio'}
                    >
                        {matriz[id] && matriz[id].length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                                {matriz[id].map(ficha => (
                                    <div key={ficha.id} className="ficha-alocada">
                                        <div className="btn-remover-ficha" onClick={(e) => handleRemoverFicha(id, ficha, e)}>
                                            X
                                        </div>
                                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#fff' }}>#{ficha.codigo}</span>
                                    </div>
                                ))}
                                <div style={{ fontSize: '14px', textAlign: 'center', color: '#a5d6a7', marginTop: '2px' }}>+</div>
                            </div>
                        ) : '+'}
                    </div>
                ))}
            </div>

            {/* BOTÕES DE AÇÃO */}
            <button type="button" className="btn-acao-diaria" onClick={handleSalvarEAtualizarDiario}>
                 SALVAR E ATUALIZAR 🔄
            </button>

            <button
                onClick={handleEnviarResumoSemanal}
                className={`btn-acao-final ${calendarioPreenchido ? 'ativo' : 'bloqueado'}`}
            >
                 FINALIZAR RESUMO SEMANAL 🚀
            </button>

            {/* MODAL (MENU FLUTUANTE) */}
            {quadranteAtivo && (
                <div className="modal-flutuante">
                    <h3 style={{ margin: '0 0 15px 0', color: '#ffb74d', fontSize: '16px', textAlign: 'center' }}>
                        Selecionar Ficha<br />{quadranteAtivo.replace('_', ' ').toUpperCase()}
                    </h3>

                    {fichasPendentes.length === 0 ? (
                        <p style={{ fontSize: '13px', color: '#ccc', textAlign: 'center' }}>Nenhuma ficha pendente.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                            {fichasPendentes.map(ficha => (
                                <div key={ficha.id} onClick={() => handleSelecionarFicha(ficha)} className="item-ficha-pendente">
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <strong style={{ color: '#42a5f5' }}>{ficha.numeroSequencial}ª Ficha - Sem. {ficha.semana}</strong>
                                        <span style={{ fontSize: '12px', color: '#ffb74d' }}>Área: #{ficha.codigo}</span>
                                    </div>
                                    <span style={{ fontSize: '12px', color: '#aaa' }}>{ficha.imoveis ? ficha.imoveis.length : 0} imóveis</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        onClick={() => setQuadranteAtivo(null)}
                        style={{ width: '100%', padding: '10px', marginTop: '15px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Cancelar
                    </button>
                </div>
            )}
        </div>
    );
}