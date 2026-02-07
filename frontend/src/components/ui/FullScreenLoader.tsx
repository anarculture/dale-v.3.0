'use client';

import React from 'react';
import { DaleLogo } from './DaleLogo';

/**
 * FullScreenLoader - Premium full-screen loading component
 * 
 * Use this for:
 * - Auth checking states
 * - Page-level loading
 * - Any full-screen loading overlay
 * 
 * Features:
 * - Cream gradient background
 * - Animated DaleLogo with pulse effect
 * - Bouncing orange dots with glow
 * - Smooth fade-in transition
 */
export const FullScreenLoader: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center animate-loading-fade-in overflow-hidden"
      role="status"
      aria-live="polite"
      aria-label="Cargando"
    >
      {/* Cream gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fef9f3] via-[#fff8f0] to-[#fdf5eb]" />
      
      {/* Subtle radial glow accent */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(253,88,16,0.06)_0%,transparent_60%)]" />
      
      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center gap-10">
        {/* Animated logo with pulse effect */}
        <div className="animate-loading-pulse">
          <DaleLogo size="xl" color="orange" />
        </div>
        
        {/* Bouncing dots */}
        <div className="flex items-center gap-3">
          <span 
            className="w-3 h-3 rounded-full bg-[#fd5810] shadow-[0_0_12px_rgba(253,88,16,0.4)] animate-loading-dot"
            style={{ animationDelay: '0ms' }} 
          />
          <span 
            className="w-3 h-3 rounded-full bg-[#fd5810] shadow-[0_0_12px_rgba(253,88,16,0.4)] animate-loading-dot"
            style={{ animationDelay: '150ms' }} 
          />
          <span 
            className="w-3 h-3 rounded-full bg-[#fd5810] shadow-[0_0_12px_rgba(253,88,16,0.4)] animate-loading-dot"
            style={{ animationDelay: '300ms' }} 
          />
        </div>
      </div>
    </div>
  );
};
