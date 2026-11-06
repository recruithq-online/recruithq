"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button, buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { categories, toRecordExpert } from "@/lib/record-preview";
import { PreviewExpertCard } from "./preview-expert-card";
import { Icon } from "./icons";
import { ProfessionalRecordCarousel } from "./professional-record";
import { useExperience } from "./experience-provider";
import { WaitlistTrigger } from "./waitlist-trigger";
import { Welcome } from "./welcome";

export function HomeExperience() {
  const { experts: profiles } = useExperience();
  const experts = profiles.map(toRecordExpert);
  const [category, setCategory] = useState("");
  const selected = experts
    .filter((expert) => !category || expert.category === category)
    .slice(0, 3);
  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }
  return (
    <>
      <section
        id="overview"
        className="relative pt-16 pb-14.5 max-nav:pt-9.5 max-nav:pb-9 wide:py-21"
        data-testid="home-hero"
      >
        <Container className="grid grid-cols-1 items-center gap-9 nav:grid-cols-[1.05fr_1fr] nav:gap-7  laptop:gap-17.5">
          <div className="py-1">
            <h1 className="my-6 text-[clamp(44px,5.1vw,68px)] leading-[1.03] font-bold tracking-[-.06em] max-phone:text-[40px]">
              Hire people for what they can actually do.
            </h1>
            <p className="mb-6 max-w-125 text-base leading-7 text-muted">
              Find reputable experts using work history and reviews from past
              hirers — not just a CV.
            </p>
            <div
              className="product-faded"
              data-testid="search-preview"
              inert
              aria-hidden="true"
            >
              <form
                onSubmit={search}
                className="flex max-w-125 items-center gap-2.5 rounded-control border border-border bg-surface p-1.5 pl-4 focus-within:outline-2 focus-within:outline-brand motion-safe:animate-hero-search max-nav:max-w-full"
              >
                <Icon name="search" />
                <label htmlFor="home-search" className="sr-only">
                  What expertise do you need?
                </label>
                <input
                  id="home-search"
                  name="q"
                  placeholder="What expertise do you need?"
                  maxLength={100}
                  className="w-full min-w-0 border-0 bg-transparent py-2.5 text-base outline-none"
                />
                <Button
                  aria-label="Find experts"
                  className="px-3 text-sm whitespace-nowrap"
                >
                  <span className="max-nav:inline max-phone:hidden">
                    Find experts
                  </span>
                  <Icon name="arrow" size={18} />
                </Button>
              </form>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs motion-safe:animate-hero-detail">
                <span>Try:</span>
                {["Product design", "Solana", "Copywriting"].map((skill) => (
                  <Link
                    className="inline-flex items-center gap-1 hover:text-brand"
                    key={skill}
                    href="#early-access"
                  >
                    {skill}
                    <Icon name="northeast" size={12} />
                  </Link>
                ))}
              </div>
              <div className="mt-7.5 text-sm motion-safe:animate-hero-detail">
                Good at what you do?{" "}
                <Link
                  href="#early-access"
                  className="ml-1 inline-flex items-center gap-1.5 font-semibold"
                >
                  Let your work speak <Icon name="arrow" size={15} />
                </Link>
              </div>
            </div>
          </div>
          <div
            className="product-faded min-w-0 w-full"
            data-testid="record-preview"
            inert
            aria-hidden="true"
          >
            <ProfessionalRecordCarousel experts={experts} />
          </div>
        </Container>
      </section>
      <Container>
        <section
          className="coming-soon"
          id="early-access"
          aria-label="Coming soon"
        >
          <span className="pill">Early access</span>
          <h2>Coming Soon.</h2>
          <p>
            We’re building a better way to discover expertise through reputation
            and proof of work. Join the waitlist to be part of what’s next.
          </p>
          <div className="coming-soon-actions">
            <WaitlistTrigger>
              Join rEcruit Waitlist <span aria-hidden="true">→</span>
            </WaitlistTrigger>
            <div className="whitepaper-actions" id="whitepaper">
              <a
                className="whitepaper-cta"
                href="https://recruithq.notion.site/rEcruit-Whitepaper-v1-0-4d352d5b58ed82d2ab9c01468d2e5e6c"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Read whitepaper (opens in a new tab)"
              >
                Read Whitepaper <span aria-hidden="true">↗</span>
              </a>
              {/* <a
                className="whitepaper-download"
                href="/rEcruit-Whitepaper-v1.pdf"
                download="rEcruit-Whitepaper-v1.pdf"
              >
                Download PDF <span aria-hidden="true">↓</span>
              </a> */}
            </div>
          </div>
          <div className="waitlist-note">
            For experts who want to be among the first to join rEcruit.
          </div>
        </section>
      </Container>
      <div></div>
      <section
        id="expertise"
        data-testid="expertise-preview"
        className="product-faded py-17.5 max-nav:py-11"
        inert
        aria-hidden="true"
      >
        <Welcome />
        <Container>
          <div
            className="mb-7 flex items-end justify-between gap-6 max-nav:mb-4.5 max-nav:flex-col max-nav:items-start max-nav:gap-4.5"
            data-reveal=""
          >
            <div>
              <span className="inline-flex items-center gap-2.5 font-display text-xs leading-relaxed tracking-widest uppercase">
                PEOPLE BEHIND THE PROOF
              </span>
              <h2 className="my-3 text-4xl tracking-[-.05em] max-nav:text-3xl">
                Good work. Great company.
              </h2>
              <p className="text-base max-nav:text-sm">
                Discover expertise with a track record you can explore.
              </p>
            </div>
            <Link
              href="#early-access"
              className="inline-flex items-center gap-3 text-base font-semibold hover:text-brand motion-safe:[&_svg]:transition-transform motion-safe:hover:[&_svg]:translate-x-0.5"
            >
              Explore all expertise <Icon name="arrow" size={18} />
            </Link>
          </div>
          <div
            aria-label="Featured expertise categories"
            className="mb-7 flex gap-1.5 overflow-x-auto"
          >
            {["", ...categories].map((c) => (
              <button
                key={c}
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
                className="inline-flex items-center gap-2 border-b-2 border-transparent bg-transparent px-3.5 py-3.5 text-sm whitespace-nowrap first:pl-0 aria-pressed:border-brand aria-pressed:text-brand"
              >
                {c || "All expertise"}
                {c === category && (
                  <span className="rounded-control px-1.5 py-0.5 text-xs text-brand">
                    {experts.filter((e) => !c || e.category === c).length}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-5 nav:grid-cols-2 laptop:grid-cols-3">
            {selected.map((e) => (
              <PreviewExpertCard key={e.id} expert={e} />
            ))}
          </div>
        </Container>
      </section>
    
    </>
  );
}
