'use client';

import React, { forwardRef } from 'react';
import { Button as HeroUIButton, ButtonProps as HeroUIButtonProps } from '@heroui/react';
import { cn } from '@/lib/utils';

export interface DButtonProps extends HeroUIButtonProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const DButton = forwardRef<HTMLButtonElement, DButtonProps>(
  (
    {
      className,
      variant = 'solid',
      color = 'primary',
      size = 'md',
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      startContent,
      endContent,
      ...props
    },
    ref
  ) => {
    return (
      <HeroUIButton
        ref={ref}
        variant={variant}
        color={color}
        size={size}
        startContent={startContent || leftIcon}
        endContent={endContent || rightIcon}
        className={cn(
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {children}
      </HeroUIButton>
    );
  }
);

DButton.displayName = 'DButton';
