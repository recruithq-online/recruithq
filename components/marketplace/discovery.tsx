"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { aliasKey, availabilityOptions, categories, routeTo, safePortfolio, type MarketplaceExpert } from "@/lib/marketplace";
import { useMarketplace } from "./provider";
import { Avatar, Empty, ExpertCard, Field, InfoList, Page, PageHeading, SignInPageHeading, Skills, TextArea, Verification } from "./ui";
export function MarketplaceHome() {
  const {
    experts
  } = useMarketplace();
  return <>
    <section className="mp-hero" id="top">
      <div className="mp-shell mp-center">
        <span className="mp-eyebrow">
          <span className="mp-dot" />Marketplace for reputation-based expertise</span>
        <h1>Hire people for<br />
          <span>what they can actually do.</span>
        </h1>
        <p className="mp-lead">Find reputable experts using work history and reviews from past hirers — not just a CV.</p>
        <div className="mp-pathways">
          <article className="mp-path">
            <div className="mp-icon" aria-hidden="true">⌕</div>
            <h2>Hire an Expertise</h2>
            <p>Find skilled people with proof of work, then choose how you want to hire.</p>
            <Link className="mp-btn mp-primary" href={routeTo("explore")}>Find experts →</Link>
          </article>
          <article className="mp-path">
            <div className="mp-icon" aria-hidden="true">↗</div>
            <h2>List Your Expertise</h2>
            <p>Build a reputation around your work. Show what you do and set your terms.</p>
            <Link className="mp-btn mp-secondary" href={routeTo("list")}>Create your profile →</Link>
          </article>
        </div>
        <div className="mp-proofstrip">{[["Skills first", "Discover people by what they can do"], ["Reputation matters", "Feedback adds context beyond a CV"], ["Built for real work", "Clear profiles, services, and rates"]].map(([title, text]) => <div className="mp-proof" key={title}>
            <b>{title}</b>
            <span>{text}</span>
          </div>)}</div>
        <p className="mp-note" style={{ marginTop: 16 }}>Alias-only profiles · reputation built from work, vouches and accountable feedback</p>
      </div>
    </section>
    <section className="mp-section">
      <div className="mp-shell">
        <div className="mp-sectionhead">
          <div>
            <h2>Expertise worth discovering</h2>
            <p>Sample profiles to demonstrate the rEcruit experience.</p>
          </div>
          <Link className="mp-btn mp-secondary" href={routeTo("explore")}>Explore all expertise →</Link>
        </div>
        <div className="mp-grid">{experts.filter(e => e.id <= 3).map(e => <ExpertCard key={e.id} expert={e} />)}</div>
      </div>
    </section>
  </>;
}
export function Explore() {
  const {
    experts
  } = useMarketplace();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("rep");
  const found = experts.filter(e => (!category || e.category === category) && [e.alias, e.category, e.headline, e.about, ...e.skills].join(" ").toLowerCase().includes(query.trim().toLowerCase())).sort((a, b) => sort === "low" ? a.rate - b.rate : sort === "high" ? b.rate - a.rate : b.score - a.score);
  return <Page>
    <SignInPageHeading eyebrow="Find your next expert" title="Hire an Expertise">Search by skill, category, or service. Compare expertise profiles and reputation signals before reaching out.</SignInPageHeading>
    <div className="mp-toolbar">
      <input className="mp-field mp-search" aria-label="Search experts" placeholder="Search skills, services, or expertise…" value={query} onChange={e => setQuery(e.target.value)} />
      <select className="mp-field" aria-label="Filter by category" value={category} onChange={e => setCategory(e.target.value)}>
        <option value="">All categories</option>{categories.map(c => <option key={c}>{c}</option>)}</select>
      <select className="mp-field" aria-label="Sort experts" value={sort} onChange={e => setSort(e.target.value)}>
        <option value="rep">Top reputation</option>
        <option value="low">Rate: low to high</option>
        <option value="high">Rate: high to low</option>
      </select>
    </div>
    <div className="mp-results">
      <span role="status">{found.length} expert{found.length === 1 ? "" : "s"} found</span>
      <span>Sample data · MVP</span>
    </div>
    <div className="mp-grid">{found.length ? found.map(e => <ExpertCard key={e.id} expert={e} />) : <Empty title="No experts found">Try another skill or category. <button className="mp-btn mp-secondary mp-small" onClick={() => {
          setQuery("");
          setCategory("");
        }}>Clear filters</button>
      </Empty>}</div>
  </Page>;
}
export function CreateProfile() {
  const {
    experts,
    setExperts,
    nextId,
    toast
  } = useMarketplace();
  const router = useRouter();
  const [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget),
      text = (name: string) => String(data.get(name) ?? "").trim();
    const alias = text("alias"),
      headline = text("headline"),
      about = text("about"),
      category = text("category"),
      availability = text("availability"),
      rate = Number(data.get("rate")),
      skills = [...new Set(text("skills").split(",").map(s => s.trim().slice(0, 30)).filter(Boolean))].slice(0, 10),
      portfolio = text("portfolio") ? safePortfolio(text("portfolio")) : "";
    if (!alias || !headline || !about || !skills.length) {
      setError("Complete every required field and add at least one skill.");
      return;
    }
    if (!categories.includes(category) || !availabilityOptions.includes(availability) || !Number.isFinite(rate) || rate < 0 || rate > 10000) {
      setError("Choose a valid category, availability, and rate between $0 and $10,000.");
      return;
    }
    if (text("portfolio") && !portfolio) {
      setError("Portfolio link must start with http:// or https://.");
      return;
    }
    if (experts.some(e => aliasKey(e.alias) === aliasKey(alias))) {
      setError("That alias is already taken. Choose another professional alias.");
      return;
    }
    const id = nextId();
    setExperts(current => [{
      id,
      alias,
      headline,
      about,
      category,
      availability,
      rate,
      skills,
      portfolio,
      score: 50,
      vouches: 0,
      refutes: 0,
      projects: 0,
      verified: false,
      feedback: []
    }, ...current]);
    router.push(routeTo(`profile/${id}`));
    toast("Demo profile added in this browser tab. It is not published to a live marketplace.");
  }
  return <Page>
    <SignInPageHeading eyebrow="Make your work visible" title="List Your Expertise">Create a profile that tells clients what you do, how you work, and what makes you worth hiring.</SignInPageHeading>
    <div className="mp-cols mp-stack">
      <div className="mp-panel">
        <h2>Create your expertise profile</h2>
        <p className="mp-intro">This interactive MVP stores your submitted profile in the current browser tab. Refreshing resets demo data.</p>
        <form onSubmit={submit}>
          <div className="mp-formgrid">
            <Field label="Professional alias" name="alias" maxLength={32} placeholder="e.g. PixelNorth" />
            <div className="mp-group">
              <label htmlFor="profile-category">Main category *</label>
              <select id="profile-category" className="mp-field" name="category" required defaultValue="">
                <option value="">Choose category</option>{categories.map(c => <option key={c}>{c}</option>)}</select>
            </div>
            <Field label="What do you help people do?" name="headline" maxLength={90} full placeholder="e.g. I help early-stage teams build clear product experiences" />
            <Field label="Skills (comma-separated)" name="skills" maxLength={200} full placeholder="e.g. UI/UX, Figma, prototyping" />
            <Field label="Starting rate (USD/hour)" name="rate" type="number" min={0} max={10000} placeholder="e.g. 25" />
            <div className="mp-group">
              <label htmlFor="profile-availability">Availability</label>
              <select id="profile-availability" className="mp-field" name="availability">{availabilityOptions.map(a => <option key={a}>{a}</option>)}</select>
            </div>
            <TextArea label="About your expertise" name="about" maxLength={500} placeholder="Describe your approach, experience, and the work you do best…" />
            <Field label="Portfolio or work link (optional)" name="portfolio" type="url" required={false} maxLength={200} full placeholder="https://" />
          </div>
          <p className="mp-note">Use a professional alias. Do not enter private contact details or sensitive personal information.</p>{error && <p className="mp-error" role="alert">{error}</p>}<button className="mp-btn mp-primary mp-fullbutton">Publish demo profile →</button>
        </form>
      </div>
      <aside className="mp-panel">
        <h2>A profile built around reputation</h2>
        <p className="mp-intro">Help a client understand what you can deliver and why others recommend working with you.</p>
        <InfoList />
        <div className="mp-feedback">
          <b>Production next step</b>
          <p>Account verification, profile management, enquiries, and persistent reputation data need backend integration.</p>
        </div>
      </aside>
    </div>
  </Page>;
}
export function Profile({
  id
}: {
  id: number;
}) {
  const {
    experts,
    contact,
    setDialog
  } = useMarketplace();
  const expert = experts.find(e => e.id === id);
  if (!expert) return <Page>
    <Empty title="Profile unavailable">This demo profile may have been reset by a refresh. <Link href={routeTo("explore")}>Browse sample experts →</Link>
    </Empty>
  </Page>;
  const e: MarketplaceExpert = expert;
  return <Page>
    <Link className="mp-btn mp-ghost mp-small" style={{
      marginBottom: 17
    }} href={routeTo("explore")}>← Back to explore</Link>
    <div className="mp-profilelayout">
      <div className="mp-panel">
        <div className="mp-profilehero">
          <Avatar alias={e.alias} />
          <div>
            <h1>{e.alias}</h1>
            <p className="mp-muted">{e.category} · {e.availability}</p>
            <Verification expert={e} />
          </div>
        </div>
        <h2>{e.headline}</h2>
        <p className="mp-subtext">{e.about}</p>{e.portfolio && safePortfolio(e.portfolio) && <p>
          <a className="mp-btn mp-secondary mp-small" href={safePortfolio(e.portfolio)} target="_blank" rel="noopener noreferrer nofollow ugc">View portfolio ↗</a>
        </p>}<div className="mp-profilesection">
          <h3>Skills & expertise</h3>
          <Skills skills={e.skills} />
        </div>
        <div className="mp-profilesection">
          <h3>Reputation feedback</h3>{e.feedback.length ? e.feedback.map((f, i) => <div className="mp-feedback" key={i}>
            <div className="mp-feedbacktop">
              <span className={f.type === "vouch" ? "mp-green" : "mp-red"}>{f.type === "vouch" ? "✓ Vouched" : "⚑ Refuted"}</span>
              <span className="mp-muted">{f.by}</span>
            </div>
            <p>{f.text}</p>
          </div>) : <p className="mp-subtext">No feedback yet.</p>}<div className="mp-feedbackactions">
            <button className="mp-btn mp-vouch" onClick={() => setDialog({
              type: "feedback",
              expertId: e.id,
              kind: "vouch"
            })}>✓ Vouch</button>
            <button className="mp-btn mp-refute" onClick={() => setDialog({
              type: "feedback",
              expertId: e.id,
              kind: "refute"
            })}>⚑ Refute</button>
          </div>
          <p className="mp-note">New profiles start at 50/100. Attach proof to every Vouch or Refute. Only approved evidence changes reputation in this demo.</p>
        </div>
      </div>
      <aside>
        <div className="mp-panel">
          <div className="mp-muted">Starting rate</div>
          <div className="mp-score" style={{
            fontSize: 32
          }}>${e.rate}<small> / hour</small>
          </div>
          <p className="mp-note">Sample rate; final terms can be agreed with the expert.</p>
          <div className="mp-rep">
            <div>
              <div className="mp-score" data-testid="profile-score">{e.score}<small>/100</small>
              </div>
              <div className="mp-muted">Reputation</div>
            </div>
            <div>
              <div className="mp-score">{e.vouches}</div>
              <div className="mp-muted">Vouches</div>
            </div>
          </div>
          <div className="mp-infolist">
            <div className="mp-inforow">
              <div className="mp-check">✓</div>
              <div>
                <strong>{e.projects} completed projects</strong>
                <span>Sample profile metric</span>
              </div>
            </div>
            <div className="mp-inforow">
              <div className="mp-check">◎</div>
              <div>
                <strong>{e.availability}</strong>
                <span>Availability provided by expert</span>
              </div>
            </div>
          </div>
          <button className="mp-btn mp-primary mp-fullbutton" onClick={() => contact(e.id)}>Contact / hire this expert →</button>
        </div>
        <div className="mp-panel" style={{
          marginTop: 14
        }}>
          <h2>Reputation, with context</h2>
          <p className="mp-intro">Feedback should explain the work relationship and include enough context to be useful and fair.</p>
        </div>
      </aside>
    </div>
  </Page>;
}
export function About() {
  return <Page>
    <PageHeading eyebrow="How rEcruit works" title="Beyond CVs. Built on Reputation.">rEcruit helps people find and hire expertise with more context than a CV alone. This MVP demonstrates the key journeys using local sample data.</PageHeading>
    <div className="mp-grid mp-stack">{[["⌕", "1. Discover", "Search by category, skills, availability, and starting rate."], ["◎", "2. Evaluate", "Review profiles, portfolio links, feedback, and reputation signals."], ["↗", "3. Connect", "Start a demo hiring conversation and explore the work lifecycle."]].map(([icon, title, text]) => <article className="mp-panel" key={title}>
        <div className="mp-icon">{icon}</div>
        <h2>{title}</h2>
        <p className="mp-intro">{text}</p>
      </article>)}</div>
    <div className="mp-panel mp-stack">
      <h2>Included in this MVP</h2>
      <p className="mp-intro">Expert discovery, two hiring routes, opportunity posting, local messages, profile creation, evidence review, work delivery, and simulated payments. Production needs secure accounts, storage, messaging, payments, and reviewer permissions.</p>
      <Link className="mp-btn mp-secondary" href={routeTo("explore")}>Find your next expert →</Link>
    </div>
  </Page>;
}
