import { test, expect } from "@playwright/test";

test.use({ colorScheme: "dark", reducedMotion: "reduce" });

for (const width of [320, 390, 768, 1440]) {
  test(`light-only page and aligned footer at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("html")).toHaveCSS("color-scheme", "light");
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      "rgb(255, 255, 255)",
    );
    await expect(
      page.getByRole("button", { name: /Switch to .* mode/ }),
    ).toHaveCount(0);

    const footer = page.getByTestId("site-footer");
    await expect(footer.getByRole("img", { name: "rEcruit owl" })).toBeVisible();
    await expect(
      footer.getByRole("link", { name: "company mail" }),
    ).toHaveAttribute("href", "mailto:support@recruithq.online");

    const alignment = await footer.evaluate((element) => {
      const bounds = (node: Element) => {
        const { x, y, width, height } = node.getBoundingClientRect();
        return { x, y, width, height };
      };
      return {
        columns: [...element.querySelectorAll("h3")].map((heading) => ({
          heading: bounds(heading),
          box: bounds(heading.parentElement!),
          links: [...heading.parentElement!.querySelectorAll("a")].map(bounds),
        })),
        brand: bounds(element.querySelector('[aria-label="rEcruit home"]')!),
        brandColumn: bounds(
          element.querySelector('[aria-label="rEcruit home"]')!.parentElement!,
        ),
        copyright: bounds(element.querySelector("span")!),
        footer: bounds(element),
        overflow: document.documentElement.scrollWidth > innerWidth,
      };
    });
    const [discover, social] = alignment.columns;
    expect(Math.abs(discover.heading.y - social.heading.y)).toBeLessThan(1);
    for (let index = 0; index < discover.links.length; index++) {
      expect(
        Math.abs(discover.links[index].y - social.links[index].y),
      ).toBeLessThan(1);
    }
    for (const column of alignment.columns) {
      for (const link of column.links) {
        expect(Math.abs(column.heading.x - link.x)).toBeLessThan(1);
        expect(link.height).toBeGreaterThanOrEqual(44);
      }
    }
    const footerCenter = alignment.footer.x + alignment.footer.width / 2;
    const contentCenter =
      (alignment.brandColumn.x + social.box.x + social.box.width) / 2;
    expect(Math.abs(contentCenter - footerCenter)).toBeLessThan(1);
    expect(
      Math.abs(
        alignment.copyright.x + alignment.copyright.width / 2 - footerCenter,
      ),
    ).toBeLessThan(1);
    if (width >= 900) {
      expect(Math.abs(alignment.brand.y - discover.heading.y)).toBeLessThan(1);
    } else {
      expect(
        Math.abs(alignment.brand.x + alignment.brand.width / 2 - footerCenter),
      ).toBeLessThan(1);
      expect(alignment.brand.y + alignment.brand.height).toBeLessThan(
        discover.heading.y,
      );
    }
    expect(alignment.overflow).toBe(false);
    expect(errors).toEqual([]);
    await footer.screenshot({ path: `test-results/footer-light-${width}.png` });
  });
}

test("ignores saved dark mode and system preference changes", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("recruit-theme", "dark"));
  await page.goto("/");
  const body = page.locator("body");
  await expect(body).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", "dark");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(body).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await page.emulateMedia({ colorScheme: "dark" });
  await page.reload();
  await expect(body).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(page.locator("html")).toHaveCSS("color-scheme", "light");
  await expect(
    page.getByRole("button", { name: /Switch to .* mode/ }),
  ).toHaveCount(0);
});
