import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const variants = {
  primary: "bg-brand text-white",
  secondary:
    "border border-border bg-surface text-foreground hover:border-brand/40",
  ghost: "bg-transparent text-foreground hover:text-brand",
  vouch: "border border-border bg-surface text-brand hover:border-brand",
  refute: "border border-border bg-surface text-foreground hover:border-brand",
} as const;

const sizes = {
  default: "min-h-11 px-4.5 py-2.5 text-base",
  small: "min-h-10 px-3 py-2 text-sm",
} as const;

type ButtonOptions = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
};

/** Use for both buttons and Next.js links that look like buttons. */
export function buttonStyles({
  variant = "primary",
  size = "default",
  className,
}: ButtonOptions = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2.5 rounded-control font-semibold leading-snug transition-[color,background,border-color] disabled:cursor-default disabled:opacity-50 motion-safe:[&_svg]:transition-transform motion-safe:hover:[&_svg]:translate-x-0.5",
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button({
  variant,
  size,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & ButtonOptions) {
  return (
    <button className={buttonStyles({ variant, size, className })} {...props} />
  );
}
