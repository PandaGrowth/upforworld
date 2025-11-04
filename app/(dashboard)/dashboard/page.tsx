export const dynamic = "force-dynamic";

import * as React from "react";
import Link from "next/link";

import { articles, boostRequests, highlightTweets } from "@/db/schema";
import { getDb } from "@/lib/db";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { signOutAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/section";
import { cn } from "@/lib/utils";
import { desc, eq } from "drizzle-orm";

export default async function DashboardHomePage() {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return (
      <Section className="mx-auto max-w-3xl space-y-4 rounded-3xl border border-dashed border-border bg-muted/20 p-8 text-center text-sm text-muted-foreground">
        未配置 Supabase，无法加载仪表盘数据。
      </Section>
    );
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  let userArticles: Array<typeof articles.$inferSelect> = [];
  let userTweets: Array<typeof highlightTweets.$inferSelect> = [];
  let userBoosts: Array<typeof boostRequests.$inferSelect> = [];
  let dbAvailable = true;
  try {
    const db = getDb();
    const result = await Promise.all([
      db
        .select()
        .from(articles)
        .where(eq(articles.authorId, user.id))
        .orderBy(desc(articles.createdAt)),
      db
        .select()
        .from(highlightTweets)
        .where(eq(highlightTweets.authorId, user.id))
        .orderBy(desc(highlightTweets.createdAt)),
      db
        .select()
        .from(boostRequests)
        .where(eq(boostRequests.authorId, user.id))
        .orderBy(desc(boostRequests.createdAt)),
    ]);
    userArticles = result[0];
    userTweets = result[1];
    userBoosts = result[2];
  } catch {
    dbAvailable = false;
  }

  return (
    <div className="space-y-10">
      <Section className="rounded-3xl border border-border bg-background/70 p-8 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">快速开始</h2>
            <p className="text-sm text-muted-foreground">
              投稿高质量内容，或去加热专区帮助他人获取更多曝光。
            </p>
          </div>
          <form action={signOutAction}>
            <Button type="submit" variant="secondary">
              退出登录
            </Button>
          </form>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickLink href="/dashboard/articles/new" label="发表文章" description="沉淀你的写作经验" />
          <QuickLink href="/dashboard/tweets/new" label="提交精选推文" description="分享优秀内容模板" />
          <QuickLink href="/dashboard/boost/new" label="发布加热请求" description="寻求社群合力" />
          <QuickLink href="/boost" label="前往加热专区" description="为他人助力赚积分" accent />
        </div>
      </Section>

      <Section className="space-y-8">
        <ContentPanel
          isEmpty={userArticles.length === 0}
          title="我的文章"
          emptyMessage={dbAvailable ? '还没有文章，去发表第一篇吧。' : '数据库未配置，无法加载文章列表。'}
          cta={dbAvailable ? { href: '/dashboard/articles/new', label: '发表文章' } : undefined}
        >
          <ul className="space-y-3">
            {userArticles.map((item) => (
              <li key={item.id} className="rounded-2xl border border-border bg-background px-4 py-3 text-sm shadow-card">
                <p className="font-semibold text-foreground">{item.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.summary ?? "--"}</p>
              </li>
            ))}
          </ul>
        </ContentPanel>

        <ContentPanel
          isEmpty={userTweets.length === 0}
          title="我的精选推文"
          emptyMessage={dbAvailable ? '还没有提交精选推文。' : '数据库未配置，无法加载推文列表。'}
          cta={dbAvailable ? { href: '/dashboard/tweets/new', label: '添加推文' } : undefined}
        >
          <ul className="space-y-3">
            {userTweets.map((item) => (
              <li key={item.id} className="rounded-2xl border border-border bg-background px-4 py-3 text-sm shadow-card">
                <a href={item.tweetUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand">
                  {item.tweetUrl}
                </a>
                {item.note ? (
                  <p className="mt-1 text-xs text-muted-foreground">{item.note}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </ContentPanel>

        <ContentPanel
          isEmpty={userBoosts.length === 0}
          title="我的加热请求"
          emptyMessage={dbAvailable ? '你还没有发布加热请求。' : '数据库未配置，无法加载加热请求。'}
          cta={dbAvailable ? { href: '/dashboard/boost/new', label: '发布请求' } : undefined}
        >
          <ul className="space-y-3">
            {userBoosts.map((item) => (
              <li key={item.id} className="rounded-2xl border border-border bg-background px-4 py-3 text-sm shadow-card">
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-foreground">{item.title}</span>
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-xs text-brand">
                    {item.link}
                  </a>
                  <p className="text-xs text-muted-foreground">状态：{translateStatus(item.status)}</p>
                </div>
              </li>
            ))}
          </ul>
        </ContentPanel>
      </Section>
    </div>
  );
}

function QuickLink({
  href,
  label,
  description,
  accent,
}: {
  href: string;
  label: string;
  description: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex h-full flex-col justify-between rounded-2xl border px-4 py-4 text-sm shadow-card transition",
        accent
          ? "border-brand/40 bg-brand/10 text-brand hover:border-brand hover:bg-brand/20"
          : "border-border bg-background text-foreground hover:-translate-y-1 hover:shadow-card-hover",
      )}
    >
      <span className="text-base font-semibold">{label}</span>
      <span className="mt-2 text-xs text-muted-foreground">{description}</span>
    </Link>
  );
}

function ContentPanel({
  title,
  emptyMessage,
  cta,
  children,
  isEmpty,
}: {
  title: string;
  emptyMessage: string;
  cta?: { href: string; label: string };
  children: React.ReactNode;
  isEmpty: boolean;
}) {
  return (
    <div className="space-y-4 rounded-3xl border border-border bg-background/70 p-6 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        {cta ? (
          <Link href={cta.href} className="text-sm text-brand hover:underline">
            {cta.label}
          </Link>
        ) : null}
      </div>
      {isEmpty ? <p className="text-sm text-muted-foreground">{emptyMessage}</p> : children}
    </div>
  );
}

function translateStatus(status: string | null) {
  switch (status) {
    case "in_progress":
      return "进行中";
    case "closed":
      return "已完成";
    default:
      return "进行中";
  }
}
