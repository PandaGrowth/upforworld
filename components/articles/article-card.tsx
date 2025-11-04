import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { cn, formatDate } from "@/lib/utils";
import type { ArticleItem } from "@/types/content";

interface ArticleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  article: ArticleItem;
}

const categoryCopy: Record<ArticleItem["category"], string> = {
  topic: "选题",
  structure: "结构",
  hook: "Hook",
  workflow: "节奏",
  review: "复盘",
};

export function ArticleCard({
  article,
  className,
  ...props
}: ArticleCardProps) {
  return (
    <article
      className={cn(
        "group flex h-full flex-col gap-5 overflow-hidden rounded-2xl border border-border bg-background/90 shadow-card transition hover:-translate-y-1 hover:shadow-card-hover",
        className,
      )}
      {...props}
    >
      <div className="relative h-40 w-full overflow-hidden bg-muted">
        {article.cover ? (
          <Image
            src={article.cover}
            alt={article.title}
            width={400}
            height={220}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            priority={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            Panda Growth
          </div>
        )}
        <Badge variant="brand" className="absolute left-4 top-4">
          {categoryCopy[article.category]}
        </Badge>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-foreground">
            {article.title}
          </h3>
          <p className="text-sm text-muted-foreground">{article.summary}</p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatDate(article.publishedAt)}</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {article.readingMinutes} min read
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Tag key={tag} className="text-xs">
                #{tag}
              </Tag>
            ))}
          </div>
        </div>
        <Button asChild variant="secondary" className="mt-auto w-full">
          <Link href={`/writing/${article.slug}`}>阅读全文</Link>
        </Button>
      </div>
    </article>
  );
}
