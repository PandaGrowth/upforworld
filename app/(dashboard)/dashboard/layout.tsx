export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { fetchProfile, ensureProfile } from "@/lib/user-profile";
import { Section } from "@/components/section";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return (
      <div className="w-full py-24">
        <Section className="mx-auto max-w-3xl space-y-4 text-center">
          <h1 className="text-2xl font-semibold text-foreground">Supabase 未配置</h1>
          <p className="text-sm text-muted-foreground">
            用户中心依赖 Supabase Auth 与数据库。请在环境变量中配置 `SUPABASE_URL` / `SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` / `SUPABASE_DB_URL`
            后重新启动应用。
          </p>
        </Section>
      </div>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await ensureProfile(user);
  const profile = await fetchProfile(user.id);

  return (
    <div className="w-full space-y-8 pb-16">
      <Section outerClassName="bg-muted/25" className="flex flex-col gap-4">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">用户中心</p>
            <h1 className="mt-2 text-3xl font-semibold text-foreground">
              欢迎回来，{profile?.username ?? user.email ?? "创作者"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              管理你的内容，参与加热任务，积累社区积分。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-background px-5 py-3 text-sm shadow-card">
            <span className="text-muted-foreground">当前积分</span>
            <span className="text-2xl font-bold text-brand">{profile?.points ?? 0}</span>
          </div>
        </div>
        <nav className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <Link href="/dashboard" className="rounded-full border border-border px-4 py-2 hover:border-brand hover:text-brand">
            仪表盘
          </Link>
          <Link href="/dashboard/articles/new" className="rounded-full border border-border px-4 py-2 hover:border-brand hover:text-brand">
            发表文章
          </Link>
          <Link href="/dashboard/tweets/new" className="rounded-full border border-border px-4 py-2 hover:border-brand hover:text-brand">
            提交精选推文
          </Link>
          <Link href="/dashboard/boost/new" className="rounded-full border border-border px-4 py-2 hover:border-brand hover:text-brand">
            发布加热请求
          </Link>
          <Link href="/boost" className="rounded-full border border-dashed border-brand/40 bg-brand/10 px-4 py-2 text-brand">
            查看加热专区
          </Link>
        </nav>
      </Section>
      <Section className="pt-0">{children}</Section>
    </div>
  );
}
