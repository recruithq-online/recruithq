import { test, expect } from "@playwright/test";

for (const width of [320, 390, 768, 1440]) {
  test(`light and dark mode work at ${width}px`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(page.locator("#roadmap, #whitepaper")).toHaveCount(0);
    await expect(page.getByRole("link", { name: "company mail" })).toHaveAttribute("href", "mailto:support@recruithq.online");
    await expect(page.locator(".mp-site-brand")).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `test-results/light-${width}.png`, fullPage: true });
    await page.getByRole("navigation", { name: "Marketplace demo" }).getByRole("button", { name: "Switch to dark mode" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.locator("body")).toHaveCSS("background-color", "rgb(12, 19, 33)");
    await expect(page.locator(".mp-hero h1")).toHaveCSS("color", "rgb(237, 242, 255)");
    await page.screenshot({ path: `test-results/dark-${width}.png`, fullPage: true });
    await expect(page.getByRole("button", { name: /waitlist/i })).toHaveCount(0);
    await page.goto("/marketplace/profile/1");
    await page.getByRole("button", { name: "Contact / hire this expert" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toHaveCSS("background-color", "rgb(20, 31, 50)");
    await expect(dialog.getByRole("heading")).toHaveText("Sign in to rEcruit");
    await page.screenshot({ path: `test-results/dark-signin-${width}.png` });
    expect(await page.locator("main").evaluate(el => el.scrollWidth)).toBeLessThanOrEqual(width);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Switch to light mode" }).click();
    await expect(page.locator("body")).toHaveCSS("background-color", "rgb(255, 255, 255)");
    expect(errors).toEqual([]);
  });
}

test("follows the system theme until a choice is saved, then remembers it", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.emulateMedia({ colorScheme: "dark" });
  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});
