# 📋 PRD - Backend CatButler
## Product Requirements Document para Backend

---

## 🎯 Visão Geral

**Produto**: Backend API para CatButler - Assistente Doméstico Inteligente  
**Versão**: 1.0.0  
**Data**: Janeiro 2025  
**Stakeholder**: Izadora Pierette  

### 🎪 Objetivo Principal
Desenvolver uma API RESTful robusta e escalável para suportar todas as funcionalidades do CatButler frontend, utilizando **exclusivamente tecnologias gratuitas** e com deploy em plataformas free-tier.

---

## 🏗️ Arquitetura Técnica

### **Stack Tecnológico (100% Gratuito)**

#### **Backend Framework**
- **Node.js + Express.js** - Runtime e framework web
- **TypeScript** - Tipagem estática para maior robustez
- **Zod** - Validação de schemas e tipos

#### **Banco de Dados**
- **PostgreSQL** (Supabase Free Tier)
  - 500MB storage gratuito
  - 2 projetos ativos
  - API automática + Real-time
  - Row Level Security (RLS)

#### **Autenticação & Autorização**
- **Supabase Auth** - Sistema completo gratuito
  - Login social (Google, GitHub)
  - Magic links por email
  - JWT tokens automáticos
  - Rate limiting integrado

#### **Storage & Uploads**
- **Supabase Storage** - Armazenamento de arquivos
  - 1GB gratuito
  - CDN global automático
  - Redimensionamento de imagens

#### **Deploy & Hosting**
- **Railway** ou **Render** (Free Tier)
  - Deploy automático via Git
  - SSL gratuito
  - Monitoramento básico
  - Environment variables

#### **Funcionalidades Extras**
- **Node Cron** - Agendamento de tarefas
- **Nodemailer** - Envio de emails (via Gmail SMTP gratuito)
- **Winston** - Logging estruturado
- **Helmet** - Segurança HTTP
- **CORS** - Configuração de domínios

---

## 📊 Modelagem de Dados

### **Estrutura do Banco (PostgreSQL + Supabase)**

```sql
-- Usuários (gerenciado pelo Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100),
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Contas Familiares
CREATE TABLE family_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  admin_user_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Membros da Família
CREATE TABLE family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_account_id UUID REFERENCES family_accounts(id),
  user_id UUID REFERENCES users(id),
  role VARCHAR(20) DEFAULT 'member', -- admin, member
  status VARCHAR(20) DEFAULT 'pending', -- pending, active, inactive
  invited_at TIMESTAMP DEFAULT NOW(),
  joined_at TIMESTAMP
);

-- Receitas
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  family_account_id UUID REFERENCES family_accounts(id),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  ingredients JSONB NOT NULL,
  instructions JSONB NOT NULL,
  prep_time INTEGER, -- em minutos
  difficulty VARCHAR(20), -- facil, medio, dificil
  meal_type VARCHAR(20), -- cafe, almoco, jantar, lanche
  rating DECIMAL(2,1),
  tags VARCHAR(100)[],
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Cardápios Semanais
CREATE TABLE meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  family_account_id UUID REFERENCES family_accounts(id),
  week_start DATE NOT NULL,
  meals JSONB NOT NULL, -- {monday: {cafe: recipe_id, almoco: recipe_id, ...}}
  created_at TIMESTAMP DEFAULT NOW()
);

-- Listas de Compras
CREATE TABLE shopping_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  family_account_id UUID REFERENCES family_accounts(id),
  name VARCHAR(100) NOT NULL,
  items JSONB NOT NULL,
  budget DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'active', -- active, completed, archived
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Rotinas de Limpeza
CREATE TABLE cleaning_routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  family_account_id UUID REFERENCES family_accounts(id),
  name VARCHAR(100) NOT NULL,
  room_count INTEGER DEFAULT 4,
  tasks JSONB NOT NULL,
  schedule JSONB NOT NULL, -- {diaria: [...], semanal: [...]}
  created_at TIMESTAMP DEFAULT NOW()
);

-- Progresso de Tarefas
CREATE TABLE task_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  routine_id UUID REFERENCES cleaning_routines(id),
  task_key VARCHAR(100) NOT NULL,
  completed_at TIMESTAMP NOT NULL,
  notes TEXT
);

-- Eventos da Agenda
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  family_account_id UUID REFERENCES family_accounts(id),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  category VARCHAR(50),
  priority VARCHAR(20), -- alta, media, baixa
  status VARCHAR(20) DEFAULT 'pending', -- pending, completed, cancelled
  created_at TIMESTAMP DEFAULT NOW()
);

-- Histórico de Atividades
CREATE TABLE activity_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  family_account_id UUID REFERENCES family_accounts(id),
  action_type VARCHAR(50) NOT NULL, -- recipe_created, task_completed, etc
  entity_type VARCHAR(50) NOT NULL, -- recipe, task, shopping_list, etc
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Configurações do Usuário
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) UNIQUE,
  theme VARCHAR(20) DEFAULT 'light',
  notifications JSONB DEFAULT '{}',
  language VARCHAR(10) DEFAULT 'pt-BR',
  timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo',
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔗 API Endpoints

### **Autenticação** (Supabase Auth)
```
POST   /auth/signup           # Criar conta
POST   /auth/login            # Login
POST   /auth/logout           # Logout
POST   /auth/refresh          # Renovar token
POST   /auth/forgot-password  # Recuperar senha
POST   /auth/reset-password   # Resetar senha
```

### **Usuários**
```
GET    /api/users/profile     # Perfil do usuário
PUT    /api/users/profile     # Atualizar perfil
GET    /api/users/settings    # Configurações
PUT    /api/users/settings    # Atualizar configurações
DELETE /api/users/account     # Deletar conta
```

### **Conta Familiar**
```
GET    /api/family            # Dados da conta familiar
POST   /api/family            # Criar conta familiar
PUT    /api/family            # Atualizar conta familiar
POST   /api/family/invite     # Convidar membro
PUT    /api/family/members/:id # Atualizar membro
DELETE /api/family/members/:id # Remover membro
GET    /api/family/members    # Listar membros
```

### **CozinhaIA**
```
GET    /api/recipes           # Listar receitas
POST   /api/recipes           # Criar receita
GET    /api/recipes/:id       # Detalhes da receita
PUT    /api/recipes/:id       # Atualizar receita
DELETE /api/recipes/:id       # Deletar receita
POST   /api/recipes/generate  # Gerar receita com IA

GET    /api/meal-plans        # Listar cardápios
POST   /api/meal-plans        # Criar cardápio
GET    /api/meal-plans/:id    # Detalhes do cardápio
PUT    /api/meal-plans/:id    # Atualizar cardápio
DELETE /api/meal-plans/:id    # Deletar cardápio
POST   /api/meal-plans/generate # Gerar cardápio com IA
```

### **FaxinaIA**
```
GET    /api/cleaning/routines # Listar rotinas
POST   /api/cleaning/routines # Criar rotina
GET    /api/cleaning/routines/:id # Detalhes da rotina
PUT    /api/cleaning/routines/:id # Atualizar rotina
DELETE /api/cleaning/routines/:id # Deletar rotina

GET    /api/cleaning/progress # Progresso das tarefas
POST   /api/cleaning/progress # Marcar tarefa como concluída
GET    /api/cleaning/techniques # Técnicas de limpeza
GET    /api/cleaning/products # Produtos recomendados
```

### **MercadoIA**
```
GET    /api/shopping/lists    # Listar listas de compras
POST   /api/shopping/lists    # Criar lista
GET    /api/shopping/lists/:id # Detalhes da lista
PUT    /api/shopping/lists/:id # Atualizar lista
DELETE /api/shopping/lists/:id # Deletar lista
POST   /api/shopping/generate # Gerar lista com IA

GET    /api/shopping/prices   # Comparar preços
POST   /api/shopping/budget   # Atualizar orçamento
```

### **Agenda**
```
GET    /api/calendar/events   # Listar eventos
POST   /api/calendar/events   # Criar evento
GET    /api/calendar/events/:id # Detalhes do evento
PUT    /api/calendar/events/:id # Atualizar evento
DELETE /api/calendar/events/:id # Deletar evento
GET    /api/calendar/stats    # Estatísticas da agenda
```

### **Histórico & Analytics**
```
GET    /api/history           # Histórico de atividades
GET    /api/analytics/dashboard # Dashboard geral
GET    /api/analytics/recipes # Estatísticas de receitas
GET    /api/analytics/cleaning # Estatísticas de limpeza
GET    /api/analytics/shopping # Estatísticas de compras
```

### **Assistente IA**
```
POST   /api/chat/message      # Enviar mensagem para IA
GET    /api/chat/history      # Histórico de conversas
DELETE /api/chat/history      # Limpar histórico
POST   /api/chat/suggestions  # Obter sugestões rápidas
```

---

## 🤖 Integração com IA

### **API Gratuita: Groq AI**
- **Modelo**: Llama 3.1 70B
- **Rate Limit**: 30 requests/minuto (gratuito)
- **Contexto**: 32k tokens
- **Custo**: $0 até 14,400 requests/dia

### **Funcionalidades IA**
1. **Geração de Receitas**: Baseada em ingredientes
2. **Cardápios Semanais**: Planejamento nutricional
3. **Listas de Compras**: Sugestões inteligentes
4. **Chat Assistente**: Respostas contextuais
5. **Rotinas de Limpeza**: Personalização por casa

### **Implementação**
```javascript
// Exemplo de integração com Groq
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function generateRecipe(ingredients: string[]) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'Você é um chef especializado em receitas brasileiras...'
      },
      {
        role: 'user',
        content: `Crie uma receita usando: ${ingredients.join(', ')}`
      }
    ],
    model: 'llama-3.1-70b-versatile',
    temperature: 0.7,
    max_tokens: 1000
  });
  
  return chatCompletion.choices[0]?.message?.content;
}
```

---

## 🔐 Segurança & Autenticação

### **Row Level Security (RLS)**
```sql
-- Exemplo: Usuários só acessam seus próprios dados
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own recipes" ON recipes
  FOR ALL USING (
    auth.uid() = user_id OR 
    auth.uid() IN (
      SELECT user_id FROM family_members 
      WHERE family_account_id = recipes.family_account_id 
      AND status = 'active'
    )
  );
```

### **Middleware de Autenticação**
```javascript
import { createClient } from '@supabase/supabase-js';

export async function authenticateUser(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  req.user = user;
  next();
}
```

---

## 📊 Monitoramento & Analytics

### **Métricas Gratuitas**
- **Railway/Render Dashboard**: CPU, RAM, requests
- **Supabase Dashboard**: Database usage, API calls
- **Winston Logs**: Structured logging
- **Custom Analytics**: User behavior tracking

### **Health Checks**
```javascript
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version
  });
});
```

---

## 🚀 Deploy & DevOps

### **Pipeline CI/CD (GitHub Actions)**
```yaml
name: Deploy Backend
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm test
      - name: Deploy to Railway
        uses: railway-app/railway-action@v1
        with:
          api-key: ${{ secrets.RAILWAY_API_KEY }}
```

### **Environment Variables**
```env
# Database
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_KEY=xxx

# IA
GROQ_API_KEY=xxx

# Email
SMTP_HOST=smtp.gmail.com
SMTP_USER=xxx@gmail.com
SMTP_PASS=xxx

# App
NODE_ENV=production
PORT=3000
JWT_SECRET=xxx
FRONTEND_URL=https://catbutler-frontend.vercel.app
```

---

## 📋 Cronograma de Desenvolvimento

### **Fase 1: Setup & Core (Semana 1-2)**
- [x] Setup do projeto Node.js + TypeScript
- [x] Configuração Supabase + PostgreSQL
- [x] Sistema de autenticação básico
- [x] Estrutura de middlewares e routes
- [x] Deploy inicial no Railway/Render

### **Fase 2: APIs Básicas (Semana 3-4)**
- [ ] API de usuários e configurações
- [ ] API de conta familiar
- [ ] API básica de receitas
- [ ] API básica de listas de compras
- [ ] Testes unitários

### **Fase 3: IA Integration (Semana 5-6)**
- [ ] Integração com Groq AI
- [ ] Geração de receitas inteligentes
- [ ] Chat assistente funcional
- [ ] Geração de cardápios semanais

### **Fase 4: Features Avançadas (Semana 7-8)**
- [ ] Sistema de rotinas de limpeza
- [ ] Agenda com eventos
- [ ] Histórico e analytics
- [ ] Notificações por email

### **Fase 5: Polishing & Launch (Semana 9-10)**
- [ ] Otimizações de performance
- [ ] Testes de integração
- [ ] Documentação completa
- [ ] Deploy de produção

---

## 💰 Custos Previstos (Gratuito!)

### **Recursos Gratuitos Utilizados**
- **Supabase**: 500MB DB + 1GB Storage + 50GB Bandwidth
- **Railway/Render**: 500h/mês compute time
- **Groq AI**: 14,400 requests/dia (Llama 3.1)
- **GitHub**: Repositório + CI/CD Actions
- **Gmail SMTP**: 500 emails/dia

### **Escalabilidade Futura**
- **Supabase Pro**: $25/mês (8GB DB + 100GB Storage)
- **Railway Pro**: $5/mês (unlimited hours)
- **Groq Pay-as-you-go**: $0.59/1M tokens

**Total estimado para escalar**: ~$30/mês para 1000+ usuários ativos

---

## 🎯 Conclusão

Este PRD define uma arquitetura backend robusta e **100% gratuita** para o CatButler, utilizando as melhores práticas de desenvolvimento moderno com Node.js, PostgreSQL e IA integrada. A solução é projetada para escalar conforme o crescimento do produto, mantendo baixos custos operacionais.

**Próximos Passos**:
1. ✅ Aprovação do PRD
2. 🚀 Setup do ambiente de desenvolvimento
3. 📝 Início da implementação Fase 1
4. 🧪 Testes e iterações
5. 🎉 Deploy de produção

---

**Documento criado por**: Izadora Pierette  
**Data**: Janeiro 2025  
**Versão**: 1.0.0
