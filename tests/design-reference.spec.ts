import { test, expect } from "@playwright/test";
import path from "node:path";
import { pathToFileURL } from "node:url";

test.use({ colorScheme: "light" });
for (const width of [390, 768, 1440]) {
  test(`matches index-6 content geometry at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    const selectors = [".hero", ".hero h1", ".lead", ".pathways", ".path", ".proofstrip", ".sectionhead", ".grid"];
    async function measure(prefix = "") {
      return page.evaluate(({ selectors, prefix }) => Object.fromEntries(selectors.map(selector => {
        const target = selector.replace(/\.([\w-]+)/g, `.${prefix}$1`);
        const el = document.querySelector(target)!;
        const rect = el.getBoundingClientRect(), style = getComputedStyle(el);
        return [selector, { width: rect.width, height: rect.height, font: style.fontFamily, size: style.fontSize, weight: style.fontWeight, gap: style.gap, columns: style.gridTemplateColumns }];
      })), { selectors, prefix });
    }
    await page.goto(pathToFileURL(path.resolve("index-6.html")).href);
    const reference = await measure();
    await page.goto("/");
    const actual = await measure("mp-");
    for (const selector of selectors) {
      expect(actual[selector].width, `${selector} width`).toBeCloseTo(reference[selector].width, 0);
      expect(actual[selector].height, `${selector} height`).toBeCloseTo(reference[selector].height, 0);
      for (const key of ["font", "size", "weight", "gap", "columns"] as const) expect(actual[selector][key], `${selector} ${key}`).toBe(reference[selector][key]);
    }
    await expect(page.locator(".mp-site-header")).toBeVisible();
    await expect(page.locator(".footer")).toBeVisible();
  });
}
