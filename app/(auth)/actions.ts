'use server';

import { redirect } from "next/navigation";

import { getSupabaseActionClient } from "@/lib/supabase/actions";
import { ensureProfile } from "@/lib/user-profile";

interface ActionResult {
  error?: string;
}

export async function signInAction(prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!email || !password) {
    return { error: "请输入邮箱和密码" };
  }

  const supabase = getSupabaseActionClient();
  if (!supabase) {
    return { error: 'Supabase 未配置，无法登录。请联系管理员或在环境变量中配置 Supabase。' };
  }
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: error.message };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    await ensureProfile(user);
  }

  redirect("/dashboard");
}

export async function signUpAction(prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim();

  if (!email || !password || !username) {
    return { error: "请填写所有必填字段" };
  }

  const supabase = getSupabaseActionClient();
  if (!supabase) {
    return { error: "Supabase 未配置，无法注册。请联系管理员或在环境变量中配置 Supabase。" };
  }
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
    },
  });
  if (error) {
    return { error: error.message };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    await ensureProfile(user, { username });
  }

  redirect("/dashboard");
}

export async function signOutAction(): Promise<void> {
  const supabase = getSupabaseActionClient();
  if (!supabase) {
    return;
  }
  await supabase.auth.signOut();
  redirect("/");
}
