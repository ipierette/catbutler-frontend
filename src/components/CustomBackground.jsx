import React, { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const CustomBackground = () => {
  const { theme } = useTheme();
  const canvasRef = useRef(null);
  const neatRef = useRef(null);

  useEffect(() => {
    if (window.FireCMS && window.FireCMS.NeatGradient) {
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
        ...darkPreset,
        highlights: 12, // mais brilho
        colorBrightness: 4.2, // mais claro
        colorSaturation: 5,
        colorBlending: 9,
        backgroundColor: '#f8fafc', // cinza bem claro
        backgroundAlpha: 1,
        grainIntensity: 0.07,
      };

      const preset = theme === 'light' ? lightPreset : darkPreset;

      neatRef.current = new window.FireCMS.NeatGradient({
        ref: canvasRef.current,
        ...preset,
      });
    }

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
        zIndex: -1,
      }}
    />
  );
};

export default CustomBackground;