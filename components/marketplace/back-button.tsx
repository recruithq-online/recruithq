"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icon } from "./icons";

export function BackButton({ onClick }: { onClick?: () => void }) {
  const router = useRouter();

  function goBack() {
    const navigation = "navigation" in window ? window.navigation : undefined;
    const canGoBack =
      navigation && typeof navigation === "object" && "canGoBack" in navigation
        ? Boolean(navigation.canGoBack)
        : window.history.length > 1;
    if (canGoBack) router.back();
    else router.replace("/");
  }

  return (
    <Button
      type="button"
      variant="ghost"
      aria-label="Go back"
      className="mb-4 px-0 text-sm"
      onClick={onClick ?? goBack}
    >
      <Icon name="back" size={18} />
      Back
    </Button>
  );
}
