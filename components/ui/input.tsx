import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const control =
  "min-h-11 w-full min-w-0 rounded-control border border-border bg-surface px-3 py-3 text-base text-foreground placeholder:text-foreground/65 focus:border-brand focus:outline-2 focus:outline-offset-2 focus:outline-brand";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(control, className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(control, className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(control, "min-h-30 resize-y", className)}
      {...props}
    />
  );
}
