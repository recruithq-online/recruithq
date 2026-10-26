import { notFound } from "next/navigation";
import { MarketplaceView } from "@/components/marketplace/view";
export default async function MarketplacePage({
  params
}: {
  params: Promise<{
    view: string[];
  }>;
}) {
  const {
    view
  } = await params;
  const pages = ["explore", "list", "hire", "work", "messages", "reputation", "settings", "about"];
  if (!(view.length === 1 && pages.includes(view[0])) && !(view.length === 2 && view[0] === "profile" && /^\d+$/.test(view[1]))) notFound();
  return <MarketplaceView view={view} />;
}
