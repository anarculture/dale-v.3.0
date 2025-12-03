import React from "react";
import { Card, CardHeader, CardBody, CardFooter, CardProps } from "@heroui/react";

interface DCardProps extends CardProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  noPadding?: boolean;
}

export const DCard: React.FC<DCardProps> = ({
  children,
  header,
  footer,
  noPadding = false,
  className,
  ...props
}) => {
  return (
    <Card className={`bg-white ${className}`} {...props}>
      {header && <CardHeader className="px-4 pt-4 pb-2 font-bold text-lg">{header}</CardHeader>}
      <CardBody className={noPadding ? "p-0" : "px-4 py-2"}>
        {children}
      </CardBody>
      {footer && <CardFooter className="px-4 pb-4 pt-2">{footer}</CardFooter>}
    </Card>
  );
};
