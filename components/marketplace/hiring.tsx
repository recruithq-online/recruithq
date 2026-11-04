"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button, buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, TextArea } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import {
  hiringRoutes,
  routeTo,
  type HiringRoute,
  type Opportunity,
} from "@/lib/marketplace";
import { FeeBreakdown } from "./fee-breakdown";
import { RouteOptions } from "./hiring-route-select";
import { Icon } from "./icons";
import { OpportunityCard } from "./opportunity-card";
import { Empty, Page, PageHeading } from "./page-layout";
import { useMarketplace } from "./provider";

export function Hire() {
  const {
    opportunities,
    setOpportunities,
    session,
    requireAccount,
    nextId,
    toast,
    jobChat,
  } = useMarketplace();
  const [route, setRoute] = useState<HiringRoute>("Hiring for company"),
    [budget, setBudget] = useState(0),
    [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session) {
      setError(
        "Sign in with the hirer test account to post. Your draft will stay here.",
      );
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
    if (
      !title ||
      !description ||
      !duration ||
      !Number.isFinite(budget) ||
      budget < 0.01 ||
      budget > 10000000 ||
      !hiringRoutes.includes(route)
    ) {
      setError(
        "Complete every field and enter a value between $0.01 and $10,000,000.",
      );
      return;
    }
    setOpportunities((current) => [
      {
        id: nextId(),
        title,
        description,
        duration,
        budget: Math.round(budget * 100) / 100,
        type: route,
        by: session.alias,
        status: "Open",
        applicants: [],
      },
      ...current,
    ]);
    event.currentTarget.reset();
    setBudget(0);
    setRoute("Hiring for company");
    setError("");
    toast(
      "Opportunity posted in this browser tab. It is not a live job listing.",
    );
  }
  function apply(job: Opportunity) {
    if (!session) {
      requireAccount(() => {});
      return;
    }
    if (session.role !== "expect") {
      toast("Use the expect test account to apply.");
      return;
    }
    setOpportunities((current) =>
      current.map((o) =>
        o.id === job.id &&
        o.status === "Open" &&
        !o.applicants.includes(session.alias)
          ? {
              ...o,
              applicants: [...o.applicants, session.alias],
            }
          : o,
      ),
    );
    toast("Your application recorded locally. No application was sent.");
  }
  return (
    <Page>
      <PageHeading
        eyebrow="Two ways to work"
        title="Hire for the work you need"
      >
        Choose the right route. Company hiring happens off-platform after
        rEcruit connects both sides; personal hiring lets you explore task
        agreement, delivery, and simulated payment on rEcruit.
      </PageHeading>
      <div className="max-w-none my-6 grid grid-cols-1 gap-6 nav:grid-cols-2">
        <Card
          className={cn(
            ` flex flex-col${route === "Hiring for company" ? " border-brand/50 " : ""}`,
          )}
        >
          <div className="mb-4.5 grid size-10 place-items-center rounded-control text-2xl text-brand">
            <Icon name="briefcase" />
          </div>
          <h2 className="mb-3 text-xl tracking-tight">Hiring for company</h2>
          <p className="flex-1 mb-6 max-w-2xl text-base leading-7">
            For companies hiring community managers, moderators, community leads
            and others. Agree terms and manage work and payment outside rEcruit.
            The company pays a separate platform fee based on the contract
            value.
          </p>
          <span
            className="self-start inline-flex items-center gap-1.5 rounded-control px-2 py-1 text-xs font-medium text-brand"
            data-testid="status-badge"
          >
            5% · Company pays rEcruit
          </span>
          <Button
            type="button"
            aria-pressed={route === "Hiring for company"}
            onClick={() => setRoute("Hiring for company")}
            variant="secondary"
            className="mt-5 w-full"
          >
            {route === "Hiring for company"
              ? "Company hiring selected"
              : "Choose company hiring"}
            <Icon
              name={route === "Hiring for company" ? "check" : "arrow"}
              size={16}
            />
          </Button>
        </Card>
        <Card
          className={cn(
            ` flex flex-col${route === "Hiring for myself" ? " border-brand/50 " : ""}`,
          )}
        >
          <div className="mb-4.5 grid size-10 place-items-center rounded-control text-2xl text-brand">
            <Icon name="check" />
          </div>
          <h2 className="mb-3 text-xl tracking-tight">Hiring for myself</h2>
          <p className="flex-1 mb-6 max-w-2xl text-base leading-7">
            Hire someone for a specific task. Agree the task, give instructions,
            and review delivery. The platform fee is added to the agreed price
            so the professional receives the full amount. Payment is simulated
            in this MVP.
          </p>
          <span
            className="self-start inline-flex items-center gap-1.5 rounded-control px-2 py-1 text-xs font-medium text-brand"
            data-testid="status-badge"
          >
            2.5% · Added to hirer checkout
          </span>
          <Button
            type="button"
            aria-pressed={route === "Hiring for myself"}
            onClick={() => setRoute("Hiring for myself")}
            variant="secondary"
            className="mt-5 w-full"
          >
            {route === "Hiring for myself"
              ? "Personal hiring selected"
              : "Choose personal hiring"}
            <Icon
              name={route === "Hiring for myself" ? "check" : "arrow"}
              size={16}
            />
          </Button>
        </Card>
      </div>
      <Card>
        <h2 className="mb-3 text-xl tracking-tight">Post an opportunity</h2>
        <p className="mb-6 max-w-2xl text-base leading-7">
          Preview the platform fee before posting. Live payment collection is
          not connected. Use the hirer test account to post; switch to the
          expect account to apply.
        </p>
        <form onSubmit={submit}>
          <div className="grid grid-cols-1 gap-x-4.5 gap-y-5.5 nav:grid-cols-2">
            <div className="flex min-w-0 flex-col gap-2">
              <label htmlFor="hiring-type" className="text-sm font-semibold">
                Hiring type
              </label>
              <RouteOptions
                id="hiring-type"
                value={route}
                onChange={setRoute}
              />
            </div>
            <Field
              label="Role / job title"
              name="title"
              maxLength={80}
              placeholder="e.g. Community Moderator or Landing Page Design"
            />
            <TextArea
              label="Description and expected outcome"
              name="description"
              placeholder="Responsibilities or deliverables, requirements and success criteria…"
            />
            <div className="flex min-w-0 flex-col gap-2">
              <label htmlFor="hiring-budget" className="text-sm font-semibold">
                Agreed contract / job value (USD) *
              </label>
              <Input
                id="hiring-budget"
                name="budget"
                type="number"
                min="0.01"
                max="10000000"
                step="0.01"
                required
                placeholder="e.g. 300"
                onChange={(e) => setBudget(Number(e.target.value))}
              />
              <FeeBreakdown budget={budget} route={route} />
            </div>
            <Field
              label="Duration / deadline"
              name="duration"
              maxLength={60}
              placeholder="e.g. 3 months / due in 7 days"
            />
            <Field
              label="Hirer alias"
              name="by"
              placeholder="Sign in to use your alias"
              required={false}
              readOnly
              value={session?.alias ?? ""}
            />
            <div className="flex min-w-0 flex-col gap-2">
              <Button className="mt-auto">Post opportunity →</Button>
            </div>
          </div>
          {error && (
            <p
              role="alert"
              className="border-l-2 border-foreground bg-surface px-3 py-2.5 text-base leading-relaxed"
              data-testid="form-error"
            >
              {error}
            </p>
          )}
        </form>
      </Card>
      <div className="mt-7 grid gap-6">
        <h2 className="mt-2.5 text-[22px]">Open opportunities</h2>
        <div className="grid grid-cols-1 gap-5 nav:grid-cols-2 laptop:grid-cols-3">
          {opportunities.length ? (
            opportunities.map((job) => (
              <OpportunityCard key={job.id} job={job}>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  <Button onClick={() => jobChat(job)} variant="secondary">
                    Message hirer
                  </Button>
                  {job.status === "Open" && session?.role === "expect" && (
                    <Button
                      disabled={job.applicants.includes(session.alias)}
                      onClick={() => apply(job)}
                    >
                      {job.applicants.includes(session.alias)
                        ? "Applied"
                        : "Apply →"}
                    </Button>
                  )}
                </div>
              </OpportunityCard>
            ))
          ) : (
            <Empty title="No opportunities posted yet">
              Post a role or job using the form above.
            </Empty>
          )}
        </div>
        <Link
          href={routeTo("work")}
          className={buttonStyles({
            variant: "secondary",
          })}
        >
          Go to dashboard →
        </Link>
      </div>
    </Page>
  );
}
