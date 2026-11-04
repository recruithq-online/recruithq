"use client";
import { Button, buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import Link from "next/link";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="min-h-[60vh] py-11 max-nav:pt-8 max-nav:pb-12.5">
      <Container>
        <div className="col-span-full flex flex-col items-center gap-2.5 rounded-card bg-surface px-7 py-12 text-center text-base leading-8">
          <span className="inline-flex items-center gap-2.5 font-mono text-xs leading-relaxed tracking-widest uppercase">
            LET’S TRY THAT AGAIN
          </span>
          <h1 className="my-3.5 text-[clamp(30px,3.4vw,44px)] font-medium tracking-[-.055em] max-nav:text-[34px]">
            We couldn’t load this page.
          </h1>
          <p>Try again, or return to the expertise directory.</p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <Button onClick={reset} className="mt-2.5">
              Try again
            </Button>
            <Link
              href="/marketplace/explore"
              className={buttonStyles({
                variant: "secondary",
                className: "mt-2.5",
              })}
            >
              Explore expertise
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
