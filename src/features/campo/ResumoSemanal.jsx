import React from 'react';
import { useResumoSemanal } from './useResumoSemanal';
import './ResumoSemanal.css';

export default function ResumoSemanal({ setTelaAtual }) {
    const {
        matriz,
        quadranteAtivo,
        setQuadranteAtivo,
        fichasPendentes,
        calendarioPreenchido,
        handleSalvarEAtualizarDiario,
        handleSelecionarFicha,
        handleRemoverFicha,
        calcularTotalSemana,
        handleEnviarResumoSemanal
    } = useResumoSemanal(setTelaAtual);

    const diasDaSemana = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];
    const turnosMatutino = ['seg_mat', 'ter_mat', 'qua_mat', 'qui_mat', 'sex_mat'];
    const turnosVespertino = ['seg_vesp', 'ter_vesp', 'qua_vesp', 'qui_vesp', 'sex_vesp'];

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