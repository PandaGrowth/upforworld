"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: "brand" | "neutral";
}

export function Tag({
  className,
  color = "neutral",
  ...props
}: TagProps) {
  const styles =
    color === "brand"
      ? "bg-brand/10 text-brand"
      : "bg-muted text-muted-foreground";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        styles,
        className,
      )}
      {...props}
    />
  );
}
