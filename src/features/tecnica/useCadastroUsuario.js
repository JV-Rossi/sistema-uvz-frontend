import { useState } from 'react';

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

    // Atualiza os estados dos inputs enquanto o usuário digita
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCadastrarUsuario = (e) => {
        e.preventDefault();

        // 🧹 Limpeza de dados exigida para a UVZ
        const nomeTratado = formData.nomeCompleto
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toUpperCase();

        // 🔗 DADOS FORMATADOS EXATAMENTE COMO O SEU Usuario.java ESPERA
        const usuarioParaOJava = {
            nome: nomeTratado,
            matricula: formData.matricula,
            senha: formData.senha, // 🟢 CORRIGIDO: de 'password' para 'senha' (igual ao Java)
            regional: formData.regional,
            email: formData.email,
            telefone: formData.telefone,
            sexo: formData.sexo,
            dataNascimento: formData.dataNascimento,
            status: 'Ativo',
            // Envia a string formatada direto para o campo private String nivelAcesso;
            nivelAcesso: formData.nivelAcesso === 'agente_campo' ? 'AGENTE_CAMPO' : formData.nivelAcesso.toUpperCase()
        };

        // 🚀 ENDPOINT DE CONEXÃO
        // Se for testar direto no Render: mude para 'https://seu-backend.onrender.com/api/usuarios'
        const URL_API = 'https://sistema-uvz-backend.onrender.com/api/usuarios';

        fetch(URL_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuarioParaOJava)
        })
            .then(response => {
                if (response.ok) {
                    alert(`✅ Usuário ${nomeTratado} cadastrado com sucesso e salvo no Supabase!`);

                    // Limpa o formulário após o sucesso
                    setFormData({
                        nomeCompleto: '', email: '', dataNascimento: '', sexo: '',
                        telefone: '', matricula: '', senha: '', nivelAcesso: 'agente_campo', regional: ''
                    });
                } else {
                    alert('❌ O servidor Java recusou o cadastro. Verifique os logs do IntelliJ.');
                }
            })
            .catch(error => {
                console.error('Erro de conexão com a API:', error);
                alert('❌ Não foi possível conectar ao servidor Spring Boot. Ele está ligado?');
            });
    };

    return {
        formData,
        handleInputChange,
        handleCadastrarUsuario
    };
}