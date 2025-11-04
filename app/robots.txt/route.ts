import { NextResponse } from "next/server";

export function GET(): NextResponse<string> {
  const body = `User-agent: *
Allow: /
Sitemap: https://pandagrowth.community/sitemap.xml`;
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
