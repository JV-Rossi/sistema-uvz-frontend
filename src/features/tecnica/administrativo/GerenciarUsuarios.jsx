import React, { useState, useEffect } from 'react';

// 🟢 IMPORTS COM CAMINHOS RELATIVOS CORRETOS
import api from '../../../core/api';
import './GerenciarUsuarios.css';

export default function GerenciarUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [usuarioEmEdicao, setUsuarioEmEdicao] = useState(null);

    // 🎯 Estado para armazenar o texto da barra de pesquisa
    const [termoBusca, setTermoBusca] = useState('');

    const [formulario, setFormulario] = useState({
        nomeCompleto: '',
        dataNascimento: '',
        sexo: '',
        telefone: '',
        regional: '',
        email: '',
        password: '',
        nivelAcesso: ''
    });

    useEffect(() => {
        carregarUsuarios();
    }, []);

    const carregarUsuarios = async () => {
        try {
            setCarregando(true);
            const response = await api.get('/usuarios');
            setUsuarios(response.data);
        } catch (error) {
            console.error("Erro ao carregar usuários administrativo:", error);
        } finally {
            setCarregando(false);
        }
    };

    // 🎯 Lógica que filtra a lista original baseada no que foi digitado (Nome ou Matrícula)
    const usuariosFiltrados = usuarios.filter((user) => {
        const busca = termoBusca.toLowerCase();
        const nome = user.nome ? user.nome.toLowerCase() : '';
        const matricula = user.matricula ? String(user.matricula) : '';

        return nome.includes(busca) || matricula.includes(busca);
    });

    const iniciarEdicao = (usuario) => {
        setUsuarioEmEdicao(usuario);

        const nivelFormatado = usuario.nivelAcesso ? usuario.nivelAcesso.toLowerCase() : 'agente_campo';

        setFormulario({
            nomeCompleto: usuario.nome || '',
            dataNascimento: usuario.dataNascimento || '',
            sexo: usuario.sexo || '',
            telefone: usuario.telefone || '',
            regional: usuario.regional || '',
            email: usuario.email || '',
            password: '',
            nivelAcesso: nivelFormatado
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormulario(prev => ({ ...prev, [name]: value }));
    };

    const handleSalvarAlteracao = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/usuarios/${usuarioEmEdicao.matricula}`, formulario);

            if (response.status === 200 || response.status === 204) {
                alert(`Cadastro de ${formulario.nomeCompleto} atualizado com sucesso no Supabase!`);
                setUsuarioEmEdicao(null);
                carregarUsuarios();
            }
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            alert("Falha ao salvar as modificações no servidor central.");
        }
    };

    return (
        <div>
            <header className="pb-3 mb-4 border-bottom header-bancada">
                <h1 className="text-weight-semi-bold mb-1 titulo-laboratorio" style={{ color: '#1351B4' }}>
                    <i className="fas fa-users-cog mr-2" aria-hidden="true"></i> Administração — Gerenciamento de Equipe
                </h1>
                <p className="mb-0 text-muted">Manutenção integral de perfis, dados cadastrais e níveis de segurança do ecossistema CVSA.</p>
            </header>

            {!usuarioEmEdicao ? (
                <div className="painel-administrative-largo">
                    {/* BARRA DE PESQUISA */}
                    <div className="container-busca-servidor">
                        <div className="wrapper-busca">
                            <i className="fas fa-search icone-lupa" aria-hidden="true"></i>
                            <input
                                id="buscaServidor"
                                type="text"
                                className="br-input"
                                placeholder="Buscar por Nome ou Matrícula..."
                                value={termoBusca}
                                onChange={(e) => setTermoBusca(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* 📋 VISÃO 1: TABELA DE FUNCIONÁRIOS */}
                    <div className="tabela-scroll-container">
                        <table className="tabela-tecnica">
                            <thead>
                                <tr>
                                    <th>Matrícula</th>
                                    <th>Nome Completo</th>
                                    <th>Regional</th>
                                    <th>Nível de Acesso</th>
                                    <th className="txt-center">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {carregando ? (
                                    <tr>
                                        <td colSpan="5" className="txt-center py-4">
                                            <i className="fas fa-spinner fa-spin mr-2"></i> Consultando base de servidores da nuvem...
                                        </td>
                                    </tr>
                                ) : usuariosFiltrados.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="txt-center text-muted py-4">
                                            {termoBusca !== ''
                                                ? `Nenhum servidor encontrado para "${termoBusca}".`
                                                : "Nenhum usuário localizado no banco de dados."}
                                        </td>
                                    </tr>
                                ) : (
                                    usuariosFiltrados.map((user) => (
                                        <tr key={user.matricula}>
                                            <td className="font-weight-bold id-amostra-destaque">{user.matricula}</td>
                                            <td>{user.nome}</td>
                                            <td>{user.regional || '---'}</td>
                                            <td>
                                                <span className={`badge-cargo ${user.nivelAcesso}`}>
                                                    {user.nivelAcesso?.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="txt-center">
                                                <button
                                                    className="br-button secondary small btn-tabela-analisar"
                                                    onClick={() => iniciarEdicao(user)}
                                                >
                                                    <i className="fas fa-user-edit mr-1" aria-hidden="true"></i> Alterar Cadastro
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* 📝 VISÃO 2: FORMULÁRIO DE ALTERAÇÃO COMPLETA */
                <div className="form-wrapper">
                    <button className="toggle-avancado-btn mb-4 btn-voltar-painel" onClick={() => setUsuarioEmEdicao(null)}>
                        <i className="fas fa-arrow-left mr-2" aria-hidden="true"></i> Cancelar e Voltar para Lista
                    </button>

                    <form onSubmit={handleSalvarAlteracao}>

                        {/* SEÇÃO 1: Informações Pessoais */}
                        <h3 className="sessao-titulo text-weight-semi-bold mt-0 mb-3">Informações Pessoais</h3>
                        <div className="grid-form">
                            <div className="form-group span-2">
                                <label htmlFor="nomeCompleto">Nome Completo <span className="text-danger">*</span></label>
                                <input
                                    id="nomeCompleto" className="br-input" type="text"
                                    name="nomeCompleto" required value={formulario.nomeCompleto} onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="dataNascimento">Data de Nascimento <span className="text-danger">*</span></label>
                                <input
                                    id="dataNascimento" className="br-input" type="date"
                                    name="dataNascimento" required value={formulario.dataNascimento} onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="sexo">Sexo <span className="text-danger">*</span></label>
                                <select id="sexo" className="br-select" name="sexo" required value={formulario.sexo} onChange={handleInputChange}>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Feminino">Feminino</option>
                                    <option value="Outro">Outro</option>
                                </select>
                            </div>

                            <div className="form-group span-2">
                                <label htmlFor="telefone">Telefone para Contato <span className="text-danger">*</span></label>
                                <input
                                    id="telefone" className="br-input" type="tel"
                                    name="telefone" required value={formulario.telefone} onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="regional">Regional de Atuação <span className="text-danger">*</span></label>
                                <select id="regional" className="br-select" name="regional" required value={formulario.regional} onChange={handleInputChange}>
                                    <option value="Norte">Norte</option>
                                    <option value="Sul">Sul</option>
                                    <option value="Leste">Leste</option>
                                    <option value="Oeste">Oeste</option>
                                    <option value="Sede/Centro">Sede/Centro</option>
                                </select>
                            </div>
                        </div>

                        <hr className="divisor-form" style={{ margin: '24px 0', borderTop: '1px solid #ccc' }} />

                        {/* SEÇÃO 2: Credenciais e Segurança */}
                        <h3 className="sessao-titulo text-weight-semi-bold mb-3">Credenciais de Acesso</h3>
                        <div className="grid-form">
                            <div className="form-group span-2">
                                <label htmlFor="email">E-mail <span className="text-danger">*</span></label>
                                <input
                                    id="email" className="br-input" type="email"
                                    name="email" required value={formulario.email} onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="matricula">Matrícula (Login - Imutável)</label>
                                <input
                                    id="matricula" className="br-input" type="text"
                                    disabled value={usuarioEmEdicao.matricula} style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Alterar Senha (Opcional)</label>
                                <input
                                    id="password" className="br-input" type="password"
                                    name="password" placeholder="Deixe em branco para manter a atual"
                                    value={formulario.password} onChange={handleInputChange} minLength="6"
                                />
                            </div>

                            <div className="form-group span-2">
                                <label>Nível de Acesso <span className="text-danger">*</span></label>
                                <div className="radio-group mt-2">
                                    <div className="br-radio">
                                        <input
                                            id="acesso-agente" type="radio" name="nivelAcesso" value="agente_campo"
                                            checked={formulario.nivelAcesso === 'agente_campo'} onChange={handleInputChange}
                                        />
                                        <label htmlFor="acesso-agente">Agente de Campo</label>
                                    </div>
                                    <div className="br-radio">
                                        <input
                                            id="acesso-tecnico" type="radio" name="nivelAcesso" value="tecnico"
                                            checked={formulario.nivelAcesso === 'tecnico'} onChange={handleInputChange}
                                        />
                                        <label htmlFor="acesso-tecnico">Técnico</label>
                                    </div>
                                    <div className="br-radio">
                                        <input
                                            id="acesso-gestao" type="radio" name="nivelAcesso" value="gestao"
                                            checked={formulario.nivelAcesso === 'gestao'} onChange={handleInputChange}
                                        />
                                        <label htmlFor="acesso-gestao">Gestão</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-actions mt-4 pt-3 border-top">
                            <button type="submit" className="br-button primary block-mobile">
                                <i className="fas fa-save mr-2" aria-hidden="true"></i> Salvar Alterações no Supabase
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}