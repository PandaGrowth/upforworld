'use client';

import { useFormState, useFormStatus } from "react-dom";

import { createArticleAction } from "@/app/(dashboard)/dashboard/actions";
import { Button } from "@/components/ui/button";

const initialState = { error: "" };

export function ArticleForm() {
  const [state, formAction] = useFormState(createArticleAction, initialState);
  return (
    <form action={formAction} className="space-y-6 rounded-3xl border border-border bg-background/90 p-8 shadow-card">
      <div>
        <h2 className="text-xl font-semibold text-foreground">发布写作文章</h2>
        <p className="text-sm text-muted-foreground">分享你的方法论与经验，帮助社群成员进步。</p>
      </div>
      <div className="space-y-4">
        <label className="block text-sm font-medium text-foreground">
          标题
          <input
            name="title"
            required
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </label>
        <label className="block text-sm font-medium text-foreground">
          摘要（可选）
          <input
            name="summary"
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </label>
        <label className="block text-sm font-medium text-foreground">
          正文
          <textarea
            name="content"
            required
            rows={8}
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </label>
      </div>
      {state?.error ? (
        <p className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-500">{state.error}</p>
      ) : null}
      <SubmitButton>发布文章</SubmitButton>
    </form>
  );
}

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "发布中..." : children}
    </Button>
  );
}
