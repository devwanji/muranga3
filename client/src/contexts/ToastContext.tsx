import React, { createContext, useState, useContext, ReactNode } from 'react';
import NotificationToast from '@/components/NotificationToast';
import { ToastProps } from '@/types';

interface ToastContextType {
  showToast: (type: 'success' | 'error', message: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toast, setToast] = useState<ToastProps>({
    type: 'success',
    message: '',
    isVisible: false
  });

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({
      type,
      message,
      isVisible: true
    });
  };

  const handleToastClose = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <NotificationToast 
        toast={toast} 
        onClose={handleToastClose} 
      />
    </ToastContext.Provider>
  );
};
