import type { KPI } from "@/types/content";

export function KPIGroup({ metrics }: { metrics: KPI[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.id}
          className="relative overflow-hidden rounded-2xl border border-border bg-background/80 p-6 shadow-card transition hover:-translate-y-1 hover:shadow-card-hover"
        >
          <span className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground">
            {metric.label}
          </span>
          <p className="mt-3 text-3xl font-bold text-foreground">{metric.value}</p>
          {metric.description ? (
            <p className="mt-2 text-sm text-muted-foreground">{metric.description}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
