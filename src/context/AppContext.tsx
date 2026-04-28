import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  compactView: boolean;
  setCompactView: (value: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    const isDark = saved ? JSON.parse(saved) : false;
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return isDark;
  });
  const [compactView, setCompactView] = useState(() => {
    const saved = localStorage.getItem('compactView');
    return saved ? JSON.parse(saved) : false;
  });

  // Global HTML class toggle for Tailwind Dark Mode support
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSetDarkMode = (value: boolean) => {
    setDarkMode(value);
    localStorage.setItem('darkMode', JSON.stringify(value));
  };

  const handleSetCompactView = (value: boolean) => {
    setCompactView(value);
    localStorage.setItem('compactView', JSON.stringify(value));
  };

  return (
    <AppContext.Provider value={{ 
      darkMode, 
      setDarkMode: handleSetDarkMode, 
      compactView, 
      setCompactView: handleSetCompactView 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
