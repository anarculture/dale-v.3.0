'use client';

import React from "react";
import { DHeader } from "./DHeader";
import { DBottomNav } from "./DBottomNav";
import { DesktopTopNav } from "./DesktopTopNav";
import { useAuth } from "@/contexts/AuthContext";

interface AppLayoutProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  showBottomNav = true,
}) => {
  const { user } = useAuth();
  const userAvatar = user?.user_metadata?.avatar_url;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background-cream)]">
      {/* Desktop Navigation - hidden on mobile */}
      <DesktopTopNav userAvatar={userAvatar} />
      
      {/* Mobile Header - hidden on desktop */}
      <div className="sm:hidden">
        <DHeader />
      </div>
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 sm:pb-6">
        {children}
      </main>
      
      {/* Bottom Nav - mobile only */}
      {showBottomNav && <DBottomNav />}
    </div>
  );
};
