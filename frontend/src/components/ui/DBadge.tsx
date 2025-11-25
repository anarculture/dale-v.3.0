import React from "react";
import { Chip, ChipProps } from "@heroui/react";

interface DBadgeProps extends ChipProps {
  variant?: "solid" | "bordered" | "light" | "flat" | "faded" | "shadow" | "dot";
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
}

export const DBadge: React.FC<DBadgeProps> = ({
  children,
  variant = "flat",
  color = "primary",
  className,
  ...props
}) => {
  return (
    <Chip
      variant={variant}
      color={color}
      className={`font-medium ${className}`}
      {...props}
    >
      {children}
    </Chip>
  );
};
