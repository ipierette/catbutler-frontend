# 📡 API Examples - CatButler Backend

## Exemplos de Uso das APIs

---

## 🔐 Autenticação

### **Registro de Usuário**
```http
POST /auth/signup
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senha123",
  "name": "João Silva"
}
```

**Resposta:**
```json
{
  "user": {
    "id": "uuid",
    "email": "usuario@exemplo.com",
    "name": "João Silva",
    "created_at": "2025-01-20T10:00:00Z"
  },
  "session": {
    "access_token": "jwt-token",
    "refresh_token": "refresh-token",
    "expires_at": 1642678800
  }
}
```

### **Login**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

---

## 👤 Usuários

### **Obter Perfil**
```http
GET /api/users/profile
Authorization: Bearer jwt-token
```

**Resposta:**
```json
{
  "id": "uuid",
  "email": "usuario@exemplo.com",
  "name": "João Silva",
  "avatar_url": null,
  "preferences": {
    "dietary_restrictions": ["vegetariano"],
    "favorite_cuisines": ["brasileira", "italiana"]
  },
  "created_at": "2025-01-20T10:00:00Z"
}
```

### **Atualizar Configurações**
```http
PUT /api/users/settings
Authorization: Bearer jwt-token
Content-Type: application/json

{
  "theme": "dark",
  "notifications": {
    "recipes": true,
    "shopping": true,
    "cleaning": false
  },
  "language": "pt-BR"
}
```

---

## 👥 Conta Familiar

### **Criar Conta Familiar**
```http
POST /api/family
Authorization: Bearer jwt-token
Content-Type: application/json

{
  "name": "Família Silva"
}
```

### **Convidar Membro**
```http
POST /api/family/invite
Authorization: Bearer jwt-token
Content-Type: application/json

{
  "email": "membro@exemplo.com",
  "role": "member"
}
```

**Resposta:**
```json
{
  "message": "Convite enviado com sucesso",
  "invite_id": "uuid",
  "expires_at": "2025-01-27T10:00:00Z"
}
```

---

## 🍳 CozinhaIA

### **Listar Receitas**
```http
GET /api/recipes?page=1&limit=10&difficulty=facil&meal_type=almoco
Authorization: Bearer jwt-token
```

**Resposta:**
```json
{
  "recipes": [
    {
      "id": "uuid",
      "title": "Arroz com Feijão Tradicional",
      "description": "Prato clássico brasileiro",
      "ingredients": [
        "2 xícaras de arroz",
        "1 xícara de feijão",
        "3 dentes de alho",
        "1 cebola média"
      ],
      "instructions": [
        "Refogue o alho e a cebola",
        "Adicione o arroz e doure",
        "Acrescente água fervente",
        "Cozinhe por 18 minutos"
      ],
      "prep_time": 30,
      "difficulty": "facil",
      "meal_type": "almoco",
      "rating": 4.5,
      "tags": ["brasileiro", "tradicional"],
      "created_at": "2025-01-20T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### **Criar Receita**
```http
POST /api/recipes
Authorization: Bearer jwt-token
Content-Type: application/json

{
  "title": "Omelete Simples",
  "description": "Omelete rápida e nutritiva",
  "ingredients": [
    "3 ovos",
    "sal a gosto",
    "1 colher de azeite",
    "queijo ralado (opcional)"
  ],
  "instructions": [
    "Bata os ovos com sal",
    "Aqueça o azeite na frigideira",
    "Despeje os ovos e aguarde firmar",
    "Adicione queijo e dobre"
  ],
  "prep_time": 10,
  "difficulty": "facil",
  "meal_type": "cafe"
}
```

### **Gerar Receita com IA**
```http
POST /api/recipes/generate
Authorization: Bearer jwt-token
Content-Type: application/json

{
  "ingredients": ["frango", "arroz", "cenoura", "alho"],
  "meal_type": "jantar",
  "difficulty": "medio",
  "dietary_restrictions": ["sem lactose"]
}
```

**Resposta:**
```json
{
  "recipe": {
    "title": "Frango com Arroz e Cenoura",
    "description": "Prato completo e saudável",
    "ingredients": [
      "500g de peito de frango cortado em cubos",
      "2 xícaras de arroz",
      "2 cenouras cortadas em cubos",
      "4 dentes de alho picados",
      "sal e pimenta a gosto"
    ],
    "instructions": [
      "Tempere o frango com sal, pimenta e alho",
      "Doure o frango em uma panela",
      "Adicione as cenouras e refogue",
      "Acrescente o arroz e água",
      "Cozinhe até o arroz ficar no ponto"
    ],
    "prep_time": 35,
    "difficulty": "medio",
    "tips": "Sirva com salada verde para uma refeição completa"
  }
}
```

### **Gerar Cardápio Semanal**
```http
POST /api/meal-plans/generate
Authorization: Bearer jwt-token
Content-Type: application/json

{
  "preferences": {
    "breakfast_complexity": "facil",
    "lunch_complexity": "medio",
    "dinner_complexity": "facil",
    "dietary_restrictions": ["vegetariano"],
    "favorite_cuisines": ["brasileira", "italiana"]
  },
  "week_start": "2025-01-20"
}
```

**Resposta:**
```json
{
  "meal_plan": {
    "id": "uuid",
    "week_start": "2025-01-20",
    "meals": {
      "monday": {
        "breakfast": {
          "recipe_id": "uuid",
          "title": "Vitamina de Banana",
          "prep_time": 5
        },
        "lunch": {
          "recipe_id": "uuid", 
          "title": "Macarrão ao Molho de Tomate",
          "prep_time": 25
        },
        "dinner": {
          "recipe_id": "uuid",
          "title": "Omelete com Queijo",
          "prep_time": 10
        }
      },
      "tuesday": {
        // ... outros dias
      }
    },
    "shopping_list": [
      "bananas (6 unidades)",
      "leite (1 litro)",
      "macarrão (500g)",
      "molho de tomate (1 lata)"
    ]
  }
}
```

---

## 🧹 FaxinaIA

### **Criar Rotina de Limpeza**
```http
POST /api/cleaning/routines
Authorization: Bearer jwt-token
Content-Type: application/json

{
  "name": "Rotina Casa 3 Quartos",
  "room_count": 6,
  "schedule": {
    "daily": [
      {
        "task": "Fazer as camas",
        "rooms": ["quarto1", "quarto2", "quarto3"],
        "estimated_time": 15,
        "priority": "alta"
      },
      {
        "task": "Lavar louça",
        "rooms": ["cozinha"],
        "estimated_time": 20,
        "priority": "alta"
      }
    ],
    "weekly": [
      {
        "task": "Aspirar tapetes",
        "rooms": ["sala", "quartos"],
        "estimated_time": 45,
        "priority": "alta",
        "frequency": "semanal"
      }
    ]
  }
}
```

### **Marcar Tarefa como Concluída**
```http
POST /api/cleaning/progress
Authorization: Bearer jwt-token
Content-Type: application/json

{
  "routine_id": "uuid",
  "task_key": "daily-fazer-camas",
  "completed_at": "2025-01-20T08:30:00Z",
  "notes": "Trocadas as roupas de cama do quarto principal"
}
```

### **Obter Técnicas de Limpeza**
```http
GET /api/cleaning/techniques?surface=madeira&difficulty=facil
Authorization: Bearer jwt-token
```

**Resposta:**
```json
{
  "techniques": [
    {
      "id": "uuid",
      "name": "Técnica do Pano Úmido",
      "description": "Para remover poeira sem espalhar",
      "surface": "móveis de madeira",
      "products": ["água", "amaciante"],
      "instructions": [
        "Misture água com algumas gotas de amaciante",
        "Umedeça o pano levemente",
        "Passe no sentido das fibras da madeira",
        "Finalize com pano seco"
      ],
      "estimated_time": "2-3 min por móvel",
      "difficulty": "facil",
      "tips": "Nunca use produtos abrasivos em madeira envernizada"
    }
  ]
}
```

---

## 🛒 MercadoIA

### **Criar Lista de Compras**
```http
POST /api/shopping/lists
Authorization: Bearer jwt-token
Content-Type: application/json

{
  "name": "Compras da Semana",
  "items": [
    {
      "name": "Arroz 5kg",
      "category": "grãos",
      "quantity": 1,
      "unit": "pacote",
      "priority": "alta",
      "estimated_price": 18.90
    },
    {
      "name": "Frango 1kg",
      "category": "carnes", 
      "quantity": 2,
      "unit": "kg",
      "priority": "alta",
      "estimated_price": 12.50
    }
  ],
  "budget": 200.00
}
```

### **Gerar Lista Inteligente**
```http
POST /api/shopping/generate
Authorization: Bearer jwt-token
Content-Type: application/json

{
  "meal_plan_id": "uuid",
  "household_size": 4,
  "dietary_restrictions": ["sem glúten"],
  "budget": 300.00,
  "store_preference": "supermercado"
}
```

**Resposta:**
```json
{
  "shopping_list": {
    "id": "uuid",
    "name": "Lista Gerada - Semana 20/01",
    "items": [
      {
        "name": "Arroz integral 5kg",
        "category": "grãos",
        "quantity": 1,
        "estimated_price": 22.90,
        "stores": [
          {
            "name": "Supermercado A",
            "price": 22.90,
            "distance": "0.5km"
          },
          {
            "name": "Supermercado B", 
            "price": 24.50,
            "distance": "1.2km"
          }
        ],
        "needed_for": ["Arroz com legumes - Segunda", "Risotto - Quinta"]
      }
    ],
    "estimated_total": 180.50,
    "potential_savings": 15.30
  }
}
```

### **Comparar Preços**
```http
GET /api/shopping/prices?product=arroz&location=sao-paulo&limit=5
Authorization: Bearer jwt-token
```

**Resposta:**
```json
{
  "product": "arroz",
  "prices": [
    {
      "store": "Supermercado Central",
      "price": 18.90,
      "product_name": "Arroz Tio João 5kg",
      "distance": "0.8km",
      "last_updated": "2025-01-20T09:00:00Z",
      "promotion": null
    },
    {
      "store": "Atacadão",
      "price": 16.50,
      "product_name": "Arroz Camil 5kg",
      "distance": "2.1km", 
      "last_updated": "2025-01-20T08:30:00Z",
      "promotion": "2 por R$ 30,00"
    }
  ],
  "average_price": 17.70,
  "best_deal": {
    "store": "Atacadão",
    "savings": 2.40
  }
}
```

---

## 📅 Agenda

### **Criar Evento**
```http
POST /api/calendar/events
Authorization: Bearer jwt-token
Content-Type: application/json

{
  "title": "Preparar jantar especial",
  "description": "Jantar romântico para aniversário de casamento",
  "start_date": "2025-01-25T18:00:00Z",
  "end_date": "2025-01-25T21:00:00Z",
  "category": "culinaria",
  "priority": "alta",
  "reminders": [
    {
      "type": "notification",
      "minutes_before": 60
    }
  ]
}
```

### **Obter Eventos da Semana**
```http
GET /api/calendar/events?start_date=2025-01-20&end_date=2025-01-26&category=limpeza
Authorization: Bearer jwt-token
```

**Resposta:**
```json
{
  "events": [
    {
      "id": "uuid",
      "title": "Faxina geral da casa",
      "description": "Limpeza profunda de todos os cômodos",
      "start_date": "2025-01-22T09:00:00Z",
      "end_date": "2025-01-22T16:00:00Z",
      "category": "limpeza",
      "priority": "media",
      "status": "pending",
      "created_at": "2025-01-20T10:00:00Z"
    }
  ]
}
```

### **Estatísticas da Agenda**
```http
GET /api/calendar/stats?month=2025-01
Authorization: Bearer jwt-token
```

**Resposta:**
```json
{
  "stats": {
    "total_events": 24,
    "completed_events": 18,
    "completion_rate": 75,
    "categories": {
      "culinaria": 8,
      "limpeza": 6,
      "compras": 4,
      "pessoal": 6
    },
    "productivity_score": 78,
    "streak_days": 5
  }
}
```

---

## 🤖 Assistente IA

### **Enviar Mensagem**
```http
POST /api/chat/message
Authorization: Bearer jwt-token
Content-Type: application/json

{
  "message": "Como posso remover manchas de gordura da roupa?",
  "context": "cleaning",
  "conversation_id": "uuid"
}
```

**Resposta:**
```json
{
  "response": "Para remover manchas de gordura da roupa, você pode usar algumas técnicas eficazes:\n\n1. **Detergente líquido**: Aplique diretamente na mancha antes de lavar\n2. **Bicarbonato**: Faça uma pasta com água e deixe agir por 30 minutos\n3. **Água quente**: Sempre use a temperatura mais alta que o tecido permitir\n\nSe a mancha for antiga, deixe a peça de molho com detergente por algumas horas antes de lavar normalmente.",
  "suggestions": [
    "Como remover outras manchas difíceis?",
    "Dicas para lavar roupas delicadas",
    "Produtos caseiros para limpeza"
  ],
  "conversation_id": "uuid",
  "message_id": "uuid"
}
```

### **Obter Sugestões Rápidas**
```http
GET /api/chat/suggestions?context=cooking&time_of_day=morning
Authorization: Bearer jwt-token
```

**Resposta:**
```json
{
  "suggestions": [
    {
      "text": "Que tal um café da manhã nutritivo hoje?",
      "action": "generate_breakfast_recipe",
      "icon": "coffee"
    },
    {
      "text": "Planejar almoço com ingredientes da geladeira",
      "action": "suggest_lunch_recipe",
      "icon": "utensils"
    },
    {
      "text": "Verificar lista de compras para a semana",
      "action": "review_shopping_list",
      "icon": "shopping-cart"
    }
  ]
}
```

---

## 📊 Analytics e Histórico

### **Dashboard Geral**
```http
GET /api/analytics/dashboard?period=30days
Authorization: Bearer jwt-token
```

**Resposta:**
```json
{
  "summary": {
    "recipes_created": 12,
    "meals_planned": 21,
    "cleaning_tasks_completed": 45,
    "shopping_lists_created": 8,
    "money_saved": 127.50
  },
  "trends": {
    "most_cooked_recipes": [
      "Arroz com Feijão",
      "Omelete Simples", 
      "Macarrão à Carbonara"
    ],
    "favorite_cleaning_day": "sábado",
    "average_shopping_budget": 180.00
  },
  "achievements": [
    {
      "name": "Chef Iniciante",
      "description": "Criou 10 receitas",
      "earned_at": "2025-01-18T10:00:00Z"
    }
  ]
}
```

### **Histórico de Atividades**
```http
GET /api/history?limit=20&type=recipe_created&date_from=2025-01-01
Authorization: Bearer jwt-token
```

**Resposta:**
```json
{
  "activities": [
    {
      "id": "uuid",
      "action_type": "recipe_created",
      "entity_type": "recipe",
      "entity_id": "uuid",
      "metadata": {
        "recipe_title": "Bolo de Chocolate",
        "difficulty": "medio",
        "prep_time": 60
      },
      "created_at": "2025-01-20T14:30:00Z"
    },
    {
      "id": "uuid",
      "action_type": "cleaning_task_completed",
      "entity_type": "cleaning_task",
      "entity_id": "uuid",
      "metadata": {
        "task_name": "Passar aspirador",
        "room": "sala",
        "duration_minutes": 15
      },
      "created_at": "2025-01-20T10:15:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "has_next": true
  }
}
```

---

## ⚠️ Tratamento de Erros

### **Erro de Validação**
```json
{
  "error": "Validation Error",
  "message": "Dados inválidos",
  "details": [
    {
      "field": "email",
      "message": "Email deve ter um formato válido"
    },
    {
      "field": "password",
      "message": "Senha deve ter pelo menos 6 caracteres"
    }
  ],
  "code": "VALIDATION_ERROR"
}
```

### **Erro de Autenticação**
```json
{
  "error": "Unauthorized",
  "message": "Token inválido ou expirado",
  "code": "AUTH_ERROR"
}
```

### **Erro de Limite de Rate**
```json
{
  "error": "Rate Limit Exceeded", 
  "message": "Muitas requisições. Tente novamente em 60 segundos",
  "retry_after": 60,
  "code": "RATE_LIMIT_ERROR"
}
```

---

## 🔧 Headers Padrão

**Todas as requisições autenticadas devem incluir:**
```http
Authorization: Bearer jwt-token
Content-Type: application/json
X-Client-Version: 1.0.0
```

**Respostas incluem:**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642681200
```

---

## 📚 Status Codes

- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Erro de validação
- **401**: Não autorizado
- **403**: Proibido
- **404**: Não encontrado
- **429**: Rate limit excedido
- **500**: Erro interno do servidor

---

**Documentação completa disponível em**: `/docs` (quando o backend estiver rodando)
