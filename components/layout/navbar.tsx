"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import * as HoverCard from "@radix-ui/react-hover-card";
import { Menu, X } from "lucide-react";

import { SearchDialog } from "@/components/search/search-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface NavChild {
  label: string;
  href: string;
  description: string;
}

interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
}

interface NavbarProps {
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    points?: number;
  } | null;
}

const navItems: NavItem[] = [
  {
    label: "首页",
    href: "/",
  },
  {
    label: "推文精选",
    href: "/tweets",
    children: [
      {
        label: "全部推文",
        href: "/tweets",
        description: "最新的增长、写作、工具精选",
      },
      {
        label: "精选复盘",
        href: "/tweets?featured=true",
        description: "为什么这条推了起来？复盘模板",
      }
    ],
  },
  {
    label: "写作经验",
    href: "/writing",
    children: [
      {
        label: "选题与洞察",
        href: "/writing?category=topic",
        description: "找到受众真正关心的命题",
      },
      {
        label: "结构与 Hook",
        href: "/writing?category=structure",
        description: "把灵感转化为高完读率的线程",
      },
      {
        label: "节奏与复盘",
        href: "/writing?category=workflow",
        description: "输出节奏、Checklist、复盘体系",
      }
    ],
  },
  {
    label: "增长案例库",
    href: "/growth",
    children: [
      {
        label: "冷启动",
        href: "/growth?stage=0-1k",
        description: "从 0 到 1K 的起步动作",
      },
      {
        label: "破圈增长",
        href: "/growth?stage=10k-100k",
        description: "合作、活动与飞轮拆解",
      },
      {
        label: "商业化",
        href: "/growth?tag=monetization",
        description: "如何将影响力转化为收入",
      }
    ],
  },
  {
    label: "照片墙",
    href: "/photos",
  },
  {
    label: "加入社群",
    href: "/join",
  },
];

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-lg text-white shadow-card">
              🐼
            </span>
            <span className="hidden sm:flex sm:flex-col">
              <span>Panda Growth</span>
              <span className="text-xs text-muted-foreground">X 平台增长社群</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) =>
              item.children ? (
                <HoverCard.Root key={item.label} openDelay={120}>
                  <HoverCard.Trigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-150 hover:bg-muted",
                        pathname === item.href
                          ? "bg-brand/10 text-brand"
                          : "text-muted-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  </HoverCard.Trigger>
                  <HoverCard.Content
                    align="start"
                    className="mt-3 w-[360px] rounded-2xl border border-border bg-background p-4 shadow-xl"
                  >
                    <div className="grid gap-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="group rounded-xl px-3 py-3 transition hover:bg-muted"
                        >
                          <p className="text-sm font-semibold text-foreground group-hover:text-brand">
                            {child.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {child.description}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </HoverCard.Content>
                </HoverCard.Root>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-150 hover:bg-muted",
                    pathname === item.href ? "bg-brand/10 text-brand" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <SearchDialog />
          <ThemeToggle />
          <Link
            href="/boost"
            className="hidden rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition hover:border-brand hover:text-brand lg:inline-flex"
          >
            加热专区
          </Link>
          {user ? (
            <Link
              href="/dashboard"
              className="hidden rounded-full border border-brand/40 bg-brand/10 px-4 py-2 text-sm font-semibold text-brand transition hover:border-brand hover:bg-brand/20 lg:inline-flex"
            >
              用户中心 {typeof user.points === "number" ? `· ${user.points} 分` : ""}
            </Link>
          ) : (
            <Button asChild size="sm" variant="secondary" className="hidden lg:inline-flex">
              <Link href="/login">登录</Link>
            </Button>
          )}
          <div className="lg:hidden">
            <MobileDrawer pathname={pathname} user={user ?? undefined} />
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileDrawer({ pathname, user }: { pathname: string; user?: NavbarProps["user"] }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="ghost" size="icon" aria-label="打开菜单">
          <Menu className="h-5 w-5" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out" />
        <Dialog.Content className="fixed right-0 top-0 z-50 h-screen w-80 max-w-full translate-x-0 rounded-l-3xl border border-border bg-background shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <span className="text-sm font-semibold text-foreground">
              Panda Growth
            </span>
            <Button
              variant="ghost"
              size="icon"
              aria-label="关闭菜单"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-64px)] px-5 py-6">
            <div className="space-y-4">
              {navItems.map((item) => (
                <div key={item.label} className="space-y-2">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition hover:border-brand hover:bg-brand/10",
                      pathname === item.href ? "border-brand text-brand" : "border-border",
                    )}
                  >
                    {item.label}
                  </Link>
                  {item.children ? (
                    <div className="ml-2 space-y-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="block rounded-xl border border-transparent px-3 py-2 text-xs text-muted-foreground hover:border-brand/40 hover:bg-muted"
                        >
                          <p className="font-medium text-foreground">{child.label}</p>
                          <p>{child.description}</p>
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="space-y-3 border-t border-border p-5">
            <Button asChild className="w-full">
              <Link href="/boost" onClick={() => setOpen(false)}>
                加热专区
              </Link>
            </Button>
            {user ? (
              <Button asChild variant="secondary" className="w-full">
                <Link href="/dashboard" onClick={() => setOpen(false)}>
                  用户中心 {typeof user.points === "number" ? `· ${user.points} 分` : ""}
                </Link>
              </Button>
            ) : (
              <Button asChild variant="secondary" className="w-full">
                <Link href="/login" onClick={() => setOpen(false)}>
                  登录 / 注册
                </Link>
              </Button>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
