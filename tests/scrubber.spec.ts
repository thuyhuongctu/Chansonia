import { expect, test } from "@playwright/test";
import { elapsedSeconds, openApp, openFirstSong, playSong, scrubber } from "./helpers";

/** Đọc số giây mà thanh tiến độ đang báo cho máy đọc màn hình. */
async function valueNow(page: import("@playwright/test").Page): Promise<number> {
  return Number((await scrubber(page).getAttribute("aria-valuenow")) ?? "0");
}

test.describe("Kéo thanh tiến độ", () => {
  test.beforeEach(async ({ page }) => {
    await openApp(page);
    await openFirstSong(page);
    await playSong(page);
  });

  test("kéo tới đâu nhạc nhảy tới đó", async ({ page }) => {
    const bar = scrubber(page);
    const box = await bar.boundingBox();
    expect(box).not.toBeNull();
    const y = box!.y + box!.height / 2;

    const truoc = await valueNow(page);

    await page.mouse.move(box!.x + box!.width * 0.1, y);
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width * 0.7, y, { steps: 15 });

    // Đang kéo: số giờ chạy theo ngón tay, và thanh biết mình đang bị kéo.
    await expect(bar).toHaveAttribute("data-dragging", "true");
    const dangKeo = await valueNow(page);
    expect(dangKeo).toBeGreaterThan(truoc + 30);

    await page.mouse.up();
    await expect(bar).toHaveAttribute("data-dragging", "false");

    // Buông tay thì nhạc thật sự nhảy tới chỗ ấy (sai lệch vài giây là cùng).
    await expect
      .poll(() => elapsedSeconds(page), { timeout: 10_000 })
      .toBeGreaterThan(dangKeo - 5);
  });

  test("kéo ra ngoài thanh rồi buông vẫn nhận", async ({ page }) => {
    const bar = scrubber(page);
    const box = await bar.boundingBox();
    const y = box!.y + box!.height / 2;

    await page.mouse.move(box!.x + box!.width * 0.5, y);
    await page.mouse.down();
    // Rê ngón tay lên hẳn giữa trang, ra khỏi thanh tiến độ.
    await page.mouse.move(box!.x + box!.width * 0.25, y - 200, { steps: 10 });
    await page.mouse.up();

    await expect(bar).toHaveAttribute("data-dragging", "false");
    await expect.poll(() => valueNow(page), { timeout: 10_000 }).toBeGreaterThan(20);
  });

  test("kéo quá mép trái thì về đầu bài, quá mép phải thì tới cuối", async ({ page }) => {
    const bar = scrubber(page);
    const box = await bar.boundingBox();
    const y = box!.y + box!.height / 2;
    const total = Number(await bar.getAttribute("aria-valuemax"));

    await page.mouse.move(box!.x + box!.width * 0.5, y);
    await page.mouse.down();
    await page.mouse.move(box!.x - 300, y, { steps: 8 });
    await page.mouse.up();
    await expect.poll(() => valueNow(page), { timeout: 10_000 }).toBeLessThanOrEqual(3);

    await page.mouse.move(box!.x + box!.width * 0.5, y);
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width + 300, y, { steps: 8 });
    await page.mouse.up();
    await expect.poll(() => valueNow(page), { timeout: 10_000 }).toBeGreaterThanOrEqual(
      total - 3,
    );
  });

  test("dùng bàn phím cũng tua được", async ({ page }) => {
    const bar = scrubber(page);
    await bar.focus();

    await bar.press("Home");
    await expect.poll(() => valueNow(page), { timeout: 10_000 }).toBeLessThanOrEqual(2);

    await bar.press("ArrowRight");
    await bar.press("ArrowRight");
    await expect.poll(() => valueNow(page), { timeout: 10_000 }).toBeGreaterThanOrEqual(8);

    await bar.press("ArrowLeft");
    await expect.poll(() => valueNow(page), { timeout: 10_000 }).toBeLessThanOrEqual(8);

    await bar.press("End");
    const total = Number(await bar.getAttribute("aria-valuemax"));
    await expect.poll(() => valueNow(page), { timeout: 10_000 }).toBeGreaterThanOrEqual(
      total - 2,
    );
  });

  test("thanh tiến độ tự giới thiệu đúng cho máy đọc màn hình", async ({ page }) => {
    const bar = scrubber(page);
    await expect(bar).toHaveAttribute("aria-valuemin", "0");

    const total = Number(await bar.getAttribute("aria-valuemax"));
    expect(total).toBeGreaterThan(60);

    const noi = await bar.getAttribute("aria-valuetext");
    expect(noi).toMatch(/^\d+:\d\d trên \d+:\d\d$/);
  });
});
