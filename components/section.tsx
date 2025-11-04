import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  bleed?: boolean;
  outerClassName?: string;
}

export function Section({
  className,
  children,
  id,
  bleed = false,
  outerClassName,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "w-full scroll-mt-28 py-16 sm:py-20",
        bleed ? "px-0" : "px-4 sm:px-6 lg:px-0",
        outerClassName,
      )}
      {...props}
    >
      <div
        className={cn(
          bleed ? "w-full" : "mx-auto w-full max-w-[1180px]",
          className,
        )}
      >
        {children}
      </div>
    </section>
  );
}
