"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { type Submission } from "@/lib/marketplace";
import { AccountGate } from "./account-gate";
import { Empty, Page, PageHeading } from "./page-layout";
import { useMarketplace } from "./provider";

export function Reputation() {
  return (
    <Page>
      <PageHeading eyebrow="Evidence before impact" title="Reputation Review">
        Every new profile starts at 50/100. Pending evidence does not affect
        scores. Only approved Vouches or Refutes change reputation.
      </PageHeading>
      <div className="mt-7 grid gap-6">
        <AccountGate>
          <ReviewQueue />
        </AccountGate>
      </div>
    </Page>
  );
}

function ReviewQueue() {
  const { experts, setExperts, submissions, setSubmissions, session, toast } =
    useMarketplace();
  function review(submission: Submission, approve: boolean) {
    if (!session || submission.status !== "Pending Review") return;
    setSubmissions((current) =>
      current.map((s) =>
        s.id === submission.id
          ? {
              ...s,
              status: approve ? "Approved" : "Rejected",
            }
          : s,
      ),
    );
    if (approve)
      setExperts((current) =>
        current.map((e) =>
          e.id === submission.expertId
            ? {
                ...e,
                feedback: [
                  {
                    type: submission.type,
                    by: submission.by,
                    text: submission.text,
                  },
                  ...e.feedback,
                ],
                vouches: e.vouches + (submission.type === "vouch" ? 1 : 0),
                refutes: e.refutes + (submission.type === "refute" ? 1 : 0),
                score: Math.max(
                  0,
                  Math.min(
                    100,
                    e.score + (submission.type === "vouch" ? 1 : -2),
                  ),
                ),
              }
            : e,
        ),
      );
    toast(
      approve
        ? "Review approved. Local reputation updated."
        : "Review rejected. Reputation score unchanged.",
    );
  }
  return (
    <Card>
      <div
        aria-label="Evidence status"
        className="mb-7 grid grid-cols-3 gap-4 pb-6"
      >
        {["Pending Review", "Approved", "Rejected"].map((status) => (
          <div key={status}>
            <strong className="block text-3xl font-medium">
              {submissions.filter((s) => s.status === status).length}
            </strong>
            <span className="text-xs">{status}</span>
          </div>
        ))}
      </div>
      <h2 className="mb-3 text-xl tracking-tight">Evidence review queue</h2>
      <p className="mb-6 max-w-2xl text-base leading-7">
        Review submitted evidence and choose whether to approve or reject it.
        File names are shown below; file contents are not retained.
      </p>
      {submissions.length ? (
        submissions.map((s) => (
          <Card key={s.id} className="mt-3 p-4" data-testid="feedback-entry">
            <div className="flex items-center justify-between gap-3 text-sm max-phone:flex-wrap">
              <span
                className={cn(
                  s.type === "vouch" ? "text-brand" : "text-foreground",
                )}
              >
                {s.type === "vouch" ? "Vouch" : "Refute"} · {s.status}
              </span>
              <span className="text-sm">
                {experts.find((e) => e.id === s.expertId)?.alias ?? "Expert"}
              </span>
            </div>
            <p className="mt-2.5 text-sm leading-7 wrap-anywhere whitespace-pre-wrap">
              {s.text}
            </p>
            <p className="wrap-anywhere whitespace-pre-wrap my-3.5 text-sm leading-7">
              Submitted by {s.by} · Proof: {s.files.join(", ")}
            </p>
            {s.status === "Pending Review" && (
              <div className="mt-4 flex flex-wrap gap-2.5">
                <Button onClick={() => review(s, true)}>Approve</Button>
                <Button onClick={() => review(s, false)} variant="secondary">
                  Reject
                </Button>
              </div>
            )}
          </Card>
        ))
      ) : (
        <Empty title="No submissions yet">
          Submitted Vouches and Refutes appear here for review.
        </Empty>
      )}
    </Card>
  );
}
