"use client";

import Image from "next/image";
import { ReactNode } from "react";

interface EmptyStateProps {
  image?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}

export const EmptyState = ({ image, title, description, children }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-4">
      {image && (
        <div className="relative w-32 h-32">
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain opacity-90"
            priority
          />
        </div>
      )}

      <div className="space-y-1">
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">{description}</p>
        )}
      </div>

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};
