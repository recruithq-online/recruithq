"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import { TextArea } from "@/components/ui/form-field";
import {
  aliasKey,
  routeTo,
  type HiringRoute,
  type MarketplaceExpert,
} from "@/lib/marketplace";
import { RouteOptions } from "./hiring-route-select";
import { useMarketplace } from "./provider";

export function ContactForm({ expert }: { expert: MarketplaceExpert }) {
  const {
    session,
    conversations,
    setConversations,
    setActiveChat,
    nextId,
    closeDialog,
    toast,
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
    const existing = conversations.find(
      (c) =>
        c.topic === topic &&
        c.route === route &&
        c.parts.includes(session.alias) &&
        c.parts.includes(expert.alias),
    );
    const id = existing?.id ?? nextId();
    if (!existing)
      setConversations((current) => [
        {
          id,
          topic,
          route,
          parts: [session.alias, expert.alias],
          items: [],
        },
        ...current,
      ]);
    setActiveChat(id);
    closeDialog();
    router.push(routeTo("messages"));
    toast(
      "Conversation created in this browser. No message has been delivered.",
    );
  }
  return (
    <>
      <DialogTitle id="marketplace-dialog-title">
        Start a hiring conversation
      </DialogTitle>
      <p className="mb-6 max-w-2xl text-base leading-7">
        Connect with <b>{expert.alias}</b>. Company hiring happens off-platform
        with a separate 5% company fee. Personal hiring adds 2.5% to the hirer
        checkout. This conversation is stored in this browser only.
      </p>
      <form onSubmit={submit} className="space-y-4">
        <div className="flex min-w-0 flex-col gap-2">
          <label htmlFor="contact-route" className="text-sm font-semibold">
            Hiring route
          </label>
          <RouteOptions id="contact-route" />
        </div>
        <TextArea
          label="What do you need?"
          name="topic"
          maxLength={300}
          placeholder="Describe role, deliverables, timing and terms"
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
        <div className="mt-6 flex justify-end gap-2.5 pt-5">
          <Button type="button" onClick={closeDialog} variant="secondary">
            Cancel
          </Button>
          <Button>Start conversation</Button>
        </div>
      </form>
    </>
  );
}
