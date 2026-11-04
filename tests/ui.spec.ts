import { expect, test } from "@playwright/test";
import { cn } from "../lib/cn";

test("local Tailwind overrides replace named card defaults", () => {
  expect(cn("rounded-card p-6", "rounded-2xl p-2")).toBe("rounded-2xl p-2");
  expect(cn("rounded-2xl text-sm", "rounded-card text-base")).toBe(
    "rounded-card text-base",
  );
  expect(cn("border-border", false, "border-brand/30")).toBe("border-brand/30");
});
