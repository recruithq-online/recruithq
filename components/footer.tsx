import Link from "next/link";
import { Container } from "@/components/ui/container";
import { BrandLogo } from "./brand-logo";

export function Footer() {
  return (
    <footer
      id="contact"
      className="v3-home bg-background border-t border-border pt-11 max-nav:pt-8.5"
      data-testid="site-footer"
    >
      <Container>
        <div className="grid grid-cols-2 items-start gap-8 pb-10 nav:grid-cols-3 nav:gap-6 laptop:gap-10">
          <div className="col-span-full nav:col-span-1">
            <Link
              className="inline-flex [&_.logo-image]:size-16"
              href="/"
              aria-label="rEcruit home"
            >
              <BrandLogo variant="owl" />
            </Link>
            <p className="mt-4.5 max-w-60 text-sm leading-7">
              Beyond CVs. Built on Reputation.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2.5">
            <h3 className="mb-2 font-display text-xs tracking-widest uppercase">
              Discover
            </h3>
            <Link
              className="py-1 text-sm hover:text-brand max-nav:min-h-10"
              href="#expertise"
            >
              Explore Expertise
            </Link>
            <Link
              className="py-1 text-sm hover:text-brand max-nav:min-h-10"
              href="#early-access"
            >
              Hire An Expert
            </Link>
            <Link
              className="py-1 text-sm hover:text-brand max-nav:min-h-10"
              href="#early-access"
            >
              List Your Expertise
            </Link>
          </div>
          <div className="flex flex-col items-start gap-2.5">
            <h3 className="mb-2 font-display text-xs tracking-widest uppercase">
              Stay connected
            </h3>
            <a
              href="https://x.com/the_rEcruitHQ"
              target="_blank"
              rel="noopener noreferrer"
              className="py-1 text-sm hover:text-brand max-nav:inline-flex max-nav:min-h-10 max-nav:items-center"
            >
              X / Twitter ↗
            </a>
            <a
              href="https://www.linkedin.com/company/therecruithq"
              target="_blank"
              rel="noopener noreferrer"
              className="py-1 text-sm hover:text-brand max-nav:inline-flex max-nav:min-h-10 max-nav:items-center"
            >
              LinkedIn ↗
            </a>
            <a
              href="https://t.me/rEcruitHQ"
              target="_blank"
              rel="noopener noreferrer"
              className="py-1 text-sm hover:text-brand max-nav:inline-flex max-nav:min-h-10 max-nav:items-center"
            >
              Telegram ↗
            </a>
             <a
              href="https://github.com/recruithq-online/recruithq"
              target="_blank"
              rel="noopener noreferrer"
              className="py-1 text-sm hover:text-brand max-nav:inline-flex max-nav:min-h-10 max-nav:items-center"
            >
              GitHub ↗
            </a>
            <a
              href="mailto:support@recruithq.online"
              aria-label="company mail"
              className="py-1 text-sm hover:text-brand max-nav:inline-flex max-nav:min-h-10 max-nav:items-center"
            >
              Get in touch ↗
            </a>
          </div>
        </div>
        <div className="flex items-center justify-between gap-5 border-t border-border py-5 text-xs max-nav:flex-col max-nav:items-start max-nav:gap-2.5">
          <span>© 2026 rEcruit. Reputation is earned.</span>
        </div>
      </Container>
    </footer>
  );
}
