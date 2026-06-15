import React, { useState } from 'react';
import api from '../../core/api';

export default function OvitrampaDashboard({ setTelaAtual }) {
    // Dados simulados para o mockup visual
    const [moradores] = useState([
        { id: 1, nome: 'Maria Oliveira', endereco: 'Rua das Flores, 105', quarteirao: '012A', armadilha: 'OV-098', status: 'INSTALADA' },
        { id: 2, nome: 'José dos Santos', endereco: 'Av. Central, 440', quarteirao: '005', armadilha: 'OV-042', status: 'AGUARDANDO_COLETA_2' },
        { id: 3, nome: 'Ana Souza', endereco: 'Rua Cuiabá, 12', quarteirao: '022', armadilha: 'OV-115', status: 'PRONTA_LEITURA' },
        { id: 4, nome: 'Carlos Lima', endereco: 'Travessa 3, s/n', quarteirao: '014', armadilha: '-', status: 'SEM_ARMADILHA' },
    ]);

    // Função para renderizar a etiqueta (badge) colorida baseada no status
    const renderizarStatus = (status) => {
        const estilos = {
            INSTALADA: { bg: 'rgba(76, 175, 80, 0.2)', cor: '#81c784', texto: '🟢 Instalada' },
            AGUARDANDO_COLETA_2: { bg: 'rgba(255, 152, 0, 0.2)', cor: '#ffb74d', texto: '🟡 Aguardando 2ª Coleta' },
            PRONTA_LEITURA: { bg: 'rgba(33, 150, 243, 0.2)', cor: '#64b5f6', texto: '🔵 Pronta p/ Leitura' },
            SEM_ARMADILHA: { bg: 'rgba(158, 158, 158, 0.2)', cor: '#e0e0e0', texto: '⚪ Sem Armadilha Ativa' }
        };
        const config = estilos[status];
        return (
            <span style={{ backgroundColor: config.bg, color: config.cor, padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                {config.texto}
            </span>
        );
    };

    // Função que recebe o ID do morador e remove da lista
    const removerMorador = (id) => {
        const confirmacao = window.confirm("Tem certeza que deseja remover este morador?");

        if (confirmacao) {
            // O filter cria uma lista nova com todo mundo, EXCETO o cara que tem esse ID
            const novaLista = moradores.filter((morador) => morador.id !== id);
            setMoradores(novaLista); // Atualiza a tela sem o morador
        }
    };

    return (
        <div style={{ backgroundColor: '#121212', color: '#e0e0e0', minHeight: '100vh', padding: '40px', fontFamily: 'system-ui, sans-serif' }}>

            <button
                onClick={() => setTelaAtual('campo_menu')}
                style={{
                    background: '#333',
                    color: '#fff',
                    border: '1px solid #444',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px'
                }}
            >
                ⬅️ Voltar
            </button>

            {/* Cabeçalho da Página */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ color: '#ffffff', margin: '0 0 5px 0', fontSize: '24px' }}>🦟 Monitoramento de Ovitrampas</h1>
                    <p style={{ color: '#9e9e9e', margin: 0, fontSize: '14px' }}>Unidade de Vigilância em Zoonoses - Cuiabá</p>
                </div>
                <button style={{ backgroundColor: '#4caf50', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}>
                    ➕ Novo Cadastro de Imóvel
                </button>
            </div>

            {/* Card Principal - Tabela de Gestão */}
            <div style={{ backgroundColor: '#1e1e1e', borderRadius: '12px', padding: '25px', boxShadow: '0 8px 16px rgba(0,0,0,0.5)', border: '1px solid #333' }}>

                {/* Barra de Filtros */}
                <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                    <input type="text" placeholder="🔍 Buscar por Bairro..." style={estiloInputFiltro} />
                    <input type="text" placeholder="Quarteirão" style={{ ...estiloInputFiltro, width: '120px' }} />
                    <select style={estiloInputFiltro}>
                        <option>Todos os Status</option>
                        <option>Instaladas</option>
                        <option>Prontas para Leitura</option>
                    </select>
                </div>

                {/* Tabela de Dados */}
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #333', textAlign: 'left', color: '#9e9e9e', fontSize: '13px', textTransform: 'uppercase' }}>
                            <th style={{ padding: '15px 10px' }}>Morador</th>
                            <th style={{ padding: '15px 10px' }}>Endereço</th>
                            <th style={{ padding: '15px 10px' }}>Quart.</th>
                            <th style={{ padding: '15px 10px' }}>Armadilha</th>
                            <th style={{ padding: '15px 10px' }}>Status do Ciclo</th>
                            <th style={{ padding: '15px 10px', textAlign: 'right' }}>Ações Rápidas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {moradores.map((m) => (
                            <tr key={m.id} style={{ borderBottom: '1px solid #2a2a2a' }}>
                                <td style={{ padding: '15px 10px', fontWeight: 'bold', color: '#fff' }}>{m.nome}</td>
                                <td style={{ padding: '15px 10px', color: '#bbb' }}>{m.endereco}</td>
                                <td style={{ padding: '15px 10px', color: '#bbb' }}>{m.quarteirao}</td>
                                <td style={{ padding: '15px 10px', color: '#4fc3f7', fontWeight: 'bold' }}>{m.armadilha}</td>
                                <td style={{ padding: '15px 10px' }}>{renderizarStatus(m.status)}</td>
                                <td style={{ padding: '15px 10px', textAlign: 'right' }}>

                                    {/* Botões Condicionais baseados no Status */}
                                    {m.status === 'INSTALADA' && (
                                        <button style={estiloBotaoAcao}>📥 Registrar 1ª Coleta</button>
                                    )}
                                    {m.status === 'AGUARDANDO_COLETA_2' && (
                                        <button style={estiloBotaoAcao}>📥 Registrar 2ª Coleta</button>
                                    )}
                                    {m.status === 'PRONTA_LEITURA' && (
                                        <button style={{ ...estiloBotaoAcao, backgroundColor: '#0288d1', color: '#fff' }}>🔬 Lançar Ovos</button>
                                    )}
                                    {m.status === 'SEM_ARMADILHA' && (
                                        <button style={{ ...estiloBotaoAcao, backgroundColor: '#424242' }}>🛠️ Instalar</button>
                                    )}

                                    {/* 🔴 BOTÃO DE REMOVER */}
                                    <button
                                        onClick={() => removerMorador(m.id)}
                                        style={{
                                            backgroundColor: '#e74c3c',
                                            color: '#fff',
                                            border: 'none',
                                            padding: '6px 10px',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            marginLeft: '10px', // Dá um respiro entre o botão de ação e a lixeira
                                            fontSize: '14px'
                                        }}
                                        title="Remover Morador"
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Estilos auxiliares para deixar o código mais limpo
const estiloInputFiltro = {
    padding: '10px 15px',
    backgroundColor: '#2c2c2c',
    border: '1px solid #444',
    borderRadius: '8px',
    color: '#fff',
    outline: 'none',
    fontSize: '14px'
};

const estiloBotaoAcao = {
    backgroundColor: '#333',
    color: '#fff',
    border: '1px solid #555',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
    transition: '0.2s'
};