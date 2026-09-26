import { expect, test } from "@playwright/test";
import {
  openApp,
  scrollPane,
  searchBox,
  SONG_CARD,
  SONG_COUNT,
  songCount,
} from "./helpers";

test.describe("Tìm kiếm và lọc", () => {
  test("gõ không dấu vẫn ra đúng bài như gõ có dấu", async ({ page }) => {
    await openApp(page);
    const box = searchBox(page);

    await box.fill("Hương");
    await expect(page.locator(SONG_CARD).first()).toBeVisible();
    const coDau = await songCount(page);

    await box.fill("huong");
    await expect(page.locator(SONG_CARD).first()).toBeVisible();
    const khongDau = await songCount(page);

    expect(khongDau).toBe(coDau);
    expect(khongDau).toBeGreaterThan(0);
    expect(khongDau).toBeLessThan(SONG_COUNT);
  });

  test("chữ đ và chữ d tìm ra như nhau", async ({ page }) => {
    await openApp(page);
    const box = searchBox(page);

    await box.fill("đèn");
    await expect(page.locator(SONG_CARD).first()).toBeVisible();
    const a = await songCount(page);

    await box.fill("den");
    await expect(page.locator(SONG_CARD).first()).toBeVisible();
    expect(await songCount(page)).toBe(a);
  });

  test("tìm được cả theo lời hát, không chỉ theo tên bài", async ({ page }) => {
    await openApp(page);
    const box = searchBox(page);

    // Từ này không nằm trong tên bài nào, chỉ có trong lời.
    await box.fill("lampe");
    await expect(page.locator(SONG_CARD).first()).toBeVisible();
    expect(await songCount(page)).toBeGreaterThan(0);
  });

  test("không có bài nào khớp thì báo rõ và bấm một nút là xem lại tất cả", async ({
    page,
  }) => {
    await openApp(page);

    await searchBox(page).fill("xyzzy khong co bai nao");
    await expect(page.getByText("Không có bài nào khớp")).toBeVisible();
    expect(await songCount(page)).toBe(0);

    await page.getByRole("button", { name: "Xem lại tất cả" }).click();
    expect(await songCount(page)).toBe(SONG_COUNT);
    await expect(searchBox(page)).toHaveValue("");
  });

  test("nút xoá từ khoá trả lại đủ danh sách", async ({ page }) => {
    await openApp(page);

    await searchBox(page).fill("den");
    await expect(page.getByRole("button", { name: "Xoá từ khoá" })).toBeVisible();

    await page.getByRole("button", { name: "Xoá từ khoá" }).click();
    await expect(searchBox(page)).toHaveValue("");
    expect(await songCount(page)).toBe(SONG_COUNT);
  });

  test("lọc theo ngôn ngữ chỉ giữ lại bài đúng thứ tiếng", async ({ page }) => {
    await openApp(page);

    await page.getByRole("button", { name: "Tiếng Pháp", exact: true }).click();
    const phap = await songCount(page);
    expect(phap).toBeGreaterThan(0);
    expect(phap).toBeLessThan(SONG_COUNT);
    for (const text of await page.locator(SONG_CARD).allInnerTexts()) {
      expect(text).toContain("Pháp");
    }

    await page.getByRole("button", { name: "Tiếng Anh", exact: true }).click();
    for (const text of await page.locator(SONG_CARD).allInnerTexts()) {
      expect(text).toContain("Anh");
    }

    await page.getByRole("button", { name: "Tất cả", exact: true }).click();
    expect(await songCount(page)).toBe(SONG_COUNT);
  });

  test("ô tìm kiếm luôn nằm trong tầm mắt khi cuộn", async ({ page }) => {
    await openApp(page);

    await scrollPane(page, 2500);

    const box = searchBox(page);
    await expect(box).toBeInViewport();

    // Và không bị thanh đầu trang đè lên.
    const header = page.locator("header").first();
    const [b, h] = await Promise.all([box.boundingBox(), header.boundingBox()]);
    expect(b, "ô tìm kiếm phải đo được vị trí").not.toBeNull();
    expect(h, "thanh đầu trang phải đo được vị trí").not.toBeNull();
    expect(b!.y).toBeGreaterThanOrEqual(h!.y + h!.height - 1);
  });
});
