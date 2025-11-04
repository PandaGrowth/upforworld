"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { trackEvent } from "@/lib/analytics";

export function PageViewTracker(): null {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    trackEvent({ type: "pageview", payload: { path: pathname } });
  }, [pathname]);

  return null;
}
