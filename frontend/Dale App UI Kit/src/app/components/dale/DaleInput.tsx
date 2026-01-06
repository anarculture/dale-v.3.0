import React from 'react';
import { cn } from '../ui/utils';

interface DaleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function DaleInput({ 
  label, 
  error, 
  icon, 
  className, 
  ...props 
}: DaleInputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm text-[#1a1a1a]">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6b7280]">
            {icon}
          </div>
        )}
        <input
          className={cn(
            'w-full h-14 px-4 rounded-xl bg-[#f3f4f6] border-2 border-transparent transition-all duration-200',
            'placeholder:text-[#9ca3af] text-[#1a1a1a]',
            'focus:outline-none focus:border-[#fd5810] focus:bg-white',
            error && 'border-red-500 focus:border-red-500',
            icon && 'pl-12',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
