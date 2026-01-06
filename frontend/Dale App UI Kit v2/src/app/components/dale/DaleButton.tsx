import React from 'react';
import { cn } from '../ui/utils';

interface DaleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
}

export function DaleButton({ 
  variant = 'primary', 
  className, 
  children, 
  ...props 
}: DaleButtonProps) {
  const baseStyles = 'w-full h-14 rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#fd5810] text-white hover:bg-[#e54f0e] shadow-sm',
    secondary: 'bg-[#fff7ed] text-[#fd5810] hover:bg-[#ffedd5]',
    ghost: 'bg-transparent text-[#6b7280] hover:bg-[#f3f4f6]',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
