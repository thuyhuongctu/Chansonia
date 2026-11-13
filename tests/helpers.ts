import { expect, type Page } from "@playwright/test";

/** Một hàng bài hát trong danh sách thư viện. */
export const SONG_ROW = "[data-song-id]";

/** Một hàng video trong danh sách thư viện. */
export const VIDEO_ROW = "[data-video-id]";

/**
 * Số bài và số video của từng bộ sưu tập. Thêm hoặc bớt thì sửa đúng một chỗ
 * này, đừng rải con số ra khắp các tệp kiểm thử.
 */
export const COUNTS = {
  huong: { songs: 9, videos: 1 },
  bizon: { songs: 17, videos: 8 },
  maida: { songs: 2, videos: 0 },
  vandon: { songs: 1, videos: 0 },
  bachai: { songs: 1, videos: 0 },   // lyric video .mp4 đã bị gỡ khỏi kho trò chơi
  chantroi: { songs: 1, videos: 0 },
} as const;

/** Số bài của bộ sưu tập mở sẵn khi vào app (Hương). */
export const SONG_COUNT = COUNTS.huong.songs;

/**
 * Mở ứng dụng và chờ thư viện hiện xong.
 *
 * Trả về danh sách lỗi mà trình duyệt ghi ra trong lúc chạy — cuối bài kiểm
 * thử chỉ cần `expect(errors).toEqual([])` là biết có gì vỡ ngầm hay không.
 * Màn hình chào không chặn tay bấm (pointer-events: none) nên không cần chờ
 * nó tắt.
 */
export async function openApp(page: Page): Promise<string[]> {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console: ${m.text()}`);
  });
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { level: 1, name: "Chansonia" })).toBeVisible();
  await expect(page.locator(SONG_ROW).first()).toBeVisible();
  return errors;
}

/** Ô tìm kiếm của thư viện. */
export function searchBox(page: Page) {
  return page.getByLabel("Tìm trong bộ sưu tập");
}

/**
 * Số hàng bài hát của bộ sưu tập đang xem — không tính các hàng «Ở bộ sưu
 * tập khác» hiện thêm khi đang tìm.
 */
export async function songCount(page: Page): Promise<number> {
  return page.locator(`[data-library-list] > [data-row] > ${SONG_ROW}`).count();
}

/** Nút chọn bộ sưu tập. */
export function collectionTab(page: Page, name: "La maison de Madam Hương" | "BizOnland" | "M-AIDA" | "Van Don – Vietnam’s First Trading Port" | "Bac Hai Dao – Pirates of the Gulf of Tonkin") {
  return page.getByRole("tab", { name, exact: true });
}

/** Cuộn danh sách thư viện. */
export async function scrollPane(page: Page, dy: number) {
  await page.locator("[data-library-list]").evaluate((el, d) => el.scrollBy(0, d), dy);
  await page.waitForTimeout(400);
}

/** Thanh tiến độ (kéo được). */
export function scrubber(page: Page) {
  return page.getByRole("slider", { name: "Tiến độ bài hát" });
}

/** Số giây đã nghe, đọc từ thanh tiến độ. */
export async function elapsedSeconds(page: Page): Promise<number> {
  return Number((await scrubber(page).getAttribute("aria-valuenow")) ?? "0");
}

/**
 * Bấm vào bài đầu tiên: màn hình lời mở ra và nhạc phát luôn. Chờ tới khi
 * đồng hồ thật sự chạy.
 */
export async function openFirstSong(page: Page) {
  await page.locator(SONG_ROW).first().click();
  await expect(page.getByRole("button", { name: "Quay lại" })).toBeVisible();
  await waitForPlayback(page);
}

/** Chờ nhạc thật sự chạy. */
export async function waitForPlayback(page: Page) {
  await expect(page.getByRole("button", { name: "Tạm dừng" })).toBeVisible();
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

/** Tên bài đang mở, đọc từ thanh đầu màn hình lời. */
export function songTitleInHeader(page: Page): Promise<string | null> {
  return page.locator("[data-screen-title]").textContent();
}

/** Tên bài đang nghe, đọc từ thanh phát (có ở mọi màn hình). */
export function nowPlayingTitle(page: Page): Promise<string | null> {
  return page.locator("[data-now-title]").textContent();
}

/** Thứ tự dòng lời đang được hát; -1 nghĩa là vẫn đang dạo nhạc. */
export async function activeLyricIndex(page: Page): Promise<number> {
  const el = page.locator('.lyric-line[data-state="active"]');
  if ((await el.count()) === 0) return -1;
  return Number(await el.getAttribute("data-line"));
}
