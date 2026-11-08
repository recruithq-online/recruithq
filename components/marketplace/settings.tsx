"use client";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/form-field";
import { Select } from "@/components/ui/input";
import { walletPatterns } from "@/lib/marketplace";
import { AccountGate } from "./account-gate";
import { Page, PageHeading } from "./page-layout";
import { useMarketplace } from "./provider";

export function Settings() {
  return (
    <Page>
      <PageHeading eyebrow="Your account" title="Settings">
        Manage account preferences and payment wallet details. Changes are
        stored in this browser only.
      </PageHeading>
      <div className="mt-7 grid gap-6">
        <AccountGate>
          <AccountSettings />
        </AccountGate>
      </div>
    </Page>
  );
}

function AccountSettings() {
  const {
    session,
    wallets,
    setWallets,
    preferences,
    setPreferences,
    signOut,
    toast,
  } = useMarketplace();
  const [error, setError] = useState("");
  if (!session) return null;
  const me = session.alias,
    wallet = wallets[me],
    prefs = preferences[me] ?? {
      apps: true,
      msgs: true,
    };
  function saveWallet(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget),
      network = String(data.get("network")),
      address = String(data.get("address")).trim();
    if (!walletPatterns[network]?.test(address)) {
      setError(`Enter a valid ${network} address. Use a sample address.`);
      return;
    }
    setWallets((current) => ({
      ...current,
      [me]: {
        network,
        address,
      },
    }));
    setError("");
    event.currentTarget.reset();
    toast("Wallet address saved locally. No wallet was connected.");
  }
  function savePreferences(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPreferences((current) => ({
      ...current,
      [me]: {
        apps: data.has("apps"),
        msgs: data.has("msgs"),
      },
    }));
    toast("Preferences saved. Notification delivery is not connected.");
  }
  return (
    <div className="grid grid-cols-1 items-start gap-6 laptop:grid-cols-[minmax(0,1.25fr)_minmax(260px,.75fr)]">
      <div className="mt-7 grid gap-6">
        <Card>
          <h2 className="mt-2.5 mb-3 text-xl tracking-tight">
            Account details
          </h2>
          <p className="mb-6 max-w-2xl text-base leading-7">
            Test account information. Real account editing is not connected.
          </p>
          <div className="grid grid-cols-1 gap-x-4.5 gap-y-5.5 nav:grid-cols-2">
            <Field
              label="Professional alias"
              name="alias"
              readOnly
              value={me}
            />
            <Field
              label="Email"
              name="email"
              type="email"
              readOnly
              value={session.email}
            />
            <Field
              label="Account type"
              name="role"
              readOnly
              value={session.role}
            />
          </div>
        </Card>
        <Card>
          <h2 className="mt-2.5 mb-3 text-xl tracking-tight">
            Notification preferences
          </h2>
          <p className="mb-6 max-w-2xl text-base leading-7">
            Choose which notifications you would receive in a live service.
          </p>
          <form onSubmit={savePreferences} key={me}>
            <label className="my-4 flex items-center gap-2.5 text-sm">
              <input type="checkbox" name="apps" defaultChecked={prefs.apps} />
              Job application updates
            </label>
            <label className="my-4 flex items-center gap-2.5 text-sm">
              <input type="checkbox" name="msgs" defaultChecked={prefs.msgs} />
              New message alerts
            </label>
            <Button>Save preferences</Button>
          </form>
        </Card>
      </div>
      <div className="mt-7 grid gap-6">
        <Card>
          <h2 className="mt-2.5 mb-3 text-xl tracking-tight">
            {session.role === "expert" ? "Payout" : "Funding"} wallet
          </h2>
          <p className="mb-6 max-w-2xl text-base leading-7">
            Add a sample public address to explore the payment simulation. No
            wallet connection, transaction, or payment occurs.
          </p>
          {wallet ? (
            <Card className="mt-3 p-4" data-testid="feedback-entry">
              <b>{wallet.network}</b>
              <p className="mt-2.5 text-base leading-7 wrap-anywhere whitespace-pre-wrap">
                {wallet.address.slice(0, 6)}…{wallet.address.slice(-4)}
              </p>
              <Button
                onClick={() => {
                  setWallets((current) => {
                    const next = {
                      ...current,
                    };
                    delete next[me];
                    return next;
                  });
                  toast("Wallet removed.");
                }}
                variant="secondary"
                size="small"
              >
                Remove wallet
              </Button>
            </Card>
          ) : (
            <p className="my-3.5 text-sm leading-7">No wallet added yet.</p>
          )}
          <form onSubmit={saveWallet} className="mt-3.5">
            <div className="flex min-w-0 flex-col gap-2">
              <label htmlFor="wallet-network" className="text-sm font-semibold">
                Network
              </label>
              <Select id="wallet-network" name="network">
                {Object.keys(walletPatterns).map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </Select>
            </div>
            <Field
              label="Wallet address"
              name="address"
              placeholder="Paste a public address"
            />
            {error && (
              <p
                role="alert"
                className="border-l-2 border-foreground bg-surface px-3 py-2.5 text-base leading-relaxed"
                data-testid="form-error"
              >
                {error}
              </p>
            )}
            <Button className="mt-5 w-full">
              {wallet ? "Replace wallet" : "Add wallet"}
            </Button>
          </form>
        </Card>
        <Card>
          <h2 className="mt-2.5 mb-3 text-xl tracking-tight">Session</h2>
          <p className="mb-6 max-w-2xl text-base leading-7">
            Signed in as {me} ({session.role}). Account and sample data reset
            when the page refreshes.
          </p>
          <Button onClick={signOut} variant="secondary">
            Sign out
          </Button>
        </Card>
      </div>
    </div>
  );
}
