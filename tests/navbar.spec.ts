import { test, expect } from "@playwright/test";

for (const width of [320, 390, 900, 1440]) {
  test(`signup and authenticated navigation fit at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    if (width < 900) {
      await page.getByRole("button", { name: "Open navigation menu" }).click();
      await page
        .getByRole("button", { name: "Create Account", exact: true })
        .click();
    } else {
      await page.getByRole("button", { name: "Get started" }).click();
    }
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("heading")).toHaveText("Create Account");
    await dialog.getByLabel("Public Alias").fill("NewExpert");
    await dialog.getByLabel("Email").fill("expert@example.test");
    await dialog.getByLabel("Password", { exact: true }).fill("Temporary123!");
    await dialog.getByLabel("Confirm password").fill("Temporary123!");
    await dialog.getByRole("button", { name: "Create account" }).click();
    await expect(page).toHaveURL(/\/marketplace\/work$/);
    await expect(
      page.getByRole("navigation", { name: "Workspace", exact: true }),
    ).toBeVisible();
    if (width >= 900) {
      await expect(page.locator("[data-testid=sidebar-account]")).toContainText(
        "NewExpert",
      );
    }
    await expect(
      page
        .getByRole("navigation", { name: "Marketplace", exact: true })
        .getByRole("link", { name: "Dashboard", exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
  });
}

for (const width of [320, 390, 638, 768, 900, 1024, 1440]) {
  test(`navigation exposes product and workspace at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const nav = page.getByRole("navigation", {
      name: "Marketplace",
      exact: true,
    });
    const menu = nav.getByRole("button", { name: "Open navigation menu" });
    if (width < 900) {
      await menu.click();
      await expect(
        nav.getByRole("link", { name: "Explore", exact: true }),
      ).toBeVisible();
      await expect(
        nav.getByRole("link", { name: "Dashboard", exact: true }),
      ).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(menu).toBeFocused();
      await expect(menu).toHaveAttribute("aria-expanded", "false");
      await menu.click();
    }
    await nav.getByRole("link", { name: "Explore", exact: true }).click();
    await expect(page).toHaveURL(/explore$/);
    await expect(
      nav.locator('[data-testid=primary-links] a[href="/marketplace/explore"]'),
    ).toHaveAttribute("aria-current", "page");
    if (width < 900)
      await expect(menu).toHaveAttribute("aria-expanded", "false");
    await page.evaluate(() => window.scrollTo(0, 700));
    expect((await nav.boundingBox())!.y).toBe(0);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
  });
}
