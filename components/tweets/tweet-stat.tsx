import { BarChart, Bookmark, Heart, Repeat } from "lucide-react";

import type { TweetItem } from "@/types/content";
import { formatNumber } from "@/lib/utils";

export function TweetStats({ tweet }: { tweet: TweetItem }) {
  const stats = [
    { label: "Likes", value: tweet.stats.likes, icon: Heart },
    { label: "Bookmarks", value: tweet.stats.bookmarks, icon: Bookmark },
    { label: "Views", value: tweet.stats.views, icon: BarChart },
  ];

  if (typeof tweet.stats.reposts === "number") {
    stats.push({
      label: "Reposts",
      value: tweet.stats.reposts,
      icon: Repeat,
    });
  }

  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground"
        >
          <item.icon className="h-4 w-4 text-brand" />
          <div>
            <dt>{item.label}</dt>
            <dd className="text-sm font-semibold text-foreground">
              {formatNumber(item.value)}
            </dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
