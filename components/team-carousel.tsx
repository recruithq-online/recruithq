"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";

export function TeamCarousel({ children }: { children: React.ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const count = Children.count(children);

  const updateActive = useCallback(() => {
    const element = track.current;
    if (!element) return;
    const left = element.getBoundingClientRect().left;
    let nearest = 0;
    let distance = Infinity;
    Array.from(element.children).forEach((card, index) => {
      const offset = Math.abs(card.getBoundingClientRect().left - left);
      if (offset < distance) {
        distance = offset;
        nearest = index;
      }
    });
    setActive(nearest);
  }, []);

  useEffect(() => {
    if (!track.current) return;
    const observer = new ResizeObserver(updateActive);
    observer.observe(track.current);
    return () => observer.disconnect();
  }, [updateActive]);

  function show(index: number) {
    const element = track.current;
    if (!element) return;
    const card = element.children.item(Math.max(0, Math.min(count - 1, index)));
    if (!card) return;
    element.scrollTo({
      left:
        element.scrollLeft +
        card.getBoundingClientRect().left -
        element.getBoundingClientRect().left,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }

  return (
    <div className="team-carousel" data-carousel={count > 1}>
      <div
        ref={track}
        className="people team-carousel-track"
        role="group"
        aria-label="Team members"
        tabIndex={count > 1 ? 0 : undefined}
        onScroll={updateActive}
        onKeyDown={(event) => {
          const element = track.current;
          if (
            event.target !== event.currentTarget ||
            !element ||
            element.scrollWidth <= element.clientWidth
          )
            return;
          const destinations: Record<string, number> = {
            ArrowLeft: active - 1,
            ArrowRight: active + 1,
            Home: 0,
            End: count - 1,
          };
          const destination = destinations[event.key];
          if (destination === undefined) return;
          event.preventDefault();
          show(destination);
        }}
      >
        {children}
      </div>
      {count > 1 && (
        <div
          className="team-carousel-controls"
          aria-label="Team carousel controls"
        >
          <button
            className="team-carousel-arrow"
            type="button"
            aria-label="Previous team member"
            disabled={active === 0}
            onClick={() => show(active - 1)}
          >
            ←
          </button>
          <div className="team-carousel-dots">
            {Array.from({ length: count }, (_, index) => (
              <button
                key={index}
                className="team-carousel-dot"
                type="button"
                aria-label={`Show team member ${index + 1}`}
                aria-current={index === active ? "true" : undefined}
                onClick={() => show(index)}
              />
            ))}
          </div>
          <button
            className="team-carousel-arrow"
            type="button"
            aria-label="Next team member"
            disabled={active === count - 1}
            onClick={() => show(active + 1)}
          >
            →
          </button>
          <span className="sr-only" role="status">
            Team member {active + 1} of {count}
          </span>
        </div>
      )}
    </div>
  );
}
