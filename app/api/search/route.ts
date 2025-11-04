import { NextResponse } from "next/server";

import { getSearchResults } from "@/lib/content";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const results = await getSearchResults(query);
  return NextResponse.json(results, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
