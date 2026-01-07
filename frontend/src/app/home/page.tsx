'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { DaleLogo } from '@/components/ui/DaleLogo';
import { UserAvatarMenu } from '@/components/ui/UserAvatarMenu';
import { RequireAuth } from '@/components/auth/RequireAuth';

function HomeContent() {
  const router = useRouter();

  const handleSearchClick = () => {
    router.push('/rides');
  };

  const handlePublishClick = () => {
    router.push('/offer');
  };

  return (
    <div className="min-h-screen bg-[#fffbf3] flex flex-col relative">
      {/* Mobile Top Right Avatar Menu */}
      <div className="lg:hidden absolute top-6 right-6 z-10">
        <UserAvatarMenu />
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col items-center justify-between p-6 pb-8 min-h-screen">
        {/* Logo */}
        <div className="pt-16">
          <DaleLogo size="lg" />
        </div>
        
        {/* Central Illustration & Text */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-20">
          {/* 3D Car Illustration */}
          <div className="mb-8 relative">
            <div className="w-48 h-48 bg-gradient-to-br from-[#fd5810] to-[#ff8c4b] rounded-3xl shadow-2xl flex items-center justify-center transform rotate-6 hover:rotate-12 transition-transform duration-300">
              <div className="transform -rotate-6">
                <img src="/favicon.png" alt="Dale" className="w-36 h-36 object-contain" />
              </div>
            </div>
            {/* Decorative circles */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#fff7ed] rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
            <div className="absolute -bottom-2 -left-6 w-8 h-8 bg-[#fd5810]/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
          </div>
          
          <h2 className="text-3xl font-semibold text-center text-[#1a1a1a] mb-3 px-4">
            Tu viaje, tu elección
          </h2>
          <p className="text-center text-[#6b7280] max-w-xs">
            Comparte tu trayecto y ahorra en cada viaje
          </p>
        </div>
        
        {/* Bottom CTA Container */}
        <div className="w-full max-w-md bg-card rounded-t-3xl p-6 -mx-6 shadow-2xl">
          <div className="space-y-3">
            <button
              onClick={handleSearchClick}
              className="w-full h-14 rounded-xl bg-[#fd5810] text-white font-semibold hover:bg-[#e54f0e] shadow-sm transition-all duration-200 active:scale-[0.98]"
            >
              Buscar un viaje
            </button>
            <button
              onClick={handlePublishClick}
              className="w-full h-14 rounded-xl bg-[#fff7ed] text-[#fd5810] font-semibold hover:bg-[#ffedd5] transition-all duration-200 active:scale-[0.98]"
            >
              Publicar un viaje
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 relative">
        {/* Desktop Top Right Avatar Menu */}
        <div className="absolute top-8 right-12 z-10">
          <UserAvatarMenu />
        </div>
        
        <div className="max-w-6xl w-full grid grid-cols-2 gap-12 items-center">
          {/* Left: Illustration */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              <div className="w-96 h-96 bg-gradient-to-br from-[#fd5810] to-[#ff8c4b] rounded-[3rem] shadow-2xl flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                <img src="/favicon.png" alt="Dale" className="w-72 h-72 object-contain" />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#fff7ed] rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
              <div className="absolute -bottom-4 -left-12 w-16 h-16 bg-[#fd5810]/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 -left-8 w-12 h-12 bg-[#fff7ed] rounded-full animate-bounce" style={{ animationDelay: '1.5s' }} />
            </div>
          </div>

          {/* Right: Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-6xl font-bold text-[#1a1a1a] mb-4 leading-tight">
                Tu viaje,<br />tu elección
              </h1>
              <p className="text-xl text-[#6b7280] mb-8">
                Comparte tu trayecto y ahorra en cada viaje.<br />
                Conecta con conductores verificados en tu ruta.
              </p>
            </div>

            {/* CTA Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div 
                onClick={handleSearchClick}
                className="bg-card rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-[#fd5810] group"
              >
                <div className="w-12 h-12 bg-[#fff7ed] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#fd5810] transition-colors">
                  <span className="text-2xl group-hover:scale-110 transition-transform">🔍</span>
                </div>
                <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">Buscar Viaje</h3>
                <p className="text-sm text-[#6b7280]">
                  Encuentra conductores en tu ruta
                </p>
              </div>

              <div 
                onClick={handlePublishClick}
                className="bg-card rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-[#fd5810] group"
              >
                <div className="w-12 h-12 bg-[#fff7ed] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#fd5810] transition-colors">
                  <span className="text-2xl group-hover:scale-110 transition-transform">➕</span>
                </div>
                <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">Publicar Viaje</h3>
                <p className="text-sm text-[#6b7280]">
                  Comparte tu viaje y ahorra
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="flex gap-8 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#fd5810] rounded-full" />
                <span className="text-sm text-[#6b7280]">Conductores verificados</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#fd5810] rounded-full" />
                <span className="text-sm text-[#6b7280]">Pagos seguros</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#fd5810] rounded-full" />
                <span className="text-sm text-[#6b7280]">Ahorro garantizado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <RequireAuth>
      <HomeContent />
    </RequireAuth>
  );
}
