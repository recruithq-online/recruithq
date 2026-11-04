"use client";
import { fees, money, type HiringRoute } from "@/lib/marketplace";

export function FeeBreakdown({
  budget,
  route,
}: {
  budget: number;
  route: HiringRoute;
}) {
  const cost = fees(budget, route),
    company = route === "Hiring for company";
  return (
    <p aria-live="polite" className="my-3.5 text-sm leading-7">
      {company ? "Agreement value" : "Agreed job price / expect receives"}:{" "}
      <b>{money(cost.cents)}</b>
      <br />
      rEcruit fee ({cost.rate}%,{" "}
      {company ? "billed separately to company" : "added to hirer checkout"}):{" "}
      <b>{money(cost.fee)}</b>
      <br />
      Estimated {company ? "company" : "hirer"} total:{" "}
      <b>{money(cost.total)}</b>
      <br />
      {company
        ? "Work and payment happen off-platform."
        : "Before any separately disclosed processing fee."}{" "}
      Preview only; no payment is collected.
    </p>
  );
}
