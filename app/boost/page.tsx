export const dynamic = "force-dynamic";

import Link from "next/link";

import { boostRequests, boostSupports, profiles } from "@/db/schema";
import { getDb } from "@/lib/db";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { supportBoostAction } from "@/app/(dashboard)/dashboard/actions";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatISODateTime } from "@/lib/utils";
import { eq, sql } from "drizzle-orm";

export default async function BoostZonePage() {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  let requests: Array<{
    id: number;
    title: string;
    description: string | null;
    link: string;
    status: string | null;
    createdAt: Date | string | null;
    authorId: string;
    authorName: string | null;
    points: number | null;
  }> = [];
  let mySupports: Array<{ requestId: number }> = [];
  let dbAvailable = true;
  try {
    const db = getDb();
    requests = await db
      .select({
        id: boostRequests.id,
        title: boostRequests.title,
        description: boostRequests.description,
        link: boostRequests.link,
        status: boostRequests.status,
        createdAt: boostRequests.createdAt,
        authorId: boostRequests.authorId,
        authorName: profiles.username,
        points: sql<number>`count(${boostSupports.id})`,
      })
      .from(boostRequests)
      .leftJoin(profiles, eq(boostRequests.authorId, profiles.id))
      .leftJoin(boostSupports, eq(boostSupports.requestId, boostRequests.id))
      .groupBy(boostRequests.id, profiles.id)
      .orderBy(sql`${boostRequests.createdAt} desc`);

    if (user) {
      mySupports = await db
        .select({ requestId: boostSupports.requestId })
        .from(boostSupports)
        .where(eq(boostSupports.supporterId, user.id));
    }
  } catch {
    dbAvailable = false;
  }

  const supportedIds = new Set(mySupports.map((item) => item.requestId));

  return (
    <div className="w-full space-y-12 pb-20">
      <Section outerClassName="bg-muted/25" className="space-y-4">
        <Badge variant="brand">加热专区</Badge>
        <h1 className="text-4xl font-bold text-foreground">帮助创作者冲刺曝光</h1>
        <p className="max-w-3xl text-sm text-muted-foreground">
          这里列出 Panda Growth 社群成员的实时加热需求。完成指定动作后点击“我已加热”即可积累积分。
        </p>
        {user ? (
          <p className="text-sm text-muted-foreground">
            你也可以
            <Link href="/dashboard/boost/new" className="ml-1 text-brand hover:underline">
              发布新的加热请求
            </Link>
            ，让社群帮你冲曝光。
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            登录后即可领取积分回馈。
            <Link href="/login" className="ml-1 text-brand hover:underline">
              立即登录
            </Link>
          </p>
        )}
      </Section>

      <Section className="space-y-6">
        {dbAvailable ? (
          requests.length === 0 ? (
            <p className="text-sm text-muted-foreground">目前还没有加热请求，快去率先发布吧。</p>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {requests.map((item) => {
                const createdAtIso =
                  item.createdAt instanceof Date
                    ? item.createdAt.toISOString()
                    : (item.createdAt as string | null) ?? new Date().toISOString();
                return (
                  <article
                    key={item.id}
                    className="flex h-full flex-col justify-between gap-4 rounded-3xl border border-border bg-background/80 p-6 shadow-card"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted-foreground">
                        <span>{formatISODateTime(createdAtIso, "yyyy-MM-dd HH:mm")}</span>
                        <span>{translateStatus(item.status)}</span>
                      </div>
                      <h2 className="text-xl font-semibold text-foreground">{item.title}</h2>
                      <p className="text-sm text-muted-foreground">{item.description ?? "--"}</p>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex text-sm font-semibold text-brand hover:underline"
                      >
                        查看目标内容
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-sm font-semibold text-brand">
                          {(item.authorName ?? "PG").slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{item.authorName ?? "社群创作者"}</p>
                          <p className="text-xs text-muted-foreground">当前加热次数：{item.points ?? 0}</p>
                        </div>
                      </div>
                      <form action={supportBoostAction} className="flex items-center gap-3">
                        <input type="hidden" name="requestId" value={item.id} />
                        <Button
                          type="submit"
                          variant={supportedIds.has(item.id) ? "secondary" : "primary"}
                          disabled={!user || supportedIds.has(item.id)}
                        >
                          {supportedIds.has(item.id) ? "已加热" : user ? "我已加热" : "请先登录"}
                        </Button>
                      </form>
                    </div>
                  </article>
                );
              })}
            </div>
          )
        ) : (
          <div className="rounded-3xl border border-dashed border-border bg-muted/20 p-6 text-sm text-muted-foreground">
            未检测到数据库连接字符串 `SUPABASE_DB_URL`。请在环境变量中配置完毕后刷新页面。
          </div>
        )}
      </Section>
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
      return "开放中";
  }
}
