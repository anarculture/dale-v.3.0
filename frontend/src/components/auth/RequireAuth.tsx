'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FullScreenLoader } from '@/components/ui';

interface RequireAuthProps {
  children: React.ReactNode;
  fallbackUrl?: string;
}

/**
 * Auth guard component that redirects unauthenticated users to login.
 * Shows the premium loading screen while checking authentication state.
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

  // Show premium loading screen while checking auth
  if (loading) {
    return <FullScreenLoader />;
  }

  // Don't render children if not authenticated
  if (!user) {
    return null;
  }

  return <>{children}</>;
};
