import React from "react";
import { Select, SelectProps, SelectItem } from "@heroui/react";

interface Option {
  label: string;
  value: string;
}

interface DSelectProps extends Omit<SelectProps, "children"> {
  options: Option[];
  error?: string;
}

export const DSelect: React.FC<DSelectProps> = ({
  options,
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
    <Select
      label={label}
      variant={variant}
      color={error ? "danger" : color}
      isInvalid={!!error || isInvalid}
      errorMessage={error || errorMessage}
      classNames={{
        trigger: "bg-white",
        ...classNames,
      }}
      {...props}
    >
      {options.map((option) => (
        <SelectItem key={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </Select>
  );
};
