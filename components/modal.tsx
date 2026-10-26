"use client";

import { useEffect, useRef } from "react";

export function Modal({
  children,
  onClose,
  labelledBy,
  variant = "default",
}: {
  children: React.ReactNode;
  onClose: () => void;
  labelledBy: string;
  variant?: "default" | "marketplace";
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
      className={variant === "marketplace" ? "mp-modal-backdrop" : "modal"}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={variant === "marketplace" ? "marketplace mp-modal-sheet" : "sheet"}
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
