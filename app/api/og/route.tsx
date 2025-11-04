import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "Panda Growth";
  const description =
    searchParams.get("description") ?? "Systematically grow your impact on X";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#020817",
          padding: "80px",
          color: "#e2e8f0",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              background: "#0ea5e9",
              color: "white",
              width: "72px",
              height: "72px",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
            }}
          >
            🐼
          </div>
          <div>
            <div style={{ fontSize: "32px", fontWeight: 700 }}>Panda Growth</div>
            <div style={{ fontSize: "20px", color: "#94a3b8" }}>
              X 平台增长社群
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h1 style={{ fontSize: "64px", fontWeight: 700, lineHeight: 1.1 }}>{title}</h1>
          <p style={{ fontSize: "28px", color: "#94a3b8", maxWidth: "960px" }}>
            {description}
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", color: "#94a3b8" }}>
          <span>Better content · Steadier traffic · Healthier mindset</span>
          <span>pandagrowth.community</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
