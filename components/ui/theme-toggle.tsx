"use client";
import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  const preference = window.matchMedia("(prefers-color-scheme: dark)");
  function followSystem() {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("recruit-theme");
    } catch {}
    if (saved !== "light" && saved !== "dark") {
      document.documentElement.dataset.theme = preference.matches
        ? "dark"
        : "light";
      onChange();
    }
  }
  function syncTabs(event: StorageEvent) {
    if (event.key !== "recruit-theme" && event.key !== null) return;
    document.documentElement.dataset.theme =
      event.newValue === "light" || event.newValue === "dark"
        ? event.newValue
        : preference.matches
          ? "dark"
          : "light";
    onChange();
  }
  preference.addEventListener("change", followSystem);
  window.addEventListener("recruit-theme-change", onChange);
  window.addEventListener("storage", syncTabs);
  return () => {
    preference.removeEventListener("change", followSystem);
    window.removeEventListener("recruit-theme-change", onChange);
    window.removeEventListener("storage", syncTabs);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset.theme ?? "light",
    () => "light",
  );
  return (
    <button
      type="button"
      className="grid size-10 shrink-0 place-items-center rounded-control transition-colors hover:text-brand"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      aria-pressed={theme === "dark"}
      onClick={() => {
        const next = theme === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem("recruit-theme", next);
        } catch {}
        window.dispatchEvent(new Event("recruit-theme-change"));
      }}
    >
      <svg
        className={theme === "dark" ? "hidden" : "size-4.5"}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path d="M20.5 13.1A8.5 8.5 0 0 1 10.9 3.5a8.5 8.5 0 1 0 9.6 9.6Z" />
      </svg>
      <svg
        className={theme === "dark" ? "size-4.5" : "hidden"}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
      </svg>
    </button>
  );
}
