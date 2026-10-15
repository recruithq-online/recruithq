"use client";

import { useRef } from "react";
import { useExperience } from "./experience-provider";

export function SearchPathways() {
  const { query, setQuery, openModal } = useExperience();
  const input = useRef<HTMLInputElement>(null);
  return (
    <div className="product-faded">
      <form
        className="search flex gap-2.5 max-[560px]:gap-[5px] max-[560px]:flex-col"
        onSubmit={(event) => event.preventDefault()}
      >
        <input
          ref={input}
          id="search"
          aria-label="Search experts"
          placeholder="Try “designer”, “Solana”, “copywriter”…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button type="submit">Find experts</button>
      </form>
      <div className="pathway-cards grid grid-cols-2">
        <button
          className="pathway-card"
          onClick={() => {
            document
              .getElementById("experts")
              ?.scrollIntoView({ behavior: "smooth" });
            input.current?.focus({ preventScroll: true });
          }}
        >
          <span>
            <b>Hire an Expertise</b>
            <small>Find skilled people with proof of work</small>
          </span>
          <span className="arrow">↗</span>
        </button>
        <button
          className="pathway-card"
          onClick={() => openModal({ type: "list" })}
        >
          <span>
            <b>List Your Expertise</b>
            <small>Build a reputation around your work</small>
          </span>
          <span className="arrow">↗</span>
        </button>
      </div>
      <div className="hero-note">
        Alias-only profiles · reputation built from work, vouches and
        accountable feedback
      </div>
    </div>
  );
}
