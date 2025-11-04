import type { Metadata } from "next";
import Link from "next/link";

import { CTA } from "@/components/cta";
import { Section } from "@/components/section";
import { TestimonialCard } from "@/components/testimonial";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getFaqs, getTestimonials } from "@/lib/content";

export const metadata: Metadata = {
  title: "加入 Panda Growth",
  description:
    "了解加入 Panda Growth · X 平台增长社群的方式，适合人群、你将获得的内容、价格与常见问题。",
};

export default async function JoinPage() {
  const testimonials = await getTestimonials();
  const faqs = await getFaqs();

  return (
    <div className="w-full space-y-20 pb-24">
      <Section outerClassName="bg-muted/25" className="space-y-6">
        <Badge variant="brand">Join the Community</Badge>
        <h1 className="text-4xl font-bold text-foreground">加入 Panda Growth 社群</h1>
        <p className="max-w-3xl text-base text-muted-foreground">
          如果你希望系统化地经营 X（Twitter）影响力，这里提供写作方法、增长飞轮、商业化 SOP 与持续的心理支持。我们欢迎愿意稳定输出、乐于分享的创作者。
        </p>
        <div className="flex flex-wrap gap-4">
          <Button asChild size="lg">
            <Link href="https://x.com/messages/compose?recipient_id=123456789" target="_blank" rel="noopener noreferrer">
              预约顾问
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="mailto:team@pandagrowth.community">发送申请</Link>
          </Button>
        </div>
      </Section>

      <Section id="who" className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-border bg-background p-6 shadow-card">
          <h2 className="text-2xl font-semibold text-foreground">适合人群</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>希望在 3-6 个月内建立稳定内容节奏的创作者</li>
            <li>有商业化目标（课程、产品、服务）的个人或团队</li>
            <li>愿意分享经验、参与共学与复盘的伙伴</li>
          </ul>
        </div>
        <div className="space-y-4 rounded-2xl border border-border bg-background p-6 shadow-card">
          <h2 className="text-2xl font-semibold text-foreground">你将获得</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>写作方法论：Hook 实验室、线程结构模板、素材库管理</li>
            <li>增长飞轮：合作 SOP、自动化工具、转化面板</li>
            <li>心态支持：Accountability Pods、复盘仪式、心态 reset 工具</li>
          </ul>
        </div>
      </Section>

      <Section id="format" className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-background p-6 shadow-card">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">共学节奏</p>
          <p className="mt-3 text-sm text-muted-foreground">
            - 每周 2 次主题共学（60 min）
            <br />- 每周 1 次写作点评与复盘
            <br />- 每月 1 次 AMA & 合作案例拆解
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-background p-6 shadow-card">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">资源库</p>
          <p className="mt-3 text-sm text-muted-foreground">
            - 推文与案例数据库（可筛选）
            <br />- 模板：线程、直播、DM、广告
            <br />- 社群数据墙与指标看板
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-background p-6 shadow-card">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">支持团队</p>
          <p className="mt-3 text-sm text-muted-foreground">
            - 核心教练（写作 / 增长 / 商业化）
            <br />- 专属运营与工具顾问
            <br />- 同伴互助小组（6-8 人）
          </p>
        </div>
      </Section>

      <Section id="pricing" outerClassName="bg-muted/10" className="space-y-6">
        <h2 className="text-3xl font-semibold text-foreground">价格与报名</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-background p-6 shadow-card">
            <p className="text-sm font-semibold text-foreground">季度会员</p>
            <p className="mt-2 text-3xl font-bold text-brand">$399 / 季度</p>
            <p className="mt-3 text-sm text-muted-foreground">
              适合希望建立稳定节奏与方法论的创作者，包含全部共学、模板与工具访问权限。
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-background p-6 shadow-card">
            <p className="text-sm font-semibold text-foreground">年度会员</p>
            <p className="mt-2 text-3xl font-bold text-brand">$1,199 / 年</p>
            <p className="mt-3 text-sm text-muted-foreground">
              提供专属教练对接、深度复盘支持与线下活动优先席位，适合追求商业化飞跃的团队。
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          支持企业报销与团队方案。如需定制，请联系 <a href="mailto:team@pandagrowth.community" className="text-brand underline">team@pandagrowth.community</a>。
        </p>
      </Section>

      <Section id="testimonials" className="space-y-6">
        <h2 className="text-3xl font-semibold text-foreground">成员见证</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.slice(0, 4).map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              name={testimonial.name}
              role={testimonial.role}
              quote={testimonial.quote}
              avatar={testimonial.avatar}
            />
          ))}
        </div>
      </Section>

      <Section id="faq" className="space-y-6">
        <h2 className="text-3xl font-semibold text-foreground">常见问题</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-border bg-background p-5"
            >
              <summary className="cursor-pointer text-sm font-semibold text-foreground">
                {faq.question}
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section id="privacy" className="pt-0">
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-6 text-sm text-muted-foreground">
          <h3 className="text-base font-semibold text-foreground">隐私与守则</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>所有案例需脱敏处理，未经允许不得外传。</li>
            <li>成员资料和讨论保密，线下活动需签署守则。</li>
            <li>退出前须提前 7 天告知，首月提供 7 天冷静期。</li>
          </ul>
        </div>
      </Section>

      <Section bleed outerClassName="pt-12 pb-12" className="px-0">
        <CTA
          title="准备好加入 Panda Growth 吗？"
          description="提交申请或预约顾问，获取一对一需求诊断。我们会在 48 小时内回复你。"
          primary={{ label: "提交申请", href: "mailto:team@pandagrowth.community" }}
          secondary={{ label: "DM 团队", href: "https://x.com/messages/compose?recipient_id=123456789" }}
        />
      </Section>
    </div>
  );
}
