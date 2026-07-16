import React from 'react';
import FormularioBoletimBase from './FormularioBoletimBase';

export default function BoletimBloqueio({ setTelaAtual, solicitacaoId }) { // 🟢 Recebe o ID da tela anterior
    return (
        <FormularioBoletimBase 
            titulo="🚨 Novo Boletim - Execução de Bloqueio"
            subtitulo="Ação imediata de bloqueio mecânico/químico ao redor de casos suspeitos ou focos notificados"
            tipoBoletim="BLOQUEIO"
            solicitacaoId={solicitacaoId} // 🟢 Repassa o ID para o formulário base
            setTelaAtual={setTelaAtual}
        />
    );
}