"use client";
import { cn } from "@/lib/cn";
import type { RecordExpert } from "@/lib/record-preview";
import { Icon } from "./icons";

export function Avatar({
  alias,
  className,
}: {
  alias: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative grid h-12 w-11 shrink-0 place-items-center overflow-hidden rounded-control bg-brand text-white",
        className,
      )}
    >
      <span className="z-1 -mt-1 font-display text-[32px] italic">
        {alias.slice(0, 1).toUpperCase()}
      </span>
      <svg
        viewBox="0 0 60 20"
        fill="none"
        className="absolute bottom-0 left-0 w-full opacity-25"
      >
        <path
          d="M0 18C15-10 35-10 60 18M0 26C15-2 35-2 60 26"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}

export function Verification({ expert }: { expert: RecordExpert }) {
  return (
    <span
      title={
        expert.verified
          ? "Verification status is illustrative in this sample profile."
          : "This profile has not been verified."
      }
      className={cn(
        expert.verified
          ? "inline-flex items-center gap-1 text-xs text-brand"
          : "text-xs",
      )}
    >
      {expert.verified ? (
        <>
          <Icon name="shield" size={14} /> Verified sample
        </>
      ) : (
        "Unverified profile"
      )}
    </span>
  );
}
