import type { Metadata } from "next";

import { Section } from "@/components/section";
import { TweetGallery } from "@/components/tweets/tweet-gallery";
import { Badge } from "@/components/ui/badge";
import { getTweets } from "@/lib/content";

export const metadata: Metadata = {
  title: "推文精选",
  description:
    "精选 Panda Growth 成员在 X 上的高表现推文，提供复盘与筛选工具，帮助你快速找到灵感与策略。",
};

export default async function TweetsPage() {
  const tweets = await getTweets();

  return (
    <div className="w-full space-y-16 pb-20">
      <Section outerClassName="bg-muted/25" className="space-y-6">
        <Badge variant="brand">Tweet Highlights</Badge>
        <h1 className="text-4xl font-bold text-foreground">社群推文精选</h1>
        <p className="max-w-3xl text-base text-muted-foreground">
          从增长、写作、工具到案例，每条精选推文都附带互动数据与编辑复盘。使用筛选器组合主题、语言、时间范围，快速找到你的灵感来源。
        </p>
      </Section>
      <Section outerClassName="py-0" className="pt-0">
        <TweetGallery tweets={tweets} />
      </Section>
    </div>
  );
}
