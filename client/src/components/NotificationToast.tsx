import React, { useState, useEffect } from 'react';
import { ToastProps } from '../types';
import { CheckCircleIcon, ErrorIcon } from '../assets/icons/CategoryIcons';

interface NotificationToastComponentProps {
  toast: ToastProps;
  onClose: () => void;
}

const NotificationToast: React.FC<NotificationToastComponentProps> = ({ 
  toast, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (toast.isVisible) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onClose();
        }, 300);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [toast.isVisible, onClose]);
  
  const bgColor = toast.type === 'success' ? 'bg-success' : 'bg-alert';
  
  return (
    <div 
      className={`fixed bottom-4 right-4 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {toast.type === 'success' ? (
        <CheckCircleIcon className="mr-2" />
      ) : (
        <ErrorIcon className="mr-2" />
      )}
      <span>{toast.message}</span>
    </div>
  );
};

export default NotificationToast;
