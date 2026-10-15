import { test, expect } from "@playwright/test";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { existsSync } from "node:fs";

for (const width of [1440, 768, 390]) {
  test(`preserves source layout at ${width}px`, async ({ page }) => {
    test.skip(
      !existsSync(path.resolve("recruithq-site-3.html")),
      "Original HTML reference is not present in this checkout.",
    );
    await page.setViewportSize({ width, height: 1000 });
    const original = pathToFileURL(path.resolve("recruithq-site-3.html")).href;
    const selectors = [
      ".nav",
      ".hero",
      ".hero h1",
      ".hero p",
      ".search",
      ".pathway-cards",
      ".coming-soon",
      "#experts",
      "#filters",
      "#grid",
      ".card",
      "#team",
      ".people",
      ".person",
      ".footer",
      ".footer-grid",
      ".copy",
    ];
    const modalSelectors = [
      ".sheet",
      ".waitlist-header",
      ".waitlist-form",
      ".privacy-note",
      ".form-actions",
      ".waitlist-footnote",
    ];
    async function measure(targetSelectors = selectors) {
      await page.evaluate(() => document.fonts.ready);
      return page.evaluate(
        (selectors) =>
          Object.fromEntries(
            selectors.map((selector) => {
              const element = document.querySelector(selector)!;
              const bounds = element.getBoundingClientRect();
              const style = getComputedStyle(element);
              return [
                selector,
                {
                  x: bounds.x,
                  y: bounds.y,
                  width: bounds.width,
                  height: bounds.height,
                  font: style.fontFamily,
                  fontSize: style.fontSize,
                },
              ];
            }),
          ),
        targetSelectors,
      );
    }
    await page.goto(original);
    const source = await measure();
    await page.screenshot({
      path: `test-results/source-${width}.png`,
      fullPage: true,
    });
    await page
      .getByRole("button", { name: "Join the expert waitlist" })
      .click();
    const sourceModal = await measure(modalSelectors);
    await page.goto("/");
    const converted = await measure();
    for (const family of ["DM Sans", "Space Grotesk"]) {
      expect(
        await page.evaluate(
          (family) =>
            Array.from(document.fonts).some(
              (face) =>
                face.family.replaceAll('"', "") === family &&
                face.status === "loaded",
            ),
          family,
        ),
        `${family} loaded`,
      ).toBe(true);
    }
    await page.screenshot({
      path: `test-results/next-${width}.png`,
      fullPage: true,
    });
    for (const selector of selectors) {
      expect
        .soft(converted[selector].font, `${selector}: font`)
        .toBe(source[selector].font);
      expect
        .soft(converted[selector].fontSize, `${selector}: font size`)
        .toBe(source[selector].fontSize);
      for (const key of ["x", "y", "width", "height"] as const)
        expect
          .soft(
            Math.abs(converted[selector][key] - source[selector][key]),
            `${selector}: ${key}`,
          )
          .toBeLessThanOrEqual(2);
    }
    await expect(page.locator("#grid .card")).toHaveCount(6);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(page.locator(".product-faded").first()).toHaveCSS(
      "pointer-events",
      "none",
    );
    await expect(page.locator(".product-faded").first()).toHaveCSS(
      "filter",
      "blur(3px)",
    );
    await page
      .getByRole("button", { name: "Join the expert waitlist" })
      .click();
    await expect(page.getByRole("dialog")).toBeVisible();
    const convertedModal = await measure(modalSelectors);
    for (const selector of modalSelectors) {
      for (const key of ["x", "y", "width", "height"] as const) {
        expect
          .soft(
            Math.abs(
              convertedModal[selector][key] - sourceModal[selector][key],
            ),
            `${selector}: ${key}`,
          )
          .toBeLessThanOrEqual(2);
      }
    }
    await page.screenshot({ path: `test-results/waitlist-${width}.png` });
    await expect(
      page.getByLabel("Public alias", { exact: true }),
    ).toBeFocused();
    const dialog = await page.getByRole("dialog").boundingBox();
    expect(dialog!.x).toBeGreaterThanOrEqual(0);
    expect(dialog!.width).toBeLessThanOrEqual(width);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
}

for (const width of [1440, 768, 390]) {
  test(`renders the page and waitlist dialog at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Hire people for what they can actually do.",
    );
    await expect(page.locator("#grid .card")).toHaveCount(6);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(page.locator(".product-faded").first()).toHaveCSS(
      "filter",
      "blur(3px)",
    );
    await page
      .getByRole("button", { name: "Join the expert waitlist" })
      .click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(
      page.getByLabel("Public alias", { exact: true }),
    ).toBeFocused();
    const dialog = await page.getByRole("dialog").boundingBox();
    expect(dialog!.x).toBeGreaterThanOrEqual(0);
    expect(dialog!.width).toBeLessThanOrEqual(width);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}

test("waitlist validates, submits exact payload, retries failures, and traps focus", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page
    .getByRole("button", { name: "Join waitlist", exact: true })
    .filter({ visible: true })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Join the waitlist" }).click();
  expect(
    await page
      .locator("#waitlistForm")
      .evaluate((form) => (form as HTMLFormElement).checkValidity()),
  ).toBe(false);
  await page.getByLabel("Public alias", { exact: true }).fill("Atlas");
  await page.getByLabel("Email address").fill("atlas@example.com");
  await page.getByLabel("Your main area of expertise").selectOption("Design");
  let calls = 0;
  await page.route("**/api/waitlist", async (route) => {
    expect(route.request().method()).toBe("POST");
    const data = new URLSearchParams(route.request().postData()!);
    expect(Object.fromEntries(data)).toEqual({
      alias: "Atlas",
      email: "atlas@example.com",
      expertise: "Design",
      "bot-field": "",
    });
    calls += 1;
    await route.fulfill({
      status: calls === 1 ? 503 : 200,
      contentType: "application/json",
      body: JSON.stringify(
        calls === 1
          ? { error: "Unavailable" }
          : { success: true, emailId: "test-email-id" },
      ),
    });
  });
  await dialog.getByRole("button", { name: "Join the waitlist" }).click();
  await expect(page.getByRole("status")).toContainText("We couldn’t submit");
  await dialog.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByRole("status")).toContainText("You’re on the list");
  await expect(
    dialog.getByRole("button", { name: "Submitted ✓" }),
  ).toBeDisabled();
  await dialog.getByRole("button", { name: "Not now" }).focus();
  await page.keyboard.press("Tab");
  await expect(
    dialog.getByRole("button", { name: "Close", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("button", { name: "Not now" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator("body")).toHaveCSS("overflow", "visible");
  expect(errors).toEqual([]);
});

test("preserves teaser search, filters, profile actions, and listing preview", async ({
  page,
}) => {
  await page.goto("/");
  // Source intentionally disables pointer access in its coming-soon teaser.
  // Remove only that visual gate in this test to exercise the retained handlers.
  await page.addStyleTag({
    content:
      ".product-faded { pointer-events:auto!important; filter:none!important; }",
  });
  await page.getByRole("textbox", { name: "Search experts" }).fill("Solana");
  await expect(page.locator("#grid .card")).toHaveCount(1);
  await expect(page.locator("#grid")).toContainText("Vortex");
  await page.getByRole("textbox", { name: "Search experts" }).fill("no match");
  await expect(page.locator("#grid")).toContainText("No experts matched");
  await page.getByRole("textbox", { name: "Search experts" }).fill("");
  await page.getByRole("button", { name: "Figma", exact: true }).click();
  await expect(page.locator("#grid .card")).toHaveCount(1);
  await page.getByRole("button", { name: "View profile" }).click();
  const dialog = page.getByRole("dialog");
  await expect(
    dialog.getByRole("heading", { name: "Nova", exact: true }),
  ).toBeVisible();
  await dialog.getByRole("button", { name: "Vouch · 18" }).click();
  await expect(
    dialog.getByRole("button", { name: "Vouch · 19" }),
  ).toBeVisible();
  await expect(dialog).toContainText("99/100");
  await dialog.getByRole("button", { name: "Refute a claim" }).click();
  await expect(page.getByRole("status")).toContainText("Refute noted for Nova");
  await dialog.getByRole("button", { name: "Request to hire Nova" }).click();
  await expect(dialog.getByRole("status")).toContainText("Request sent");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "List Your Expertise" }).click();
  await page.getByLabel("Public alias", { exact: true }).fill("<Atlas>");
  await page.getByLabel("Primary expertise").selectOption("Writing");
  await page.getByLabel("Indicative hourly rate (USD)").fill("25");
  await page.getByLabel("What can you deliver?").fill("Clear product copy.");
  await page.getByRole("button", { name: "Preview profile" }).click();
  await expect(dialog.getByRole("status")).toContainText(
    "<Atlas> · Writing · $25/hr",
  );
  await expect(dialog.getByRole("status")).toContainText("Clear product copy.");
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await page.locator(".footer-waitlist").click();
  await expect(
    dialog.getByRole("heading", { name: "Get on the rEcruit list." }),
  ).toBeVisible();
  await page.locator(".modal").click({ position: { x: 2, y: 2 } });
  await expect(dialog).toHaveCount(0);
});

test("does not show success without an email acknowledgement", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Join the expert waitlist" }).click();
  await page.getByLabel("Public alias", { exact: true }).fill("Atlas");
  await page.getByLabel("Email address").fill("atlas@example.com");
  await page.getByLabel("Your main area of expertise").selectOption("Design");
  const dialog = page.getByRole("dialog");
  await page.route("**/api/waitlist", (route) =>
    route.fulfill({
      status: 200,
      contentType: "text/html",
      body: "<html>App page</html>",
    }),
  );
  await dialog.getByRole("button", { name: "Join the waitlist" }).click();
  await expect(dialog.getByRole("status")).toContainText("We couldn’t submit");
  await expect(page.getByLabel("Public alias", { exact: true })).toHaveValue(
    "Atlas",
  );
  await page.route("**/api/waitlist", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true }),
    }),
  );
  await dialog.getByRole("button", { name: "Try again" }).click();
  await expect(dialog.getByRole("status")).toContainText("We couldn’t submit");
  await expect(dialog.getByRole("button", { name: "Try again" })).toBeEnabled();
});

test("unintended text entry into the spam trap does not block a genuine submission", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Join the expert waitlist" }).click();
  await page.getByLabel("Public alias", { exact: true }).fill("Atlas");
  await page.getByLabel("Email address").fill("atlas@example.com");
  await page.getByLabel("Your main area of expertise").selectOption("Design");
  // Simulate an unexpected browser focus/text-entry path into the offscreen field.
  await page
    .locator('input[name="bot-field"]')
    .evaluate((input: HTMLInputElement) => input.focus());
  await page.keyboard.insertText("Autofilled value");
  await page.route("**/api/waitlist", async (route) => {
    const payload = new URLSearchParams(route.request().postData()!);
    const blocked = Boolean(payload.get("bot-field"));
    await route.fulfill({
      status: blocked ? 400 : 200,
      contentType: "application/json",
      body: JSON.stringify(
        blocked
          ? { error: "Invalid form submission." }
          : { success: true, emailId: "test-email-id" },
      ),
    });
  });
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Join the waitlist" })
    .click();
  await expect(page.getByRole("status")).toContainText("You’re on the list");
});

test("shows the server validation message for a rejected submission", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Join the expert waitlist" }).click();
  await page.getByLabel("Public alias", { exact: true }).fill("Atlas");
  await page.getByLabel("Email address").fill("atlas@example.com");
  await page.getByLabel("Your main area of expertise").selectOption("Design");
  await page.route("**/api/waitlist", (route) =>
    route.fulfill({
      status: 400,
      contentType: "application/json",
      body: JSON.stringify({
        error:
          "We couldn’t verify this submission. Refresh the page and try again.",
      }),
    }),
  );
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Join the waitlist" })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "Refresh the page and try again.",
  );
  await expect(page.getByLabel("Public alias", { exact: true })).toHaveValue(
    "Atlas",
  );
});
