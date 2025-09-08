import React, { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const CustomBackground = () => {
  const { theme } = useTheme();
  const canvasRef = useRef(null);
  const neatRef = useRef(null);

  useEffect(() => {
    // Função para inicializar o NEAT
    const initNeat = () => {
      if (!window.FireCMS?.NeatGradient) {
        setTimeout(initNeat, 100);
        return;
      }
      if (neatRef.current) {
        neatRef.current.destroy();
      }

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
        resolution: 1,
        yOffset: 0,
      };

      const lightPreset = {
        ...darkPreset, // Usar exatamente o mesmo preset
        colors: [
          { color: '#BFDBFE', enabled: true }, // Azul claro com contraste (blue-200)
          { color: '#DDD6FE', enabled: true }, // Violeta claro (violet-200)
          { color: '#FCE7F3', enabled: true }, // Rosa muito claro (pink-100)
          { color: '#D1FAE5', enabled: true }, // Verde muito claro (emerald-100)
          { color: '#FEF3C7', enabled: true }, // Amarelo muito claro (amber-100)
        ],
        backgroundColor: '#ffffff', // Fundo branco
      };

      const preset = theme === 'light' ? lightPreset : darkPreset;

      neatRef.current = new window.FireCMS.NeatGradient({
        ref: canvasRef.current,
        ...preset,
      });
    };
    
    // Inicializar NEAT
    initNeat();

    return () => {
      if (neatRef.current) {
        neatRef.current.destroy();
      }
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1, // Atrás do conteúdo mas visível
        pointerEvents: 'none', // Não interferir com interações
        backgroundColor: 'transparent',
      }}
    />
  );
};

export default CustomBackground;