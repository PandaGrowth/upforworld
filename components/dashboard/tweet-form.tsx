'use client';

import { useFormState, useFormStatus } from "react-dom";

import { createHighlightTweetAction } from "@/app/(dashboard)/dashboard/actions";
import { Button } from "@/components/ui/button";

const initialState = { error: "" };

export function HighlightTweetForm() {
  const [state, formAction] = useFormState(createHighlightTweetAction, initialState);
  return (
    <form action={formAction} className="space-y-6 rounded-3xl border border-border bg-background/90 p-8 shadow-card">
      <div>
        <h2 className="text-xl font-semibold text-foreground">提交精选推文</h2>
        <p className="text-sm text-muted-foreground">将爆款线程/推文链接提交到社群精选库。</p>
      </div>
      <div className="space-y-4">
        <label className="block text-sm font-medium text-foreground">
          推文链接
          <input
            name="tweetUrl"
            required
            placeholder="https://x.com/..."
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </label>
        <label className="block text-sm font-medium text-foreground">
          提交备注（可选）
          <textarea
            name="note"
            rows={3}
            placeholder="告诉大家这条推文的亮点"
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </label>
      </div>
      {state?.error ? (
        <p className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-500">{state.error}</p>
      ) : null}
      <SubmitButton>提交推文</SubmitButton>
    </form>
  );
}

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "提交中..." : children}
    </Button>
  );
}
