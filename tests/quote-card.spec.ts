import { expect, test } from "@playwright/test";
import { openApp, openFirstSong } from "./helpers";

test("chia sẻ câu hát thành ảnh: máy không gửi được tệp thì tải ảnh PNG về", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "canShare", { value: () => false, configurable: true });
  });
  await openApp(page);
  await openFirstSong(page);
  await page.getByRole("button", { name: /^Thêm thao tác cho/ }).click();
  const [dl] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Chia sẻ câu hát thành ảnh" }).click(),
  ]);
  expect(dl.suggestedFilename()).toBe("je-voudrais-te-parler-chansonia.png");
  await expect(page.getByRole("status")).toHaveText("Đã tải ảnh câu hát");
});
