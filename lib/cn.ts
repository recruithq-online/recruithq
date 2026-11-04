import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Register the named utilities from globals.css so local overrides win too.
const merge = extendTailwindMerge({
  extend: {
    theme: {
      radius: ["card", "control"],
      shadow: [
        "card",
        "card-hover",
        "control",
        "button",
        "button-hover",
        "navigation",
        "navigation-scrolled",
      ],
    },
  },
});

/** Later Tailwind classes override earlier ones, including caller overrides. */
export function cn(...classes: ClassValue[]) {
  return merge(clsx(classes));
}
