import { expect, test } from "@playwright/test";
import {
  activeLyricIndex,
  elapsedSeconds,
  openApp,
  openFirstSong,
  playSong,
  songTitleInHeader,
  waitForLyrics,
} from "./helpers";

test.describe("Nghe nhạc", () => {
  test("mở một bài là thấy thẻ bài hát và nút phát", async ({ page }) => {
    await openApp(page);
    await openFirstSong(page);

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Je voudrais te parler",
    );
    await expect(page.getByRole("button", { name: "Quay lại danh sách" })).toBeVisible();
  });

  test("bấm phát thì nhạc chạy và lời sáng lên theo từng dòng", async ({ page }) => {
    await openApp(page);
    await openFirstSong(page);
    await playSong(page);

    // Nút trên thanh phát đổi thành "Tạm dừng" ngay khi nhạc chạy.
    await expect(page.getByRole("button", { name: "Tạm dừng" })).toBeVisible();

    // Hết đoạn dạo nhạc thì đúng một dòng lời được làm nổi.
    await waitForLyrics(page);
    await expect(page.locator('.lyric-line[data-state="active"]')).toBeVisible();

    // Những dòng ở xa thì mờ đi, để mắt bám vào dòng đang hát.
    expect(await page.locator('.lyric-line[data-state="far"]').count()).toBeGreaterThan(0);
  });

  test("bấm vào một dòng lời là nhảy tới đúng chỗ đó trong bài", async ({ page }) => {
    await openApp(page);
    await openFirstSong(page);
    await playSong(page);
    await waitForLyrics(page);

    // Tạm dừng trước đã, không thì nhạc chạy tiếp và dòng đang hát đổi ngay
    // trong lúc đang kiểm — hoá ra kiểm nhầm cái khác.
    await page.getByRole("button", { name: "Tạm dừng" }).click();

    await page.locator(".lyric-line button").nth(5).click();
    await expect.poll(() => activeLyricIndex(page), { timeout: 15_000 }).toBe(5);

    // Khung lời tự cuộn để dòng đang hát nằm giữa tầm mắt.
    await expect(page.locator('.lyric-line[data-state="active"]')).toBeInViewport();
    expect(await page.locator(".lyric-stage").evaluate((e) => e.scrollTop)).toBeGreaterThan(
      0,
    );
  });

  test("dòng lời đang hát tự chuyển xuống dòng sau", async ({ page }) => {
    await openApp(page);
    await openFirstSong(page);
    await playSong(page);
    await waitForLyrics(page);

    const dau = await activeLyricIndex(page);
    await expect
      .poll(() => activeLyricIndex(page), { timeout: 40_000 })
      .toBeGreaterThan(dau);
  });

  test("tạm dừng thì đồng hồ đứng lại, phát tiếp thì chạy tiếp", async ({ page }) => {
    await openApp(page);
    await openFirstSong(page);
    await playSong(page);

    await page.getByRole("button", { name: "Tạm dừng" }).click();
    const dung = await elapsedSeconds(page);
    await page.waitForTimeout(2500);
    expect(Math.abs((await elapsedSeconds(page)) - dung)).toBeLessThanOrEqual(1);

    await page.getByRole("button", { name: "Phát", exact: true }).click();
    await expect.poll(() => elapsedSeconds(page), { timeout: 20_000 }).toBeGreaterThan(dung);
  });

  test("nút bài sau chuyển sang bài kế tiếp", async ({ page }) => {
    await openApp(page);
    await openFirstSong(page);
    const dau = await songTitleInHeader(page);
    expect(dau).toBeTruthy();

    // Bấm "Bài sau" là bài mới phát luôn, nên tấm bìa bài hát biến mất ngay.
    // Vì vậy đọc tên bài ở thanh đầu trang, chỗ lúc nào cũng có.
    await page.getByRole("button", { name: "Bài sau" }).click();
    await expect.poll(() => songTitleInHeader(page), { timeout: 15_000 }).not.toBe(dau);

    // Và vẫn ở màn hình bài hát, không bị văng về danh sách.
    await expect(page.getByRole("button", { name: "Quay lại danh sách" })).toBeVisible();
  });

  test("quay lại danh sách vẫn giữ nguyên bài đang nghe", async ({ page }) => {
    await openApp(page);
    await openFirstSong(page);
    await playSong(page);

    await page.getByRole("button", { name: "Quay lại danh sách" }).click();
    await expect(page.locator("article.song-card").first()).toBeVisible();

    // Thanh phát vẫn ở đó, nhạc vẫn chạy, và thẻ bài đang nghe được đánh dấu.
    await expect(page.getByRole("button", { name: "Tạm dừng" })).toBeVisible();
    await expect(page.locator("article.song-card.border-accent")).toHaveCount(1);
  });
});
