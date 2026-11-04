import { MarketplaceView } from "@/components/marketplace/view";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
export default async function MarketplacePage({
  params,
}: {
  params: Promise<{
    view: string[];
  }>;
}) {
  const { view } = await params;
  const pages = [
    "explore",
    "list",
    "hire",
    "work",
    "messages",
    "reputation",
    "settings",
    "about",
  ];
  if (
    !(view.length === 1 && pages.includes(view[0])) &&
    !(view.length === 2 && view[0] === "profile" && /^\d+$/.test(view[1]))
  )
    notFound();
  return <MarketplaceView view={view} />;
}

const titles: Record<string, string> = {
  explore: "Discover expertise",
  list: "List your expertise",
  hire: "Hire for the work you need",
  work: "Your workspace",
  messages: "Messages",
  reputation: "Reputation review",
  settings: "Account settings",
  about: "Our approach",
  profile: "Professional record",
};
export async function generateMetadata({
  params,
}: {
  params: Promise<{ view: string[] }>;
}): Promise<Metadata> {
  const { view } = await params;
  return { title: `${titles[view[0]] ?? "Page not found"} — rEcruit` };
}
