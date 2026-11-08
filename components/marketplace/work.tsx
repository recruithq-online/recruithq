"use client";
import { type FormEvent } from "react";
import Link from "next/link";
import { Button, buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/form-field";
import { fees, money, routeTo, type Opportunity } from "@/lib/marketplace";
import { AccountGate } from "./account-gate";
import { OpportunityCard } from "./opportunity-card";
import { Empty, Page, WorkspacePageHeading } from "./page-layout";
import { useMarketplace } from "./provider";

export function Work() {
  return (
    <Page>
      <WorkspacePageHeading eyebrow="Your workspace" title="Dashboard">
        Your jobs, conversations, and simulated payments.
      </WorkspacePageHeading>
      <div className="mt-7 grid gap-6">
        <AccountGate>
          <Dashboard />
        </AccountGate>
      </div>
    </Page>
  );
}

function Dashboard() {
  const { session, opportunities, wallets, setOpportunities, toast, jobChat } =
    useMarketplace();
  if (!session) return null;
  const me = session.alias,
    hirer = session.role === "hirer",
    mine = opportunities.filter((o) => (hirer ? o.by === me : o.expect === me)),
    applied = opportunities.filter(
      (o) => o.status === "Open" && o.applicants.includes(me),
    ),
    open = opportunities.filter(
      (o) => o.status === "Open" && !o.applicants.includes(me),
    );
  function patch(job: Opportunity, change: Partial<Opportunity>) {
    setOpportunities((current) =>
      current.map((o) =>
        o.id === job.id
          ? {
              ...o,
              ...change,
            }
          : o,
      ),
    );
  }
  function accept(job: Opportunity, alias: string) {
    if (
      session?.role !== "hirer" ||
      job.by !== me ||
      job.status !== "Open" ||
      !job.applicants.includes(alias)
    )
      return;
    patch(job, {
      expect: alias,
      status: "In progress",
    });
    toast(`${alias} accepted. Work is in progress.`);
  }
  function deliver(event: FormEvent<HTMLFormElement>, job: Opportunity) {
    event.preventDefault();
    if (
      session?.role !== "expert" ||
      job.expect !== me ||
      job.status !== "In progress"
    )
      return;
    const note = String(new FormData(event.currentTarget).get("note")).trim();
    if (!note) {
      toast("Add a delivery note or link.");
      return;
    }
    patch(job, {
      delivery: note,
      status: "Delivered",
    });
    toast("Delivery recorded. Waiting for hirer review.");
  }
  function review(job: Opportunity, approve: boolean) {
    if (
      session?.role !== "hirer" ||
      job.by !== me ||
      job.status !== "Delivered"
    )
      return;
    if (!approve) {
      patch(job, {
        status: "In progress",
      });
      toast("Changes requested.");
      return;
    }
    if (job.type === "Hiring for myself") {
      if (!job.expect || !wallets[job.expect]) {
        toast("The expect must add a payout wallet in Settings first.");
        return;
      }
      if (!wallets[me]) {
        toast("Add a funding wallet in Settings first.");
        return;
      }
    }
    patch(job, {
      status: "Completed",
    });
    toast(
      job.type === "Hiring for myself"
        ? `Simulated payment: ${money(fees(job.budget, job.type).total)} total. No money moved.`
        : "Work marked complete. Company payment remains off-platform.",
    );
  }
  function apply(job: Opportunity) {
    if (
      session?.role !== "expert" ||
      job.status !== "Open" ||
      job.applicants.includes(me)
    )
      return;
    patch(job, {
      applicants: [...job.applicants, me],
    });
    toast("Application recorded locally.");
  }
  const completed = mine.filter((o) => o.status === "Completed"),
    active = mine.filter((o) =>
      ["In progress", "Delivered"].includes(o.status),
    );
  const earned = completed
    .filter((o) => o.type === "Hiring for myself")
    .reduce((total, o) => total + Math.round(o.budget * 100), 0);
  return (
    <>
      <Card>
        <h2 className="mb-3 text-xl tracking-tight">
          {hirer ? "Hirer" : "Professional"} dashboard
        </h2>
        <p className="mb-6 max-w-2xl text-base leading-7">
          Signed in as <b>{me}</b>.{" "}
          {hirer
            ? "Post jobs, review applicants, and track delivery."
            : "Find jobs, deliver work, and explore simulated payouts."}
        </p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          <Link
            href={routeTo(hirer ? "hire" : "list")}
            className={buttonStyles({})}
          >
            {hirer ? "Post a job →" : "List expertise →"}
          </Link>
          <Link
            href={routeTo("messages")}
            className={buttonStyles({
              variant: "secondary",
            })}
          >
            Messages
          </Link>
          <Link
            href={routeTo("settings")}
            className={buttonStyles({
              variant: "secondary",
            })}
          >
            Settings
          </Link>
        </div>
      </Card>
      {!hirer && !wallets[me] && (
        <Card>
          <h2 className="mb-3 text-xl tracking-tight">Add a payout wallet</h2>
          <p className="mb-6 max-w-2xl text-base leading-7">
            Use a sample address to try the payment simulation.
          </p>
          <Link
            href={routeTo("settings")}
            className={buttonStyles({
              variant: "secondary",
            })}
          >
            Add wallet →
          </Link>
        </Card>
      )}
      <div className="grid grid-cols-1 gap-5 nav:grid-cols-2 laptop:grid-cols-3">
        {[
          [
            hirer
              ? mine.filter((o) => o.status === "Open").length
              : money(earned),
            hirer ? "Open jobs" : "Simulated earnings",
          ],
          [active.length, "Active jobs"],
          [
            hirer ? completed.length : open.length,
            hirer ? "Completed" : "Open jobs to apply for",
          ],
        ].map(([value, label]) => (
          <Card key={label}>
            <div className="text-[32px] leading-tight font-medium tracking-[-.05em]">
              {value}
            </div>
            <div className="text-sm">{label}</div>
          </Card>
        ))}
      </div>
      <h2>{hirer ? "My jobs" : "My work"}</h2>
      {mine.length ? (
        mine.map((job) => (
          <OpportunityCard key={job.id} job={job}>
            {hirer ? (
              <>
                {job.status === "Open" &&
                  (job.applicants.length ? (
                    job.applicants.map((alias) => (
                      <Card
                        key={alias}
                        className="mt-3 p-4"
                        data-testid="feedback-entry"
                      >
                        <div className="flex items-center justify-between gap-3 text-sm max-phone:flex-wrap">
                          <b>{alias}</b>
                          <div className="mt-4 flex flex-wrap gap-2.5">
                            <Button
                              onClick={() => jobChat(job, alias)}
                              variant="secondary"
                              size="small"
                            >
                              Message
                            </Button>
                            <Button
                              onClick={() => accept(job, alias)}
                              size="small"
                            >
                              Accept
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <p className="my-3.5 text-sm leading-7">
                      No applicants yet. A professional can apply for this job.
                    </p>
                  ))}
                {job.status === "In progress" && (
                  <p className="my-3.5 text-sm leading-7">
                    In progress with <b>{job.expect}</b>. Waiting for delivery.
                  </p>
                )}
                {job.status === "Delivered" && (
                  <>
                    <Card className="mt-3 p-4" data-testid="feedback-entry">
                      <div className="text-sm">Delivery from {job.expect}</div>
                      <p className="mt-2.5 text-sm leading-7 wrap-anywhere whitespace-pre-wrap">
                        {job.delivery}
                      </p>
                    </Card>
                    <div className="mt-4 flex flex-wrap gap-2.5">
                      <Button onClick={() => review(job, true)}>
                        {job.type === "Hiring for myself"
                          ? `Simulate approval & pay ${money(fees(job.budget, job.type).total)}`
                          : "Mark complete"}
                      </Button>
                      <Button
                        onClick={() => review(job, false)}
                        variant="secondary"
                      >
                        Request changes
                      </Button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                {job.status === "In progress" && (
                  <form onSubmit={(e) => deliver(e, job)}>
                    <Field
                      name="note"
                      label="Delivery note or link"
                      maxLength={300}
                      placeholder="What you delivered"
                    />
                    <Button className="mt-5 w-full">Mark delivered</Button>
                  </form>
                )}
                {job.status === "Delivered" && (
                  <p className="my-3.5 text-sm leading-7">
                    Delivered. Waiting for the hirer to approve.
                  </p>
                )}
              </>
            )}
            {job.status === "Completed" && (
              <p className="my-3.5 text-sm leading-7">
                Completed with {hirer ? job.expect : job.by}.{" "}
                {job.type === "Hiring for myself"
                  ? `Simulated expect payment: ${money(Math.round(job.budget * 100))}. No funds transferred.`
                  : "Payment is handled off-platform; platform billing is not connected."}
              </p>
            )}
            {job.expect && (
              <Button
                onClick={() => jobChat(job)}
                variant="secondary"
                size="small"
              >
                Message {hirer ? "expert" : "hirer"}
              </Button>
            )}{" "}
          </OpportunityCard>
        ))
      ) : (
        <Empty title={hirer ? "No jobs yet" : "No active work"}>
          {hirer
            ? "Post a job to start receiving applications."
            : "Apply for a job below; the hirer accepts you to start."}
        </Empty>
      )}
      {!hirer && (
        <>
          {applied.length > 0 && (
            <>
              <h2>Applied</h2>
              {applied.map((job) => (
                <OpportunityCard key={job.id} job={job}>
                  <p className="my-3.5 text-sm leading-7">
                    Applied. Waiting for the hirer to accept.
                  </p>
                </OpportunityCard>
              ))}
            </>
          )}
          <h2>Open jobs</h2>
          {open.length ? (
            open.map((job) => (
              <OpportunityCard key={job.id} job={job}>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  <Button onClick={() => jobChat(job)} variant="secondary">
                    Message hirer
                  </Button>
                  <Button onClick={() => apply(job)}>Apply →</Button>
                </div>
              </OpportunityCard>
            ))
          ) : (
            <Empty title="No open jobs">
              Jobs posted by hirers appear here.
            </Empty>
          )}
        </>
      )}
    </>
  );
}
