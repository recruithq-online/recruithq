import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";

export function Footer() {
  return (
    <footer
      id="contact"
      className="bg-background border-t border-border pt-11 max-nav:pt-8.5"
      data-testid="site-footer"
    >
      <Container>
        <div className="grid grid-cols-[repeat(2,max-content)] items-start justify-between gap-x-6 gap-y-8 pb-8 nav:grid-cols-[repeat(3,max-content)] nav:gap-x-16 nav:pb-10 laptop:gap-x-24">
          <div className="col-span-full flex flex-col items-center gap-4 text-center nav:col-span-1 nav:items-start nav:text-left">
            <Link className="inline-flex" href="/" aria-label="rEcruit home">
              <Image src="/logo.svg" alt="rEcruit owl" width={64} height={64} />
            </Link>
            <p className="max-w-60 text-sm leading-7">
              Beyond CVs. Built on Reputation.
            </p>
          </div>
          <div className="flex min-w-0 flex-col items-start gap-1">
            <h3 className="mb-3 font-display text-xs leading-5 tracking-widest uppercase">
              Discover
            </h3>
            <Link
              className="inline-flex min-h-11 items-center py-2 text-sm leading-5 hover:text-brand"
              href="/marketplace/explore"
            >
              Explore Expertise
            </Link>
            <Link
              className="inline-flex min-h-11 items-center py-2 text-sm leading-5 hover:text-brand"
              href="/marketplace/hire"
            >
              Hire An Expert
            </Link>
            <Link
              className="inline-flex min-h-11 items-center py-2 text-sm leading-5 hover:text-brand"
              href="/marketplace/list"
            >
              List Your Expertise
            </Link>
          </div>
          <div className="flex min-w-0 flex-col items-start gap-1">
            <h3 className="mb-3 font-display text-xs leading-5 tracking-widest uppercase">
              Stay connected
            </h3>
            <a
              href="https://x.com/the_rEcruitHQ"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center py-2 text-sm leading-5 hover:text-brand"
            >
              X / Twitter ↗
            </a>
            <a
              href="https://www.linkedin.com/company/therecruithq"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center py-2 text-sm leading-5 hover:text-brand"
            >
              LinkedIn ↗
            </a>
            <a
              href="https://t.me/rEcruitHQ"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center py-2 text-sm leading-5 hover:text-brand"
            >
              Telegram ↗
            </a>
            <a
              href="https://github.com/recruithq-online/recruithq"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center py-2 text-sm leading-5 hover:text-brand"
            >
              GitHub ↗
            </a>
            <a
              href="mailto:support@recruithq.online"
              aria-label="company mail"
              className="inline-flex min-h-11 items-center py-2 text-sm leading-5 hover:text-brand"
            >
              Get in touch ↗
            </a>
          </div>
        </div>
        <div className="border-t border-border py-5 text-center text-xs leading-relaxed">
          <span>© 2026 rEcruit. Reputation is earned.</span>
        </div>
      </Container>
    </footer>
  );
}
