import { test, expect } from "@playwright/test";

test("discovery filters survive reload and saved experts survive navigation", async ({
  page,
}) => {
  await page.goto("/marketplace/explore");
  await page.getByLabel("Search experts").fill("rust");
  await expect(page.locator("[data-testid=expert-card] h3")).toHaveText(
    "Vortex",
  );
  await expect(page).toHaveURL(/q=rust/);
  await page.reload();
  await expect(page.getByLabel("Search experts")).toHaveValue("rust");
  await page.getByRole("button", { name: "Save Vortex", exact: true }).click();
  await page.getByLabel("Search experts").fill("");
  await page.getByRole("button", { name: "Saved 1" }).click();
  await expect(page.locator("[data-testid=expert-card] h3")).toHaveText(
    "Vortex",
  );
  await page.reload();
  await expect(page.locator("[data-testid=expert-card] h3")).toHaveText(
    "Vortex",
  );
  await page
    .getByRole("button", { name: "Unsave Vortex", exact: true })
    .click();
  await expect(page.getByText("Your shortlist starts here")).toBeVisible();
  await page
    .getByRole("button", { name: "Discover experts", exact: true })
    .click();
  await page.getByLabel("Available for projects", { exact: true }).check();
  await expect(page.locator("[data-testid=expert-card]")).toHaveCount(4);
  await page.getByLabel("Minimum reputation").selectOption("95");
  await expect(page.locator("[data-testid=expert-card] h3")).toHaveText("Nova");
  await page.getByLabel("Maximum hourly rate").fill("30");
  await expect(page.getByText("No experts found")).toBeVisible();
  await page
    .getByRole("button", { name: "Clear filters", exact: true })
    .click();
  await expect(page.locator("[data-testid=expert-card]")).toHaveCount(6);
});

test("homepage search and categories lead into evidence-led discovery", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByTestId("professional-record")).toHaveCSS(
    "color",
    "rgb(0, 0, 0)",
  );
  await expect(page.getByTestId("expert-card").first()).toHaveCSS(
    "border-top-width",
    "1px",
  );
  await page.getByRole("button", { name: "Development", exact: true }).click();
  await expect(page.locator("[data-testid=expert-card] h3")).toHaveText(
    "Vortex",
  );
  await page.getByLabel("What expertise do you need?").fill("Figma");
  await page.getByRole("button", { name: "Find experts", exact: true }).click();
  await expect(page).toHaveURL(/explore\?q=Figma/);
  await expect(page.locator("[data-testid=expert-card] h3")).toHaveText("Nova");
  await expect(page.locator("[data-testid=reputation-signals]")).toContainText(
    "1 refute",
  );
  await page.getByRole("link", { name: "View profile for Nova" }).click();
  await page.getByRole("button", { name: "Refutes", exact: true }).click();
  await expect(page.locator("[data-testid=feedback-entry]")).toHaveCount(1);
  await expect(page.locator("[data-testid=feedback-entry]")).toContainText(
    "sole designer",
  );
  await page.getByText("How is this score calculated?").click();
  await expect(page.locator("[data-testid=score-explanation]")).toContainText(
    "subtracts 2",
  );
});

for (const width of [320, 390, 768, 1440]) {
  test(`product layout and keyboard entry fit at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("link", { name: "Skip to content" }),
    ).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main-content")).toBeFocused();
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    for (const route of [
      "/",
      "/marketplace/explore",
      "/marketplace/profile/1",
      "/marketplace/list",
      "/marketplace/hire",
      "/marketplace/work",
      "/marketplace/messages",
      "/marketplace/reputation",
      "/marketplace/settings",
      "/marketplace/about",
    ]) {
      await page.goto(route);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
        route,
      ).toBeLessThanOrEqual(width);
      const presentationIssues = await page.locator("body").evaluate((body) =>
        Array.from(body.querySelectorAll<HTMLElement>("*")).flatMap((el) => {
          if (!el.getClientRects().length) return [];
          const style = getComputedStyle(el);
          const issues: string[] = [];
          if (style.boxShadow !== "none" || style.textShadow !== "none")
            issues.push(`${el.tagName}: unexpected shadow`);
          if (
            Array.from(el.childNodes).some(
              (node) =>
                node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
            ) &&
            parseFloat(style.fontSize) < 12
          )
            issues.push(`${el.tagName}: text smaller than 12px`);
          if (
            el.matches("input:not([type=checkbox]), select, textarea") &&
            parseFloat(style.fontSize) < 16
          )
            issues.push(`${el.tagName}: form text smaller than 16px`);
          return issues;
        }),
      );
      expect(presentationIssues, route).toEqual([]);
    }
    await page.goto("/");
    await page.screenshot({
      path: `test-results/redesign-home-${width}.png`,
      fullPage: true,
    });
  });
}

test("mobile filters and account creation remain reachable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/marketplace/explore");
  await expect(page.getByLabel("Filter by category")).toBeHidden();
  await page
    .getByRole("button", { name: "Refine your search", exact: true })
    .click();
  await page.getByLabel("Filter by category").selectOption("Design");
  await page.getByRole("button", { name: "Hide filters", exact: true }).click();
  await expect(page.locator("[data-testid=expert-card] h3")).toHaveText("Nova");
  await page
    .getByRole("button", { name: "Remove filter Design", exact: true })
    .click();
  await expect(page.locator("[data-testid=expert-card]")).toHaveCount(6);
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  await page
    .getByRole("button", { name: "Create an account", exact: true })
    .click();
  await expect(page.getByRole("dialog").getByRole("heading")).toHaveText(
    "Create an account",
  );
});

test("hiring choices keep the brief and fee estimate in sync", async ({
  page,
}) => {
  await page.goto("/marketplace/hire");
  await page.getByLabel("Agreed contract / job value").fill("300");
  await expect(page.locator("form")).toContainText("$315.00");
  await page.getByRole("button", { name: "Choose personal hiring" }).click();
  await expect(page.getByLabel("Hiring type")).toHaveValue("Hiring for myself");
  await expect(page.locator("form")).toContainText("$307.50");
  await page.getByLabel("Hiring type").selectOption("Hiring for company");
  await expect(
    page.getByRole("button", { name: "Company hiring selected" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("form")).toContainText("$315.00");
});

test("cinematic motion respects reduced motion and navigation stays shadow-free on scroll", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator("[data-hero-line] em")).toHaveCSS(
    "animation-name",
    "headline-rise",
  );
  const header = page.locator("[data-testid=site-header]");
  await expect(header).toHaveCSS("box-shadow", "none");
  await page.evaluate(() => window.scrollTo(0, 700));
  await expect(header).toHaveCSS("box-shadow", "none");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("[data-hero-line] em")).toHaveCSS(
    "animation-name",
    "none",
  );
  await page.locator("[data-testid=trust-section]").scrollIntoViewIfNeeded();
  expect(
    await page
      .locator("[data-testid=trust-content]")
      .evaluate((el) => el.getAnimations({ subtree: true }).length),
  ).toBe(0);
  await expect(
    page.getByRole("link", { name: "Understand the rEcruit approach" }),
  ).toBeVisible();
});
