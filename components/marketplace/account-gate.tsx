"use client";
import { type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMarketplace } from "./provider";

export function AccountGate({ children }: { children: ReactNode }) {
  const { session, requireAccount } = useMarketplace();
  return session ? (
    children
  ) : (
    <Card>
      <h2 className="mb-3 text-xl tracking-tight">Sign in to your workspace</h2>
      <p className="mb-6 max-w-2xl text-base leading-7">
        Sign in with an existing account or create a temporary account to
        continue.
      </p>
      <Button onClick={() => requireAccount(() => {})}>
        Sign in to continue
      </Button>
    </Card>
  );
}
