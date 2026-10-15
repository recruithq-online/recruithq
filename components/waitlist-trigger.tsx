"use client";

import { useExperience } from "./experience-provider";

export function WaitlistTrigger({
  children,
  className = "waitlist-cta",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { openModal } = useExperience();
  return (
    <button
      type="button"
      className={className}
      onClick={() => openModal({ type: "waitlist" })}
    >
      {children}
    </button>
  );
}
