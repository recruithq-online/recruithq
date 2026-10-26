"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { routeTo } from "@/lib/marketplace";
import { useMarketplace } from "./provider";

const links = [["explore", "Explore"], ["hire", "Hire"], ["list", "List expertise"]];

export function MarketplaceNavbar() {
  const pathname = usePathname();
  const { session } = useMarketplace();
  return (
    <header className="marketplace mp-site-header">
      <nav className={`mp-site-nav${session ? " mp-site-signed-in" : ""}`} aria-label="Marketplace demo">
        <Link className="mp-site-brand" href="/" aria-label="rEcruit home">
          {/* <span className="mp-site-brandmark" aria-hidden="true">rE</span> */}
          <span>r<span className="mp-site-blue">E</span>cruit</span>
        </Link>
        <div className="mp-site-links">
          {links.map(([view, label]) => (
            <Link key={view} href={routeTo(view)} aria-current={pathname === routeTo(view) ? "page" : undefined}>
              {label}
            </Link>
          ))}
          <a href="#team">Team</a>
          {session && <Link className="mp-site-messages" href={routeTo("messages")} aria-current={pathname === routeTo("messages") ? "page" : undefined}>Messages</Link>}
        </div>
        <div className="mp-site-actions">
          <ThemeToggle />
          {/* <button className="mp-btn mp-ghost mp-site-auth" onClick={() => session ? signOut() : setDialog({ type: "auth" })}>
            {session ? "Sign out" : "Sign in"}
          </button> */}
          {session && <Link className="mp-btn mp-secondary" href={routeTo("work")}>Dashboard</Link>}
          <Link className="mp-btn mp-primary mp-site-start" href={routeTo("list")}>Get started ↗</Link>
        </div>
      </nav>
    </header>
  );
}
