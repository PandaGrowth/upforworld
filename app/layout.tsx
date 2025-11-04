import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { PageViewTracker } from "@/components/providers/pageview-tracker";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { fetchProfile } from "@/lib/user-profile";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pandagrowth.community"),
  title: {
    default: "Panda Growth · X平台增长社群",
    template: "%s · Panda Growth",
  },
  description:
    "系统增长你的 X 影响力。从推文到增长案例，Panda Growth 社群提供实战经验、精选内容与稳定心态支持。",
  keywords: [
    "Panda Growth",
    "X 平台增长",
    "Twitter 增长",
    "创作者社群",
    "社交媒体增长",
  ],
  openGraph: {
    title: "Panda Growth · X平台增长社群",
    description:
      "Better content, steadier traffic, healthier mindset. 系统增长你的 X 影响力。",
    url: "https://pandagrowth.community",
    siteName: "Panda Growth",
    locale: "zh_CN",
    images: [
      {
        url: "/api/og?title=Panda%20Growth&description=系统增长你的%20X%20影响力",
        width: 1200,
        height: 630,
        alt: "Panda Growth · X平台增长社群",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Panda Growth · X平台增长社群",
    description:
      "系统增长你的 X 影响力，Better content, steadier traffic, healthier mindset.",
    images: ["/api/og?title=Panda%20Growth"],
  },
  alternates: {
    canonical: "/",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = getSupabaseServerClient();
  let user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> } | null = null;
  let profile: Awaited<ReturnType<typeof fetchProfile>> = null;

  if (supabase) {
    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser();
    user = supabaseUser;
    if (user) {
      profile = await fetchProfile(user.id);
    }
  }

  return (
    <html lang="zh-CN" data-brand="panda" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col">
            <PageViewTracker />
            <Navbar
              user={
                user
                  ? {
                      id: user.id,
                      name:
                        profile?.username ??
                        (user.user_metadata as { username?: string } | undefined)?.username ??
                        user.email ??
                        undefined,
                      email: user.email ?? undefined,
                      points: profile?.points ?? undefined,
                    }
                  : null
              }
            />
            <main className="flex-1">
              <div className="flex w-full justify-center">{children}</div>
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
