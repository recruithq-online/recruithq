import ImageWelcome from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Icon, type IconName } from "./icons";

const pathways: {
  title: string;
  description: string;
  icon: IconName;
  href: string;
}[] = [
  {
    title: "Explore",
    description: "Browse Experts and their Reputation.",
    icon: "compass",
    href: "/marketplace/explore",
  },
  {
    title: "Hire",
    description: "Bring in an Expert for your project or your company's.",
    icon: "briefcase",
    href: "/marketplace/hire",
  },
  {
    title: "List",
    description: "List your expertise and build a vouchable Reputation.",
    icon: "add-square",
    href: "/marketplace/list",
  },
];

export function Welcome() {
  return (
    <section
      id="top"
      aria-labelledby="welcome-heading"
      className="py-10 nav:py-14 scroll-mt-20"
    >
      <Container>
        <div className="flex items-center gap-3 nav:gap-4">
          <ImageWelcome
            src="/stickers/hello.svg"
            alt="Hi!"
            width={72}
            height={72}
            className="size-16 shrink-0 nav:size-20"
          />
          <div className="min-w-0 pt-14">
            <h2
              id="welcome-heading"
              className="text-[clamp(23px,2.6vw,32px)] font-semibold leading-tight tracking-[-.04em]"
            >
              What would you like to do?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground/65 nav:text-base">
              Find experts, bring one in, or list what you do.
            </p>
          </div>
        </div>
        <div className="my-6 grid grid-cols-1 gap-4 min-[768px]:grid-cols-3 nav:mt-8 nav:gap-5">
          {pathways.map(({ title, description, icon, href }) => (
            <Link
              key={title}
              href={href}
              className="group relative flex h-full items-center gap-4 rounded-[20px] border border-border bg-surface p-5 motion-safe:transition-colors hover:border-brand min-[768px]:max-laptop:flex-col min-[768px]:max-laptop:items-start nav:p-6"
            >
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand min-[768px]:size-12 laptop:size-14">
                <Icon name={icon} size={26} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xl font-semibold tracking-[-.03em]">
                  {title}
                </span>
                <span className="mt-1.5 block text-sm leading-relaxed text-foreground/65">
                  {description}
                </span>
              </span>
              <Icon
                name="chevron-right"
                className="text-foreground/65 group-hover:text-brand min-[768px]:max-laptop:absolute min-[768px]:max-laptop:top-8 min-[768px]:max-laptop:right-5"
              />
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
