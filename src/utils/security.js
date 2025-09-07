// Utilitários de segurança para prevenir XSS e outros ataques

/**
 * Sanitiza input de texto removendo conteúdo perigoso
 * @param {string} input - Input a ser sanitizado
 * @returns {string} - Input sanitizado
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove tags HTML perigosas
  const dangerousTags = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  const dangerousAttributes = /on\w+\s*=/gi;
  const javascriptProtocol = /javascript:/gi;
  const dataProtocol = /data:/gi;
  const vbscriptProtocol = /vbscript:/gi;
  
  return input
    .replace(dangerousTags, '')
    .replace(dangerousAttributes, '')
    .replace(javascriptProtocol, '')
    .replace(dataProtocol, '')
    .replace(vbscriptProtocol, '')
    .trim();
};

/**
 * Valida se o input contém apenas caracteres seguros
 * @param {string} input - Input a ser validado
 * @returns {boolean} - True se seguro, false se contém conteúdo perigoso
 */
export const isInputSafe = (input) => {
  if (typeof input !== 'string') return true;
  
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /data:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /<link/i,
    /<meta/i
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(input));
};

/**
 * Escapa caracteres especiais para HTML
 * @param {string} input - Input a ser escapado
 * @returns {string} - Input escapado
 */
export const escapeHtml = (input) => {
  if (typeof input !== 'string') return input;
  
  const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };
  
  return input.replace(/[&<>"'/]/g, char => htmlEscapes[char]);
};

/**
 * Valida email com regex seguro
 * @param {string} email - Email a ser validado
 * @returns {boolean} - True se válido
 */
export const validateEmail = (email) => {
  if (typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

/**
 * Valida senha com critérios de segurança
 * @param {string} password - Senha a ser validada
 * @returns {object} - { isValid: boolean, errors: string[] }
 */
export const validatePassword = (password) => {
  if (typeof password !== 'string') return { isValid: false, errors: ['Senha deve ser uma string'] };
  
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Senha deve ter pelo menos 8 caracteres');
  }
  
  if (password.length > 128) {
    errors.push('Senha deve ter no máximo 128 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Senha deve conter pelo menos 1 letra maiúscula');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Senha deve conter pelo menos 1 número');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Senha deve conter pelo menos 1 caractere especial');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Valida nome com critérios de segurança
 * @param {string} name - Nome a ser validado
 * @returns {object} - { isValid: boolean, errors: string[] }
 */
export const validateName = (name) => {
  if (typeof name !== 'string') return { isValid: false, errors: ['Nome deve ser uma string'] };
  
  const errors = [];
  const sanitizedName = sanitizeInput(name);
  
  if (sanitizedName.length < 2) {
    errors.push('Nome deve ter pelo menos 2 caracteres');
  }
  
  if (sanitizedName.length > 100) {
    errors.push('Nome deve ter no máximo 100 caracteres');
  }
  
  if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(sanitizedName)) {
    errors.push('Nome deve conter apenas letras e espaços');
  }
  
  if (!isInputSafe(sanitizedName)) {
    errors.push('Nome contém caracteres não permitidos');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitized: sanitizedName
  };
};

/**
 * Valida número com limites seguros
 * @param {string|number} input - Input a ser validado
 * @param {object} options - Opções de validação
 * @returns {object} - { isValid: boolean, errors: string[] }
 */
export const validateNumber = (input, options = {}) => {
  const { min = -Infinity, max = Infinity, allowDecimals = true } = options;
  
  const errors = [];
  const num = parseFloat(input);
  
  if (isNaN(num)) {
    errors.push('Valor deve ser um número válido');
    return { isValid: false, errors };
  }
  
  if (!allowDecimals && !Number.isInteger(num)) {
    errors.push('Valor deve ser um número inteiro');
  }
  
  if (num < min) {
    errors.push(`Valor deve ser maior ou igual a ${min}`);
  }
  
  if (num > max) {
    errors.push(`Valor deve ser menor ou igual a ${max}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    value: num
  };
};

/**
 * Sanitiza e valida input de texto genérico
 * @param {string} input - Input a ser processado
 * @param {object} options - Opções de validação
 * @returns {object} - { isValid: boolean, sanitized: string, errors: string[] }
 */
export const processTextInput = (input, options = {}) => {
  const { maxLength = 1000, allowHtml = false, required = false } = options;
  
  const errors = [];
  
  if (required && (!input || input.trim().length === 0)) {
    errors.push('Campo é obrigatório');
    return { isValid: false, sanitized: '', errors };
  }
  
  if (!input) {
    return { isValid: true, sanitized: '', errors: [] };
  }
  
  const sanitized = allowHtml ? input : sanitizeInput(input);
  
  if (sanitized.length > maxLength) {
    errors.push(`Texto deve ter no máximo ${maxLength} caracteres`);
  }
  
  if (!isInputSafe(sanitized)) {
    errors.push('Texto contém caracteres não permitidos');
  }
  
  return {
    isValid: errors.length === 0,
    sanitized,
    errors
  };
};
