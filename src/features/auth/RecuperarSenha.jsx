import { useState } from 'react';
import api from '../../core/api';
import './Autenticacao.css'; // 👈 Importando o arquivo de estilo unificado

export default function RecuperarSenha({ setTelaAtual }) {
    const [email, setEmail] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [status, setStatus] = useState('');
    const [carregando, setCarregando] = useState(false);

    const handleRecuperar = async (e) => {
        e.preventDefault();
        setMensagem('');
        setStatus('');
        setCarregando(true);

        try {
            await api.post('/usuarios/recuperar-senha', { email });

            setStatus('sucesso');
            setMensagem('✅ Se o e-mail estiver cadastrado, você receberá as instruções de recuperação em instantes.');
            setEmail('');

        } catch (error) {
            console.error(error);
            setStatus('erro');
            setMensagem('❌ Erro ao conectar com o servidor. Tente novamente mais tarde.');
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="auth-screen">

            {/* 🏞️ LADO ESQUERDO: Mantém a mesma consistência visual da imagem */}
            <div className="auth-side-image"></div>

            {/* 📝 LADO DIREITO: Painel de recuperação */}
            <div className="auth-side-form">
                <div className="auth-container">
                    <h2 className="auth-title">Recuperar Senha</h2>

                    <p className="auth-text">
                        Digite o e-mail associado à sua matrícula. Enviaremos as instruções para você redefinir seu acesso.
                    </p>

                    <form onSubmit={handleRecuperar} className="auth-form">
                        <div className="auth-group">
                            <label className="auth-label">E-mail Institucional ou Pessoal:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Ex: agente@gmail.com"
                                required
                                disabled={carregando}
                                className="auth-input"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={carregando}
                            className={`auth-btn ${carregando ? 'btn-disabled' : 'btn-submit'}`}
                        >
                            {carregando ? '⏳ Enviando solicitação...' : '✉️ Enviar Link de Recuperação'}
                        </button>
                    </form>

                    {mensagem && (
                        <div className={`auth-message ${status === 'sucesso' ? 'msg-success' : 'msg-error'}`}>
                            {mensagem}
                        </div>
                    )}

                    <div className="auth-footer">
                        <button
                            type="button"
                            onClick={() => { setTelaAtual('login'); setMensagem(''); }}
                            className="auth-link"
                        >
                            ⬅️ Voltar para a tela de Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}