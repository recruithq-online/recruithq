"use client";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import { Field, TextArea } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { aliasKey, type MarketplaceExpert } from "@/lib/marketplace";
import { useMarketplace } from "./provider";

export function FeedbackForm({
  expert,
  kind,
}: {
  expert: MarketplaceExpert;
  kind: "vouch" | "refute";
}) {
  const { submissions, setSubmissions, nextId, closeDialog, toast } =
    useMarketplace();
  const [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget),
      by = String(data.get("by")).trim(),
      text = String(data.get("msg")).trim(),
      files = data
        .getAll("proof")
        .filter((f): f is File => f instanceof File && !!f.name);
    if (!by || !text || !files.length) {
      setError("Add your alias, explanation, and proof.");
      return;
    }
    if (
      files.length > 5 ||
      files.some(
        (f) =>
          f.size > 10 * 1024 * 1024 ||
          !/\.(png|jpe?g|gif|webp|pdf|docx?|txt)$/i.test(f.name),
      )
    ) {
      setError("Attach up to 5 images, PDF, DOC, or TXT files, 10 MB each.");
      return;
    }
    if (aliasKey(by) === aliasKey(expert.alias)) {
      setError("You cannot vouch for or refute your own profile.");
      return;
    }
    if (
      submissions.some(
        (s) =>
          s.expertId === expert.id &&
          s.type === kind &&
          aliasKey(s.by) === aliasKey(by) &&
          s.status !== "Rejected",
      )
    ) {
      setError("You already have a submission of this type for this expert.");
      return;
    }
    setSubmissions((current) => [
      {
        id: nextId(),
        expertId: expert.id,
        type: kind,
        by,
        text,
        files: files.map((f) => f.name),
        status: "Pending Review",
      },
      ...current,
    ]);
    closeDialog();
    toast("Your evidence submitted for review. Reputation score unchanged.");
  }
  return (
    <>
      <DialogTitle id="marketplace-dialog-title">
        {kind === "vouch" ? "Vouch for" : "Refute a claim about"} {expert.alias}
      </DialogTitle>
      <p className="mb-6 max-w-2xl text-base leading-7">
        Explain the real work interaction and attach proof. Pending submissions
        do not affect reputation.
      </p>
      <form onSubmit={submit} className="space-y-4">
        <Field
          label="Your professional alias"
          name="by"
          maxLength={40}
          placeholder="e.g. PastHirer"
        />
        <TextArea
          label="What happened?"
          name="msg"
          maxLength={800}
          placeholder={
            kind === "vouch"
              ? "Describe the work, your role, and what went well."
              : "Explain the claim, what happened, and your evidence."
          }
        />
        <div className="flex min-w-0 flex-col gap-2">
          <label htmlFor="evidence-proof" className="text-sm font-semibold">
            Attach proof *
          </label>
          <Input
            id="evidence-proof"
            type="file"
            name="proof"
            accept=".png,.jpg,.jpeg,.gif,.webp,.pdf,.doc,.docx,.txt"
            multiple
            required
          />
        </div>
        <p className="my-3.5 text-sm leading-7">
          Only filenames stay in this browser tab. No files are uploaded. Review
          approval is simulated.
        </p>
        {error && (
          <p
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
          <Button variant={kind}>Submit for review</Button>
        </div>
      </form>
    </>
  );
}
