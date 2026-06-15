import { useState, useEffect } from 'react';
import api from '../../core/api';

export default function GestaoDashboard() {
    // 🔐 GUARDA DE SEGURANÇA DA URL
    const cargoLogado = localStorage.getItem('userCargo');
    const usuarioNome = localStorage.getItem('userLogin');

    if (!cargoLogado || cargoLogado !== 'GESTAO') {
        // Se não estiver logado ou não for GESTAO, bloqueia e chuta para o login
        window.location.href = '/';
        return null;
    }

    const [visitas, setVisitas] = useState([]);
    const [erro, setErro] = useState('');

    // Função para buscar as visitas do Java
    const buscarVisitas = async () => {
        try {
            const response = await api.get('/visitas');
            setVisitas(response.data);
        } catch (err) {
            console.error("Erro ao buscar visitas:", err);
            setErro('❌ Não foi possível carregar o relatório de visitas do servidor.');
        }
    };

    // Executa a busca assim que a tela abre
    useEffect(() => {
        buscarVisitas();
    }, []);

    // 🚪 FUNÇÃO PARA DESCONECTAR LIMPANDO A MEMÓRIA DO NAVEGADOR
    const handleLogout = () => {
        localStorage.clear();       // Apaga os dados salvos (cargo, login, etc.)
        window.location.href = '/'; // Chuta de volta para a tela de login
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto', color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h1>📊 Painel de Controle - Gestão CVSA</h1>
                    <p style={{ color: '#aaa' }}>Consolidado de Visitas de Campo e Monitoramento de Endemias</p>
                    {usuarioNome && <p style={{ color: '#007bff', fontSize: '14px' }}>👤 Bem-vindo, {usuarioNome}!</p>}
                </div>
            </div>

            {erro && <p style={{ color: '#dc3545', fontWeight: 'bold' }}>{erro}</p>}

            {/* Botão para atualizar a tabela manualmente */}
            <button onClick={buscarVisitas} style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '20px' }}>
                🔄 Atualizar Dados
            </button>

            {/* Tabela de Monitoramento */}
            <div style={{ overflowX: 'auto', background: '#222', borderRadius: '8px', padding: '15px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #444', color: '#007bff' }}>
                            <th style={{ padding: '12px' }}>Data</th>
                            <th style={{ padding: '12px' }}>Bairro</th>
                            <th style={{ padding: '12px' }}>Endereço</th>
                            <th style={{ padding: '12px' }}>Status / Resultado Laboratório</th>
                            <th style={{ padding: '12px' }}>Observações do Agente</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visitas.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#aaa' }}>Nenhuma visita registrada até o momento.</td>
                            </tr>
                        ) : (
                            visitas.map((visita) => (
                                <tr key={visita.id} style={{ borderBottom: '1px solid #333', background: visita.focoEncontrado ? '#421d1d' : 'transparent' }}>
                                    <td style={{ padding: '12px' }}>{new Date(visita.dataVisita).toLocaleDateString('pt-BR')}</td>
                                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{visita.bairro}</td>
                                    <td style={{ padding: '12px' }}>{visita.endereco}</td>
                                    <td style={{ padding: '12px' }}>
                                        {visita.focoEncontrado ? (
                                            <div>
                                                <span style={{ backgroundColor: '#dc3545', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block', marginBottom: '5px' }}>🚨 FOCO DETECTADO</span>
                                                <br />
                                                <small style={{ color: visita.statusAnalise === 'CONCLUIDO' ? '#28a745' : '#ffc107', fontWeight: 'bold' }}>
                                                    🔬 Laudo: {visita.statusAnalise === 'CONCLUIDO' ? visita.laudoLaboratorio : '⏳ Aguardando Análise'}
                                                </small>
                                            </div>
                                        ) : (
                                            <span style={{ backgroundColor: '#28a745', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>✅ Limpo</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '12px', color: '#ccc', fontSize: '14px' }}>{visita.observacoes || 'Sem observações'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <hr style={{ margin: '40px 0', borderColor: '#444' }} />
            
            {/* Botão chamando a função de logout segura */}
            <button onClick={handleLogout} style={{ padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '200px', fontWeight: 'bold' }}>
                Desconectar
            </button>
        </div>
    );
}