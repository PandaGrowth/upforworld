import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { CTA } from "@/components/cta";
import { Prose } from "@/components/prose";
import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCaseBySlug, getCases } from "@/lib/content";
import { getCaseContent } from "@/lib/mdx";

interface CaseDetailProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: CaseDetailProps): Promise<Metadata> {
  const caseItem = await getCaseBySlug(params.slug);
  if (!caseItem) {
    return { title: "案例未找到" };
  }
  return {
    title: `${caseItem.title} · 增长案例`,
    description: `阶段：${caseItem.stage} · 关注策略：${caseItem.strategies.join(", ")}`,
  };
}

export default async function CaseDetailPage({ params }: CaseDetailProps) {
  const caseItem = await getCaseBySlug(params.slug);
  if (!caseItem) {
    notFound();
  }

  const mdx = await getCaseContent(caseItem.slug);
  if (!mdx) {
    notFound();
  }

  const { content, frontmatter } = mdx;
  const relatedCases = (await getCases())
    .filter((item) => item.slug !== caseItem.slug && item.stage === caseItem.stage)
    .slice(0, 2);

  return (
    <div className="w-full space-y-16 pb-24">
      <Section outerClassName="bg-muted/25" className="space-y-5">
        <Link
          href="/growth"
          className="text-sm text-muted-foreground transition hover:text-brand"
        >
          ← 返回增长案例库
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="brand">{caseItem.stage}</Badge>
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {caseItem.strategies.map((strategy) => (
              <span key={strategy}>{strategy}</span>
            ))}
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground">{caseItem.title}</h1>
        <p className="text-sm text-muted-foreground">时间线：{caseItem.timeline}</p>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">粉丝增长</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              +{caseItem.impact.followersDelta.toLocaleString()}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">曝光</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {caseItem.impact.views.toLocaleString()}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">营收</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {caseItem.impact.revenue ? `$${caseItem.impact.revenue.toLocaleString()}` : "--"}
            </p>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-muted/40 p-5">
            <p className="text-sm font-semibold text-foreground">关键步骤</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {caseItem.steps.map((step) => (
                <li key={step}>• {step}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-muted/40 p-5">
            <p className="text-sm font-semibold text-foreground">常见坑位</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {caseItem.pitfalls.map((pitfall) => (
                <li key={pitfall}>• {pitfall}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section outerClassName="py-0" className="pt-0">
        <div className="grid gap-8 lg:grid-cols-[1fr,280px]">
          <div>
            {frontmatter?.summary ? (
              <div className="mb-8 rounded-2xl border border-brand/30 bg-brand/10 p-5 text-sm text-brand">
                {frontmatter.summary}
              </div>
            ) : null}
            <Prose>{content}</Prose>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-background p-5 shadow-card">
              <p className="text-sm font-semibold text-foreground">可复用 SOP</p>
              <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
                {frontmatter?.sop?.map((item) => (
                  <li key={item.title} className="rounded-xl bg-muted/40 px-4 py-3">
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{item.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {relatedCases.length ? (
        <Section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">同阶段案例</h2>
            <Button asChild variant="secondary">
              <Link href="/growth">返回案例库</Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {relatedCases.map((item) => (
              <article
                key={item.slug}
                className="rounded-2xl border border-border bg-background p-6 shadow-card"
              >
                <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  策略：{item.strategies.join(" · ")}
                </p>
                <Link
                  href={`/growth/${item.slug}`}
                  className="mt-4 inline-flex text-sm text-brand hover:underline"
                >
                  查看详情 →
                </Link>
              </article>
            ))}
          </div>
        </Section>
      ) : null}

      <Section outerClassName="py-0" className="pt-0">
        <CTA
          title="把增长 SOP 套用到你的场景"
          description="加入 Panda Growth，获得更多案例拆解、模板与专家点评，在 X 上稳步推进你的增长目标。"
          primary={{ label: "立即加入", href: "/join" }}
          secondary={{ label: "更多推文精选", href: "/tweets" }}
        />
      </Section>
    </div>
  );
}
