'use client';

import React from 'react';
import Image from 'next/image';

interface DaleLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: 'dark' | 'orange' | 'white';
}

const sizeMap = {
  sm: { width: 80, height: 32 },
  md: { width: 100, height: 40 },
  lg: { width: 130, height: 52 },
  xl: { width: 180, height: 72 },
};

export function DaleLogo({ size = 'md', className = '' }: DaleLogoProps) {
  const dimensions = sizeMap[size];

  return (
    <Image
      src="/logo.png"
      alt="Dale!"
      width={dimensions.width}
      height={dimensions.height}
      className={`object-contain ${className}`}
      priority
    />
  );
}
