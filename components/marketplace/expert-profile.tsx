"use client";
import { useState } from "react";
import Link from "next/link";
import { Button, buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import {
  routeTo,
  safePortfolio,
  type MarketplaceExpert,
} from "@/lib/marketplace";
import { Empty, Page } from "./page-layout";
import { Avatar, SaveExpert, Skills, Verification } from "./profile-signals";
import { useMarketplace } from "./provider";

export function Profile({ id }: { id: number }) {
  const { experts, contact, setDialog } = useMarketplace();
  const [feedbackType, setFeedbackType] = useState("all");
  const expert = experts.find((e) => e.id === id);
  if (!expert)
    return (
      <Page back>
        <Empty title="Profile unavailable">
          This profile may have been reset by a refresh.{" "}
          <Link href={routeTo("explore")}>Browse sample experts →</Link>
        </Empty>
      </Page>
    );
  const e: MarketplaceExpert = expert;
  return (
    <Page back>
      <div className="grid grid-cols-1 items-start gap-7 laptop:grid-cols-[minmax(0,1.6fr)_minmax(290px,.8fr)]">
        <Card>
          <div
            className="mb-6 flex items-center gap-5 pb-6 max-nav:gap-4"
            data-testid="profile-header"
          >
            <Avatar
              alias={e.alias}
              className="h-20 w-18 max-nav:h-15 max-nav:w-13.5"
            />
            <div>
              <h1 className="m-0 mb-1.5 text-4xl max-nav:text-3xl">
                {e.alias}
              </h1>
              <p className="mb-1.5 text-sm">
                {e.category} · {e.availability}
              </p>
              <Verification expert={e} />
            </div>
            <SaveExpert expert={e} />
          </div>
          <h2 className="mb-3 text-xl tracking-tight">{e.headline}</h2>
          <p className="mb-6 max-w-2xl text-base leading-7">{e.about}</p>
          {e.portfolio && safePortfolio(e.portfolio) && (
            <p>
              <a
                href={safePortfolio(e.portfolio)}
                target="_blank"
                rel="noopener noreferrer nofollow ugc"
                className={buttonStyles({
                  variant: "secondary",
                  size: "small",
                })}
              >
                View portfolio ↗
              </a>
            </p>
          )}
          <div className="mt-6 pt-6">
            <h3 className="mb-4.5 text-lg">Skills & expertise</h3>
            <Skills skills={e.skills} />
          </div>
          <div className="mt-6 pt-6">
            <h3 className="mb-4.5 text-lg">Reputation feedback</h3>
            <p className="mb-6 max-w-2xl text-base leading-7">
              The working relationships behind the record. These sample entries
              illustrate how feedback adds context to a score.
            </p>
            <div
              aria-label="Feedback filters"
              className="mb-7 flex gap-1.5 overflow-x-auto"
            >
              {[
                ["all", "All feedback"],
                ["vouch", "Vouches"],
                ["refute", "Refutes"],
              ].map(([type, label]) => (
                <button
                  key={type}
                  aria-pressed={feedbackType === type}
                  onClick={() => setFeedbackType(type)}
                  className="inline-flex items-center gap-2 border-b-2 border-transparent bg-transparent px-3.5 py-3.5 text-sm whitespace-nowrap first:pl-0 aria-pressed:border-brand aria-pressed:text-brand"
                >
                  {label}
                </button>
              ))}
            </div>
            {e.feedback.filter(
              (f) => feedbackType === "all" || f.type === feedbackType,
            ).length ? (
              e.feedback
                .filter(
                  (f) => feedbackType === "all" || f.type === feedbackType,
                )
                .map((f, i) => (
                  <Card
                    key={i}
                    className="mt-3 p-4"
                    data-testid="feedback-entry"
                  >
                    <div className="flex items-center justify-between gap-3 text-sm max-phone:flex-wrap">
                      <span
                        className={cn(
                          f.type === "vouch" ? "text-brand" : "text-foreground",
                        )}
                      >
                        {f.type === "vouch" ? "✓ Vouched" : "⚑ Refuted"}
                      </span>
                      <span className="text-sm">{f.by}</span>
                    </div>
                    <p className="mt-2.5 text-base leading-7 wrap-anywhere whitespace-pre-wrap">
                      {f.text}
                    </p>
                  </Card>
                ))
            ) : (
              <p className="mb-6 max-w-2xl text-base leading-7">
                No feedback in this view yet.
              </p>
            )}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Button
                onClick={() =>
                  setDialog({
                    type: "feedback",
                    expertId: e.id,
                    kind: "vouch",
                  })
                }
                variant="vouch"
              >
                ✓ Vouch
              </Button>
              <Button
                onClick={() =>
                  setDialog({
                    type: "feedback",
                    expertId: e.id,
                    kind: "refute",
                  })
                }
                variant="refute"
              >
                ⚑ Refute
              </Button>
            </div>
            <p className="my-3.5 text-sm leading-7">
              New profiles start at 50/100. Attach proof to every Vouch or
              Refute. Only approved evidence changes reputation in this
              demonstration.
            </p>
          </div>
        </Card>
        <aside>
          <Card>
            <div className="text-sm">Starting rate</div>
            <div className="text-[32px] leading-tight font-medium tracking-[-.05em]">
              ${e.rate}
              <small className="ml-1 text-sm font-normal tracking-normal">
                {" "}
                / hour
              </small>
            </div>
            <p className="my-3.5 text-sm leading-7">
              Sample rate; final terms can be agreed with the expert.
            </p>
            <div className="my-6 flex items-center justify-between gap-2.5 py-5">
              <div>
                <div
                  data-testid="profile-score"
                  className="text-[32px] leading-tight font-medium tracking-[-.05em]"
                >
                  {e.score}
                  <small className="ml-1 text-sm font-normal tracking-normal">
                    /100
                  </small>
                </div>
                <div className="text-sm">Reputation</div>
              </div>
              <div>
                <div className="text-[32px] leading-tight font-medium tracking-[-.05em]">
                  {e.vouches}
                </div>
                <div className="text-sm">Vouches</div>
              </div>
              <div>
                <div className="text-[32px] leading-tight font-medium tracking-[-.05em]">
                  {e.refutes}
                </div>
                <div className="text-sm">Refutes</div>
              </div>
            </div>
            <div className="grid gap-6">
              <div className="flex items-start gap-3">
                <div className="grid size-7 shrink-0 place-items-center rounded-control text-brand">
                  ✓
                </div>
                <div>
                  <strong className="mb-1 block text-sm font-medium">
                    {e.projects} completed projects
                  </strong>
                  <span className="block text-sm leading-7">
                    Sample profile metric
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="grid size-7 shrink-0 place-items-center rounded-control text-brand">
                  ◎
                </div>
                <div>
                  <strong className="mb-1 block text-sm font-medium">
                    {e.availability}
                  </strong>
                  <span className="block text-sm leading-7">
                    Availability provided by expert
                  </span>
                </div>
              </div>
            </div>
            <Button onClick={() => contact(e.id)} className="mt-5 w-full">
              Contact / hire this expert →
            </Button>
          </Card>
          <Card className="mt-3.5">
            <h2 className="mb-3 text-xl tracking-tight">
              Reputation, with context
            </h2>
            <p className="mb-6 max-w-2xl text-base leading-7">
              A high score does not mean an unchallenged record. Read vouches
              and refutes together before making a decision.
            </p>
            <details data-testid="score-explanation">
              <summary className="cursor-pointer py-2 text-sm text-brand">
                How is this score calculated?
              </summary>
              <p className="my-3.5 text-sm leading-7">
                In this preview, new profiles start at 50. An approved vouch
                adds 1 point; an approved refute subtracts 2. Scores stay
                between 0 and 100. Pending and rejected evidence has no impact.
                Seeded profiles have illustrative historical scores.
              </p>
            </details>
            <div className="mt-6 rounded-control border border-border p-4 text-sm leading-7">
              <strong className="mb-1.5 block">
                Professional aliases. Accountable work.
              </strong>
              <p className="m-0">
                Verification badges and work totals are sample signals in this
                preview. No identity or evidence has been independently
                verified.
              </p>
            </div>
          </Card>
        </aside>
      </div>
    </Page>
  );
}
