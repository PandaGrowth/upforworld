import type { Metadata } from "next";

import { Section } from "@/components/section";
import { CaseGallery } from "@/components/growth/case-gallery";
import { Badge } from "@/components/ui/badge";
import { getCases } from "@/lib/content";

export const metadata: Metadata = {
  title: "增长案例库",
  description:
    "冷启动、破圈、商业化、合作飞轮……Panda Growth 成员的真实增长案例，附带 SOP 与踩坑记录。",
};

export default async function GrowthPage() {
  const cases = await getCases();
  return (
    <div className="w-full space-y-16 pb-24">
      <Section outerClassName="bg-muted/25" className="space-y-5">
        <Badge variant="brand">Growth Library</Badge>
        <h1 className="text-4xl font-bold text-foreground">增长案例库</h1>
        <p className="max-w-3xl text-base text-muted-foreground">
          从 0-1K 的冷启动，到 100K+ 的合作飞轮，我们把真实的增长路径拆成 SOP、时间线与可复用动作。筛选策略与标签，一起复制高效的增长玩法。
        </p>
      </Section>
      <Section outerClassName="py-0" className="pt-0">
        <CaseGallery cases={cases} />
      </Section>
    </div>
  );
}
