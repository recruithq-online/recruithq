"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { fees, hiringRoutes, money, routeTo, type HiringRoute, type Opportunity } from "@/lib/marketplace";
import { RouteOptions, useMarketplace } from "./provider";
import { Empty, Field, Page, PageHeading, TextArea } from "./ui";
export function FeeBreakdown({
  budget,
  route
}: {
  budget: number;
  route: HiringRoute;
}) {
  const cost = fees(budget, route),
    company = route === "Hiring for company";
  return <p className="mp-note" aria-live="polite">{company ? "Agreement value" : "Agreed job price / worker receives"}: <b>{money(cost.cents)}</b>
    <br />rEcruit fee ({cost.rate}%, {company ? "billed separately to company" : "added to hirer checkout"}): <b>{money(cost.fee)}</b>
    <br />Estimated {company ? "company" : "hirer"} total: <b>{money(cost.total)}</b>
    <br />{company ? "Work and payment happen off-platform." : "Before any separately disclosed processing fee."} Demo only; no payment is collected.</p>;
}
export function OpportunityCard({
  job,
  children
}: {
  job: Opportunity;
  children?: React.ReactNode;
}) {
  return <article className="mp-panel">
    <span className="mp-badge">{job.status}</span> <span className="mp-muted">{job.type}</span>
    <h2 style={{
      marginTop: 12
    }}>{job.title}</h2>
    <p className="mp-intro">{job.description}</p>
    <div className="mp-muted">{job.duration} · Posted by {job.by}</div>
    <FeeBreakdown budget={job.budget} route={job.type} />{children}</article>;
}
export function Hire() {
  const {
    opportunities,
    setOpportunities,
    session,
    requireAccount,
    nextId,
    toast,
    jobChat
  } = useMarketplace();
  const [route, setRoute] = useState<HiringRoute>("Hiring for company"),
    [budget, setBudget] = useState(0),
    [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session) {
      setError("Sign in with the hirer test account to post. Your draft will stay here.");
      requireAccount(() => {});
      return;
    }
    if (session.role !== "hirer") {
      setError("Switch to the hirer test account to post opportunities.");
      return;
    }
    const data = new FormData(event.currentTarget),
      title = String(data.get("title")).trim(),
      description = String(data.get("description")).trim(),
      duration = String(data.get("duration")).trim();
    if (!title || !description || !duration || !Number.isFinite(budget) || budget < 0.01 || budget > 10000000 || !hiringRoutes.includes(route)) {
      setError("Complete every field and enter a value between $0.01 and $10,000,000.");
      return;
    }
    setOpportunities(current => [{
      id: nextId(),
      title,
      description,
      duration,
      budget: Math.round(budget * 100) / 100,
      type: route,
      by: session.alias,
      status: "Open",
      applicants: []
    }, ...current]);
    event.currentTarget.reset();
    setBudget(0);
    setRoute("Hiring for company");
    setError("");
    toast("Demo opportunity posted in this browser tab. It is not a live job listing.");
  }
  function apply(job: Opportunity) {
    if (!session) {
      requireAccount(() => {});
      return;
    }
    if (session.role !== "worker") {
      toast("Use the worker test account to apply.");
      return;
    }
    setOpportunities(current => current.map(o => o.id === job.id && o.status === "Open" && !o.applicants.includes(session.alias) ? {
      ...o,
      applicants: [...o.applicants, session.alias]
    } : o));
    toast("Demo application recorded locally. No application was sent.");
  }
  return <Page>
    <PageHeading eyebrow="Two ways to work" title="Hire for the work you need">Choose the right route. Company hiring happens off-platform after rEcruit connects both sides; personal hiring demonstrates task agreement, delivery, and payment on rEcruit.</PageHeading>
    <div className="mp-pathways" style={{
      maxWidth: "none",
      margin: "24px 0"
    }}>
      <div className="mp-panel">
        <div className="mp-icon">↗</div>
        <h2>Hiring for company</h2>
        <p className="mp-intro">For companies hiring community managers, moderators, community leads and others. Agree terms and manage work and payment outside rEcruit. The company pays a separate platform fee based on the contract value.</p>
        <span className="mp-badge">2.5% · Company pays rEcruit</span>
      </div>
      <div className="mp-panel">
        <div className="mp-icon">✓</div>
        <h2>Hiring for myself</h2>
        <p className="mp-intro">Hire someone for a specific task. Agree the task, give instructions, and review delivery. The platform fee is added to the agreed price so the worker receives the full amount. Payment is simulated in this MVP.</p>
        <span className="mp-badge">5% · Added to hirer checkout</span>
      </div>
    </div>
    <div className="mp-panel">
      <h2>Post an opportunity</h2>
      <p className="mp-intro">Preview the platform fee before posting. Live payment collection is not connected. Use the hirer test account to post; switch to the worker account to apply.</p>
      <form onSubmit={submit}>
        <div className="mp-formgrid">
          <div className="mp-group">
            <label htmlFor="hiring-type">Hiring type</label>
            <RouteOptions id="hiring-type" onChange={setRoute} />
          </div>
          <Field label="Role / job title" name="title" maxLength={80} placeholder="e.g. Community Moderator or Landing Page Design" />
          <TextArea label="Description and expected outcome" name="description" placeholder="Responsibilities or deliverables, requirements and success criteria…" />
          <div className="mp-group">
            <label htmlFor="hiring-budget">Agreed contract / job value (USD) *</label>
            <input id="hiring-budget" className="mp-field" name="budget" type="number" min="0.01" max="10000000" step="0.01" required placeholder="e.g. 300" onChange={e => setBudget(Number(e.target.value))} />
            <FeeBreakdown budget={budget} route={route} />
          </div>
          <Field label="Duration / deadline" name="duration" maxLength={60} placeholder="e.g. 3 months / due in 7 days" />
          <Field label="Hirer alias" name="by" required={false} readOnly value={session?.alias ?? ""} />
          <div className="mp-group">
            <button className="mp-btn mp-primary" style={{
              marginTop: "auto"
            }}>Post opportunity →</button>
          </div>
        </div>{error && <p role="alert" className="mp-error">{error}</p>}</form>
    </div>
    <div className="mp-stack">
      <h2>Open opportunities</h2>
      <div className="mp-grid">{opportunities.length ? opportunities.map(job => <OpportunityCard key={job.id} job={job}>
          <div className="mp-actions">
            <button className="mp-btn mp-secondary" onClick={() => jobChat(job)}>Message hirer</button>{job.status === "Open" && session?.role === "worker" && <button className="mp-btn mp-primary" disabled={job.applicants.includes(session.alias)} onClick={() => apply(job)}>{job.applicants.includes(session.alias) ? "Applied (demo)" : "Apply →"}</button>}</div>
        </OpportunityCard>) : <Empty title="No opportunities posted yet">Post a demo role or job using the form above.</Empty>}</div>
      <Link className="mp-btn mp-secondary" href={routeTo("work")}>Go to dashboard →</Link>
    </div>
  </Page>;
}
