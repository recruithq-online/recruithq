import { test, expect } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { createWaitlistEmail } from "../lib/waitlist-email";

const example = {
  alias: "Atlas",
  email: "atlas@example.com",
  expertise: "Design",
};

for (const width of [320, 390, 800]) {
  test(`email is readable at ${width}px`, async ({ page }) => {
    const email = createWaitlistEmail(example);
    await page.setViewportSize({ width, height: 1200 });
    await page.setContent(email.html);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "A new expert is on the list.",
      { useInnerText: true },
    );
    await expect(
      page.getByRole("heading", { name: "Meet Atlas." }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Reply to this expert" }),
    ).toHaveAttribute("href", /^mailto:atlas@example\.com\?subject=/);
    await expect(page.getByText("Design", { exact: true })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    mkdirSync("test-results", { recursive: true });
    writeFileSync("test-results/waitlist-email-preview.html", email.html);
    await page.screenshot({
      path: `test-results/waitlist-email-${width}.png`,
      fullPage: true,
    });
  });
}

test("email escapes submitted text and preserves the plain-text version", async ({
  page,
}) => {
  const alias = '<img src=x onerror="alert(1)">';
  const email = createWaitlistEmail({
    ...example,
    alias,
    expertise: "Design & development",
  });
  await page.setContent(email.html);
  await expect(page.locator("img, script")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: `Meet ${alias}.` }),
  ).toBeVisible();
  expect(email.html).toContain("Design &amp; development");
  expect(email.text).toContain(`Public alias: ${alias}`);
});
