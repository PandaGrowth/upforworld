'use server';

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, and } from "drizzle-orm";

import { articles, boostRequests, boostSupports, highlightTweets, profiles } from "@/db/schema";
import { getDb } from "@/lib/db";
import { getSupabaseActionClient } from "@/lib/supabase/actions";
import { ensureProfile } from "@/lib/user-profile";

interface ActionResult {
  error?: string;
}

async function requireUser() {
  const supabase = getSupabaseActionClient();
  if (!supabase) {
    throw new Error("Supabase 环境变量未配置，无法执行此操作。请参考 README 配置 Supabase。");
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  await ensureProfile(user);
  return { supabase, user } as const;
}

export async function createArticleAction(prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  if (!title || !content) {
    return { error: "文章标题与内容不能为空" };
  }

  const { user } = await requireUser();
  const db = getDb();
  await db.insert(articles).values({
    authorId: user.id,
    title,
    summary: summary || null,
    content,
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function createHighlightTweetAction(prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const tweetUrl = String(formData.get("tweetUrl") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();
  if (!tweetUrl) {
    return { error: "请填写推文链接" };
  }

  const { user } = await requireUser();
  const db = getDb();
  await db.insert(highlightTweets).values({
    authorId: user.id,
    tweetUrl,
    note: note || null,
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function createBoostRequestAction(prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const title = String(formData.get("title") ?? "").trim();
  const link = String(formData.get("link") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (!title || !link) {
    return { error: "标题和链接为必填项" };
  }

  const { user } = await requireUser();
  const db = getDb();
  await db.insert(boostRequests).values({
    authorId: user.id,
    title,
    link,
    description: description || null,
  });

  revalidatePath("/dashboard");
  revalidatePath("/boost");
  redirect("/dashboard");
}

export async function supportBoostAction(formData: FormData): Promise<void> {
  const requestId = Number(formData.get("requestId"));
  if (!requestId) {
    return;
  }

  const { user } = await requireUser();
  const db = getDb();

  const existing = await db
    .select({ id: boostSupports.id })
    .from(boostSupports)
    .where(and(eq(boostSupports.requestId, requestId), eq(boostSupports.supporterId, user.id)))
    .limit(1);

  if (existing.length > 0) {
    return;
  }

  await db.insert(boostSupports).values({
    requestId,
    supporterId: user.id,
  });

  const current = await db
    .select({ points: profiles.points })
    .from(profiles)
    .where(eq(profiles.id, user.id))
    .limit(1);

  const points = (current[0]?.points ?? 0) + 1;
  await db.update(profiles).set({ points }).where(eq(profiles.id, user.id));

  revalidatePath("/boost");
  revalidatePath("/dashboard");
}
