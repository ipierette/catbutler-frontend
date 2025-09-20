#!/usr/bin/env node

/**
 * Script para limpar todos os caches de desenvolvimento
 * Use quando estiver enfrentando problemas de cache, HMR ou 404s estranhos
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dirs = [
  'node_modules/.vite',
  'node_modules/.cache', 
  'dist',
  '.vite'
];

console.log('🧹 Limpando caches de desenvolvimento...');

dirs.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    console.log(`   ✅ Removendo: ${dir}`);
    execSync(`rm -rf "${fullPath}"`);
  } else {
    console.log(`   ⚡ Já limpo: ${dir}`);
  }
});

console.log('\n🎉 Cache limpo! Execute npm run dev para reiniciar com cache limpo.');
console.log('\n💡 Dica: Se ainda tiver problemas, tente:');
console.log('   - Limpar cache do navegador (Cmd+Shift+R no Mac)');
console.log('   - Abrir aba anônima/privada');
console.log('   - Verificar o Console do DevTools por erros');