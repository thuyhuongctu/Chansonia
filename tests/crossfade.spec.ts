import { expect, test } from "@playwright/test";
import { openApp, openFirstSong, songTitleInHeader } from "./helpers";

test("chuyển bài mượt: cuối bài nhạc nhỏ dần rồi sang bài sau, âm lượng trở lại", async ({ page }) => {
  await openApp(page);
  await openFirstSong(page);
  await page.waitForFunction(() => (document.querySelector("audio")?.duration ?? 0) > 0);
  await page.evaluate(() => {
    const a = document.querySelector("audio")!;
    a.currentTime = a.duration - 1;
  });
  await expect.poll(() => page.evaluate(() => document.querySelector("audio")!.volume)).toBeLessThan(0.8);
  await expect.poll(() => songTitleInHeader(page), { timeout: 15_000 }).toBe("La lampe brûle encore");
  await expect.poll(() => page.evaluate(() => document.querySelector("audio")!.volume), { timeout: 5_000 }).toBe(1);
});
