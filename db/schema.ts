import { pgEnum, pgTable, text, timestamp, uuid, varchar, integer, serial } from "drizzle-orm/pg-core";

export const boostStatusEnum = pgEnum("boost_status", ["open", "in_progress", "closed"]);

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  username: varchar("username", { length: 120 }),
  avatarUrl: text("avatar_url"),
  bio: varchar("bio", { length: 280 }),
  points: integer("points").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  authorId: uuid("author_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 160 }).notNull(),
  summary: varchar("summary", { length: 300 }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const highlightTweets = pgTable("highlight_tweets", {
  id: serial("id").primaryKey(),
  authorId: uuid("author_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  tweetUrl: text("tweet_url").notNull(),
  note: varchar("note", { length: 240 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const boostRequests = pgTable("boost_requests", {
  id: serial("id").primaryKey(),
  authorId: uuid("author_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 160 }).notNull(),
  description: text("description"),
  link: text("link").notNull(),
  status: boostStatusEnum("status").notNull().default("open"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const boostSupports = pgTable("boost_supports", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id").notNull().references(() => boostRequests.id, { onDelete: "cascade" }),
  supporterId: uuid("supporter_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
