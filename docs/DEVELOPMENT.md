# 🛠️ Guia de Desenvolvimento - CatButler

Este guia fornece informações detalhadas para desenvolvedores que desejam contribuir com o projeto CatButler.

## 🏗️ Arquitetura do Projeto

### Estrutura de Pastas
```
src/
├── components/          # Componentes reutilizáveis
│   ├── CustomBackground.jsx  # Fundo 3D interativo
│   ├── Header.jsx           # Cabeçalho com navegação
│   └── Footer.jsx           # Rodapé
├── contexts/            # Contextos React
│   └── ThemeContext.jsx     # Gerenciamento de tema
├── pages/               # Páginas da aplicação
│   ├── Home.jsx            # Página inicial
│   ├── Config.jsx          # Configurações
│   ├── CozinhaIA.jsx       # IA de cozinha
│   ├── FaxinaIA.jsx        # IA de faxina
│   └── MercadoIA.jsx       # IA de mercado
├── assets/              # Recursos estáticos
│   └── images/             # Imagens
├── styles/              # Sistema de temas
│   ├── light-theme.css     # Variáveis do modo claro
│   ├── dark-theme.css      # Variáveis do modo escuro
│   └── README.md           # Documentação do sistema de temas
├── App.jsx              # Componente principal
├── main.jsx             # Ponto de entrada
├── routes.jsx           # Configuração de rotas
└── index.css            # Estilos globais
```

### Padrões de Código

#### Nomenclatura
- **Componentes**: PascalCase (`Header.jsx`)
- **Arquivos**: camelCase (`themeContext.js`)
- **Variáveis**: camelCase (`userName`)
- **Constantes**: UPPER_SNAKE_CASE (`API_URL`)
- **Funções**: camelCase (`handleSubmit`)

#### Estrutura de Componentes
```jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ComponentName = ({ prop1, prop2 }) => {
  // Hooks
  const [state, setState] = useState(initialValue);
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // Handlers
  const handleEvent = (e) => {
    // Handler logic
  };
  
  // Render
  return (
    <div className="component-class">
      {/* JSX content */}
    </div>
  );
};

// PropTypes
ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
};

export default ComponentName;
```

## 🎨 Sistema de Design

### Cores
```css
/* Cores principais */
--green-primary: #22c55e;
--blue-primary: #3b82f6;
--purple-primary: #7c3aed;
--orange-primary: #f97316;
--midnight-primary: #191970;

/* Cores de fundo */
--bg-light: #ffffff;
--bg-dark: #1a1a1a;
--glass-light: rgba(255, 255, 255, 0.1);
--glass-dark: rgba(0, 0, 0, 0.2);
```

### Componentes Base

#### Botões
```jsx
// Botão primário
<button className="px-6 py-3 bg-green-400 hover:bg-green-500 text-white font-bold rounded-lg transition">
  Botão
</button>

// Botão secundário
<button className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition">
  Botão
</button>
```

#### Cards
```jsx
<div className="glass-effect rounded-xl p-6 shadow-lg">
  {/* Conteúdo do card */}
</div>
```

#### Inputs
```jsx
<input
  type="text"
  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-400 focus:border-transparent"
/>
```

## 🔧 Configuração do Ambiente

### VS Code Extensions
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### Configuração do Prettier
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### Configuração do ESLint
```javascript
// eslint.config.js
export default [
  {
    rules: {
      'react/prop-types': 'warn',
      'no-unused-vars': 'warn',
      'no-console': 'warn'
    }
  }
];
```

## 🧪 Testes

### Configuração de Testes
```bash
# Instalar dependências de teste
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest jsdom
```

### Exemplo de Teste
```jsx
// src/components/__tests__/Header.test.jsx
import { render, screen } from '@testing-library/react';
import Header from '../Header';

describe('Header', () => {
  test('renders logo and navigation', () => {
    render(<Header />);
    
    expect(screen.getByText('CatButler')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });
});
```

### Executar Testes
```bash
# Executar todos os testes
npm run test

# Executar testes em modo watch
npm run test:watch

# Executar testes com coverage
npm run test:coverage
```

## 📦 Gerenciamento de Estado

### Context API
```jsx
// contexts/ThemeContext.jsx
import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### Hooks Customizados
```jsx
// hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};
```

## 🎭 Animações

### CSS Transitions
```css
/* Transições suaves */
.transition-smooth {
  transition: all 0.3s ease;
}

/* Hover effects */
.hover-scale:hover {
  transform: scale(1.05);
}

/* Fade in */
.fade-in {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### React Spring (Futuro)
```jsx
import { useSpring, animated } from '@react-spring/web';

const AnimatedComponent = () => {
  const props = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  });

  return <animated.div style={props}>Conteúdo</animated.div>;
};
```

## 🌐 API Integration

### Configuração de API
```jsx
// services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    return response.json();
  },
  
  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};
```

### Exemplo de Uso
```jsx
// hooks/useRecipes.js
import { useState, useEffect } from 'react';
import { api } from '../services/api';

export const useRecipes = (ingredients) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const data = await api.post('/recipes/suggest', { ingredients });
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    if (ingredients.length > 0) {
      fetchRecipes();
    }
  }, [ingredients]);

  return { recipes, loading };
};
```

## 🚀 Performance

### Lazy Loading
```jsx
import { lazy, Suspense } from 'react';

const LazyComponent = lazy(() => import('./LazyComponent'));

const App = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <LazyComponent />
  </Suspense>
);
```

### Memoização
```jsx
import { memo, useMemo, useCallback } from 'react';

const ExpensiveComponent = memo(({ data, onUpdate }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: true
    }));
  }, [data]);

  const handleUpdate = useCallback((id) => {
    onUpdate(id);
  }, [onUpdate]);

  return (
    <div>
      {processedData.map(item => (
        <div key={item.id} onClick={() => handleUpdate(item.id)}>
          {item.name}
        </div>
      ))}
    </div>
  );
});
```

## 🔍 Debugging

### React DevTools
```bash
# Instalar extensão do Chrome/Firefox
# React Developer Tools
```

### Console Debugging
```jsx
// Debug de estado
console.log('Current state:', state);

// Debug de props
console.log('Component props:', props);

// Debug de performance
console.time('Component render');
// ... código do componente
console.timeEnd('Component render');
```

### Error Boundaries
```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Algo deu errado.</h1>;
    }

    return this.props.children;
  }
}
```

## 📝 Commits

### Padrão de Commits
```
feat: adiciona nova funcionalidade
fix: corrige bug
docs: atualiza documentação
style: formatação de código
refactor: refatoração de código
test: adiciona ou corrige testes
chore: tarefas de manutenção
```

### Exemplos
```bash
git commit -m "feat: adiciona página de configurações"
git commit -m "fix: corrige bug no tema escuro"
git commit -m "docs: atualiza README com instruções de instalação"
```

## 🎨 Sistema de Temas e Design

### Sistema de Temas Separados

#### Estrutura
```
src/styles/
├── light-theme.css    # Variáveis do modo claro
├── dark-theme.css     # Variáveis do modo escuro
└── README.md          # Documentação completa
```

#### Variáveis CSS
```css
/* Modo Claro */
:root.light {
  --primary-color: #191970;
  --text-primary: #191970;
  --bg-primary: #ffffff;
  --gradient-blue: linear-gradient(135deg, #dbeafe, #bfdbfe);
  /* ... outras variáveis */
}

/* Modo Escuro */
:root.dark {
  --primary-color: #22c55e;
  --text-primary: #ffffff;
  --bg-primary: #111827;
  --gradient-blue: linear-gradient(135deg, #1e3a8a, #1e40af);
  /* ... outras variáveis */
}
```

#### Uso
```css
.meu-elemento {
  color: var(--text-primary);
  background: var(--gradient-blue);
  border: 1px solid var(--border-primary);
}
```

### Ícones Font Awesome

#### Implementação
- **CDN**: Font Awesome 6.5.1 carregado via CDN
- **Substituição Completa**: Todos os emojis substituídos por ícones
- **Responsividade**: Ícones se adaptam aos temas
- **Consistência**: Visual profissional em todo o site

#### Exemplos
```jsx
// Antes (emoji)
<span>🍳</span>

// Depois (Font Awesome)
<i className="fa-solid fa-utensils text-orange-600 dark:text-orange-400"></i>
```

### Cards Modernos

#### Estrutura
```jsx
<div className="glass-effect rounded-xl shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 relative overflow-hidden">
  {/* Elementos decorativos de fundo */}
  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-200 dark:bg-blue-600 rounded-full -translate-y-8 translate-x-8 opacity-20"></div>
  <div className="absolute bottom-0 left-0 w-12 h-12 bg-green-200 dark:bg-green-600 rounded-full translate-y-6 -translate-x-6 opacity-30"></div>
  
  {/* Conteúdo */}
  <div className="relative z-10">
    {/* Conteúdo do card */}
  </div>
</div>
```

## 🍳 Funcionalidades Avançadas - Cozinha IA

### Cardápio Semanal Inteligente

O sistema de cardápio semanal é uma das funcionalidades mais avançadas da aplicação:

#### Implementação
```jsx
const gerarCardapioSemanal = async () => {
  setGerandoCardapio(true);
  setDicasAbertas(false); // Fechar dicas automaticamente
  
  // Simular geração de cardápio
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const refeicoes = ['Café da Manhã', 'Almoço', 'Jantar'];
  
  // Gerar cardápio baseado nos ingredientes disponíveis
  const cardapio = diasSemana.map(dia => ({
    dia,
    refeicoes: refeicoes.map(refeicao => {
      // Lógica de seleção de receitas
    })
  }));
  
  setCardapioSemanal(cardapio);
  setGerandoCardapio(false);
};
```

#### Funcionalidades
- **Geração Automática**: Baseada nos ingredientes disponíveis
- **Layout Organizado**: Por dias da semana e refeições
- **Opção de Copiar**: Formatação para área de transferência
- **Design Moderno**: Gradientes e elementos decorativos
- **Estado de Loading**: Feedback visual durante geração

### Sistema Accordion Inteligente

O sistema de accordions foi projetado para otimizar o espaço e melhorar a experiência:

#### Comportamento Inteligente
- **Fechamento Automático**: Dicas fecham quando assistente abre
- **Sincronização**: Estados sincronizados entre componentes
- **Indicadores Visuais**: Setinhas (chevron) para clicabilidade
- **Transições Suaves**: Animações CSS para melhor UX

#### Estados Gerenciados
```jsx
const [activeAccordion, setActiveAccordion] = useState('ingredientes');
const [dicasAbertas, setDicasAbertas] = useState(true);
const [chatAberto, setChatAberto] = useState(false);
```

### Melhorias de Contraste

#### Análise Cirúrgica de Cores
O sistema de contraste foi otimizado especificamente para gradientes claros:

```css
/* Contraste específico para gradientes claros */
:not(.dark) .bg-gradient-to-br.from-blue-50 .text-gray-900 {
  color: #1f2937 !important; /* gray-800 - mais escuro */
}

:not(.dark) .bg-gradient-to-br.from-green-50 .text-gray-900 {
  color: #1f2937 !important; /* gray-800 - mais escuro */
}
```

#### Cores Otimizadas
- **Textos Principais**: gray-800 em vez de gray-900
- **Textos Secundários**: gray-600 em vez de gray-500
- **Inputs**: Cores mais escuras para melhor legibilidade
- **Labels**: Contraste aprimorado para acessibilidade

## 🚀 Deploy

### Build de Produção
```bash
# Criar build otimizado
npm run build

# Verificar tamanho do bundle
npm run analyze

# Testar build localmente
npm run preview
```

### Variáveis de Ambiente
```bash
# .env.production
VITE_API_URL=https://api.catbutler.com
VITE_GOOGLE_MAPS_API_KEY=your_production_key
VITE_ANALYTICS_ID=your_analytics_id
```

## 🤝 Contribuição

### Processo de Contribuição
1. Fork o repositório
2. Crie uma branch para sua feature
3. Faça commit das mudanças
4. Push para a branch
5. Abra um Pull Request

### Checklist de Pull Request
- [ ] Código segue os padrões do projeto
- [ ] Testes passam
- [ ] Documentação atualizada
- [ ] Screenshots (se aplicável)
- [ ] Descrição clara das mudanças

---

**Próximo passo**: Consulte o [Guia de API](API.md) para entender as integrações disponíveis.

