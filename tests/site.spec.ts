import { test, expect, type Page } from "@playwright/test";

const ROUTES = ["/", "/home-v2", "/home-v3", "/platform", "/how-it-works", "/integrations", "/about-us", "/careers", "/blog", "/early-access"];

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error" && !/Failed to load resource.*(favicon|wp-content)/i.test(m.text())) errors.push(`console: ${m.text()}`);
  });
  return errors;
}

async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y < h; y += Math.round(window.innerHeight * 0.7)) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
  });
}

for (const route of ROUTES) {
  test(`renders ${route} without errors, overflow or broken images`, async ({ page }) => {
    const errors = trackErrors(page);
    const res = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator("h1").first()).toBeVisible();
    await scrollThrough(page);
    await page.waitForTimeout(400);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, "horizontal overflow (px)").toBeLessThanOrEqual(1);

    const broken = await page.evaluate(() =>
      Array.from(document.images)
        .filter((i) => i.complete && i.naturalWidth === 0 && i.loading !== "lazy")
        .map((i) => i.currentSrc || i.src),
    );
    expect(broken, "broken images").toEqual([]);

    // Basic a11y: one h1, every image has alt, every button/link has an accessible name.
    expect(await page.locator("h1").count()).toBe(1);
    expect(await page.locator("img:not([alt])").count()).toBe(0);
    const unnamed = await page.evaluate(() =>
      Array.from(document.querySelectorAll("a[href], button"))
        .filter((el) => {
          const s = getComputedStyle(el);
          if (s.display === "none" || s.visibility === "hidden") return false;
          const name = (el.getAttribute("aria-label") || el.textContent || el.getAttribute("title") || "").trim();
          return !name;
        })
        .map((el) => el.outerHTML.slice(0, 120)),
    );
    expect(unnamed, "controls without accessible name").toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("primary navigation links resolve", async ({ page, isMobile }) => {
  test.setTimeout(150_000);
  await page.goto("/");
  const labels = ["Platform", "How It Works", "Integrations", "About Us", "Blog", "Careers"];
  for (const label of labels) {
    if (isMobile || (page.viewportSize()?.width ?? 1440) < 1024) {
      await page.getByRole("button", { name: "Open menu" }).click();
      await page.locator("#mobile-nav").getByRole("link", { name: new RegExp(String.raw`\d+\s*${label}$`) }).click();
    } else {
      await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: label, exact: true }).click();
    }
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page).not.toHaveURL(/\/$/);
    await page.goto("/");
  }
});

test("internal links on every page are not broken", async ({ page, request }) => {
  const seen = new Set<string>();
  for (const route of ROUTES) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const hrefs = await page.$$eval("a[href^='/']", (as) => as.map((a) => (a as HTMLAnchorElement).getAttribute("href")!.split("#")[0] || "/"));
    hrefs.forEach((h) => seen.add(h));
  }
  for (const href of seen) {
    const r = await request.get(href);
    expect(r.status(), href).toBeLessThan(400);
  }
});

test("early-access dialog opens, validates and submits (dry run)", async ({ page }) => {
  await page.goto("/");
  await page.locator("#main").getByRole("button", { name: "Get Early Access" }).first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Request early access" }).click();
  await expect(dialog.getByText("Please enter your full name.")).toBeVisible();
  await expect(dialog.getByText("Please enter a valid work email.")).toBeVisible();
  await dialog.getByLabel("Full name *").fill("QA Tester");
  await dialog.getByLabel("Email *").fill("qa@example.com");
  await dialog.getByRole("button", { name: "Request early access" }).click();
  await expect(dialog.getByText("You’re on the list.")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("early-access API rejects invalid payloads", async ({ request }) => {
  const r = await request.post("/api/early-access", {
    data: { name: "", email: "nope" },
    headers: { "x-forwarded-for": `10.0.0.${Math.floor(Math.random() * 250)}` },
  });
  expect(r.status()).toBe(422);
  const j = await r.json();
  expect(j.errors.email).toBeTruthy();
});

test("job post renders with application form", async ({ page }) => {
  await page.goto("/careers");
  const first = page.locator("#open-roles a").first();
  test.skip((await first.count()) === 0, "WordPress returned no jobs");
  await first.click();
  await expect(page.getByRole("heading", { name: /^Apply for/ })).toBeVisible();
  await page.getByRole("button", { name: "Submit application" }).click();
  await expect(page.getByText("Please attach your resume.")).toBeVisible();
});

test("legacy WordPress URLs redirect", async ({ request }) => {
  const r = await request.get("/careers-2/", { maxRedirects: 0 });
  expect([301, 308]).toContain(r.status());
});

test("product demo tabs are keyboard operable", async ({ page }) => {
  await page.goto("/platform");
  const tablist = page.getByRole("tablist").first();
  await tablist.scrollIntoViewIfNeeded();
  const tabs = tablist.getByRole("tab");
  await tabs.first().focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
});
