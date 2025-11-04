import type { Metadata } from "next";

import { Section } from "@/components/section";
import { ArticleGallery } from "@/components/writing/article-gallery";
import { Badge } from "@/components/ui/badge";
import { getArticles } from "@/lib/content";

export const metadata: Metadata = {
  title: "写作经验与方法论",
  description:
    "Panda Growth 的写作知识库，涵盖选题洞察、结构模板、复盘系统与心态调整。",
};

export default async function WritingPage() {
  const articles = await getArticles();

  return (
    <div className="w-full space-y-16 pb-24">
      <Section outerClassName="bg-muted/25" className="space-y-5">
        <Badge variant="brand">Writing Playbooks</Badge>
        <h1 className="text-4xl font-bold text-foreground">写作经验库</h1>
        <p className="max-w-3xl text-base text-muted-foreground">
          用数据和实战经验验证的写作方法论：从选题、Hook 到节奏、复盘、心态 reset。每篇文章都包含 TL;DR、Checklist 与相关阅读，方便你直接应用到下一条推文。
        </p>
      </Section>
      <Section outerClassName="py-0" className="pt-0">
        <ArticleGallery articles={articles} />
      </Section>
    </div>
  );
}
