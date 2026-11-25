import { expect, test } from "@playwright/test";
import { openApp, openFirstSong } from "./helpers";

test.describe("Mới phát hành và tuỳ chỉnh lời hát", () => {
  test("nhãn «Mới» và hàng «Mới phát hành» chỉ hiện trong 30 ngày", async ({ page }) => {
    await page.clock.setFixedTime(new Date("2026-11-25T05:00:00Z"));
    await openApp(page);
    const shelf = page.locator("[data-new-shelf]");
    await expect(shelf).toBeVisible();
    await expect(shelf.locator("[data-new-song]").first()).toHaveAttribute("data-new-song", "bizon-fijord-moonlight");
    await expect(page.locator("[data-song-id='nhanh-xuan-ben-cua-so'] [data-new]")).toHaveText("Mới");
    await expect(page.locator("[data-song-id='je-voudrais-te-parler'] [data-new]")).toHaveCount(0);
  });

  test("hết hạn thì không còn nhãn «Mới»", async ({ page }) => {
    await page.clock.setFixedTime(new Date("2027-03-01T05:00:00Z"));
    await openApp(page);
    await expect(page.locator("[data-new-shelf]")).toHaveCount(0);
    await expect(page.locator("[data-new]")).toHaveCount(0);
  });

  test("chỉnh cỡ chữ lời hát trong Cài đặt, áp dụng ở màn hình nghe và còn sau khi tải lại", async ({ page }) => {
    await openApp(page);
    await page.locator("[data-settings-open]").click();
    await page.getByRole("button", { name: "Rất lớn" }).click();
    await expect(page.getByRole("button", { name: "Rất lớn" })).toHaveAttribute("aria-pressed", "true");
    const sw = page.getByRole("switch", { name: /Giữ màn hình sáng/ });
    await expect(sw).toHaveAttribute("aria-checked", "true");
    await sw.click();
    await expect(sw).toHaveAttribute("aria-checked", "false");

    await page.reload();
    await page.locator("[data-settings-open]").click();
    await expect(page.getByRole("button", { name: "Rất lớn" })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("switch", { name: /Giữ màn hình sáng/ })).toHaveAttribute("aria-checked", "false");
    await page.getByRole("button", { name: "Quay lại" }).click();
    await openFirstSong(page);
    await expect(page.locator("[data-lyric-scale]")).toHaveAttribute("data-lyric-scale", "1.4");
  });

  test("đang phát thì xin giữ màn hình sáng", async ({ page }) => {
    await page.addInitScript(() => {
      const w = window as unknown as { __locks: number };
      w.__locks = 0;
      Object.defineProperty(navigator, "wakeLock", {
        configurable: true,
        value: { request: async () => { w.__locks++; return { release: async () => {} }; } },
      });
    });
    await openApp(page);
    await openFirstSong(page);
    await expect.poll(() => page.evaluate(() => (window as unknown as { __locks: number }).__locks)).toBeGreaterThan(0);
  });
});

test.describe("Thông tin bài hát", () => {
  test("cuối lời có bộ sưu tập, chủ bản quyền và DOI Zenodo", async ({ page }) => {
    await openApp(page);
    await openFirstSong(page);
    const c = page.locator("[data-credits]");
    await expect(c).toContainText("Thông tin bài hát");
    await expect(c).toContainText("La Maison de Madame Hương");
    await expect(c).toContainText("Thuộc bản quyền của jemappellehuong.com");
    await expect(c.locator("[data-credits-doi]")).toHaveAttribute("href", "https://doi.org/10.5281/zenodo.22003853");
  });

  test("bài game có tên album và DOI của Cổng Trò Chơi Sử Việt", async ({ page }) => {
    await page.goto("/?bai=trong-toi-co-mot-nuoc-nam");
    const c = page.locator("[data-credits]");
    await expect(c).toContainText("Thuộc bản quyền của Cổng Trò Chơi Sử Việt");
    await expect(c.locator("[data-credits-doi]")).toHaveAttribute("href", "https://doi.org/10.5281/zenodo.21850564");
  });
});
