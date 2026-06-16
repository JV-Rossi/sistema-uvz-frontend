import { useState } from 'react';

export function useCadastroUsuario() {
    // 1. ESTADO UNIFICADO DO FORMULÁRIO
    const [formData, setFormData] = useState({
        nomeCompleto: '',
        email: '',
        dataNascimento: '',
        sexo: '',
        matricula: '',
        senha: '',
        nivelAcesso: 'agente_campo' // Padrão selecionado
    });

    // 2. FUNÇÃO PARA ATUALIZAR OS CAMPOS DINAMICAMENTE
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 3. FUNÇÃO DE SALVAMENTO
    const handleCadastrarUsuario = (e) => {
        e.preventDefault();
        
        // Aqui entrará a integração com o Dexie.js (banco de dados offline) em breve
        console.log("Usuário pronto para salvar:", formData);
        
        alert(`✅ Usuário ${formData.nomeCompleto} (Matrícula: ${formData.matricula}) cadastrado com sucesso com nível de ${formData.nivelAcesso}!`);
        
        // Limpa o formulário após salvar
        setFormData({
            nomeCompleto: '', 
            email: '', 
            dataNascimento: '', 
            sexo: '', 
            matricula: '', 
            senha: '', 
            nivelAcesso: 'agente_campo'
        });
    };

    return {
        formData,
        handleInputChange,
        handleCadastrarUsuario
    };
}