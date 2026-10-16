import { BrandLogo, type BrandVariant } from "./brand-logo";

export function Brand({ variant = "wordmark" }: { variant?: BrandVariant }) {
  return (
    <a className="brand" href="#top" aria-label="rEcruit home">
      <BrandLogo variant={variant} />
    </a>
  );
}
