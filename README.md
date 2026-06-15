//Arquitetura Baseada em Features / Domínios

src/
├── core/                        # Configurações globais e imutáveis da aplicação
│   ├── api.js                   # Instância do Axios/Fetch apontando para o Render
│   └── dbLocal.js               # Configuração e esquemas do Dexie (IndexedDB)
│
├── shared/                      # Elementos genéricos e sem regras de negócio
│   ├── components/              # Botões, Modais estruturais, Inputs simples, Spinners
│   └── utils/                   # Arquivos estáticos puros (dadosAgentes.js, dadosBairros.js)
│
├── features/                    # O coração do sistema (Dividido por contexto de negócio)
│   │
│   ├── auth/                    # Fluxo de Identificação Funcional
│   │   ├── pages/               # Login.jsx, Cadastro.jsx
│   │   └── hooks/               # useAuth.js (para gerenciar a matrícula logada)
│   │
│   ├── campo/                   # Universo do Agente de Campo (Foco Offline/Mobile)
│   │   ├── pages/               # CampoMenu.jsx, ResumoSemanal.jsx
│   │   ├── components/          # GridMatriz.jsx, SeletorFichaModal.jsx
│   │   └── hooks/               # useBoletim.js
│   │
│   ├── gestao/                  # Universo Web/Desktop (Relatórios e Laboratório)
│   │   ├── pages/               # GestaoDashboard.jsx, TecnicaDashboard.jsx
│   │   └── components/          # TabelaLaudo.jsx, GraficoProducao.jsx
│   │
│   ├── ovitrampas/              # Módulo Isolado de Monitoramento de Vetores
│   │   └── pages/               # OvitrampaDashboard.jsx
│   │
│   └── sync/                    # O Motor de Sincronização (O mais crítico!)
│       ├── components/          # HeartbeatIndicator.jsx (Indicador de Wi-Fi UVZ)
│       ├── services/            # Chamadas de PUSH e PULL em lote
│       └── hooks/               # useSyncEngine.js (Gerencia o estado de sincronia)
│
├── App.css
├── App.jsx
├── index.css
└── main.jsx

// LUPA DA ARQUITETURA

features/campo/
├── components/
│   └── SeletorFichaModal.jsx     # Componentes menores que só essa tela usa
│
├── hooks/
│   └── useResumoSemanal.js       # 🧠 O CORAÇÃO JS: Funções de clique, cálculos matemáticos,
│                                 # chamadas ao Dexie e estados (useState/useEffect) moram aqui.
│
├── pages/
│   └── ResumoSemanal.jsx         # 📺 SÓ A INTERFACE (O "HTML"): Fica um arquivo limpo, magro,
│                                 # focado apenas em renderizar as divs, botões e tabelas.
│
└── styles/
    └── ResumoSemanal.css         # 🎨 SÓ O ESTILO: Sai o CSS inline poluído e entra um arquivo limpo,
                                  # ou o uso de CSS Modules.