import React from 'react';
import { ChevronRight, Car, CreditCard, HelpCircle, LogOut, BadgeCheck } from 'lucide-react';

interface ProfileScreenProps {
  user: {
    name: string;
    avatar: string;
    rating: number;
    verified: boolean;
    ridesCompleted?: number;
  };
}

export function ProfileScreen({ user }: ProfileScreenProps) {
  const menuItems = [
    { id: 'rides', label: 'Mis viajes', icon: Car, badge: user.ridesCompleted },
    { id: 'payments', label: 'Pagos', icon: CreditCard },
    { id: 'help', label: 'Ayuda', icon: HelpCircle },
    { id: 'logout', label: 'Cerrar sesión', icon: LogOut, variant: 'danger' as const },
  ];

  return (
    <div className="min-h-screen bg-[#fffbf3]">
      {/* Mobile Layout */}
      <div className="lg:hidden pb-24">
        {/* Header */}
        <div className="bg-gradient-to-b from-[#fd5810] to-[#ff6b2c] px-6 pt-12 pb-8 text-white">
          <div className="flex flex-col items-center">
            {/* Avatar */}
            <div className="relative mb-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
              {user.verified && (
                <div className="absolute bottom-1 right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <BadgeCheck className="w-5 h-5 text-[#fd5810]" />
                </div>
              )}
            </div>
            
            <h2 className="text-2xl mb-2">{user.name}</h2>
            
            {/* Stats */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-xl">★</span>
                <span>{user.rating}</span>
              </div>
              <div className="w-1 h-1 bg-white/50 rounded-full" />
              <div className="flex items-center gap-1">
                {user.verified ? (
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
                  
                  <span className={`flex-1 text-left ${isDanger ? 'text-red-500' : 'text-[#1a1a1a]'}`}>
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
          <div className="bg-white rounded-2xl p-5">
            <h3 className="text-sm text-[#1a1a1a] mb-3">Información de la cuenta</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Miembro desde</span>
                <span className="text-[#1a1a1a]">Enero 2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Viajes completados</span>
                <span className="text-[#1a1a1a]">{user.ridesCompleted || 0}</span>
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
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-8">
                <div className="flex flex-col items-center">
                  {/* Avatar */}
                  <div className="relative mb-4">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-[#fff7ed] shadow-lg"
                    />
                    {user.verified && (
                      <div className="absolute bottom-2 right-2 w-9 h-9 bg-[#fd5810] rounded-full flex items-center justify-center shadow-lg">
                        <BadgeCheck className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <h2 className="text-2xl text-[#1a1a1a] mb-2">{user.name}</h2>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-3 text-sm text-[#6b7280] mb-4">
                    <div className="flex items-center gap-1">
                      <span className="text-2xl text-[#fd5810]">★</span>
                      <span className="text-[#1a1a1a]">{user.rating}</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full" />
                    <div className="flex items-center gap-1">
                      {user.verified && <BadgeCheck className="w-4 h-4 text-[#fd5810]" />}
                      <span>Verificado</span>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="w-full pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl text-[#fd5810]">{user.ridesCompleted}</div>
                        <div className="text-xs text-[#6b7280]">Viajes</div>
                      </div>
                      <div>
                        <div className="text-2xl text-[#fd5810]">{user.rating}</div>
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
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-xl text-[#1a1a1a]">Configuración de cuenta</h3>
                </div>
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  const isDanger = item.variant === 'danger';
                  
                  return (
                    <button
                      key={item.id}
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
                        <div className={`${isDanger ? 'text-red-500' : 'text-[#1a1a1a]'}`}>
                          {item.label}
                        </div>
                        {item.id === 'rides' && (
                          <div className="text-sm text-[#6b7280]">Ver historial completo</div>
                        )}
                        {item.id === 'payments' && (
                          <div className="text-sm text-[#6b7280]">Métodos de pago y facturas</div>
                        )}
                        {item.id === 'help' && (
                          <div className="text-sm text-[#6b7280]">Centro de ayuda y soporte</div>
                        )}
                      </div>
                      
                      {item.badge && (
                        <span className="px-3 py-1.5 bg-[#f3f4f6] rounded-full text-sm text-[#6b7280]">
                          {item.badge}
                        </span>
                      )}
                      
                      <ChevronRight className={`w-5 h-5 ${isDanger ? 'text-red-500' : 'text-[#6b7280]'}`} />
                    </button>
                  );
                })}
              </div>

              {/* Additional Info Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg text-[#1a1a1a] mb-4">Información de la cuenta</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-[#6b7280]">Miembro desde</span>
                    <span className="text-[#1a1a1a]">Enero 2025</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-[#6b7280]">Viajes completados</span>
                    <span className="text-[#1a1a1a]">{user.ridesCompleted || 0}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-[#6b7280]">Estado de verificación</span>
                    <span className="text-[#fd5810]">✓ Verificado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}