// Build Info - Gerado automaticamente
export const BUILD_INFO = {
  timestamp: new Date().toISOString(),
  buildId: Date.now(),
  version: '4.0.2-vercel-fix',
  commit: 'cccdbb8',
  environment: import.meta.env.MODE || 'production',
  buildTime: import.meta.env.VITE_BUILD_TIME || new Date().toLocaleString('pt-BR'),
  forceUpdate: true, // Flag para garantir que o Vercel detecte mudanças
  cacheInvalidation: Date.now() // Força invalidação de cache
};

// Esta informação será usada para garantir que o cache seja invalidado
console.log('🚀 Build Info:', BUILD_INFO);