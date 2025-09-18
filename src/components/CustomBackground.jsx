import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const CustomBackground = () => {
  const { theme } = useTheme();
  const canvasRef = useRef(null);
  const neatRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // medidor simples de FPS (dev only)
  const fpsRaf = useRef(null);
  const [fps, setFps] = useState(null);

  useEffect(() => {
    console.log('🎨 CustomBackground: Inicializando...');
    
    // Verificações de ambiente primeiro
    if (typeof window === 'undefined') {
      console.warn('🎨 CustomBackground: Window não disponível (SSR?)');
      return;
    }

    if (!canvasRef.current) {
      console.warn('🎨 CustomBackground: Canvas ref não disponível');
      return;
    }

    let attempts = 0;
    const maxAttempts = 30; // ~6s
    const timer = setTimeout(() => {
      initializeNEAT();
    }, 300);

    function initializeNEAT() {
      attempts++;

      if (attempts > maxAttempts) {
        console.warn('🎨 NEAT: Timeout após múltiplas tentativas');
        setIsLoaded(false);
        stopFpsMeter();
        return;
      }
      
      if (!window.THREE) {
        console.log(`🎨 NEAT: Aguardando THREE.js (tentativa ${attempts}/${maxAttempts})...`);
        // aguarda three carregar
        setTimeout(initializeNEAT, 200);
        return;
      }
      if (!window.FireCMS || !window.FireCMS.NeatGradient) {
        // aguarda NEAT (index.umd.js)
        setTimeout(initializeNEAT, 200);
        return;
      }
      if (!canvasRef.current) {
        setTimeout(initializeNEAT, 100);
        return;
      }

      // limpa instância anterior se existir
      if (neatRef.current) {
        try { neatRef.current.destroy(); } catch (e) { console.warn('NEAT cleanup:', e); }
      }

      // presets
      const darkPreset = {
        colors: [
          { color: '#554226', enabled: true },
          { color: '#03162D', enabled: true },
          { color: '#002027', enabled: true },
          { color: '#020210', enabled: true },
          { color: '#02152A', enabled: true },
        ],
        speed: 2,
        horizontalPressure: 3,
        verticalPressure: 5,
        waveFrequencyX: 1,
        waveFrequencyY: 3,
        waveAmplitude: 8,
        shadows: 0,
        highlights: 2,
        colorBrightness: 1,
        colorSaturation: 6,
        wireframe: false,
        colorBlending: 7,
        backgroundColor: '#003FFF',
        backgroundAlpha: 1,
        grainScale: 2,
        grainSparsity: 0,
        grainIntensity: 0.175,
        grainSpeed: 1,
        // (deixa a resolução do preset ser sobrescrita abaixo)
        yOffset: 0,
      };

      const lightPreset = {
        ...darkPreset,
        colors: [
          { color: '#BFDBFE', enabled: true },
          { color: '#DDD6FE', enabled: true },
          { color: '#FCE7F3', enabled: true },
          { color: '#D1FAE5', enabled: true },
          { color: '#FEF3C7', enabled: true },
        ],
        backgroundColor: '#ffffff',
      };

      const preset = theme === 'light' ? lightPreset : darkPreset;

      try {
        // ⚠️ Requer o index.umd.js otimizado (com fps/pauseOnHidden)
        neatRef.current = new window.FireCMS.NeatGradient({
          ref: canvasRef.current,
          ...preset,
          // overrides de performance:
          resolution: 0.2,     // ↓ metade da resolução interna
          fps: 20,            // limita o loop a 30fps lá dentro
          pauseOnHidden: true, // pausa quando a aba fica oculta
        });

        setIsLoaded(true);
        startFpsMeter(); // dev only
      } catch (error) {
        console.error('NEAT: Erro ao inicializar:', error);
        setIsLoaded(false);
        stopFpsMeter();
      }
    }

    function startFpsMeter() {
      if (process.env.NODE_ENV !== 'development') return;
      let last = performance.now();
      let frames = 0;
      const sampleMs = 500; // janela de meia-seg pra leitura mais estável

      const loop = (now) => {
        frames++;
        if (now - last >= sampleMs) {
          const currentFps = Math.round((frames * 1000) / (now - last));
          setFps(currentFps);
          frames = 0;
          last = now;
        }
        fpsRaf.current = requestAnimationFrame(loop);
      };
      fpsRaf.current = requestAnimationFrame(loop);
    }

    function stopFpsMeter() {
      if (fpsRaf.current) {
        cancelAnimationFrame(fpsRaf.current);
        fpsRaf.current = null;
        setFps(null);
      }
    }

    return () => {
      clearTimeout(timer);
      stopFpsMeter();
      if (neatRef.current) {
        try { neatRef.current.destroy(); } catch (e) { console.warn('NEAT cleanup:', e); }
      }
      setIsLoaded(false);
    };
  }, [theme]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          pointerEvents: 'none',
          background: isLoaded ? 'transparent' : (
            theme === 'light' 
              ? 'linear-gradient(45deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)'
              : 'linear-gradient(45deg, #1a202c 0%, #2d3748 50%, #4a5568 100%)'
          ),
          contain: 'strict', // dica de perf do layout
        }}
        aria-hidden
      />
    </>
  );
};

export default CustomBackground;
