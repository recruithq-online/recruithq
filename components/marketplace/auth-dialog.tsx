"use client";
import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import { Input, Select } from "@/components/ui/input";
import { accounts, type Role } from "@/lib/marketplace";
import { useMarketplace } from "./provider";

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
        setError("Enter the public Alias you want to use.");
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
      setError(
        "That email and password don't match. Select a sample account above.",
      );
      setPassword("");
      passwordInput.current?.focus();
    }
  }
  return (
    <>
      <DialogTitle id="marketplace-dialog-title">
        {mode === "signup" ? "Create Account" : "Sign In"}
      </DialogTitle>
      {mode === "signup" ? (
        <p className="mb-6 max-w-2xl text-base leading-7">
          This creates a temporary account for this browser session only. It is
          not saved and will be lost when you refresh.
        </p>
      ) : (
        <>
          <p className="mb-6 max-w-2xl text-base leading-7">
            Use a sample hirer or expert account below. Please don’t enter your
            personal credentials.
          </p>
          <div className="grid gap-2.5">
            {accounts.map((account) => (
              <div
                key={account.email}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2.5 rounded-control border border-border p-3"
              >
                <div className="grid min-w-0 gap-1 text-sm wrap-anywhere">
                  <strong className="text-sm font-medium">
                    {account.role === "hirer" ? "Hirer" : "Expect"} account
                  </strong>
                  <span>{account.email}</span>
                  <span>
                    Password: <code>{account.password}</code>
                  </span>
                </div>
                <Button
                  type="button"
                  onClick={() => {
                    setEmail(account.email);
                    setPassword(account.password);
                    setError("");
                  }}
                  variant="secondary"
                  size="small"
                >
                  Fill<span className="sr-only"> {account.role} account</span>
                </Button>
              </div>
            ))}
          </div>
        </>
      )}
      <form onSubmit={submit} noValidate className="space-y-4">
        {mode === "signup" && (
          <>
            <div className="flex min-w-0 flex-col gap-2">
              <label htmlFor="alias" className="text-sm font-semibold">
                Public Alias
              </label>
              <Input
                id="alias"
                required
                autoComplete="nickname"
                placeholder="e.g. PixelNorth"
                value={alias}
                onChange={(event) => setAlias(event.target.value)}
              />
            </div>
            <div className="flex min-w-0 flex-col gap-2">
              <label htmlFor="role" className="text-sm font-semibold">
               Join rEcruit To
              </label>
              <Select
                id="role"
                value={role}
                onChange={(event) => {
                  if (
                    event.target.value === "hirer" ||
                    event.target.value === "expect"
                  ) {
                    setRole(event.target.value);
                  }
                }}
              >
                <option value="expect">Offer my expertise</option>
                <option value="hirer">Hire expertise</option>
              </Select>
            </div>
          </>
        )}
        <div className="flex min-w-0 flex-col gap-2">
          <label htmlFor="email" className="text-sm font-semibold">
            Email
          </label>
          <Input
            ref={emailInput}
            id="email"
            type="email"
            required
            autoComplete="off"
            placeholder="you@example.com"
            aria-describedby={error ? "auth-error" : undefined}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <label htmlFor="password" className="text-sm font-semibold">
            Password
          </label>
          <Input
            ref={passwordInput}
            id="password"
            type={show ? "text" : "password"}
            required
            autoComplete={mode === "signup" ? "new-password" : "off"}
            placeholder={
              mode === "signup"
                ? "At least 8 characters"
                : "Enter your password"
            }
            aria-describedby={error ? "auth-error" : undefined}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {mode === "signup" && (
          <div className="flex min-w-0 flex-col gap-2">
            <label htmlFor="confirm-password" className="text-sm font-semibold">
              Confirm password
            </label>
            <Input
              ref={confirmPasswordInput}
              id="confirm-password"
              type={show ? "text" : "password"}
              required
              autoComplete="new-password"
              placeholder="Re-enter your password"
              aria-describedby={error ? "auth-error" : undefined}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </div>
        )}
        <label className="my-4 flex items-center gap-2.5 text-sm">
          <input
            type="checkbox"
            checked={show}
            onChange={(event) => setShow(event.target.checked)}
          />
          Show password
        </label>
        {error && (
          <p
            id="auth-error"
            role="alert"
            className="border-l-2 border-foreground bg-surface px-3 py-2.5 text-base leading-relaxed"
            data-testid="form-error"
          >
            {error}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-2.5 pt-5">
          <Button type="button" onClick={closeDialog} variant="secondary">
            Cancel
          </Button>
          <Button>{mode === "signup" ? "Create account" : "Sign in"}</Button>
        </div>
        <p className="flex items-center justify-center gap-1.5">
          {mode === "signup" ? "Already have an account?" : "New to rEcruit?"}
          <Button
            type="button"
            onClick={() => {
              setMode(mode === "signup" ? "auth" : "signup");
              setError("");
            }}
            variant="ghost"
            size="small"
          >
            {mode === "signup" ? "Sign in" : "Sign up"}
          </Button>
        </p>
      </form>
    </>
  );
}
