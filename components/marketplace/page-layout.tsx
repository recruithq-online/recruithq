"use client";
import { type ComponentProps, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { useMarketplace } from "./provider";

export function PageHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <>
      <span className="inline-flex items-center gap-2.5 font-mono text-xs leading-relaxed tracking-widest uppercase">
        {eyebrow}
      </span>
      <h1 className="my-3.5 text-[clamp(30px,3.4vw,44px)] font-medium tracking-[-.055em] max-nav:text-[34px]">
        {title}
      </h1>
      {children && (
        <p className="mb-6 max-w-2xl text-base leading-7">{children}</p>
      )}
    </>
  );
}

export function SignInPageHeading(props: ComponentProps<typeof PageHeading>) {
  const { session, setDialog } = useMarketplace();
  return (
    <>
      <BackButton />
      <div className="flex items-center justify-between gap-7 max-nav:flex-col max-nav:items-start max-nav:gap-0">
        <div>
          <PageHeading {...props} />
        </div>
        {!session && (
          <Button type="button" onClick={() => setDialog({ type: "auth" })}>
            Sign in
          </Button>
        )}
      </div>
    </>
  );
}

export function WorkspacePageHeading(
  props: ComponentProps<typeof PageHeading>,
) {
  const { session } = useMarketplace();
  return (
    <>
      {session && <BackButton />}
      <PageHeading {...props} />
    </>
  );
}

function BackButton() {
  const router = useRouter();
  function goBack() {
    const navigation = "navigation" in window ? window.navigation : undefined;
    const canGoBack =
      navigation && typeof navigation === "object" && "canGoBack" in navigation
        ? Boolean(navigation.canGoBack)
        : window.history.length > 1;
    if (canGoBack) router.back();
    else router.push("/");
  }
  return (
    <Button
      type="button"
      onClick={goBack}
      aria-label="Go back"
      variant="ghost"
      className="mb-3 min-h-8 pl-0 text-sm"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m12 19-7-7 7-7M5 12h14" />
      </svg>
      Back
    </Button>
  );
}

export function Page({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-[60vh] py-11 max-nav:pt-8 max-nav:pb-12.5">
      <Container>{children}</Container>
    </section>
  );
}

export function Empty({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="col-span-full flex flex-col items-center gap-2.5 rounded-card bg-surface px-7 py-12 text-center text-base leading-8">
      <b className="text-[17px] font-medium">{title}</b>
      {children}
    </div>
  );
}
