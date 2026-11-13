import { expect, test } from "@playwright/test";
import { COUNTS, SONG_ROW, openApp } from "./helpers";

/**
 * Màn hình «Giới thiệu» trong app — trước là trang giới thiệu riêng ở địa chỉ
 * gốc. Nay địa chỉ gốc (cổng 4174 khi kiểm thử, dist-site/) chuyển thẳng vào
 * app/ và mở màn hình này.
 */
const ROOT = `http://127.0.0.1:${Number(process.env.PORT ?? 4173) + 1}/`;
const TOTAL_SONGS = Object.values(COUNTS).reduce((n, c) => n + c.songs, 0);
const TOTAL_VIDEOS = Object.values(COUNTS).reduce((n, c) => n + c.videos, 0);

test.describe("Giới thiệu", () => {
  test("địa chỉ gốc chuyển vào app và mở Giới thiệu, giữ đường link bài hát", async ({ page }) => {
    await page.goto(ROOT);
    await expect(page.locator("[data-about]")).toBeVisible();
    await expect(page).toHaveURL(/\/app\/$/);

    await page.goto(`${ROOT}?bai=je-voudrais-te-parler`);
    await expect(page.locator("[data-screen-title]")).toHaveText("Je voudrais te parler");
  });

  test("đủ các phần, số liệu lấy từ thư viện", async ({ page }) => {
    const errors = await openApp(page);
    await page.locator("[data-about-open]").click();
    const about = page.locator("[data-about]");
    await expect(about.locator("h1")).toContainText("Những bài hát kể chuyện");
    const stats = about.locator("[data-stats]");
    await expect(stats).toContainText(String(TOTAL_SONGS));
    await expect(stats).toContainText(String(TOTAL_VIDEOS));
    await expect(about.locator("[data-about-collection]")).toHaveCount(Object.keys(COUNTS).length);
    await expect(about.locator("[data-about-videos] button")).toHaveCount(TOTAL_VIDEOS);
    for (const id of ["about-features", "about-artist", "about-cite"]) {
      await expect(about.locator(`#${id}`)).toBeAttached();
    }
    expect(errors).toEqual([]);
  });

  test("bấm một bộ sưu tập là mở thư viện đúng bộ đó", async ({ page }) => {
    await openApp(page);
    await page.locator("[data-about-open]").click();
    await page.locator('[data-about-collection="bizon"]').click();
    await expect(page.getByRole("tab", { name: "BizOnland", exact: true })).toHaveAttribute("aria-selected", "true");
    await expect(page.locator(SONG_ROW)).toHaveCount(COUNTS.bizon.songs);
  });

  test("chép được mẫu trích dẫn APA", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await openApp(page);
    await page.locator("[data-about-open]").click();
    await page.locator('[data-cite="APA"] button').click();
    await expect(page.locator('[data-cite="APA"] button')).toContainText("Đã chép");
    expect(await page.evaluate(() => navigator.clipboard.readText())).toContain("10.5281/zenodo.22172794");
  });

  test("vào được từ trang Nghệ sĩ và từ cuối thư viện", async ({ page }) => {
    await openApp(page);
    await page.getByRole("button", { name: "Nghệ sĩ" }).click();
    await page.getByRole("button", { name: "Giới thiệu Chansonia" }).click();
    await expect(page.locator("[data-about]")).toBeVisible();
    await page.getByRole("button", { name: "Quay lại" }).click();
    await page.locator("[data-library-list]").getByRole("button", { name: "Giới thiệu Chansonia" }).click();
    await expect(page.locator("[data-about]")).toBeVisible();
  });

  test("mỗi bộ sưu tập có link trang gốc và mã DOI", async ({ page }) => {
    await openApp(page);
    await page.locator("[data-about-open]").click();
    const expected: Record<string, string> = {
      huong: "10.5281/zenodo.22003853",
      bizon: "10.5281/zenodo.23325489",
      maida: "10.5281/zenodo.21850575",
      vandon: "10.5281/zenodo.21850564",
      bachai: "10.5281/zenodo.21850564",
    };
    for (const [id, doi] of Object.entries(expected)) {
      const box = page.locator(`[data-about] [data-collection-links="${id}"]`);
      await expect(box.locator("[data-collection-doi]")).toHaveAttribute("href", `https://doi.org/${doi}`);
      // M-AIDA chưa có trang riêng: chỉ có DOI
      if (id === "maida") await expect(box.locator("[data-collection-link]")).toHaveCount(0);
      else await expect(box.locator("[data-collection-link]")).toHaveAttribute("href", /^https:\/\//);
    }
    // Ở thư viện cũng có, ngay dưới tên bộ sưu tập đang xem
    await page.getByRole("button", { name: "Quay lại" }).click();
    await expect(page.locator('[data-collection-links="huong"] [data-collection-doi]').first()).toHaveAttribute(
      "href",
      "https://doi.org/10.5281/zenodo.22003853",
    );
  });
});
