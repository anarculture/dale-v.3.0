'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, PlusCircle, Calendar, User } from 'lucide-react';

interface DesktopTopNavProps {
  userAvatar?: string;
}

export function DesktopTopNav({ userAvatar }: DesktopTopNavProps) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Inicio', href: '/home', icon: Home },
    { label: 'Buscar', href: '/rides', icon: Search },
    { label: 'Publicar', href: '/offer', icon: PlusCircle },
    { label: 'Reservas', href: '/bookings', icon: Calendar },
  ];

  return (
    <nav className="hidden sm:flex w-full bg-[var(--surface-white)] border-b border-[var(--border)]">
      <div className="max-w-[1440px] mx-auto px-8 h-16 flex items-center justify-between w-full">
        {/* Logo */}
        <Link href="/home" className="flex items-center">
          <span className="text-2xl font-bold text-[var(--text-heading)] tracking-tight">
            Dale!
          </span>
        </Link>

        {/* Center Navigation */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200
                  ${isActive 
                    ? 'bg-[var(--secondary)] text-[var(--primary-orange)]' 
                    : 'text-[var(--text-body)] hover:bg-[var(--muted)] hover:text-[var(--text-heading)]'
                  }
                `}
              >
                <Icon className={`w-5 h-5 stroke-[1.5] ${isActive ? 'text-[var(--primary-orange)]' : ''}`} />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right Section: Profile */}
        <Link
          href="/profile"
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200
            ${pathname === '/profile' 
              ? 'bg-[var(--secondary)]' 
              : 'hover:bg-[var(--muted)]'
            }
          `}
        >
          <span className={`font-medium text-sm ${pathname === '/profile' ? 'text-[var(--primary-orange)]' : 'text-[var(--text-heading)]'}`}>
            Perfil
          </span>
          {userAvatar ? (
            <img
              src={userAvatar}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border border-[var(--border)]"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[var(--surface-beige)] flex items-center justify-center border border-[var(--border)]">
              <User className="w-4 h-4 text-[var(--text-body)] stroke-[1.5]" />
            </div>
          )}
        </Link>
      </div>
    </nav>
  );
}
