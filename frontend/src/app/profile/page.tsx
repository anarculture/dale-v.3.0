'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient, User } from '@/lib/api';
import { ChevronRight, Car, CreditCard, HelpCircle, LogOut, BadgeCheck } from 'lucide-react';
import { toast } from 'sonner';
import { DBottomNav } from '@/components/layout/DBottomNav';
import { DesktopTopNav } from '@/components/layout/DesktopTopNav';
import { FullScreenLoader } from '@/components/ui';

export default function ProfilePage() {
  const { user: authUser, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<User | null>(null);
  const [phone, setPhone] = useState('');
  const [isEditingPhone, setIsEditingPhone] = useState(false);
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
        setPhone(userData.phone || '');
      } catch (error) {
        console.error('Failed to fetch profile:', error);
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
    return <FullScreenLoader />;
  }

  if (!authUser) {
    return null;
  }

  // Build user data from profile or auth fallback
  const userName = profile?.name || authUser.user_metadata?.full_name || 'Usuario';
  const userAvatar = profile?.avatar_url || authUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${userName}`;
  const userEmail = profile?.email || authUser.email || '';
  const isVerified = true; // Mock - not in API yet
  const rating = profile?.average_rating ?? null;
  const ratingCount = profile?.rating_count ?? 0;
  const memberSince = profile?.created_at 
    ? new Date(profile.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
    : 'Enero 2025';

  const menuItems = [
    { id: 'rides', label: 'Mis viajes', icon: Car, href: '/bookings', description: 'Ver historial completo' },
    { id: 'payments', label: 'Pagos', icon: CreditCard, href: '#', description: 'Métodos de pago y facturas' },
    { id: 'help', label: 'Ayuda', icon: HelpCircle, href: '#', description: 'Centro de ayuda y soporte' },
    { id: 'logout', label: 'Cerrar sesión', icon: LogOut, variant: 'danger' as const, action: handleLogout },
  ];

  async function handleUpdatePhone() {
    try {
      await apiClient.updateMyProfile({ phone });
      setProfile(prev => prev ? { ...prev, phone } : null);
      setIsEditingPhone(false);
      toast.success('Teléfono actualizado');
    } catch (error) {
      toast.error('Error al actualizar teléfono');
    }
  }

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
    <div className="min-h-screen bg-[#fffbf3]">
      {/* Desktop Top Navigation */}
      <DesktopTopNav />
      
      {/* Mobile Layout */}
      <div className="lg:hidden pb-24">
        {/* Header */}
        <div className="bg-gradient-to-b from-[#fd5810] to-[#ff6b2c] px-6 pt-12 pb-8 text-white">
          <div className="flex flex-col items-center">
            {/* Avatar */}
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
                <span>{rating !== null ? rating.toFixed(1) : '—'}</span>
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
          <div className="bg-card rounded-2xl overflow-hidden shadow-sm">
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
                  
                  <ChevronRight className={`w-5 h-5 ${isDanger ? 'text-red-500' : 'text-[#6b7280]'}`} />
                </button>
              );
            })}
          </div>

          {/* Additional Info Card */}
          <div className="bg-card rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-[#1a1a1a] mb-3">Información de la cuenta</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Correo</span>
                <span className="text-[#1a1a1a]">{userEmail}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#6b7280]">Teléfono</span>
                {isEditingPhone ? (
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-32 px-2 py-1 text-sm border rounded"
                      placeholder="+58..."
                    />
                    <button onClick={handleUpdatePhone} className="text-[#fd5810] text-xs font-bold">Guardar</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <span className="text-[#1a1a1a]">{profile?.phone || 'Sin registrar'}</span>
                    <button onClick={() => setIsEditingPhone(true)} className="text-[#fd5810] text-xs">Editar</button>
                  </div>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Miembro desde</span>
                <span className="text-[#1a1a1a]">{memberSince}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Reseñas</span>
                <span className="text-[#1a1a1a]">{ratingCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen p-8">
        <div className="max-w-4xl mx-auto w-full">
          <div className="grid grid-cols-3 gap-6">
            {/* Left: Profile Card */}
            <div className="col-span-1">
              <div className="bg-card rounded-2xl p-6 shadow-sm sticky top-8">
                <div className="flex flex-col items-center">
                  {/* Avatar */}
                  <div className="relative mb-4">
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="w-32 h-32 rounded-full object-cover border-4 border-[#fff7ed] shadow-lg"
                    />
                    {isVerified && (
                      <div className="absolute bottom-2 right-2 w-9 h-9 bg-[#fd5810] rounded-full flex items-center justify-center shadow-lg">
                        <BadgeCheck className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2">{userName}</h2>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-3 text-sm text-[#6b7280] mb-4">
                    <div className="flex items-center gap-1">
                      <span className="text-2xl text-[#fd5810]">★</span>
                      <span className="text-[#1a1a1a] font-medium">{rating !== null ? rating.toFixed(1) : '—'}</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full" />
                    <div className="flex items-center gap-1">
                      {isVerified && <BadgeCheck className="w-4 h-4 text-[#fd5810]" />}
                      <span>Verificado</span>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="w-full pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-[#fd5810]">{ratingCount}</div>
                        <div className="text-xs text-[#6b7280]">Reseñas</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-[#fd5810]">{rating !== null ? rating.toFixed(1) : '—'}</div>
                        <div className="text-xs text-[#6b7280]">Rating</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Menu & Info */}
            <div className="col-span-2 space-y-6">
              {/* Menu Items */}
              <div className="bg-card rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-[#1a1a1a]">Configuración de cuenta</h3>
                </div>
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  const isDanger = item.variant === 'danger';
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMenuClick(item)}
                      className={`
                        w-full flex items-center gap-4 px-6 py-4 
                        hover:bg-gray-50 transition-colors
                        ${index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''}
                      `}
                    >
                      <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center
                        ${isDanger ? 'bg-red-50' : 'bg-[#fff7ed]'}
                      `}>
                        <Icon className={`w-6 h-6 ${isDanger ? 'text-red-500' : 'text-[#fd5810]'}`} />
                      </div>
                      
                      <div className="flex-1 text-left">
                        <div className={`font-medium ${isDanger ? 'text-red-500' : 'text-[#1a1a1a]'}`}>
                          {item.label}
                        </div>
                        {item.description && (
                          <div className="text-sm text-[#6b7280]">{item.description}</div>
                        )}
                      </div>
                      
                      <ChevronRight className={`w-5 h-5 ${isDanger ? 'text-red-500' : 'text-[#6b7280]'}`} />
                    </button>
                  );
                })}
              </div>

              {/* Additional Info Card */}
              <div className="bg-card rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">Información de la cuenta</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-[#6b7280]">Correo</span>
                    <span className="text-[#1a1a1a]">{userEmail}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100 items-center">
                    <span className="text-[#6b7280]">Teléfono</span>
                    {isEditingPhone ? (
                      <div className="flex gap-2">
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-40 px-3 py-1 text-sm border rounded-lg"
                          placeholder="+58..."
                        />
                        <button onClick={handleUpdatePhone} className="bg-[#fd5810] text-white px-3 py-1 rounded-lg text-sm">Guardar</button>
                      </div>
                    ) : (
                      <div className="flex gap-2 items-center">
                        <span className="text-[#1a1a1a] font-medium">{profile?.phone || 'Sin registrar'}</span>
                        <button onClick={() => setIsEditingPhone(true)} className="text-[#fd5810] text-sm hover:underline">Editar</button>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-[#6b7280]">Miembro desde</span>
                    <span className="text-[#1a1a1a]">{memberSince}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-[#6b7280]">Reseñas</span>
                    <span className="text-[#1a1a1a]">{ratingCount}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-[#6b7280]">Estado de verificación</span>
                    <span className="text-[#fd5810] font-medium">✓ Verificado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <DBottomNav />
    </div>
  );
}
