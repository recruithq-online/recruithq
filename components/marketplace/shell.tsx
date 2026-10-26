"use client";

import { usePathname } from "next/navigation";

export function MarketplaceShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <main className="marketplace" id={pathname === "/" ? undefined : "top"}>
      {children}
    </main>
  );
}
