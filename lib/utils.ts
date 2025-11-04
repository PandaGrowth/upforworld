import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string, fmt = "yyyy.MM.dd"): string {
  return format(parseISO(date), fmt);
}

export function formatISODateTime(date: string, fmt = "yyyy-MM-dd HH:mm"): string {
  return format(parseISO(date), fmt);
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toString();
}

export const topicCopy: Record<string, string> = {
  growth: "增长",
  writing: "写作",
  case: "案例",
  tooling: "工具",
  other: "其他",
};
