import { useState, useEffect } from 'react'; // <-- CERTIFIQUE-SE DE QUE OS DOIS ESTÃO AQUI!
import api from '../services/api';

export default function TecnicaDashboard() {
    // 🔐 GUARDA DE SEGURANÇA DA URL
    const cargoLogado = localStorage.getItem('userCargo');
    const usuarioNome = localStorage.getItem('userLogin');

    if (!cargoLogado || cargoLogado !== 'TECNICO') {
        window.location.href = '/';
        return null;
    }

    const [visitasPendentes, setVisitasPendentes] = useState([]);
    const [laudos, setLaudos] = useState({}); // Guarda o texto digitado para cada ID
    const [mensagem, setMensagem] = useState('');

    // Busca as visitas do banco
    const carregarVisitas = async () => {
        try {
            const response = await api.get('/visitas');
            // Filtra apenas as visitas onde um foco foi encontrado E a análise ainda está PENDENTE
            const pendentes = response.data.filter(v => v.focoEncontrado && v.statusAnalise !== 'CONCLUIDO');
            setVisitasPendentes(pendentes);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        carregarVisitas();
    }, []);

    // Atualiza o estado do texto do laudo dinamicamente
    const handleMudarTextoLaudo = (id, valor) => {
        setLaudos(prev => ({ ...prev, [id]: valor }));
    };

    // Envia o laudo para o Java
    const handleSalvarLaudo = async (id) => {
        const laudoTexto = laudos[id];
        if (!laudoTexto) return alert('Por favor, digite o resultado do laudo antes de salvar.');

        try {
            await api.put(`/visitas/${id}/laudo`, { laudoLaboratorio: laudoTexto });
            setMensagem('🔬 Laudo técnico salvo com sucesso!');
            carregarVisitas(); // Recarrega a lista para sumir com o item concluído

            setTimeout(() => setMensagem(''), 3000);
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar o laudo.');
        }
    };

    // 🚪 FUNÇÃO PARA DESCONECTAR LIMPANDO A MEMÓRIA DO NAVEGADOR
    const handleLogout = () => {
        localStorage.clear();       // Apaga os dados salvos (cargo, login, etc.)
        window.location.href = '/'; // Chuta de volta para a tela de login
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto', color: '#fff' }}>
            <div style={{ marginBottom: '20px' }}>
                <h1>🔬 Painel da Equipe Técnica - Laboratório CVSA</h1>
                <p style={{ color: '#aaa' }}>Análise microscópica de vetores e emissão de laudos oficiais</p>
                {usuarioNome && <p style={{ color: '#007bff', fontSize: '14px', margin: '5px 0 0 0' }}>👤 Técnico: {usuarioNome}</p>}
            </div>

            {mensagem && <p style={{ backgroundColor: '#28a745', padding: '10px', borderRadius: '4px', textAlign: 'center', fontWeight: 'bold' }}>{mensagem}</p>}

            <div style={{ marginTop: '20px' }}>
                <h3>📥 Amostras Pendentes de Análise ({visitasPendentes.length})</h3>

                {visitasPendentes.length === 0 ? (
                    <p style={{ color: '#28a745', fontWeight: 'bold', background: '#222', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                        🎉 Excelente! Não há amostras de focos pendentes no momento.
                    </p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {visitasPendentes.map((visita) => (
                            <div key={visita.id} style={{ background: '#222', padding: '15px', borderRadius: '8px', borderLeft: '5px solid #dc3545', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
                                <div style={{ flex: 1 }}>
                                    <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#aaa' }}>📍 Data da Coleta: {new Date(visita.dataVisita).toLocaleDateString('pt-BR')}</p>
                                    <strong style={{ fontSize: '18px', color: '#dc3545' }}>{visita.bairro}</strong>
                                    <p style={{ margin: '5px 0 0 0', color: '#eee' }}>{visita.endereco}</p>
                                    {/* 🛠️ CORRIGIDO AQUI: De 'italic: true' para 'fontStyle: 'italic'' */}
                                    <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#ffc107', fontStyle: 'italic' }}>⚠️ Obs do Agente: "{visita.observacoes || 'Sem observações'}"</p>
                                </div>

                                {/* Campo de input e botão para o Biólogo preencher */}
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <input
                                        type="text"
                                        placeholder="Ex: Aedes aegypti positivo"
                                        value={laudos[visita.id] || ''}
                                        onChange={(e) => handleMudarTextoLaudo(visita.id, e.target.value)}
                                        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #444', background: '#333', color: '#fff', width: '220px' }}
                                    />
                                    <button onClick={() => handleSalvarLaudo(visita.id)} style={{ padding: '10px 15px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                                        Salvar Laudo
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <hr style={{ margin: '40px 0', borderColor: '#444' }} />

            <button onClick={handleLogout} style={{ padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '200px', fontWeight: 'bold' }}>
                Desconectar
            </button>
        </div>
    );
}