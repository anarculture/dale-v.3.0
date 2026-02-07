'use client';

import { ReactNode } from 'react';
import { HeroUIProvider } from "@heroui/react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/components/ui";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <HeroUIProvider>
      <AuthProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </AuthProvider>
    </HeroUIProvider>
  );
}
