// ThemeContext.js
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { LightTheme, DarkTheme } from './Themes/themes';

interface Theme{
    dark: boolean,
    colors: {
        background: string,
        cardBackground: string,
        text: string,
        primary: string,
    },
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (theme : Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children}: {children : ReactNode}) => {
  const [theme, setTheme] = useState(DarkTheme);

  const toggleTheme = () => {
    setTheme(prev => (prev === LightTheme ? DarkTheme : LightTheme));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const themeAuth = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};