import { expect, test } from "@playwright/test";
import {
  collectionTab,
  COUNTS,
  openApp,
  scrollPane,
  SONG_COUNT,
  SONG_ROW,
  songCount,
  VIDEO_ROW,
} from "./helpers";

test.describe("Thư viện", () => {
  test("mở lên là thấy ba bộ sưu tập và danh sách bài của Hương", async ({ page }) => {
    const errors = await openApp(page);

    for (const name of ["Hương", "BizOn", "M-AIDA"] as const) {
      await expect(collectionTab(page, name)).toBeVisible();
    }
    await expect(collectionTab(page, "Hương")).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tab", { name: `Bài hát · ${SONG_COUNT}` })).toBeVisible();
    expect(await songCount(page)).toBe(SONG_COUNT);
    await expect(page.locator(SONG_ROW).first()).toContainText("Je voudrais te parler");

    expect(errors).toEqual([]);
  });

  test("màn hình chào hiện lúc mở app rồi tự tắt", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("[data-splash]")).toHaveCount(1);
    await expect(page.locator("[data-splash]")).toHaveCount(0, { timeout: 6000 });
  });

  test("ảnh bìa trong danh sách tải về được, không có ảnh hỏng", async ({ page }) => {
    await openApp(page);
    await scrollPane(page, 4000);
    await page.waitForLoadState("networkidle");

    const covers = page.locator(`${SONG_ROW} img`);
    const total = await covers.count();
    expect(total).toBeGreaterThanOrEqual(7);
    for (let i = 0; i < total; i += 1) {
      const img = covers.nth(i);
      await img.scrollIntoViewIfNeeded();
      await expect
        .poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0), {
          message: `ảnh hỏng: ${await img.getAttribute("src")}`,
        })
        .toBe(true);
    }
  });

  test("đổi bộ sưu tập thì đổi cả danh sách bài và số đếm", async ({ page }) => {
    await openApp(page);

    await collectionTab(page, "BizOn").click();
    await expect(collectionTab(page, "BizOn")).toHaveAttribute("aria-selected", "true");
    await expect(page.locator(SONG_ROW)).toHaveCount(COUNTS.bizon.songs);
    await expect(page.getByRole("tab", { name: `Video · ${COUNTS.bizon.videos}` })).toBeVisible();

    await collectionTab(page, "M-AIDA").click();
    await expect(page.locator(SONG_ROW)).toHaveCount(COUNTS.maida.songs);
    // Bộ chưa có video thì nói rõ, không để trống trơn.
    await page.getByRole("tab", { name: "Video · 0" }).click();
    await expect(page.getByText("Chưa có video.")).toBeVisible();
    await page.getByRole("tab", { name: /^Bài hát ·/ }).click();

    await collectionTab(page, "Hương").click();
    await expect(page.locator(SONG_ROW)).toHaveCount(COUNTS.huong.songs);
  });

  test("tab Video liệt kê video, mở một video rồi quay lại", async ({ page }) => {
    await openApp(page);
    await collectionTab(page, "BizOn").click();
    await page.getByRole("tab", { name: /^Video ·/ }).click();
    await expect(page.locator(VIDEO_ROW)).toHaveCount(COUNTS.bizon.videos);

    const title = (await page.locator(`${VIDEO_ROW} span.font-bold`).first().textContent())!;
    await page.locator(VIDEO_ROW).first().click();

    await expect(page.locator("[data-screen-title]")).toHaveText(title);
    await expect(page.getByText("Video khác")).toBeVisible();
    await expect(page.locator(VIDEO_ROW)).toHaveCount(COUNTS.bizon.videos - 1);

    await page.getByRole("button", { name: "Quay lại" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Chansonia" })).toBeVisible();
  });

  test("mở video thì nhạc đang phát tạm dừng", async ({ page }) => {
    await openApp(page);
    await page.getByRole("button", { name: "Phát", exact: true }).click();
    await expect(page.getByRole("button", { name: "Tạm dừng" })).toBeVisible();

    await page.getByRole("tab", { name: /^Video ·/ }).click();
    await page.locator(VIDEO_ROW).first().click();
    await expect(page.getByRole("button", { name: "Phát", exact: true })).toBeVisible();
  });

  test("trang nghệ sĩ có số liệu, DOI và liên kết", async ({ page }) => {
    await openApp(page);

    await page.getByRole("button", { name: "Nghệ sĩ" }).click();
    await expect(page.getByRole("heading", { name: "Je m'appelle Hương" })).toBeVisible();

    const total = COUNTS.huong.songs + COUNTS.bizon.songs + COUNTS.maida.songs;
    await expect(page.locator("dl")).toContainText(String(total));
    await expect(page.getByRole("link", { name: /10\.5281\/zenodo\.22172794/ })).toHaveAttribute(
      "href",
      "https://doi.org/10.5281/zenodo.22172794",
    );
    await expect(page.getByRole("link", { name: /GitHub/ })).toHaveAttribute(
      "href",
      "https://github.com/thuyhuongctu/Chansonia",
    );

    await page.getByRole("button", { name: "Quay lại" }).click();
    await expect(page.locator(SONG_ROW).first()).toBeVisible();
  });

  test("đổi được giữa nền sáng và nền tối", async ({ page }) => {
    await openApp(page);

    const paper = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    const sang = await paper();

    await page.getByRole("button", { name: /Chuyển sang nền tối/ }).click();
    await expect.poll(paper, { message: "nền phải đổi màu khi bật nền tối" }).not.toBe(sang);

    await page.getByRole("button", { name: /Chuyển sang nền sáng/ }).click();
    await expect.poll(paper).toBe(sang);
  });
});
