import { expect, test } from "@playwright/test";
import { openApp, openFirstSong } from "./helpers";

test.describe("Lời dịch tiếng Anh", () => {
  test("bài tiếng Pháp có dòng dịch dưới câu hát, bật/tắt được và nhớ lựa chọn", async ({ page }) => {
    await openApp(page);
    await openFirstSong(page);
    const tr = page.locator("[data-translation]");
    await expect(tr.first()).toHaveText("I'd like to lay down my hands, stop writing for a while,");
    const nut = page.locator("[data-translation-toggle]");
    await expect(nut).toHaveAttribute("aria-pressed", "true");
    await nut.click();
    await expect(tr).toHaveCount(0);
    await page.reload();
    await openFirstSong(page);
    await expect(page.locator("[data-translation-toggle]")).toHaveAttribute("aria-pressed", "false");
  });

  test("bài tiếng Anh không có nút lời dịch", async ({ page }) => {
    await page.goto("/?bai=the-lamp-still-burns");
    await expect(page.locator("[data-screen-title]")).toHaveText("The Lamp Still Burns");
    await expect(page.locator("[data-translation-toggle]")).toHaveCount(0);
  });
});
