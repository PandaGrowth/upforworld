"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, active = false, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition-all hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          active
            ? "border-brand bg-brand/10 text-brand shadow-card"
            : "border-border bg-background text-muted-foreground",
          className,
        )}
        type="button"
        {...props}
      >
        {children}
      </button>
    );
  },
);
Chip.displayName = "Chip";
