"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { routeTo, type MarketplaceExpert } from "@/lib/marketplace";
import { Icon } from "./icons";
import { Avatar, Verification } from "./profile-signals";

function ProfessionalRecord({ expert }: { expert: MarketplaceExpert }) {
  const feedback = expert.feedback.find((item) => item.type === "vouch");

  return (
    <Card className="flex h-full flex-col gap-3 p-4">
      <div className="flex items-center gap-3">
        <Avatar alias={expert.alias} />
        <div className="flex min-w-0 flex-col items-start gap-0.5">
          <h2 className="text-xl">{expert.alias}</h2>
          <p className="text-sm">{expert.headline}</p>
          <Verification expert={expert} />
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 border-y border-border py-3">
        <div>
          <p className="font-display text-xs tracking-wide">REPUTATION</p>
          <p className="font-display text-4xl leading-tight font-medium tracking-tight">
            {expert.score}
            <span className="ml-1 text-sm tracking-normal">/ 100</span>
          </p>
        </div>
        <dl className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 text-xs">
          {[
            [expert.projects, "Projects"],
            [expert.vouches, "Vouches"],
            [expert.refutes, "Accountable refute"],
          ].map(([value, label]) => (
            <div key={label} className="contents">
              <dt>{label}</dt>
              <dd className="text-right font-display text-sm font-medium">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="mt-auto">
        <p className="mb-1 flex items-center gap-1.5 font-display text-xs tracking-wide text-brand">
          <Icon name="check" size={14} /> FROM A PAST HIRER
        </p>
        <blockquote className="line-clamp-2 min-h-10 text-sm leading-5">
          {feedback
            ? `“${feedback.text}”`
            : "This record is ready for its first professional vouch."}
        </blockquote>
      </div>
      <Link
        href={routeTo(`profile/${expert.id}`)}
        aria-label={`View professional record for ${expert.alias}`}
        className="flex min-h-10 items-center justify-between border-t border-border pt-2 text-sm font-semibold text-brand"
      >
        View professional record <Icon name="northeast" size={16} />
      </Link>
    </Card>
  );
}

export function ProfessionalRecordCarousel({
  experts,
}: {
  experts: MarketplaceExpert[];
}) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const count = experts.length;
  const current = Math.min(active, Math.max(0, count - 1));

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  const show = useCallback(
    (index: number) => {
      const element = track.current;
      if (!element || !count) return;
      const next = (index + count) % count;
      element.scrollTo({
        left: next * element.clientWidth,
        behavior: reducedMotion ? "instant" : "smooth",
      });
    },
    [count, reducedMotion],
  );

  useEffect(() => {
    if (count < 2 || !playing || hovered || focused || reducedMotion) return;
    const timer = window.setInterval(() => {
      const bounds = track.current?.getBoundingClientRect();
      if (
        !document.hidden &&
        bounds &&
        bounds.top < innerHeight &&
        bounds.bottom > 0
      ) {
        show(current + 1);
      }
    }, 5000);
    return () => window.clearInterval(timer);
  }, [count, current, playing, hovered, focused, reducedMotion, show]);

  if (!count) return null;

  return (
    <section
      aria-label="Professional records"
      aria-roledescription="carousel"
      className="min-w-0 w-full max-w-90 justify-self-center rounded-card bg-brand p-3 text-white motion-safe:animate-record-enter"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
    >
      <div className="mb-3 flex items-center justify-between gap-2 font-display text-xs tracking-wide">
        <span>PROOF OVER PROMISES</span>
        {/* <span>
          {current + 1} / {count}
        </span> */}
      </div>
      <div
        ref={track}
        data-testid="professional-record"
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-card text-foreground [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-live={playing && !reducedMotion ? "off" : "polite"}
        onScroll={(event) => {
          const element = event.currentTarget;
          setActive(Math.round(element.scrollLeft / element.clientWidth));
        }}
      >
        {experts.map((expert, index) => (
          <div
            key={expert.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${count}: ${expert.alias}`}
            aria-hidden={index !== current}
            inert={index !== current}
            className="w-full shrink-0 snap-start snap-always"
          >
            <ProfessionalRecord expert={expert} />
          </div>
        ))}
      </div>
      {count > 1 && (
        <div className="mt-2 flex items-center gap-1">
          <div
            className="flex flex-1 flex-wrap justify-center align-middle gap-1"
            aria-label="Choose a professional record"
          >
            {experts.map((expert, index) => (
              <button
                key={expert.id}
                type="button"
                aria-label={`Show ${expert.alias}'s record`}
                aria-current={index === current ? "true" : undefined}
                className="group grid h-10 w-5 place-items-center rounded-control"
                onClick={() => show(index)}
              >
                <span className="size-1.5 rounded-full bg-white/40 group-aria-[current=true]:bg-white" />
              </button>
            ))}
          </div>
          {/* <button
            type="button"
            aria-label="Next professional record"
            className="grid size-10 shrink-0 place-items-center rounded-control hover:bg-white/15"
            onClick={() => show(current + 1)}
          >
            <Icon name="arrow" size={18} />
          </button> */}
          {/* {!reducedMotion && (
            <button
              type="button"
              aria-label={
                playing ? "Pause record rotation" : "Play record rotation"
              }
              className="grid size-10 shrink-0 place-items-center rounded-control hover:bg-white/15"
              onClick={() => setPlaying((value) => !value)}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
                aria-hidden="true"
              >
                {playing ? (
                  <path d="M4 3h3v10H4zM9 3h3v10H9z" />
                ) : (
                  <path d="m4 2 9 6-9 6z" />
                )}
              </svg>
            </button>
          )} */}
        </div>
      )}
    </section>
  );
}
