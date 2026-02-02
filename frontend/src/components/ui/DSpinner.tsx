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
        className="fixed inset-0 flex flex-col items-center justify-center bg-[#1a1a1a] z-50 animate-loading-fade-in"
        role="status"
        aria-live="polite"
        aria-label="Loading"
      >
        {/* Gradient background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#252525] to-[#1a1a1a] opacity-80" />
        
        {/* Content container */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          {/* Spinner */}
          <Spinner size="lg" color="warning" {...props} />
          
          {/* Loading dots */}
          <div className="flex items-center gap-2">
            <span 
              className="w-2 h-2 rounded-full bg-[#fd5810] animate-loading-dot"
              style={{ animationDelay: '0ms' }} 
            />
            <span 
              className="w-2 h-2 rounded-full bg-[#fd5810] animate-loading-dot"
              style={{ animationDelay: '150ms' }} 
            />
            <span 
              className="w-2 h-2 rounded-full bg-[#fd5810] animate-loading-dot"
              style={{ animationDelay: '300ms' }} 
            />
          </div>
        </div>
      </div>
    );
  }

  return <Spinner color="warning" {...props} className={className} />;
};
