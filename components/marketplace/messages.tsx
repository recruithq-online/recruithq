"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, TextArea } from "@/components/ui/form-field";
import { cn } from "@/lib/cn";
import { AccountGate } from "./account-gate";
import { Empty, Page, WorkspacePageHeading } from "./page-layout";
import { useMarketplace } from "./provider";

export function Messages() {
  return (
    <Page>
      <WorkspacePageHeading eyebrow="Work together" title="Messages">
        Discuss scope, timelines, delivery, and feedback. Messages stay in this
        browser tab and are not delivered to anyone.
      </WorkspacePageHeading>
      <div className="mt-7 grid gap-6">
        <AccountGate>
          <MessageWorkspace />
        </AccountGate>
      </div>
    </Page>
  );
}

function MessageWorkspace() {
  const {
    session,
    conversations,
    setConversations,
    activeChat,
    setActiveChat,
    toast,
  } = useMarketplace();
  const [error, setError] = useState("");
  const log = useRef<HTMLDivElement>(null);
  const visibleConversation =
    conversations.find(
      (c) => c.id === activeChat && session && c.parts.includes(session.alias),
    ) ?? conversations.find((c) => session && c.parts.includes(session.alias));
  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [visibleConversation?.id, visibleConversation?.items.length]);
  if (!session) return null;
  const mine = conversations.filter((c) => c.parts.includes(session.alias)),
    selected = mine.find((c) => c.id === activeChat) ?? mine[0];
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
      time: new Date().toLocaleString("en-US"),
    };
    setConversations((current) =>
      current.map((c) =>
        c.id === selected.id && c.parts.includes(session.alias)
          ? {
              ...c,
              items: [...c.items, item],
            }
          : c,
      ),
    );
    event.currentTarget.reset();
    setError("");
    toast("Message added locally. Nothing was sent to a server or recipient.");
  }
  return (
    <div className="grid grid-cols-1 items-start gap-6 laptop:grid-cols-[minmax(0,1.25fr)_minmax(260px,.75fr)]">
      <Card>
        <h2 className="mb-3 text-xl tracking-tight">Conversations</h2>
        {mine.length ? (
          mine.map((c) => (
            <Button
              key={c.id}
              aria-pressed={selected?.id === c.id}
              onClick={() => {
                setActiveChat(c.id);
                setError("");
              }}
              variant="secondary"
              className={cn(
                `  mt-5 w-full${selected?.id === c.id ? " border-brand bg-brand text-white" : ""}`,
              )}
            >
              <span>
                <b>{c.parts.find((p) => p !== session.alias)}</b>
                <br />
                <small>
                  {c.topic.slice(0, 60)}
                  {c.topic.length > 60 ? "…" : ""}
                </small>
              </span>
            </Button>
          ))
        ) : (
          <p className="mb-6 max-w-2xl text-base leading-7">
            No conversations yet. Start one from an expert profile or
            opportunity.
          </p>
        )}
      </Card>
      {selected ? (
        <Card>
          <h2 className="mb-3 text-xl tracking-tight">
            {selected.parts.find((p) => p !== session.alias)}
          </h2>
          {selected.route && (
            <span
              className="inline-flex items-center gap-1.5 rounded-control px-2 py-1 text-xs font-medium text-brand"
              data-testid="status-badge"
            >
              {selected.route}
            </span>
          )}
          <p className="text-sm">{selected.topic}</p>
          <div
            ref={log}
            role="log"
            aria-label="Conversation"
            className="my-5 max-h-110 min-h-60 overflow-y-auto overscroll-contain"
          >
            {selected.items.length ? (
              selected.items.map((item, index) => (
                <Card
                  key={index}
                  className={cn(
                    `mt-3 p-4 ${item.by === session.alias ? " ml-auto rounded-br-none rounded-bl-lg bg-brand text-white" : ""}`,
                    "max-w-[92%] rounded-bl-none bg-surface",
                  )}
                  data-testid="feedback-entry"
                >
                  <div className="text-sm">
                    {item.by} · {item.time}
                  </div>
                  <p className="mt-2.5 text-base leading-7 wrap-anywhere whitespace-pre-wrap">
                    {item.text}
                  </p>
                </Card>
              ))
            ) : (
              <p className="mb-6 max-w-2xl text-base leading-7">
                Say hello to start this conversation.
              </p>
            )}
          </div>
          <form key={selected.id} onSubmit={submit}>
            <div className="grid grid-cols-1 gap-x-4.5 gap-y-5.5 nav:grid-cols-2">
              <TextArea
                label="Message"
                name="text"
                placeholder="Write a message…"
              />
              <Field
                label="Your alias"
                name="by"
                readOnly
                value={session.alias}
              />
              <Button>Send message →</Button>
            </div>
            {error && (
              <p
                role="alert"
                className="border-l-2 border-foreground bg-surface px-3 py-2.5 text-base leading-relaxed"
                data-testid="form-error"
              >
                {error}
              </p>
            )}
          </form>
        </Card>
      ) : (
        <Empty title="Your messages">
          Select a conversation or start one from a profile or job.
        </Empty>
      )}
    </div>
  );
}
