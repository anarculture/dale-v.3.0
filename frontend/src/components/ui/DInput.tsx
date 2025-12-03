import React from "react";
import { Input, InputProps } from "@heroui/react";

interface DInputProps extends InputProps {
  label?: string;
  error?: string;
}

export const DInput: React.FC<DInputProps> = ({
  label,
  error,
  errorMessage,
  isInvalid,
  variant = "bordered",
  color = "primary",
  classNames,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full" suppressHydrationWarning>
      {label && (
        <span className="text-small font-medium text-foreground-700">
          {label}
        </span>
      )}
      <Input
        variant={variant}
        color={error ? "danger" : color}
        isInvalid={!!error || isInvalid}
        errorMessage={error || errorMessage}
        labelPlacement="outside"
        classNames={{
          ...classNames,
          inputWrapper: `bg-white ${classNames?.inputWrapper || ""}`,
        }}
        {...props}
      />
    </div>
  );
};
