export const dynamic = "force-dynamic";

import { HighlightTweetForm } from "@/components/dashboard/tweet-form";
import { Section } from "@/components/section";

export default function NewTweetHighlightPage() {
  return (
    <div className="w-full py-8">
      <Section className="max-w-3xl">
        <HighlightTweetForm />
      </Section>
    </div>
  );
}
