/**
 * Utilitário para monitoramento de performance
 * Fornece funções para medir e reportar métricas importantes
 * Compatível com navegadores modernos
 */

// Reporta métricas para um serviço de analytics
// Substitua pela implementação real quando tiver um serviço
export const reportMetric = (metricName, value, options = {}) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Métrica] ${metricName}: ${value}`, options);
  } else {
    // Em produção, enviar para um serviço real
    // sendToAnalyticsService(metricName, value, options);
  }
};

// Mede a performance de uma função
export const measurePerformance = (fn, label) => {
  if (!window.performance || !window.performance.mark) {
    return fn();
  }

  const startMark = `${label}-start`;
  const endMark = `${label}-end`;
  const measureName = `${label}-measure`;

  performance.mark(startMark);
  const result = fn();
  performance.mark(endMark);
  
  performance.measure(measureName, startMark, endMark);
  
  // Obter duração da medição
  const entries = performance.getEntriesByName(measureName);
  const duration = entries.length > 0 ? entries[0].duration : 0;
  
  // Limpar as marcas e medidas para evitar vazamento de memória
  performance.clearMarks(startMark);
  performance.clearMarks(endMark);
  performance.clearMeasures(measureName);
  
  reportMetric(label, duration, { unit: 'ms' });
  
  return result;
};

// Para monitorar componentes React
export const useComponentPerformance = (componentName) => {
  // Usa useEffect para medir tempo de renderização
  React.useEffect(() => {
    const start = performance.now();
    
    return () => {
      const duration = performance.now() - start;
      reportMetric(`${componentName}-render`, duration, { unit: 'ms' });
    };
  });
};

// Medir tempo de interação (TTI - Time To Interactive)
export const measureTTI = () => {
  if (!window.performance || !window.performance.timing) {
    return;
  }
  
  // Aguarda carregamento completo
  window.addEventListener('load', () => {
    // Espera até que o navegador esteja ocioso
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        const timing = performance.timing;
        const tti = timing.domInteractive - timing.navigationStart;
        reportMetric('time-to-interactive', tti, { unit: 'ms' });
      });
    }
  });
};

// Medir Largest Contentful Paint (LCP)
export const observeLCP = () => {
  if (!('PerformanceObserver' in window)) return;
  
  try {
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      reportMetric('largest-contentful-paint', lastEntry.startTime, { unit: 'ms' });
    });
    
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {
    console.warn('LCP monitoring failed:', e);
  }
};

// Medir First Input Delay (FID)
export const observeFID = () => {
  if (!('PerformanceObserver' in window)) return;
  
  try {
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        reportMetric('first-input-delay', entry.processingStart - entry.startTime, { unit: 'ms' });
      });
    });
    
    fidObserver.observe({ type: 'first-input', buffered: true });
  } catch (e) {
    console.warn('FID monitoring failed:', e);
  }
};

// Inicializar todas as métricas
export const initPerformanceMonitoring = () => {
  // Não executa se não estiver no navegador ou for uma requisição de server-side rendering
  if (typeof window === 'undefined') return;
  
  // Inicializa todas as métricas disponíveis
  measureTTI();
  observeLCP();
  observeFID();
  
  // Medir Cumulative Layout Shift (CLS)
  if ('web-vitals' in window) {
    window['web-vitals'].getCLS(metric => {
      reportMetric('cumulative-layout-shift', metric.value);
    });
  }
};

// Exporta utilitário para análise de desempenho de eventos
export const trackEventPerformance = (category, action, callback) => {
  const startTime = performance.now();
  
  const done = () => {
    const duration = performance.now() - startTime;
    reportMetric(`${category}-${action}`, duration, { unit: 'ms' });
  };
  
  if (callback) {
    return callback(done);
  }
  
  return done;
};

// Utilitário para detectar memória vazando
export const detectMemoryLeaks = () => {
  if (!window.performance || !window.performance.memory) {
    return;
  }
  
  let lastUsedHeap = 0;
  let consecutiveIncreases = 0;
  
  const checkMemory = () => {
    const memory = performance.memory;
    const usedHeap = memory.usedJSHeapSize;
    
    if (usedHeap > lastUsedHeap) {
      consecutiveIncreases++;
      
      if (consecutiveIncreases > 5) {
        console.warn('Possível vazamento de memória detectado!');
        reportMetric('memory-leak-warning', usedHeap, { unit: 'bytes' });
      }
    } else {
      consecutiveIncreases = 0;
    }
    
    lastUsedHeap = usedHeap;
  };
  
  // Verifica a cada 10 segundos
  setInterval(checkMemory, 10000);
};
