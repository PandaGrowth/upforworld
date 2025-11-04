import * as React from "react";
import Link from "next/link";
import { Github, Mail, MessageSquare } from "lucide-react";

const footerLinks = [
  {
    title: "社群板块",
    links: [
      { label: "推文精选", href: "/tweets" },
      { label: "写作经验", href: "/writing" },
      { label: "增长案例", href: "/growth" },
      { label: "照片墙", href: "/photos" },
    ],
  },
  {
    title: "加入我们",
    links: [
      { label: "加入社群", href: "/join" },
      { label: "常见问题", href: "/join#faq" },
      { label: "社群守则", href: "/join#rules" },
    ],
  },
  {
    title: "资源",
    links: [
      { label: "内容地图", href: "/writing" },
      { label: "增长工具包", href: "/growth?tag=tooling" },
      { label: "公开素材", href: "/photos" },
    ],
  },
  {
    title: "联系与合作",
    links: [
      { label: "商务合作", href: "mailto:team@pandagrowth.community" },
      { label: "社群投稿", href: "/dashboard" },
      { label: "媒体资料", href: "/photos" },
    ],
  },
];

export function Footer(): React.ReactElement {
  return (
    <footer className="border-t border-border/70 bg-background/90 backdrop-blur">
      <div className="w-full px-4 py-14 sm:px-6">
        <div className="mx-auto grid w-full max-w-[1180px] gap-12 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-lg text-white shadow-card">
                🐼
              </span>
              <div>
                <p className="font-semibold text-foreground">Panda Growth</p>
                <p className="text-xs text-muted-foreground">Systematically Grow Your Impact on X</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              已帮助 300+ 创作者从 0 成长到 10K/50K+，精选推文互动率平均提升 35%。让内容、流量与心态同频增长。
            </p>
            <div className="flex flex-wrap gap-3">
              <IconLink href="mailto:team@pandagrowth.community" label="Email">
                <Mail className="h-5 w-5" />
              </IconLink>
              <IconLink href="https://x.com/pandagrowth" label="X">
                <MessageSquare className="h-5 w-5" />
              </IconLink>
              <IconLink href="https://github.com/pandagrowth" label="GitHub">
                <Github className="h-5 w-5" />
              </IconLink>
            </div>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
            {footerLinks.map((group) => (
              <div key={group.title} className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground">{group.title}</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="transition-colors hover:text-brand">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-border/60 px-4 py-6 sm:px-6">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-3 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Panda Growth. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/sitemap.xml" className="hover:text-brand">
              Sitemap
            </Link>
            <Link href="/robots.txt" className="hover:text-brand">
              Robots
            </Link>
            <Link href="/join#privacy" className="hover:text-brand">
              隐私与守则
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function IconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-brand hover:text-brand"
    >
      {children}
    </Link>
  );
}
