import { useState, useEffect } from 'react';
import type { ThemeSettings } from '../types/theme';
import { generateCssVariables } from '../utils/theme';

const THEME_STORAGE_KEY = 'themeSettings';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeSettings>(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored ? JSON.parse(stored) : getDefaultTheme();
  });

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
    applyTheme(theme);
  }, [theme]);

  const updateTheme = (updates: Partial<ThemeSettings>) => {
    setTheme(current => ({
      ...current,
      ...updates,
    }));
  };

  return { theme, updateTheme };
}

function applyTheme(theme: ThemeSettings) {
  const root = document.documentElement;
  const variables = generateCssVariables(theme);
  
  Object.entries(variables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

function getDefaultTheme(): ThemeSettings {
  return {
    fonts: {
      heading: {
        family: 'Inter',
        weight: 700,
        size: '2rem',
        lineHeight: '1.2',
        letterSpacing: '-0.02em',
      },
      body: {
        family: 'Inter',
        weight: 400,
        size: '1rem',
        lineHeight: '1.5',
        letterSpacing: '0',
      },
      accent: {
        family: 'Inter',
        weight: 600,
        size: '1.125rem',
        lineHeight: '1.4',
        letterSpacing: '-0.01em',
      },
    },
    colors: {
      primary: '#6366f1',
      secondary: '#4f46e5',
      accent: '#8b5cf6',
      background: '#ffffff',
      text: '#1f2937',
      heading: '#111827',
    },
    spacing: {
      container: '1rem',
      section: '4rem',
      element: '1rem',
    },
    animations: {
      duration: '300ms',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  };
}