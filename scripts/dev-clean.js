#!/usr/bin/env node

/**
 * 🧹 Script para limpeza completa antes de iniciar desenvolvimento
 * Resolve problemas de cache persistente em desenvolvimento
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 Iniciando limpeza completa para desenvolvimento...\n');

// 1. Limpar diretórios de cache
const cacheDirs = [
  'node_modules/.vite',
  'node_modules/.cache',
  'dist',
  '.vite'
];

cacheDirs.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    console.log(`🗑️  Removendo ${dir}...`);
    fs.rmSync(fullPath, { recursive: true, force: true });
  }
});

// 2. Limpar cache do npm
console.log('🧹 Limpando cache do npm...');
try {
  execSync('npm cache clean --force', { stdio: 'pipe' });
  console.log('✅ Cache do npm limpo');
} catch (error) {
  console.warn('⚠️  Não foi possível limpar cache do npm:', error.message);
}

// 3. Reinstalar dependências críticas para desenvolvimento
console.log('📦 Reinstalando dependências de desenvolvimento...');
try {
  execSync('npm install --no-cache', { stdio: 'inherit' });
  console.log('✅ Dependências reinstaladas');
} catch (error) {
  console.error('❌ Erro ao reinstalar dependências:', error.message);
  process.exit(1);
}

// 4. Criar arquivo .env.development se não existir
const envDevPath = path.join(process.cwd(), '.env.development');
const envContent = `# Configurações para desenvolvimento - Cache Busting
VITE_DISABLE_CACHE=true
FAST_REFRESH=true
VITE_DISABLE_PWA=true
VITE_DEBUG=true
VITE_FORCE_RELOAD=true
VITE_TIMESTAMP=${Date.now()}
`;

fs.writeFileSync(envDevPath, envContent);
console.log('📝 Arquivo .env.development atualizado com timestamp único');

// 5. Iniciar servidor com configurações especiais
console.log('\n🚀 Iniciando servidor de desenvolvimento com cache disabled...\n');

try {
  execSync('npm run dev', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'development',
      FORCE_COLOR: '1',
      VITE_FORCE_RELOAD: 'true'
    }
  });
} catch (error) {
  console.error('❌ Erro ao iniciar servidor:', error.message);
  process.exit(1);
}