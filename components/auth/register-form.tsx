'use client';

import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";

import { signUpAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";

const initialState = { error: "" };

export function RegisterForm() {
  const [state, formAction] = useFormState(signUpAction, initialState);

  return (
    <form action={formAction} className="space-y-6 rounded-2xl border border-border bg-background/80 p-8 shadow-card">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-foreground">注册 Panda Growth 账号</h1>
        <p className="text-sm text-muted-foreground">加入社群，投稿内容并参与加热</p>
      </div>
      <div className="space-y-4">
        <label className="block text-left text-sm font-medium text-foreground">
          昵称
          <input
            name="username"
            required
            className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </label>
        <label className="block text-left text-sm font-medium text-foreground">
          邮箱
          <input
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </label>
        <label className="block text-left text-sm font-medium text-foreground">
          密码
          <input
            name="password"
            type="password"
            required
            minLength={6}
            className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </label>
      </div>
      {state?.error ? (
        <p className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-500">{state.error}</p>
      ) : null}
      <div className="flex flex-col gap-3">
        <SubmitButton>注册并立即加入</SubmitButton>
        <p className="text-center text-sm text-muted-foreground">
          已有账号？
          <Link href="/login" className="ml-1 text-brand hover:underline">
            直接登录
          </Link>
        </p>
      </div>
    </form>
  );
}

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "创建中..." : children}
    </Button>
  );
}
