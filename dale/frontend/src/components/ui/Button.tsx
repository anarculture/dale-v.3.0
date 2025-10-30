'use client';

import { Button as HeroUIButton } from "@heroui/react";
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const heroVariantMap: Record<string, "solid" | "bordered" | "light" | "flat" | "faded" | "shadow" | "ghost"> = {
      primary: "solid",
      secondary: "bordered",
      ghost: "light",
      danger: "solid",
      outline: "bordered"
    };

    const heroColorMap: Record<string, "primary" | "success" | "warning" | "secondary" | "danger" | "default"> = {
      primary: "primary",
      secondary: "default",
      ghost: "default",
      danger: "danger",
      outline: "default"
    };

    const heroSizeMap: Record<string, "sm" | "md" | "lg"> = {
      sm: "sm",
      md: "md",
      lg: "lg"
    };

    return (
      <HeroUIButton
        ref={ref}
        variant={heroVariantMap[variant]}
        color={heroColorMap[variant]}
        size={heroSizeMap[size]}
        isLoading={loading}
        isDisabled={disabled || loading}
        className={cn(
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {children}
      </HeroUIButton>
    );
  }
);

Button.displayName = 'Button';

export { Button };
