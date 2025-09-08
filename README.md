# 🐱 CatButler - Assistente Doméstico Inteligente

[![Deploy Status](https://img.shields.io/badge/deploy-vercel-brightgreen)](https://catbutler-frontend.vercel.app)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/react-19.1.1-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/vite-7.1.2-purple)](https://vitejs.dev/)

> **CatButler** é um assistente doméstico inteligente com personalidade felina, desenvolvido para simplificar e otimizar suas tarefas do dia a dia através de tecnologia moderna e inteligência artificial.

## 🌟 Sobre o Projeto

O CatButler nasceu de uma necessidade real: amigos próximos, **Cris e Rui**, pediram ferramentas que pudessem ajudar em suas rotinas domésticas usando IA. Foi assim que este assistente felino ganhou vida, combinando praticidade, tecnologia e diversão em uma única plataforma.

### ✨ Características Principais

- 🤖 **Assistente IA**: Conversas inteligentes sobre organização doméstica
- 🍳 **CozinhaIA**: Receitas personalizadas e sugestões culinárias
- 🧹 **FaxinaIA**: Cronogramas de limpeza inteligentes
- 🛒 **MercadoIA**: Listas de compras otimizadas
- 📅 **Agenda**: Calendário interativo para organização
- 📊 **Histórico**: Timeline de atividades e conquistas
- 💡 **Dicas**: Sabedoria felina para o cotidiano
- 🌓 **Tema Dual**: Modo claro/escuro com transições suaves

## 🚀 Demo

Acesse a aplicação em: **[catbutler-frontend.vercel.app](https://catbutler-frontend.vercel.app)**

## 📱 Funcionalidades

### 🎯 **Sistema SPA (Single Page Application)**
- Layout otimizado sem necessidade de scroll no desktop
- Sidebar navegacional com todas as funcionalidades
- Header e footer fixos para melhor UX

### 🤖 **Assistente Inteligente**
- Chat interativo com o CatButler IA
- Sugestões rápidas contextuais
- Respostas personalizadas por categoria
- Interface moderna estilo WhatsApp

### 🍳 **Gerenciamento Culinário**
- Receitas sugeridas por IA
- Filtros por dificuldade e tempo
- Sistema de favoritos
- Integração com lista de compras

### 🧹 **Automação de Limpeza**
- Cronogramas personalizados
- Dicas de produtos e técnicas
- Lembretes inteligentes
- Tracking de progresso

### 🛒 **Compras Inteligentes**
- Listas organizadas por categoria
- Sugestões baseadas em preferências
- Comparação de preços
- Informações nutricionais

### 📅 **Organização Pessoal**
- Calendário semanal interativo
- Eventos categorizados
- Sistema de prioridades
- Estatísticas de produtividade

## 🛠️ Tecnologias

### **Frontend**
- **React 19.1.1** - Biblioteca principal
- **Vite 7.1.2** - Build tool e dev server
- **Tailwind CSS 3.4.17** - Framework CSS utilitário
- **React Router DOM 7.8.2** - Roteamento SPA
- **React Icons 5.5.0** - Biblioteca de ícones

### **Funcionalidades Especiais**
- **NEAT Background** - Gradientes interativos animados
- **Glass Effects** - Design moderno com backdrop blur
- **Custom Scrollbar** - Scrollbars estilizadas
- **Responsive Design** - Mobile-first approach
- **Dark/Light Theme** - Sistema de temas completo

### **Performance**
- **Code Splitting** - Carregamento otimizado
- **Lazy Loading** - Componentes sob demanda
- **Custom Hooks** - Lógica reutilizável
- **Context API** - Gerenciamento de estado global

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### 1. Clone o repositório
```bash
git clone https://github.com/ipierette/catbutler-frontend.git
cd catbutler-frontend
```

### 2. Instale as dependências
```bash
npm install
# ou
yarn install
```

### 3. Configure variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env`:
```env
VITE_API_URL=http://localhost:3001/api
```

### 4. Execute o projeto
```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

### 5. Acesse a aplicação
Abra [http://localhost:5173](http://localhost:5173) no navegador.

## 🏗️ Estrutura do Projeto

```
catbutler-frontend/
├── public/                 # Arquivos estáticos
│   ├── js/
│   │   └── vendor/        # NEAT background library
│   └── favicon.ico
├── src/
│   ├── assets/            # Imagens e recursos
│   │   └── images/
│   ├── components/        # Componentes reutilizáveis
│   │   ├── layout/        # Layout components
│   │   │   └── Sidebar.jsx
│   │   ├── ui/            # UI components
│   │   │   └── FilterButton.jsx
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── CustomBackground.jsx
│   │   └── ...
│   ├── contexts/          # React contexts
│   │   └── ThemeContext.jsx
│   ├── hooks/             # Custom hooks
│   │   ├── useKeyboardShortcuts.js
│   │   └── useValidation.js
│   ├── pages/             # Páginas da aplicação
│   │   ├── Home.jsx
│   │   ├── Assistente.jsx
│   │   ├── Agenda.jsx
│   │   ├── Historico.jsx
│   │   ├── Dicas.jsx
│   │   ├── Sobre.jsx
│   │   └── ...
│   ├── styles/            # Estilos CSS
│   ├── utils/             # Utilitários
│   ├── App.jsx            # Componente principal
│   ├── main.jsx           # Entry point
│   ├── routes.jsx         # Configuração de rotas
│   └── index.css          # Estilos globais e Tailwind
├── docs/                  # Documentação
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🎨 Design System

### **Paleta de Cores**
- **Primary**: Rosa/Roxo gradient (#ec4899 → #8b5cf6)
- **Secondary**: Azul (#3b82f6)
- **Accent**: Verde (#10b981), Amarelo (#f59e0b)
- **Neutral**: Cinzas modernos

### **Componentes**
- **Glass Effects**: backdrop-blur com transparência
- **Cards**: Bordas arredondadas e sombras sutis
- **Buttons**: Estados hover e animações suaves
- **Forms**: Validação visual e feedback

### **Tipografia**
- **Font**: System fonts (system-ui, Avenir, Helvetica)
- **Scales**: Responsiva com classes utilitárias
- **Hierarchy**: Clara distinção entre títulos e texto

## 📱 Responsividade

### **Breakpoints**
- **SM**: 640px+ (Mobile landscape)
- **MD**: 768px+ (Tablet)
- **LG**: 1024px+ (Desktop)
- **XL**: 1280px+ (Large desktop)

### **Layout SPA**
- **Mobile**: Stack vertical, sidebar oculta
- **Desktop**: Layout horizontal com sidebar fixa
- **Tablet**: Adaptação híbrida conforme orientação

## 🔒 Boas Práticas

### **Segurança**
- Sanitização de inputs
- Validação client-side
- Links externos seguros
- Proteção XSS

### **Performance**
- Lazy loading de páginas
- Otimização de imagens
- Bundle splitting
- Caching inteligente

### **Acessibilidade**
- ARIA labels completos
- Navegação por teclado
- Contraste adequado
- Screen reader friendly

## 🚀 Deploy

### **Vercel (Recomendado)**
```bash
# Deploy automático via GitHub
# Conecte o repositório no dashboard da Vercel
```

### **Build Manual**
```bash
npm run build
# Deploy o conteúdo da pasta 'dist'
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### **Padrões de Código**
- ESLint para linting
- Prettier para formatação
- Conventional Commits
- Code review obrigatório

## 📊 Métricas

### **Performance**
- Lighthouse Score: 95+ (todas as categorias)
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.0s
- Bundle size otimizado

### **Cobertura**
- Componentes principais testados
- Hooks customizados validados
- Fluxos de usuário verificados

## 📄 Documentação

- **[Guia de Instalação](docs/INSTALLATION.md)**
- **[Guia de Desenvolvimento](docs/DEVELOPMENT.md)**
- **[Contribuição](docs/CONTRIBUTING.md)**
- **[API Reference](docs/API.md)**

## 🔗 Links

- **Deploy**: [catbutler-frontend.vercel.app](https://catbutler-frontend.vercel.app)
- **Repositório**: [github.com/ipierette/catbutler-frontend](https://github.com/ipierette/catbutler-frontend)
- **Portfolio**: [catbytes.netlify.app](https://catbytes.netlify.app)

## 👥 Créditos

**Desenvolvido por Izadora Pierette**

### **Agradecimentos Especiais**
- **Cris e Rui** - Inspiração e feedback inicial do projeto
- **Comunidade React** - Ferramentas e bibliotecas incríveis
- **Open Source** - Tornando projetos como este possíveis

## 📞 Contato

- **WhatsApp**: [+55 67 98409-8786](https://wa.me/5567984098786)
- **Email**: [ipierette2@gmail.com](mailto:ipierette2@gmail.com)
- **Ko-fi**: [ko-fi.com/ipierette](https://ko-fi.com/ipierette)
- **LinkedIn**: [LinkedIn Profile](https://linkedin.com/in/izadora-pierette)

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

<div align="center">

**Feito com 💜 por Izadora Pierette**

*Transformando casas em lares inteligentes, um miado por vez* 🐱✨

</div>