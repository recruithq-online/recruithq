"use client";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { money, type Opportunity } from "@/lib/marketplace";
import { FeeBreakdown } from "./fee-breakdown";

export function OpportunityCard({
  job,
  children,
}: {
  job: Opportunity;
  children?: React.ReactNode;
}) {
  return (
    <Card as="article">
      <span
        className="inline-flex items-center gap-1.5 rounded-control px-2 py-1 text-xs font-medium text-brand"
        data-testid="status-badge"
      >
        {job.status}
      </span>{" "}
      <span className="text-sm">{job.type}</span>
      <h2 className="mb-3 text-xl tracking-tight mt-3">{job.title}</h2>
      <p className="mb-6 max-w-2xl text-base leading-7">{job.description}</p>
      <div className="text-sm">
        {job.duration} · Posted by {job.by}
      </div>
      <ol
        aria-label="Opportunity progress"
        className="my-6 flex list-none gap-3 p-0"
      >
        {["Open", "In progress", "Delivered", "Completed"].map(
          (status, index, steps) => (
            <li
              key={status}
              aria-current={job.status === status ? "step" : undefined}
              className={cn(
                index <= steps.indexOf(job.status)
                  ? "text-brand [&_i]:bg-brand"
                  : "",
                "flex-1 text-xs aria-[current=step]:text-brand",
              )}
            >
              <i className="mb-2 block h-0.75 bg-foreground/10" />
              {status}
            </li>
          ),
        )}
      </ol>
      <details className="my-5 py-3.5">
        <summary className="cursor-pointer text-base">
          {money(Math.round(job.budget * 100))} budget{" "}
          <span className="ml-3 text-xs">Fees & total</span>
        </summary>
        <FeeBreakdown budget={job.budget} route={job.type} />
      </details>
      {children}
    </Card>
  );
}
