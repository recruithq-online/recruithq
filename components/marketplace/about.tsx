"use client";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { routeTo } from "@/lib/marketplace";
import { team } from "@/lib/team";
import { Icon } from "./icons";
import { Page, PageHeading } from "./page-layout";
import { InfoList } from "./profile-tips";

export function About() {
  return (
    <Page>
      <PageHeading
        eyebrow="The rEcruit approach"
        title="Good work deserves a better signal."
      >
        A CV tells you what someone says they can do. A professional record
        helps you understand what they have done, who they worked with, and how
        that work holds up.
      </PageHeading>
      <div className="grid-cols-1 nav:grid-cols-2 laptop:grid-cols-3 mt-7 grid gap-6">
        {[
          [
            "search",
            "01 / Discover",
            "Start with the expertise you need. Filter by skills, availability, rate, and reputation. Save the people you want to look into.",
          ],
          [
            "document",
            "02 / Understand",
            "Read the record. Explore completed work, professional vouches, and refutes that add context to a claim.",
          ],
          [
            "message",
            "03 / Work together",
            "Discuss your brief, agree expectations, and choose a company or personal hiring arrangement.",
          ],
        ].map(([icon, title, text]) => (
          <Card key={title} as="article">
            <div className="mb-4.5 grid size-10 place-items-center rounded-control text-2xl text-brand">
              <Icon name={icon as "search" | "document" | "message"} />
            </div>
            <h2 className="mt-2.5 mb-3 text-xl tracking-tight">{title}</h2>
            <p className="mb-6 max-w-2xl text-base leading-7">{text}</p>
          </Card>
        ))}
      </div>
      <div className="grid-cols-1 items-start laptop:grid-cols-[minmax(0,1.25fr)_minmax(260px,.75fr)] mt-7 grid gap-6">
        <Card>
          <h2 className="mt-2.5 mb-3 text-xl tracking-tight">
            Trust includes the right to question.
          </h2>
          <p className="mb-6 max-w-2xl text-base leading-7">
            A vouch supports expertise with context from a working relationship.
            A refute challenges a specific inaccurate or misleading claim. Both
            need evidence. Neither should change a reputation until that
            evidence has been reviewed.
          </p>
          <InfoList />
        </Card>
        <Card>
          <h2 className="mt-2.5 mb-3 text-xl tracking-tight">
            A score with context
          </h2>
          <p className="mb-6 max-w-2xl text-base leading-7">
            In this demonstration, new profiles start at 50/100. Approved
            vouches add 1 point; approved refutes subtract 2. Pending or
            rejected submissions leave scores unchanged. Scores are capped
            between 0 and 100.
          </p>
          <div className="mt-6 rounded-control border border-border p-4 text-sm leading-7">
            <strong className="mb-1.5 block">
              Explore the product preview
            </strong>
            <p className="m-0">
              Profiles and work totals are illustrative. Accounts,
              conversations, jobs, and review decisions reset on refresh.
              Evidence files are not uploaded, and payments are simulated. Your
              saved sample experts stay on this device.
            </p>
          </div>
          <Link
            href={routeTo("explore")}
            className={buttonStyles({
              className: "mt-5 w-full",
            })}
          >
            Find your next expert <Icon name="arrow" size={16} />
          </Link>
        </Card>
      </div>
      <Card id="team" as="section" className="mt-7 grid gap-6">
        <span className="inline-flex items-center gap-2.5 font-mono text-xs leading-relaxed tracking-widest uppercase">
          THE PEOPLE BEHIND rEcruit
        </span>
        <h2 className="mb-3 tracking-tight mt-2.5 text-[22px]">
          Building a marketplace for demonstrated expertise.
        </h2>
        <p className="mb-6 max-w-2xl text-base leading-7">
          Led by {team[0].name}, {team[0].role}, with a background in creative
          management, product development, and sustainable finance. Our ambition
          is simple: make professional credibility visible through the work
          itself.
        </p>
        <a
          href="mailto:support@recruithq.online"
          className="inline-flex items-center gap-3 text-base font-semibold hover:text-brand motion-safe:[&_svg]:transition-transform motion-safe:hover:[&_svg]:translate-x-0.5"
        >
          Talk to the team <Icon name="northeast" size={16} />
        </a>
      </Card>
    </Page>
  );
}
