/**
 * Performance Optimization Utilities
 * 
 * Utilitários para melhorar a performance da aplicação
 * especialmente para satisfazer os testes de First Input Delay (FID)
 */

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
  const animatedElements = document.querySelectorAll('.animate-fade-in-up, .scale-hover');
  animatedElements.forEach(el => {
    el.style.transform = 'translateZ(0)';
    el.style.willChange = 'transform, opacity';
  });
}

// Redução do First Input Delay
export function reduceInputDelay() {
  // Preload critical interactive elements
  const criticalButtons = document.querySelectorAll('button[type="submit"], .btn-primary');
  
  criticalButtons.forEach(button => {
    // Prepare event listeners
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

  // Preload critical images
  const criticalImages = ['/images/gato-optimized.gif', '/images/logo-catbutler.webp'];
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

// Inicialização de performance
export function initializePerformanceOptimizations() {
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

// FPS monitoring (para debug)
export function monitorFPS() {
  let frames = 0;
  let lastTime = performance.now();
  
  function countFrames(currentTime) {
    frames++;
    if (currentTime >= lastTime + 1000) {
      const fps = Math.round((frames * 1000) / (currentTime - lastTime));
      console.log(`FPS: ${fps}`);
      frames = 0;
      lastTime = currentTime;
    }
    requestAnimationFrame(countFrames);
  }
  
  requestAnimationFrame(countFrames);
}

// Web Vitals monitoring
export function measureWebVitals() {
  // First Contentful Paint
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        console.log('FCP:', entry.startTime);
      }
    }
  });
  observer.observe({ entryTypes: ['paint'] });

  // Largest Contentful Paint
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log('LCP:', lastEntry.startTime);
  });
  lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

  // Cumulative Layout Shift
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    }
    console.log('CLS:', clsValue);
  });
  clsObserver.observe({ entryTypes: ['layout-shift'] });
}