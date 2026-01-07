'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

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

  // Show loading spinner while checking auth
  return (
    <div className="min-h-screen bg-[#fffbf3] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-[#fd5810] animate-spin" />
        <p className="text-[#6b7280] text-sm">Cargando...</p>
      </div>
    </div>
  );
}
