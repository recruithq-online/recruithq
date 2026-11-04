import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Icon, Wordmark } from "./icons";

export function Footer() {
  return (
    <footer
      id="contact"
      className="bg-background border-t border-border pt-11 max-nav:pt-8.5"
      data-testid="site-footer"
    >
      <Container>
        <div className="grid grid-cols-2 gap-8 pb-10 nav:grid-cols-[1.6fr_1fr_1fr_1fr] nav:gap-6 laptop:gap-10">
          <div className="col-span-full nav:col-span-1">
            <Link href="/" aria-label="rEcruit home">
              <Wordmark />
            </Link>
            <p className="mt-4.5 max-w-60 text-sm leading-7">
              Beyond CVs. Built on Reputation.
              <br />A better way to discover, evaluate, and work with
              independent expertise.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2.5">
            <h3 className="mb-2 font-display text-xs tracking-widest uppercase">
              Discover
            </h3>
            <Link
              className="py-1 text-sm hover:text-brand max-nav:min-h-10"
              href="/marketplace/explore"
            >
              Explore expertise
            </Link>
            <Link
              className="py-1 text-sm hover:text-brand max-nav:min-h-10"
              href="/marketplace/hire"
            >
              Hire an expert
            </Link>
            <Link
              className="py-1 text-sm hover:text-brand max-nav:min-h-10"
              href="/marketplace/list"
            >
              List your expertise
            </Link>
            <Link
              className="py-1 text-sm hover:text-brand max-nav:min-h-10"
              href="/marketplace/about"
            >
              Our approach
            </Link>
          </div>
          <div className="flex flex-col items-start gap-2.5">
            <h3 className="mb-2 font-display text-xs tracking-widest uppercase">
              Workspace
            </h3>
            <Link
              className="py-1 text-sm hover:text-brand max-nav:min-h-10"
              href="/marketplace/work"
            >
              Dashboard
            </Link>
            <Link
              className="py-1 text-sm hover:text-brand max-nav:min-h-10"
              href="/marketplace/messages"
            >
              Messages
            </Link>
            <Link
              className="py-1 text-sm hover:text-brand max-nav:min-h-10"
              href="/marketplace/reputation"
            >
              Reputation
            </Link>
            <Link
              className="py-1 text-sm hover:text-brand max-nav:min-h-10"
              href="/marketplace/settings"
            >
              Settings
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
              href="mailto:support@recruithq.online"
              aria-label="company mail"
              className="py-1 text-sm hover:text-brand max-nav:inline-flex max-nav:min-h-10 max-nav:items-center"
            >
              Get in touch ↗
            </a>
          </div>
        </div>
        <div className="flex items-center justify-between gap-5 py-5 text-xs max-nav:flex-col max-nav:items-start max-nav:gap-2.5">
          <span>© 2026 rEcruit. Reputation is earned.</span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="document" size={12} />
            Interactive preview · Sample data · No live payments
          </span>
        </div>
      </Container>
    </footer>
  );
}
