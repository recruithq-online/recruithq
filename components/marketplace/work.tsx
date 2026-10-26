"use client";

import Link from "next/link";
import { type FormEvent } from "react";
import { fees, money, routeTo, type Opportunity } from "@/lib/marketplace";
import { DemoGate, useMarketplace } from "./provider";
import { Empty, Field, Page, PageHeading } from "./ui";
import { OpportunityCard } from "./hiring";
export function Work() {
  return <Page>
    <PageHeading eyebrow="Your workspace" title="Dashboard">Your jobs, conversations, and simulated payments.</PageHeading>
    <div className="mp-stack">
      <DemoGate>
        <Dashboard />
      </DemoGate>
    </div>
  </Page>;
}
function Dashboard() {
  const {
    session,
    opportunities,
    wallets,
    setOpportunities,
    toast,
    jobChat
  } = useMarketplace();
  if (!session) return null;
  const me = session.alias,
    hirer = session.role === "hirer",
    mine = opportunities.filter(o => hirer ? o.by === me : o.worker === me),
    applied = opportunities.filter(o => o.status === "Open" && o.applicants.includes(me)),
    open = opportunities.filter(o => o.status === "Open" && !o.applicants.includes(me));
  function patch(job: Opportunity, change: Partial<Opportunity>) {
    setOpportunities(current => current.map(o => o.id === job.id ? {
      ...o,
      ...change
    } : o));
  }
  function accept(job: Opportunity, alias: string) {
    if (session?.role !== "hirer" || job.by !== me || job.status !== "Open" || !job.applicants.includes(alias)) return;
    patch(job, {
      worker: alias,
      status: "In progress"
    });
    toast(`Demo: ${alias} accepted. Work is in progress.`);
  }
  function deliver(event: FormEvent<HTMLFormElement>, job: Opportunity) {
    event.preventDefault();
    if (session?.role !== "worker" || job.worker !== me || job.status !== "In progress") return;
    const note = String(new FormData(event.currentTarget).get("note")).trim();
    if (!note) {
      toast("Add a delivery note or link.");
      return;
    }
    patch(job, {
      delivery: note,
      status: "Delivered"
    });
    toast("Demo delivery recorded. Waiting for hirer review.");
  }
  function review(job: Opportunity, approve: boolean) {
    if (session?.role !== "hirer" || job.by !== me || job.status !== "Delivered") return;
    if (!approve) {
      patch(job, {
        status: "In progress"
      });
      toast("Demo: changes requested.");
      return;
    }
    if (job.type === "Hiring for myself") {
      if (!job.worker || !wallets[job.worker]) {
        toast("The worker must add a demo payout wallet in Settings first.");
        return;
      }
      if (!wallets[me]) {
        toast("Add a demo funding wallet in Settings first.");
        return;
      }
    }
    patch(job, {
      status: "Completed"
    });
    toast(job.type === "Hiring for myself" ? `Simulated payment: ${money(fees(job.budget, job.type).total)} total. No money moved.` : "Demo work marked complete. Company payment remains off-platform.");
  }
  function apply(job: Opportunity) {
    if (session?.role !== "worker" || job.status !== "Open" || job.applicants.includes(me)) return;
    patch(job, {
      applicants: [...job.applicants, me]
    });
    toast("Demo application recorded locally.");
  }
  const completed = mine.filter(o => o.status === "Completed"),
    active = mine.filter(o => ["In progress", "Delivered"].includes(o.status));
  const earned = completed.filter(o => o.type === "Hiring for myself").reduce((total, o) => total + Math.round(o.budget * 100), 0);
  return <>
    <div className="mp-panel">
      <h2>{hirer ? "Hirer" : "Worker"} dashboard</h2>
      <p className="mp-intro">Signed in as <b>{me}</b>. {hirer ? "Post jobs, review applicants, and track delivery." : "Find jobs, deliver work, and explore simulated payouts."}</p>
      <div className="mp-actions">
        <Link className="mp-btn mp-primary" href={routeTo(hirer ? "hire" : "list")}>{hirer ? "Post a job →" : "My expertise profile →"}</Link>
        <Link className="mp-btn mp-secondary" href={routeTo("messages")}>Messages</Link>
        <Link className="mp-btn mp-secondary" href={routeTo("settings")}>Settings</Link>
      </div>
    </div>{!hirer && !wallets[me] && <div className="mp-panel">
      <h2>Add a payout wallet</h2>
      <p className="mp-intro">Use a sample address to try the payment simulation.</p>
      <Link className="mp-btn mp-secondary" href={routeTo("settings")}>Add demo wallet →</Link>
    </div>}<div className="mp-grid">{[[hirer ? mine.filter(o => o.status === "Open").length : money(earned), hirer ? "Open jobs" : "Simulated earnings"], [active.length, "Active jobs"], [hirer ? completed.length : open.length, hirer ? "Completed" : "Open jobs to apply for"]].map(([value, label]) => <div className="mp-panel" key={label}>
        <div className="mp-score">{value}</div>
        <div className="mp-muted">{label}</div>
      </div>)}</div>
    <h2>{hirer ? "My jobs" : "My work"}</h2>{mine.length ? mine.map(job => <OpportunityCard key={job.id} job={job}>{hirer ? <>{job.status === "Open" && (job.applicants.length ? job.applicants.map(alias => <div className="mp-feedback" key={alias}>
          <div className="mp-feedbacktop">
            <b>{alias}</b>
            <div className="mp-actions">
              <button className="mp-btn mp-secondary mp-small" onClick={() => jobChat(job, alias)}>Message</button>
              <button className="mp-btn mp-primary mp-small" onClick={() => accept(job, alias)}>Accept</button>
            </div>
          </div>
        </div>) : <p className="mp-note">No applicants yet. Switch to the worker demo account to apply.</p>)}{job.status === "In progress" && <p className="mp-note">In progress with <b>{job.worker}</b>. Waiting for delivery.</p>}{job.status === "Delivered" && <>
          <div className="mp-feedback">
            <div className="mp-muted">Delivery from {job.worker}</div>
            <p>{job.delivery}</p>
          </div>
          <div className="mp-actions" style={{
            marginTop: 14
          }}>
            <button className="mp-btn mp-primary" onClick={() => review(job, true)}>{job.type === "Hiring for myself" ? `Simulate approval & pay ${money(fees(job.budget, job.type).total)}` : "Mark complete (demo)"}</button>
            <button className="mp-btn mp-secondary" onClick={() => review(job, false)}>Request changes</button>
          </div>
        </>}</> : <>{job.status === "In progress" && <form onSubmit={e => deliver(e, job)}>
          <Field name="note" label="Delivery note or link" maxLength={300} placeholder="What you delivered" />
          <button className="mp-btn mp-primary mp-fullbutton">Mark delivered (demo)</button>
        </form>}{job.status === "Delivered" && <p className="mp-note">Delivered. Waiting for the hirer to approve.</p>}</>}{job.status === "Completed" && <p className="mp-note">Completed with {hirer ? job.worker : job.by}. {job.type === "Hiring for myself" ? `Simulated worker payment: ${money(Math.round(job.budget * 100))}. No funds transferred.` : "Payment is handled off-platform; platform billing is not connected."}</p>}{job.worker && <button className="mp-btn mp-secondary mp-small" onClick={() => jobChat(job)}>Message {hirer ? "worker" : "hirer"}</button>}</OpportunityCard>) : <Empty title={hirer ? "No jobs yet" : "No active work"}>{hirer ? "Post a job to start receiving demo applicants." : "Apply for a job below; the hirer accepts you to start."}</Empty>}{!hirer && <>{applied.length > 0 && <>
        <h2>Applied</h2>{applied.map(job => <OpportunityCard key={job.id} job={job}>
          <p className="mp-note">Applied. Waiting for the hirer to accept.</p>
        </OpportunityCard>)}</>}<h2>Open jobs</h2>{open.length ? open.map(job => <OpportunityCard key={job.id} job={job}>
        <div className="mp-actions">
          <button className="mp-btn mp-secondary" onClick={() => jobChat(job)}>Message hirer</button>
          <button className="mp-btn mp-primary" onClick={() => apply(job)}>Apply →</button>
        </div>
      </OpportunityCard>) : <Empty title="No open jobs">Jobs posted by hirers appear here.</Empty>}</>}</>;
}
