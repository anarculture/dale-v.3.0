'use client';

import { createContext, useContext, ReactNode } from 'react';
import { toast as heroToast } from "@heroui/react";

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const showToast = (type: ToastType, message: string, duration: number = 5000) => {
    const heroTypeMap = {
      success: "success" as const,
      error: "danger" as const,
      info: "primary" as const,
      warning: "warning" as const,
    };

    heroToast.custom(message, {
      className: "bg-background",
      classNames: {
        base: "p-4 rounded-lg border border-divider",
        content: "text-content1",
      },
      color: heroTypeMap[type],
      timeout: duration,
    });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
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
