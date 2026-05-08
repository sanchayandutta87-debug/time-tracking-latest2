import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface ConfirmState {
  show: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}

interface AppContextType {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  compactView: boolean;
  setCompactView: (value: boolean) => void;
  toast: ToastState;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  hideToast: () => void;
  confirm: ConfirmState;
  askConfirm: (title: string, message: string, onConfirm: () => void) => void;
  hideConfirm: () => void;
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

  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    type: 'success'
  });

  const [confirm, setConfirm] = useState<ConfirmState>({
    show: false,
    title: '',
    message: '',
    onConfirm: () => {}
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

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => hideToast(), 5000);
  };

  const hideToast = () => setToast(prev => ({ ...prev, show: false }));

  const askConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirm({ show: true, title, message, onConfirm });
  };

  const hideConfirm = () => setConfirm(prev => ({ ...prev, show: false }));

  return (
    <AppContext.Provider value={{ 
      darkMode, 
      setDarkMode: handleSetDarkMode, 
      compactView, 
      setCompactView: handleSetCompactView,
      toast,
      showToast,
      hideToast,
      confirm,
      askConfirm,
      hideConfirm
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
