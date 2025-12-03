import React from "react";
import { DButton } from "./DButton";

interface DEmptyStateBaseProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

interface DEmptyStateWithoutAction extends DEmptyStateBaseProps {
  actionLabel?: never;
  onAction?: never;
  actionHref?: never;
}

interface DEmptyStateWithCallback extends DEmptyStateBaseProps {
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: never;
}

interface DEmptyStateWithHref extends DEmptyStateBaseProps {
  actionLabel?: string;
  onAction?: never;
  actionHref?: string;
}

type DEmptyStateProps = DEmptyStateWithoutAction | DEmptyStateWithCallback | DEmptyStateWithHref;

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
