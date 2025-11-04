"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide transition-colors duration-150",
  {
    variants: {
      variant: {
        brand:
          "border-transparent bg-brand/10 text-brand hover:bg-brand/20 dark:bg-brand/20 dark:text-white",
        muted: "border-transparent bg-muted text-muted-foreground",
        outline: "border-border text-muted-foreground",
      },
    },
    defaultVariants: { variant: "muted" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export const badgeStyles = badgeVariants;
