# 🦟 Sistema UVZ - Gestão de Combate a Endemias

![Status do Projeto](https://img.shields.io/badge/Status-Em%20Desenvolvimento-green)
![React](https://img.shields.io/badge/Frontend-React%20%7C%20Vite-61DAFB?logo=react&logoColor=black)
![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%20%7C%20Java-6DB33F?logo=spring&logoColor=white)

## 📌 Sobre o Projeto

O **Sistema CVSA** é uma aplicação Full-Stack desenvolvida para modernizar e automatizar o fluxo de trabalho dos Agentes de Combate a Endemias (ACE) e equipe Técnica (Biólogos, Médicos Veterinários, Administrativos e Gestão) na Coordenadoria de Vigilância em Saúde Ambiental (CVSA) de Cuiabá - MT. 

O sistema substitui o uso de planilhas manuais e boletins de papel por uma plataforma web modular, estruturada em **três níveis de acesso (RBAC)** que refletem a hierarquia e o fluxo de dados real da unidade de saúde:

* **Nível 1 (Operacional / Campo):** Interface *mobile-first* focada no Agente de Endemias. Permite o registro ágil de visitas domiciliares, solicitação de bloqueios de focos, controle de Pontos Estratégicos (PE) e o monitoramento geoespacial das armadilhas (Ovitrampas).
* **Nível 2 (Técnico e Administrativo):** Interface *desktop* dedicada à equipe de retaguarda e laboratório. Responsável pelo tratamento dos dados coletados em campo, gestão de cadastros de servidores, controle de estoque de insumos (larvicidas e vacinas) e consolidação de resultados laboratoriais (como a contagem de ovos).
* **Nível 3 (Estratégico / Gestão):** Painel de controle (Dashboard) voltado para a coordenação. Permite o monitoramento de KPIs (Indicadores de Performance), análise de produtividade das equipes, visualização do andamento das rotas e a detecção rápida de gargalos ou anomalias em toda a esteira de trabalho dos níveis anteriores.

## 🎯 O Problema Resolvido

A operação tradicional de vigilância em saúde sofre com a extrema fragmentação da informação: dados coletados em pranchetas de papel, redigitação manual lenta no escritório e relatórios gerenciais defasados. O Sistema UVZ resolve a quebra dessa esteira logística atuando diretamente nos três gargalos da operação:

1. **Gargalo de Coleta (Campo):** Agentes operam sob calor extremo e luz solar direta nas telas, o que dificulta o uso de sistemas comuns. A plataforma resolve isso aplicando acessibilidade tátil (*hitboxes* ampliadas) e visual (alto contraste sem *Dark Mode*, eliminando o efeito espelho), garantindo a integridade do dado no momento em que ele nasce.
2. **Gargalo de Processamento (Retaguarda):** O controle de planilhas isoladas para contagem laboratorial e distribuição de insumos (como larvicidas) gera retrabalho e furos de estoque. O sistema unifica essas rotinas em um banco de dados relacional robusto, amarrando a saída de material diretamente à matrícula do servidor e centralizando o processamento técnico.
3. **Ponto Cego Analítico (Gestão):** Coordenadores frequentemente tomam decisões baseadas em dados com semanas de atraso. Com a digitalização do fluxo, o sistema elimina a latência da informação, substituindo a espera pelos relatórios semanais por um monitoramento de anomalias e produtividade em tempo real.

## 🏛️ UI/UX e Padrão Gov.br

A interface de usuário foi arquitetada seguindo as diretrizes do **Padrão Digital de Governo (Design System Gov.br - Versão 3.7.0)**, garantindo a identidade visual oficial de sistemas de saúde pública (SUS):
* Uso exclusivo da tipografia oficial **Rawline**.
* Aplicação da cor interativa primária (`#1351B4`) para ações principais.
* Botões em formato *Pill-shape* e componentes de entrada de dados otimizados para leitores de tela e navegação por teclado.

## 🚀 Principais Funcionalidades

A arquitetura do sistema é dividida em módulos especializados, garantindo que cada setor da UVZ possua ferramentas sob medida para o seu escopo de atuação:

### 📱 Nível 1 - Módulo Operacional (Agente de Campo)
* **Rotina Digital (Visitas Domiciliares):** Substituição do boletim físico por um fluxo mobile otimizado para registro ágil de inspeções de ciclo regular.
* **Amostragem com Ovitrampas:** Lógica para abertura, acompanhamento e recolhimento de armadilhas, vinculando o código da palheta e as coordenadas de GPS diretamente ao imóvel.
* **Pontos Estratégicos (PE):** Roteiro digitalizado e quinzenal para monitoramento de locais de criticidade máxima, como borracharias, ferros-velhos e cemitérios.
* **Disparo de Bloqueio Rápido:** Canal de comunicação direta para notificar focos críticos em tempo real e solicitar o envio imediato da equipe de pulverização/bloqueio.

### 🖥️ Nível 2 - Módulo Tático (Administração e Laboratório)
* **Consolidação Laboratorial:** Interface para inserção de dados de bancada (como a contagem microscópica de ovos de *Aedes aegypti*), vinculando os resultados automaticamente ao ciclo da armadilha correspondente.
* **Controle de Insumos e Logística:** Gestão de estoque centralizada de larvicidas (BTI) e imunizantes, registrando eletronicamente as movimentações de retirada e devolução por matrícula de servidor.
* **Gerenciamento de Cadastros:** Administração e cruzamento de dados de servidores, mapeamento de quarteirões e delimitação geográfica de áreas de abrangência.

### 📊 Nível 3 - Módulo Estratégico (Coordenação e Gestão)
* **Dashboards de Performance (KPIs):** Painéis gráficos para monitorar as metas do ciclo, produtividade das equipes e o cumprimento das rotas planejadas.
* **Análise Epidemiológica Vetorial:** Cruzamento instantâneo entre o índice de infestação laboratorial (ovos) e os registros de visitas de campo para direcionamento inteligente de mutirões.
* **Detecção de Anomalias:** Sistema de monitoramento contínuo para apontar quedas bruscas de produtividade ou picos inesperados de focos em regiões específicas do município.

## 🛠️ Tecnologias Utilizadas

**Frontend:**
* React (com Vite para build rápido)
* CSS Customizado (Design System Gov.br)
* Font Awesome 6.4 (Iconografia oficial)

**Backend:**
* Java / Spring Boot
* Spring Data JPA / Hibernate (Modelagem Relacional de Dados)
* Padrão DTO (Data Transfer Object) para serialização de dados achatados (*Flat*) do React para as tabelas relacionais.

## 📸 Telas do Sistema

O ecossistema possui interfaces adaptadas para cada perfil de uso, combinando usabilidade móvel com foco em alto contraste para o trabalho de campo, além de painéis densos e analíticos para a retaguarda e coordenação.

### 📱 Nível 1 - Módulo Operacional (Mobile-First / Alto Contraste)
*Interfaces otimizadas para smartphones e tablets, focadas em legibilidade sob a luz do sol.*

| Tela de Autenticação (Padrão Gov.br) | Painel Principal do Agente | Menu de Seleção de Boletins |
| :---: | :---: | :---: |
| ![Autenticação](docs/screenshots/login.png) | ![Painel do Agente](docs/screenshots/menu-campo.png) | ![Menu de Boletins](docs/screenshots/menu-boletins.png) |

| Formulário de Solicitação de Bloqueio | Módulo de Amostragem (Ovitrampas) |
| :---: | :---: |
| ![Solicitar Bloqueio](docs/screenshots/solicitar-bloqueio.png) | ![Ovitrampas e GPS](docs/screenshots/ovitrampas.png) |

### 🖥️ Nível 2 - Módulo Tático (Desktop / Laboratório e Insumos)
*Telas densas para computadores de mesa, focadas em agilidade na digitação e controle logístico.*

| Lançamento Laboratorial (Ovos) | Painel de Controle de BTI (Estoque) |
| :---: | :---: |
| ![Laboratório de Bancada](docs/screenshots/laboratorio-ovos.png) | ![Estoque de Larvicida](docs/screenshots/controle-bti.png) |

### 📊 Nível 3 - Módulo Estratégico (Dashboard Executivo)
*Painéis de BI gerenciais para tomadas de decisão rápidas e inteligência epidemiológica.*

| Painel de Produtividade e KPIs | Mapa de Calor de Infestação Vetorial |
| :---: | :---: |
| ![Dashboard de Gestão](docs/screenshots/dashboard-kpis.png) | ![Mapa Epidemiológico](docs/screenshots/mapa-calor.png) |

## 💻 Como rodar o projeto localmente

### Pré-requisitos
* Node.js (v18+)
* Java (JDK 17+)
* Banco de Dados (PostgreSQL)

### Rodando o Frontend (React)
```bash
# Clone o repositório
git clone [https://github.com/jv-rossi/sistema-uvz-frontend.git](https://github.com/jv-rossi/sistema-uvz-frontend.git)

# Entre na pasta
cd sistema-uvz-frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev