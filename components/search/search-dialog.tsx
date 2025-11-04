"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Loader2, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { SearchResult } from "@/types/content";

type FetchState = "idle" | "loading" | "success";

export function SearchDialog() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [state, setState] = React.useState<FetchState>("idle");
  const abortRef = React.useRef<AbortController | null>(null);

  React.useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  React.useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      setState("idle");
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    if (query.trim().length < 2) {
      setResults([]);
      setState("idle");
      return;
    }

    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;

    setState("loading");
    const timeout = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          method: "GET",
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch search results");
        }
        const data = (await response.json()) as SearchResult[];
        setResults(data);
        setState("success");
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        setState("success");
        setResults([]);
        console.error(error);
      }
    }, 200);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query, open]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2">
        <Dialog.Trigger asChild>
          <Button
            variant="ghost"
            className="hidden gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground hover:border-brand hover:bg-brand/10 hover:text-brand sm:inline-flex"
          >
            <Search className="h-4 w-4" />
            全站搜索
            <span className="ml-2 hidden rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground lg:inline">
              ⌘K
            </span>
          </Button>
        </Dialog.Trigger>
        <Dialog.Trigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>
        </Dialog.Trigger>
      </div>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
        <Dialog.Content
          className="fixed left-1/2 top-[15%] z-50 w-[90vw] max-w-2xl -translate-x-1/2 rounded-3xl border border-border bg-background shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=open]:zoom-in-95 data-[state=closed]:fade-out data-[state=closed]:zoom-out-95"
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <div className="flex items-center gap-3 border-b border-border px-6 py-4">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索推文、文章、案例或照片…"
              className="h-10 flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-muted-foreground transition hover:text-foreground"
                aria-label="清空搜索"
              >
                <X className="h-5 w-5" />
              </button>
            ) : null}
          </div>
          <ScrollArea className="max-h-[420px] px-1 py-4">
            {state === "idle" ? (
              <p className="px-6 text-sm text-muted-foreground">
                输入关键字开始搜索。
              </p>
            ) : null}
            {state === "loading" ? (
              <div className="flex items-center gap-2 px-6 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                正在检索内容…
              </div>
            ) : null}
            {state === "success" && results.length === 0 && query.trim().length >= 2 ? (
              <p className="px-6 text-sm text-muted-foreground">暂无匹配结果。</p>
            ) : null}
            <ul className="space-y-2 px-2">
              {results.map((result) => (
                <li key={`${result.type}-${result.href}`}>
                  <a
                    href={result.href}
                    className={cn(
                      "group flex flex-col rounded-2xl border border-transparent px-4 py-3 transition-all duration-150 hover:border-brand hover:bg-brand/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                    )}
                  >
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">
                      {result.type}
                    </span>
                    <span className="mt-1 text-sm font-semibold text-foreground md:text-base">
                      {result.title}
                    </span>
                    <span className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {result.description}
                    </span>
                    {result.tags && result.tags.length > 0 ? (
                      <span className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {result.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </span>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
          </ScrollArea>
          <div className="flex items-center justify-between border-t border-border px-6 py-3 text-xs text-muted-foreground">
            <span>搜索推文、文章、案例与照片</span>
            <span>Esc 关闭 · Enter 打开选中项</span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
