import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Container({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-312 px-6 tablet:px-7 laptop:px-10 max-phone:px-4.5",
        className,
      )}
      {...props}
    />
  );
}
