import { expect, test } from "@playwright/test";

/**
 * Trang giới thiệu (site/) — dựng cùng lúc với app trong `npm run test:serve`
 * và chạy ở cổng 4174: thư mục gốc là trang giới thiệu, app nằm ở app/.
 */
const SITE = `http://127.0.0.1:${Number(process.env.PORT ?? 4173) + 1}/`;

test.describe("Trang giới thiệu", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("chansonia-site-lang", "vi"));
  });

  test("mở lên đủ các phần, số liệu lấy từ thư viện của app", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto(SITE);
    await expect(page.locator("h1")).toContainText("Những bài hát kể chuyện");
    await expect(page.locator("[data-stats]")).toContainText("30");
    await expect(page.locator("[data-stats]")).toContainText("10");

    const cards = page.locator("[data-collections] .card");
    await expect(cards).toHaveCount(5);
    await expect(cards.nth(0)).toContainText("La maison de Madam Hương");
    await expect(cards.nth(1)).toContainText("BizOnland");
    await expect(cards.nth(2)).toContainText("M-AIDA");
    await expect(cards.nth(3)).toContainText("Van Don – Vietnam’s First Trading Port");
    await expect(cards.nth(4)).toContainText("Bac Hai Dao – Pirates of the Gulf of Tonkin");

    const videos = page.locator("[data-videos] a");
    await expect(videos).toHaveCount(10);
    expect(await videos.first().getAttribute("href")).toMatch(/^https:\/\/www\.youtube\.com\//);

    await expect(page.locator('meta[name="citation_doi"]')).toHaveAttribute(
      "content",
      "10.5281/zenodo.22172794",
    );
    expect(errors).toEqual([]);
  });

  test("đổi được ba thứ tiếng, và nhớ lựa chọn", async ({ page }) => {
    await page.goto(SITE);

    await page.getByRole("button", { name: "EN", exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("h1")).toContainText("Songs that tell stories");

    await page.getByRole("button", { name: "FR", exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    await expect(page.locator("h1")).toContainText("Des chansons qui racontent");
    await expect(page.locator("[data-collections] .card").nth(2)).toContainText("2 chansons · 0 clips");

    expect(await page.evaluate(() => localStorage.getItem("chansonia-site-lang"))).toBe("fr");
  });

  test("nút «Nghe ngay» mở app nghe nhạc ở app/", async ({ page }) => {
    await page.goto(SITE);
    await page.locator(".hero-cta a").first().click();
    await expect(page).toHaveURL(/\/app\/$/);
    await expect(page.getByRole("heading", { level: 1, name: "Chansonia" })).toBeVisible();
    await expect(page.locator("[data-song-id]").first()).toBeVisible();
  });

  test("chép được mẫu trích dẫn", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto(SITE);
    await page.locator('[data-copy="bibtex"]').click();
    await expect(page.locator('[data-copy="bibtex"]')).toHaveText("Đã chép");
    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text).toContain("doi       = {10.5281/zenodo.22172794}");
  });
});
