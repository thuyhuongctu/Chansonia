import { expect, test } from "@playwright/test";
import { collectionTab, openApp, searchBox, SONG_COUNT, SONG_ROW, songCount, VIDEO_ROW } from "./helpers";

test.describe("Tìm kiếm", () => {
  test("gõ không dấu vẫn ra đúng bài như gõ có dấu", async ({ page }) => {
    await openApp(page);
    const box = searchBox(page);

    await box.fill("Hương");
    await expect(page.locator(SONG_ROW).first()).toBeVisible();
    const coDau = await songCount(page);

    await box.fill("huong");
    await expect(page.locator(SONG_ROW).first()).toBeVisible();
    expect(await songCount(page)).toBe(coDau);
    expect(coDau).toBeGreaterThan(0);
    expect(coDau).toBeLessThan(SONG_COUNT);
  });

  test("chữ đ và chữ d tìm ra như nhau", async ({ page }) => {
    await openApp(page);
    const box = searchBox(page);

    await box.fill("đèn");
    await expect(page.locator(SONG_ROW).first()).toBeVisible();
    const a = await songCount(page);

    await box.fill("den");
    await expect(page.locator(SONG_ROW).first()).toBeVisible();
    expect(await songCount(page)).toBe(a);
  });

  test("tìm được cả theo lời hát, không chỉ theo tên bài", async ({ page }) => {
    await openApp(page);
    // Từ này không nằm trong tên bài nào, chỉ có trong lời.
    await searchBox(page).fill("river");
    await expect(page.locator(SONG_ROW).first()).toBeVisible();
    expect(await songCount(page)).toBeGreaterThan(0);
  });

  test("không có gì khớp thì báo rõ và bấm một nút là xem lại tất cả", async ({ page }) => {
    await openApp(page);

    await searchBox(page).fill("xyzzy khong co bai nao");
    await expect(page.getByText("Không có gì khớp.")).toBeVisible();
    expect(await songCount(page)).toBe(0);

    await page.getByRole("button", { name: "Xem lại tất cả" }).click();
    await expect(page.locator(SONG_ROW)).toHaveCount(SONG_COUNT);
    await expect(searchBox(page)).toHaveValue("");
  });

  test("nút xoá từ khoá trả lại đủ danh sách", async ({ page }) => {
    await openApp(page);

    await searchBox(page).fill("den");
    await page.getByRole("button", { name: "Xoá từ khoá" }).click();
    await expect(searchBox(page)).toHaveValue("");
    await expect(page.locator(SONG_ROW)).toHaveCount(SONG_COUNT);
  });

  test("lọc được cả danh sách video", async ({ page }) => {
    await openApp(page);
    await page.getByRole("tab", { name: /^Video ·/ }).click();
    await searchBox(page).fill("song");
    await expect(page.locator(VIDEO_ROW)).toHaveCount(2);
  });

  test("đổi bộ sưu tập thì xoá từ khoá cũ", async ({ page }) => {
    await openApp(page);
    await searchBox(page).fill("lampe");
    await collectionTab(page, "BizOn").click();
    await expect(searchBox(page)).toHaveValue("");
    await expect(page.locator(SONG_ROW)).toHaveCount(17);
  });
});
