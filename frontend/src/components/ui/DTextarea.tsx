import React from "react";
import { Textarea, TextAreaProps } from "@heroui/react";

interface DTextareaProps extends TextAreaProps {
  error?: string;
}

export const DTextarea: React.FC<DTextareaProps> = ({
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
    <Textarea
      label={label}
      variant={variant}
      color={error ? "danger" : color}
      isInvalid={!!error || isInvalid}
      errorMessage={error || errorMessage}
      classNames={{
        inputWrapper: "bg-white",
        ...classNames,
      }}
      {...props}
    />
  );
};
