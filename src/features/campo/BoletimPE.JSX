import React from 'react';
import FormularioBoletimBase from './FormularioBoletimBase';

export default function BoletimPE({ setTelaAtual }) {
    const categoriasPE = [
        { value: 'PE_BORRACHARIA', label: 'Borracharia (PE-B)' },
        { value: 'PE_FERRO_VELHO', label: 'Ferro-Velho (PE-FV)' },
        { value: 'PE_CEMITERIO', label: 'Cemitério (PE-C)' },
        { value: 'PE_OUTROS', label: 'Outro Ponto Estratégico' }
    ];

    return (
        <FormularioBoletimBase 
            titulo="🏭 Novo Boletim - Pontos Estratégicos (PE)"
            subtitulo="Inspeção quinzenal focada em depósitos críticos e de alta vulnerabilidade biológica"
            tipoBoletim="PE"
            setTelaAtual={setTelaAtual}
            opcoesCategoriasCustomizadas={categoriasPE}
        />
    );
}