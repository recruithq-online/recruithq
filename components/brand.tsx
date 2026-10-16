import { BrandLogo, type BrandVariant } from "./brand-logo";

export function Brand({ variant = "wordmark" }: { variant?: BrandVariant }) {
  return (
    <a className="brand" href="#top" aria-label="rEcruit home">
      {variant === "owl" ? (
        <BrandLogo variant="owl" />
      ) : (
        <span className="brand-wordmark">
          r<span className="text-[#0828cb]">E</span>cruit
        </span>
      )}
    </a>
  );
}
