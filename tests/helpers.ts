import { expect, type Page } from "@playwright/test";

/** Thẻ bài hát trong trang album (mỗi bài một thẻ). */
export const SONG_CARD = "article.song-card";

/**
 * Mở ứng dụng và chờ trang album hiện xong.
 *
 * Trả về danh sách lỗi mà trình duyệt ghi ra trong lúc chạy — cuối bài kiểm
 * thử chỉ cần `expect(errors).toEqual([])` là biết có gì vỡ ngầm hay không.
 */
export async function openApp(page: Page): Promise<string[]> {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console: ${m.text()}`);
  });
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator(SONG_CARD).first()).toBeVisible();
  return errors;
}

/** Ô tìm kiếm trên trang album. */
export function searchBox(page: Page) {
  return page.getByLabel("Tìm bài hát");
}

/** Số thẻ bài hát đang hiện. */
export async function songCount(page: Page): Promise<number> {
  return page.locator(SONG_CARD).count();
}

/**
 * Cuộn khung nội dung. Cả trang không cuộn (khung ứng dụng cao đúng bằng màn
 * hình), nên phải đưa con trỏ vào giữa khung rồi mới lăn chuột.
 */
export async function scrollPane(page: Page, dy: number) {
  const size = page.viewportSize() ?? { width: 800, height: 600 };
  await page.mouse.move(size.width / 2, size.height / 2);
  await page.mouse.wheel(0, dy);
  await page.waitForTimeout(500);
}

/** Mở bài hát đầu tiên trong danh sách và chờ màn hình bài hát hiện ra. */
export async function openFirstSong(page: Page) {
  await page.locator("[data-song-id]").first().click();
  await expect(page.getByRole("button", { name: "Phát bài hát" })).toBeVisible();
}

/** Đọc đồng hồ bên trái thanh tiến độ, ví dụ "1:23", đổi ra giây. */
export async function elapsedSeconds(page: Page): Promise<number> {
  const text = (await page.locator('[role="slider"] ~ div span').first().textContent()) ?? "0:00";
  const [m, s] = text.trim().split(":").map(Number);
  return m * 60 + s;
}

/** Thanh tiến độ (kéo được). */
export function scrubber(page: Page) {
  return page.getByRole("slider", { name: "Tiến độ bài hát" });
}

/**
 * Bấm phát rồi chờ nhạc thật sự chạy.
 *
 * Bài nào cũng có đoạn dạo nhạc trước khi vào lời, nên chờ riêng cho dòng lời
 * đầu tiên sáng lên bằng `waitForLyrics`.
 */
export async function playSong(page: Page) {
  await page.getByRole("button", { name: "Phát bài hát" }).click();
  await expect
    .poll(() => elapsedSeconds(page), { timeout: 20_000, message: "nhạc phải chạy" })
    .toBeGreaterThan(0);
}

/** Chờ qua đoạn dạo nhạc, tới khi có đúng một dòng lời đang được hát. */
export async function waitForLyrics(page: Page) {
  await expect(page.locator('.lyric-line[data-state="active"]')).toHaveCount(1, {
    timeout: 30_000,
  });
}

/**
 * Tên bài đang mở, đọc từ thanh đầu trang.
 *
 * Đừng đọc từ thẻ <h1>: thẻ ấy nằm trong tấm bìa bài hát, mà tấm bìa biến mất
 * ngay khi nhạc bắt đầu chạy, nhường chỗ cho khung lời. Thanh đầu trang thì
 * luôn có tên bài, dù đang xem bìa hay đang nghe.
 */
export function songTitleInHeader(page: Page): Promise<string | null> {
  return page.locator("header p").first().textContent();
}

/** Thứ tự dòng lời đang được hát; -1 nghĩa là vẫn đang dạo nhạc. */
export function activeLyricIndex(page: Page): Promise<number> {
  return page.$$eval(".lyric-line", (els) =>
    els.findIndex((e) => e.getAttribute("data-state") === "active"),
  );
}
