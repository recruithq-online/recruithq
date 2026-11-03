"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { accounts, aliasKey, routeTo, type MarketplaceExpert, type HiringRoute, type Role } from "@/lib/marketplace";
import { RouteOptions, useMarketplace } from "./provider";
import { Field, TextArea } from "./ui";
export function AuthForm({ initialMode }: { initialMode: "auth" | "signup" }) {
  const { signIn, signUp, closeDialog } = useMarketplace();
  const emailInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);
  const confirmPasswordInput = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"auth" | "signup">(initialMode);
  const [alias, setAlias] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>("expect");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!email.trim() || !emailInput.current?.validity.valid) {
      setError("Enter a valid email address.");
      emailInput.current?.focus();
      return;
    }
    if (mode === "signup") {
      if (!alias.trim()) {
        setError("Enter the public alias you want to use.");
        return;
      }
      if (password.length < 8) {
        setError("Choose a password with at least 8 characters.");
        passwordInput.current?.focus();
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        confirmPasswordInput.current?.focus();
        return;
      }
      signUp(alias, email, password, role);
      return;
    }
    if (!password) {
      setError("Enter the account password, or select a sample account above.");
      passwordInput.current?.focus();
      return;
    }
    if (!signIn(email, password)) {
      setError("That email and password don't match. Select a sample account above.");
      setPassword("");
      passwordInput.current?.focus();
    }
  }

  return (
    <>
      <h2 id="marketplace-dialog-title">{mode === "signup" ? "Create an account" : "Sign in to rEcruit"}</h2>
      {mode === "signup" ? (
        <p className="mp-intro">This creates a temporary account for this browser session only. It is not saved and will be lost when you refresh.</p>
      ) : (
        <>
          <p className="mp-intro">Use a sample hirer or expect account below. Please don’t enter your personal credentials.</p>
          <div className="mp-sample-accounts">
            {accounts.map(account => (
              <div className="mp-sample-account" key={account.email}>
                <div className="mp-account-details">
                  <strong>{account.role === "hirer" ? "Hirer" : "Expect"} account</strong>
                  <span>{account.email}</span>
                  <span>Password: <code>{account.password}</code></span>
                </div>
                <button type="button" className="mp-btn mp-secondary mp-small" onClick={() => {
                  setEmail(account.email);
                  setPassword(account.password);
                  setError("");
                }}>
                  Fill<span className="sr-only"> {account.role} account</span>
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      <form onSubmit={submit} noValidate>
        {mode === "signup" && (
          <>
            <div className="mp-group">
              <label htmlFor="alias">Public alias</label>
              <input id="alias" className="mp-field" required autoComplete="nickname" value={alias} onChange={event => setAlias(event.target.value)} />
            </div>
            <div className="mp-group">
              <label htmlFor="role">I want to</label>
              <select id="role" className="mp-field" value={role} onChange={event => {
                if (event.target.value === "hirer" || event.target.value === "expect") {
                  setRole(event.target.value);
                }
              }}>
                <option value="expect">Offer my expertise</option>
                <option value="hirer">Hire expertise</option>
              </select>
            </div>
          </>
        )}
        <div className="mp-group">
          <label htmlFor="email">Email</label>
          <input ref={emailInput} id="email" className="mp-field" type="email" required autoComplete="off" aria-describedby={error ? "auth-error" : undefined} value={email} onChange={event => setEmail(event.target.value)} />
        </div>
        <div className="mp-group">
          <label htmlFor="password">Password</label>
          <input ref={passwordInput} id="password" className="mp-field" type={show ? "text" : "password"} required autoComplete={mode === "signup" ? "new-password" : "off"} aria-describedby={error ? "auth-error" : undefined} value={password} onChange={event => setPassword(event.target.value)} />
        </div>
        {mode === "signup" && (
          <div className="mp-group">
            <label htmlFor="confirm-password">Confirm password</label>
            <input ref={confirmPasswordInput} id="confirm-password" className="mp-field" type={show ? "text" : "password"} required autoComplete="new-password" aria-describedby={error ? "auth-error" : undefined} value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} />
          </div>
        )}
        <label className="mp-checkbox">
          <input type="checkbox" checked={show} onChange={event => setShow(event.target.checked)} />Show password
        </label>
        {error && <p id="auth-error" role="alert" className="mp-error">{error}</p>}
        <div className="mp-modalactions">
          <button type="button" className="mp-btn mp-secondary" onClick={closeDialog}>Cancel</button>
          <button className="mp-btn mp-primary">{mode === "signup" ? "Create account" : "Sign in"}</button>
        </div>
        <p className="mp-auth-switch">
          {mode === "signup" ? "Already have an account?" : "New to rEcruit?"}
          <button type="button" className="mp-btn mp-ghost mp-small" onClick={() => {
            setMode(mode === "signup" ? "auth" : "signup");
            setError("");
          }}>{mode === "signup" ? "Sign in" : "Sign up"}</button>
        </p>
      </form>
    </>
  );
}
export function ContactForm({
  expert
}: {
  expert: MarketplaceExpert;
}) {
  const {
    session,
    conversations,
    setConversations,
    setActiveChat,
    nextId,
    closeDialog,
    toast
  } = useMarketplace();
  const router = useRouter();
  const [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session) return;
    const data = new FormData(event.currentTarget),
      topic = String(data.get("topic")).trim(),
      route = String(data.get("kind")) as HiringRoute;
    if (!topic) {
      setError("Describe the work you need.");
      return;
    }
    if (aliasKey(session.alias) === aliasKey(expert.alias)) {
      setError("You cannot start a hiring conversation with yourself.");
      return;
    }
    const existing = conversations.find(c => c.topic === topic && c.route === route && c.parts.includes(session.alias) && c.parts.includes(expert.alias));
    const id = existing?.id ?? nextId();
    if (!existing) setConversations(current => [{
      id,
      topic,
      route,
      parts: [session.alias, expert.alias],
      items: []
    }, ...current]);
    setActiveChat(id);
    closeDialog();
    router.push(routeTo("messages"));
    toast("Conversation created in this browser. No message has been delivered.");
  }
  return <>
    <h2 id="marketplace-dialog-title">Start a hiring conversation</h2>
    <p className="mp-intro">Connect with <b>{expert.alias}</b>. Company hiring happens off-platform with a separate 5% company fee. Personal hiring adds 2.5% to the hirer checkout. This conversation is stored in this browser only.</p>
    <form onSubmit={submit}>
      <div className="mp-group">
        <label htmlFor="contact-route">Hiring route</label>
        <RouteOptions id="contact-route" />
      </div>
      <TextArea label="What do you need?" name="topic" maxLength={300} placeholder="Describe role, deliverables, timing and terms" />{error && <p role="alert" className="mp-error">{error}</p>}<div className="mp-modalactions">
        <button type="button" className="mp-btn mp-secondary" onClick={closeDialog}>Cancel</button>
        <button className="mp-btn mp-primary">Start conversation</button>
      </div>
    </form>
  </>;
}
export function FeedbackForm({
  expert,
  kind
}: {
  expert: MarketplaceExpert;
  kind: "vouch" | "refute";
}) {
  const {
    submissions,
    setSubmissions,
    nextId,
    closeDialog,
    toast
  } = useMarketplace();
  const [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget),
      by = String(data.get("by")).trim(),
      text = String(data.get("msg")).trim(),
      files = data.getAll("proof").filter((f): f is File => f instanceof File && !!f.name);
    if (!by || !text || !files.length) {
      setError("Add your alias, explanation, and proof.");
      return;
    }
    if (files.length > 5 || files.some(f => f.size > 10 * 1024 * 1024 || !/\.(png|jpe?g|gif|webp|pdf|docx?|txt)$/i.test(f.name))) {
      setError("Attach up to 5 images, PDF, DOC, or TXT files, 10 MB each.");
      return;
    }
    if (aliasKey(by) === aliasKey(expert.alias)) {
      setError("You cannot vouch for or refute your own profile.");
      return;
    }
    if (submissions.some(s => s.expertId === expert.id && s.type === kind && aliasKey(s.by) === aliasKey(by) && s.status !== "Rejected")) {
      setError("You already have a submission of this type for this expert.");
      return;
    }
    setSubmissions(current => [{
      id: nextId(),
      expertId: expert.id,
      type: kind,
      by,
      text,
      files: files.map(f => f.name),
      status: "Pending Review"
    }, ...current]);
    closeDialog();
    toast(" evidence submitted for review. Reputation score unchanged.");
  }
  return <>
    <h2 id="marketplace-dialog-title">{kind === "vouch" ? "Vouch for" : "Refute a claim about"} {expert.alias}</h2>
    <p className="mp-intro">Explain the real work interaction and attach proof. Pending submissions do not affect reputation.</p>
    <form onSubmit={submit}>
      <Field label="Your professional alias" name="by" maxLength={40} />
      <TextArea label="What happened?" name="msg" maxLength={800} />
      <div className="mp-group">
        <label htmlFor="evidence-proof">Attach proof *</label>
        <input className="mp-field" id="evidence-proof" type="file" name="proof" accept=".png,.jpg,.jpeg,.gif,.webp,.pdf,.doc,.docx,.txt" multiple required />
      </div>
      <p className="mp-note">Only filenames stay in this browser tab. No files are uploaded. Review approval is simulated.</p>{error && <p role="alert" className="mp-error">{error}</p>}<div className="mp-modalactions">
        <button type="button" className="mp-btn mp-secondary" onClick={closeDialog}>Cancel</button>
        <button className={`mp-btn mp-${kind}`}>Submit for review</button>
      </div>
    </form>
  </>;
}
