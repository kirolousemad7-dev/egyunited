"use client";

import type { ReactNode } from "react";
import { selectQuoteService } from "@/lib/quote";

export function QuoteLink({
  service,
  children,
  className,
  onNavigate,
}: {
  service?: string;
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <a
      href="#quote"
      className={className}
      onClick={() => {
        if (service) selectQuoteService(service);
        onNavigate?.();
      }}
    >
      {children}
    </a>
  );
}
