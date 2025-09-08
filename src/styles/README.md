# CatButler Frontend - Assistente de IA para Casa

<div align="center">
  <img src="src/assets/images/logo-catbutler.png" alt="CatButler Logo" width="200" height="200">
  
  **O assistente inteligente que transforma sua casa em um lar mais organizado, sustentável e eficiente**
  
  [![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-7.1.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  
  [![Deploy Status](https://img.shields.io/badge/Deploy-Vercel-00C7B7?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
  [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
  [![Version](https://img.shields.io/badge/Version-2.3.0-blue?style=for-the-badge)](package.json)
</div>


## 📋 Visão Geral

O sistema de temas foi completamente separado para permitir controle total sobre as paletas de cores de cada modo (claro e escuro). Agora cada modo tem suas próprias variáveis CSS e estilos independentes.

## 🎨 Estrutura de Arquivos

```
src/styles/
├── light-theme.css    # Variáveis e configurações do modo claro
├── dark-theme.css     # Variáveis e configurações do modo escuro
└── README.md          # Esta documentação
```

## 🔧 Como Usar

### 1. Variáveis CSS

Cada modo tem suas próprias variáveis CSS definidas em `:root.light` e `:root.dark`:

```css
/* Modo Claro */
:root.light {
  --primary-color: #191970;
  --text-primary: #191970;
  --bg-primary: #ffffff;
  /* ... outras variáveis */
}

/* Modo Escuro */
:root.dark {
  --primary-color: #22c55e;
  --text-primary: #ffffff;
  --bg-primary: #111827;
  /* ... outras variáveis */
}
```

### 2. Aplicando Estilos

Use as variáveis CSS para aplicar estilos específicos de cada modo:

```css
/* Exemplo de uso */
.meu-elemento {
  color: var(--text-primary);
  background-color: var(--bg-primary);
  border: 1px solid var(--border-primary);
}
```

### 3. Classes Específicas de Modo

Use as classes `html.light` e `html.dark` para estilos específicos:

```css
/* Apenas no modo claro */
html.light .meu-elemento {
  color: #191970;
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
}

/* Apenas no modo escuro */
html.dark .meu-elemento {
  color: #ffffff;
  background: linear-gradient(135deg, #1e3a8a, #1e40af);
}
```

## 🎯 Variáveis Disponíveis

### Cores Primárias
- `--primary-color`: Cor principal do tema
- `--primary-hover`: Cor principal no hover
- `--accent-color`: Cor de destaque
- `--accent-hover`: Cor de destaque no hover

### Cores de Texto
- `--text-primary`: Texto principal
- `--text-secondary`: Texto secundário
- `--text-muted`: Texto suave
- `--text-inverse`: Texto invertido

### Cores de Fundo
- `--bg-primary`: Fundo principal
- `--bg-secondary`: Fundo secundário
- `--bg-glass`: Fundo glass effect
- `--bg-glass-border`: Borda do glass effect

### Cores de Borda
- `--border-primary`: Borda principal
- `--border-secondary`: Borda secundária
- `--border-focus`: Borda de foco

### Gradientes
- `--gradient-blue`: Gradiente azul
- `--gradient-green`: Gradiente verde
- `--gradient-yellow`: Gradiente amarelo
- `--gradient-purple`: Gradiente roxo
- `--gradient-orange`: Gradiente laranja
- `--gradient-pink`: Gradiente rosa
- `--gradient-indigo`: Gradiente índigo
- `--gradient-emerald`: Gradiente esmeralda
- `--gradient-teal`: Gradiente teal

### Sombras
- `--shadow-sm`: Sombra pequena
- `--shadow-md`: Sombra média
- `--shadow-lg`: Sombra grande
- `--shadow-glass`: Sombra glass effect

### Cores de Estado
- `--success`: Cor de sucesso
- `--warning`: Cor de aviso
- `--error`: Cor de erro
- `--info`: Cor de informação

### Chat
- `--chat-bg`: Fundo do chat
- `--chat-border`: Borda do chat
- `--chat-input-bg`: Fundo do input do chat
- `--chat-input-border`: Borda do input do chat
- `--chat-bot-bg`: Fundo das mensagens do bot
- `--chat-user-bg`: Fundo das mensagens do usuário
- `--chat-user-text`: Texto das mensagens do usuário

### Accordion
- `--accordion-chevron`: Cor das setinhas do accordion
- `--accordion-chevron-bg`: Fundo das setinhas do accordion
- `--accordion-chevron-hover`: Cor das setinhas no hover

## 🚀 Próximos Passos

1. **Revisar cada aba** individualmente
2. **Ajustar paletas** de cores específicas
3. **Testar contrastes** em ambos os modos
4. **Refinar gradientes** e efeitos visuais
5. **Otimizar legibilidade** de textos

## 💡 Dicas de Uso

- Sempre use as variáveis CSS em vez de cores hardcoded
- Teste ambos os modos ao fazer mudanças
- Mantenha consistência visual entre os modos
- Use gradientes para criar profundidade visual
- Priorize a legibilidade e acessibilidade
