"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useMarketplace } from "./provider";

export function FooterGrid({ children }: { children: ReactNode }) {
  const { session } = useMarketplace();

  return (
    <div className={`footer-grid${session ? " footer-grid-authenticated" : ""}`}>
      {children}
    </div>
  );
}

export function FooterWorkspace() {
  const { session } = useMarketplace();

  if (!session) return null;

  return (
    <div className="footer-column">
      <h3>Workspace</h3>
      <div className="footer-links flex flex-col gap-2">
        <Link href="/marketplace/work">Dashboard</Link>
        <Link href="/marketplace/messages">Messages</Link>
        <Link href="/marketplace/reputation">Reputation</Link>
        <Link href="/marketplace/settings">Settings</Link>
        <Link href="/marketplace/about">About rEcruit</Link>
      </div>
    </div>
  );
}
