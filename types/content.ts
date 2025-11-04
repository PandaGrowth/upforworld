export type Lang = "zh" | "en";

export interface TweetStats {
  likes: number;
  bookmarks: number;
  views: number;
  reposts?: number;
}

export type TweetTopic = "growth" | "writing" | "case" | "tooling" | "other";

export interface TweetItem {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  lang: Lang;
  topic: TweetTopic;
  postedAt: string;
  content: string;
  stats: TweetStats;
  url: string;
  recap?: string;
  featured?: boolean;
}

export type ArticleCategory =
  | "topic"
  | "structure"
  | "hook"
  | "workflow"
  | "review";

export interface ArticleItem {
  slug: string;
  title: string;
  lang: Lang;
  category: ArticleCategory;
  summary: string;
  readingMinutes: number;
  publishedAt: string;
  cover?: string;
  tags: string[];
}

export type GrowthStage = "0-1k" | "1k-10k" | "10k-100k" | "100k+";

export interface CaseImpact {
  followersDelta: number;
  views: number;
  revenue?: number;
}

export interface CaseItem {
  slug: string;
  title: string;
  stage: GrowthStage;
  strategies: string[];
  timeline: string;
  impact: CaseImpact;
  steps: string[];
  pitfalls: string[];
  takeaways: string[];
  tags: string[];
}

export interface PhotoItem {
  id: string;
  src: string;
  w: number;
  h: number;
  tags: string[];
  caption?: string;
  takenAt?: string;
}

export interface KPI {
  id: string;
  label: string;
  value: string;
  description?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  lang: Lang;
}

export interface SearchResult {
  type: "tweet" | "article" | "case" | "photo";
  title: string;
  description: string;
  href: string;
  tags?: string[];
}
