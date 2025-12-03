import React from "react";
import { Spinner, SpinnerProps } from "@heroui/react";

interface DSpinnerProps extends SpinnerProps {
  fullScreen?: boolean;
}

export const DSpinner: React.FC<DSpinnerProps> = ({
  fullScreen,
  className,
  ...props
}) => {
  if (fullScreen) {
    return (
      <div 
        className="fixed inset-0 flex items-center justify-center bg-white/80 z-50"
        role="status"
        aria-live="polite"
        aria-label="Loading"
      >
        <Spinner size="lg" color="primary" {...props} />
      </div>
    );
  }

  return <Spinner color="primary" {...props} className={className} />;
};
