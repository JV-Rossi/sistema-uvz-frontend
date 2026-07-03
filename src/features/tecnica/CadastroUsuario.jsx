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
            
            <div className="header-cadastro pb-3 mb-4 border-bottom">
                <h1 className="titulo-cadastro text-weight-semi-bold mb-1" style={{ color: '#1351B4' }}>
                    <i className="fas fa-user-plus mr-2" aria-hidden="true"></i> 
                    Cadastro de Equipe
                </h1>
                <p className="subtitulo-cadastro mb-0" style={{ color: '#555' }}>
                    Registro de novos usuários e configuração de acessos no sistema CVSA.
                </p>
            </div>

            <div className="form-wrapper">
                <form onSubmit={handleCadastrarUsuario}>
                    
                    {/* BLOCO 1: Informações Pessoais */}
                    <h3 className="sessao-titulo text-weight-semi-bold mt-0 mb-3">Informações Pessoais</h3>
                    <div className="grid-form">
                        <div className="form-group span-2">
                            <label htmlFor="nomeCompleto">Nome Completo <span className="text-danger">*</span></label>
                            <input 
                                id="nomeCompleto"
                                className="br-input"
                                type="text" name="nomeCompleto" required
                                placeholder="Ex: Carlos Mendes"
                                value={formData.nomeCompleto} onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="dataNascimento">Data de Nascimento <span className="text-danger">*</span></label>
                            <input 
                                id="dataNascimento"
                                className="br-input"
                                type="date" name="dataNascimento" required
                                value={formData.dataNascimento} onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="sexo">Sexo <span className="text-danger">*</span></label>
                            <select id="sexo" className="br-select" name="sexo" required value={formData.sexo} onChange={handleInputChange}>
                                <option value="" disabled>Selecione...</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                                <option value="Outro">Outro</option>
                            </select>
                        </div>

                        <div className="form-group span-2">
                            <label htmlFor="telefone">Telefone para Contato <span className="text-danger">*</span></label>
                            <input 
                                id="telefone"
                                className="br-input"
                                type="tel" name="telefone" required
                                placeholder="Ex: (65) 99999-9999"
                                value={formData.telefone} onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="regional">Regional de Atuação <span className="text-danger">*</span></label>
                            <select id="regional" className="br-select" name="regional" required value={formData.regional} onChange={handleInputChange}>
                                <option value="" disabled>Selecione...</option>
                                <option value="Norte">Norte</option>
                                <option value="Sul">Sul</option>
                                <option value="Leste">Leste</option>
                                <option value="Oeste">Oeste</option>
                                <option value="Sede/Centro">Sede/Centro</option>
                            </select>
                        </div>
                    </div>

                    <hr className="divisor-form" />

                    {/* BLOCO 2: Acesso ao Sistema */}
                    <h3 className="sessao-titulo text-weight-semi-bold mb-3">Credenciais de Acesso</h3>
                    <div className="grid-form">
                        <div className="form-group span-2">
                            <label htmlFor="email">E-mail <span className="text-danger">*</span></label>
                            <input 
                                id="email"
                                className="br-input"
                                type="email" name="email" required
                                placeholder="usuario@uvz.com.br"
                                value={formData.email} onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="matricula">Matrícula (Login) <span className="text-danger">*</span></label>
                            <input 
                                id="matricula"
                                className="br-input"
                                type="text" name="matricula" required
                                placeholder="Ex: 123456"
                                value={formData.matricula} onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="senha">Senha <span className="text-danger">*</span></label>
                            <input 
                                id="senha"
                                className="br-input"
                                type="password" name="senha" required
                                placeholder="Mínimo 6 caracteres"
                                minLength="6"
                                value={formData.senha} onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group span-2">
                            <label>Nível de Acesso <span className="text-danger">*</span></label>
                            <div className="radio-group mt-2">
                                <div className="br-radio">
                                    <input 
                                        id="acesso-agente"
                                        type="radio" name="nivelAcesso" value="agente_campo"
                                        checked={formData.nivelAcesso === 'agente_campo'} onChange={handleInputChange} 
                                    />
                                    <label htmlFor="acesso-agente">Agente de Campo</label>
                                </div>
                                <div className="br-radio">
                                    <input 
                                        id="acesso-tecnico"
                                        type="radio" name="nivelAcesso" value="tecnico"
                                        checked={formData.nivelAcesso === 'tecnico'} onChange={handleInputChange} 
                                    />
                                    <label htmlFor="acesso-tecnico">Técnico</label>
                                </div>
                                <div className="br-radio">
                                    <input 
                                        id="acesso-gestao"
                                        type="radio" name="nivelAcesso" value="gestao"
                                        checked={formData.nivelAcesso === 'gestao'} onChange={handleInputChange} 
                                    />
                                    <label htmlFor="acesso-gestao">Gestão</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions mt-4 pt-3 border-top">
                        <button type="submit" className="br-button primary block-mobile">
                            <i className="fas fa-save mr-2" aria-hidden="true"></i> Registrar Usuário
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}