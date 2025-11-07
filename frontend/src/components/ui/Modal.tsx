'use client';

import { Modal as HeroUIModal } from "@heroui/react";
import { ReactNode } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
  showCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}: ModalProps) {
  return (
    <HeroUIModal
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      hideCloseButton={!showCloseButton}
      aria-labelledby={title ? 'modal-title' : undefined}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
    >
      {title && (
        <HeroUIModal.Header>
          <HeroUIModal.Title id="modal-title">
            {title}
          </HeroUIModal.Title>
        </HeroUIModal.Header>
      )}
      <HeroUIModal.Body>
        {children}
      </HeroUIModal.Body>
    </HeroUIModal>
  );
}
