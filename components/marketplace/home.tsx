"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { categories, routeTo } from "@/lib/marketplace";
import { ExpertCard } from "./expert-card";
import { Icon } from "./icons";
import { ProfessionalRecord } from "./professional-record";
import { useMarketplace } from "./provider";

export function MarketplaceHome() {
  const { experts } = useMarketplace();
  const [category, setCategory] = useState("");
  const router = useRouter();
  const featured = experts.find((e) => e.id === 1) ?? experts[0];
  const selected = experts
    .filter((e) => !category || e.category === category)
    .slice(0, 3);
  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = String(
      new FormData(event.currentTarget).get("q") ?? "",
    ).trim();
    router.push(
      `${routeTo("explore")}${query ? `?q=${encodeURIComponent(query)}` : ""}`,
    );
  }
  return (
    <>
      <section
        id="top"
        className="relative pt-16 pb-14.5 max-nav:pt-9.5 max-nav:pb-9 wide:py-21"
        data-testid="home-hero"
      >
        <Container className="grid grid-cols-1 items-center gap-9 nav:grid-cols-[1.05fr_1fr] nav:gap-7 tablet:gap-10 laptop:gap-17.5">
          <div className="py-1">
            <div className="motion-safe:animate-hero-kicker inline-flex items-start gap-2.5 font-display text-xs leading-relaxed tracking-widest uppercase">
              <span className="size-1.5 bg-brand" />
              THE REPUTATION-FIRST EXPERTISE MARKETPLACE
            </div>
            <h1 className="my-6 text-[clamp(60px,6.15vw,82px)] leading-[1.01] font-medium tracking-[-.065em] max-laptop:text-[68px] max-tablet:text-[58px] max-nav:text-[clamp(59px,12vw,80px)] max-phone:text-[50px]">
              <span
                className="-mb-[.15em] block overflow-clip pb-[.15em]"
                data-hero-line=""
              >
                <span className="block motion-safe:animate-headline">
                  Beyond CVs.
                </span>
              </span>
              <span
                className="-mb-[.15em] block overflow-clip pb-[.15em]"
                data-hero-line=""
              >
                <span className="block motion-safe:animate-headline [animation-delay:.12s]">
                  Built on
                </span>
              </span>
              <span
                className="-mb-[.15em] block overflow-clip pb-[.15em]"
                data-hero-line=""
              >
                <em className="font-display font-normal text-brand italic block motion-safe:animate-headline [animation-delay:.23s]">
                  Reputation.
                </em>
              </span>
            </h1>
            <p className="mb-3 text-[17px] leading-normal tracking-tight motion-safe:animate-hero-lead">
              A great CV tells a story.
              <br />
              Great work gives you the proof.
            </p>
            <p className="mb-6.5 max-w-95 text-base leading-7 motion-safe:animate-hero-description">
              Meet independent experts through the work they’ve delivered and
              the people who stand behind it.
            </p>
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
                <span className="max-tablet:hidden max-nav:inline max-phone:hidden">
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
                  href={`${routeTo("explore")}?q=${encodeURIComponent(skill)}`}
                >
                  {skill}
                  <Icon name="northeast" size={12} />
                </Link>
              ))}
            </div>
            <div className="mt-7.5 text-sm motion-safe:animate-hero-detail">
              Good at what you do?{" "}
              <Link
                href={routeTo("list")}
                className="ml-1 inline-flex items-center gap-1.5 font-semibold"
              >
                Let your work speak <Icon name="arrow" size={15} />
              </Link>
            </div>
          </div>
          {featured && <ProfessionalRecord expert={featured} />}
        </Container>
      </section>
      <div>
        <Container className="grid grid-cols-1 nav:grid-cols-3">
          {[
            ["01", "Work you can see", "Demonstrated expertise"],
            ["02", "People who can vouch", "Context from collaborators"],
            ["03", "Claims you can question", "Accountable feedback"],
          ].map(([n, title, detail]) => (
            <div
              key={n}
              data-reveal=""
              className="flex items-center gap-4 py-6"
            >
              <span className="font-display text-xs text-brand">{n}</span>
              <div>
                <strong className="block text-sm font-medium">{title}</strong>
                <small className="text-xs">{detail}</small>
              </div>
              <Icon
                name="northeast"
                size={18}
                className="ml-auto mr-4 shrink-0"
              />
            </div>
          ))}
        </Container>
      </div>
      <section id="expertise" className="py-17.5 max-nav:py-11">
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
              href={routeTo("explore")}
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
              <ExpertCard key={e.id} expert={e} reveal />
            ))}
          </div>
          <div className="mt-5.5 flex items-center justify-center gap-2 text-xs max-nav:items-start">
            <Icon name="document" size={14} />
            Explore with sample professionals. Profiles and reputation signals
            are illustrative.
          </div>
        </Container>
      </section>
      <section
        className=" py-21 text-black max-nav:py-11"
        data-testid="trust-section"
      >
        <Container
          className="grid grid-cols-1 gap-9 nav:grid-cols-2 tablet:gap-12.5 laptop:gap-21"
          data-testid="trust-content"
        >
          <div data-reveal="">
            <span className="inline-flex items-center gap-2.5 font-display text-xs leading-relaxed tracking-widest uppercase">
              TRUST IS A RECORD. NOT A CLAIM.
            </span>
            <h2 className="my-4.5 text-[40px] tracking-[-.05em] max-tablet:text-[34px]">
              A reputation should
              <br />
              stand up to{" "}
              <em className="font-display font-normal text-brand">
                scrutiny.
              </em>
            </h2>
            <p className="mb-6 max-w-95 text-base leading-7">
              A score is the starting point. The work, the feedback, and the
              context behind it are what help you make a confident decision.
            </p>
            <Link
              href={routeTo("about")}
              className="inline-flex items-center gap-3 text-base font-semibold hover:text-brand motion-safe:[&_svg]:transition-transform motion-safe:hover:[&_svg]:translate-x-0.5"
            >
              Understand the rEcruit approach <Icon name="arrow" size={18} />
            </Link>
          </div>
          <div data-reveal="">
            {[
              [
                "document",
                "Proof of work",
                "See expertise in context through completed projects and professional work.",
              ],
              [
                "check",
                "Vouches with substance",
                "Recommendations from people who can speak to the work and the working relationship.",
              ],
              [
                "flag",
                "Room for accountability",
                "Refutes challenge inaccurate claims. Evidence is reviewed before it affects reputation.",
              ],
            ].map(([icon, title, copy], index) => (
              <div
                key={title}
                data-reveal=""
                className="flex items-start gap-5 py-6 first:pt-0 last:pb-0"
              >
                <span className="pt-1 font-display text-xs">0{index + 1}</span>
                <div>
                  <h3 className="mb-2 text-base">{title}</h3>
                  <p className="max-w-95 m-0 text-sm leading-7">{copy}</p>
                </div>
                <Icon
                  name={icon as "document" | "check" | "flag"}
                  size={22}
                  className="ml-2.5 shrink-0"
                />
              </div>
            ))}
          </div>
        </Container>
      </section>
      <section className="py-15 max-nav:py-11">
        <Container className="flex items-center justify-between gap-10 max-nav:flex-col max-nav:items-start max-nav:gap-7">
          <div>
            <span className="inline-flex items-center gap-2.5 font-display text-xs leading-relaxed tracking-widest uppercase">
              YOUR NEXT CHAPTER STARTS WITH YOUR WORK
            </span>
            <h2 className="mt-4 text-[38px] tracking-[-.05em] max-nav:text-[32px]">
              Let your reputation
              <br />
              open the right doors.
            </h2>
          </div>
          <div>
            <Link href={routeTo("list")} className={buttonStyles({})}>
              List your expertise{" "}
              <Icon
                name="northeast"
                size={18}
                className="ml-auto mr-4 shrink-0"
              />
            </Link>
            <p className="mt-3 text-xs">
              Your alias. Your expertise. Your professional record.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
