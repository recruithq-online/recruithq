import { BrandLogo, type BrandVariant } from "./brand-logo";
import { Wordmark } from "./icons";

export function Brand({ variant = "wordmark" }: { variant?: BrandVariant }) {
  return (
    <a className="brand shrink-0" href="#top" aria-label="rEcruit home">
      {variant === "owl" ? <BrandLogo variant="owl" /> : <Wordmark />}
    </a>
  );
}
