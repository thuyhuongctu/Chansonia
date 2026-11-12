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

    // Màn hình chào chỉ hiện một lần mỗi lượt mở, nên mở một tab mới hẳn.
    const tab = await page.context().browser()!.newPage();
    await tab.goto(page.url());
    const sun = await tab
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
      // Bản đồ nền và ô logo cũng đứng yên.
      for (const sel of [".map-backdrop-inner", ".logo-3d"]) {
        expect(
          await page.locator(sel).first().evaluate((el) => getComputedStyle(el).animationName),
        ).toBe("none");
      }
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
