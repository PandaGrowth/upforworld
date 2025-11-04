import * as React from "react";

type CalloutVariant = "default" | "warning" | "tip";

export function Callout({
  title,
  variant = "default",
  children,
}: {
  title?: string;
  variant?: CalloutVariant;
  children: React.ReactNode;
}) {
  return (
    <div className="callout" data-variant={variant}>
      <div className="space-y-1">
        {title ? <p className="text-sm font-semibold">{title}</p> : null}
        <div className="text-sm text-foreground/90">{children}</div>
      </div>
    </div>
  );
}

export function Step({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="step" data-step={step}>
      <p className="text-base font-semibold text-foreground">{title}</p>
      <div className="mt-3 text-sm text-muted-foreground">{children}</div>
    </div>
  );
}

export function Checklist({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="checklist">{children}</div>;
}

export function ChecklistItem({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="checklist-item">{children}</div>;
}

export function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="metric">
      <span className="text-3xl font-semibold text-foreground">{value}</span>
      <span className="text-xs uppercase tracking-[0.3em] text-foreground/80">
        {label}
      </span>
    </div>
  );
}

export const mdxComponents = {
  Callout,
  Step,
  Checklist,
  ChecklistItem,
  Metric,
};
