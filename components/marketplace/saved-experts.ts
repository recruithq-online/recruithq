"use client";
import { useMemo, useSyncExternalStore } from "react";

const key = "recruit-saved-experts";

let fallback = "[]";

let memoryOnly = false;

function snapshot() {
  if (memoryOnly) return fallback;
  try {
    return localStorage.getItem(key) ?? "[]";
  } catch {
    return fallback;
  }
}

function subscribe(listener: () => void) {
  const storage = (event: StorageEvent) => {
    if (event.key === key || event.key === null) listener();
  };
  window.addEventListener("storage", storage);
  window.addEventListener("recruit-saved-change", listener);
  return () => {
    window.removeEventListener("storage", storage);
    window.removeEventListener("recruit-saved-change", listener);
  };
}

export function useSavedExperts() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "[]");
  const saved: number[] = useMemo(() => {
    try {
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed)
        ? parsed.filter(
            (id): id is number => Number.isSafeInteger(id) && id > 0,
          )
        : [];
    } catch {
      return [];
    }
  }, [raw]);
  function toggleSaved(id: number) {
    fallback = JSON.stringify(
      saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id],
    );
    try {
      localStorage.setItem(key, fallback);
    } catch {
      memoryOnly = true;
    }
    window.dispatchEvent(new Event("recruit-saved-change"));
  }
  return { saved, toggleSaved };
}
