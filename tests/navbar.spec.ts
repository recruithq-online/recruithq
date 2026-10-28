import { test, expect } from "@playwright/test";

test("sign up creates a temporary session and opens the dashboard", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Sign up", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "Create an account" })).toBeVisible();
  await expect(dialog).toContainText("temporary account for this browser session only");
  await dialog.getByLabel("Public alias").fill("NewExpect");
  await dialog.getByLabel("Email").fill("new-expect@example.test");
  await dialog.getByLabel("Password", { exact: true }).fill("Temporary123!");
  await dialog.getByLabel("Confirm password").fill("Temporary123!");
  await dialog.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/marketplace\/work$/);
  await expect(page.getByRole("button", { name: "Go back" })).toBeVisible();
  await expect(page.locator(".footer").getByRole("heading", { name: "Workspace" })).toBeVisible();
});

test("source navbar routes and authenticated controls work", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Marketplace" });
  await expect(nav.getByRole("link", { name: "Messages", exact: true })).toHaveCount(0);
  await expect(nav.getByRole("link", { name: "Dashboard", exact: true })).toHaveCount(0);
  await expect(page.locator(".footer").getByRole("heading", { name: "Workspace" })).toHaveCount(0);
  await expect(page.locator(".footer-grid")).not.toHaveClass(/footer-grid-authenticated/);
  expect(await page.locator(".footer-grid").evaluate((grid) => getComputedStyle(grid).gridTemplateColumns.split(" ").length)).toBe(3);
  await nav.getByRole("link", { name: "Get started" }).click();
  await expect(page).toHaveURL(/\/marketplace\/list$/);
  await page.goto("/marketplace/profile/1");
  await page.getByRole("button", { name: "Contact / hire this expert" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Fill hirer account" }).click();
  await dialog.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(dialog.getByRole("heading")).toHaveText("Start a hiring conversation");
  await dialog.getByRole("button", { name: "Close dialog" }).click();
  await expect(page.locator(".footer").getByRole("heading", { name: "Workspace" })).toBeVisible();
  await expect(page.locator(".footer").getByRole("link", { name: "Dashboard", exact: true })).toBeVisible();
  await expect(page.locator(".footer-grid")).toHaveClass(/footer-grid-authenticated/);
  expect(await page.locator(".footer-grid").evaluate((grid) => getComputedStyle(grid).gridTemplateColumns.split(" ").length)).toBe(4);
  await expect(nav.getByRole("link", { name: "Messages", exact: true })).toBeVisible();
  await nav.getByRole("link", { name: "Dashboard", exact: true }).click();
  await expect(page).toHaveURL(/\/marketplace\/work$/);
  await expect(page.getByRole("button", { name: "Go back" })).toBeVisible();
  await nav.getByRole("link", { name: "Messages", exact: true }).click();
  await expect(page).toHaveURL(/\/marketplace\/messages$/);
  await expect(page.getByRole("button", { name: "Go back" })).toBeVisible();
  await page.getByRole("button", { name: "Go back" }).click();
  await expect(page).toHaveURL(/\/marketplace\/work$/);
  await nav.getByRole("link", { name: "rEcruit home" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(nav.getByRole("link", { name: "Dashboard", exact: true })).toBeVisible();
  for (const width of [320, 390, 638, 768, 900, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    if (width <= 620) {
      await nav.getByRole("button", { name: "Open navigation menu" }).click();
      await expect(nav.getByRole("link", { name: "Dashboard", exact: true })).toBeVisible();
    } else {
      await expect(nav.getByRole("link", { name: "Dashboard", exact: true })).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    if (width <= 620) {
      await nav.getByRole("button", { name: "Close navigation menu" }).click();
    }
  }
  await page.locator(".footer").getByRole("link", { name: "Settings", exact: true }).click();
  await page.getByRole("main").getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(nav.getByRole("link", { name: "Dashboard", exact: true })).toHaveCount(0);
  await expect(page.locator(".footer").getByRole("heading", { name: "Workspace" })).toHaveCount(0);
});

for (const width of [320, 390, 768, 1440]) {
  test(`source navbar stays visible and fits at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Marketplace" });
    await expect(nav).toHaveCSS("height", width <= 620 ? "64px" : "72px");
    const menuButton = nav.getByRole("button", { name: "Open navigation menu" });
    if (width <= 620) {
      await expect(menuButton).toBeVisible();
      await expect(nav.getByRole("link", { name: "Explore", exact: true })).toBeHidden();
      await menuButton.click();
      await expect(nav.getByRole("button", { name: "Close navigation menu" })).toHaveAttribute("aria-expanded", "true");
      await expect(nav.getByRole("link", { name: "Explore", exact: true })).toBeVisible();
    } else {
      await expect(menuButton).toBeHidden();
      await expect(nav.getByRole("link", { name: "Explore", exact: true })).toBeVisible();
    }
    await expect(nav.getByRole("link", { name: "Get started" })).toBeVisible();
    await expect(nav.getByRole("button", { name: "Switch to dark mode" })).toBeVisible();
    const team = nav.locator(".mp-site-links").getByRole("link", { name: "Team", exact: true });
    await expect(team).toBeVisible();
    await team.click();
    await expect(page).toHaveURL(/#team$/);
    if (width <= 620) await expect(nav.getByRole("button", { name: "Open navigation menu" })).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#team .person")).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 700));
    expect((await nav.boundingBox())!.y).toBe(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `test-results/navbar-${width}.png` });
  });
}
