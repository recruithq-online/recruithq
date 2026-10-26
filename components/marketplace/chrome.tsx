"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { routeTo } from "@/lib/marketplace";
import { useMarketplace } from "./provider";

const links = [["explore", "Explore"], ["hire", "Hire"], ["list", "List expertise"]];

export function MarketplaceNavbar() {
  const pathname = usePathname();
  const { session } = useMarketplace();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="marketplace mp-site-header">
      <nav className={`mp-site-nav${session ? " mp-site-signed-in" : ""}${menuOpen ? " mp-menu-open" : ""}`} aria-label="Marketplace demo">
        <Link className="mp-site-brand" href="/" aria-label="rEcruit home">
          {/* <span className="mp-site-brandmark" aria-hidden="true">rE</span> */}
          <span>r<span className="mp-site-blue">E</span>cruit</span>
        </Link>
        <div className="mp-site-menu" id="marketplace-navigation-menu">
          <div className="mp-site-links">
            {links.map(([view, label]) => (
              <Link key={view} href={routeTo(view)} aria-current={pathname === routeTo(view) ? "page" : undefined} onClick={() => setMenuOpen(false)}>
                {label}
              </Link>
            ))}
            <a href="#team" onClick={() => setMenuOpen(false)}>Team</a>
            {session && <Link className="mp-site-messages" href={routeTo("messages")} aria-current={pathname === routeTo("messages") ? "page" : undefined} onClick={() => setMenuOpen(false)}>Messages</Link>}
          </div>
          <div className="mp-site-actions">
            <ThemeToggle />
            {/* <button className="mp-btn mp-ghost mp-site-auth" onClick={() => session ? signOut() : setDialog({ type: "auth" })}>
              {session ? "Sign out" : "Sign in"}
            </button> */}
            {session && <Link className="mp-btn mp-secondary" href={routeTo("work")} onClick={() => setMenuOpen(false)}>Dashboard</Link>}
            <Link className="mp-btn mp-primary mp-site-start" href={routeTo("list")} onClick={() => setMenuOpen(false)}>Get started ↗</Link>
          </div>
        </div>
        <button
          className="mp-site-menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="marketplace-navigation-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {menuOpen ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </nav>
    </header>
  );
}
