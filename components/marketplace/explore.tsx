"use client";
import { Suspense, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { categories, routeTo } from "@/lib/marketplace";
import { ExpertCard } from "./expert-card";
import { Icon } from "./icons";
import { Empty, Page, PageHeading } from "./page-layout";
import { useMarketplace } from "./provider";
import { useSavedExperts } from "./saved-experts";

export function Explore() {
  return (
    <Suspense
      fallback={
        <Page back>
          <PageHeading
            eyebrow="The expertise directory"
            title="Find Your Kind Of Expert."
          />
          <p className="mb-6 text-base leading-7" role="status">
            Loading the directory…
          </p>
        </Page>
      }
    >
      <ExploreDirectory />
    </Suspense>
  );
}

function subscribeToFilters(listener: () => void) {
  window.addEventListener("popstate", listener);
  window.addEventListener("recruit-filters-change", listener);
  return () => {
    window.removeEventListener("popstate", listener);
    window.removeEventListener("recruit-filters-change", listener);
  };
}

function ExploreDirectory() {
  const { experts } = useMarketplace();
  const routeParams = useSearchParams();
  // Native history changes are immediate; subscribe synchronously so controlled
  // inputs never revert while the router propagates its search-param context.
  const search = useSyncExternalStore(
    subscribeToFilters,
    () => window.location.search,
    () => (routeParams.size ? `?${routeParams}` : ""),
  );
  const params = new URLSearchParams(search);
  const { saved } = useSavedExperts();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const query = params.get("q") ?? "";
  const category = params.get("category") ?? "";
  const sort = params.get("sort") ?? "rep";
  const available = params.get("available") === "1";
  const verified = params.get("verified") === "1";
  const savedOnly = params.get("saved") === "1";
  const score = Number(params.get("score")) || 0;
  const rate = Math.max(0, Number(params.get("rate")) || 0);
  function filter(key: string, value: string) {
    const next = new URLSearchParams(window.location.search);
    if (value) next.set(key, value);
    else next.delete(key);
    window.history.replaceState(
      null,
      "",
      `${routeTo("explore")}${next.size ? `?${next}` : ""}`,
    );
    window.dispatchEvent(new Event("recruit-filters-change"));
  }
  function clear() {
    window.history.replaceState(null, "", routeTo("explore"));
    window.dispatchEvent(new Event("recruit-filters-change"));
  }
  const found = experts
    .filter(
      (e) =>
        (!category || e.category === category) &&
        (!available || e.availability === "Available for projects") &&
        (!verified || e.verified) &&
        (!savedOnly || saved.includes(e.id)) &&
        e.score >= score &&
        (!rate || e.rate <= rate) &&
        [e.alias, e.category, e.headline, e.about, ...e.skills]
          .join(" ")
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
    )
    .sort((a, b) =>
      sort === "low"
        ? a.rate - b.rate
        : sort === "high"
          ? b.rate - a.rate
          : sort === "projects"
            ? b.projects - a.projects
            : b.score - a.score,
    );
  const active = Boolean(
    query || category || available || verified || savedOnly || score || rate,
  );
  return (
    <Page back>
      <div className="flex items-center justify-between gap-7 max-laptop:flex-col max-laptop:items-start max-laptop:gap-0">
        <div>
          <PageHeading
            eyebrow="The expertise directory"
            title="Find Your Kind Of Expert."
          >
            Look beyond the pitch. Find the skills, work, and reputation to back
            it up.
          </PageHeading>
        </div>
        <Link
          href={routeTo("hire")}
          className="max-laptop:mb-6 inline-flex items-center gap-3 text-base font-semibold hover:text-brand motion-safe:[&_svg]:transition-transform motion-safe:hover:[&_svg]:translate-x-0.5"
        >
          Have a brief? Post an opportunity <Icon name="northeast" size={17} />
        </Link>
      </div>
      <div className="mt-3 flex items-center gap-3 rounded-control border border-border bg-surface px-4.5 py-2 max-nav:mt-0 max-nav:px-3">
        <Icon name="search" />
        <Input
          aria-label="Search experts"
          placeholder="Try a skill, service, or professional alias…"
          value={query}
          onChange={(e) => filter("q", e.target.value)}
          className="border-0 bg-transparent pl-0 min-w-0 flex-1"
        />
        <span className="pl-5 text-xs whitespace-nowrap max-nav:hidden">
          {experts.length} professionals to discover
        </span>
      </div>
      <Button
        aria-expanded={filtersOpen}
        aria-controls="expert-filter-panel"
        onClick={() => setFiltersOpen(!filtersOpen)}
        variant="secondary"
        className="mt-4 hidden max-nav:inline-flex"
      >
        <Icon name="sliders" size={17} />
        {filtersOpen ? "Hide filters" : "Refine your search"}
      </Button>
      <div className="mt-8 grid grid-cols-1 gap-6 nav:grid-cols-[170px_minmax(0,1fr)] tablet:grid-cols-[210px_minmax(0,1fr)] tablet:gap-7.5 max-nav:mt-4.5">
        <aside
          id="expert-filter-panel"
          aria-label="Expert filters"
          className={cn(
            `grid grid-cols-1 pr-6 max-nav:hidden max-nav:grid-cols-2 max-nav:gap-4 max-nav:pr-0 max-nav:pb-5${filtersOpen ? " max-nav:grid" : ""}`,
          )}
        >
          <div className="mb-6 flex items-center justify-between gap-2 max-nav:col-span-full max-nav:mb-0">
            <h2 className="flex items-center gap-2 text-sm">
              <Icon name="sliders" size={17} />
              Refine your search
            </h2>
            {active && (
              <button
                onClick={clear}
                className="min-h-10 min-w-10 bg-transparent p-1 text-xs text-brand"
              >
                Reset
              </button>
            )}
          </div>
          <div className="mb-6 max-nav:mb-0">
            <label
              htmlFor="category-filter"
              className="mb-2 block text-sm font-semibold"
            >
              Expertise
            </label>
            <Select
              id="category-filter"
              aria-label="Filter by category"
              value={category}
              onChange={(e) => filter("category", e.target.value)}
              className="px-2.5 py-2.5"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Select>
          </div>
          <div className="mb-6 max-nav:mb-0">
            <span className="mb-2 block text-sm font-semibold">
              Availability & trust
            </span>
            <label className="font-normal my-4 flex items-center gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={available}
                onChange={(e) =>
                  filter("available", e.target.checked ? "1" : "")
                }
              />
              Available for projects
            </label>
            <label className="font-normal my-4 flex items-center gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={verified}
                onChange={(e) =>
                  filter("verified", e.target.checked ? "1" : "")
                }
              />
              Verified samples only
            </label>
          </div>
          <div className="mb-6 max-nav:mb-0">
            <label
              htmlFor="score-filter"
              className="mb-2 block text-sm font-semibold"
            >
              Minimum reputation
            </label>
            <Select
              id="score-filter"
              value={score}
              onChange={(e) => filter("score", e.target.value)}
              className="px-2.5 py-2.5"
            >
              <option value="0">Any reputation</option>
              <option value="90">90 and above</option>
              <option value="95">95 and above</option>
            </Select>
          </div>
          <div className="mb-6 max-nav:mb-0">
            <label
              htmlFor="rate-filter"
              className="mb-2 block text-sm font-semibold"
            >
              Maximum hourly rate (USD)
            </label>
            <Input
              id="rate-filter"
              type="number"
              min="0"
              max="10000"
              placeholder="No maximum"
              value={rate || ""}
              onChange={(e) => filter("rate", e.target.value)}
              className="px-2.5 py-2.5"
            />
          </div>
          <div className="mt-7.5 pt-6 max-nav:hidden">
            <Icon name="shield" size={22} />
            <b className="block text-sm font-medium">
              A score is only the start.
            </b>
            <p className="my-2 text-sm leading-7">
              Explore vouches, refutes, and completed work to understand the
              whole record.
            </p>
            <Link
              href={routeTo("about")}
              className="inline-flex items-center gap-2 text-xs text-brand"
            >
              How reputation works <Icon name="arrow" size={14} />
            </Link>
          </div>
        </aside>
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-3 pb-3.5 max-phone:flex-wrap">
            <div className="flex gap-1">
              <button
                aria-pressed={!savedOnly}
                onClick={() => filter("saved", "")}
                className="inline-flex min-h-10 items-center gap-2 rounded-control px-3 py-2 text-sm aria-pressed:bg-brand aria-pressed:text-white"
              >
                All experts
              </button>
              <button
                aria-pressed={savedOnly}
                onClick={() => filter("saved", "1")}
                className="inline-flex min-h-10 items-center gap-2 rounded-control px-3 py-2 text-sm aria-pressed:bg-brand aria-pressed:text-white"
              >
                <Icon name="bookmark" size={15} />
                Saved{" "}
                <span className="text-xs">
                  {
                    saved.filter((id) => experts.some((e) => e.id === id))
                      .length
                  }
                </span>
              </button>
            </div>
            <select
              aria-label="Sort experts"
              value={sort}
              onChange={(e) => filter("sort", e.target.value)}
              className="min-h-11 max-w-48 bg-background py-2 text-base max-nav:max-w-44"
            >
              <option value="rep">Top reputation</option>
              <option value="projects">Most completed projects</option>
              <option value="low">Rate: low to high</option>
              <option value="high">Rate: high to low</option>
            </select>
          </div>
          {active && (
            <div
              aria-label="Active filters"
              className="flex flex-wrap gap-1.5 pt-4"
            >
              {[
                ["q", query ? `Search: ${query}` : ""],
                ["category", category],
                ["available", available ? "Available" : ""],
                ["verified", verified ? "Verified samples" : ""],
                ["score", score ? `Reputation ≥ ${score}` : ""],
                ["rate", rate ? `Up to $${rate}/hr` : ""],
              ]
                .filter(([, label]) => label)
                .map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => filter(key, "")}
                    aria-label={`Remove filter ${label}`}
                    className="flex min-h-10 max-w-full items-center gap-2 rounded-control border border-border px-2.5 py-2 text-left text-sm text-brand wrap-anywhere"
                  >
                    {label}
                    <Icon name="close" size={11} />
                  </button>
                ))}
            </div>
          )}
          <div className="my-4.5 flex justify-between gap-2.5 text-xs">
            <span role="status">
              {found.length} expert{found.length === 1 ? "" : "s"} found
              {category ? ` in ${category}` : ""}
            </span>
            <span>Sample directory</span>
          </div>
          <div className="grid grid-cols-1 gap-5 tablet:grid-cols-2">
            {found.length ? (
              found.map((e) => <ExpertCard key={e.id} expert={e} />)
            ) : (
              <Empty
                title={
                  savedOnly && !saved.length
                    ? "Your shortlist starts here"
                    : "No experts found"
                }
              >
                {savedOnly && !saved.length
                  ? "Save a professional using the bookmark on their profile card. Your shortlist stays on this device."
                  : "Try a broader skill, another category, or a different rate."}
                <Button onClick={clear} variant="secondary" size="small">
                  {savedOnly && !saved.length
                    ? "Discover experts"
                    : "Clear filters"}
                </Button>
              </Empty>
            )}
          </div>
        </div>
      </div>
    </Page>
  );
}
