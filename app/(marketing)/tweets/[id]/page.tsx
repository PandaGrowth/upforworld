import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { Section } from "@/components/section";
import { TweetCard } from "@/components/tweets/tweet-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTweetById, getTweets } from "@/lib/content";

interface TweetDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: TweetDetailPageProps): Promise<Metadata> {
  const tweet = await getTweetById(params.id);
  if (!tweet) {
    return {
      title: "推文不存在",
    };
  }
  return {
    title: `${tweet.authorName} 推文复盘`,
    description: tweet.recap ?? tweet.content.slice(0, 120),
    openGraph: {
      title: `${tweet.authorName} 推文复盘`,
      description: tweet.recap ?? tweet.content.slice(0, 120),
    },
  };
}

export default async function TweetDetailPage({ params }: TweetDetailPageProps) {
  const tweet = await getTweetById(params.id);
  if (!tweet) {
    notFound();
  }
  const related = (await getTweets({ sortBy: "likes" }))
    .filter((item) => item.id !== tweet.id && item.topic === tweet.topic)
    .slice(0, 2);

  return (
    <div className="w-full space-y-16 pb-20">
      <Section className="space-y-5">
        <Link
          href="/tweets"
          className="text-sm text-muted-foreground transition hover:text-brand"
        >
          ← 返回推文精选
        </Link>
        <Badge variant="brand">推文复盘</Badge>
        <h1 className="text-3xl font-bold text-foreground">{tweet.authorName} · 推文复盘</h1>
        <p className="max-w-2xl text-base text-muted-foreground">
          我们从结构、指标、心态三个角度复盘这条推文，帮助你快速找到可复制的玩法。
        </p>
      </Section>
      <Section outerClassName="py-0" className="pt-0">
        <TweetCard tweet={tweet} />
      </Section>
      <Section className="space-y-6">
        <div className="rounded-3xl border border-border bg-muted/30 p-8">
          <h2 className="text-2xl font-semibold text-foreground">复盘摘要 · 为什么这条推了起来？</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">结构</p>
              <p className="mt-2 text-sm text-foreground">
              {tweet.recap ?? "结构清晰，首尾呼应，读者知道下一步怎么做。"}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">指标</p>
            <p className="mt-2 text-sm text-foreground">
              Likes {tweet.stats.likes} · Bookmarks {tweet.stats.bookmarks} · Views {tweet.stats.views}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">心态</p>
              <p className="mt-2 text-sm text-foreground">
                复盘前先感谢自己的稳定输出，保持仪式感，让迭代更轻松。
              </p>
            </div>
          </div>
        </div>
      </Section>
      {related.length ? (
        <Section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">相关推文</h2>
            <Button asChild variant="secondary">
              <Link href="/tweets">查看更多</Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {related.map((item) => (
              <TweetCard key={item.id} tweet={item} />
            ))}
          </div>
        </Section>
      ) : null}
    </div>
  );
}
