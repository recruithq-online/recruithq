import { test, expect } from "@playwright/test";

test("record carousel supports navigation, swiping, and the matching profile link", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const carousel = page.getByRole("region", { name: "Professional records" });
  const profileLink = carousel.getByRole("link");
  await expect(profileLink).toHaveAttribute("href", "/marketplace/profile/1");
  await carousel
    .getByRole("button", { name: "Next professional record" })
    .click();
  await expect(profileLink).toHaveAttribute("href", "/marketplace/profile/2");
  await carousel
    .getByRole("button", { name: "Previous professional record" })
    .click();
  await carousel
    .getByRole("button", { name: "Previous professional record" })
    .click();
  await expect(profileLink).toHaveAttribute("href", "/marketplace/profile/6");
  await carousel.getByRole("button", { name: "Show Aurora's record" }).click();
  await expect(profileLink).toHaveAttribute("href", "/marketplace/profile/3");
  await carousel.getByTestId("professional-record").evaluate((track) => {
    track.scrollTo({ left: track.clientWidth, behavior: "instant" });
  });
  await expect(profileLink).toHaveAttribute("href", "/marketplace/profile/2");
  await profileLink.click();
  await expect(page).toHaveURL(/\/marketplace\/profile\/2$/);
});

test("record rotation advances, pauses, and follows reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.clock.install();
  await page.goto("/");
  const carousel = page.getByRole("region", { name: "Professional records" });
  const first = carousel.getByRole("button", { name: "Show Nova's record" });
  const second = carousel.getByRole("button", { name: "Show Vortex's record" });
  await expect(
    carousel.getByRole("button", { name: "Pause record rotation" }),
  ).toBeVisible();
  await page.clock.runFor(5500);
  await expect(second).toHaveAttribute("aria-current", "true");
  await carousel.hover();
  await page.clock.runFor(6000);
  await expect(second).toHaveAttribute("aria-current", "true");
  await carousel.getByRole("button", { name: "Pause record rotation" }).click();
  await page.mouse.move(0, 0);
  await page.getByLabel("What expertise do you need?").focus();
  await page.clock.runFor(6000);
  await expect(second).toHaveAttribute("aria-current", "true");
  await expect(
    carousel.getByRole("button", { name: "Play record rotation" }),
  ).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await first.click();
  await page.mouse.move(0, 0);
  await page.getByLabel("What expertise do you need?").focus();
  await page.clock.runFor(6000);
  await expect(first).toHaveAttribute("aria-current", "true");
  await expect(
    carousel.getByRole("button", { name: /record rotation/ }),
  ).toHaveCount(0);
});

for (const width of [320, 390, 768, 1440]) {
  test(`compact records fit at ${width}px without resizing between slides`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const carousel = page.getByRole("region", { name: "Professional records" });
    const initial = await carousel.boundingBox();
    expect(initial!.height).toBeLessThan(520);
    for (const alias of [
      "Nova",
      "Vortex",
      "Aurora",
      "Forge",
      "Nexus",
      "Pixel",
    ]) {
      await carousel
        .getByRole("button", { name: `Show ${alias}'s record` })
        .click();
      await expect(
        carousel.getByRole("heading", { name: alias, exact: true }),
      ).toBeVisible();
      const bounds = await carousel.boundingBox();
      expect(bounds!.height).toBeCloseTo(initial!.height, 0);
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
    }
    await carousel.screenshot({
      path: `test-results/record-carousel-${width}.png`,
    });
  });
}
