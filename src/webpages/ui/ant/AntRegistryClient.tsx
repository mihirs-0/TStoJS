'use client';

import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import type Entity from '@ant-design/cssinjs/es/Cache';
import { ConfigProvider, theme } from 'antd';
import { useServerInsertedHTML } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface IConfig {
  bgColor: React.CSSProperties['backgroundColor'];
  selectedBgColor: React.CSSProperties['backgroundColor'];
}

const CONFIG: IConfig = {
  bgColor: '#081042',
  selectedBgColor: '#2242ff',
};

// Theme context
interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
});

// Hook to use theme
export const useTheme = (): ThemeContextType => useContext(ThemeContext);

const AntStyledComponentsRegistry = ({ children }: React.PropsWithChildren) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const cache = React.useMemo<Entity>(() => createCache(), []);
  
  // Load theme preference from localStorage when component mounts
  useEffect((): void => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      // If no saved preference, default to dark mode
      localStorage.setItem('theme', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);
  
  // Save theme preference to localStorage when it changes
  useEffect((): void => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    // Update the document with a data-theme attribute for global CSS variables
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);
  
  const toggleTheme = (): void => {
    setIsDarkMode(prev => !prev);
  };
  
  useServerInsertedHTML(() => (
    <style
      id='antd'
      dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}
    />
  ));
  
  return (
    <StyleProvider cache={cache}>
      <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
        <ConfigProvider
          theme={{
            algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
            components: {
              Menu: {
                darkItemBg: CONFIG.bgColor,
                darkItemSelectedBg: CONFIG.selectedBgColor,
              },
              Layout: {
                siderBg: CONFIG.bgColor,
                triggerBg: CONFIG.bgColor,
              },
            },
          }}
        >
          {children}
        </ConfigProvider>
      </ThemeContext.Provider>
    </StyleProvider>
  );
};

export default AntStyledComponentsRegistry;
