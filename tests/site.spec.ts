import { test, expect } from "@playwright/test";

test.use({ colorScheme: "light", reducedMotion: "reduce" });

for (const width of [320, 390, 768, 1440]) {
  test(`v3 homepage preview preserves main content at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    const fontRequests: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => {
      if (/fonts\.(googleapis|gstatic)\.com/.test(request.url()))
        fontRequests.push(request.url());
    });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Hire people for what they can actually do.",
    );
    await expect(
      page.getByText("MARKETPLACE FOR REPUTATION-BASED EXPERTISE", {
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Product Roadmap" }),
    ).toBeVisible();
    await expect(page.locator(".roadmap-phase")).toHaveCount(4);
    await expect(page.locator("#roadmap")).toContainText(
      "Phase 1 achieved. Phase 2 in progress.",
    );
    await expect(page.locator("#roadmap")).toContainText(
      "Status update | October 2026",
    );
    await expect(page.locator("#team")).toContainText("gemhunter");
    await expect(page.locator("#team")).toContainText("Chief rEcruiter");
    await expect(
      page.getByRole("img", { name: "gemhunter, owl in a suit and tie" }),
    ).toBeVisible();
    for (const id of [
      "search-preview",
      "record-preview",
      "expertise-preview",
      "trust-section",
      "join-preview",
    ]) {
      const preview = page.getByTestId(id);
      await expect(preview).toHaveCSS("filter", "blur(3px)");
      await expect(preview).toHaveCSS("opacity", "0.34");
      await expect(preview).toHaveCSS("pointer-events", "none");
      await expect(preview).toHaveAttribute("inert", "");
      await expect(preview).toHaveAttribute("aria-hidden", "true");
    }
    await expect(page.locator('[aria-roledescription="slide"]')).toHaveCount(6);
    await expect(page.getByTestId("expert-card")).toHaveCount(3);
    const footer = page.getByTestId("site-footer");
    for (const name of ["Discover", "Workspace", "Stay connected"]) {
      await expect(
        footer.getByRole("heading", { name, exact: true }),
      ).toBeVisible();
    }
    await expect(footer.getByTestId("wordmark")).toBeVisible();
    await expect(footer).toContainText("Beyond CVs. Built on Reputation.");
    for (const link of await footer.getByRole("link").all()) {
      expect(await link.getAttribute("href")).toMatch(
        /^(?:\/\/?$|#|https:\/\/|mailto:)/,
      );
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    expect(fontRequests).toEqual([]);
    expect(errors).toEqual([]);
    await page.screenshot({
      path: `test-results/main-home-${width}.png`,
      fullPage: true,
    });
  });
}

test("previews stay outside keyboard navigation and public links remain available", async ({
  page,
}) => {
  await page.goto("/");
  const triggers = page.getByRole("button", {
    name: "Join rEcruit Waitlist",
    exact: true,
  });
  await expect(triggers).toHaveCount(2);
  for (const trigger of await triggers.all())
    await expect(trigger).toBeDisabled();
  await expect(
    page.getByRole("link", { name: /Read whitepaper/i }),
  ).toHaveAttribute(
    "href",
    "https://recruithq.notion.site/rEcruit-Whitepaper-v1-0-4d352d5b58ed82d2ab9c01468d2e5e6c",
  );
  await expect(
    page.getByRole("link", { name: "company mail" }),
  ).toHaveAttribute("href", "mailto:support@recruithq.online");
  for (let step = 0; step < 20; step++) {
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(() =>
        Boolean(document.activeElement?.closest(".product-faded")),
      ),
    ).toBe(false);
  }
  await page
    .locator(".navlinks")
    .getByRole("link", { name: "Roadmap", exact: true })
    .click();
  await expect(page).toHaveURL(/#roadmap$/);
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("blurred record previews rotate and respect reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.clock.install();
  await page.goto("/");
  const carousel = page.getByTestId("record-preview");
  const first = carousel.locator('button[aria-label="Show Nova\'s record"]');
  const second = carousel.locator('button[aria-label="Show Vortex\'s record"]');
  await expect(first).toHaveAttribute("aria-current", "true");
  await page.clock.runFor(5500);
  await expect(second).toHaveAttribute("aria-current", "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(
    carousel.locator('button[aria-label="Pause record rotation"]'),
  ).toHaveCount(0);
  await page.clock.runFor(6000);
  await expect(second).toHaveAttribute("aria-current", "true");
});
