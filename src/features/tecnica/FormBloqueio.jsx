import React from 'react';

export default function FormBloqueio({ dadosBloqueio, setDadosBloqueio }) {
    return (
        <div className="mt-5 pt-3">
            <div className="br-message is-danger mb-4">
                <div className="icon"><i className="fas fa-biohazard fa-lg"></i></div>
                <div className="content">
                    <span className="message-title text-weight-semi-bold">Atenção Epidemiológica:</span>
                    <span className="message-body"> A solicitação de bloqueio de foco será enviada diretamente para a triagem do Responsável Técnico. Preencha os dados clínicos abaixo.</span>
                </div>
            </div>

            <h4 className="text-weight-semi-bold text-secondary mb-3">
                <i className="fas fa-user-injured mr-2"></i> Dados do Paciente e Localização
            </h4>
            
            {/* Reaproveitamos a classe leish-subcard que tem aquele fundo cinza suave */}
            <div className="leish-subcard">
                <div className="os-grid">
                    <div className="br-input os-grid-full">
                        <label>Ponto de Referência do Imóvel <span className="text-danger">*</span></label>
                        <input 
                            type="text" 
                            placeholder="Ex: Casa verde em frente à borracharia do Zé..."
                            value={dadosBloqueio.referencia} 
                            onChange={e => setDadosBloqueio({...dadosBloqueio, referencia: e.target.value})} 
                        />
                    </div>

                    <div className="br-input">
                        <label>Nome do Paciente (Se diferente do solicitante)</label>
                        <input 
                            type="text" 
                            placeholder="Nome de quem está com os sintomas"
                            value={dadosBloqueio.paciente} 
                            onChange={e => setDadosBloqueio({...dadosBloqueio, paciente: e.target.value})} 
                        />
                    </div>

                    <div className="br-input">
                        <label>Suspeita Clínica <span className="text-danger">*</span></label>
                        <select 
                            className="br-select" 
                            value={dadosBloqueio.suspeita} 
                            onChange={e => setDadosBloqueio({...dadosBloqueio, suspeita: e.target.value})}
                        >
                            <option value="">Selecione a arbovirose...</option>
                            <option value="Dengue">Dengue</option>
                            <option value="Zika">Zika Vírus</option>
                            <option value="Chikungunya">Chikungunya</option>
                        </select>
                    </div>

                    <div className="br-input">
                        <label>Início dos Sintomas <span className="text-danger">*</span></label>
                        <input 
                            type="date" 
                            value={dadosBloqueio.dataSintomas} 
                            onChange={e => setDadosBloqueio({...dadosBloqueio, dataSintomas: e.target.value})} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}