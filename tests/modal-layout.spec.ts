import { test, expect } from "@playwright/test";

for (const viewport of [
  { width: 320, height: 568 },
  { width: 390, height: 844 },
  { width: 638, height: 669 },
  { width: 1440, height: 900 },
]) {
  for (const colorScheme of ["light", "dark"] as const) {
    test(`sign-in modal has comfortable insets at ${viewport.width}px in ${colorScheme}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ colorScheme });
      await page.goto("/marketplace/profile/2");
      await page
        .getByRole("button", { name: "Contact / hire this expert" })
        .click();
      const dialog = page.getByRole("dialog");
      await dialog.evaluate((el) =>
        Promise.all(el.getAnimations().map((animation) => animation.finished)),
      );
      const bounds = await dialog.boundingBox();
      const heading = await dialog.getByRole("heading").boundingBox();
      expect(heading!.x - bounds!.x).toBeGreaterThanOrEqual(20);
      expect(heading!.y - bounds!.y).toBeGreaterThanOrEqual(20);
      expect(bounds!.x).toBeGreaterThanOrEqual(12);
      expect(bounds!.y).toBeGreaterThanOrEqual(12);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(
        viewport.width - 12,
      );
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(
        viewport.height - 12,
      );
      expect(
        await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth),
      ).toBe(true);
      const submit = dialog.getByRole("button", {
        name: "Sign in",
        exact: true,
      });
      await submit.scrollIntoViewIfNeeded();
      const button = await submit.boundingBox();
      expect(
        bounds!.x + bounds!.width - button!.x - button!.width,
      ).toBeGreaterThanOrEqual(20);
      await page.screenshot({
        path: `test-results/modal-${viewport.width}-${colorScheme}.png`,
      });
      await page.keyboard.press("Escape");
      await expect(dialog).toHaveCount(0);
    });
  }
}

test("sign-in shows inline validation and retains keyboard behavior", async ({
  page,
}) => {
  await page.goto("/marketplace/profile/1");
  await page
    .getByRole("button", { name: "Contact / hire this expert" })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(dialog.getByRole("alert")).toContainText("Enter a valid email");
  await expect(dialog.getByLabel("Email", { exact: true })).toBeFocused();
  await dialog.getByRole("button", { name: "Fill expect account" }).click();
  await dialog.getByLabel("Show password").check();
  await expect(dialog.getByLabel("Password", { exact: true })).toHaveAttribute(
    "type",
    "text",
  );
  await dialog.getByRole("button", { name: "Close dialog" }).focus();
  await page.keyboard.press("Shift+Tab");
  await expect(
    dialog.getByRole("button", { name: "Sign up", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Contact / hire this expert" }),
  ).toBeFocused();
});
