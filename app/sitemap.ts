import type { MetadataRoute } from "next";

import { getArticles, getCases, getPhotos, getTweets } from "@/lib/content";

const baseUrl = "https://pandagrowth.community";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tweets, articles, cases, photos] = await Promise.all([
    getTweets(),
    getArticles(),
    getCases(),
    getPhotos(),
  ]);

  const staticRoutesList = [
    "",
    "/tweets",
    "/writing",
    "/growth",
    "/photos",
    "/join",
  ] as const;

  const staticRoutes: MetadataRoute.Sitemap = staticRoutesList.map((path) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const tweetRoutes = tweets.map((tweet) => ({
    url: `${baseUrl}/tweets/${tweet.id}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const articleRoutes = articles.map((article) => ({
    url: `${baseUrl}/writing/${article.slug}`,
    lastModified: article.publishedAt,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const caseRoutes = cases.map((item) => ({
    url: `${baseUrl}/growth/${item.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const photoRoutes = photos.map((photo) => ({
    url: `${baseUrl}/photos#${photo.id}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...tweetRoutes, ...articleRoutes, ...caseRoutes, ...photoRoutes];
}
