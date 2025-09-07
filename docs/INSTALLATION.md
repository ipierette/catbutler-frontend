# 📦 Guia de Instalação - CatButler

Este guia fornece instruções detalhadas para instalar e configurar o CatButler em diferentes ambientes.

## 📋 Pré-requisitos

### Sistema Operacional
- **Windows**: 10 ou superior
- **macOS**: 10.15 (Catalina) ou superior
- **Linux**: Ubuntu 18.04+ ou distribuição equivalente

### Software Necessário
- **Node.js**: Versão 18.0.0 ou superior
- **npm**: Versão 8.0.0 ou superior (incluído com Node.js)
- **Git**: Para clonar o repositório

### Verificar Instalações
```bash
# Verificar Node.js
node --version
# Deve retornar v18.0.0 ou superior

# Verificar npm
npm --version
# Deve retornar 8.0.0 ou superior

# Verificar Git
git --version
# Deve retornar a versão instalada
```

## 🚀 Instalação Rápida

### 1. Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/catbutler-react.git
cd catbutler-react
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Executar o Projeto
```bash
npm run dev
```

### 4. Acessar no Navegador
Abra [http://localhost:5173](http://localhost:5173) no seu navegador.

## 🔧 Instalação Detalhada

### Passo 1: Preparar o Ambiente

#### Windows
1. Baixe o Node.js do [site oficial](https://nodejs.org/)
2. Execute o instalador e siga as instruções
3. Reinicie o terminal/PowerShell
4. Verifique a instalação com os comandos acima

#### macOS
```bash
# Usando Homebrew (recomendado)
brew install node

# Ou baixe do site oficial
# https://nodejs.org/
```

#### Linux (Ubuntu/Debian)
```bash
# Atualizar repositórios
sudo apt update

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalação
node --version
npm --version
```

### Passo 2: Clonar o Projeto

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/catbutler-react.git

# Navegar para o diretório
cd catbutler-react

# Verificar estrutura do projeto
ls -la
```

### Passo 3: Instalar Dependências

```bash
# Instalar todas as dependências
npm install

# Verificar se foi instalado corretamente
npm list --depth=0
```

### Passo 4: Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# .env
VITE_APP_NAME=CatButler
VITE_APP_VERSION=1.0.0
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_MAPS_API_KEY=sua_chave_aqui
```

### Passo 5: Executar o Projeto

```bash
# Modo desenvolvimento
npm run dev

# O projeto estará disponível em:
# http://localhost:5173
```

## 🐛 Solução de Problemas

### Erro: "Node.js não encontrado"
```bash
# Verificar se Node.js está instalado
which node
# ou
where node

# Se não estiver instalado, reinstalar Node.js
```

### Erro: "npm não encontrado"
```bash
# Reinstalar npm
npm install -g npm@latest

# Ou reinstalar Node.js (npm vem incluído)
```

### Erro: "Porta 5173 já está em uso"
```bash
# Matar processo na porta 5173
npx kill-port 5173

# Ou usar uma porta diferente
npm run dev -- --port 3000
```

### Erro: "Dependências não instaladas"
```bash
# Limpar cache do npm
npm cache clean --force

# Deletar node_modules e package-lock.json
rm -rf node_modules package-lock.json

# Reinstalar dependências
npm install
```

### Erro: "Permissão negada"
```bash
# Linux/macOS - Dar permissão de execução
chmod +x node_modules/.bin/*

# Windows - Executar como administrador
```

## 🔄 Atualizações

### Atualizar Dependências
```bash
# Verificar dependências desatualizadas
npm outdated

# Atualizar dependências
npm update

# Atualizar dependências específicas
npm install package-name@latest
```

### Atualizar o Projeto
```bash
# Buscar atualizações
git fetch origin

# Verificar mudanças
git log HEAD..origin/main

# Aplicar atualizações
git pull origin main

# Reinstalar dependências se necessário
npm install
```

## 📱 Testes em Dispositivos Móveis

### Usando o IP Local
```bash
# Descobrir seu IP local
ipconfig getifaddr en0  # macOS
ipconfig                # Windows
hostname -I             # Linux

# Executar com host
npm run dev -- --host

# Acessar de outros dispositivos
# http://SEU_IP:5173
```

### Usando ngrok (Túnel)
```bash
# Instalar ngrok
npm install -g ngrok

# Executar o projeto
npm run dev

# Em outro terminal, criar túnel
ngrok http 5173

# Usar a URL fornecida pelo ngrok
```

## 🚀 Deploy

### Build para Produção
```bash
# Criar build otimizado
npm run build

# Verificar build
npm run preview
```

### Deploy no Vercel
```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Deploy no Netlify
```bash
# Build
npm run build

# Upload da pasta dist/ para Netlify
# Ou conectar repositório Git
```

## 📊 Monitoramento

### Verificar Performance
```bash
# Analisar bundle
npm run build
npx vite-bundle-analyzer dist

# Verificar tamanho
du -sh dist/
```

### Logs de Desenvolvimento
```bash
# Executar com logs detalhados
DEBUG=vite:* npm run dev

# Verificar erros
npm run dev 2>&1 | tee dev.log
```

## 🔧 Configurações Avançadas

### Configurar Proxy para API
```javascript
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
}
```

### Configurar PWA
```bash
# Instalar plugin PWA
npm install vite-plugin-pwa -D

# Configurar no vite.config.js
```

## 📞 Suporte

Se encontrar problemas durante a instalação:

1. **Verifique os pré-requisitos**
2. **Consulte a seção de solução de problemas**
3. **Abra uma issue no GitHub**
4. **Entre em contato**: [contato@catbutler.com](mailto:contato@catbutler.com)

---

**Próximo passo**: Consulte o [Guia de Desenvolvimento](DEVELOPMENT.md) para começar a contribuir com o projeto.

