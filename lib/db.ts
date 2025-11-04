import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "@/db/schema";

let cachedDb: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!cachedDb) {
    const connectionString = process.env.SUPABASE_DB_URL;
    if (!connectionString) {
      throw new Error("Missing SUPABASE_DB_URL environment variable.");
    }
    const pool = new Pool({ connectionString });
    cachedDb = drizzle(pool, { schema });
  }
  return cachedDb;
}
