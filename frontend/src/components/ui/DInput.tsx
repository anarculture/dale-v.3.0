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
    <Input
      label={label}
      variant={variant}
      color={error ? "danger" : color}
      isInvalid={!!error || isInvalid}
      errorMessage={error || errorMessage}
      classNames={{
        ...classNames,
        inputWrapper: `bg-white ${classNames?.inputWrapper || ""}`,
      }}
      {...props}
    />
  );
};
