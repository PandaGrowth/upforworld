import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";
import { Section } from "@/components/section";

export default function LoginPage() {
  return (
    <div className="w-full py-16">
      <Section className="flex flex-col items-center gap-6">
        <Link href="/" className="text-sm text-muted-foreground hover:text-brand">
          ← 返回主页
        </Link>
        <LoginForm />
      </Section>
    </div>
  );
}
