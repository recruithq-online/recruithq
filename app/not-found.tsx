import { Icon } from "@/components/marketplace/icons";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import Link from "next/link";
export default function NotFound() {
  return (
    <section className="min-h-[60vh] py-11 max-nav:pt-8 max-nav:pb-12.5">
      <Container>
        <div className="col-span-full flex flex-col items-center gap-2.5 rounded-card bg-surface px-7 py-12 text-center text-base leading-8">
          <span className="inline-flex items-center gap-2.5 font-mono text-xs leading-relaxed tracking-widest uppercase">
            404 / A DIFFERENT DIRECTION
          </span>
          <h1 className="my-3.5 text-[clamp(30px,3.4vw,44px)] font-medium tracking-[-.055em] max-nav:text-[34px]">
            This page is off the record.
          </h1>
          <p>
            The page you’re looking for may have moved. There’s still good
            expertise to discover.
          </p>
          <Link
            href="/marketplace/explore"
            className={buttonStyles({
              className: "mt-2.5",
            })}
          >
            Explore expertise <Icon name="arrow" size={17} />
          </Link>
        </div>
      </Container>
    </section>
  );
}
