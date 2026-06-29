import React from 'react';
import FormularioBoletimBase from './FormularioBoletimBase';

export default function BoletimRotina({ setTelaAtual }) {
    return (
        <FormularioBoletimBase 
            titulo="📋 Novo Boletim de Campo - Rotina"
            subtitulo="Visita domiciliar regular para controle vetorial e eliminação de criadouros"
            tipoBoletim="ROTINA"
            setTelaAtual={setTelaAtual}
        />
    );
}