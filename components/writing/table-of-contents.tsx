"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  label: string;
  level: number;
}

export function TableOfContents({
  className,
}: {
  className?: string;
}) {
  const [items, setItems] = React.useState<TocItem[]>([]);
  const [activeId, setActiveId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const article = document.getElementById("article-content");
    if (!article) return;

    const headingElements = Array.from(
      article.querySelectorAll("h2, h3"),
    ) as HTMLElement[];

    const tocItems = headingElements.map((heading) => ({
      id: heading.id,
      label: heading.innerText,
      level: heading.tagName === "H2" ? 2 : 3,
    }));

    setItems(tocItems);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "0px 0px -70% 0px",
        threshold: [0, 1],
      },
    );

    headingElements.forEach((element) => observer.observe(element));

    return () => {
      headingElements.forEach((element) => observer.unobserve(element));
    };
  }, []);

  if (items.length === 0) {
    return (
      <aside className={cn("rounded-2xl border border-border bg-background/60 p-4", className)}>
        <p className="text-sm text-muted-foreground">暂无目录</p>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "sticky top-28 hidden max-h-[70vh] min-w-[220px] flex-col gap-3 rounded-2xl border border-border bg-background/70 p-4 shadow-card lg:flex",
        className,
      )}
    >
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">目录</p>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2 text-sm">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={cn(
                  "block rounded-lg px-3 py-1 transition-colors duration-150 hover:text-brand",
                  item.level === 3 ? "pl-6 text-xs" : "",
                  activeId === item.id
                    ? "bg-brand/10 text-brand"
                    : "text-muted-foreground",
                )}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
