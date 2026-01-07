'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface RequireAuthProps {
  children: React.ReactNode;
  fallbackUrl?: string;
}

/**
 * Auth guard component that redirects unauthenticated users to login.
 * Shows a loading spinner while checking authentication state.
 */
export const RequireAuth: React.FC<RequireAuthProps> = ({ 
  children, 
  fallbackUrl = '/login' 
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(fallbackUrl);
    }
  }, [user, loading, router, fallbackUrl]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffbf3] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#fd5810] animate-spin" />
          <p className="text-[#6b7280] text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!user) {
    return null;
  }

  return <>{children}</>;
};
