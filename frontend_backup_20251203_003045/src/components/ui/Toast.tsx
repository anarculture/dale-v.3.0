'use client';

import { createContext, useContext, ReactNode } from 'react';
import { toast, Toaster } from "sonner";

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const showToast = (type: ToastType, message: string, duration: number = 5000) => {
    switch (type) {
      case 'success':
        toast.success(message, { duration });
        break;
      case 'error':
        toast.error(message, { duration });
        break;
      case 'info':
        toast.info(message, { duration });
        break;
      case 'warning':
        toast.warning(message, { duration });
        break;
      default:
        toast(message, { duration });
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toaster position="top-center" />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
