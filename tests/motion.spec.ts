import { expect, test } from "@playwright/test";
import { openApp, openFirstSong, SONG_COUNT, SONG_ROW, waitForLyrics } from "./helpers";

test.describe("Chuyển động", () => {
  test("bình thường thì màn hình vào có chuyển động, mặt trời mọc ở màn hình chào", async ({
    page,
  }) => {
    await openApp(page);
    const anim = await page
      .locator(".view-enter")
      .first()
      .evaluate((el) => getComputedStyle(el).animationName);
    expect(anim).toBe("view-in");

    await page.reload();
    const sun = await page
      .locator("[data-splash] .logo-sun")
      .evaluate((el) => getComputedStyle(el).animationName);
    expect(sun).toBe("sun-rise");
  });

  test.describe("khi máy đặt chế độ giảm chuyển động", () => {
    test.use({ contextOptions: { reducedMotion: "reduce" } });

    test("mọi hoạt hình tắt hẳn mà nội dung vẫn hiện đủ", async ({ page }) => {
      await page.goto("/");
      // Màn hình chào hiện thẳng khung hình cuối: mặt trời đứng yên.
      const sun = await page
        .locator("[data-splash] .logo-sun")
        .evaluate((el) => getComputedStyle(el).animationName);
      expect(sun).toBe("none");

      await openApp(page);
      const view = await page.locator(".view-enter").first().evaluate((el) => {
        const s = getComputedStyle(el);
        return { anim: s.animationName, opacity: s.opacity };
      });
      expect(view.anim).toBe("none");
      expect(Number(view.opacity)).toBe(1);
      await expect(page.locator(SONG_ROW)).toHaveCount(SONG_COUNT);
    });

    test("lời hát vẫn chạy theo nhạc, chỉ là không trôi mượt", async ({ page }) => {
      await openApp(page);
      await openFirstSong(page);
      await waitForLyrics(page);
    });
  });
});
