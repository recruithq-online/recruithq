"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type Dispatch, type SetStateAction, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/modal";
import { accounts, aliasKey, initialMarketplaceExperts, routeTo, type DemoAccount, type MarketplaceExpert, type Opportunity, type Submission, type Conversation, type Wallet, type HiringRoute } from "@/lib/marketplace";
import { AuthForm, ContactForm, FeedbackForm } from "./dialogs";
import "./marketplace.css";
type Setter<T> = Dispatch<SetStateAction<T>>;
type Dialog = {
  type: "auth";
} | {
  type: "contact";
  expertId: number;
} | {
  type: "feedback";
  expertId: number;
  kind: "vouch" | "refute";
} | null;
interface MarketplaceState {
  experts: MarketplaceExpert[];
  setExperts: Setter<MarketplaceExpert[]>;
  opportunities: Opportunity[];
  setOpportunities: Setter<Opportunity[]>;
  submissions: Submission[];
  setSubmissions: Setter<Submission[]>;
  conversations: Conversation[];
  setConversations: Setter<Conversation[]>;
  wallets: Record<string, Wallet>;
  setWallets: Setter<Record<string, Wallet>>;
  preferences: Record<string, {
    apps: boolean;
    msgs: boolean;
  }>;
  setPreferences: Setter<Record<string, {
    apps: boolean;
    msgs: boolean;
  }>>;
  session: DemoAccount | null;
  signIn: (email: string, password: string) => boolean;
  signOut: () => void;
  activeChat: number | null;
  setActiveChat: Setter<number | null>;
  dialog: Dialog;
  setDialog: Setter<Dialog>;
  closeDialog: () => void;
  requireAccount: (action: () => void) => void;
  contact: (expertId: number) => void;
  jobChat: (job: Opportunity, other?: string) => void;
  toast: (message: string) => void;
  nextId: () => number;
}
const Context = createContext<MarketplaceState | null>(null);
export function useMarketplace() {
  const value = useContext(Context);
  if (!value) throw new Error("MarketplaceProvider is required");
  return value;
}
export function MarketplaceProvider({
  children
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const [experts, setExperts] = useState(initialMarketplaceExperts);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [wallets, setWallets] = useState<Record<string, Wallet>>({});
  const [preferences, setPreferences] = useState<Record<string, {
    apps: boolean;
    msgs: boolean;
  }>>({});
  const [session, setSession] = useState<DemoAccount | null>(null);
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [notice, setNotice] = useState<{
    id: number;
    text: string;
  } | null>(null);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 6500);
    return () => clearTimeout(timer);
  }, [notice]);
  const sequence = useRef(100);
  const pending = useRef<((account: DemoAccount) => void) | null>(null);
  const nextId = () => ++sequence.current;
  const closeDialog = useCallback(() => {
    setDialog(null);
    pending.current = null;
  }, []);
  function toast(text: string) {
    setNotice({
      id: nextId(),
      text
    });
  }
  function requireAccount(action: () => void) {
    if (session) action();else {
      pending.current = action;
      setDialog({
        type: "auth"
      });
    }
  }
  function signIn(email: string, password: string) {
    const account = accounts.find(a => a.email === email.trim().toLowerCase() && a.password === password);
    if (!account) return false;
    setSession(account);
    const continuation = pending.current;
    pending.current = null;
    setDialog(null);
    toast(`Demo session: ${account.alias} (${account.role}). No real authentication occurred.`);
    if (continuation) continuation(account);else router.push(routeTo("work"));
    return true;
  }
  function signOut() {
    setSession(null);
    closeDialog();
    setActiveChat(null);
    router.push("/");
    toast("Demo session signed out. Browser-local sample data is retained until refresh.");
  }
  function contact(expertId: number) {
    requireAccount(() => setDialog({
      type: "contact",
      expertId
    }));
  }
  function jobChat(job: Opportunity, other?: string) {
    if (!session) {
      pending.current = account => openJobChat(job, account, other);
      setDialog({
        type: "auth"
      });
      return;
    }
    openJobChat(job, session, other);
  }
  function openJobChat(job: Opportunity, account: DemoAccount, other?: string) {
    const recipient = other ?? (job.by === account.alias ? job.worker ?? job.applicants[0] : job.by);
    if (!recipient || aliasKey(recipient) === aliasKey(account.alias)) {
      toast("No one to message yet.");
      return;
    }
    const existing = conversations.find(c => c.jobId === job.id && c.parts.includes(account.alias) && c.parts.includes(recipient));
    const id = existing?.id ?? nextId();
    if (!existing) setConversations(current => [{
      id,
      jobId: job.id,
      topic: job.title,
      route: job.type,
      parts: [account.alias, recipient],
      items: []
    }, ...current]);
    setActiveChat(id);
    router.push(routeTo("messages"));
  }
  const selected = dialog && "expertId" in dialog ? experts.find(e => e.id === dialog.expertId) : undefined;
  return <Context.Provider value={{
    experts,
    setExperts,
    opportunities,
    setOpportunities,
    submissions,
    setSubmissions,
    conversations,
    setConversations,
    wallets,
    setWallets,
    preferences,
    setPreferences,
    session,
    signIn,
    signOut,
    activeChat,
    setActiveChat,
    dialog,
    setDialog,
    closeDialog,
    requireAccount,
    contact,
    jobChat,
    toast,
    nextId
  }}>
    {children}
    {dialog && <Modal variant="marketplace" key={dialog.type} onClose={closeDialog} labelledBy="marketplace-dialog-title">
      <div className="mp-dialog">
      <button type="button" className="mp-dialog-close" onClick={closeDialog} aria-label="Close dialog">×</button>
      {dialog.type === "auth" && <AuthForm />}
      {dialog.type === "contact" && selected && <ContactForm expert={selected} />}
      {dialog.type === "feedback" && selected && <FeedbackForm expert={selected} kind={dialog.kind} />}
      </div>
    </Modal>}
    {notice && <div className="marketplace">
      <div className="mp-toast" role="status" aria-live="polite">{notice.text}<button type="button" className="mp-btn mp-ghost mp-small" style={{
          color: "white"
        }} onClick={() => setNotice(null)} aria-label="Dismiss notification">×</button>
      </div>
    </div>}
  </Context.Provider>;
}
export function DemoGate({
  children
}: {
  children: ReactNode;
}) {
  const {
    session,
    requireAccount
  } = useMarketplace();
  return session ? children : <div className="mp-panel">
    <h2>Try your demo workspace</h2>
    <p className="mp-intro">Choose the hirer or worker test account to explore this screen. No real account is created.</p>
    <button className="mp-btn mp-primary" onClick={() => requireAccount(() => {})}>Sign in to demo</button>
  </div>;
}
export function RouteOptions({
  name = "kind",
  id,
  onChange
}: {
  name?: string;
  id?: string;
  onChange?: (route: HiringRoute) => void;
}) {
  return <select id={id} className="mp-field" name={name} onChange={event => onChange?.(event.target.value as HiringRoute)}>
    <option>Hiring for company</option>
    <option>Hiring for myself</option>
  </select>;
}
