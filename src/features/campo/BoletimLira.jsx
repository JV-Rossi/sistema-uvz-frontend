import React from 'react';
import FormularioBoletimBase from './FormularioBoletimBase';

export default function BoletimLira({ setTelaAtual }) {
    return (
        <FormularioBoletimBase 
            titulo="📋 Novo Boletim de Campo - Lira"
            subtitulo="Visita para diagnóstico rápido de regiões críticas."
            tipoBoletim="LIRA"
            setTelaAtual={setTelaAtual}
        />
    );
}