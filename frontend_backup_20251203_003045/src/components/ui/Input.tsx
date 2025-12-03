'use client';

import { Input as HeroUIInput } from "@heroui/react";
import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    return (
      <HeroUIInput
        ref={ref}
        id={id}
        label={label}
        errorMessage={error}
        description={helperText}
        isInvalid={!!error}
        className={cn("w-full", className)}
        {...(props as any)}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
