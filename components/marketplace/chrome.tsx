"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";
import { routeTo } from "@/lib/marketplace";
import { Icon, Wordmark } from "./icons";
import { useMarketplace } from "./provider";

export function MarketplaceNavbar() {
  const pathname = usePathname();
  const { session, setDialog } = useMarketplace();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    menu.current
      ?.querySelector<HTMLAnchorElement>("a")
      ?.focus({ preventScroll: true });
    function dismiss(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    }
    document.addEventListener("keydown", dismiss);
    return () => document.removeEventListener("keydown", dismiss);
  }, [menuOpen]);

  function openAccount() {
    setMenuOpen(false);
    setDialog({ type: "signup" });
  }
  return (
    <header
      data-testid="site-header"
      className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b-1 border-border max-nav:sticky max-nav:top-0 max-nav:z-40 max-nav:bg-background/95 max-nav:backdrop-blur-xl max-nav:border-b-1 max-nav:border-border"
    >
      <a
        href="#main-content"
        className="fixed -top-24 left-4 z-200 rounded-control bg-surface px-5 py-3 outline-2 outline-brand focus:top-2.5"
      >
        Skip to content
      </a>
      <Container className="relative flex h-20 items-center gap-8 max-nav:h-17 max-nav:px-5 max-nav:gap-4">
        <nav
          aria-label="Marketplace"
          className="flex h-full w-full items-center gap-8 max-tablet:gap-5 max-nav:gap-4"
        >
          <Link
            href="/"
            aria-label="rEcruit home"
            data-testid="site-brand"
            onClick={() => setMenuOpen(false)}
            className="shrink-0"
          >
            <Wordmark />
          </Link>
          <div
            ref={menu}
            id="marketplace-navigation-menu"
            className={cn(
              "flex-1 max-nav:absolute max-nav:inset-x-0 max-nav:top-full max-nav:bg-surface max-nav:px-5 max-nav:pt-3 max-nav:pb-5",
              menuOpen
                ? "max-nav:block max-nav:motion-safe:animate-menu"
                : "max-nav:hidden",
            )}
          >
          
            <div className="mt-3 hidden grid-cols-2 gap-x-5 gap-y-1 pt-3 max-nav:grid">
              {!session && (
                <Button onClick={openAccount} className="col-span-full mb-2.5">
                  Create Account <Icon name="northeast" size={16} />
                </Button>
              )}
            </div>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            {session ? (
              <Link
                href={routeTo("work")}
                className={buttonStyles({
                  variant: "secondary",
                  className: "max-nav:min-h-10 max-nav:px-2 max-nav:text-sm",
                })}
              >
                <span className="size-1.5 rounded-full bg-brand" />
                Dashboard
              </Link>
            ) : (
              <Button
                variant="ghost"
                onClick={() => setDialog({ type: "auth" })}
                className="max-nav:px-2 max-nav:text-sm"
              >
                Sign In
              </Button>
            )}
            {session ? (
              <Link
                href={routeTo(session.role === "hirer" ? "hire" : "list")}
                className={buttonStyles({ className: "max-tablet:hidden" })}
              >
                {session.role === "hirer"
                  ? "Post Opportunity"
                  : "List Expertise"}
                <Icon name="northeast" size={16} />
              </Link>
            ) : (
              <Button className="max-tablet:hidden" onClick={openAccount}>
                Get started <Icon name="northeast" size={16} />
              </Button>
            )}
            <button
              ref={menuButton}
              className="hidden size-10 shrink-0 place-items-center rounded-control max-nav:grid"
              aria-label={
                menuOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={menuOpen}
              aria-controls="marketplace-navigation-menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Icon name={menuOpen ? "close" : "menu"} />
            </button>
          </div>
        </nav>
      </Container>
    </header>
  );
}
