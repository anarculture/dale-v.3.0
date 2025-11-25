import React from "react";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";

interface DAlertProps {
  title?: string;
  description: string;
  variant?: "info" | "success" | "warning" | "error";
  className?: string;
}

export const DAlert: React.FC<DAlertProps> = ({
  title,
  description,
  variant = "info",
  className = "",
}) => {
  const styles = {
    info: "bg-blue-50 text-blue-800 border-blue-200",
    success: "bg-green-50 text-green-800 border-green-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
    error: "bg-red-50 text-red-800 border-red-200",
  };

  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertCircle,
    error: XCircle,
  };

  const Icon = icons[variant];

  return (
    <div className={`flex p-4 mb-4 text-sm border rounded-lg ${styles[variant]} ${className}`} role="alert">
      <Icon className="flex-shrink-0 inline w-5 h-5 mr-3" />
      <div>
        {title && <span className="font-medium block mb-1">{title}</span>}
        <span>{description}</span>
      </div>
    </div>
  );
};
