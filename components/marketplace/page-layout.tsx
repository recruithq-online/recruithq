"use client";
import { type ComponentProps, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { useMarketplace } from "./provider";
import { BackButton } from "./back-button";

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
      <span className="inline-flex items-center gap-2.5 font-display text-xs leading-relaxed tracking-widest uppercase">
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
  return <PageHeading {...props} />;
}

export function Page({
  children,
  back = false,
}: {
  children: ReactNode;
  back?: boolean;
}) {
  return (
    <section className="min-h-[60vh] py-11 max-nav:pt-8 max-nav:pb-12.5">
      <Container>
        {back && <BackButton />}
        {children}
      </Container>
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
