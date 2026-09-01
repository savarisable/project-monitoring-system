import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEMES = [
  { id: 'dark', name: 'Dark Tech', icon: '🌙', primaryColor: '#38bdf8' },
  { id: 'light', name: 'Academic Light', icon: '☀️', primaryColor: '#2563eb' },
  { id: 'aurora', name: 'Neon Aurora', icon: '🌌', primaryColor: '#a855f7' },
  { id: 'cyberpunk', name: 'Cyber Sunset', icon: '🌆', primaryColor: '#f43f5e' },
];

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app_theme') || 'dark'; // Default to ultra-cool Dark Tech!
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const idx = THEMES.findIndex((t) => t.id === prev);
      const nextIdx = (idx + 1) % THEMES.length;
      return THEMES[nextIdx].id;
    });
  };

  const setSpecificTheme = (themeId) => {
    if (THEMES.some((t) => t.id === themeId)) {
      setTheme(themeId);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setSpecificTheme, toggleTheme, currentTheme: THEMES.find((t) => t.id === theme) || THEMES[0], themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
