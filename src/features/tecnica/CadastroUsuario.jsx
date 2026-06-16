import React from 'react';
import { useCadastroUsuario } from './useCadastroUsuario';
import './CadastroUsuario.css';

export default function CadastroUsuario({ setTelaAtual }) {
    // Puxando os dados e funções lá do nosso arquivo JS (Motor)
    const { 
        formData, 
        handleInputChange, 
        handleCadastrarUsuario 
    } = useCadastroUsuario();

    return (
        <div className="container-cadastro-user">
            <button className="btn-voltar" onClick={() => setTelaAtual('menu_principal')}>
                ⬅️ Voltar
            </button>

            <div className="header-cadastro">
                <h1 className="titulo-cadastro">👤 Cadastro de Equipe</h1>
                <p className="subtitulo-cadastro">Registro de novos usuários no sistema UVZ</p>
            </div>

            <div className="card-formulario">
                <form onSubmit={handleCadastrarUsuario}>
                    
                    {/* BLOCO 1: Informações Pessoais */}
                    <h3 className="sessao-titulo">Informações Pessoais</h3>
                    <div className="grid-form">
                        <div className="form-group span-2">
                            <label>Nome Completo *</label>
                            <input 
                                type="text" name="nomeCompleto" required
                                placeholder="Ex: Carlos Mendes"
                                value={formData.nomeCompleto} onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Data de Nascimento *</label>
                            <input 
                                type="date" name="dataNascimento" required
                                value={formData.dataNascimento} onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Sexo *</label>
                            <select name="sexo" required value={formData.sexo} onChange={handleInputChange}>
                                <option value="" disabled>Selecione...</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                                <option value="Outro">Outro</option>
                            </select>
                        </div>
                    </div>

                    <hr className="divisor-form" />

                    {/* BLOCO 2: Acesso ao Sistema */}
                    <h3 className="sessao-titulo">Credenciais de Acesso</h3>
                    <div className="grid-form">
                        <div className="form-group span-2">
                            <label>E-mail *</label>
                            <input 
                                type="email" name="email" required
                                placeholder="usuario@uvz.com.br"
                                value={formData.email} onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Matrícula (Login) *</label>
                            <input 
                                type="text" name="matricula" required
                                placeholder="Ex: 123456"
                                value={formData.matricula} onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Senha *</label>
                            <input 
                                type="password" name="senha" required
                                placeholder="Mínimo 6 caracteres"
                                minLength="6"
                                value={formData.senha} onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group span-2">
                            <label>Nível de Acesso *</label>
                            <div className="radio-group">
                                <label className="radio-label">
                                    <input 
                                        type="radio" name="nivelAcesso" value="agente_campo"
                                        checked={formData.nivelAcesso === 'agente_campo'} onChange={handleInputChange} 
                                    />
                                    Agente de Campo
                                </label>
                                <label className="radio-label">
                                    <input 
                                        type="radio" name="nivelAcesso" value="tecnico"
                                        checked={formData.nivelAcesso === 'tecnico'} onChange={handleInputChange} 
                                    />
                                    Técnico
                                </label>
                                <label className="radio-label gestao">
                                    <input 
                                        type="radio" name="nivelAcesso" value="gestao"
                                        checked={formData.nivelAcesso === 'gestao'} onChange={handleInputChange} 
                                    />
                                    Gestão
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-salvar-usuario">
                            💾 Registrar Usuário
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}