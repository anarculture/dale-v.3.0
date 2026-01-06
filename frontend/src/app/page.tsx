'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const handleSearchClick = () => {
    router.push('/rides');
  };

  const handlePublishClick = () => {
    router.push('/offer');
  };

  return (
    <div className="min-h-screen bg-[#fffbf3] flex flex-col items-center justify-between p-6 pb-8">
      {/* Logo */}
      <div className="pt-16">
        <h1 className="text-4xl font-bold text-[#fd5810] tracking-tight">Dale!</h1>
      </div>
      
      {/* Central Illustration & Text */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-20">
        {/* 3D Car Illustration */}
        <div className="mb-8 relative">
          <div className="w-48 h-48 bg-gradient-to-br from-[#fd5810] to-[#ff8c4b] rounded-3xl shadow-2xl flex items-center justify-center transform rotate-6 hover:rotate-12 transition-transform duration-300">
            <div className="transform -rotate-6">
              {/* Simple car shape using emojis/shapes */}
              <div className="text-8xl">🚗</div>
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
      <div className="w-full max-w-md bg-white rounded-t-3xl p-6 -mx-6 shadow-2xl">
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
  );
}
