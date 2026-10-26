import { test, expect } from "@playwright/test";

test("source navbar routes and authenticated controls work", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Marketplace demo" });
  await expect(nav.getByRole("link", { name: "Messages", exact: true })).toHaveCount(0);
  await expect(nav.getByRole("link", { name: "Dashboard", exact: true })).toHaveCount(0);
  await nav.getByRole("link", { name: "Get started" }).click();
  await expect(page).toHaveURL(/\/marketplace\/list$/);
  await page.goto("/marketplace/profile/1");
  await page.getByRole("button", { name: "Contact / hire this expert" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Fill hirer account" }).click();
  await dialog.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(dialog.getByRole("heading")).toHaveText("Start a hiring conversation");
  await dialog.getByRole("button", { name: "Close dialog" }).click();
  await expect(nav.getByRole("link", { name: "Messages", exact: true })).toBeVisible();
  await nav.getByRole("link", { name: "Dashboard", exact: true }).click();
  await expect(page).toHaveURL(/\/marketplace\/work$/);
  await nav.getByRole("link", { name: "rEcruit home" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(nav.getByRole("link", { name: "Dashboard", exact: true })).toBeVisible();
  for (const width of [320, 390, 638, 768, 900, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(nav.getByRole("link", { name: "Dashboard", exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
  await page.locator(".footer").getByRole("link", { name: "Settings", exact: true }).click();
  await page.getByRole("main").getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(nav.getByRole("link", { name: "Dashboard", exact: true })).toHaveCount(0);
});

for (const width of [320, 390, 768, 1440]) {
  test(`source navbar stays visible and fits at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Marketplace demo" });
    await expect(nav).toHaveCSS("height", width <= 620 ? "64px" : "72px");
    await expect(nav.getByRole("link", { name: "Get started" })).toBeVisible();
    if (width <= 620) {
      await expect(nav.getByRole("link", { name: "Explore", exact: true })).toBeHidden();
      await expect(nav.getByRole("button", { name: "Sign in", exact: true })).toBeHidden();
    } else await expect(nav.getByRole("link", { name: "Explore", exact: true })).toBeVisible();
    await expect(nav.getByRole("button", { name: "Switch to dark mode" })).toBeVisible();
    const team = nav.locator(".mp-site-links").getByRole("link", { name: "Team", exact: true });
    if (width <= 620) await expect(team).toBeHidden();
    else {
      await team.click();
      await expect(page).toHaveURL(/#team$/);
      await expect(page.locator("#team .person")).toBeVisible();
    }
    await page.evaluate(() => window.scrollTo(0, 700));
    expect((await nav.boundingBox())!.y).toBe(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `test-results/navbar-${width}.png` });
  });
}
