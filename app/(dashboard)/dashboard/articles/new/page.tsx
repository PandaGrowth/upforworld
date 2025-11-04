export const dynamic = "force-dynamic";

import { ArticleForm } from "@/components/dashboard/article-form";
import { Section } from "@/components/section";

export default function NewArticlePage() {
  return (
    <div className="w-full py-8">
      <Section className="max-w-3xl">
        <ArticleForm />
      </Section>
    </div>
  );
}
