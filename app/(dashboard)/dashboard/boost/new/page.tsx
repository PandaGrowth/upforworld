export const dynamic = "force-dynamic";

import { BoostRequestForm } from "@/components/dashboard/boost-request-form";
import { Section } from "@/components/section";

export default function NewBoostRequestPage() {
  return (
    <div className="w-full py-8">
      <Section className="max-w-3xl">
        <BoostRequestForm />
      </Section>
    </div>
  );
}
