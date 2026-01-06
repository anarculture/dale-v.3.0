'use client';

import React from 'react';

interface DaleLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: 'dark' | 'orange' | 'white';
}

const sizeClasses = {
  sm: 'text-2xl',
  md: 'text-3xl',
  lg: 'text-4xl',
  xl: 'text-6xl',
};

const colorClasses = {
  dark: 'text-[#1a1a1a]',
  orange: 'text-[#fd5810]',
  white: 'text-white',
};

export function DaleLogo({ size = 'md', className = '', color = 'dark' }: DaleLogoProps) {
  return (
    <span
      className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      style={{ 
        fontFamily: "'Agrandir Wide', 'Agrandir', sans-serif", 
        fontStyle: 'italic', 
        fontWeight: 900 
      }}
    >
      dale!
    </span>
  );
}
