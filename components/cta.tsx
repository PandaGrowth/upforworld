"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface CTAProps {
  title: string;
  description: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  className?: string;
}

export function CTA({
  title,
  description,
  primary,
  secondary,
  className,
}: CTAProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-brand/10 via-transparent to-brand/20 p-10 shadow-card",
        className,
      )}
    >
      <div className="absolute -top-24 right-10 h-48 w-48 rounded-full bg-brand/30 blur-3xl dark:bg-brand/40" />
      <div className="relative space-y-5">
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-foreground md:text-3xl">
            {title}
          </h3>
          <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
            {description}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link
              href={primary.href}
              onClick={() =>
                trackEvent({
                  type: "cta_click",
                  payload: { label: primary.label, href: primary.href },
                })
              }
            >
              {primary.label}
            </Link>
          </Button>
          {secondary ? (
            <Button asChild variant="secondary" size="lg">
              <Link
                href={secondary.href}
                onClick={() =>
                  trackEvent({
                    type: "cta_click",
                    payload: { label: secondary.label, href: secondary.href },
                  })
                }
              >
                {secondary.label}
              </Link>
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
