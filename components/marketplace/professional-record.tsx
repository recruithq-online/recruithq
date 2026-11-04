import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { MarketplaceExpert } from "@/lib/marketplace";
import { routeTo } from "@/lib/marketplace";
import { Icon } from "./icons";
import { Avatar, Verification } from "./profile-signals";

export function ProfessionalRecord({ expert }: { expert: MarketplaceExpert }) {
  return (
    <div className="relative isolate overflow-hidden rounded-card bg-brand px-7 pt-5.5 pb-5 text-white motion-safe:animate-record-enter max-tablet:px-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-y-1/3 left-0 -z-10 w-[70%] bg-linear-to-r from-transparent via-white/15 to-transparent opacity-0 motion-safe:animate-light-pass"
      />
      <div className="flex items-center justify-between pb-6 font-display text-xs tracking-widest max-nav:pb-5">
        <span>PROOF OVER PROMISES</span>
        <Icon name="shield" size={19} />
      </div>
      <Card
        className="p-0 px-6 pt-5.5 max-tablet:px-4"
        data-testid="professional-record"
      >
        <div className="flex justify-between pb-4.5 font-display text-xs tracking-wide">
          <span>THE PROFESSIONAL RECORD</span>
          <span>№ 001</span>
        </div>
        <div className="my-5.5 flex items-center gap-3.5 max-tablet:gap-2.5">
          <Avatar alias={expert.alias} className="h-17 w-15" />
          <div className="min-w-0">
            <h2 className="mb-1 flex items-center gap-2 text-2xl">
              {expert.alias}
              <Icon name="shield" size={18} />
            </h2>
            <p className="mb-1 text-sm">{expert.headline}</p>
            <Verification expert={expert} />
          </div>
        </div>
        <div className="flex items-center justify-between gap-5 py-5.5 max-tablet:py-4 max-nav:py-6 max-phone:gap-3">
          <div>
            <span className="font-display text-xs tracking-wide">
              REPUTATION SCORE
            </span>
            <div className="text-[76px] leading-[1.1] font-medium tracking-[-.07em] whitespace-nowrap max-tablet:text-[62px] max-nav:text-[72px] max-phone:text-[60px]">
              {expert.score}
              <span className="ml-2.5 text-base tracking-tight">/ 100</span>
            </div>
            <span className="text-xs">A record built through real work.</span>
          </div>
          <div className="mr-2 flex size-24 shrink-0 flex-col items-center justify-center gap-1 rounded-full bg-brand text-white max-tablet:size-20 max-nav:size-24 max-phone:mr-0 max-phone:size-20">
            <Icon name="shield" size={32} />
            <span className="text-center font-display text-xs leading-tight tracking-wide">
              WORK
              <br />
              BACKED
            </span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 py-4 max-phone:grid-cols-1 max-phone:[&>div]:flex max-phone:[&>div]:items-center max-phone:[&>div]:justify-between">
          <div>
            <strong className="block text-[22px] leading-snug font-medium">
              {expert.projects}
            </strong>
            <span className="text-sm">Projects delivered</span>
          </div>
          <div>
            <strong className="block text-[22px] leading-snug font-medium">
              {expert.vouches}
            </strong>
            <span className="text-sm">Professional vouches</span>
          </div>
          <div>
            <strong className="block text-[22px] leading-snug font-medium">
              {expert.refutes}
            </strong>
            <span className="text-sm">Accountable refute</span>
          </div>
        </div>
        <div className="my-5">
          <div className="flex items-center gap-1.5 font-display text-xs tracking-wide text-brand">
            <Icon name="check" size={14} />
            <span>FROM A PAST HIRER</span>
          </div>
          <blockquote className="mt-2 text-sm leading-7">
            “{expert.feedback.find((f) => f.type === "vouch")?.text}”
          </blockquote>
        </div>
        <Link
          href={routeTo(`profile/${expert.id}`)}
          className="flex items-center justify-between py-4 text-sm font-semibold text-brand motion-safe:[&_svg]:transition-transform motion-safe:hover:[&_svg]:translate-x-0.5"
        >
          See the work behind the reputation <Icon name="northeast" size={17} />
        </Link>
      </Card>
      <div className="flex justify-between gap-2.5 pt-5 text-xs max-tablet:flex-col max-nav:flex-row max-phone:flex-col">
        <span className="inline-flex items-center gap-1.5">
          <i className="size-1 rounded-full bg-white" />
          Evidence. Context. Accountability.
        </span>
        <span className="inline-flex items-center gap-1.5">
          ILLUSTRATIVE PROFILE
        </span>
      </div>
    </div>
  );
}
