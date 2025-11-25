import React from "react";
import { DHeader } from "./DHeader";
import { DBottomNav } from "./DBottomNav";

interface AppLayoutProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  showBottomNav = true,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <DHeader />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 sm:pb-6">
        {children}
      </main>
      {showBottomNav && <DBottomNav />}
    </div>
  );
};
