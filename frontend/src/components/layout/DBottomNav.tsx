import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusCircle, Calendar, User } from "lucide-react";

export const DBottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: "Inicio", href: "/home", icon: Home },
    { label: "Buscar", href: "/rides", icon: Search },
    { label: "Publicar", href: "/offer", icon: PlusCircle },
    { label: "Reservas", href: "/bookings", icon: Calendar },
    { label: "Perfil", href: "/profile", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 flex justify-around items-center z-50 sm:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center w-full p-1 ${
              isActive ? "text-[#fd5810]" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};
