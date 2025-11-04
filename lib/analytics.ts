"use client";

export type AnalyticsEvent =
  | { type: "pageview"; payload: { path: string } }
  | { type: "cta_click"; payload: { label: string; href: string } }
  | { type: "filter_change"; payload: { filter: string; value: string } };

export function trackEvent(event: AnalyticsEvent): void {
  // TODO: replace console log with real analytics provider
  console.log(`[analytics] ${event.type}`, event.payload);
}
