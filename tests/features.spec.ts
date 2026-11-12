import { expect, test } from "@playwright/test";
import { openApp, openFirstSong, SONG_ROW, songTitleInHeader } from "./helpers";

test.describe("Chức năng như các app nhạc", () => {
  test("thêm vào Yêu thích, xem lại ở mục ♥, và vẫn còn sau khi mở lại app", async ({ page }) => {
    await openApp(page);
    await expect(page.getByRole("tab", { name: "Yêu thích · 0" })).toBeVisible();

    await openFirstSong(page);
    await page.getByRole("button", { name: "Thêm vào Yêu thích" }).click();
    await expect(page.getByRole("button", { name: "Bỏ khỏi Yêu thích" })).toHaveAttribute("aria-pressed", "true");

    await page.getByRole("button", { name: "Quay lại" }).click();
    await page.getByRole("tab", { name: "Yêu thích · 1" }).click();
    await expect(page.locator(SONG_ROW)).toHaveCount(1);
    await expect(page.locator(SONG_ROW)).toContainText("Je voudrais te parler");

    await page.reload();
    await expect(page.getByRole("tab", { name: "Yêu thích · 1" })).toBeVisible();
  });

  test("nút lặp lại đổi vòng: tắt → cả danh sách → một bài", async ({ page }) => {
    await openApp(page);
    await openFirstSong(page);
    const nut = page.locator("[data-repeat]");
    await expect(nut).toHaveAttribute("data-repeat", "off");
    await nut.click();
    await expect(nut).toHaveAttribute("data-repeat", "all");
    await nut.click();
    await expect(nut).toHaveAttribute("data-repeat", "one");
    await nut.click();
    await expect(nut).toHaveAttribute("data-repeat", "off");
  });

  test("đường link chia sẻ mở thẳng vào đúng bài", async ({ page }) => {
    await page.goto("/?bai=the-lamp-still-burns");
    await expect.poll(() => songTitleInHeader(page)).toBe("The Lamp Still Burns");
    // Mở xong thì bỏ ?bai=… khỏi thanh địa chỉ.
    await expect(page).not.toHaveURL(/bai=/);
  });

  test("nút chia sẻ chép đường link khi máy không có bảng chia sẻ", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "share", { value: undefined, configurable: true });
    });
    await openApp(page);
    await openFirstSong(page);
    await page.getByRole("button", { name: "Chia sẻ bài này" }).click();
    await expect(page.getByRole("status")).toHaveText("Đã chép đường link của bài");
    const link = await page.evaluate(() => navigator.clipboard.readText());
    expect(link).toMatch(/\?bai=je-voudrais-te-parler$/);
  });

  test("màn hình khoá và tai nghe nhận đúng tên bài", async ({ page }) => {
    await openApp(page);
    await openFirstSong(page);
    const meta = await page.evaluate(() => ({
      title: navigator.mediaSession.metadata?.title,
      artist: navigator.mediaSession.metadata?.artist,
      state: navigator.mediaSession.playbackState,
    }));
    expect(meta.title).toContain("Je voudrais te parler");
    expect(meta.artist).toBe("Je m'appelle Hương");
    expect(meta.state).toBe("playing");
  });

  test("phím tắt: Space phát/dừng, L yêu thích", async ({ page }) => {
    await openApp(page);
    await page.locator("body").click({ position: { x: 5, y: 5 } });
    await page.keyboard.press("Space");
    await expect(page.getByRole("button", { name: "Tạm dừng" })).toBeVisible();
    await page.locator("body").click({ position: { x: 5, y: 5 } });
    await page.keyboard.press("Space");
    await expect(page.getByRole("button", { name: "Phát", exact: true })).toBeVisible();

    await page.keyboard.press("l");
    await expect(page.getByRole("tab", { name: "Yêu thích · 1" })).toBeVisible();
  });
});
