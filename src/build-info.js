// Build Info - Gerado automaticamente
export const BUILD_INFO = {
  timestamp: new Date().toISOString(),
  buildId: Date.now(),
  version: '4.0.1-force-update',
  commit: '08e0022',
  environment: process.env.NODE_ENV || 'production',
  deployedAt: new Date().toLocaleString('pt-BR')
};

// Esta informação será usada para garantir que o cache seja invalidado
console.log('🚀 Build Info:', BUILD_INFO);