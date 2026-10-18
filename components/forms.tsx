"use client";

import { useState, type FormEvent } from "react";
import { useExperience } from "./experience-provider";
import { expertiseAreas } from "@/lib/waitlist";
import { BrandLogo } from "./brand-logo";

type Submission = "idle" | "submitting" | "success" | "error";
const submissionError =
  "We couldn’t submit your details just now. Please check your connection and try again. If this keeps happening, email team@recruithq.online.";

export function WaitlistForm() {
  const { closeModal } = useExperience();
  const [status, setStatus] = useState<Submission>("idle");
  const [errorMessage, setErrorMessage] = useState(submissionError);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting" || status === "success") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = new URLSearchParams();
    for (const [key, value] of data)
      if (typeof value === "string") payload.append(key, value.trim());
    setStatus("submitting");
    setErrorMessage(submissionError);
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: payload.toString(),
      });
      const confirmation: unknown = await response.json();
      if (!response.ok) {
        if (
          response.status === 400 &&
          typeof confirmation === "object" &&
          confirmation &&
          "error" in confirmation &&
          typeof confirmation.error === "string"
        ) {
          setErrorMessage(confirmation.error);
        }
        throw new Error("Submission failed");
      }
      if (
        typeof confirmation !== "object" ||
        !confirmation ||
        !("success" in confirmation) ||
        confirmation.success !== true ||
        !("emailId" in confirmation) ||
        typeof confirmation.emailId !== "string" ||
        !confirmation.emailId
      ) {
        throw new Error("Email was not confirmed");
      }
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <div className="waitlist-header">
        <button className="close" onClick={closeModal} aria-label="Close">
          ×
        </button>
        <div className="waitlist-symbol">
          <BrandLogo variant="owl" />
        </div>
        <div className="eyebrow">EARLY ACCESS</div>
        <h2 id="waitlist-title">Get on the rEcruit list.</h2>
        <p>
          Be among the first experts invited to build a reputation around the
          work you do.
        </p>
      </div>
      <form
        id="waitlistForm"
        className="waitlist-form"
        name="expert-waitlist"
        method="POST"
        action="/api/waitlist"
        onSubmit={submit}
      >
        <p className="sr-only" aria-hidden="true">
          <label>
            Leave this field empty:{" "}
            <input
              name="bot-field"
              tabIndex={-1}
              autoComplete="off"
              defaultValue=""
              readOnly
              data-lpignore="true"
              data-1p-ignore="true"
            />
          </label>
        </p>
        <div className="form-grid">
          <div>
            <label htmlFor="waitAlias">Alias</label>
            <input
              id="waitAlias"
              name="alias"
              maxLength={32}
              required
              autoComplete="nickname"
              placeholder="e.g. Atlas"
              pattern=".*\S.*"
            />
          </div>
          <div>
            <label htmlFor="waitEmail">Email address</label>
            <input
              id="waitEmail"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>
          <div className="wide">
            <label htmlFor="waitSkill">Your main area of expertise</label>
            <select id="waitSkill" name="expertise" required defaultValue="">
              <option value="">Select an expertise</option>
              {expertiseAreas.map((area) => (
                <option key={area}>{area}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button
            className="cta"
            type="submit"
            disabled
          >
            {status === "submitting" ? (
              "Submitting…"
            ) : status === "success" ? (
              "Submitted ✓"
            ) : status === "error" ? (
              "Try again"
            ) : (
              <>
                Join rEcruit Waitlist <span aria-hidden="true">→</span>
              </>
            )}
          </button>
          <button
            className="secondary-action"
            type="button"
            onClick={closeModal}
          >
            Not now
          </button>
        </div>
        <p className="waitlist-footnote">
         No spams. You'll get updates about rEcruit Early Access.
        </p>
      </form>
      {(status === "success" || status === "error") && (
        <div
          className="success"
          id="waitlistSuccess"
          role="status"
          aria-live="polite"
        >
          {status === "success"
            ? "You’re on the list. Thanks for joining rEcruit — we’ll be in touch when early access opens."
            : errorMessage}
        </div>
      )}
    </>
  );
}

interface ProfilePreview {
  alias: string;
  skill: string;
  rate: string;
  about: string;
}

export function ListExpertiseForm() {
  const { closeModal } = useExperience();
  const [preview, setPreview] = useState<ProfilePreview | null>(null);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPreview({
      alias: String(data.get("alias")).trim(),
      skill: String(data.get("skill")),
      rate: String(data.get("rate")),
      about: String(data.get("about")).trim(),
    });
  }
  return (
    <div>
      <button className="close" onClick={closeModal} aria-label="Close">
        ×
      </button>
      <div className="eyebrow">JOIN THE MARKETPLACE</div>
      <h2 className="mt-0" id="list-title">
        List Your Expertise
      </h2>
      <p className="text-[#667085] leading-[1.55]">
        Create a profile using an alias. No real name is required.
      </p>
      <form id="listForm" onSubmit={submit}>
        <div className="form-grid">
          <div>
            <label htmlFor="alias">Alias</label>
            <input
              id="alias"
              name="alias"
              required
              maxLength={24}
              placeholder="e.g. Atlas"
              pattern=".*\S.*"
            />
          </div>
          <div>
            <label htmlFor="skill">Primary expertise</label>
            <select id="skill" name="skill" required defaultValue="">
              <option value="">Choose a skill</option>
              {expertiseAreas
                .filter((area) => area !== "Operations & automation")
                .map((area) => (
                  <option key={area}>{area}</option>
                ))}
            </select>
          </div>
          <div>
            <label htmlFor="rate">Indicative hourly rate (USD)</label>
            <input
              id="rate"
              name="rate"
              type="number"
              min="1"
              required
              placeholder="25"
            />
          </div>
          <div>
            <label htmlFor="availability">Availability</label>
            <select id="availability" name="availability">
              <option>Available for work</option>
              <option>Part-time</option>
              <option>Project-based</option>
            </select>
          </div>
          <div className="wide">
            <label htmlFor="about">What can you deliver?</label>
            <textarea
              id="about"
              name="about"
              rows={3}
              maxLength={300}
              placeholder="Describe your expertise and the kind of work you do."
            />
          </div>
        </div>
        <div className="notice">
          Profiles will be reviewed before publication. Use an alias and avoid
          sharing private information.
        </div>
        <div className="form-actions">
          <button className="cta" type="submit">
            Preview profile
          </button>
          <button
            className="secondary-action"
            type="button"
            onClick={closeModal}
          >
            Cancel
          </button>
        </div>
      </form>
      {preview && (
        <div className="success" id="listSuccess" role="status">
          <b>✓ {preview.alias}</b> · {preview.skill} · ${preview.rate}/hr
          <br />
          {preview.about || "Expertise profile preview ready."}
          <br />
          <small>Your profile details are ready for review.</small>
        </div>
      )}
    </div>
  );
}
