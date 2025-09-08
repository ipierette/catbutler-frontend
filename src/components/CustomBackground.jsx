import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const CustomBackground = () => {
  const { theme } = useTheme();
  const canvasRef = useRef(null);
  const neatRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 30; // 6 segundos máximo
    
    // Aguardar um pouco para garantir que o DOM está pronto
    const timer = setTimeout(() => {
      initializeNEAT();
    }, 500);

    function initializeNEAT() {
      attempts++;
      
      if (attempts > maxAttempts) {
        console.warn('NEAT: Timeout após múltiplas tentativas');
        setIsLoaded(false);
        return;
      }
      // Verificar se Three.js carregou
      if (!window.THREE) {
        console.log('NEAT: Three.js não carregado, tentando novamente...');
        setTimeout(initializeNEAT, 200);
        return;
      }

      // Verificar se a biblioteca NEAT existe
      if (!window.FireCMS || !window.FireCMS.NeatGradient) {
        console.log('NEAT: Biblioteca NEAT não encontrada, tentando novamente...');
        setTimeout(initializeNEAT, 200);
        return;
      }

      // Verificar se o canvas existe
      if (!canvasRef.current) {
        console.log('NEAT: Canvas não encontrado, tentando novamente...');
        setTimeout(initializeNEAT, 100);
        return;
      }

      // Limpar instância anterior
      if (neatRef.current) {
        try {
          neatRef.current.destroy();
        } catch (e) {
          console.warn('NEAT: Erro ao limpar:', e);
        }
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

      try {
        neatRef.current = new window.FireCMS.NeatGradient({
          ref: canvasRef.current,
          ...preset,
        });
        
        console.log('NEAT: Fundo ativo!');
        setIsLoaded(true);
      } catch (error) {
        console.error('NEAT: Erro ao inicializar:', error);
        setIsLoaded(false);
      }
    }

    return () => {
      clearTimeout(timer);
      if (neatRef.current) {
        try {
          neatRef.current.destroy();
        } catch (e) {
          console.warn('NEAT: Erro no cleanup:', e);
        }
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
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          pointerEvents: 'none',
          background: isLoaded ? 'transparent' : (
            theme === 'light' 
              ? 'linear-gradient(45deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)'
              : 'linear-gradient(45deg, #1a202c 0%, #2d3748 50%, #4a5568 100%)'
          ),
        }}
      />
      {/* Debug indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          zIndex: 1000,
          padding: '4px 8px',
          backgroundColor: isLoaded ? 'green' : 'red',
          color: 'white',
          fontSize: '12px',
          borderRadius: '4px'
        }}>
          NEAT: {isLoaded ? 'Active' : 'Failed'}
        </div>
      )}
    </>
  );
};

export default CustomBackground;