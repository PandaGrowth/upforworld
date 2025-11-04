"use client";

import * as React from "react";
import { useTheme } from "next-themes";

declare global {
  interface Window {
    twttr?: {
      widgets?: {
        load: (element?: HTMLElement) => void;
      };
    };
  }
}

let twitterScriptLoading = false;

function ensureTwitterScript(): void {
  if (typeof window === "undefined") return;
  if (document.querySelector("script[src='https://platform.twitter.com/widgets.js']")) {
    return;
  }
  if (twitterScriptLoading) return;

  const script = document.createElement("script");
  script.src = "https://platform.twitter.com/widgets.js";
  script.async = true;
  script.charset = "utf-8";
  script.onload = () => {
    twitterScriptLoading = false;
    window.twttr?.widgets?.load();
  };
  twitterScriptLoading = true;
  document.body.appendChild(script);
}

interface TwitterEmbedProps {
  url: string;
}

export function TwitterEmbed({ url }: TwitterEmbedProps): React.ReactElement {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? "dark" : "light";

  React.useEffect(() => {
    ensureTwitterScript();
    const container = containerRef.current;
    if (container) {
      container.innerHTML = "";
      const blockquote = document.createElement("blockquote");
      blockquote.className = "twitter-tweet";
      blockquote.dataset.theme = theme;
      blockquote.dataset.dnt = "true";

      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.textContent = "Loading…";

      blockquote.appendChild(anchor);
      container.appendChild(blockquote);

      window.twttr?.widgets?.load(container);
    }
  }, [url, theme]);

  return (
    <div ref={containerRef} className="tweet-embed w-full" aria-live="polite" />
  );
}
