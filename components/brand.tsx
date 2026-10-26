import Link from "next/link";
import { BrandLogo, type BrandVariant } from "./brand-logo";

export function Brand({ variant = "wordmark", href = "#top" }: { variant?: BrandVariant; href?: string }) {
  return (
    <Link className="brand" href={href} aria-label="rEcruit home">
      {variant === "owl" ? (
        <BrandLogo variant="owl" />
      ) : (
        <span className="brand-wordmark">
          r<span className="text-[#0828cb]">E</span>cruit
        </span>
      )}
    </Link>
  );
}
