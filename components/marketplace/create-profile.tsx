"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, TextArea } from "@/components/ui/form-field";
import { Select } from "@/components/ui/input";
import {
  aliasKey,
  availabilityOptions,
  categories,
  routeTo,
  safePortfolio,
} from "@/lib/marketplace";
import { Page, SignInPageHeading } from "./page-layout";
import { InfoList } from "./profile-tips";
import { useMarketplace } from "./provider";

export function CreateProfile() {
  const { experts, setExperts, nextId, toast } = useMarketplace();
  const router = useRouter();
  const [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget),
      text = (name: string) => String(data.get(name) ?? "").trim();
    const alias = text("alias"),
      headline = text("headline"),
      about = text("about"),
      category = text("category"),
      availability = text("availability"),
      rate = Number(data.get("rate")),
      skills = [
        ...new Set(
          text("skills")
            .split(",")
            .map((s) => s.trim().slice(0, 30))
            .filter(Boolean),
        ),
      ].slice(0, 10),
      portfolio = text("portfolio") ? safePortfolio(text("portfolio")) : "";
    if (!alias || !headline || !about || !skills.length) {
      setError("Complete every required field and add at least one skill.");
      return;
    }
    if (
      !categories.includes(category) ||
      !availabilityOptions.includes(availability) ||
      !Number.isFinite(rate) ||
      rate < 0 ||
      rate > 10000
    ) {
      setError(
        "Choose a valid category, availability, and rate between $0 and $10,000.",
      );
      return;
    }
    if (text("portfolio") && !portfolio) {
      setError("Portfolio link must start with http:// or https://.");
      return;
    }
    if (experts.some((e) => aliasKey(e.alias) === aliasKey(alias))) {
      setError(
        "That alias is already taken. Choose another professional alias.",
      );
      return;
    }
    const id = nextId();
    setExperts((current) => [
      {
        id,
        alias,
        headline,
        about,
        category,
        availability,
        rate,
        skills,
        portfolio,
        score: 50,
        vouches: 0,
        refutes: 0,
        projects: 0,
        verified: false,
        feedback: [],
      },
      ...current,
    ]);
    router.push(routeTo(`profile/${id}`));
    toast(
      "Your profile added in this browser tab. It is not published to a live marketplace.",
    );
  }
  return (
    <Page back>
      <SignInPageHeading
        eyebrow="Make your work visible"
        title="List Your Expertise"
      >
        Create a profile that tells clients what you do, how you work, and what
        makes you worth hiring.
      </SignInPageHeading>
      <div className="grid-cols-1 items-start laptop:grid-cols-[minmax(0,1.25fr)_minmax(260px,.75fr)] mt-7 grid gap-6">
        <Card>
          <h2 className="mt-2.5 mb-3 text-xl tracking-tight">
            Create your expertise profile
          </h2>
          <p className="mb-6 max-w-2xl text-base leading-7">
            Preview your professional record. Your profile stays in this tab and
            resets on refresh.
          </p>
          <form onSubmit={submit}>
            <div className="grid grid-cols-1 gap-x-4.5 gap-y-5.5 nav:grid-cols-2">
              <Field
                label="Professional alias"
                name="alias"
                maxLength={32}
                placeholder="e.g. PixelNorth"
              />
              <div className="flex min-w-0 flex-col gap-2">
                <label
                  htmlFor="profile-category"
                  className="text-sm font-semibold"
                >
                  Main category *
                </label>
                <Select
                  id="profile-category"
                  name="category"
                  required
                  defaultValue=""
                >
                  <option value="">Choose category</option>
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </Select>
              </div>
              <Field
                label="What do you help people do?"
                name="headline"
                maxLength={90}
                full
                placeholder="e.g. I help early-stage teams build clear product experiences"
              />
              <Field
                label="Skills (comma-separated)"
                name="skills"
                maxLength={200}
                full
                placeholder="e.g. UI/UX, Figma, prototyping"
              />
              <Field
                label="Starting rate (USD/hour)"
                name="rate"
                type="number"
                min={0}
                max={10000}
                placeholder="e.g. 25"
              />
              <div className="flex min-w-0 flex-col gap-2">
                <label
                  htmlFor="profile-availability"
                  className="text-sm font-semibold"
                >
                  Availability
                </label>
                <Select id="profile-availability" name="availability">
                  {availabilityOptions.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </Select>
              </div>
              <TextArea
                label="About your expertise"
                name="about"
                maxLength={500}
                placeholder="Describe your approach, experience, and the work you do best…"
              />
              <Field
                label="Portfolio or work link (optional)"
                name="portfolio"
                type="url"
                required={false}
                maxLength={200}
                full
                placeholder="https://"
              />
            </div>
            <p className="my-3.5 text-sm leading-7">
              Use a professional alias. Do not enter private contact details or
              sensitive personal information.
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
            <Button className="mt-5 w-full">Publish profile →</Button>
          </form>
        </Card>
        <Card as="aside">
          <h2 className="mt-2.5 mb-3 text-xl tracking-tight">
            A profile built around reputation
          </h2>
          <p className="mb-6 max-w-2xl text-base leading-7">
            Help a client understand what you can deliver and why others
            recommend working with you.
          </p>
          <InfoList />
          <Card className="mt-3 p-4" data-testid="feedback-entry">
            <b>Start with the work, not the claims.</b>
            <p className="mt-2.5 text-sm leading-7 wrap-anywhere whitespace-pre-wrap">
              A new profile starts at 50/100. Vouches and refutes contribute to
              your record after evidence review.
            </p>
          </Card>
        </Card>
      </div>
    </Page>
  );
}
