"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { routeTo } from "@/lib/marketplace";
import { Icon, type IconName } from "./icons";
import { usePageMotion } from "./motion";
import { useMarketplace } from "./provider";

const workspaceLinks: [string, string, IconName][] = [
  ["work", "Dashboard", "grid"],
  ["messages", "Messages", "message"],
  ["reputation", "Reputation", "shield"],
  ["settings", "Settings", "settings"],
];

export function MarketplaceShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { session, setDialog } = useMarketplace();
  const motionRoot = usePageMotion(pathname);
  const isWorkspace = workspaceLinks.some(
    ([view]) => pathname === routeTo(view),
  );
  return (
    <div
      className={cn(
        "mx-auto",
        isWorkspace &&
          "max-w-360 nav:grid nav:grid-cols-[240px_minmax(0,1fr)] tablet:grid-cols-[240px_minmax(0,1fr)]",
      )}
    >
      {isWorkspace && (
        <aside className="flex min-h-[calc(100vh-80px)] flex-col px-5 py-9 max-nav:min-h-0 max-nav:py-0">
          <div className="mb-3.5 px-3 font-display text-xs tracking-widest max-nav:hidden">
            WORKSPACE
          </div>
          <nav
            aria-label="Workspace"
            className="mb-8 grid gap-1 max-nav:mb-0 max-nav:flex max-nav:gap-2 max-nav:overflow-x-auto max-nav:py-2.5"
          >
            {workspaceLinks.map(([view, title, icon]) => (
              <Link
                key={view}
                href={routeTo(view)}
                aria-current={pathname === routeTo(view) ? "page" : undefined}
                className="flex items-center gap-3 rounded-control p-3 text-sm transition-colors hover:text-brand aria-[current=page]:bg-brand aria-[current=page]:text-white max-nav:gap-2 max-nav:px-2.5 max-nav:py-2 max-nav:whitespace-nowrap"
              >
                <Icon name={icon} size={18} />
                {title}
              </Link>
            ))}
          </nav>
          <div className="mb-3 px-3 font-display text-xs tracking-widest max-nav:hidden">
            MARKETPLACE
          </div>
          <Link
            href={routeTo("explore")}
            className="flex items-center gap-3 rounded-control p-3 text-sm max-nav:hidden"
          >
            <Icon name="search" />
            Discover expertise
            <Icon name="northeast" size={15} className="ml-auto shrink-0" />
          </Link>
          <div className="mt-auto px-3 pt-14 pb-6 max-nav:hidden">
            <Icon name="shield" size={28} className="mb-3 text-brand" />
            <b className="text-sm font-medium">Your work tells your story.</b>
            <p className="my-2 text-sm leading-7">
              Build a professional record that speaks for itself.
            </p>
            <Link
              href={routeTo("list")}
              className="inline-flex items-center gap-2 text-sm text-brand"
            >
              List your expertise <Icon name="arrow" size={16} />
            </Link>
          </div>
          <div
            data-testid="sidebar-account"
            className="flex items-center gap-2.5 pt-5 wrap-anywhere max-nav:hidden"
          >
            {session ? (
              <>
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand text-white">
                  {session.alias.slice(0, 1)}
                </span>
                <div>
                  <strong className="text-sm font-medium">
                    {session.alias}
                  </strong>
                  <small className="mt-1 block text-xs">
                    {session.role === "hirer"
                      ? "Hiring workspace"
                      : "Professional workspace"}
                  </small>
                </div>
              </>
            ) : (
              <Button
                variant="secondary"
                className="text-xs"
                onClick={() => setDialog({ type: "auth" })}
              >
                Sign in to your workspace
              </Button>
            )}
          </div>
        </aside>
      )}
      <main
        ref={motionRoot}
        id="main-content"
        tabIndex={-1}
        className="min-w-0 outline-none"
      >
        {children}
      </main>
    </div>
  );
}
