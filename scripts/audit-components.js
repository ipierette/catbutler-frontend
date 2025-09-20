#!/usr/bin/env node

/**
 * 🔍 Auditoria Automática de Componentes React
 * 
 * Script para detectar problemas estruturais em componentes que podem
 * causar erros de minificação ou problemas com hooks.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcPath = path.join(__dirname, '..', 'src');
const issues = [];

// Padrões problemáticos a procurar
const problematicPatterns = {
  proptypesInMiddle: /export\s+(?:function|const)\s+\w+[^}]*\{[^}]*\.propTypes\s*=[\s\S]*?(?:useState|useEffect|useRef|useMemo|useCallback)(?!\s*\()/,
  reactHookWithoutImport: /(?:useState|useEffect|useRef|useMemo|useCallback)\s*\(/,
  reactImport: /import.*React.*from\s+['"]react['"]/,
  hooksImport: /import.*\{.*(?:useState|useEffect|useRef|useMemo|useCallback).*\}.*from\s+['"]react['"]/,
  propTypesAtEnd: /\w+\.propTypes\s*=.*$/m,
};

function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(srcPath, filePath);
    const fileIssues = [];

    // Verificar se é um componente React
    const isReactComponent = content.includes('import') && 
                            (content.includes('React') || content.includes('jsx')) &&
                            (content.includes('export'));

    if (!isReactComponent) return [];

    // 1. Verificar PropTypes no meio de funções
    if (problematicPatterns.proptypesInMiddle.test(content)) {
      fileIssues.push({
        type: 'CRITICAL',
        issue: 'PropTypes definido no meio da função do componente',
        description: 'PropTypes deve ser definido APÓS a função do componente para evitar problemas de hoisting',
        fix: 'Mover a definição de PropTypes para depois da função do componente'
      });
    }

    // 2. Verificar uso de hooks sem import
    const hasHooks = problematicPatterns.reactHookWithoutImport.test(content);
    const hasHooksImport = problematicPatterns.hooksImport.test(content);

    if (hasHooks && !hasHooksImport && !content.includes('React.useState')) {
      fileIssues.push({
        type: 'ERROR',
        issue: 'Hooks usados sem import específico',
        description: 'Hooks como useState, useEffect devem ser importados explicitamente',
        fix: 'Adicionar { useState, useEffect, ... } no import do React'
      });
    }

    // 3. Verificar uso de React.hook ao invés de hook direto
    if (content.includes('React.useState') || content.includes('React.useEffect')) {
      fileIssues.push({
        type: 'WARNING',
        issue: 'Uso de React.hook ao invés de hook direto',
        description: 'Usar hooks diretamente é mais seguro na minificação',
        fix: 'Usar destructuring: import { useState, useEffect } from "react"'
      });
    }

    // 4. Verificar componentes sem PropTypes
    const hasExports = /export\s+(?:default\s+)?(?:function|const)\s+[A-Z]\w*/.test(content);
    const hasPropTypes = /\.propTypes\s*=/.test(content);
    
    if (hasExports && !hasPropTypes && content.includes('props')) {
      fileIssues.push({
        type: 'INFO',
        issue: 'Componente sem PropTypes',
        description: 'Considere adicionar PropTypes para melhor debugging',
        fix: 'Adicionar PropTypes após a definição do componente'
      });
    }

    // 5. Verificar estrutura de exports
    if (content.includes('export default') && !content.includes('Component.displayName')) {
      const componentName = content.match(/export\s+default\s+(?:function\s+)?(\w+)/);
      if (componentName && componentName[1]) {
        fileIssues.push({
          type: 'INFO',
          issue: 'Componente sem displayName',
          description: 'DisplayName ajuda no debugging e DevTools',
          fix: `Adicionar ${componentName[1]}.displayName = '${componentName[1]}';`
        });
      }
    }

    return fileIssues.map(issue => ({
      ...issue,
      file: relativePath
    }));

  } catch (error) {
    return [{
      type: 'ERROR',
      file: path.relative(srcPath, filePath),
      issue: 'Erro ao analisar arquivo',
      description: error.message,
      fix: 'Verificar sintaxe do arquivo'
    }];
  }
}

function scanDirectory(dir) {
  const entries = fs.readdirSync(dir);

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Pular node_modules e outras pastas desnecessárias
      if (!['node_modules', 'dist', 'build', '.git'].includes(entry)) {
        scanDirectory(fullPath);
      }
    } else if (stat.isFile() && /\.(jsx?|tsx?)$/.test(entry)) {
      const fileIssues = analyzeFile(fullPath);
      issues.push(...fileIssues);
    }
  }
}

function generateReport() {
  console.log('🔍 AUDITORIA DE COMPONENTES REACT - CATBUTLER\n');
  console.log('='.repeat(60));

  if (issues.length === 0) {
    console.log('✅ Nenhum problema encontrado! Todos os componentes estão bem estruturados.');
    return;
  }

  // Agrupar por tipo
  const byType = issues.reduce((acc, issue) => {
    if (!acc[issue.type]) acc[issue.type] = [];
    acc[issue.type].push(issue);
    return acc;
  }, {});

  // Estatísticas
  const stats = {
    CRITICAL: byType.CRITICAL?.length || 0,
    ERROR: byType.ERROR?.length || 0,
    WARNING: byType.WARNING?.length || 0,
    INFO: byType.INFO?.length || 0
  };

  console.log(`📊 RESUMO:`);
  console.log(`   🚨 Crítico: ${stats.CRITICAL}`);
  console.log(`   ❌ Erro: ${stats.ERROR}`);
  console.log(`   ⚠️  Aviso: ${stats.WARNING}`);
  console.log(`   ℹ️  Info: ${stats.INFO}`);
  console.log('');

  // Mostrar problemas por prioridade
  ['CRITICAL', 'ERROR', 'WARNING', 'INFO'].forEach(type => {
    if (byType[type]) {
      const icon = { CRITICAL: '🚨', ERROR: '❌', WARNING: '⚠️', INFO: 'ℹ️' }[type];
      console.log(`${icon} ${type} (${byType[type].length} problemas):`);
      console.log('-'.repeat(40));

      byType[type].forEach(issue => {
        console.log(`📁 ${issue.file}`);
        console.log(`   Problema: ${issue.issue}`);
        console.log(`   Descrição: ${issue.description}`);
        console.log(`   Solução: ${issue.fix}`);
        console.log('');
      });
    }
  });

  // Recomendações finais
  console.log('🎯 RECOMENDAÇÕES:');
  console.log('1. Corrija problemas CRÍTICOS primeiro');
  console.log('2. Execute: npm run lint -- --fix');
  console.log('3. Teste a build: npm run build');
  console.log('4. Execute testes: npm run test');
  console.log('');
}

// Executar auditoria
console.log('🔍 Iniciando auditoria de componentes...');
scanDirectory(srcPath);
generateReport();

export { analyzeFile, scanDirectory };