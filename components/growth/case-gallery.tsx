"use client";

import * as React from "react";

import { CaseCard } from "@/components/cases/case-card";
import { Chip } from "@/components/ui/chip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CaseItem } from "@/types/content";

const stageOptions: { value: "all" | CaseItem["stage"]; label: string }[] = [
  { value: "all", label: "全部阶段" },
  { value: "0-1k", label: "0-1K" },
  { value: "1k-10k", label: "1K-10K" },
  { value: "10k-100k", label: "10K-100K" },
  { value: "100k+", label: "100K+" },
];

interface CaseGalleryProps {
  cases: CaseItem[];
}

export function CaseGallery({ cases }: CaseGalleryProps) {
  const allTags = React.useMemo(() => {
    const tagSet = new Set<string>();
    cases.forEach((item) => item.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet);
  }, [cases]);

  const allStrategies = React.useMemo(() => {
    const stratSet = new Set<string>();
    cases.forEach((item) => item.strategies.forEach((strategy) => stratSet.add(strategy)));
    return Array.from(stratSet);
  }, [cases]);

  const [activeTags, setActiveTags] = React.useState<string[]>([]);
  const [activeStrategies, setActiveStrategies] = React.useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag],
    );
  };

  const toggleStrategy = (strategy: string) => {
    setActiveStrategies((prev) =>
      prev.includes(strategy)
        ? prev.filter((item) => item !== strategy)
        : [...prev, strategy],
    );
  };

  const filterCases = (stage: "all" | CaseItem["stage"]) => {
    return cases.filter((item) => {
      const matchStage = stage === "all" || item.stage === stage;
      const matchTags =
        activeTags.length === 0 || activeTags.every((tag) => item.tags.includes(tag));
      const matchStrategies =
        activeStrategies.length === 0 ||
        activeStrategies.every((strategy) => item.strategies.includes(strategy));
      return matchStage && matchTags && matchStrategies;
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {allStrategies.map((strategy) => (
          <Chip
            key={strategy}
            active={activeStrategies.includes(strategy)}
            onClick={() => toggleStrategy(strategy)}
          >
            {strategy}
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <Chip key={tag} active={activeTags.includes(tag)} onClick={() => toggleTag(tag)}>
            #{tag}
          </Chip>
        ))}
      </div>
      <Tabs defaultValue="all">
        <TabsList>
          {stageOptions.map((option) => (
            <TabsTrigger key={option.value} value={option.value}>
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {stageOptions.map((option) => (
          <TabsContent key={option.value} value={option.value}>
            <div className="grid gap-6 lg:grid-cols-3">
              {filterCases(option.value).map((item) => (
                <CaseCard key={item.slug} item={item} />
              ))}
            </div>
            {filterCases(option.value).length === 0 ? (
              <p className="mt-6 text-sm text-muted-foreground">
                暂无案例。尝试调整标签或策略筛选。
              </p>
            ) : null}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
