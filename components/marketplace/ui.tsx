import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, type ComponentProps, type ReactNode } from "react";
import { routeTo, type MarketplaceExpert } from "@/lib/marketplace";
import { useMarketplace } from "./provider";
export function PageHeading({
  eyebrow,
  title,
  children
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return <>
    <span className="mp-eyebrow">
      <span className="mp-dot" />{eyebrow}</span>
    <h1>{title}</h1>{children && <p className="mp-subtext">{children}</p>}</>;
}
export function SignInPageHeading(props: ComponentProps<typeof PageHeading>) {
  const { session, setDialog } = useMarketplace();
  const router = useRouter();
  function goBack() {
    const navigation = "navigation" in window ? window.navigation : undefined;
    // Account for the first history entry even when forward entries exist.
    const canGoBack = navigation && typeof navigation === "object" && "canGoBack" in navigation
      ? Boolean(navigation.canGoBack)
      : window.history.length > 1;
    if (canGoBack) router.back();
    else router.push("/");
  }
  return (
    <>
      <button type="button" className="mp-btn mp-ghost mp-back-button" onClick={goBack} aria-label="Go back">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m12 19-7-7 7-7M5 12h14" />
        </svg>
        Back
      </button>
      <div className="mp-page-heading-actions">
        <div><PageHeading {...props} /></div>
        {!session && <button type="button" className="mp-btn mp-primary" onClick={() => setDialog({ type: "auth" })}>Sign in</button>}
      </div>
    </>
  );
}

export function Page({
  children
}: {
  children: ReactNode;
}) {
  return <section className="mp-page">
    <div className="mp-shell">{children}</div>
  </section>;
}
export function Empty({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return <div className="mp-empty">
    <b>{title}</b>{children}</div>;
}
export function Field({
  label,
  name,
  type = "text",
  required = true,
  full = false,
  placeholder,
  maxLength,
  min,
  max,
  value,
  readOnly = false
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  full?: boolean;
  placeholder?: string;
  maxLength?: number;
  min?: number;
  max?: number;
  value?: string;
  readOnly?: boolean;
}) {
  const id = useId();
  return <div className={`mp-group${full ? " mp-full" : ""}`}>
    <label htmlFor={id}>{label}{required && " *"}</label>
    <input id={id} className="mp-field" name={name} type={type} required={required} maxLength={maxLength ?? 100} min={min} max={max} step={type === "number" ? "0.01" : undefined} placeholder={placeholder} pattern={type === "text" && required ? ".*\\S.*" : undefined} {...readOnly ? {
      value: value ?? ""
    } : {
      defaultValue: value
    }} readOnly={readOnly} />
  </div>;
}
export function TextArea({
  label,
  name,
  maxLength = 1000,
  placeholder
}: {
  label: string;
  name: string;
  maxLength?: number;
  placeholder?: string;
}) {
  const id = useId();
  return <div className="mp-group mp-full">
    <label htmlFor={id}>{label} *</label>
    <textarea id={id} className="mp-field" name={name} required maxLength={maxLength} placeholder={placeholder} />
  </div>;
}
export function Avatar({
  alias
}: {
  alias: string;
}) {
  return <div className="mp-avatar" aria-hidden="true">{alias.split(/[\s-]/).map(s => Array.from(s)[0]).slice(0, 2).join("").toUpperCase()}</div>;
}
export function Verification({
  expert
}: {
  expert: MarketplaceExpert;
}) {
  return <span className={expert.verified ? "mp-badge" : "mp-skill"}>{expert.verified ? "✓ Verified sample profile" : "○ Profile not yet verified"}</span>;
}
export function Skills({
  skills
}: {
  skills: string[];
}) {
  return <div className="mp-skills">{skills.map(skill => <span className="mp-skill" key={skill}>{skill}</span>)}</div>;
}
export function ExpertCard({
  expert: e
}: {
  expert: MarketplaceExpert;
}) {
  const {
    contact
  } = useMarketplace();
  return <article className="mp-card">
    <div className="mp-top">
      <Avatar alias={e.alias} />
      <div>
        <h3>{e.alias}</h3>
        <div className="mp-muted">{e.category} · {e.availability}</div>
        <div style={{
          marginTop: 7
        }}>
          <Verification expert={e} />
        </div>
      </div>
    </div>
    <div className="mp-headline">{e.headline}</div>
    <div className="mp-rep">
      <div>
        <div className="mp-score">{e.score}<small>/100</small>
        </div>
        <div className="mp-muted">Reputation score</div>
      </div>
      <div className="mp-muted">↑ {e.vouches} vouches<br />✓ {e.projects} projects</div>
    </div>
    <Skills skills={e.skills.slice(0, 4)} />
    <p className="mp-desc">{e.about.slice(0, 116)}{e.about.length > 116 ? "…" : ""}</p>
    <div className="mp-actions">
      <Link className="mp-btn mp-secondary" href={routeTo(`profile/${e.id}`)}>View profile<span className="sr-only"> for {e.alias}</span>
      </Link>
      <button className="mp-btn mp-primary" onClick={() => contact(e.id)}>Hire ↗<span className="sr-only"> {e.alias}</span>
      </button>
    </div>
  </article>;
}
export function InfoList() {
  return <div className="mp-infolist">{[["Lead with what you do", "Make your service and strongest skills easy to understand."], ["Show useful proof", "Add portfolio links and project outcomes where possible."], ["Build reputation over time", "Collect contextual feedback from people who have worked with you."], ["Stay in control", "Use a public alias and share only the information you want clients to see."]].map(([title, description]) => <div className="mp-inforow" key={title}>
      <div className="mp-check">✓</div>
      <div>
        <strong>{title}</strong>
        <span>{description}</span>
      </div>
    </div>)}</div>;
}
