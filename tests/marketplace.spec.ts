import { test, expect, type Page } from "@playwright/test";
test.use({
  colorScheme: "light",
});
const workspace = (page: Page) =>
  page.getByRole("navigation", {
    name: "Marketplace",
  });
async function go(page: Page, name: string) {
  const views: Record<string, string> = {
    Explore: "explore",
    "List expertise": "list",
    Hire: "hire",
    Dashboard: "work",
    Messages: "messages",
    Reputation: "reputation",
    Settings: "settings",
    About: "about",
  };
  const destination = `/marketplace/${views[name]}`;
  if (!(await page.locator(`a[href="${destination}"]:visible`).count())) {
    if (name === "About") {
      await page.goto(destination);
      return;
    }
    const menu = page.getByRole("button", { name: "Open navigation menu" });
    if (await menu.isVisible()) await menu.click();
    else
      await page
        .locator("header")
        .getByRole("link", { name: "Dashboard", exact: true })
        .click();
  }
  await page.locator(`a[href="${destination}"]:visible`).first().click();
  await expect(page).toHaveURL(new RegExp(`${destination}$`));
}
async function signIn(page: Page, role: "hirer" | "expert") {
  await page
    .locator("header")
    .getByRole("button", { name: "Sign In", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByRole("button", {
      name: `Fill ${role} account`,
    })
    .click();
  await dialog
    .getByRole("button", {
      name: "Sign in",
      exact: true,
    })
    .click();
  await expect(
    workspace(page).getByRole("link", { name: "Dashboard", exact: true }),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/marketplace\/work$/);
}
async function signOut(page: Page) {
  await go(page, "Settings");
  await page
    .getByRole("main")
    .getByRole("button", { name: "Sign out", exact: true })
    .click();
}
for (const width of [320, 390, 768, 1440]) {
  test(`marketplace navigation and content fit at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({
      width,
      height: 1000,
    });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/");
    await expect(page.locator("[data-testid=home-hero] h1")).toContainText(
      "Reputation.",
    );
    await expect(page.locator("[data-testid=expert-card]")).toHaveCount(3);
    await expect(page.locator("[data-testid=site-brand]")).toBeVisible();
    await expect(page.getByRole("button", { name: /waitlist/i })).toHaveCount(
      0,
    );
    await expect(
      page.getByTestId("site-footer").getByRole("img", { name: "rEcruit owl" }),
    ).toBeVisible();
    await page.screenshot({
      path: `test-results/mvp-home-${width}.png`,
      fullPage: true,
    });
    for (const route of [
      "Explore",
      "List expertise",
      "Hire",
      "Dashboard",
      "Messages",
      "Reputation",
      "Settings",
      "About",
    ]) {
      await go(page, route);
      expect(
        await page.locator("main").evaluate((el) => el.scrollWidth),
        route,
      ).toBeLessThanOrEqual(width);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
        route,
      ).toBeLessThanOrEqual(width);
    }
    await page.goto("/marketplace/profile/1");
    await page
      .getByRole("button", { name: "Contact / hire this expert" })
      .click();
    await expect(page.getByRole("dialog")).toBeVisible();
    const bounds = await page.getByRole("dialog").boundingBox();
    expect(bounds!.width).toBeLessThanOrEqual(width);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}
test("search, sorting, empty state, direct profile links, and browser history", async ({
  page,
}) => {
  await page.goto("/marketplace/explore");
  await expect(page.locator("[data-testid=expert-card]")).toHaveCount(6);
  await page.getByLabel("Search experts").fill("rust");
  await expect(page.locator("[data-testid=expert-card]")).toHaveCount(1);
  await expect(page.locator("[data-testid=expert-card] h3")).toHaveText(
    "Vortex",
  );
  await page.getByLabel("Filter by category").selectOption("Design");
  await expect(page.getByText("No experts found")).toBeVisible();
  await page
    .getByRole("button", {
      name: "Clear filters",
    })
    .click();
  await page.getByLabel("Sort experts").selectOption("low");
  await expect(page.locator("[data-testid=expert-card] h3").first()).toHaveText(
    "Forge",
  );
  await page
    .getByRole("link", {
      name: "View profile for Nova",
    })
    .click();
  await expect(page).toHaveURL(/profile\/1$/);
  await expect(page.locator("[data-testid=profile-header] h1")).toHaveText(
    "Nova",
  );
  await page.goBack();
  await expect(page).toHaveURL(/explore\?sort=low$/);
  await expect(page.getByLabel("Sort experts")).toHaveValue("low");
  await page.goto("/marketplace/profile/999");
  await expect(page.getByText("Profile unavailable")).toBeVisible();
  expect((await page.goto("/marketplace/unknown"))?.status()).toBe(404);
});
test("profile validation and publication survive route navigation", async ({
  page,
}) => {
  await page.goto("/marketplace/list");
  await page.getByLabel("Professional alias").fill("Nova");
  await page.getByLabel("Main category").selectOption("Design");
  await page
    .getByLabel("What do you help people do?")
    .fill("Accessible product design");
  await page.getByLabel("Skills (comma-separated)").fill("Figma, UI/UX");
  await page.getByLabel("Starting rate").fill("42");
  await page
    .getByLabel("About your expertise")
    .fill("I design accessible products for small teams.");
  await page
    .getByRole("button", {
      name: "Publish profile",
    })
    .click();
  await expect(
    page.locator("[data-testid=form-error][role=alert]"),
  ).toContainText("alias is already taken");
  await page.getByLabel("Professional alias").fill("PixelNorth");
  await page
    .getByRole("button", {
      name: "Publish profile",
    })
    .click();
  await expect(page.locator("[data-testid=profile-header] h1")).toHaveText(
    "PixelNorth",
  );
  await expect(page.getByTestId("profile-score")).toHaveText("50/100");
  await go(page, "Explore");
  await page.getByLabel("Search experts").fill("PixelNorth");
  await expect(page.locator("[data-testid=expert-card]")).toHaveCount(1);
  await page.reload();
  await expect(page.locator("[data-testid=expert-card] h3")).not.toContainText([
    "PixelNorth",
  ]);
});
test("sign-in validation, focus trap, and contact continue into local messages", async ({
  page,
}) => {
  const requests: string[] = [];
  page.on("request", (r) => {
    if (r.method() === "POST") requests.push(r.url());
  });
  await page.goto("/marketplace/profile/1");
  await page
    .getByRole("button", {
      name: "Contact / hire this expert",
    })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByLabel("Email", {
      exact: true,
    })
    .fill("nobody@example.com");
  await dialog
    .getByLabel("Password", {
      exact: true,
    })
    .fill("wrong");
  await dialog
    .getByRole("button", {
      name: "Sign in",
      exact: true,
    })
    .click();
  await expect(dialog.getByRole("alert")).toBeVisible();
  await dialog
    .getByRole("button", {
      name: "Fill hirer account",
    })
    .click();
  await dialog
    .getByRole("button", {
      name: "Sign up",
      exact: true,
    })
    .focus();
  await page.keyboard.press("Tab");
  await expect(
    dialog.getByRole("button", {
      name: "Close dialog",
    }),
  ).toBeFocused();
  await dialog
    .getByRole("button", {
      name: "Sign in",
      exact: true,
    })
    .click();
  await expect(dialog.getByRole("heading")).toHaveText(
    "Start a hiring conversation",
  );
  await dialog.getByLabel("What do you need?").fill("A product design sprint");
  await dialog
    .getByRole("button", {
      name: "Start conversation",
      exact: true,
    })
    .click();
  await expect(page).toHaveURL(/messages$/);
  await page
    .getByLabel("Message *", {
      exact: true,
    })
    .fill("Hello Nova, can we discuss scope?");
  await page
    .getByRole("button", {
      name: "Send message",
    })
    .click();
  await expect(page.getByRole("log")).toContainText("Hello Nova");
  await go(page, "Explore");
  await go(page, "Messages");
  await expect(page.getByRole("log")).toContainText("Hello Nova");
  expect(requests).toEqual([]);
});
test("evidence validation, pending score, approval, rejection, and duplicates", async ({
  page,
}) => {
  await page.goto("/marketplace/profile/1");
  await page
    .getByRole("button", {
      name: "✓ Vouch",
      exact: true,
    })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Your professional alias").fill("Nova");
  await dialog
    .getByLabel("What happened?")
    .fill("Delivered a useful design system.");
  await dialog.getByLabel("Attach proof").setInputFiles({
    name: "evidence.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("fictional evidence"),
  });
  await dialog
    .getByRole("button", {
      name: "Submit for review",
    })
    .click();
  await expect(dialog.getByRole("alert")).toContainText("own profile");
  await dialog.getByLabel("Your professional alias").fill("PastHirer");
  await dialog
    .getByRole("button", {
      name: "Submit for review",
    })
    .click();
  await expect(page.getByTestId("profile-score")).toHaveText("98/100");
  await signIn(page, "hirer");
  await go(page, "Reputation");
  await expect(page.getByText("Vouch · Pending Review")).toBeVisible();
  await page
    .getByRole("button", {
      name: "Approve",
    })
    .click();
  await go(page, "Explore");
  await page
    .getByRole("link", {
      name: "View profile for Nova",
    })
    .click();
  await expect(page.getByTestId("profile-score")).toHaveText("99/100");
  await page
    .getByRole("button", {
      name: "✓ Vouch",
      exact: true,
    })
    .click();
  await dialog.getByLabel("Your professional alias").fill("PastHirer");
  await dialog.getByLabel("What happened?").fill("Duplicate submission");
  await dialog.getByLabel("Attach proof").setInputFiles({
    name: "evidence.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("fictional evidence"),
  });
  await dialog
    .getByRole("button", {
      name: "Submit for review",
    })
    .click();
  await expect(dialog.getByRole("alert")).toContainText(
    "already have a submission",
  );
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", {
      name: "⚑ Refute",
      exact: true,
    })
    .click();
  await dialog.getByLabel("Your professional alias").fill("AnotherHirer");
  await dialog.getByLabel("What happened?").fill("Needs evidence review.");
  await dialog.getByLabel("Attach proof").setInputFiles({
    name: "note.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("fictional evidence"),
  });
  await dialog
    .getByRole("button", {
      name: "Submit for review",
    })
    .click();
  await go(page, "Reputation");
  await page
    .getByRole("button", {
      name: "Reject",
    })
    .click();
  await expect(page.getByText("Refute · Rejected")).toBeVisible();
});
for (const route of ["Hiring for myself", "Hiring for company"]) {
  test(`${route}: post, apply, accept, deliver, request changes, complete`, async ({
    page,
  }) => {
    test.setTimeout(60000);
    const requests: string[] = [];
    page.on("request", (r) => {
      if (r.method() === "POST") requests.push(r.url());
    });
    await page.goto("/");
    await signIn(page, "hirer");
    await go(page, "Hire");
    await page.getByLabel("Hiring type").selectOption(route);
    await page.getByLabel("Role / job title").fill("Build a landing page");
    await page
      .getByLabel("Description and expected outcome")
      .fill("A responsive landing page for a fictional product.");
    await page.getByLabel("Agreed contract / job value").fill("300");
    await page.getByLabel("Duration / deadline").fill("7 days");
    await expect(page.locator("form")).toContainText(
      route === "Hiring for myself" ? "$307.50" : "$315.00",
    );
    await page
      .getByRole("button", {
        name: "Post opportunity",
      })
      .click();
    await signOut(page);
    await signIn(page, "expert");
    await page
      .getByRole("button", {
        name: "Apply",
        exact: false,
      })
      .click();
    if (route === "Hiring for myself") {
      await go(page, "Settings");
      await page.getByLabel("Wallet address").fill("invalid");
      await page
        .getByRole("button", {
          name: "Add wallet",
        })
        .click();
      await expect(
        page.locator("[data-testid=form-error][role=alert]"),
      ).toBeVisible();
      await page.getByLabel("Wallet address").fill("0x" + "1".repeat(40));
      await page
        .getByRole("button", {
          name: "Add wallet",
        })
        .click();
    }
    await signOut(page);
    await signIn(page, "hirer");
    await page
      .getByRole("button", {
        name: "Accept",
        exact: true,
      })
      .click();
    await signOut(page);
    await signIn(page, "expert");
    await page.getByLabel("Delivery note or link").fill("First version ready.");
    await page
      .getByRole("button", {
        name: "Mark delivered",
      })
      .click();
    await signOut(page);
    await signIn(page, "hirer");
    await page
      .getByRole("button", {
        name: "Request changes",
      })
      .click();
    await signOut(page);
    await signIn(page, "expert");
    await page
      .getByLabel("Delivery note or link")
      .fill("Revised version ready.");
    await page
      .getByRole("button", {
        name: "Mark delivered",
      })
      .click();
    await signOut(page);
    await signIn(page, "hirer");
    if (route === "Hiring for myself") {
      await page
        .getByRole("button", {
          name: "Simulate approval",
        })
        .click();
      await expect(page.getByRole("status")).toContainText("funding wallet");
      await go(page, "Settings");
      await page.getByLabel("Wallet address").fill("0x" + "2".repeat(40));
      await page
        .getByRole("button", {
          name: "Add wallet",
        })
        .click();
      await go(page, "Dashboard");
      await page
        .getByRole("button", {
          name: "Simulate approval",
        })
        .click();
    } else
      await page
        .getByRole("button", {
          name: "Mark complete",
        })
        .click();
    await expect(page.locator("article [data-testid=status-badge]")).toHaveText(
      "Completed",
    );
    expect(requests).toEqual([]);
  });
}
