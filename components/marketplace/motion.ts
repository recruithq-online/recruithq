"use client";
import { useEffect, useRef } from "react";

/** Reveal content when it enters view; content stays visible without JavaScript. */
export function usePageMotion(pathname: string) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element || !window.IntersectionObserver) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    let observer: IntersectionObserver | null = null;
    function setup() {
      observer?.disconnect();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
      if (preference.matches || !element) return;
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            observer?.unobserve(entry.target);
            const target = entry.target as HTMLElement;
            // Above-the-fold content already has its own opening sequence.
            if (target.getBoundingClientRect().top < 110) continue;
            const index = Array.from(
              target.parentElement?.children ?? [],
            ).indexOf(target);
            const animation = target.animate(
              [
                { opacity: 0.15, transform: "translateY(22px)" },
                { opacity: 1, transform: "translateY(0)" },
              ],
              {
                duration: 650,
                delay: Math.min(index, 2) * 65,
                easing: "cubic-bezier(.22,1,.36,1)",
                fill: "backwards",
              },
            );
            animations.add(animation);
            animation.finished
              .then(() => animations.delete(animation))
              .catch(() => {});
          }
        },
        { threshold: 0.08 },
      );
      element
        .querySelectorAll("[data-reveal]")
        .forEach((target) => observer?.observe(target));
    }
    setup();
    preference.addEventListener("change", setup);
    return () => {
      observer?.disconnect();
      animations.forEach((animation) => animation.cancel());
      preference.removeEventListener("change", setup);
    };
  }, [pathname]);
  return root;
}
