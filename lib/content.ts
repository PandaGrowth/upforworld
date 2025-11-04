import { differenceInCalendarDays, parseISO } from "date-fns";

import articles from "@/data/articles.json";
import cases from "@/data/cases.json";
import faqs from "@/data/faqs.json";
import kpis from "@/data/kpis.json";
import photos from "@/data/photos.json";
import testimonials from "@/data/testimonials.json";
import tweets from "@/data/tweets.json";
import type {
  ArticleItem,
  CaseItem,
  KPI,
  Lang,
  PhotoItem,
  SearchResult,
  Testimonial,
  TweetItem,
  TweetTopic,
} from "@/types/content";

export type TweetSortOption = "recent" | "likes" | "bookmarks" | "views";
export type TweetDateRange = "7d" | "30d" | "90d" | "all";

export interface TweetFilters {
  lang?: Lang | "all";
  topics?: TweetTopic[];
  dateRange?: TweetDateRange;
  sortBy?: TweetSortOption;
}

const tweetItems = tweets as TweetItem[];
const articleItems = articles as ArticleItem[];
const caseItems = cases as CaseItem[];
const photoItems = photos as PhotoItem[];
const kpiItems = kpis as KPI[];
const testimonialItems = testimonials as Testimonial[];
const faqItems = faqs as { question: string; answer: string; lang: Lang }[];

export async function getTweets(filters?: TweetFilters): Promise<TweetItem[]> {
  const { lang, topics, dateRange = "all", sortBy = "recent" } = filters ?? {};

  let filtered = tweetItems.slice();

  if (lang && lang !== "all") {
    filtered = filtered.filter((tweet) => tweet.lang === lang);
  }

  if (topics && topics.length > 0) {
    filtered = filtered.filter((tweet) => topics.includes(tweet.topic));
  }

  if (dateRange && dateRange !== "all") {
    const now = new Date();
    const limit = {
      "7d": 7,
      "30d": 30,
      "90d": 90,
    }[dateRange];

    if (limit) {
      filtered = filtered.filter((tweet) => {
        const diff = differenceInCalendarDays(now, parseISO(tweet.postedAt));
        return diff <= limit;
      });
    }
  }

  filtered.sort((a, b) => {
    if (sortBy === "likes") {
      return b.stats.likes - a.stats.likes;
    }
    if (sortBy === "bookmarks") {
      return b.stats.bookmarks - a.stats.bookmarks;
    }
    if (sortBy === "views") {
      return b.stats.views - a.stats.views;
    }
    return parseISO(b.postedAt).getTime() - parseISO(a.postedAt).getTime();
  });

  return filtered;
}

export async function getTweetById(id: string): Promise<TweetItem | undefined> {
  return tweetItems.find((item) => item.id === id);
}

export async function getArticles(): Promise<ArticleItem[]> {
  return articleItems.slice().sort((a, b) => {
    return parseISO(b.publishedAt).getTime() - parseISO(a.publishedAt).getTime();
  });
}

export async function getArticleBySlug(
  slug: string,
): Promise<ArticleItem | undefined> {
  return articleItems.find((item) => item.slug === slug);
}

export async function getCases(): Promise<CaseItem[]> {
  return caseItems.slice();
}

export async function getCaseBySlug(slug: string): Promise<CaseItem | undefined> {
  return caseItems.find((item) => item.slug === slug);
}

export async function getPhotos(): Promise<PhotoItem[]> {
  return photoItems.slice();
}

export async function getKpis(): Promise<KPI[]> {
  return kpiItems.slice();
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return testimonialItems.slice();
}

export async function getFaqs(): Promise<
  { question: string; answer: string; lang: Lang }[]
> {
  return faqItems.slice();
}

export async function getSearchResults(query: string): Promise<SearchResult[]> {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  const tweetResults = tweetItems
    .filter((tweet) => {
      return (
        tweet.authorName.toLowerCase().includes(trimmed) ||
        tweet.content.toLowerCase().includes(trimmed) ||
        tweet.topic.toLowerCase().includes(trimmed)
      );
    })
    .map<SearchResult>((tweet) => ({
      type: "tweet",
      title: `${tweet.authorName} · ${tweet.content.slice(0, 36)}…`,
      description: tweet.recap ?? tweet.content,
      href: `/tweets/${tweet.id}`,
      tags: [tweet.topic, tweet.lang],
    }));

  const articleResults = articleItems
    .filter((article) => {
      return (
        article.title.toLowerCase().includes(trimmed) ||
        article.summary.toLowerCase().includes(trimmed) ||
        article.tags.some((tag) => tag.toLowerCase().includes(trimmed))
      );
    })
    .map<SearchResult>((article) => ({
      type: "article",
      title: article.title,
      description: article.summary,
      href: `/writing/${article.slug}`,
      tags: [article.category, ...article.tags],
    }));

  const caseResults = caseItems
    .filter((item) => {
      return (
        item.title.toLowerCase().includes(trimmed) ||
        item.strategies.some((s) => s.toLowerCase().includes(trimmed)) ||
        item.tags.some((tag) => tag.toLowerCase().includes(trimmed))
      );
    })
    .map<SearchResult>((item) => ({
      type: "case",
      title: item.title,
      description: `${item.timeline} · +${item.impact.followersDelta} 粉丝`,
      href: `/growth/${item.slug}`,
      tags: [item.stage, ...item.strategies],
    }));

  const photoResults = photoItems
    .filter((photo) => {
      return (
        (photo.caption ?? "").toLowerCase().includes(trimmed) ||
        photo.tags.some((tag) => tag.toLowerCase().includes(trimmed))
      );
    })
    .map<SearchResult>((photo) => ({
      type: "photo",
      title: photo.caption ?? "社群照片",
      description: photo.tags.join(" / "),
      href: `/photos#${photo.id}`,
      tags: photo.tags,
    }));

  return [...tweetResults, ...articleResults, ...caseResults, ...photoResults].slice(
    0,
    20,
  );
}
