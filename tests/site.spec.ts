import { test, expect } from "@playwright/test";

test("product entry explains reputation and keeps legacy signup sections absent", async ({
  page,
}) => {
  const fontRequests: string[] = [];
  page.on("request", (request) => {
    if (/fonts\.(googleapis|gstatic)\.com/.test(request.url()))
      fontRequests.push(request.url());
  });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  expect(fontRequests).toEqual([]);
  expect(
    await page
      .locator("html")
      .evaluate((el) =>
        getComputedStyle(el).getPropertyValue("--font-dm-sans"),
      ),
  ).not.toBe("");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Built on",
  );
  await expect(
    page.locator("#roadmap, #whitepaper, .coming-soon, .waitlist-cta"),
  ).toHaveCount(0);
  await expect(page.locator("[data-testid=professional-record]")).toContainText(
    "Accountable refute",
  );
  await expect(
    page.getByRole("link", { name: "company mail" }),
  ).toHaveAttribute("href", "mailto:support@recruithq.online");
  await page.goto("/marketplace/about");
  await expect(page.locator("#team")).toContainText("gemhunter");
});
test("old early-access URL redirects to the product", async ({ page }) => {
  await page.goto("/early-access");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("[data-testid=home-hero] h1")).toContainText(
    "Reputation.",
  );
});
