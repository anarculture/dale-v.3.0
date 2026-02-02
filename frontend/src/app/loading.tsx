'use client';

import React from 'react';
import { DaleLogo } from '@/components/ui/DaleLogo';

/**
 * Global Loading Screen
 * 
 * This file uses Next.js App Router's loading.tsx convention to provide
 * an automatic loading UI during:
 * - Initial page loads
 * - Navigation between routes
 * - Dev server route compilation (the "hanging" state)
 * 
 * Next.js automatically wraps page content in a React Suspense boundary
 * and shows this component while the route segment is loading.
 */
export default function Loading() {
  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1a1a1a] animate-loading-fade-in"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      {/* Gradient background overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#252525] to-[#1a1a1a] opacity-80" />
      
      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Animated logo with pulse effect */}
        <div className="animate-loading-pulse">
          <DaleLogo size="xl" color="orange" />
        </div>
        
        {/* Custom spinner dots */}
        <div className="flex items-center gap-2">
          <span 
            className="w-2.5 h-2.5 rounded-full bg-[#fd5810] animate-loading-dot"
            style={{ animationDelay: '0ms' }} 
          />
          <span 
            className="w-2.5 h-2.5 rounded-full bg-[#fd5810] animate-loading-dot"
            style={{ animationDelay: '150ms' }} 
          />
          <span 
            className="w-2.5 h-2.5 rounded-full bg-[#fd5810] animate-loading-dot"
            style={{ animationDelay: '300ms' }} 
          />
        </div>
        
        {/* Loading text */}
        <p className="text-white/60 text-sm tracking-widest uppercase font-light">
          Cargando...
        </p>
      </div>
    </div>
  );
}
