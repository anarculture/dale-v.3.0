'use client';

import { Modal as HeroUIModal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { ReactNode, useId } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
  showCloseButton?: boolean;
  ariaLabel?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  ariaLabel,
}: ModalProps) {
  const generatedId = useId();
  const titleId = title ? `modal-title-${generatedId}` : undefined;

  if (!title && !ariaLabel) {
    console.warn('Modal: Accessible name missing. Provide either "title" or "ariaLabel".');
  }

  return (
    <HeroUIModal
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      hideCloseButton={!showCloseButton}
      aria-labelledby={titleId}
      aria-label={!title ? ariaLabel : undefined}
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
      <ModalContent>
        {() => (
          <>
            {title && (
              <ModalHeader id={titleId} className="flex flex-col gap-1">
                {title}
              </ModalHeader>
            )}
            <ModalBody>
              {children}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </HeroUIModal>
  );
}
