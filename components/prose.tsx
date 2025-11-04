"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export function Prose({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "prose prose-slate max-w-none dark:prose-invert",
        "prose-headings:font-semibold prose-a:text-brand prose-a:no-underline hover:prose-a:underline",
        "prose-pre:rounded-xl prose-pre:border prose-pre:border-border prose-pre:bg-muted/60 prose-pre:px-6 prose-pre:py-4",
        "prose-code:rounded-md prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5",
        className,
      )}
      {...props}
    />
  );
}
