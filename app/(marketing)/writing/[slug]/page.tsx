import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { CTA } from "@/components/cta";
import { Prose } from "@/components/prose";
import { Section } from "@/components/section";
import { TableOfContents } from "@/components/writing/table-of-contents";
import { Badge } from "@/components/ui/badge";
import { getArticleBySlug } from "@/lib/content";
import { getWritingContent } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";

interface WritingPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: WritingPageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) {
    return { title: "文章未找到" };
  }

  return {
    title: `${article.title} · Panda Growth 写作经验`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
    },
  };
}

export default async function WritingDetailPage({
  params,
}: WritingPageProps) {
  const article = await getArticleBySlug(params.slug);
  if (!article) {
    notFound();
  }

  const mdx = await getWritingContent(article.slug);
  if (!mdx) {
    notFound();
  }

  const { content, frontmatter } = mdx;
  const tldr = frontmatter?.tldr ?? [];
  const checklist = frontmatter?.checklist ?? [];
  const related = frontmatter?.related ?? [];

  return (
    <div className="w-full space-y-16 pb-24">
      <Section outerClassName="bg-muted/25" className="space-y-6">
        <Link
          href="/writing"
          className="text-sm text-muted-foreground transition hover:text-brand"
        >
          ← 返回写作经验
        </Link>
        <Badge variant="brand">Writing Playbook</Badge>
        <h1 className="text-4xl font-bold text-foreground">{article.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span>{formatDate(article.publishedAt)}</span>
          <span>{article.readingMinutes} min read</span>
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.3em]">
            <span>{article.lang === "zh" ? "中文" : "English"}</span>
            <span>{article.category}</span>
          </div>
        </div>
        <p className="max-w-3xl text-base text-muted-foreground">
          {article.summary}
        </p>
      </Section>

      <Section outerClassName="py-0" className="pt-0">
        <div className="grid gap-8 lg:grid-cols-[1fr,280px]">
          <div>
            {tldr.length ? (
              <div className="mb-10 rounded-2xl border border-brand/30 bg-brand/10 p-6 text-sm text-brand-foreground">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand">
                  TL;DR
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  {tldr.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <Prose id="article-content">{content}</Prose>

            {checklist.length ? (
              <div className="mt-10 rounded-2xl border border-border bg-muted/40 p-6">
                <p className="text-sm font-semibold text-foreground">Checklist</p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {checklist.map((item) => (
                    <li key={item} className="rounded-xl bg-background/80 px-4 py-2">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {related.length ? (
              <div className="mt-10 space-y-3 rounded-2xl border border-border bg-background p-6">
                <p className="text-sm font-semibold text-foreground">相关阅读</p>
                <ul className="space-y-2 text-sm text-brand">
                  {related.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="hover:underline">
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
          <TableOfContents />
        </div>
      </Section>

      <Section outerClassName="py-0" className="pt-0">
        <CTA
          title="继续打磨你的写作飞轮"
          description="加入 Panda Growth 社群，获取模板、点评与共学支持，用系统方法驱动高质量输出。"
          primary={{ label: "加入社群", href: "/join" }}
          secondary={{ label: "查看增长案例", href: "/growth" }}
        />
      </Section>
    </div>
  );
}
