import { expect, test } from "@playwright/test";

test.use({ reducedMotion: "reduce", colorScheme: "light" });

for (const width of [390, 1440]) {
  test(`Reputation navigation displays its title at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/marketplace/work");
    await page
      .getByRole("navigation", { name: "Workspace", exact: true })
      .getByRole("link", { name: "Reputation", exact: true })
      .click();
    await expect(page).toHaveURL(/\/marketplace\/reputation$/);
    await expect(
      page.getByRole("heading", { name: "Reputation Review", exact: true }),
    ).toBeVisible();
  });
}

for (const width of [320, 390, 768, 1440]) {
  test(`welcome cards open v3 routes with Back to home at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const welcome = page.getByRole("region", {
      name: "What would you like to do?",
    });
    await expect(welcome).toBeVisible();
    await expect(welcome.getByRole("img", { name: "Hi!" })).toBeVisible();
    await expect(welcome.getByRole("link")).toHaveCount(3);
    const obscured = await welcome.evaluate((element) => {
      for (
        let current: Element | null = element;
        current;
        current = current.parentElement
      ) {
        const style = getComputedStyle(current);
        if (
          style.filter !== "none" ||
          Number(style.opacity) < 1 ||
          current.hasAttribute("inert") ||
          current.getAttribute("aria-hidden") === "true"
        )
          return true;
      }
      return false;
    });
    expect(obscured).toBe(false);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    await welcome.screenshot({ path: `test-results/v3-welcome-${width}.png` });
    for (const [label, route] of [
      ["Explore", "explore"],
      ["Hire", "hire"],
      ["List", "list"],
    ]) {
      const link = welcome.getByRole("link", {
        name: new RegExp(`^${label}\\b`),
      });
      await expect(link).toHaveAttribute("href", `/marketplace/${route}`);
      await link.click();
      await expect(page).toHaveURL(new RegExp(`/marketplace/${route}$`));
      const back = page.getByRole("button", { name: "Go back", exact: true });
      await expect(back.locator("svg")).toBeVisible();
      await back.click();
      await expect(page).toHaveURL(/\/$/);
    }
  });
}

test("signed-in listing has Back while workspace and profiles keep their navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/marketplace/work");
  await page
    .getByRole("button", { name: "Sign in to continue", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Email", { exact: true }).fill("expert@recruit.test");
  await dialog.getByLabel("Password", { exact: true }).fill("Test1234!");
  await dialog.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(dialog).toHaveCount(0);
  const check = async () => {
    await expect(
      page.getByRole("button", { name: /^(Go back|Back)$/ }),
    ).toHaveCount(0);
    await expect(page.getByRole("link", { name: /Back to/i })).toHaveCount(0);
  };
  await check();
  for (const name of ["Messages", "Reputation", "Settings", "Dashboard"]) {
    await page
      .getByRole("navigation", { name: "Workspace", exact: true })
      .getByRole("link", { name, exact: true })
      .click();
    await check();
  }
  const navigation = page.getByRole("navigation", {
    name: "Marketplace",
    exact: true,
  });
  await navigation
    .getByRole("link", { name: "List Expertise", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/marketplace\/list$/);
  await page.getByRole("button", { name: "Go back", exact: true }).click();
  await expect(page).toHaveURL(/\/marketplace\/work$/);
  await check();
  await navigation.getByRole("link", { name: "Explore", exact: true }).click();
  await page.getByRole("link", { name: "View profile for Nova" }).click();
  await expect(page).toHaveURL(/\/marketplace\/profile\/1$/);
  await check();
});

for (const route of ["explore", "hire", "list"]) {
  test(`direct entry to ${route} has a Home fallback`, async ({ page }) => {
    await page.goto(`/marketplace/${route}`);
    await page.getByRole("button", { name: "Go back", exact: true }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(
      page.getByRole("region", { name: "What would you like to do?" }),
    ).toBeVisible();
  });
}

for (const width of [320, 1440]) {
  test(`sign-in Back restores the page and previous form at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/marketplace/explore?q=Figma");
    const open = page
      .locator("header")
      .getByRole("button", { name: "Sign In", exact: true });
    await open.click();
    const dialog = page.getByRole("dialog");
    const back = dialog.getByRole("button", { name: "Go back", exact: true });
    await expect(back.locator("svg")).toBeVisible();
    await back.click();
    await expect(dialog).toHaveCount(0);
    await expect(page).toHaveURL(/\/marketplace\/explore\?q=Figma$/);
    await expect(open).toBeFocused();
    await expect(page.getByLabel("Search experts")).toHaveValue("Figma");
    await open.click();
    await dialog.getByRole("button", { name: "Sign up", exact: true }).click();
    await expect(dialog.getByRole("heading")).toHaveText("Create Account");
    await back.click();
    await expect(dialog.getByRole("heading")).toHaveText("Sign In");
    await dialog.screenshot({ path: `test-results/signin-back-${width}.png` });
    await back.click();
    await expect(dialog).toHaveCount(0);
    await expect(page).toHaveURL(/\/marketplace\/explore\?q=Figma$/);
  });
}

test("Hire Back restores the filtered Explore page", async ({ page }) => {
  await page.goto("/marketplace/explore?q=Figma");
  await page
    .getByRole("link", { name: "Have a brief? Post an opportunity" })
    .click();
  await expect(page).toHaveURL(/\/marketplace\/hire$/);
  await page.getByRole("button", { name: "Go back", exact: true }).click();
  await expect(page).toHaveURL(/\/marketplace\/explore\?q=Figma$/);
  await expect(page.getByLabel("Search experts")).toHaveValue("Figma");
});
