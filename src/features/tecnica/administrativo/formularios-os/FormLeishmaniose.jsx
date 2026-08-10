import React from 'react';

export default function FormLeishmaniose({ ambienteLeish, setAmbienteLeish }) {
    return (
        <div className="os-subform-card mt-4 border-top pt-3">
            <div className="br-message is-warning mb-4">
                <div className="icon"><i className="fas fa-exclamation-triangle fa-lg"></i></div>
                <div className="content">
                    <span className="message-title text-weight-semi-bold">Triagem de Solicitação:</span>
                    <span className="message-body"> Coleta de dados iniciais para agendamento do Teste de Leishmaniose.</span>
                </div>
            </div>

            {/* --- DADOS DO AMBIENTE E TRIAGEM --- */}
            <h4 className="text-weight-semi-bold text-secondary mb-3">
                <i className="fas fa-home mr-2"></i>1. Informações do Imóvel e Triagem
            </h4>

            <div className="leish-subcard">
                <div className="os-grid">
                    <div className="br-input os-grid-full">
                        <label>Ponto de Referência do Imóvel <span className="text-danger">*</span></label>
                        <input 
                            type="text" 
                            placeholder="Ex: Próximo ao mercado X, em frente à igreja Y" 
                            value={ambienteLeish?.referencia || ''} 
                            onChange={e => setAmbienteLeish({ ...ambienteLeish, referencia: e.target.value })} 
                        />
                    </div>

                    <div className="br-input">
                        <label>Quantidade de Cães <span className="text-danger">*</span></label>
                        <input 
                            type="number" 
                            min="0" 
                            value={ambienteLeish?.qtdCaes || ''} 
                            onChange={e => setAmbienteLeish({ ...ambienteLeish, qtdCaes: e.target.value })} 
                        />
                    </div>

                    <div className="br-input">
                        <label>Quantidade de Gatos <span className="text-danger">*</span></label>
                        <input 
                            type="number" 
                            min="0" 
                            value={ambienteLeish?.qtdGatos || ''} 
                            onChange={e => setAmbienteLeish({ ...ambienteLeish, qtdGatos: e.target.value })} 
                        />
                    </div>

                    <div className="br-input os-grid-full">
                        <label>Outros Animais no Local (Especificar)</label>
                        <input 
                            type="text" 
                            placeholder="Ex: 2 cavalos, galinhas..." 
                            value={ambienteLeish?.outrosAnimais || ''} 
                            onChange={e => setAmbienteLeish({ ...ambienteLeish, outrosAnimais: e.target.value })} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}