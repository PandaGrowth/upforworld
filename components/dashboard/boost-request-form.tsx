'use client';

import { useFormState, useFormStatus } from "react-dom";

import { createBoostRequestAction } from "@/app/(dashboard)/dashboard/actions";
import { Button } from "@/components/ui/button";

const initialState = { error: "" };

export function BoostRequestForm() {
  const [state, formAction] = useFormState(createBoostRequestAction, initialState);
  return (
    <form action={formAction} className="space-y-6 rounded-3xl border border-border bg-background/90 p-8 shadow-card">
      <div>
        <h2 className="text-xl font-semibold text-foreground">发布加热请求</h2>
        <p className="text-sm text-muted-foreground">描述你的内容和目标，让社群伙伴帮你冲一波曝光。</p>
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
          内容链接
          <input
            name="link"
            required
            placeholder="https://x.com/... 或其他 landing page"
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </label>
        <label className="block text-sm font-medium text-foreground">
          请求说明（可选）
          <textarea
            name="description"
            rows={4}
            placeholder="目标指标、希望大家如何帮忙、特别说明等"
            className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </label>
      </div>
      {state?.error ? (
        <p className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-500">{state.error}</p>
      ) : null}
      <SubmitButton>发布请求</SubmitButton>
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
