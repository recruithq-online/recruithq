"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { RecordExpert } from "@/lib/record-preview";
import { Icon } from "./icons";
import { Avatar, Verification } from "./profile-signals";

export function PreviewExpertCard({
  expert: e,
  reveal = false,
  className,
}: {
  expert: RecordExpert;
  reveal?: boolean;
  className?: string;
}) {
  return (
    <Card
      as="article"
      interactive
      className={cn("flex flex-col p-5", className)}
      data-reveal={reveal ? "" : undefined}
      data-testid="expert-card"
    >
      <div className="-mt-1 -mr-1 mb-4 flex min-h-8 items-center justify-between">
        <span
          className={cn(
            e.availability === "Available for projects"
              ? "inline-flex items-center gap-1.5 text-sm text-brand"
              : "inline-flex items-center gap-1.5 text-sm",
          )}
        >
          <i className="size-1.5 rounded-full bg-current" />
          {e.availability === "Available for projects"
            ? "Available for work"
            : e.availability === "Limited availability"
              ? "Limited availability"
              : "Currently unavailable"}
        </span>
        <Icon name="bookmark" size={18} />
      </div>
      <div className="mb-4.5 flex items-center gap-2.5">
        <Avatar alias={e.alias} />
        <div>
          <h3 className="mb-1 text-lg tracking-tight">
            <Link href="#early-access">{e.alias}</Link>
          </h3>
          <Verification expert={e} />
        </div>
        <span className="ml-auto hidden font-display text-xs tracking-wide uppercase laptop:inline max-nav:inline">
          {e.category}
        </span>
      </div>
      <div className="mb-2.5 text-base font-semibold tracking-tight">
        {e.headline}
      </div>
      <p className="mb-4.5 min-h-15 text-base leading-7 wrap-anywhere max-nav:min-h-0">
        {e.about}
      </p>
      <div className="mb-5.5 flex flex-wrap gap-1.5">
        {e.skills.slice(0, 3).map((skill) => (
          <span key={skill} className="rounded-control px-2 py-1 text-sm">
            {skill}
          </span>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between gap-2.5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="text-[32px] leading-none font-medium tracking-[-.06em]">
            {e.score}
          </span>
          <div>
            <b className="block text-sm font-normal">Reputation</b>
            <small className="mt-1 block text-xs">out of 100</small>
          </div>
        </div>
        <div className="grid gap-1.5 text-sm" data-testid="reputation-signals">
          <span className="flex items-center gap-1.5">
            <Icon name="check" size={13} />
            {e.vouches} vouches
          </span>
          <span className="flex items-center gap-1.5">
            <Icon name="flag" size={12} />
            {e.refutes} refute{e.refutes === 1 ? "" : "s"}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 pt-4.5">
        <div>
          <strong className="text-lg font-medium">${e.rate}</strong>
          <span className="text-xs"> / hr</span>
          <small className="mt-0.5 block text-xs">
            {e.projects} completed projects
          </small>
        </div>
        <Link
          href="#early-access"
          aria-label={`View profile for ${e.alias}`}
          className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-brand hover:underline motion-safe:[&_svg]:transition-transform motion-safe:hover:[&_svg]:translate-x-0.5 motion-safe:hover:[&_svg]:-translate-y-0.5"
        >
          View profile <Icon name="northeast" size={16} />
        </Link>
      </div>
      <Button
        variant="secondary"
        className="mt-4 min-h-10 px-2.5 py-2 text-sm text-brand"
      >
        Discuss a project<span className="sr-only"> with {e.alias}</span>
        <Icon name="arrow" size={15} className="ml-auto" />
      </Button>
    </Card>
  );
}
