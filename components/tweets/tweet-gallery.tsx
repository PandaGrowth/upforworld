"use client";

import * as React from "react";
import { differenceInCalendarDays, parseISO } from "date-fns";

import { EmptyState } from "@/components/empty-state";
import { TweetCard } from "@/components/tweets/tweet-card";
import { TweetFilters, type TweetFiltersState } from "@/components/tweets/tweet-filters";
import type { TweetItem } from "@/types/content";

interface TweetGalleryProps {
  tweets: TweetItem[];
}

const initialFilters: TweetFiltersState = {
  lang: "all",
  topics: [],
  dateRange: "all",
  sortBy: "recent",
};

export function TweetGallery({ tweets }: TweetGalleryProps) {
  const [filters, setFilters] = React.useState<TweetFiltersState>(initialFilters);

  const filteredTweets = React.useMemo(() => {
    let result = [...tweets];

    if (filters.lang !== "all") {
      result = result.filter((tweet) => tweet.lang === filters.lang);
    }

    if (filters.topics.length > 0) {
      result = result.filter((tweet) => filters.topics.includes(tweet.topic));
    }

    if (filters.dateRange !== "all") {
      const now = new Date();
      const limit = {
        "7d": 7,
        "30d": 30,
        "90d": 90,
      }[filters.dateRange];
      if (limit) {
        result = result.filter((tweet) => {
          const days = differenceInCalendarDays(now, parseISO(tweet.postedAt));
          return days <= limit;
        });
      }
    }

    result.sort((a, b) => {
      if (filters.sortBy === "likes") {
        return b.stats.likes - a.stats.likes;
      }
      if (filters.sortBy === "bookmarks") {
        return b.stats.bookmarks - a.stats.bookmarks;
      }
      if (filters.sortBy === "views") {
        return b.stats.views - a.stats.views;
      }
      return parseISO(b.postedAt).getTime() - parseISO(a.postedAt).getTime();
    });

    return result;
  }, [tweets, filters]);

  return (
    <div className="grid gap-10 lg:grid-cols-[320px,minmax(0,1fr)]">
      <TweetFilters value={filters} onChange={setFilters} className="self-start" />
      <div className="mx-auto w-full space-y-6 lg:max-w-[680px]">
        {filteredTweets.length === 0 ? (
          <EmptyState
            title="暂无匹配的推文"
            description="调整筛选条件，试试不同的主题或时间范围。"
            action={{
              label: "重置筛选",
              onClick: () => setFilters(initialFilters),
            }}
          />
        ) : (
          <div className="space-y-6">
            {filteredTweets.map((tweet) => (
              <TweetCard key={tweet.id} tweet={tweet} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
