import Link from "next/link";
import { ArrowUpRight, BarChart3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { cn } from "@/lib/utils";
import type { CaseItem } from "@/types/content";

const stageCopy: Record<CaseItem["stage"], string> = {
  "0-1k": "冷启动",
  "1k-10k": "破 1K",
  "10k-100k": "破 10K",
  "100k+": "100K+",
};

interface CaseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  item: CaseItem;
}

export function CaseCard({ item, className, ...props }: CaseCardProps) {
  return (
    <article
      className={cn(
        "group flex h-full flex-col gap-5 rounded-2xl border border-border bg-background/80 p-6 shadow-card transition hover:-translate-y-1 hover:shadow-card-hover",
        className,
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Badge variant="brand">{stageCopy[item.stage]}</Badge>
          <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            {item.timeline}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-dashed border-brand/40 bg-brand/10 px-4 py-2 text-xs text-brand">
          <BarChart3 className="h-4 w-4" />
          +{item.impact.followersDelta.toLocaleString()} 粉丝
        </div>
      </div>
      <div className="space-y-3 text-sm text-muted-foreground">
        <p className="font-semibold text-foreground">策略组合</p>
        <div className="flex flex-wrap gap-2">
          {item.strategies.map((strategy) => (
            <Tag key={strategy} className="text-xs">
              {strategy}
            </Tag>
          ))}
        </div>
      </div>
      <div className="space-y-3 text-sm text-muted-foreground">
        <p className="font-semibold text-foreground">关键要点</p>
        <ul className="space-y-2">
          {item.takeaways.slice(0, 2).map((takeaway) => (
            <li key={takeaway} className="rounded-xl bg-muted/40 px-3 py-2">
              {takeaway}
            </li>
          ))}
        </ul>
      </div>
      <Button
        asChild
        variant="secondary"
        className="mt-auto w-full gap-2"
      >
        <Link href={`/growth/${item.slug}`}>
          查看 SOP
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </Button>
    </article>
  );
}
