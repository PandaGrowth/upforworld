import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface TestimonialProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

export function TestimonialCard({
  name,
  role,
  quote,
  avatar,
  className,
  ...props
}: TestimonialProps) {
  return (
    <figure
      className={cn(
        "flex h-full flex-col justify-between gap-6 rounded-2xl border border-border bg-background/80 p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover",
        className,
      )}
      {...props}
    >
      <blockquote className="text-base leading-relaxed text-foreground">
        “{quote}”
      </blockquote>
      <figcaption className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </figcaption>
    </figure>
  );
}
