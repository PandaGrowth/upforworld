"use client";

import * as React from "react";

import { ArticleCard } from "@/components/articles/article-card";
import { Chip } from "@/components/ui/chip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ArticleItem, Lang } from "@/types/content";

const categories: { value: "all" | ArticleItem["category"]; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "topic", label: "选题" },
  { value: "structure", label: "结构" },
  { value: "hook", label: "Hook" },
  { value: "workflow", label: "节奏" },
  { value: "review", label: "复盘" },
];

const languages: { value: "all" | Lang; label: string }[] = [
  { value: "all", label: "全部语言" },
  { value: "zh", label: "中文" },
  { value: "en", label: "English" },
];

interface ArticleGalleryProps {
  articles: ArticleItem[];
}

export function ArticleGallery({ articles }: ArticleGalleryProps) {
  const [activeLang, setActiveLang] = React.useState<"all" | Lang>("all");

  const filterArticles = (category: "all" | ArticleItem["category"]) => {
    return articles.filter((article) => {
      const matchCategory = category === "all" || article.category === category;
      const matchLang = activeLang === "all" || article.lang === activeLang;
      return matchCategory && matchLang;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {languages.map((option) => (
          <Chip
            key={option.value}
            active={activeLang === option.value}
            onClick={() => setActiveLang(option.value)}
          >
            {option.label}
          </Chip>
        ))}
      </div>
      <Tabs defaultValue={"all"}>
        <TabsList>
          {categories.map((category) => (
            <TabsTrigger key={category.value} value={category.value}>
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {categories.map((category) => (
          <TabsContent key={category.value} value={category.value}>
            <div className="grid gap-6 lg:grid-cols-3">
              {filterArticles(category.value).map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
            {filterArticles(category.value).length === 0 ? (
              <p className="mt-6 text-sm text-muted-foreground">
                暂无内容，换个分类或语言试试。
              </p>
            ) : null}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
