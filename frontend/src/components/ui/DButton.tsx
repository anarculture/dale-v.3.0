import React from "react";
import { Button, ButtonProps } from "@heroui/react";
import { Loader2 } from "lucide-react";

interface DButtonProps extends ButtonProps {
  variant?: "solid" | "bordered" | "light" | "flat" | "faded" | "shadow" | "ghost";
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const DButton: React.FC<DButtonProps> = ({
  children,
  variant = "solid",
  color = "primary",
  isLoading,
  leftIcon,
  rightIcon,
  className,
  ...props
}) => {
  return (
    <Button
      variant={variant}
      color={color}
      className={`font-medium ${className || ''}`}
      isDisabled={isLoading || props.isDisabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </Button>
  );
};
