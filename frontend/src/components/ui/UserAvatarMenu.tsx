'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  PlusCircle, 
  Car, 
  User, 
  LogOut, 
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, onClick, variant = 'default' }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-5 py-4 transition-colors text-left ${
      variant === 'danger' 
        ? 'text-red-600 hover:bg-red-50' 
        : 'text-[#1a1a1a] hover:bg-[#fff7ed]'
    }`}
  >
    <span className="text-[#6b7280]">{icon}</span>
    <span className="flex-1 font-medium">{label}</span>
    <ChevronDown className="w-4 h-4 text-[#9ca3af] rotate-[-90deg]" />
  </button>
);

export const UserAvatarMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
    router.push('/login');
  };

  const menuItems = [
    {
      icon: <PlusCircle className="w-5 h-5" />,
      label: 'Publicar viaje',
      onClick: () => { setIsOpen(false); router.push('/offer'); }
    },
    {
      icon: <Car className="w-5 h-5" />,
      label: 'Tus viajes',
      onClick: () => { setIsOpen(false); router.push('/bookings'); }
    },
    {
      icon: <User className="w-5 h-5" />,
      label: 'Perfil',
      onClick: () => { setIsOpen(false); router.push('/profile'); }
    },
  ];

  // Get user initials for avatar
  const getInitials = () => {
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-[#fff7ed] transition-colors"
        aria-label="User menu"
      >
        <div className="w-10 h-10 rounded-full bg-[#f3f4f6] border-2 border-[#e5e7eb] flex items-center justify-center text-[#6b7280] font-semibold">
          {getInitials()}
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-[#6b7280]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#6b7280]" />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Mobile: Full-screen overlay */}
          <div className="lg:hidden fixed inset-0 z-40 bg-white animate-in slide-in-from-top duration-200">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb]">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-[#6b7280]"
                >
                  <div className="w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center text-sm font-semibold">
                    {getInitials()}
                  </div>
                  <ChevronUp className="w-4 h-4" />
                </button>
                {/* Logo placeholder */}
                <div className="text-2xl font-bold text-[#fd5810]">Dale</div>
              </div>

              {/* Menu Items */}
              <div className="flex-1 py-2">
                {menuItems.map((item, index) => (
                  <MenuItem key={index} {...item} />
                ))}
              </div>

              {/* Sign Out */}
              <div className="border-t border-[#e5e7eb] py-2">
                <MenuItem
                  icon={<LogOut className="w-5 h-5" />}
                  label="Cerrar sesión"
                  onClick={handleSignOut}
                  variant="danger"
                />
              </div>
            </div>
          </div>

          {/* Desktop: Dropdown */}
          <div className="hidden lg:block absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#e5e7eb] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* User Info */}
            <div className="px-5 py-4 border-b border-[#e5e7eb] bg-[#fafafa]">
              <p className="text-sm text-[#6b7280]">Conectado como</p>
              <p className="font-medium text-[#1a1a1a] truncate">{user?.email}</p>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              {menuItems.map((item, index) => (
                <MenuItem key={index} {...item} />
              ))}
            </div>

            {/* Sign Out */}
            <div className="border-t border-[#e5e7eb] py-1">
              <MenuItem
                icon={<LogOut className="w-5 h-5" />}
                label="Cerrar sesión"
                onClick={handleSignOut}
                variant="danger"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
