'use client';

import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";

import { signInAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";

const initialState = { error: "" };

export function LoginForm() {
  const [state, formAction] = useFormState(signInAction, initialState);

  return (
    <form action={formAction} className="space-y-6 rounded-2xl border border-border bg-background/80 p-8 shadow-card">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-foreground">登录 Panda Growth</h1>
        <p className="text-sm text-muted-foreground">继续访问用户中心与加热专区</p>
      </div>
      <div className="space-y-4">
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
        <SubmitButton>登录</SubmitButton>
        <p className="text-center text-sm text-muted-foreground">
          还没有账号？
          <Link href="/register" className="ml-1 text-brand hover:underline">
            立即注册
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
      {pending ? "登录中..." : children}
    </Button>
  );
}
