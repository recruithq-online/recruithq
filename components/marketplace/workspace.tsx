"use client";

import { useState, type FormEvent } from "react";
import { walletPatterns, type Submission } from "@/lib/marketplace";
import { AccountGate, useMarketplace } from "./provider";
import { Empty, Field, Page, PageHeading, TextArea, WorkspacePageHeading } from "./ui";
export function Messages() {
  return <Page>
    <WorkspacePageHeading eyebrow="Work together" title="Messages">Discuss scope, timelines, delivery, and feedback. Messages stay in this browser tab and are not delivered to anyone.</WorkspacePageHeading>
    <div className="mp-stack">
      <AccountGate>
        <MessageWorkspace />
      </AccountGate>
    </div>
  </Page>;
}
function MessageWorkspace() {
  const {
    session,
    conversations,
    setConversations,
    activeChat,
    setActiveChat,
    toast
  } = useMarketplace();
  const [error, setError] = useState("");
  if (!session) return null;
  const mine = conversations.filter(c => c.parts.includes(session.alias)),
    selected = mine.find(c => c.id === activeChat) ?? mine[0];
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || !selected) return;
    const text = String(new FormData(event.currentTarget).get("text")).trim();
    if (!text) {
      setError("Write a message first.");
      return;
    }
    const item = {
      by: session.alias,
      text,
      time: new Date().toLocaleString("en-US")
    };
    setConversations(current => current.map(c => c.id === selected.id && c.parts.includes(session.alias) ? {
      ...c,
      items: [...c.items, item]
    } : c));
    event.currentTarget.reset();
    setError("");
    toast("Message added locally. Nothing was sent to a server or recipient.");
  }
  return <div className="mp-cols">
    <div className="mp-panel">
      <h2>Conversations</h2>{mine.length ? mine.map(c => <button className="mp-btn mp-secondary mp-fullbutton" key={c.id} aria-pressed={selected?.id === c.id} onClick={() => {
        setActiveChat(c.id);
        setError("");
      }}>
        <span>
          <b>{c.parts.find(p => p !== session.alias)}</b>
          <br />
          <small>{c.topic.slice(0, 60)}{c.topic.length > 60 ? "…" : ""}</small>
        </span>
      </button>) : <p className="mp-subtext">No conversations yet. Start one from an expert profile or opportunity.</p>}</div>{selected ? <div className="mp-panel">
      <h2>{selected.parts.find(p => p !== session.alias)}</h2>{selected.route && <span className="mp-badge">{selected.route}</span>}<p className="mp-muted">{selected.topic}</p>
      <div className="mp-chatlog" role="log" aria-label="Conversation">{selected.items.length ? selected.items.map((item, index) => <div className="mp-feedback" key={index}>
          <div className="mp-muted">{item.by} · {item.time}</div>
          <p>{item.text}</p>
        </div>) : <p className="mp-subtext">Say hello to start this conversation.</p>}</div>
      <form key={selected.id} onSubmit={submit}>
        <div className="mp-formgrid">
          <TextArea label="Message" name="text" placeholder="Write a message…" />
          <Field label="Your alias" name="by" readOnly value={session.alias} />
          <button className="mp-btn mp-primary">Send message →</button>
        </div>{error && <p className="mp-error" role="alert">{error}</p>}</form>
    </div> : <Empty title="Your messages">Select a conversation or start one from a profile or job.</Empty>}</div>;
}
export function Reputation() {
  return <Page>
    <PageHeading eyebrow="Evidence before impact" title="Reputation review">Every new profile starts at 50/100. Pending evidence does not affect scores. Only approved Vouches or Refutes change reputation.</PageHeading>
    <div className="mp-stack">
      <AccountGate>
        <ReviewQueue />
      </AccountGate>
    </div>
  </Page>;
}
function ReviewQueue() {
  const {
    experts,
    setExperts,
    submissions,
    setSubmissions,
    session,
    toast
  } = useMarketplace();
  function review(submission: Submission, approve: boolean) {
    if (!session || submission.status !== "Pending Review") return;
    setSubmissions(current => current.map(s => s.id === submission.id ? {
      ...s,
      status: approve ? "Approved" : "Rejected"
    } : s));
    if (approve) setExperts(current => current.map(e => e.id === submission.expertId ? {
      ...e,
      feedback: [{
        type: submission.type,
        by: submission.by,
        text: submission.text
      }, ...e.feedback],
      vouches: e.vouches + (submission.type === "vouch" ? 1 : 0),
      refutes: e.refutes + (submission.type === "refute" ? 1 : 0),
      score: Math.max(0, Math.min(100, e.score + (submission.type === "vouch" ? 1 : -2)))
    } : e));
    toast(approve ? "Review approved. Local reputation updated." : "Review rejected. Reputation score unchanged.");
  }
  return <div className="mp-panel">
    <h2>Evidence review queue</h2>
    <p className="mp-intro">Review submitted evidence and choose whether to approve or reject it. File names are shown below; file contents are not retained.</p>{submissions.length ? submissions.map(s => <div className="mp-feedback" key={s.id}>
      <div className="mp-feedbacktop">
        <span className={s.type === "vouch" ? "mp-green" : "mp-red"}>{s.type === "vouch" ? "Vouch" : "Refute"} · {s.status}</span>
        <span className="mp-muted">{experts.find(e => e.id === s.expertId)?.alias ?? "Expert"}</span>
      </div>
      <p>{s.text}</p>
      <p className="mp-note">Submitted by {s.by} · Proof: {s.files.join(", ")}</p>{s.status === "Pending Review" && <div className="mp-actions">
        <button className="mp-btn mp-primary" onClick={() => review(s, true)}>Approve</button>
        <button className="mp-btn mp-secondary" onClick={() => review(s, false)}>Reject</button>
      </div>}</div>) : <Empty title="No submissions yet">Submitted Vouches and Refutes appear here for review.</Empty>}</div>;
}
export function Settings() {
  return <Page>
    <PageHeading eyebrow="Your account" title="Settings">Manage account preferences and payment wallet details. Changes are stored in this browser only.</PageHeading>
    <div className="mp-stack">
      <AccountGate>
        <AccountSettings />
      </AccountGate>
    </div>
  </Page>;
}
function AccountSettings() {
  const {
    session,
    wallets,
    setWallets,
    preferences,
    setPreferences,
    signOut,
    toast
  } = useMarketplace();
  const [error, setError] = useState("");
  if (!session) return null;
  const me = session.alias,
    wallet = wallets[me],
    prefs = preferences[me] ?? {
      apps: true,
      msgs: true
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
    setWallets(current => ({
      ...current,
      [me]: {
        network,
        address
      }
    }));
    setError("");
    event.currentTarget.reset();
    toast("Wallet address saved locally. No wallet was connected.");
  }
  function savePreferences(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPreferences(current => ({
      ...current,
      [me]: {
        apps: data.has("apps"),
        msgs: data.has("msgs")
      }
    }));
    toast("Preferences saved. Notification delivery is not connected.");
  }
  return <div className="mp-cols">
    <div className="mp-stack" style={{
      marginTop: 0
    }}>
      <div className="mp-panel">
        <h2>Account details</h2>
        <p className="mp-intro">Test account information. Real account editing is not connected.</p>
        <div className="mp-formgrid">
          <Field label="Professional alias" name="alias" readOnly value={me} />
          <Field label="Email" name="email" type="email" readOnly value={session.email} />
          <Field label="Account type" name="role" readOnly value={session.role} />
        </div>
      </div>
      <div className="mp-panel">
        <h2>Notification preferences</h2>
        <p className="mp-intro">Choose which notifications you would receive in a live service.</p>
        <form onSubmit={savePreferences} key={me}>
          <label className="mp-checkbox">
            <input type="checkbox" name="apps" defaultChecked={prefs.apps} />Job application updates</label>
          <label className="mp-checkbox">
            <input type="checkbox" name="msgs" defaultChecked={prefs.msgs} />New message alerts</label>
          <button className="mp-btn mp-primary">Save preferences</button>
        </form>
      </div>
    </div>
    <div className="mp-stack" style={{
      marginTop: 0
    }}>
      <div className="mp-panel">
        <h2>{session.role === "worker" ? "Payout" : "Funding"} wallet</h2>
        <p className="mp-intro">Add a sample public address to explore the payment simulation. No wallet connection, transaction, or payment occurs.</p>{wallet ? <div className="mp-feedback">
          <b>{wallet.network}</b>
          <p>{wallet.address.slice(0, 6)}…{wallet.address.slice(-4)}</p>
          <button className="mp-btn mp-secondary mp-small" onClick={() => {
            setWallets(current => {
              const next = {
                ...current
              };
              delete next[me];
              return next;
            });
            toast("Wallet removed.");
          }}>Remove wallet</button>
        </div> : <p className="mp-note">No wallet added yet.</p>}<form onSubmit={saveWallet} style={{
          marginTop: 14
        }}>
          <div className="mp-group">
            <label htmlFor="wallet-network">Network</label>
            <select id="wallet-network" className="mp-field" name="network">{Object.keys(walletPatterns).map(n => <option key={n}>{n}</option>)}</select>
          </div>
          <Field label="Wallet address" name="address" placeholder="Paste a public address" />{error && <p role="alert" className="mp-error">{error}</p>}<button className="mp-btn mp-primary mp-fullbutton">{wallet ? "Replace wallet" : "Add wallet"}</button>
        </form>
      </div>
      <div className="mp-panel">
        <h2>Session</h2>
        <p className="mp-intro">Signed in as {me} ({session.role}). Account and sample data reset when the page refreshes.</p>
        <button className="mp-btn mp-secondary" onClick={signOut}>Sign out</button>
      </div>
    </div>
  </div>;
}
