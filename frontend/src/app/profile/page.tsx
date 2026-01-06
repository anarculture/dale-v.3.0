'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient, User } from '@/lib/api';
import { ChevronRight, Car, CreditCard, HelpCircle, LogOut, BadgeCheck, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user: authUser, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<User | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !authUser) {
      router.push('/login');
    }
  }, [authUser, authLoading, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!authUser) return;
      
      try {
        const userData = await apiClient.getMyProfile();
        setProfile(userData);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        // Use auth user metadata as fallback
      } finally {
        setProfileLoading(false);
      }
    };

    if (authUser) {
      fetchProfile();
    }
  }, [authUser]);

  // Loading state
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-[#fffbf3] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#fd5810] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authUser) {
    return null;
  }

  // Build user data from profile or auth fallback
  const userName = profile?.name || authUser.user_metadata?.full_name || 'Usuario';
  const userAvatar = profile?.avatar_url || authUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${userName}`;
  const userEmail = profile?.email || authUser.email || '';
  const isVerified = true; // Mock - not in API yet
  const rating = 4.8; // Mock - not in API yet
  const ridesCompleted = 12; // Mock - not in API yet
  
  // Format member since date
  const memberSince = profile?.created_at 
    ? new Date(profile.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
    : 'Enero 2025';

  const menuItems = [
    { id: 'rides', label: 'Mis viajes', icon: Car, badge: ridesCompleted, href: '/bookings' },
    { id: 'payments', label: 'Pagos', icon: CreditCard, href: '#' },
    { id: 'help', label: 'Ayuda', icon: HelpCircle, href: '#' },
    { id: 'logout', label: 'Cerrar sesión', icon: LogOut, variant: 'danger' as const, action: handleLogout },
  ];

  async function handleLogout() {
    try {
      await signOut();
      toast.success('Has cerrado sesión correctamente');
      router.push('/');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  }

  function handleMenuClick(item: typeof menuItems[0]) {
    if (item.action) {
      item.action();
    } else if (item.href && item.href !== '#') {
      router.push(item.href);
    } else {
      toast.info('Próximamente disponible');
    }
  }

  return (
    <div className="min-h-screen bg-[#fffbf3] pb-24">
      {/* Header with gradient */}
      <div className="bg-gradient-to-b from-[#fd5810] to-[#ff6b2c] px-6 pt-12 pb-8 text-white">
        <div className="flex flex-col items-center">
          {/* Avatar with verification badge */}
          <div className="relative mb-4">
            <img
              src={userAvatar}
              alt={userName}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
            {isVerified && (
              <div className="absolute bottom-1 right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg">
                <BadgeCheck className="w-5 h-5 text-[#fd5810]" />
              </div>
            )}
          </div>
          
          <h2 className="text-2xl font-bold mb-2">{userName}</h2>
          
          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-xl">★</span>
              <span>{rating}</span>
            </div>
            <div className="w-1 h-1 bg-white/50 rounded-full" />
            <div className="flex items-center gap-1">
              {isVerified ? (
                <>
                  <BadgeCheck className="w-4 h-4" />
                  <span>Verificado</span>
                </>
              ) : (
                <span>No verificado</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-6 space-y-3">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isDanger = item.variant === 'danger';
            
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item)}
                className={`
                  w-full flex items-center gap-4 px-5 py-4 
                  hover:bg-gray-50 transition-colors
                  ${index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''}
                `}
              >
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${isDanger ? 'bg-red-50' : 'bg-[#fff7ed]'}
                `}>
                  <Icon className={`w-5 h-5 ${isDanger ? 'text-red-500' : 'text-[#fd5810]'}`} />
                </div>
                
                <span className={`flex-1 text-left font-medium ${isDanger ? 'text-red-500' : 'text-[#1a1a1a]'}`}>
                  {item.label}
                </span>
                
                {item.badge && (
                  <span className="px-2.5 py-1 bg-[#f3f4f6] rounded-full text-xs text-[#6b7280]">
                    {item.badge}
                  </span>
                )}
                
                <ChevronRight className={`w-5 h-5 ${isDanger ? 'text-red-500' : 'text-[#6b7280]'}`} />
              </button>
            );
          })}
        </div>

        {/* Additional Info Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-[#1a1a1a] mb-3">Información de la cuenta</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#6b7280]">Correo</span>
              <span className="text-[#1a1a1a]">{userEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6b7280]">Miembro desde</span>
              <span className="text-[#1a1a1a]">{memberSince}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6b7280]">Viajes completados</span>
              <span className="text-[#1a1a1a]">{ridesCompleted}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
