# 🤝 Guia de Contribuição - CatButler

Obrigado por considerar contribuir com o CatButler! Este guia fornece informações sobre como contribuir de forma eficaz.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Contribuir](#como-contribuir)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Padrões de Código](#padrões-de-código)
- [Processo de Pull Request](#processo-de-pull-request)
- [Tipos de Contribuição](#tipos-de-contribuição)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Funcionalidades](#sugerir-funcionalidades)

## 📜 Código de Conduta

### Nossos Compromissos

- **Inclusivo**: Bem-vindos todos os níveis de experiência
- **Respeitoso**: Tratamos todos com respeito e dignidade
- **Colaborativo**: Trabalhamos juntos para melhorar o projeto
- **Construtivo**: Feedback construtivo e útil

### Comportamentos Esperados

- ✅ Usar linguagem acolhedora e inclusiva
- ✅ Respeitar diferentes pontos de vista e experiências
- ✅ Aceitar críticas construtivas graciosamente
- ✅ Focar no que é melhor para a comunidade
- ✅ Mostrar empatia com outros membros

### Comportamentos Inaceitáveis

- ❌ Linguagem ou imagens sexualizadas
- ❌ Trolling, comentários insultuosos ou ataques pessoais
- ❌ Assédio público ou privado
- ❌ Publicar informações privadas sem permissão
- ❌ Outros comportamentos inadequados em ambiente profissional

## 🚀 Como Contribuir

### 1. Fork do Projeto

```bash
# Fork no GitHub, depois clone localmente
git clone https://github.com/SEU_USUARIO/catbutler-react.git
cd catbutler-react

# Adicionar upstream
git remote add upstream https://github.com/ORIGINAL_OWNER/catbutler-react.git
```

### 2. Criar Branch

```bash
# Atualizar main
git checkout main
git pull upstream main

# Criar nova branch
git checkout -b feature/nova-funcionalidade
# ou
git checkout -b fix/corrigir-bug
# ou
git checkout -b docs/atualizar-documentacao
```

### 3. Fazer Mudanças

```bash
# Fazer suas alterações
# Testar localmente
npm run dev
npm run test
npm run lint

# Commit
git add .
git commit -m "feat: adiciona nova funcionalidade X"
```

### 4. Push e Pull Request

```bash
# Push para sua fork
git push origin feature/nova-funcionalidade

# Criar Pull Request no GitHub
```

## 🛠️ Configuração do Ambiente

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Git
- Editor de código (VS Code recomendado)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/SEU_USUARIO/catbutler-react.git
cd catbutler-react

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev
```

### VS Code Extensions

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

## 📝 Padrões de Código

### Nomenclatura

#### Arquivos e Pastas
```
components/
├── Header.jsx              # PascalCase para componentes
├── CustomBackground.jsx
└── Footer.jsx

hooks/
├── useAuth.js              # camelCase para hooks
├── useLocalStorage.js
└── useTheme.js

services/
├── api.js                  # camelCase para utilitários
├── auth.js
└── storage.js
```

#### Variáveis e Funções
```javascript
// ✅ Bom
const userName = 'João';
const isAuthenticated = true;
const handleSubmit = () => {};

// ❌ Ruim
const user_name = 'João';
const IsAuthenticated = true;
const HandleSubmit = () => {};
```

#### Componentes
```javascript
// ✅ Bom
const UserProfile = ({ user, onUpdate }) => {
  // ...
};

// ❌ Ruim
const userProfile = ({ user, onUpdate }) => {
  // ...
};
```

### Estrutura de Componentes

```javascript
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ComponentName = ({ prop1, prop2, children }) => {
  // 1. Hooks
  const [state, setState] = useState(initialValue);
  
  // 2. Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // 3. Handlers
  const handleEvent = (e) => {
    // Handler logic
  };
  
  // 4. Render helpers
  const renderContent = () => {
    // Render logic
  };
  
  // 5. Render
  return (
    <div className="component-class">
      {children}
    </div>
  );
};

// PropTypes
ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
  children: PropTypes.node,
};

export default ComponentName;
```

### CSS e Styling

#### Tailwind CSS
```javascript
// ✅ Bom - Classes organizadas
<button className="px-4 py-2 bg-green-400 hover:bg-green-500 text-white font-bold rounded-lg transition">
  Botão
</button>

// ❌ Ruim - Classes desorganizadas
<button className="bg-green-400 px-4 text-white py-2 rounded-lg font-bold hover:bg-green-500 transition">
  Botão
</button>
```

#### CSS Customizado
```css
/* ✅ Bom - Nomenclatura clara */
.user-profile {
  display: flex;
  align-items: center;
}

.user-profile__avatar {
  width: 40px;
  height: 40px;
}

.user-profile__name {
  font-weight: bold;
}

/* ❌ Ruim - Nomenclatura confusa */
.profile {
  display: flex;
}

.avatar {
  width: 40px;
}
```

### Commits

#### Padrão de Commits
```
tipo(escopo): descrição

Corpo opcional explicando o que e por que

Rodapé opcional com referências
```

#### Tipos
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Tarefas de manutenção

#### Exemplos
```bash
# ✅ Bom
git commit -m "feat(auth): adiciona login com Google"
git commit -m "fix(header): corrige posicionamento do menu mobile"
git commit -m "docs(readme): atualiza instruções de instalação"

# ❌ Ruim
git commit -m "fix bug"
git commit -m "update"
git commit -m "changes"
```

## 🔄 Processo de Pull Request

### Antes de Criar PR

1. **Atualizar branch**
   ```bash
   git checkout main
   git pull upstream main
   git checkout sua-branch
   git rebase main
   ```

2. **Executar testes**
   ```bash
   npm run test
   npm run lint
   npm run build
   ```

3. **Verificar checklist**
   - [ ] Código segue padrões do projeto
   - [ ] Testes passam
   - [ ] Linting sem erros
   - [ ] Build sem erros
   - [ ] Documentação atualizada
   - [ ] Screenshots (se aplicável)

### Template de PR

```markdown
## 📝 Descrição
Breve descrição das mudanças realizadas.

## 🔗 Tipo de Mudança
- [ ] Bug fix
- [ ] Nova funcionalidade
- [ ] Breaking change
- [ ] Documentação
- [ ] Refatoração

## ✅ Checklist
- [ ] Código segue padrões do projeto
- [ ] Testes passam
- [ ] Linting sem erros
- [ ] Build sem erros
- [ ] Documentação atualizada

## 📸 Screenshots
(Se aplicável)

## 🧪 Como Testar
1. Passo 1
2. Passo 2
3. Passo 3

## 📋 Issues Relacionadas
Fixes #123
```

### Review Process

1. **Automated Checks**
   - Linting
   - Tests
   - Build
   - Security

2. **Code Review**
   - Pelo menos 1 aprovação
   - Feedback construtivo
   - Discussão se necessário

3. **Merge**
   - Squash and merge (recomendado)
   - Delete branch após merge

## 🎯 Tipos de Contribuição

### 🐛 Reportar Bugs

#### Template de Bug Report
```markdown
**Descrição do Bug**
Descrição clara e concisa do bug.

**Passos para Reproduzir**
1. Vá para '...'
2. Clique em '...'
3. Veja o erro

**Comportamento Esperado**
Descrição do que deveria acontecer.

**Screenshots**
Se aplicável, adicione screenshots.

**Ambiente**
- OS: [ex: Windows 10]
- Browser: [ex: Chrome 91]
- Versão: [ex: 1.0.0]

**Informações Adicionais**
Qualquer outra informação relevante.
```

### 💡 Sugerir Funcionalidades

#### Template de Feature Request
```markdown
**Funcionalidade Sugerida**
Descrição clara e concisa da funcionalidade.

**Problema que Resolve**
Descrição do problema que esta funcionalidade resolveria.

**Solução Proposta**
Descrição da solução que você gostaria de ver.

**Alternativas Consideradas**
Outras soluções que você considerou.

**Contexto Adicional**
Qualquer outro contexto sobre a funcionalidade.
```

### 📚 Melhorar Documentação

- Corrigir erros de digitação
- Adicionar exemplos
- Melhorar clareza
- Traduzir para outros idiomas
- Adicionar diagramas

### 🧪 Adicionar Testes

```javascript
// Exemplo de teste
import { render, screen } from '@testing-library/react';
import Header from '../Header';

describe('Header', () => {
  test('renders logo and navigation', () => {
    render(<Header />);
    
    expect(screen.getByText('CatButler')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });
  
  test('toggles theme when button is clicked', () => {
    render(<Header />);
    
    const themeButton = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(themeButton);
    
    // Verificar mudança de tema
  });
});
```

### 🎨 Melhorar UI/UX

- Adicionar animações
- Melhorar responsividade
- Otimizar performance
- Adicionar acessibilidade
- Melhorar design

## 🔍 Code Review

### Como Revisar

1. **Verificar Funcionalidade**
   - Código faz o que deveria?
   - Edge cases cobertos?
   - Performance adequada?

2. **Verificar Qualidade**
   - Segue padrões do projeto?
   - Código limpo e legível?
   - Testes adequados?

3. **Verificar Segurança**
   - Vulnerabilidades?
   - Validação de inputs?
   - Sanitização de dados?

### Feedback Construtivo

```markdown
# ✅ Bom Feedback
"Ótima implementação! Sugestão: podemos extrair a lógica de validação para um hook customizado para reutilização."

# ❌ Ruim Feedback
"Este código está errado."
```

## 🏆 Reconhecimento

### Contributors
- Lista de contribuidores no README
- Badges de contribuição
- Menção em releases

### Hall of Fame
- Contribuidores mais ativos
- Melhores PRs
- Contribuições mais impactantes

## 📞 Suporte

### Dúvidas
- **GitHub Discussions**: Para discussões gerais
- **Issues**: Para bugs e funcionalidades
- **Discord**: Para chat em tempo real

### Contato
- **Email**: [contributors@catbutler.com](mailto:contributors@catbutler.com)
- **GitHub**: [@catbutler](https://github.com/catbutler)
- **Twitter**: [@catbutler_app](https://twitter.com/catbutler_app)

## 📄 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a [Licença MIT](LICENSE).

---

**Obrigado por contribuir com o CatButler! 🐱✨**

