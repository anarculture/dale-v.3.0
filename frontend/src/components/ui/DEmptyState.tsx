import React from "react";
import { DButton } from "./DButton";

interface DEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
}

export const DEmptyState: React.FC<DEmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && <div className="mb-4 text-gray-400">{icon}</div>}
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 max-w-sm mb-6">{description}</p>
      {actionLabel && (
        <DButton
          onPress={onAction}
          {...(actionHref ? { as: "a", href: actionHref } : {})}
        >
          {actionLabel}
        </DButton>
      )}
    </div>
  );
};
