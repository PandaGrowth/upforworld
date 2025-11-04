import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { profiles } from "@/db/schema";

type User = {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
};

export async function ensureProfile(
  user: User,
  overrides?: { username?: string; avatarUrl?: string },
) {
  if (!user?.id) return;

  const db = getDb();
  const existing = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.id, user.id))
    .limit(1);

  const metadataUsername = String(user.user_metadata?.username ?? "").trim();
  const username = overrides?.username ?? metadataUsername ?? user.email ?? "创作者";
  const avatarUrl = overrides?.avatarUrl ?? String(user.user_metadata?.avatar_url ?? "");

  if (existing.length === 0) {
    await db.insert(profiles).values({
      id: user.id,
      username,
      avatarUrl,
    });
  } else if (overrides?.username || overrides?.avatarUrl) {
    await db
      .update(profiles)
      .set({
        username,
        avatarUrl,
      })
      .where(eq(profiles.id, user.id));
  }
}

export async function fetchProfile(userId: string) {
  if (!userId) return null;
  const db = getDb();
  const res = await db
    .select({
      id: profiles.id,
      username: profiles.username,
      avatarUrl: profiles.avatarUrl,
      points: profiles.points,
    })
    .from(profiles)
    .where(eq(profiles.id, userId))
    .limit(1);
  return res[0] ?? null;
}
