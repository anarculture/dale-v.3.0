import React from "react";

interface DFormFieldProps {
  label?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  helpText?: string;
}

export const DFormField: React.FC<DFormFieldProps> = ({
  label,
  error,
  children,
  className = "",
  helpText,
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      {children}
      {helpText && !error && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
      {error && (
        <p className="text-xs text-danger-500">{error}</p>
      )}
    </div>
  );
};
