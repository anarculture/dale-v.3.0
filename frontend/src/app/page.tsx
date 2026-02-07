'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FullScreenLoader } from '@/components/ui';

/**
 * Root page that redirects based on authentication status:
 * - Authenticated users → /home (welcome screen)
 * - Unauthenticated users → /login
 */
export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/home');
      } else {
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  // Show premium loading screen while checking auth
  return <FullScreenLoader />;
}
