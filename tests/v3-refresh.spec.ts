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
  test(`welcome cards are clear and open v3 routes at ${width}px`, async ({
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
      await expect(
        page.getByRole("button", { name: /^(Go back|Back)$/ }),
      ).toHaveCount(0);
      await page
        .locator("header")
        .getByRole("link", { name: "rEcruit home" })
        .click();
    }
  });
}

test("signed-in workspace, listing and profiles have no back controls", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/marketplace/work");
  await page
    .getByRole("button", { name: "Sign in to continue", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Email", { exact: true }).fill("expect@recruit.test");
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
  await check();
  await navigation.getByRole("link", { name: "Explore", exact: true }).click();
  await page.getByRole("link", { name: "View profile for Nova" }).click();
  await expect(page).toHaveURL(/\/marketplace\/profile\/1$/);
  await check();
});
