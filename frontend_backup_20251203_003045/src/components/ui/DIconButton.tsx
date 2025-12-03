import React from "react";
import { DButton } from "./DButton";
import { ButtonProps } from "@heroui/react";

interface DIconButtonProps extends ButtonProps {
  icon: React.ReactNode;
  label: string; // Accessibility label is required
}

export const DIconButton: React.FC<DIconButtonProps> = ({
  icon,
  label,
  className,
  ...props
}) => {
  return (
    <DButton
      isIconOnly
      aria-label={label}
      className={className}
      {...props}
    >
      {icon}
    </DButton>
  );
};
