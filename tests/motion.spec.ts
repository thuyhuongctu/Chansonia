import { expect, test } from "@playwright/test";
import { openApp, openFirstSong, playSong, SONG_CARD, waitForLyrics } from "./helpers";

test.describe("Chuyển động", () => {
  test("bình thường thì thẻ bài hát hiện lên có chuyển động", async ({ page }) => {
    await openApp(page);
    const anim = await page
      .locator(".rise-in")
      .first()
      .evaluate((el) => getComputedStyle(el).animationName);
    expect(anim).toBe("rise-in");
  });

  test.describe("khi máy đặt chế độ giảm chuyển động", () => {
    test.use({ contextOptions: { reducedMotion: "reduce" } });

    test("mọi hoạt hình tắt hẳn mà nội dung vẫn hiện đủ", async ({ page }) => {
      await openApp(page);

      const card = page.locator(".rise-in").first();
      const style = await card.evaluate((el) => {
        const s = getComputedStyle(el);
        return { anim: s.animationName, opacity: s.opacity, transform: s.transform };
      });

      expect(style.anim).toBe("none");
      // Tắt hoạt hình mà vẫn phải nhìn thấy — không được đứng yên ở trạng thái mờ.
      expect(Number(style.opacity)).toBe(1);
      expect(["none", "matrix(1, 0, 0, 1, 0, 0)"]).toContain(style.transform);

      await expect(page.locator(SONG_CARD)).toHaveCount(6);
    });

    test("lời hát vẫn chạy theo nhạc, chỉ là không trôi mượt", async ({ page }) => {
      await openApp(page);
      await openFirstSong(page);
      await playSong(page);
      await waitForLyrics(page);
    });
  });
});
