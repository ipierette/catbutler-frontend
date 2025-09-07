import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Detectar tema inicial - sempre começar com light
    const detectTheme = () => {
      // Verificar se há tema salvo no localStorage
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.className = savedTheme;
        return;
      }
      
      // Se não há tema salvo, usar preferência do sistema
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const newTheme = isDark ? "dark" : "light";
      setTheme(newTheme);
      
      // Aplicar classe no HTML
      document.documentElement.className = newTheme;
      
      // Salvar no localStorage
      localStorage.setItem('theme', newTheme);
    };
    
    detectTheme();
    
    // Listener para mudanças de preferência do sistema
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const newTheme = isDark ? "dark" : "light";
      setTheme(newTheme);
      document.documentElement.className = newTheme;
      localStorage.setItem('theme', newTheme);
    };
    
    mediaQuery.addEventListener("change", handleChange);
    
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    // Aplicar classe no HTML quando o tema mudar
    document.documentElement.className = theme;
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
};
