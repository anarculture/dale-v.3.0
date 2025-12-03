import React from "react";

interface DPageSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export const DPageSection: React.FC<DPageSectionProps> = ({
  title,
  description,
  children,
  className = "",
  action,
}) => {
  return (
    <section className={`py-6 ${className}`}>
      {(title || description || action) && (
        <div className="mb-6 flex justify-between items-start">
          <div>
            {title && <h2 className="text-xl font-bold text-gray-900">{title}</h2>}
            {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
};
