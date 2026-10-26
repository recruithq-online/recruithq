import { test, expect } from "@playwright/test";

test("marketplace has no old early-access sections or waitlist controls", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#roadmap, #whitepaper, .coming-soon, .waitlist-cta")).toHaveCount(0);
  await expect(page.getByRole("link", { name: /roadmap|whitepaper|waitlist/i })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /waitlist/i })).toHaveCount(0);
  await expect(page.getByRole("navigation", { name: "Marketplace demo" })).toHaveCount(1);
  await expect(page.locator("#team .person")).toHaveCount(1);
  await expect(page.getByRole("navigation", { name: "Marketplace demo" }).getByRole("link", { name: "Team", exact: true })).toHaveAttribute("href", "#team");
  await expect(page.locator(".footer")).toContainText("Explore expertise");
  await expect(page.locator(".footer")).toContainText("Dashboard");
  await expect(page.getByRole("link", { name: "company mail" })).toHaveAttribute("href", "mailto:support@recruithq.online");
});

test("old early-access URL redirects to the marketplace", async ({ page }) => {
  await page.goto("/early-access");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator(".mp-hero h1")).toContainText("Hire people for");
  await expect(page.getByText("Coming Soon.", { exact: true })).toHaveCount(0);
});
