'use client';

import { Input as HeroUIInput, InputProps as HeroUIInputProps } from "@heroui/react";
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends Omit<HeroUIInputProps, 'errorMessage' | 'description' | 'isInvalid'> {
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
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
