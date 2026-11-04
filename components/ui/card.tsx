import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: "div" | "article" | "section" | "aside";
  interactive?: boolean;
};

/** Shared card surface. Global radius and border live in globals.css. */
export function Card({
  as: Tag = "div",
  interactive = false,
  className,
  ...props
}: CardProps) {
  return (
    <Tag
      className={cn(
        "min-w-0 rounded-card border border-border bg-surface p-6 text-foreground",
        interactive &&
          "transition-transform duration-300 motion-safe:hover:-translate-y-1",
        className,
      )}
      {...props}
    />
  );
}
