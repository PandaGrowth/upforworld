import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/cta";
import { KPIGroup } from "@/components/kpi-group";
import { Section } from "@/components/section";
import { TestimonialCard } from "@/components/testimonial";
import { ArticleCard } from "@/components/articles/article-card";
import { CaseCard } from "@/components/cases/case-card";
import { TweetCard } from "@/components/tweets/tweet-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getArticles, getCases, getKpis, getPhotos, getTestimonials, getTweets } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export default async function HomePage() {
  const [metrics, tweets, articles, cases, photos, testimonials] =
    await Promise.all([
      getKpis(),
      getTweets({ sortBy: "likes" }),
      getArticles(),
      getCases(),
      getPhotos(),
      getTestimonials(),
    ]);

  const featuredTweets = tweets.filter((tweet) => tweet.featured).slice(0, 3);
  const writingHighlights = articles.slice(0, 3);
  const growthHighlights = cases.slice(0, 3);
  const photoHighlights = photos.slice(0, 6);
  const trustQuotes = testimonials.slice(0, 4);

  return (
    <div className="w-full space-y-24 pb-24">
      <HeroSection />

      <Section id="metrics" outerClassName="bg-muted/30" className="space-y-10">
        <div className="flex flex-col gap-3">
          <Badge variant="brand">社群成效</Badge>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            数据在说话：稳健、可复制的增长轨迹
          </h2>
          <p className="max-w-2xl text-base text-muted-foreground">
            我们以指标驱动写作与增长，提供透明的数据看板与模板，帮助创作者持续迭代。
          </p>
        </div>
        <KPIGroup metrics={metrics} />
      </Section>

      <Section id="tweets" className="space-y-8">
        <Header
          title="推文精选库"
          description="高互动、高转化的推文案例，附带编辑复盘，告诉你为什么它们推了起来。"
          href="/tweets"
          actionLabel="查看全部推文"
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {featuredTweets.map((tweet) => (
            <TweetCard key={tweet.id} tweet={tweet} />
          ))}
        </div>
      </Section>

      <Section id="content" outerClassName="bg-muted/20" className="space-y-8">
        <Header
          title="写作经验与方法论"
          description="拆解推文入门到高阶的写作体系，从选题、结构到节奏复盘。"
          href="/writing"
          actionLabel="进入写作站"
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {writingHighlights.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </Section>

      <Section id="growth" className="space-y-8">
        <Header
          title="增长案例库"
          description="覆盖冷启动、破圈、商业化的实战案例，附带 SOP、时间线与踩坑记录。"
          href="/growth"
          actionLabel="浏览案例"
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {growthHighlights.map((item) => (
            <CaseCard key={item.slug} item={item} />
          ))}
        </div>
      </Section>

      <Section id="photos" outerClassName="bg-muted/20" className="space-y-8">
        <Header
          title="社群照片墙"
          description="线下活动、线上里程碑、成员风采，真实记录 Panda Growth 的节奏。"
          href="/photos"
          actionLabel="查看照片墙"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photoHighlights.map((photo) => (
            <figure
              key={photo.id}
              className="group relative overflow-hidden rounded-2xl border border-border bg-muted/40"
            >
              <Image
                src={photo.src}
                alt={photo.caption ?? "Panda Growth"}
                width={photo.w}
                height={photo.h}
                className="h-52 w-full object-cover transition duration-300 group-hover:scale-105"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-sm text-white">
                <p className="font-semibold">
                  {photo.caption ?? photo.tags.join(" / ")}
                </p>
                {photo.takenAt ? (
                  <span className="text-xs opacity-80">{formatDate(photo.takenAt)}</span>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section id="trust" className="space-y-8">
        <Header
          title="成员怎么说"
          description="真实的创作者在这里保持成长节奏，沉浸式共学与陪跑。"
        />
        <div className="grid gap-6 md:grid-cols-2">
          {trustQuotes.map((testimonial) => (
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

      <Section bleed outerClassName="pt-12 pb-0" className="px-0">
        <CTA
          title="加入 Panda Growth · Systematically Grow Your Impact on X"
          description="经过验证的写作方法论、增长飞轮、心态 reset 工具，以及 300+ 创作者的支持网络。"
          primary={{ label: "加入社群", href: "/join" }}
          secondary={{ label: "查看推文精选", href: "/tweets" }}
        />
      </Section>
    </div>
  );
}

function HeroSection() {
  return (
    <Section
      outerClassName="bg-gradient-to-b from-brand/15 via-background/40 to-transparent"
      className="grid gap-12 py-20 lg:grid-cols-[1.2fr,1fr]"
    >
      <div className="space-y-6">
        <Badge variant="brand" className="rounded-full px-4 py-1 text-sm">
          Panda Growth · X 平台增长社群
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          系统增长你的 X 影响力
        </h1>
        <p className="text-lg text-muted-foreground sm:text-xl">
          Better content, steadier traffic, healthier mindset. 我们把写作、流量、心态做成可复制的飞轮，帮助创作者在 X 上稳步前进。
        </p>
        <div className="flex flex-wrap gap-4">
          <Button asChild size="lg">
            <Link href="/join">加入社群</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/tweets">查看推文精选</Link>
          </Button>
        </div>
        <div className="grid gap-4 rounded-2xl border border-border bg-background/60 p-6 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-foreground">已帮助 300+ 创作者从 0 到 10K/50K+</p>
            <p className="mt-2 text-sm text-muted-foreground">
              从冷启动到商业化，社群里每一步都有人陪跑。
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">精选推文平均互动率提升 35%</p>
            <p className="mt-2 text-sm text-muted-foreground">
              提供编辑复盘模板，确保迭代有据可循。
            </p>
          </div>
        </div>
      </div>
      <div className="relative flex h-full items-center justify-center">
        <div className="relative h-full w-full max-w-md overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-brand/10 via-background to-brand/5 p-6 shadow-card">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-muted-foreground">
              成员里程碑
            </p>
            <div className="space-y-3 text-sm text-foreground">
              <div className="rounded-2xl bg-background/80 p-4 shadow-card">
                <p className="text-xs text-muted-foreground">Hook 实验室</p>
                <p className="mt-2 text-base font-semibold">
                  Zoey 线程完读率从 48% → 72%
                </p>
                <p className="mt-2 text-xs text-muted-foreground">用「冲突-证据-行动」模板，提升读者完读率。</p>
              </div>
              <div className="rounded-2xl bg-background/80 p-4 shadow-card">
                <p className="text-xs text-muted-foreground">增长飞轮</p>
                <p className="mt-2 text-base font-semibold">
                  Miguel 20 天新增 8K 粉丝
                </p>
                <p className="mt-2 text-xs text-muted-foreground">用资料包引导关注 + DM 自动化，转化效率翻倍。</p>
              </div>
              <div className="rounded-2xl bg-background/80 p-4 shadow-card">
                <p className="text-xs text-muted-foreground">心态 reset</p>
                <p className="mt-2 text-base font-semibold">
                  Lina 重建创作节奏，连续输出 12 周
                </p>
                <p className="mt-2 text-xs text-muted-foreground">复盘仪式 + Accountability Pod，保持稳态增长。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

interface HeaderProps {
  title: string;
  description: string;
  href?: string;
  actionLabel?: string;
}

function Header({ title, description, href, actionLabel }: HeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-3xl font-bold text-foreground">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
      {href && actionLabel ? (
        <Button asChild variant="secondary" className="self-start">
          <Link href={href}>{actionLabel}</Link>
        </Button>
      ) : null}
    </div>
  );
}
