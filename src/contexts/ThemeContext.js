/**
 * Contexte pour la gestion du thème (sombre/clair)
 * Avec persistance dans localStorage
 */

import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Charger le thème depuis localStorage au démarrage
  useEffect(() => {
    const savedTheme = localStorage.getItem('medai_theme');
    if (savedTheme !== null) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      // Défaut: mode sombre pour l'interface médicale
      setIsDarkMode(true);
    }
  }, []);

  // Sauvegarder le thème dans localStorage quand il change
  useEffect(() => {
    localStorage.setItem('medai_theme', isDarkMode ? 'dark' : 'light');
    
    // Appliquer la classe au body
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const setTheme = (theme) => {
    setIsDarkMode(theme === 'dark');
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
