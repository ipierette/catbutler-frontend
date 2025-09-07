# 🔌 Guia de API - CatButler

Este documento descreve as APIs e integrações utilizadas no projeto CatButler.

## 📋 Visão Geral

O CatButler utiliza várias APIs para fornecer funcionalidades de IA e dados em tempo real:

- **OpenAI API**: Para funcionalidades de IA
- **Google Maps API**: Para localização e preços
- **APIs de Receitas**: Para sugestões culinárias
- **APIs de Mercado**: Para comparação de preços

## 🤖 IA e Machine Learning

### Funcionalidades Avançadas - Cozinha IA

#### Cardápio Semanal Inteligente

O sistema de cardápio semanal utiliza algoritmos de IA para gerar sugestões personalizadas:

```javascript
// services/cardapioService.js
export const cardapioService = {
  async gerarCardapioSemanal(ingredientes) {
    const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    const refeicoes = ['Café da Manhã', 'Almoço', 'Jantar'];
    
    return diasSemana.map(dia => ({
      dia,
      refeicoes: refeicoes.map(refeicao => {
        // Algoritmo de seleção baseado em ingredientes
        const receitasDisponiveis = this.filtrarReceitasPorIngredientes(ingredientes);
        const receitaAleatoria = this.selecionarReceitaAleatoria(receitasDisponiveis);
        
        return {
          tipo: refeicao,
          receita: receitaAleatoria || this.gerarReceitaPadrao(ingredientes)
        };
      })
    }));
  },
  
  formatarCardapioParaCopiar(cardapio) {
    let texto = "🍽️ CARDÁPIO SEMANAL - CatButler\n\n";
    
    cardapio.forEach(dia => {
      texto += `📅 ${dia.dia}\n`;
      dia.refeicoes.forEach(refeicao => {
        texto += `  • ${refeicao.tipo}: ${refeicao.receita.nome} (${refeicao.receita.tempo})\n`;
      });
      texto += "\n";
    });
    
    return texto;
  }
};
```

#### Sistema Accordion Inteligente

O sistema de accordions utiliza estados sincronizados para otimizar a experiência:

```javascript
// hooks/useAccordionState.js
export const useAccordionState = () => {
  const [activeAccordion, setActiveAccordion] = useState('ingredientes');
  const [dicasAbertas, setDicasAbertas] = useState(true);
  const [chatAberto, setChatAberto] = useState(false);
  
  const abrirChat = () => {
    setChatAberto(true);
    setDicasAbertas(false); // Fechar dicas automaticamente
  };
  
  const gerarCardapio = () => {
    setDicasAbertas(false); // Fechar dicas automaticamente
    // Lógica de geração de cardápio
  };
  
  return {
    activeAccordion,
    setActiveAccordion,
    dicasAbertas,
    setDicasAbertas,
    chatAberto,
    abrirChat,
    gerarCardapio
  };
};
```

### OpenAI Integration

#### Configuração
```javascript
// services/openai.js
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export const openai = {
  async generateRecipe(ingredients) {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Você é um chef especialista em criar receitas com ingredientes disponíveis.'
          },
          {
            role: 'user',
            content: `Crie uma receita usando estes ingredientes: ${ingredients.join(', ')}`
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });
    
    return response.json();
  }
};
```

#### Endpoints de IA

##### Gerar Receita
```javascript
POST /api/recipes/generate
Content-Type: application/json

{
  "ingredients": ["frango", "arroz", "cebola", "alho"],
  "dietary_restrictions": ["sem lactose"],
  "cooking_time": 30
}

Response:
{
  "recipe": {
    "title": "Frango Grelhado com Arroz",
    "ingredients": [...],
    "instructions": [...],
    "cooking_time": 25,
    "difficulty": "fácil"
  }
}
```

##### Sugestão de Faxina
```javascript
POST /api/cleaning/suggest
Content-Type: application/json

{
  "room": "cozinha",
  "available_time": 60,
  "cleaning_products": ["detergente", "desinfetante"]
}

Response:
{
  "tasks": [
    {
      "task": "Limpar fogão",
      "duration": 15,
      "priority": "alta",
      "products": ["detergente"]
    }
  ]
}
```

## 🗺️ Localização e Preços

### Google Maps API

#### Configuração
```javascript
// services/maps.js
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const maps = {
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }),
        (error) => reject(error)
      );
    });
  },
  
  async getNearbyStores(location, radius = 5000) {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=${radius}&type=supermarket&key=${GOOGLE_MAPS_API_KEY}`
    );
    
    return response.json();
  }
};
```

### APIs de Preços

#### Comparação de Preços
```javascript
// services/pricing.js
export const pricing = {
  async comparePrices(product, location) {
    const apis = [
      this.getMercadoLivrePrice(product, location),
      this.getMagazineLuizaPrice(product, location),
      this.getAmericanasPrice(product, location)
    ];
    
    const results = await Promise.allSettled(apis);
    return results
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value);
  },
  
  async getMercadoLivrePrice(product, location) {
    // Implementação específica do Mercado Livre
  },
  
  async getMagazineLuizaPrice(product, location) {
    // Implementação específica do Magazine Luiza
  }
};
```

## 🍳 APIs de Receitas

### Spoonacular API

#### Configuração
```javascript
// services/recipes.js
const SPOONACULAR_API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes';

export const recipes = {
  async searchByIngredients(ingredients, number = 5) {
    const response = await fetch(
      `${SPOONACULAR_BASE_URL}/findByIngredients?ingredients=${ingredients.join(',')}&number=${number}&apiKey=${SPOONACULAR_API_KEY}`
    );
    
    return response.json();
  },
  
  async getRecipeInformation(id) {
    const response = await fetch(
      `${SPOONACULAR_BASE_URL}/${id}/information?apiKey=${SPOONACULAR_API_KEY}`
    );
    
    return response.json();
  }
};
```

### Edamam API

#### Configuração
```javascript
// services/edamam.js
const EDAMAM_APP_ID = import.meta.env.VITE_EDAMAM_APP_ID;
const EDAMAM_APP_KEY = import.meta.env.VITE_EDAMAM_APP_KEY;

export const edamam = {
  async searchRecipes(query, health = [], diet = []) {
    const params = new URLSearchParams({
      q: query,
      app_id: EDAMAM_APP_ID,
      app_key: EDAMAM_APP_KEY,
      type: 'public',
      health: health.join('&'),
      diet: diet.join('&')
    });
    
    const response = await fetch(
      `https://api.edamam.com/api/recipes/v2?${params}`
    );
    
    return response.json();
  }
};
```

## 🔐 Autenticação

### JWT Authentication

#### Configuração
```javascript
// services/auth.js
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const auth = {
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },
  
  async register(userData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    return response.json();
  },
  
  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getToken() {
    return localStorage.getItem('token');
  },
  
  isAuthenticated() {
    return !!this.getToken();
  }
};
```

### Protected Routes
```javascript
// hooks/useAuth.js
import { useState, useEffect } from 'react';
import { auth } from '../services/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const token = auth.getToken();
    if (token) {
      const userData = JSON.parse(localStorage.getItem('user'));
      setUser(userData);
    }
    setLoading(false);
  }, []);
  
  const login = async (email, password) => {
    const result = await auth.login(email, password);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };
  
  const logout = () => {
    auth.logout();
    setUser(null);
  };
  
  return { user, login, logout, loading };
};
```

## 📊 Analytics

### Google Analytics

#### Configuração
```javascript
// services/analytics.js
const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID;

export const analytics = {
  init() {
    if (typeof window !== 'undefined' && GA_TRACKING_ID) {
      window.gtag('config', GA_TRACKING_ID, {
        page_title: document.title,
        page_location: window.location.href
      });
    }
  },
  
  trackEvent(action, category, label, value) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value
      });
    }
  },
  
  trackPageView(path) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', GA_TRACKING_ID, {
        page_path: path
      });
    }
  }
};
```

### Custom Analytics
```javascript
// services/customAnalytics.js
export const customAnalytics = {
  async trackUserAction(action, data) {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          data,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        })
      });
    } catch (error) {
      console.error('Analytics tracking failed:', error);
    }
  }
};
```

## 🔔 Notificações

### Push Notifications

#### Configuração
```javascript
// services/notifications.js
export const notifications = {
  async requestPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  },
  
  async showNotification(title, options) {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/favicon-192x192.png',
        badge: '/favicon-96x96.png',
        ...options
      });
      
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  }
};
```

### Service Worker
```javascript
// public/sw.js
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/favicon-192x192.png',
    badge: '/favicon-96x96.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('CatButler', options)
  );
});
```

## 🗄️ Storage

### Local Storage
```javascript
// services/storage.js
export const storage = {
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },
  
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Storage get error:', error);
      return defaultValue;
    }
  },
  
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  },
  
  clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  }
};
```

### IndexedDB
```javascript
// services/database.js
export const database = {
  async openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('CatButlerDB', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Criar stores
        if (!db.objectStoreNames.contains('recipes')) {
          db.createObjectStore('recipes', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('shoppingLists')) {
          db.createObjectStore('shoppingLists', { keyPath: 'id' });
        }
      };
    });
  },
  
  async saveData(storeName, data) {
    const db = await this.openDB();
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    return store.add(data);
  }
};
```

## 🔧 Error Handling

### Global Error Handler
```javascript
// services/errorHandler.js
export const errorHandler = {
  handle(error, context = '') {
    console.error(`Error in ${context}:`, error);
    
    // Enviar para serviço de monitoramento
    this.reportError(error, context);
    
    // Mostrar notificação para o usuário
    this.showUserError(error);
  },
  
  async reportError(error, context) {
    try {
      await fetch('/api/errors/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          context,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        })
      });
    } catch (reportError) {
      console.error('Failed to report error:', reportError);
    }
  },
  
  showUserError(error) {
    // Implementar notificação amigável para o usuário
    console.log('User-friendly error message:', error.message);
  }
};
```

## 📝 Variáveis de Ambiente

### .env.example
```bash
# API Keys
VITE_OPENAI_API_KEY=your_openai_key_here
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key_here
VITE_SPOONACULAR_API_KEY=your_spoonacular_key_here
VITE_EDAMAM_APP_ID=your_edamam_app_id
VITE_EDAMAM_APP_KEY=your_edamam_app_key

# Analytics
VITE_GA_TRACKING_ID=your_ga_tracking_id

# API URLs
VITE_API_URL=http://localhost:3000/api
VITE_WEBSOCKET_URL=ws://localhost:3000

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_OFFLINE_MODE=false
```

---

**Próximo passo**: Consulte o [Guia de Deploy](DEPLOY.md) para informações sobre deploy e produção.

