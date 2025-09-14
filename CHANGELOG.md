# 📝 Changelog - CatButler

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Unreleased]

### 🚀 Correções de Deploy e Atualização Major (2025-01-13)

#### Corrigido
- **Pipeline de Deploy Vercel**
  - Correção na configuração do vercel-action v25
  - Ajuste nos nomes dos secrets (VERCEL_ORG_ID, VERCEL_PROJECT_ID)
  - Remoção de variáveis de ambiente duplicadas no step de deploy
  - Validação adequada de tokens necessários

#### Atualizado
- **Versão Major**: 3.6.0 → 4.0.0
  - Reflete as melhorias significativas de qualidade e infraestrutura
  - Suite de testes completa implementada (323+ testes)
  - Otimizações de performance e acessibilidade
  - Documentação expandida com seções de qualidade

### 🧪 Otimizações de Qualidade e Testes (2025-01-13)

#### Adicionado
- **Suite de Testes Automatizados Completa**
  - 323+ testes automatizados com 100% de taxa de sucesso
  - Testes cross-browser (Chrome, Firefox, Safari) em desktop e mobile
  - Testes de acessibilidade WCAG 2.1 AA compliance
  - Testes de performance Core Web Vitals
  - Testes de integração e navegação SPA
  - Smoke tests para verificações básicas

#### Atualizado
- **Web Vitals para APIs Modernas**
  - Migração de funções deprecadas (getCLS, getFID) para modernas (onCLS, onINP)
  - INP (Interaction to Next Paint) substituindo FID como métrica de responsividade
  - Implementação de Navigation Timing API Level 2
  - Remoção de APIs deprecated (performance.timing)

#### Melhorado
- **Acessibilidade e UX**
  - Substituição de `<div role="dialog">` por `<dialog>` nativo
  - Adição de keyboard listeners para navegação
  - Correção de espaçamento ambíguo em ícones FontAwesome
  - PropTypes validation para componentes React
  - Melhor tratamento de erros em catch blocks

#### Otimizado
- **Performance e Código**
  - Refatoração de regex usando RegExp.exec() ao invés de String.match()
  - Redução de complexidade cognitiva em funções de teste
  - Remoção de variáveis não utilizadas e assignments inúteis
  - Uso de optional chaining (?.) para verificações de APIs
  - Consolidação de utilitários de performance em arquivo único

### 🎨 Melhorias de Interface e Usabilidade

#### Adicionado
- Sistema de documentação completo
- Guias de instalação, desenvolvimento e deploy
- Templates para contribuição

#### Alterado
- **Substituição de Emojis por Ícones FontAwesome**
  - Assistente Culinário: emoji de chef substituído por ícone de robô (`fa-robot`)
  - Botões de chat: emojis substituídos por ícones FontAwesome (`fa-times`, `fa-comment`)
  - MercadoIA: todos os emojis de produtos substituídos por ícones apropriados
  - FaxinaIA: emojis de ambientes substituídos por ícones FontAwesome
  - ErrorBoundary: emoji de gato triste substituído por ícone de gato (`fa-cat`)

#### Corrigido
- **Animações dos Cards da Home**
  - Implementado sistema de reanimação quando usuário volta para a home
  - Adicionado estado `animationKey` para forçar re-renderização dos cards
  - Corrigida inconsistência nas animações entre navegação de páginas
  - Todos os cards agora têm animação consistente ao retornar à home

## [2.3.0] - 2025-01-27

### 🚀 Layout Otimizado e Scroll Removido

#### Adicionado
- **Sistema de Layout Fixo Completo**
  - Remoção completa do scroll vertical na versão desktop
  - Layout otimizado para se encaixar perfeitamente na viewport
  - Sistema de altura dinâmica com `100dvh` para responsividade total
  - Header e footer fixos com conteúdo deslizante entre eles
- **Documentação Profissional Completa**
  - README.md completamente reescrito com design profissional
  - Documentação técnica detalhada para frontend e backend
  - Descrição completa para portfólio com métricas e tecnologias
  - Links cruzados entre repositórios frontend e backend
  - Badges profissionais e estrutura visual moderna

#### Melhorado
- **Layout da Home Page**
  - Cards compactos com alturas otimizadas (`10rem`, `8rem`, `6rem`)
  - Espaçamentos reduzidos para melhor aproveitamento do espaço
  - Gaps menores entre elementos (`gap-3 sm:gap-4`)
  - Margens otimizadas (`mb-4 sm:mb-5`)
  - Padding reduzido em todos os componentes (`p-3 sm:p-4`)

- **Seção de Conquistas**
  - Altura reduzida para `6rem` para melhor proporção
  - Padding menor nos botões de conquistas (`p-2`)
  - Gaps otimizados entre elementos (`gap-2 sm:gap-3`)
  - Layout mais compacto e organizado

- **Footer Simplificado**
  - Estrutura simplificada sem wrappers desnecessários
  - Altura fixa de `3.5rem` para consistência
  - Mensagem "Curtiu?" centralizada horizontalmente
  - Layout flex otimizado para melhor distribuição

#### Corrigido
- **Problemas de Sobreposição**
  - Eliminada sobreposição do footer com conteúdo
  - Header flutuante sobre conteúdo deslizante
  - Z-index otimizado para elementos fixos
  - Layout responsivo sem conflitos de posicionamento

- **Scroll Desnecessário**
  - Removido scroll vertical na versão desktop
  - Layout fixo que se adapta a qualquer altura de tela
  - Conteúdo otimizado para caber na viewport
  - Experiência mais limpa e profissional

#### Técnico
- **Sistema de Alturas Dinâmicas**
  - `body`: `height: 100dvh; overflow: hidden`
  - `main`: `height: 100dvh; overflow-hidden`
  - `Home`: `height: calc(100dvh - 7.5rem); overflow-y-auto`
  - Cálculos precisos para header (`4rem`) e footer (`3.5rem`)

- **Otimizações de Performance**
  - Remoção de scroll desnecessário melhora performance
  - Layout fixo reduz reflows e repaints
  - Animações mais suaves sem conflitos de scroll
  - Experiência de usuário mais fluida

## [2.2.1] - 2025-01-27

### 🎨 Melhorias de Interface e Usabilidade

#### Adicionado
- **Card "Agora" Inteligente**
  - Botão "Começar" dinâmico que redireciona baseado na sugestão do horário
  - Função `getSuggestionRoute()` para determinar rota correta automaticamente
  - Mapeamento inteligente: café da manhã → Cozinha IA, tarefas → Tarefas, etc.
  - Remoção do botão de engrenagem para interface mais limpa

- **Sistema de Navegação Contextual**
  - Links do Home page convertidos de `<a href>` para `<Link to>` (React Router)
  - Persistência de tema via localStorage no ThemeContext
  - Navegação mantém tema selecionado entre páginas

#### Melhorado
- **Contraste e Visibilidade - Modo Claro**
  - Sugestões do card "Agora" com cores azuis específicas para melhor legibilidade
  - Fundo do card de sugestão alterado para azul claro (#dbeafe)
  - Botões de compartilhar e tema com fundo branco no modo claro
  - Ícones com contraste adequado (cinza escuro em fundos claros)
  - Botões escuros com texto branco para visibilidade

- **Estilização Específica**
  - Regras CSS ultra-específicas para `.agora-card` evitando conflitos
  - Seletores direcionados para botões de header (compartilhar/tema)
  - Cores específicas para elementos problemáticos no modo claro
  - Manutenção da funcionalidade no modo escuro

#### Corrigido
- **Problemas de Visibilidade**
  - Texto "OU ENTRE COM" na página de login
  - Sugestões invisíveis no card "Agora"
  - Botões escuros com texto invisível no modo claro
  - Ícones sem contraste adequado
  - Navegação incorreta entre páginas (perdendo tema)

#### Removido
- Botão de engrenagem do card "Agora" (substituído por funcionalidade inteligente)
- Regras CSS genéricas que causavam conflitos visuais

#### Corrigido (Atualização Final)
- **Problemas Persistentes de Contraste**
  - Aplicação de regras CSS ultra-específicas com seletores de atributos
  - Forçar fundo cinza claro em todos os containers escuros no modo claro
  - Forçar texto escuro em todos os elementos filhos de containers escuros
  - Forçar fundo branco em todos os inputs, selects e textareas
  - Forçar cor cinza escura em todos os ícones e setas de accordion
  - Regras aplicadas no final do arquivo para sobrescrever conflitos
  - Cobertura total de elementos problemáticos com seletores `[class*="bg-gray-X"]`

## [2.2.0] - 2025-01-27

### 🎨 Design e Interface - Melhorias Profissionais

#### Adicionado
- **Sistema de Temas Separados**
  - Paletas de cores completamente independentes para modo claro e escuro
  - Variáveis CSS organizadas em arquivos separados (light-theme.css, dark-theme.css)
  - Controle total sobre cores de cada modo sem interferência mútua
  - Documentação completa do sistema de temas

- **Ícones Font Awesome Profissionais**
  - Substituição completa de todos os emojis por ícones Font Awesome
  - Ícones responsivos que se adaptam aos temas claro/escuro
  - Visual consistente e profissional em todo o site
  - CDN Font Awesome 6.5.1 integrado

- **Cards Modernos Aprimorados**
  - Upgrade de estilo aplicado em todas as abas (Cozinha IA, Faxina IA, Mercado IA, Configurações, Tarefas)
  - Gradientes e elementos decorativos de fundo
  - Efeitos glass aprimorados com z-index otimizado
  - Setinhas de accordion com melhor visibilidade

#### Melhorado
- **Contraste e Legibilidade**
  - Análise cirúrgica de cores para melhor contraste no modo claro
  - Textos mais legíveis em gradientes claros
  - Cores específicas para elementos em fundos coloridos
  - Manutenção da qualidade visual no modo escuro

- **Experiência do Usuário**
  - Interface mais profissional e moderna
  - Consistência visual em todas as páginas
  - Melhor feedback visual com ícones apropriados
  - Navegação mais intuitiva

#### Corrigido
- **Problemas de Visibilidade**
  - Setinhas de accordion agora são claramente visíveis
  - Contraste adequado em ambos os modos
  - Ícones com tamanhos e cores apropriados
  - Elementos decorativos não interferem no conteúdo

## [2.1.0] - 2025-01-27

### 🍳 Cozinha IA - Funcionalidades Avançadas

#### Adicionado
- **Cardápio Semanal Inteligente**
  - Geração automática de cardápios baseada nos ingredientes disponíveis
  - Layout organizado por dias da semana e refeições (Café da Manhã, Almoço, Jantar)
  - Botão de copiar que formata o cardápio para área de transferência
  - Design moderno com gradientes e elementos decorativos
  - Estado de loading durante a geração

- **Sistema Accordion Inteligente**
  - Accordions que se fecham automaticamente para otimizar espaço
  - Card de dicas fecha quando assistente culinário é aberto
  - Card de dicas fecha quando cardápio semanal é gerado
  - Setinhas indicativas (chevron) em todos os accordions
  - Transições suaves entre estados

#### Melhorado
- **Contraste e Legibilidade no Modo Claro**
  - Análise cirúrgica das cores para melhor contraste
  - Textos mais escuros em gradientes claros
  - Inputs e labels com melhor visibilidade
  - Chat com mensagens mais legíveis
  - Cores específicas para cada tipo de gradiente

- **Interface do Assistente Culinário**
  - Botão de cardápio semanal restaurado com texto completo
  - Layout mais compacto e organizado
  - Melhor integração entre chat e cardápio
  - Estados sincronizados entre componentes

#### Corrigido
- **Problemas de Contraste**
  - Modo escuro restaurado sem alterações desnecessárias
  - Modo claro com legibilidade significativamente melhorada
  - Cores específicas para gradientes claros
  - Textos secundários com contraste adequado

## [2.0.2] - 2025-01-27

### 🎨 Melhorias de UX/UI

#### Melhorado
- **Card "Agora" - Contraste e Legibilidade**
  - Texto da sugestão com contraste melhorado no modo claro
  - Fundo azul escuro (blue-600) para melhor visibilidade
  - Texto branco com sombra para destaque
  - Ícone amarelo com texto branco para contraste
  - CSS forçado com !important para garantir aplicação
  - Classes específicas para controle de estilo

- **Acessibilidade Aprimorada**
  - Substituição de elementos com role="button" por botões reais
  - Melhor navegação por teclado
  - Elementos semânticos corretos
  - Contraste WCAG melhorado

#### Técnico
- **CSS Específico**
  - Classes `.suggestion-card`, `.suggestion-text`, `.suggestion-subtitle`
  - Seletores específicos para modo claro (.light)
  - Text-shadow para melhor legibilidade
  - Font-weight aumentado para destaque

- **Componentes**
  - Card "Agora" com design premium
  - Elementos interativos com acessibilidade completa
  - Hover effects refinados

## [2.0.1] - 2025-01-27

### 🎨 Melhorias de UX/UI

#### Melhorado
- **Assistente Culinário no Modo Claro**
  - Fundo do chat mais claro e harmonioso (gray-50)
  - Mensagens do bot com azul suave e bordas sutis
  - Input com fundo branco e placeholder mais suave
  - Gradiente laranja nas mensagens do usuário
  - Sombras sutis para profundidade visual
  - Hover effects elegantes
  - Botão de envio com estado disabled
  - Mensagem de boas-vindas mais atrativa

- **Menu Responsivo**
  - Corrigido problema da aba "Home" sumindo no menu mobile
  - Adicionado posicionamento fixo com z-index adequado
  - Overlay de fundo para melhor UX
  - Classes CSS específicas para garantir visibilidade
  - Menu posicionado abaixo do header (top: 4rem)
  - Overlay clicável para fechar o menu

- **Responsividade Geral**
  - Gatinho mordomo escondido em telas menores que 1024px
  - Footer reorganizado em telas menores que 926px
  - Layout vertical do footer em dispositivos móveis
  - Evita sobreposição da frase "Curtiu" com versão
  - Melhor experiência em todos os tamanhos de tela

#### Técnico
- **CSS Responsivo**
  - Media queries específicas para footer
  - Classes `.footer-desktop` e `.footer-mobile`
  - Breakpoints customizados (926px, 1024px)
  - Z-index otimizado para menu mobile

- **Componentes**
  - Header com menu mobile melhorado
  - Footer com layout adaptativo
  - Home com gatinho responsivo
  - CozinhaIA com chat estilizado

## [2.0.0] - 2025-01-27

### 🚀 Funcionalidades Avançadas de UX/UI

#### Adicionado
- 🔔 **Sistema de Notificações Toast**
  - ToastProvider para gerenciamento global
  - useToast hook para disparar notificações
  - Tipos: success, error, warning, info, default
  - Auto-dismiss configurável
  - Animações de entrada e saída
  - Renderização via Portal

- ⚡ **Sistema de Loading States**
  - LoadingSpinner com tamanhos e cores variados
  - LoadingButton para botões com estado de carregamento
  - LoadingCard para seções de loading
  - useLoading hook para gerenciamento de estados
  - withLoading para operações assíncronas

- ✅ **Validação em Tempo Real**
  - useValidation hook completo para formulários
  - useFieldValidation para validação de campo único
  - Debounce de 300ms para performance
  - Integração com sistema de segurança existente
  - Validação enquanto o usuário digita

- 🛡️ **Segurança e Confirmações**
  - ErrorBoundary para captura de erros de renderização
  - ConfirmationDialog para ações críticas
  - useConfirm hook para confirmações assíncronas
  - Input sanitization aprimorada
  - Validação robusta de email, senha e nome

- ⌨️ **Sistema de Atalhos de Teclado**
  - useKeyboardShortcuts hook base
  - useCatButlerShortcuts para atalhos específicos
  - Navegação: Ctrl+H (Home), Ctrl+T (Tarefas), etc.
  - Ações: Ctrl+K (Tema), Ctrl+Shift+S (Compartilhar)
  - Formulários: Ctrl+Enter (Confirmar), Escape (Cancelar)
  - KeyboardShortcutsHelp modal

- 🚀 **Performance Otimizada**
  - Lazy loading para todas as páginas
  - withLazyLoading HOC com fallback customizado
  - LazyWrapper com Intersection Observer
  - LazyImage para carregamento lazy de imagens
  - useDebounce e useThrottle hooks
  - Memoização de componentes

#### Melhorado
- 🎨 **Design System Aprimorado**
  - Abas da página de configurações com estilo consistente
  - Contraste melhorado no modo escuro
  - Transições mais suaves
  - Estados visuais mais claros

- 🔐 **Sistema de Autenticação**
  - Página de SignUp com validação em tempo real
  - Página de Login com validação
  - Modais reutilizáveis para Termos de Uso e Política de Privacidade
  - Validação de segurança em todos os inputs

- 📱 **Responsividade**
  - Layout otimizado para todas as telas
  - Abas responsivas com labels ocultas em mobile
  - Touch-friendly em todos os dispositivos

#### Técnico
- 🏗️ **Arquitetura de Componentes**
  - Providers globais (Toast, Confirmation, ErrorBoundary)
  - Hooks customizados organizados
  - Utilitários de segurança centralizados
  - Componentes reutilizáveis

- 🔧 **Configuração do Projeto**
  - Lazy loading configurado nas rotas
  - Error boundaries em toda a aplicação
  - Sistema de notificações global
  - Validação integrada em formulários

## [1.1.0] - 2025-01-27

### Adicionado
- 🧹 **Faxina IA - Sistema Completo**
  - Sistema de abas internas (Planejador, Produtos, Ambientes, Sustentabilidade)
  - Planejador Inteligente com layout em duas colunas
  - Guia de Produtos com seleção por superfície
  - Análise por Ambiente com galeria de 3 cards
  - Sustentabilidade com checkboxes múltiplos e cálculo de impacto
- 🎨 **Melhorias de Interface**
  - Scroll interno para controle de altura em SPA
  - Layout fixo com header e footer
  - Cores dos seletores corrigidas no modo escuro
  - Hover effects e transições melhoradas
- 🔧 **Otimizações Técnicas**
  - Verificações de segurança para evitar crashes
  - Código refatorado para melhor manutenibilidade
  - Linting errors corrigidos
  - Responsividade aprimorada

### Corrigido
- Erro crítico na aba Sustentabilidade que causava crash
- Overflow de conteúdo que ultrapassava os limites da SPA
- Cores dos seletores não visíveis no modo escuro
- Problemas de aninhamento de funções (linting)

### Melhorado
- Layout mais compacto e organizado
- Experiência do usuário mais fluida
- Performance e estabilidade geral

## [1.0.0] - 2025-01-27

### Adicionado
- 🎨 **Interface Principal**
  - Página inicial com design moderno e responsivo
  - Sistema de tema claro/escuro com toggle no header
  - Fundo 3D interativo com Three.js
  - Efeito glass (vidro) em componentes principais

- 🐱 **Gato Mordomo**
  - Imagem integrada do gato mordomo na página inicial
  - Posicionamento "sentado" na borda do container
  - Tamanho otimizado (500x400px)
  - Efeito hover com escala

- 🧭 **Navegação**
  - Header com logo e navegação responsiva
  - Footer com informações de contato e redes sociais
  - Sistema de rotas com React Router
  - Páginas: Home, Tarefas, Cozinha IA, Faxina IA, Mercado IA, Configurações

- ⚙️ **Página de Configurações**
  - Sistema de tabs para organização
  - **Tab Perfil**: Edição de nome e email
  - **Tab Segurança**: Alteração de senha
  - **Tab Preferências**: Localidade padrão e notificações
  - **Tab Conta Familiar**: Compartilhamento familiar

- 🎨 **Design System**
  - Paleta de cores consistente (verde, azul, roxo, laranja)
  - Componentes reutilizáveis
  - Animações suaves e transições
  - Responsividade mobile-first

- 🔧 **Funcionalidades Técnicas**
  - Context API para gerenciamento de tema
  - Hooks customizados
  - Validação de formulários
  - Sistema de notificações
  - Cache de configurações

### Alterado
- **Cores dos Botões**: Implementadas cores vibrantes no modo claro
- **Texto Midnight**: Aplicada cor midnight blue no modo escuro
- **Layout HOME**: Reorganizado para melhor integração do gato mordomo
- **Altura do Container**: Reduzida para layout mais compacto

### Corrigido
- **CSS Override**: Removidas regras CSS que sobrescreviam cores dos botões
- **Ícone de Compartilhamento**: Corrigido SVG do ícone de compartilhamento
- **PropTypes**: Adicionadas validações de props
- **Linting**: Corrigidos todos os warnings de ESLint

### Removido
- Regras CSS conflitantes que interferiam com Tailwind
- Dependências não utilizadas

## [0.9.0] - 2025-01-26

### Adicionado
- Estrutura inicial do projeto
- Configuração do Vite + React
- Integração com Tailwind CSS
- Sistema de roteamento básico
- Componentes base (Header, Footer)

### Alterado
- Migração de Create React App para Vite
- Atualização para React 19.1.1

## [0.8.0] - 2025-01-25

### Adicionado
- Primeira versão do design
- Layout básico das páginas
- Sistema de cores inicial

### Alterado
- Refatoração da estrutura de componentes

## [0.7.0] - 2025-01-24

### Adicionado
- Conceito inicial do projeto
- Wireframes e mockups
- Definição da arquitetura

---

## 📊 Estatísticas de Desenvolvimento

### Commits por Versão
- **v1.0.0**: 47 commits
- **v0.9.0**: 23 commits
- **v0.8.0**: 15 commits
- **v0.7.0**: 8 commits

### Contribuidores
- **Izadora** - Desenvolvedora Principal
- **Comunidade** - Feedback e sugestões

### Tecnologias Utilizadas
- React 19.1.1
- Vite 7.1.4
- Tailwind CSS 3.4.0
- Three.js 0.180.0
- React Three Fiber 9.3.0

---

## 🔮 Roadmap Futuro

### v1.1.0 - Funcionalidades de IA
- [ ] Integração com OpenAI para sugestões de receitas
- [ ] IA para rotinas de faxina personalizadas
- [ ] Comparação de preços em tempo real
- [ ] Sistema de notificações push

### v1.2.0 - Conta Familiar
- [ ] Sistema de convites familiares
- [ ] Compartilhamento de receitas
- [ ] Listas de compras colaborativas
- [ ] Perfis de usuário personalizados

### v1.3.0 - Mobile App
- [ ] Aplicativo React Native
- [ ] Sincronização offline
- [ ] Notificações nativas
- [ ] Integração com câmera para ingredientes

### v2.0.0 - Funcionalidades Avançadas
- [ ] Integração com assistentes de voz
- [ ] IA para planejamento de refeições
- [ ] Integração com supermercados
- [ ] Sistema de gamificação

---

## 📝 Notas de Versão

### v1.0.0
Esta é a primeira versão estável do CatButler, focada em estabelecer uma base sólida com design moderno e funcionalidades essenciais. O projeto está pronto para desenvolvimento de funcionalidades de IA e integrações externas.

### v0.9.0
Versão de desenvolvimento que estabeleceu a arquitetura base do projeto, incluindo configuração de build, roteamento e componentes fundamentais.

### v0.8.0
Primeira iteração do design, focada em criar uma identidade visual consistente e experiência de usuário intuitiva.

### v0.7.0
Fase de planejamento e conceituação, onde foram definidos os objetivos e requisitos do projeto.

---

## 🤝 Como Contribuir

Para contribuir com o projeto, consulte o [Guia de Contribuição](docs/CONTRIBUTING.md).

## 📄 Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).

---

**Mantido com ❤️ pela equipe CatButler**

