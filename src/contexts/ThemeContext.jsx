import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [autoTheme, setAutoTheme] = useState(false);

  useEffect(() => {
    // Detectar configurações iniciais
    const detectTheme = () => {
      // Verificar configurações salvas
      const savedTheme = localStorage.getItem('theme');
      const savedAutoTheme = localStorage.getItem('autoTheme') === 'true';
      
      setAutoTheme(savedAutoTheme);
      
      if (savedAutoTheme) {
        // Se tema automático está ativo, definir baseado na hora
        const now = new Date();
        const hour = now.getHours();
        const isDayTime = hour >= 6 && hour < 18;
        const newTheme = isDayTime ? 'light' : 'dark';
        setTheme(newTheme);
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
      } else if (savedTheme) {
        // Usar tema salvo
        setTheme(savedTheme);
        applyTheme(savedTheme);
      } else {
        // Se não há tema salvo, usar preferência do sistema
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const newTheme = isDark ? "dark" : "light";
        setTheme(newTheme);
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
      }
    };

    // Função para aplicar tema ao documento
    const applyTheme = (themeValue) => {
      if (themeValue === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    };
    
    detectTheme();
    
    // Listener para mudanças de preferência do sistema (apenas se não estiver no modo automático por horário)
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const savedAutoTheme = localStorage.getItem('autoTheme') === 'true';
      if (!savedAutoTheme) {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const newTheme = isDark ? "dark" : "light";
        setTheme(newTheme);
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Intervalo para verificar tema automático baseado na hora
  useEffect(() => {
    let interval;
    
    if (autoTheme) {
      const updateAutoTheme = () => {
        const now = new Date();
        const hour = now.getHours();
        const isDayTime = hour >= 6 && hour < 18;
        const newTheme = isDayTime ? 'light' : 'dark';
        
        if (theme !== newTheme) {
          setTheme(newTheme);
          localStorage.setItem('theme', newTheme);
        }
      };
      
      // Verificar a cada minuto se o tema deve mudar
      interval = setInterval(updateAutoTheme, 60000);
      
      // Verificar imediatamente
      updateAutoTheme();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoTheme, theme]);

  useEffect(() => {
    // Aplicar classe no HTML quando o tema mudar
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    // Se tema automático estiver ativo, desativá-lo ao fazer toggle manual
    if (autoTheme) {
      setAutoTheme(false);
      localStorage.setItem('autoTheme', 'false');
    }
    
    setTheme(prev => {
      const newTheme = prev === "light" ? "dark" : "light";
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  }, [autoTheme]);

  const toggleAutoTheme = useCallback(() => {
    const newAutoTheme = !autoTheme;
    setAutoTheme(newAutoTheme);
    localStorage.setItem('autoTheme', String(newAutoTheme));
    
    if (newAutoTheme) {
      // Ativar tema automático baseado na hora atual
      const now = new Date();
      const hour = now.getHours();
      const isDayTime = hour >= 6 && hour < 18;
      const newTheme = isDayTime ? 'light' : 'dark';
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    }
  }, [autoTheme]);

  const value = useMemo(() => ({
    theme,
    autoTheme,
    toggleTheme,
    toggleAutoTheme,
    isDark: theme === 'dark'
  }), [theme, autoTheme, toggleTheme, toggleAutoTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired
};
