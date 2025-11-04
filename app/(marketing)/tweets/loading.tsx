import { Section } from "@/components/section";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingTweets() {
  return (
    <div className="w-full space-y-6 pb-20">
      <Section className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-3/4" />
      </Section>
      <Section className="grid gap-6 pt-0 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-72 w-full" />
        ))}
      </Section>
    </div>
  );
}
