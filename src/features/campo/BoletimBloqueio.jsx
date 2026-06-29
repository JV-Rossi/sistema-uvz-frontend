import React from 'react';
import FormularioBoletimBase from './FormularioBoletimBase';

export default function BoletimBloqueio({ setTelaAtual }) {
    return (
        <FormularioBoletimBase 
            titulo="🚨 Novo Boletim - Execução de Bloqueio"
            subtitulo="Ação imediata de bloqueio mecânico/químico ao redor de casos suspeitos ou focos notificados"
            tipoBoletim="BLOQUEIO"
            setTelaAtual={setTelaAtual}
        />
    );
}