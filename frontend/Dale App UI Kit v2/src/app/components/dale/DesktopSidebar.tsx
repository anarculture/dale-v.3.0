import React from 'react';
import { Search, Plus, User, Car } from 'lucide-react';
import { cn } from '../ui/utils';

export type NavTab = 'buscar' | 'publicar' | 'perfil';

interface DesktopSidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onLogoClick?: () => void;
}

export function DesktopSidebar({ activeTab, onTabChange, onLogoClick }: DesktopSidebarProps) {
  const tabs = [
    { id: 'buscar' as NavTab, label: 'Buscar Viaje', icon: Search },
    { id: 'publicar' as NavTab, label: 'Publicar Viaje', icon: Plus },
    { id: 'perfil' as NavTab, label: 'Mi Perfil', icon: User },
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      {/* Logo */}
      <div 
        className="p-6 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition"
        onClick={onLogoClick}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#fd5810] rounded-xl flex items-center justify-center">
            <Car className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl text-[#fd5810]">Dale!</h1>
        </div>
        <p className="text-xs text-[#6b7280] mt-1">Tu viaje, tu elección</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                  isActive 
                    ? 'bg-[#fff7ed] text-[#fd5810]' 
                    : 'text-[#6b7280] hover:bg-gray-50'
                )}
              >
                <Icon className={cn('w-5 h-5', isActive ? 'text-[#fd5810]' : 'text-[#6b7280]')} />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-[#6b7280] text-center">
          © 2025 Dale!
          <br />
          Carpooling App
        </div>
      </div>
    </aside>
  );
}
