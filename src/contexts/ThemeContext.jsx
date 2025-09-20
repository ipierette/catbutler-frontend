import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
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

  useEffect(() => {
    // Detectar tema inicial - sempre começar com light
    const detectTheme = () => {
      // Verificar se há tema salvo no localStorage
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        setTheme(savedTheme);
        applyTheme(savedTheme);
        return;
      }
      
      // Se não há tema salvo, usar preferência do sistema
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const newTheme = isDark ? "dark" : "light";
      setTheme(newTheme);
      
      // Aplicar classe no HTML
      applyTheme(newTheme);
      
      // Salvar no localStorage
      localStorage.setItem('theme', newTheme);
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
    
    // Listener para mudanças de preferência do sistema
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const newTheme = isDark ? "dark" : "light";
      setTheme(newTheme);
      applyTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    };
    
    mediaQuery.addEventListener("change", handleChange);
    
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

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

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === "light" ? "dark" : "light";
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  const value = useMemo(() => ({
    theme,
    toggleTheme,
    isDark: theme === 'dark'
  }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired
};
