import { useState, useEffect, useCallback } from 'react';
import { themeStorage, THEMES } from '../utils/storage';

export const useTheme = () => {
  const [theme, setTheme] = useState(THEMES.LIGHT);
  const [loading, setLoading] = useState(true);

  // Load theme from storage on mount
  useEffect(() => {
    const loadTheme = () => {
      try {
        const storedTheme = themeStorage.getTheme();
        setTheme(storedTheme);
        applyTheme(storedTheme);
      } catch (error) {
        console.error('Error loading theme:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTheme();
  }, []);

  // Apply theme to document
  const applyTheme = useCallback((newTheme) => {
    const root = document.documentElement;
    
    if (newTheme === THEMES.DARK) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
  }, []);

  // Change theme
  const changeTheme = useCallback((newTheme) => {
    try {
      if (newTheme !== THEMES.LIGHT && newTheme !== THEMES.DARK) {
        throw new Error('Invalid theme');
      }

      themeStorage.setTheme(newTheme);
      setTheme(newTheme);
      applyTheme(newTheme);
      
      return { success: true };
    } catch (error) {
      console.error('Error changing theme:', error);
      return { success: false, error: 'Failed to change theme' };
    }
  }, [applyTheme]);

  // Toggle between light and dark themes
  const toggleTheme = useCallback(() => {
    const newTheme = theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    return changeTheme(newTheme);
  }, [theme, changeTheme]);

  // Check if current theme is dark
  const isDark = useCallback(() => {
    return theme === THEMES.DARK;
  }, [theme]);

  // Check if current theme is light
  const isLight = useCallback(() => {
    return theme === THEMES.LIGHT;
  }, [theme]);

  return {
    theme,
    loading,
    changeTheme,
    toggleTheme,
    isDark,
    isLight
  };
}; 