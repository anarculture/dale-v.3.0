'use client';

import React from "react";
import { Spinner, SpinnerProps } from "@heroui/react";
import { FullScreenLoader } from "./FullScreenLoader";

interface DSpinnerProps extends SpinnerProps {
  fullScreen?: boolean;
}

/**
 * DSpinner - Unified loading spinner component
 * 
 * When fullScreen is true, renders the premium FullScreenLoader.
 * Otherwise, renders a simple inline spinner.
 */
export const DSpinner: React.FC<DSpinnerProps> = ({
  fullScreen,
  className,
  ...props
}) => {
  if (fullScreen) {
    return <FullScreenLoader />;
  }

  // Inline spinner for non-fullscreen use
  return <Spinner color="warning" {...props} className={className} />;
};
