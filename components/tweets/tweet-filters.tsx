"use client";

import * as React from "react";
import { Filter, Sparkles, XCircle } from "lucide-react";

import { Chip } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { Lang, TweetTopic } from "@/types/content";
import type { TweetDateRange, TweetFilters, TweetSortOption } from "@/lib/content";

const topicOptions: { value: TweetTopic; label: string }[] = [
  { value: "growth", label: "增长" },
  { value: "writing", label: "写作" },
  { value: "case", label: "案例" },
  { value: "tooling", label: "工具" },
  { value: "other", label: "其他" },
];

const langOptions: { value: Lang | "all"; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "zh", label: "中文" },
  { value: "en", label: "English" },
];

const dateOptions: { value: TweetDateRange; label: string }[] = [
  { value: "all", label: "全部时间" },
  { value: "7d", label: "近 7 天" },
  { value: "30d", label: "近 30 天" },
  { value: "90d", label: "近 90 天" },
];

const sortOptions: { value: TweetSortOption; label: string }[] = [
  { value: "recent", label: "最新" },
  { value: "likes", label: "点赞数" },
  { value: "bookmarks", label: "收藏数" },
  { value: "views", label: "浏览量" },
];

export type TweetFiltersState = Required<
  Pick<TweetFilters, "lang" | "topics" | "dateRange" | "sortBy">
>;

interface TweetFiltersProps {
  value: TweetFiltersState;
  onChange: (value: TweetFiltersState) => void;
  className?: string;
}

export function TweetFilters({
  value,
  onChange,
  className,
}: TweetFiltersProps) {
  const toggleTopic = (topic: TweetTopic) => {
    const exists = value.topics.includes(topic);
    const nextTopics = exists
      ? value.topics.filter((item) => item !== topic)
      : [...value.topics, topic];
    trackEvent({
      type: "filter_change",
      payload: { filter: "topic", value: nextTopics.join(",") || "none" },
    });
    onChange({ ...value, topics: nextTopics });
  };

  const resetFilters = () => {
    trackEvent({ type: "filter_change", payload: { filter: "reset", value: "all" } });
    onChange({
      lang: "all",
      topics: [],
      dateRange: "all",
      sortBy: "recent",
    });
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-background/80 p-5 shadow-card lg:h-fit",
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-brand" />
          <h3 className="text-sm font-semibold text-foreground">筛选推文</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-xs"
          onClick={resetFilters}
        >
          <XCircle className="h-4 w-4" />
          清空
        </Button>
      </div>
      <div className="space-y-5">
        <FilterGroup label="主题">
          <div className="flex flex-wrap gap-2">
            {topicOptions.map((topic) => (
              <Chip
                key={topic.value}
                active={value.topics.includes(topic.value)}
                onClick={() => toggleTopic(topic.value)}
              >
                {topic.label}
              </Chip>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup label="语言">
          <div className="flex gap-2">
            {langOptions.map((option) => (
              <Chip
                key={option.value}
                active={value.lang === option.value}
                onClick={() => {
                  trackEvent({
                    type: "filter_change",
                    payload: { filter: "lang", value: option.value },
                  });
                  onChange({ ...value, lang: option.value });
                }}
              >
                {option.label}
              </Chip>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup label="时间范围">
          <div className="flex flex-wrap gap-2">
            {dateOptions.map((option) => (
              <Chip
                key={option.value}
                active={value.dateRange === option.value}
                onClick={() => {
                  trackEvent({
                    type: "filter_change",
                    payload: { filter: "dateRange", value: option.value },
                  });
                  onChange({ ...value, dateRange: option.value });
                }}
              >
                {option.label}
              </Chip>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup label="排序">
          <div className="flex flex-wrap gap-2">
            {sortOptions.map((option) => (
              <Chip
                key={option.value}
                active={value.sortBy === option.value}
                onClick={() => {
                  trackEvent({
                    type: "filter_change",
                    payload: { filter: "sort", value: option.value },
                  });
                  onChange({ ...value, sortBy: option.value });
                }}
              >
                {option.label}
              </Chip>
            ))}
          </div>
          <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-dashed border-brand/40 px-3 py-2 text-xs text-brand">
            <Sparkles className="h-4 w-4" />
            灵活组合筛选，保存你的专属精选列表
          </div>
        </FilterGroup>
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  );
}
