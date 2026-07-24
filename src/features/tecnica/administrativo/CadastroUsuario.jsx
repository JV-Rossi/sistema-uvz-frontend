import React, { useState } from 'react';

// 🟢 IMPORT ATUALIZADO: Apontando para o CSS global em src/shared/components/
import '../../../shared/components/Formularios.css';

export default function CadastroUsuario({ setAbaAtiva }) {
    const [formData, setFormData] = useState({
        nomeCompleto: '',
        email: '',
        dataNascimento: '',
        sexo: '',
        telefone: '',
        matricula: '',
        senha: '',
        nivelAcesso: 'agente_campo',
        regional: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCadastrarUsuario = (e) => {
        e.preventDefault();

        const nomeTratado = formData.nomeCompleto
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toUpperCase();

        const usuarioParaOJava = {
            nome: nomeTratado,
            matricula: formData.matricula,
            senha: formData.senha,
            regional: formData.regional,
            email: formData.email,
            telefone: formData.telefone,
            sexo: formData.sexo,
            dataNascimento: formData.dataNascimento,
            status: 'Ativo',
            nivelAcesso: formData.nivelAcesso === 'agente_campo' ? 'AGENTE_CAMPO' : formData.nivelAcesso.toUpperCase()
        };

        const URL_API = 'https://sistema-uvz-backend.onrender.com/api/usuarios';

        fetch(URL_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuarioParaOJava)
        })
            .then(response => {
                if (response.ok) {
                    alert(`✅ Usuário ${nomeTratado} cadastrado com sucesso e salvo no Supabase!`);
                    setFormData({
                        nomeCompleto: '', email: '', dataNascimento: '', sexo: '',
                        telefone: '', matricula: '', senha: '', nivelAcesso: 'agente_campo', regional: ''
                    });
                } else {
                    alert('❌ O servidor Java recusou o cadastro. Verifique os logs.');
                }
            })
            .catch(error => {
                console.error('Erro de conexão com a API:', error);
                alert('❌ Não foi possível conectar ao servidor Spring Boot.');
            });
    };

    return (
        /* 1. Envelope cinza externo (fundo suave) */
        <div className="os-wrapper">
            
            {/* 2. Container centralizado de 1000px */}
            <main className="os-content">
                
                {/* 3. Cabeçalho com o mesmo azul e respiro */}
                <header className="os-header">
                    <h1 className="text-weight-semi-bold os-title">
                        <i className="fas fa-user-plus mr-2" aria-hidden="true"></i> 
                        Cadastro de Equipe
                    </h1>
                    <p className="os-subtitle">
                        Registro de novos usuários e configuração de acessos no sistema CVSA.
                    </p>
                </header>

                {/* 4. Card Branco Elevado com sombra e borda suave */}
                <form onSubmit={handleCadastrarUsuario} className="os-main-card">
                    
                    {/* BLOCO 1: Informações Pessoais */}
                    <h3 className="text-weight-semi-bold os-section-title">1. Informações Pessoais</h3>
                    
                    <div className="os-grid">
                        <div className="br-input os-grid-full">
                            <label htmlFor="nomeCompleto">Nome Completo <span className="text-danger">*</span></label>
                            <input 
                                id="nomeCompleto"
                                type="text" name="nomeCompleto" required
                                placeholder="Ex: Carlos Mendes"
                                value={formData.nomeCompleto} onChange={handleInputChange}
                            />
                        </div>

                        <div className="br-input">
                            <label htmlFor="dataNascimento">Data de Nascimento <span className="text-danger">*</span></label>
                            <input 
                                id="dataNascimento"
                                type="date" name="dataNascimento" required
                                value={formData.dataNascimento} onChange={handleInputChange}
                            />
                        </div>

                        <div className="br-input">
                            <label htmlFor="sexo">Sexo <span className="text-danger">*</span></label>
                            <select id="sexo" className="br-select" name="sexo" required value={formData.sexo} onChange={handleInputChange}>
                                <option value="" disabled>Selecione...</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                                <option value="Outro">Outro</option>
                            </select>
                        </div>

                        <div className="br-input os-grid-full">
                            <label htmlFor="telefone">Telefone para Contato <span className="text-danger">*</span></label>
                            <input 
                                id="telefone"
                                type="tel" name="telefone" required
                                placeholder="Ex: (65) 99999-9999"
                                value={formData.telefone} onChange={handleInputChange}
                            />
                        </div>

                        <div className="br-input os-grid-full">
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

                    {/* BLOCO 2: Credenciais de Acesso */}
                    <h3 className="text-weight-semi-bold os-section-title">2. Credenciais de Acesso</h3>
                    
                    <div className="os-grid">
                        <div className="br-input os-grid-full">
                            <label htmlFor="email">E-mail <span className="text-danger">*</span></label>
                            <input 
                                id="email"
                                type="email" name="email" required
                                placeholder="usuario@uvz.com.br"
                                value={formData.email} onChange={handleInputChange}
                            />
                        </div>

                        <div className="br-input">
                            <label htmlFor="matricula">Matrícula (Login) <span className="text-danger">*</span></label>
                            <input 
                                id="matricula"
                                type="text" name="matricula" required
                                placeholder="Ex: 123456"
                                value={formData.matricula} onChange={handleInputChange}
                            />
                        </div>

                        <div className="br-input">
                            <label htmlFor="senha">Senha <span className="text-danger">*</span></label>
                            <input 
                                id="senha"
                                type="password" name="senha" required
                                placeholder="Mínimo 6 caracteres"
                                minLength="6"
                                value={formData.senha} onChange={handleInputChange}
                            />
                        </div>

                        <div className="br-input os-grid-full">
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

                    <div className="mt-5 pt-4 border-top d-flex gap-3">
                        <button type="submit" className="br-button primary">
                            <i className="fas fa-save mr-2" aria-hidden="true"></i> Registrar Usuário
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}