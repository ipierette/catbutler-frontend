// 🧹 Script para limpeza agressiva de cache em desenvolvimento
(function() {
  'use strict';
  
  // Só executar em desenvolvimento (localhost)
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return;
  }
  
  console.log('🧹 Iniciando limpeza agressiva de cache...');
  
  // Função para limpar tudo
  function clearAllCache() {
    // 1. Limpar Service Workers
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        registrations.forEach(function(registration) {
          registration.unregister();
          console.log('🗑️ Service Worker removido');
        });
      });
    }
    
    // 2. Limpar Cache Storage
    if ('caches' in window) {
      caches.keys().then(function(names) {
        names.forEach(function(name) {
          caches.delete(name);
          console.log('🗑️ Cache removido:', name);
        });
      });
    }
    
    // 3. Limpar Local e Session Storage
    try {
      const keysToKeep = ['supabase.auth.token', 'sb-auth-token'];
      const localData = {};
      const sessionData = {};
      
      // Preservar dados de autenticação
      keysToKeep.forEach(key => {
        if (localStorage.getItem(key)) localData[key] = localStorage.getItem(key);
        if (sessionStorage.getItem(key)) sessionData[key] = sessionStorage.getItem(key);
      });
      
      localStorage.clear();
      sessionStorage.clear();
      
      // Restaurar dados de autenticação
      Object.entries(localData).forEach(([key, value]) => localStorage.setItem(key, value));
      Object.entries(sessionData).forEach(([key, value]) => sessionStorage.setItem(key, value));
      
      console.log('🧹 Storage limpo (dados de auth preservados)');
    } catch (e) {
      console.warn('Erro ao limpar storage:', e);
    }
    
    // 4. Forçar reload de CSS
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    links.forEach(function(link) {
      const href = link.href;
      link.href = href + (href.indexOf('?') >= 0 ? '&' : '?') + '_=' + Date.now();
    });
    
    console.log('✅ Limpeza de cache concluída');
  }
  
  // Executar limpeza imediatamente
  clearAllCache();
  
  // Limpar a cada 5 minutos durante desenvolvimento
  setInterval(clearAllCache, 5 * 60 * 1000);
  
  // Adicionar função global para limpeza manual
  window.clearDevCache = clearAllCache;
  
})();