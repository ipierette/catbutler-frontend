/**
 * 🔒 Configurações de Produção Segura
 * Remove logs e informações sensíveis em produção
 */

// Detectar ambiente
const isProduction = import.meta.env.PROD;
const isDevelopment = import.meta.env.DEV;

/**
 * Console seguro - remove logs em produção
 */
export const secureConsole = {
  log: isDevelopment ? console.log : () => {},
  error: console.error, // Manter erros sempre
  warn: console.warn,   // Manter warnings sempre
  info: isDevelopment ? console.info : () => {},
  debug: isDevelopment ? console.debug : () => {},
  group: isDevelopment ? console.group : () => {},
  groupEnd: isDevelopment ? console.groupEnd : () => {},
  groupCollapsed: isDevelopment ? console.groupCollapsed : () => {},
  table: isDevelopment ? console.table : () => {},
  time: isDevelopment ? console.time : () => {},
  timeEnd: isDevelopment ? console.timeEnd : () => {}
};

/**
 * Sanitizar dados para produção
 * Remove informações sensíveis dos logs de erro
 */
export const sanitizeForProduction = (data) => {
  if (!isProduction) return data;
  
  if (typeof data === 'object' && data !== null) {
    const sanitized = { ...data };
    
    // Remover campos sensíveis
    const sensitiveFields = [
      'password', 'senha', 'token', 'key', 'secret',
      'email', 'phone', 'cpf', 'cnpj', 'credit_card'
    ];
    
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });
    
    // Sanitizar nested objects
    Object.keys(sanitized).forEach(key => {
      if (typeof sanitized[key] === 'object') {
        sanitized[key] = sanitizeForProduction(sanitized[key]);
      }
    });
    
    return sanitized;
  }
  
  if (typeof data === 'string') {
    // Mascarar padrões de email, telefone, etc.
    return data
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]')
      .replace(/\b\d{11}\b/g, '[PHONE]')
      .replace(/\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/g, '[CARD]');
  }
  
  return data;
};

/**
 * Logger seguro para produção
 */
export const secureLogger = {
  info(message, data = {}) {
    secureConsole.info(message, sanitizeForProduction(data));
  },
  
  error(message, error = {}) {
    console.error(message, sanitizeForProduction(error));
    
    // Em produção, enviar para serviço de monitoramento
    if (isProduction) {
      this.reportError(message, error);
    }
  },
  
  warn(message, data = {}) {
    console.warn(message, sanitizeForProduction(data));
  },
  
  debug(message, data = {}) {
    secureConsole.debug(message, sanitizeForProduction(data));
  },
  
  reportError(message, error) {
    // Aqui você integraria com Sentry, LogRocket, etc.
    // Por enquanto, apenas localStorage para debug
    try {
      const errorLog = {
        message,
        error: sanitizeForProduction(error),
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      };
      
      const existingLogs = JSON.parse(localStorage.getItem('error_logs') || '[]');
      existingLogs.push(errorLog);
      
      // Manter apenas os últimos 50 logs
      const recentLogs = existingLogs.slice(-50);
      localStorage.setItem('error_logs', JSON.stringify(recentLogs));
    } catch (e) {
      // Falhou ao salvar log, não fazer nada
    }
  }
};

/**
 * Configurar console global para produção
 */
export const configureProductionConsole = () => {
  if (!isProduction) return;
  
  // Sobrescrever métodos de console em produção
  window.console = {
    ...window.console,
    log: () => {},
    info: () => {},
    debug: () => {},
    group: () => {},
    groupEnd: () => {},
    groupCollapsed: () => {},
    table: () => {},
    time: () => {},
    timeEnd: () => {}
  };
  
  // Interceptar erros globais
  window.addEventListener('error', (event) => {
    secureLogger.error('Global error:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    secureLogger.error('Unhandled promise rejection:', {
      reason: event.reason
    });
  });
};

// Aplicar configurações automaticamente
configureProductionConsole();

export default {
  secureConsole,
  sanitizeForProduction,
  secureLogger,
  configureProductionConsole,
  isProduction,
  isDevelopment
};