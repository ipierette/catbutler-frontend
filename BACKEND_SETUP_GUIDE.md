# 🛠️ Guia de Setup - Backend CatButler

## Configuração do Ambiente de Desenvolvimento

---

## 🎯 Pré-requisitos

- **Node.js 18+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **VS Code** (recomendado) - [Download](https://code.visualstudio.com/)
- Conta **GitHub** (gratuita)
- Conta **Supabase** (gratuita)
- Conta **Railway** ou **Render** (gratuita)
- Conta **Groq** (gratuita)

---

## 🚀 Setup Inicial

### **1. Clonar e Configurar Projeto**

```bash
# Criar novo repositório para o backend
mkdir catbutler-backend
cd catbutler-backend

# Inicializar projeto Node.js
npm init -y

# Instalar dependências principais
npm install express typescript @types/node @types/express
npm install cors helmet morgan dotenv zod winston
npm install @supabase/supabase-js groq-sdk nodemailer
npm install node-cron bcrypt jsonwebtoken

# Instalar dependências de desenvolvimento
npm install -D nodemon ts-node @types/cors @types/morgan
npm install -D @types/bcrypt @types/jsonwebtoken @types/nodemailer
npm install -D jest @types/jest supertest @types/supertest
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier eslint-config-prettier
```

### **2. Estrutura de Pastas**

```
catbutler-backend/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── users.controller.ts
│   │   ├── recipes.controller.ts
│   │   ├── cleaning.controller.ts
│   │   ├── shopping.controller.ts
│   │   ├── calendar.controller.ts
│   │   └── chat.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── rate-limit.middleware.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── users.routes.ts
│   │   ├── recipes.routes.ts
│   │   ├── cleaning.routes.ts
│   │   ├── shopping.routes.ts
│   │   ├── calendar.routes.ts
│   │   └── chat.routes.ts
│   ├── services/
│   │   ├── supabase.service.ts
│   │   ├── ai.service.ts
│   │   ├── email.service.ts
│   │   └── logger.service.ts
│   ├── types/
│   │   ├── database.types.ts
│   │   ├── api.types.ts
│   │   └── auth.types.ts
│   ├── utils/
│   │   ├── validation.utils.ts
│   │   ├── crypto.utils.ts
│   │   └── response.utils.ts
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── ai.config.ts
│   │   └── email.config.ts
│   ├── app.ts
│   └── server.ts
├── tests/
│   ├── __mocks__/
│   ├── controllers/
│   ├── middleware/
│   └── services/
├── docs/
│   ├── api.md
│   └── database.md
├── scripts/
│   ├── setup-db.sql
│   └── seed-data.sql
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── jest.config.js
├── .eslintrc.js
├── .prettierrc
└── README.md
```

### **3. Configuração TypeScript**

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "node",
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"],
      "@/controllers/*": ["controllers/*"],
      "@/middleware/*": ["middleware/*"],
      "@/services/*": ["services/*"],
      "@/types/*": ["types/*"],
      "@/utils/*": ["utils/*"],
      "@/config/*": ["config/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### **4. Scripts do Package.json**

```json
{
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "format": "prettier --write src/**/*.ts",
    "db:migrate": "node scripts/run-migrations.js",
    "db:seed": "node scripts/seed-database.js"
  }
}
```

---

## 🔧 Configuração dos Serviços

### **1. Supabase Setup**

1. **Criar Projeto**: [supabase.com](https://supabase.com)
2. **Copiar credenciais**:
   - URL do projeto
   - Anon key
   - Service role key
3. **Executar SQL Schema** (disponível no PRD)

```typescript
// src/config/database.config.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### **2. Groq AI Setup**

1. **Criar conta**: [console.groq.com](https://console.groq.com)
2. **Gerar API Key**
3. **Configurar serviço**:

```typescript
// src/services/ai.service.ts
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!
});

export class AIService {
  static async generateRecipe(ingredients: string[]) {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Você é um chef brasileiro especializado em receitas práticas...'
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
    
    return completion.choices[0]?.message?.content;
  }
}
```

### **3. Email Setup (Gmail SMTP)**

1. **Ativar 2FA** na conta Gmail
2. **Gerar App Password**
3. **Configurar serviço**:

```typescript
// src/services/email.service.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export class EmailService {
  static async sendFamilyInvite(email: string, familyName: string) {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: `Convite para ${familyName} - CatButler`,
      html: `
        <h1>Você foi convidado para a família ${familyName}!</h1>
        <p>Clique no link para aceitar: <a href="${process.env.FRONTEND_URL}/accept-invite">Aceitar</a></p>
      `
    };
    
    return transporter.sendMail(mailOptions);
  }
}
```

---

## 🏗️ Implementação Base

### **1. App Principal**

```typescript
// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorMiddleware } from '@/middleware/error.middleware';
import { authRoutes } from '@/routes/auth.routes';
import { usersRoutes } from '@/routes/users.routes';
import { recipesRoutes } from '@/routes/recipes.routes';

const app = express();

// Middleware global
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Routes
app.use('/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/recipes', recipesRoutes);

// Error handling
app.use(errorMiddleware);

export { app };
```

### **2. Middleware de Autenticação**

```typescript
// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { supabase } from '@/config/database.config';

export async function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token obrigatório' });
    }
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ error: 'Token inválido' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
```

### **3. Exemplo de Controller**

```typescript
// src/controllers/recipes.controller.ts
import { Request, Response } from 'express';
import { supabase } from '@/config/database.config';
import { AIService } from '@/services/ai.service';
import { z } from 'zod';

const createRecipeSchema = z.object({
  title: z.string().min(1).max(200),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
  prep_time: z.number().optional(),
  difficulty: z.enum(['facil', 'medio', 'dificil']).optional(),
  meal_type: z.enum(['cafe', 'almoco', 'jantar', 'lanche']).optional()
});

export class RecipesController {
  static async createRecipe(req: Request, res: Response) {
    try {
      const data = createRecipeSchema.parse(req.body);
      
      const { data: recipe, error } = await supabase
        .from('recipes')
        .insert({
          ...data,
          user_id: req.user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      res.status(201).json(recipe);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
  static async generateRecipe(req: Request, res: Response) {
    try {
      const { ingredients } = req.body;
      
      if (!ingredients || !Array.isArray(ingredients)) {
        return res.status(400).json({ error: 'Ingredientes obrigatórios' });
      }
      
      const recipeText = await AIService.generateRecipe(ingredients);
      
      res.json({ recipe: recipeText });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao gerar receita' });
    }
  }
}
```

---

## 🚀 Deploy

### **1. Railway Deploy**

1. **Conectar GitHub**: [railway.app](https://railway.app)
2. **Criar novo projeto**
3. **Configurar variáveis de ambiente**
4. **Deploy automático**

### **2. Render Deploy**

1. **Conectar GitHub**: [render.com](https://render.com)
2. **Criar Web Service**
3. **Configurar build command**: `npm run build`
4. **Configurar start command**: `npm start`

### **3. Environment Variables**

```env
# .env.example
NODE_ENV=production
PORT=3000

# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# AI
GROQ_API_KEY=your-groq-api-key

# Email
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend
FRONTEND_URL=https://catbutler-frontend.vercel.app

# Security
JWT_SECRET=your-jwt-secret
```

---

## 🧪 Testes

### **1. Setup Jest**

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/server.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html']
};
```

### **2. Exemplo de Teste**

```typescript
// tests/controllers/recipes.test.ts
import request from 'supertest';
import { app } from '@/app';

describe('Recipes Controller', () => {
  describe('POST /api/recipes', () => {
    it('should create a new recipe', async () => {
      const recipeData = {
        title: 'Arroz com Feijão',
        ingredients: ['arroz', 'feijão', 'alho'],
        instructions: ['Cozinhe o arroz', 'Prepare o feijão']
      };
      
      const response = await request(app)
        .post('/api/recipes')
        .set('Authorization', 'Bearer valid-token')
        .send(recipeData)
        .expect(201);
      
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(recipeData.title);
    });
  });
});
```

---

## 📚 Recursos Adicionais

### **Documentação APIs**
- **Postman Collection**: Será disponibilizada
- **OpenAPI/Swagger**: Configuração automática
- **Insomnia Workspace**: Para testes

### **Monitoramento**
- **Winston Logs**: Estruturados em JSON
- **Performance Metrics**: CPU, Memória, Requests
- **Error Tracking**: Logs de erro centralizados

### **Escalabilidade**
- **Rate Limiting**: Por IP e usuário
- **Caching**: Redis (futuro)
- **CDN**: Para assets estáticos

---

## ✅ Checklist de Setup

- [ ] Node.js 18+ instalado
- [ ] Projeto criado e dependências instaladas
- [ ] Estrutura de pastas configurada
- [ ] TypeScript configurado
- [ ] Conta Supabase criada e configurada
- [ ] Schema do banco executado
- [ ] Conta Groq criada e API key obtida
- [ ] Gmail SMTP configurado
- [ ] Environment variables configuradas
- [ ] Testes básicos funcionando
- [ ] Deploy realizado com sucesso

---

**Próximos Passos**: Depois do setup, comece implementando a autenticação básica e APIs de usuários seguindo o cronograma do PRD.

**Suporte**: Em caso de dúvidas, consulte a documentação oficial de cada tecnologia ou abra uma issue no repositório.
