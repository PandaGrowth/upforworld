"use client";

import * as React from "react";
import Link from "next/link";
import { Copy, ExternalLink } from "lucide-react";

import { TweetStats } from "@/components/tweets/tweet-stat";
import { TwitterEmbed } from "@/components/tweets/twitter-embed";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { cn, formatISODateTime, topicCopy } from "@/lib/utils";
import type { TweetItem } from "@/types/content";

interface TweetCardProps extends React.HTMLAttributes<HTMLDivElement> {
  tweet: TweetItem;
}

export function TweetCard({ tweet, className, ...props }: TweetCardProps) {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(tweet.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Failed to copy tweet link", error);
    }
  }, [tweet.url]);

  const formattedDate = formatISODateTime(tweet.postedAt, "yyyy-MM-dd HH:mm");

  return (
    <article
      className={cn(
        "group flex h-full flex-col gap-6 rounded-2xl border border-border bg-background/95 p-6 shadow-card transition hover:-translate-y-1 hover:shadow-card-hover",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-4">
        <Tag color="brand" className="text-xs">
          {topicCopy[tweet.topic] ?? tweet.topic}
        </Tag>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {tweet.lang === "zh" ? "中文" : "English"} · {formattedDate}
        </p>
      </div>
      <TwitterEmbed url={tweet.url} />
      {tweet.recap ? (
        <div className="rounded-2xl border border-dashed border-brand/30 bg-brand/10 p-4 text-sm text-brand">
          <p className="font-semibold text-foreground">复盘要点</p>
          <p className="mt-2 text-sm text-brand-foreground">{tweet.recap}</p>
        </div>
      ) : null}
      <TweetStats tweet={tweet} />
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" onClick={handleCopy} className="gap-2">
          <Copy className="h-4 w-4" />
          {copied ? "已复制链接" : "复制链接"}
        </Button>
        <Button asChild variant="primary" className="gap-2">
          <Link href={tweet.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
            在 X 上查看
          </Link>
        </Button>
        <Button asChild variant="ghost" className="gap-2 text-sm">
          <Link href={`/tweets/${tweet.id}`}>查看复盘</Link>
        </Button>
      </div>
    </article>
  );
}
