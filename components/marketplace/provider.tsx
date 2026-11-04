"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
  accounts,
  aliasKey,
  initialMarketplaceExperts,
  routeTo,
  type Conversation,
  type MarketplaceAccount,
  type MarketplaceExpert,
  type Opportunity,
  type Role,
  type Submission,
  type Wallet,
} from "@/lib/marketplace";
import { AuthForm } from "./auth-dialog";
import { ContactForm } from "./contact-dialog";
import { FeedbackForm } from "./feedback-dialog";

type Setter<T> = Dispatch<SetStateAction<T>>;

type Dialog =
  | {
      type: "auth";
    }
  | {
      type: "signup";
    }
  | {
      type: "contact";
      expertId: number;
    }
  | {
      type: "feedback";
      expertId: number;
      kind: "vouch" | "refute";
    }
  | null;

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
  preferences: Record<
    string,
    {
      apps: boolean;
      msgs: boolean;
    }
  >;
  setPreferences: Setter<
    Record<
      string,
      {
        apps: boolean;
        msgs: boolean;
      }
    >
  >;
  session: MarketplaceAccount | null;
  signIn: (email: string, password: string) => boolean;
  signUp: (alias: string, email: string, password: string, role: Role) => void;
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

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [experts, setExperts] = useState(initialMarketplaceExperts);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [wallets, setWallets] = useState<Record<string, Wallet>>({});
  const [preferences, setPreferences] = useState<
    Record<
      string,
      {
        apps: boolean;
        msgs: boolean;
      }
    >
  >({});
  const [session, setSession] = useState<MarketplaceAccount | null>(null);
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
  const pending = useRef<((account: MarketplaceAccount) => void) | null>(null);
  const nextId = () => ++sequence.current;
  const closeDialog = useCallback(() => {
    setDialog(null);
    pending.current = null;
  }, []);
  function toast(text: string) {
    setNotice({
      id: nextId(),
      text,
    });
  }
  function requireAccount(action: () => void) {
    if (session) action();
    else {
      pending.current = action;
      setDialog({
        type: "auth",
      });
    }
  }
  function signIn(email: string, password: string) {
    const account = accounts.find(
      (a) => a.email === email.trim().toLowerCase() && a.password === password,
    );
    if (!account) return false;
    setSession(account);
    const continuation = pending.current;
    pending.current = null;
    setDialog(null);
    toast(
      `Signed in as ${account.alias} (${account.role}). This is a local session only.`,
    );
    if (continuation) continuation(account);
    else router.push(routeTo("work"));
    return true;
  }
  function signUp(alias: string, email: string, password: string, role: Role) {
    const account: MarketplaceAccount = {
      alias: alias.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
    };
    setSession(account);
    const continuation = pending.current;
    pending.current = null;
    setDialog(null);
    toast(
      `Temporary account created for ${account.alias}. It is only available in this browser session.`,
    );
    if (continuation) continuation(account);
    else router.push(routeTo("work"));
  }
  function signOut() {
    setSession(null);
    closeDialog();
    setActiveChat(null);
    router.push("/");
    toast("Signed out. Browser-local sample data is retained until refresh.");
  }
  function contact(expertId: number) {
    requireAccount(() =>
      setDialog({
        type: "contact",
        expertId,
      }),
    );
  }
  function jobChat(job: Opportunity, other?: string) {
    if (!session) {
      pending.current = (account) => openJobChat(job, account, other);
      setDialog({
        type: "auth",
      });
      return;
    }
    openJobChat(job, session, other);
  }
  function openJobChat(
    job: Opportunity,
    account: MarketplaceAccount,
    other?: string,
  ) {
    const recipient =
      other ??
      (job.by === account.alias ? (job.expect ?? job.applicants[0]) : job.by);
    if (!recipient || aliasKey(recipient) === aliasKey(account.alias)) {
      toast("No one to message yet.");
      return;
    }
    const existing = conversations.find(
      (c) =>
        c.jobId === job.id &&
        c.parts.includes(account.alias) &&
        c.parts.includes(recipient),
    );
    const id = existing?.id ?? nextId();
    if (!existing)
      setConversations((current) => [
        {
          id,
          jobId: job.id,
          topic: job.title,
          route: job.type,
          parts: [account.alias, recipient],
          items: [],
        },
        ...current,
      ]);
    setActiveChat(id);
    router.push(routeTo("messages"));
  }
  const selected =
    dialog && "expertId" in dialog
      ? experts.find((e) => e.id === dialog.expertId)
      : undefined;
  return (
    <Context.Provider
      value={{
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
        signUp,
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
        nextId,
      }}
    >
      {children}
      {dialog && (
        <Dialog
          key={dialog.type}
          onClose={closeDialog}
          labelledBy="marketplace-dialog-title"
        >
          <div>
            <button
              type="button"
              onClick={closeDialog}
              aria-label="Close dialog"
              className="absolute top-5 right-5 grid size-10 place-items-center rounded-full bg-surface text-[22px] leading-none max-nav:top-4 max-nav:right-4"
            >
              ×
            </button>
            {(dialog.type === "auth" || dialog.type === "signup") && (
              <AuthForm initialMode={dialog.type} />
            )}
            {dialog.type === "contact" && selected && (
              <ContactForm expert={selected} />
            )}
            {dialog.type === "feedback" && selected && (
              <FeedbackForm expert={selected} kind={dialog.kind} />
            )}
          </div>
        </Dialog>
      )}
      {notice && (
        <div>
          <div
            role="status"
            aria-live="polite"
            className="fixed right-6 bottom-6 z-110 flex max-w-[min(400px,calc(100vw-32px))] items-center gap-3 rounded-control bg-black px-4.5 py-4 text-sm text-white motion-safe:animate-toast max-nav:right-4 max-nav:bottom-4"
          >
            {notice.text}
            <Button
              type="button"
              onClick={() => setNotice(null)}
              aria-label="Dismiss notification"
              variant="ghost"
              size="small"
              className="text-white"
            >
              ×
            </Button>
          </div>
        </div>
      )}
    </Context.Provider>
  );
}
