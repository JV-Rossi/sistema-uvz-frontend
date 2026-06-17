import { useState } from 'react';
// 🔗 Importa a lista global de agentes utilitária
import { listaAgentes } from '../../shared/utils/dadosAgentes'; 

export function useCadastroUsuario() {
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
        
        // 🧹 LIMPEZA DE DADOS: Remove acentos, cedilha e joga para maiúsculo
        const nomeTratado = formData.nomeCompleto
            .normalize("NFD") 
            .replace(/[\u0300-\u036f]/g, "") 
            .toUpperCase(); 
        
        // 1. FORMATAÇÃO COMPLETA PARA O BANCO DE DADOS
        const novoAgente = {
            id: Date.now(), // 🔑 Essencial para chave primária no mock
            nome: nomeTratado,
            matricula: formData.matricula,
            regional: formData.regional,
            email: formData.email,
            telefone: formData.telefone,
            sexo: formData.sexo,
            dataNascimento: formData.dataNascimento,
            nivelAcesso: formData.nivelAcesso,
            status: 'Ativo'
        };

        // 2. SINCRONIZAÇÃO COM O SEU ARQUIVO
        if (Array.isArray(listaAgentes)) {
            listaAgentes.push(novoAgente);
            console.log("Novo agente inserido na listaAgentes:", listaAgentes);
        } else {
            console.error("Erro: listaAgentes não foi encontrada.");
        }
        
        alert(`✅ Usuário ${formData.nomeCompleto} cadastrado com sucesso na Regional ${formData.regional}!`);
        
        // 3. LIMPA O FORMULÁRIO
        setFormData({
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
    };

    return {
        formData,
        handleInputChange,
        handleCadastrarUsuario
    };
}