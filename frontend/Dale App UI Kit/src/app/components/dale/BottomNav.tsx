import React from 'react';
import { Search, Plus, User } from 'lucide-react';
import { cn } from '../ui/utils';

export type NavTab = 'buscar' | 'publicar' | 'perfil';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'buscar' as NavTab, label: 'Buscar', icon: Search },
    { id: 'publicar' as NavTab, label: 'Publicar', icon: Plus },
    { id: 'perfil' as NavTab, label: 'Perfil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
      <div className="flex items-center justify-around h-20 max-w-[375px] mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 min-w-[80px] h-full',
                'transition-colors duration-200'
              )}
            >
              <Icon
                className={cn(
                  'w-6 h-6 transition-colors',
                  isActive ? 'text-[#fd5810]' : 'text-[#6b7280]'
                )}
              />
              <span
                className={cn(
                  'text-xs transition-colors',
                  isActive ? 'text-[#fd5810]' : 'text-[#6b7280]'
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
