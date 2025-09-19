/**
 * Performance Optimization & Monitoring Utilities
 * 
 * Utilitários consolidados para melhorar a performance da aplicação
 * e monitorar métricas importantes como Core Web Vitals
 * 
 * Combina otimizações para FID, CLS, LCP e monitoramento de performance
 */

// ============= PERFORMANCE MONITORING =============

// Reporta métricas para um serviço de analytics
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
  if (!window.performance?.mark) {
    return fn();
  }

  const startMark = `${label}-start`;
  const endMark = `${label}-end`;
  const measureName = `${label}-measure`;

  performance.mark(startMark);
  const result = fn();
  performance.mark(endMark);
  
  performance.measure(measureName, startMark, endMark);
  
  const entries = performance.getEntriesByName(measureName);
  const duration = entries.length > 0 ? entries[0].duration : 0;
  
  // Limpar para evitar vazamento de memória
  performance.clearMarks(startMark);
  performance.clearMarks(endMark);
  performance.clearMeasures(measureName);
  
  reportMetric(label, duration, { unit: 'ms' });
  
  return result;
};

// ============= PERFORMANCE OPTIMIZATION =============

// Debounce function para reduzir execuções desnecessárias
export function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Throttle function para limitar execuções por tempo
export function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Lazy loading para imagens
export function setupImageLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// Otimização de animações para 60fps
export function optimizeAnimations() {
  // Force hardware acceleration for key elements
  const animatedElements = document.querySelectorAll('.animate-fade-in-up, .scale-hover, [class*="animate"], [style*="transition"]');
  animatedElements.forEach(el => {
    el.style.transform = 'translateZ(0)';
    el.style.willChange = 'transform, opacity';
  });
}

// Redução do First Input Delay (FID)
export function reduceInputDelay() {
  // Preload critical interactive elements
  const criticalButtons = document.querySelectorAll('button[type="submit"], .btn-primary, button');
  
  criticalButtons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.willChange = 'transform, background-color';
    }, { passive: true });
    
    button.addEventListener('mouseleave', function() {
      this.style.willChange = 'auto';
    }, { passive: true });
  });

  // Optimize input fields
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.style.willChange = 'border-color, box-shadow';
    }, { passive: true });
    
    input.addEventListener('blur', function() {
      this.style.willChange = 'auto';
    }, { passive: true });
  });
}

// Preload de recursos críticos
export function preloadCriticalResources() {
  // Preload fonts
  const fontLink = document.createElement('link');
  fontLink.rel = 'preload';
  fontLink.as = 'font';
  fontLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/webfonts/fa-solid-900.woff2';
  fontLink.type = 'font/woff2';
  fontLink.crossOrigin = 'anonymous';
  document.head.appendChild(fontLink);

  // Critical images are preloaded in index.html for better timing
  // Removed duplicate preload to prevent warnings
}

// ============= WEB VITALS MONITORING =============

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

// Medir Cumulative Layout Shift (CLS)
export const observeCLS = () => {
  if (!('PerformanceObserver' in window)) return;
  
  let clsValue = 0;
  try {
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      reportMetric('cumulative-layout-shift', clsValue);
    });
    
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  } catch (e) {
    console.warn('CLS monitoring failed:', e);
  }
};

// Medir tempo de interação (TTI - Time To Interactive) 
export const measureTTI = () => {
  if (!window.performance?.getEntriesByType) {
    return;
  }
  
  window.addEventListener('load', () => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Use modern Navigation Timing API
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
          const tti = navigation.domInteractive - navigation.fetchStart;
          reportMetric('time-to-interactive', tti, { unit: 'ms' });
        }
      });
    }
  });
};

// ============= ADVANCED MONITORING =============

// Detectar vazamentos de memória
export const detectMemoryLeaks = () => {
  if (!window.performance?.memory) {
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

// Monitorar FPS de animações
export function monitorFPS() {
  let frames = 0;
  let lastTime = performance.now();
  
  function countFrames(currentTime) {
    frames++;
    if (currentTime >= lastTime + 1000) {
      const fps = Math.round((frames * 1000) / (currentTime - lastTime));
      reportMetric('animation-fps', fps);
      frames = 0;
      lastTime = currentTime;
    }
    requestAnimationFrame(countFrames);
  }
  
  requestAnimationFrame(countFrames);
}

// ============= INITIALIZATION =============

// Inicialização completa de performance
export function initializePerformanceOptimizations() {
  if (typeof window === 'undefined') return;
  
  // Executar após DOM estar pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupImageLazyLoading();
      optimizeAnimations();
      reduceInputDelay();
      preloadCriticalResources();
    });
  } else {
    setupImageLazyLoading();
    optimizeAnimations();
    reduceInputDelay();
    preloadCriticalResources();
  }
}

// Inicializar monitoramento de métricas
export const initPerformanceMonitoring = () => {
  if (typeof window === 'undefined') return;
  
  measureTTI();
  observeLCP();
  observeFID();
  observeCLS();
  detectMemoryLeaks();
  
  if (process.env.NODE_ENV === 'development') {
    monitorFPS();
  }
};

// Utilitário para eventos com tracking
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

// Export default com todas as funções de inicialização
export default {
  init: () => {
    initializePerformanceOptimizations();
    initPerformanceMonitoring();
  },
  reportMetric,
  measurePerformance,
  debounce,
  throttle,
  trackEventPerformance
};