/**
 * 🔒 Configurações de Segurança - CatButler
 * Configurações avançadas de segurança para produção
 */

// Rate limiting básico (client-side)
export class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  isAllowed(key) {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    // Limpar requisições antigas
    if (this.requests.has(key)) {
      const timestamps = this.requests.get(key).filter(time => time > windowStart);
      this.requests.set(key, timestamps);
    }
    
    const currentRequests = this.requests.get(key) || [];
    
    if (currentRequests.length >= this.maxRequests) {
      return false;
    }
    
    currentRequests.push(now);
    this.requests.set(key, currentRequests);
    return true;
  }
}

// Rate limiter para login/signup
export const authLimiter = new RateLimiter(5, 300000); // 5 tentativas por 5 minutos

// Rate limiter para operações gerais
export const generalLimiter = new RateLimiter(60, 60000); // 60 requisições por minuto

/**
 * Valida origem da requisição
 * @param {string} origin - Origem da requisição
 * @returns {boolean} - True se permitida
 */
export const validateOrigin = (origin) => {
  const allowedOrigins = [
    'https://catbutler-frontend.vercel.app',
    'https://www.catbutler.com',
    'https://catbutler.com',
    ...(import.meta.env.DEV ? ['http://localhost:3000', 'http://127.0.0.1:3000'] : [])
  ];
  
  return allowedOrigins.includes(origin);
};

/**
 * Detecta possíveis ataques automatizados
 * @param {object} userAgent - Informações do navegador
 * @returns {boolean} - True se suspeito
 */
export const detectBot = (userAgent) => {
  const botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /php/i,
    /automated/i,
    /headless/i
  ];
  
  return botPatterns.some(pattern => pattern.test(userAgent));
};

/**
 * Monitora comportamento suspeito
 */
export class SecurityMonitor {
  constructor() {
    this.events = [];
    this.maxEvents = 100;
    this.suspiciousThreshold = 10;
  }

  logEvent(type, details = {}) {
    const event = {
      type,
      timestamp: Date.now(),
      details,
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    this.events.push(event);
    
    // Manter apenas os eventos mais recentes
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }
    
    // Verificar padrões suspeitos
    this.checkSuspiciousActivity();
  }

  checkSuspiciousActivity() {
    const recentEvents = this.events.filter(
      event => Date.now() - event.timestamp < 300000 // 5 minutos
    );
    
    // Muitas tentativas de login falharam
    const failedLogins = recentEvents.filter(e => e.type === 'login_failed').length;
    if (failedLogins > 5) {
      this.blockUser('Muitas tentativas de login falharam');
    }
    
    // Muitas validações falharam
    const validationErrors = recentEvents.filter(e => e.type === 'validation_error').length;
    if (validationErrors > this.suspiciousThreshold) {
      this.blockUser('Muitos erros de validação');
    }
    
    // Tentativas de XSS
    const xssAttempts = recentEvents.filter(e => 
      e.type === 'validation_error' && 
      e.details.error?.includes('script')
    ).length;
    if (xssAttempts > 0) {
      this.blockUser('Tentativa de XSS detectada');
    }
  }

  blockUser(reason) {
    console.warn(`🚨 Usuário bloqueado: ${reason}`);
    
    // Em produção, você poderia:
    // 1. Registrar o evento no backend
    // 2. Mostrar CAPTCHA
    // 3. Redirecionar para página de bloqueio
    // 4. Limitar funcionalidades
    
    // Por enquanto, apenas alertamos
    if (import.meta.env.PROD) {
      // Desabilitar formulários por algum tempo
      this.temporaryBlock();
    }
  }

  temporaryBlock() {
    const blockTime = 5 * 60 * 1000; // 5 minutos
    const blockUntil = Date.now() + blockTime;
    
    localStorage.setItem('security_block_until', blockUntil.toString());
    
    setTimeout(() => {
      localStorage.removeItem('security_block_until');
    }, blockTime);
  }

  isBlocked() {
    const blockUntil = localStorage.getItem('security_block_until');
    if (!blockUntil) return false;
    
    return Date.now() < parseInt(blockUntil);
  }
}

// Instância global do monitor
export const securityMonitor = new SecurityMonitor();

/**
 * Configurações seguras para localStorage
 */
export const secureStorage = {
  set(key, value, expirationHours = 24) {
    const item = {
      value,
      expiry: Date.now() + (expirationHours * 60 * 60 * 1000),
      checksum: this.calculateChecksum(value)
    };
    
    try {
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  },

  get(key) {
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;
      
      const item = JSON.parse(itemStr);
      
      // Verificar expiração
      if (Date.now() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      
      // Verificar integridade
      if (this.calculateChecksum(item.value) !== item.checksum) {
        console.warn('Dados corrompidos detectados:', key);
        localStorage.removeItem(key);
        return null;
      }
      
      return item.value;
    } catch (error) {
      console.error('Erro ao ler localStorage:', error);
      return null;
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  calculateChecksum(data) {
    // Simples checksum para detectar alterações
    return btoa(JSON.stringify(data)).slice(-10);
  }
};

/**
 * Middleware de segurança para requisições
 */
export const securityMiddleware = {
  beforeRequest(config) {
    // Adicionar headers de segurança
    config.headers = {
      ...config.headers,
      'X-Requested-With': 'XMLHttpRequest',
      'X-Client-Version': '4.0.0',
      'X-Timestamp': Date.now().toString()
    };
    
    // Verificar rate limiting
    const userKey = 'user_' + (config.userId || 'anonymous');
    if (!generalLimiter.isAllowed(userKey)) {
      throw new Error('Rate limit excedido');
    }
    
    return config;
  },

  afterResponse(response, error) {
    if (error) {
      securityMonitor.logEvent('request_error', { 
        error: error.message,
        status: error.response?.status 
      });
    }
    
    return { response, error };
  }
};

/**
 * Função para limpar dados sensíveis na saída/erro
 */
export const clearSensitiveData = () => {
  // Limpar campos de senha dos formulários
  const passwordFields = document.querySelectorAll('input[type="password"]');
  passwordFields.forEach(field => field.value = '');
  
  // Limpar dados específicos do localStorage
  const sensitiveKeys = [
    'temp_password',
    'session_token',
    'api_key'
  ];
  
  sensitiveKeys.forEach(key => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
};

// Configurar limpeza automática
window.addEventListener('beforeunload', clearSensitiveData);
window.addEventListener('pagehide', clearSensitiveData);

// Detectar DevTools (básico)
let devtools = {
  open: false,
  orientation: null
};

setInterval(() => {
  if (console.clear) {
    const before = performance.now();
    console.clear();
    const after = performance.now();
    
    if (after - before > 1) {
      if (!devtools.open) {
        devtools.open = true;
        securityMonitor.logEvent('devtools_opened');
      }
    }
  }
}, 500);

export default {
  RateLimiter,
  authLimiter,
  generalLimiter,
  validateOrigin,
  detectBot,
  SecurityMonitor,
  securityMonitor,
  secureStorage,
  securityMiddleware,
  clearSensitiveData
};