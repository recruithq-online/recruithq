"use client";
import { useEffect, useRef } from "react";

export function Dialog({
  children,
  onClose,
  labelledBy,
}: {
  children: React.ReactNode;
  onClose: () => void;
  labelledBy: string;
}) {
  const sheet = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const root = sheet.current;
    const selector =
      'button:not(:disabled), a[href], input:not([type="hidden"]):not([tabindex="-1"]), select, textarea, [tabindex="0"]';
    (
      root?.querySelector<HTMLElement>(
        "input:not([type=hidden]):not([tabindex='-1'])",
      ) ??
      root?.querySelector<HTMLElement>(selector) ??
      root
    )?.focus();
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const elements = Array.from(
        root?.querySelectorAll<HTMLElement>(selector) ?? [],
      ).filter((element) => element.getClientRects().length);
      const first = elements[0];
      const last = elements.at(-1);
      if (!first) {
        event.preventDefault();
        root?.focus();
        return;
      }
      if (
        event.shiftKey &&
        (document.activeElement === first || document.activeElement === root)
      ) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
      previousFocus?.focus({ preventScroll: true });
    };
  }, [onClose]);
  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto overscroll-contain bg-black/65 p-6 backdrop-blur-[3px] max-nav:p-3"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="relative max-h-[calc(100dvh-48px)] w-full max-w-125 overflow-y-auto overscroll-contain rounded-card border border-border bg-surface p-8 [scrollbar-gutter:stable] motion-safe:animate-dialog max-nav:max-h-[calc(100dvh-24px)] max-nav:p-6"
        ref={sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>
  );
}

export function DialogTitle({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) {
  return (
    <h2 id={id} className="mt-1 mb-3.5 pr-10 text-[26px] tracking-tight">
      {children}
    </h2>
  );
}
