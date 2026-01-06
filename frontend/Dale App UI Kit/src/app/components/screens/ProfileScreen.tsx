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
    <div className="min-h-screen bg-[#fffbf3] pb-24">
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
  );
}
