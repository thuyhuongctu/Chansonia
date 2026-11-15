import { readFile } from "node:fs/promises";
import { expect, test, type Page } from "@playwright/test";
import {
  elapsedSeconds,
  openApp,
  openFirstSong,
  SONG_ROW,
  waitForLyrics,
  waitForPlayback,
} from "./helpers";

/** Bỏ tiêu điểm khỏi nút vừa bấm, để phím tắt đi thẳng tới ứng dụng. */
async function blur(page: Page) {
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
}

/** Chờ service worker cài xong và trông coi trang (lần đầu thì tải lại trang). */
async function serviceWorkerControls(page: Page) {
  await page.evaluate(() => navigator.serviceWorker.ready);
  if (!(await page.evaluate(() => !!navigator.serviceWorker.controller))) {
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator(SONG_ROW).first()).toBeVisible();
  }
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
}

test.describe("Phím tắt", () => {
  test("K / dấu cách phát · dừng, mũi tên tua 5 giây, Shift + mũi tên sang phần sau", async ({ page }) => {
    await openApp(page);
    await openFirstSong(page);
    await blur(page);

    await page.keyboard.press("k");
    await expect(page.getByRole("button", { name: "Phát", exact: true })).toBeVisible();

    const t0 = await elapsedSeconds(page);
    await page.keyboard.press("ArrowRight");
    await expect.poll(() => elapsedSeconds(page)).toBeGreaterThanOrEqual(t0 + 4);
    await page.keyboard.press("ArrowLeft");
    await expect.poll(() => elapsedSeconds(page)).toBeLessThanOrEqual(t0 + 1);

    // «Je voudrais te parler»: khổ 1 bắt đầu ở 0:06, điệp khúc ở 1:44.
    await page.keyboard.press("Shift+ArrowRight");
    await expect.poll(() => elapsedSeconds(page)).toBeGreaterThanOrEqual(6);
    await page.keyboard.press("Shift+ArrowRight");
    await expect.poll(() => elapsedSeconds(page)).toBeGreaterThanOrEqual(104);

    await page.keyboard.press(" ");
    await waitForPlayback(page);
  });

  test("L thêm vào Yêu thích; phím tắt không chạy khi đang gõ chữ", async ({ page }) => {
    await openApp(page);
    await page.getByLabel("Tìm trong bộ sưu tập").fill("k");
    await expect(page.getByLabel("Tìm trong bộ sưu tập")).toHaveValue("k");
    await expect(page.getByRole("button", { name: "Phát", exact: true })).toBeVisible();

    await openFirstSong(page);
    await blur(page);
    await page.keyboard.press("l");
    await expect(page.getByRole("button", { name: "Bỏ khỏi Yêu thích" })).toHaveAttribute("aria-pressed", "true");
  });
});

test.describe("Trình đọc màn hình", () => {
  test("dòng đang hát được đánh dấu aria-current", async ({ page }) => {
    await openApp(page);
    await openFirstSong(page);
    await waitForLyrics(page);
    const active = page.locator('.lyric-line[data-state="active"]');
    await expect(active).toHaveAttribute("aria-current", "true");
    await expect(page.locator('.lyric-line[aria-current="true"]')).toHaveCount(1);
  });

  test("bật trong menu thì dòng đang hát được đọc lên, mặc định tắt", async ({ page }) => {
    await openApp(page);
    await openFirstSong(page);
    await waitForLyrics(page);

    const announcer = page.locator("[data-announcer]");
    await expect(announcer).toHaveAttribute("aria-live", "polite");
    await expect(announcer).toHaveText("");

    await page.locator("[data-song-menu]").click();
    await page.getByRole("button", { name: "Đọc dòng đang hát cho trình đọc màn hình" }).click();
    await page.getByRole("button", { name: "Đóng" }).click();

    await expect
      .poll(async () => {
        const said = (await announcer.textContent())?.replace(/\s+/g, " ").trim();
        const line = (await page.locator('.lyric-line[data-state="active"]').textContent())
          ?.replace(/\s+/g, " ")
          .trim();
        return Boolean(said) && said === line;
      })
      .toBe(true);
  });
});

test.describe("Xuất lời LRC", () => {
  test("tải về tệp .lrc có mốc thời gian đúng", async ({ page }) => {
    await openApp(page);
    await page.locator("[data-song-menu]").first().click();
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "Tải lời có mốc thời gian (.lrc)" }).click(),
    ]);
    expect(download.suggestedFilename()).toBe("je-voudrais-te-parler.lrc");
    const text = await readFile((await download.path())!, "utf8");
    expect(text).toContain("[ti:Je voudrais te parler]");
    expect(text).toMatch(/^\[length:2:51\]$/m);
    expect(text).toMatch(/^\[00:06\.8\d\]Je voudrais poser mes mains/m);
    expect(text).toMatch(/^\[01:44\.8\d\]Je voudrais te parler, à toi,/m);
    // Mọi dòng lời đều có mốc thời gian đúng định dạng.
    const lines = text.split("\n").filter((l) => l && !/^\[[a-z]+:/.test(l));
    for (const l of lines) expect(l).toMatch(/^\[\d{2}:\d{2}\.\d{2}\]/);
  });
});

test.describe("Tải về nghe offline", () => {
  test("tải một bài về, mất mạng vẫn phát và tua được", async ({ page, context }) => {
    await openApp(page);
    await serviceWorkerControls(page);

    await page.locator("[data-song-menu]").first().click();
    await page.getByRole("button", { name: "Tải về nghe offline" }).click();
    await expect(page.locator("[data-toast]")).toHaveText("Đã tải về, nghe được khi không có mạng", {
      timeout: 20_000,
    });

    // Mục «Của tôi» liệt kê bài đã tải.
    await page.getByRole("tab", { name: "Của tôi" }).click();
    await expect(page.locator('[data-section="offline"] [data-song-id]')).toHaveCount(1);

    await context.setOffline(true);
    try {
      // Service worker trả đúng đoạn được xin (mã 206), nên tua vẫn được khi mất mạng.
      const ranged = await page.evaluate(async () => {
        const res = await fetch("audio/track01.mp3", { headers: { Range: "bytes=1000-1999" } });
        return { status: res.status, range: res.headers.get("content-range"), size: (await res.arrayBuffer()).byteLength };
      });
      expect(ranged.status).toBe(206);
      expect(ranged.range).toMatch(/^bytes 1000-1999\/\d+$/);
      expect(ranged.size).toBe(1000);

      await page.locator('[data-section="offline"] [data-song-id]').click();
      await waitForPlayback(page);
    } finally {
      await context.setOffline(false);
    }

    // Xoá bản tải về thì kho trống.
    await page.locator("[data-song-menu]").click();
    await page.getByRole("button", { name: "Xoá bản tải về" }).click();
    await expect
      .poll(() => page.evaluate(async () => (await (await caches.open("chansonia-offline")).keys()).length))
      .toBe(0);
  });
});
