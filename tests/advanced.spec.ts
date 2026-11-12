import { expect, test } from "@playwright/test";
import { SONG_ROW, openApp } from "./helpers";

/** Chặn phát thật: nhạc phát từ mạng, kiểm thử chỉ cần trạng thái của app. */
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    HTMLMediaElement.prototype.play = function () {
      return Promise.resolve();
    };
  });
});

test.describe("Chức năng như các app nghe nhạc", () => {
  test("hàng chờ: phát tiếp theo, thêm vào cuối, sắp xếp, bỏ bớt, và «bài sau» lấy từ hàng chờ", async ({ page }) => {
    await openApp(page);
    const rows = page.locator(SONG_ROW);
    const third = (await rows.nth(2).getAttribute("data-song-id"))!;
    const fifth = (await rows.nth(4).getAttribute("data-song-id"))!;

    await page.locator(`[data-song-menu="${fifth}"]`).click();
    await page.getByRole("button", { name: "Thêm vào hàng chờ" }).click();
    await expect(page.locator("[data-toast]")).toHaveText("Đã thêm vào hàng chờ");
    await page.locator(`[data-song-menu="${third}"]`).click();
    await page.getByRole("button", { name: "Phát tiếp theo" }).click();

    await rows.first().click();
    await expect(page.locator("[data-queue-button]")).toContainText("2");
    await page.locator("[data-queue-button]").click();
    const queue = page.locator("[data-queue] li");
    await expect(queue).toHaveCount(2);
    // bài «phát tiếp theo» đứng đầu
    await page.getByRole("button", { name: "Đưa xuống" }).first().click();
    await page.getByRole("button", { name: "Bỏ khỏi hàng chờ" }).last().click();
    await expect(queue).toHaveCount(1);
    await page.keyboard.press("Escape");

    await page.getByRole("button", { name: "Bài sau" }).click();
    await expect
      .poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("chansonia-player")!).songId))
      .toBe(fifth);
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem("chansonia-queue") ?? "[]"))).toEqual([]);
  });

  test("playlist: tạo từ menu ⋯, thêm bài, phát, đổi tên, xoá — và nhớ sau khi tải lại", async ({ page }) => {
    await openApp(page);
    const rows = page.locator(SONG_ROW);
    const a = (await rows.nth(0).getAttribute("data-song-id"))!;
    const b = (await rows.nth(1).getAttribute("data-song-id"))!;

    await page.locator(`[data-song-menu="${a}"]`).click();
    await page.getByRole("button", { name: "Thêm vào playlist" }).click();
    await page.getByLabel("Tên playlist mới").fill("Đêm mưa");
    await page.getByRole("button", { name: "Tạo" }).click();
    await expect(page.locator("[data-toast]")).toHaveText("Đã thêm vào «Đêm mưa»");

    await page.locator(`[data-song-menu="${b}"]`).click();
    await page.getByRole("button", { name: "Thêm vào playlist" }).click();
    await page.locator("[data-playlist-picker]").getByRole("button", { name: /Đêm mưa/ }).click();
    // thêm lần hai thì báo đã có
    await page.locator(`[data-song-menu="${b}"]`).click();
    await page.getByRole("button", { name: "Thêm vào playlist" }).click();
    await page.locator("[data-playlist-picker]").getByRole("button", { name: /Đêm mưa/ }).click();
    await expect(page.locator("[data-toast]")).toHaveText("Bài đã có trong «Đêm mưa»");

    await page.reload();
    await page.getByRole("tab", { name: "Của tôi" }).click();
    await page.locator("[data-playlist]").filter({ hasText: "Đêm mưa" }).click();
    const detail = page.locator("[data-playlist-detail]");
    await expect(detail.locator(SONG_ROW)).toHaveCount(2);

    await page.getByRole("button", { name: "Đổi tên playlist" }).click();
    await page.getByLabel("Tên playlist", { exact: true }).fill("Nghe khi mưa");
    await page.keyboard.press("Enter");
    await expect(detail.getByRole("heading")).toHaveText("Nghe khi mưa");

    await page.getByRole("button", { name: "Phát playlist" }).click();
    await expect(page.locator("[data-screen-title]")).toBeVisible();
    await expect(page.locator("[data-queue-button]")).toContainText("1");

    await page.getByRole("button", { name: "Quay lại" }).click();
    await page.getByRole("button", { name: "Xoá playlist" }).click();
    await page.getByRole("button", { name: "Bấm lần nữa để xoá" }).click();
    await expect(page.locator("[data-playlist]")).toHaveCount(0);
  });

  test("Của tôi: nghe gần đây và nghe nhiều nhất tự ghi lại, xoá được", async ({ page }) => {
    await openApp(page);
    const rows = page.locator(SONG_ROW);
    const a = (await rows.nth(1).getAttribute("data-song-id"))!;
    await rows.nth(1).click();
    await page.getByRole("button", { name: "Quay lại" }).click();
    await rows.nth(2).click();
    await page.getByRole("button", { name: "Quay lại" }).click();
    await rows.nth(1).click();
    await page.getByRole("button", { name: "Quay lại" }).click();

    await page.getByRole("tab", { name: "Của tôi" }).click();
    const top = page.locator('[data-section="top"]');
    await expect(top.locator(SONG_ROW).first()).toHaveAttribute("data-song-id", a);
    await expect(top).toContainText("2 lần");
    await expect(page.locator('[data-section="recent"]').locator(SONG_ROW)).toHaveCount(2);

    await page.getByRole("button", { name: "Xoá lịch sử" }).click();
    await expect(page.locator('[data-section="recent"]')).toContainText("Chưa nghe bài nào.");
  });

  test("tốc độ phát chỉnh được ở bài đang nghe và được nhớ", async ({ page }) => {
    await openApp(page);
    await page.locator(SONG_ROW).first().click();
    await page.getByRole("button", { name: /^Thêm thao tác cho/ }).click();
    await page.getByRole("button", { name: "1.25×" }).click();
    expect(await page.evaluate(() => document.querySelector("audio")!.playbackRate)).toBe(1.25);
    await page.reload();
    expect(await page.evaluate(() => localStorage.getItem("chansonia-rate"))).toBe("1.25");
  });

  test("nút làm mới trang tải lại app và giữ bài đang nghe", async ({ page }) => {
    await openApp(page);
    const id = (await page.locator(SONG_ROW).nth(3).getAttribute("data-song-id"))!;
    await page.locator(SONG_ROW).nth(3).click();
    await page.getByRole("button", { name: "Quay lại" }).click();
    await page.evaluate(() => ((window as unknown as { __mark: number }).__mark = 1));
    await Promise.all([page.waitForEvent("load"), page.getByRole("button", { name: "Làm mới trang" }).click()]);
    expect(await page.evaluate(() => (window as unknown as { __mark?: number }).__mark)).toBeUndefined();
    await expect(page.locator(`${SONG_ROW}[data-current]`)).toHaveAttribute("data-song-id", id);
  });
});
