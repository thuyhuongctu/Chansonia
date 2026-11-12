import { expect, test } from "@playwright/test";
import { SONG_ROW } from "./helpers";

/** Giao diện mặc định: không có lựa chọn ngôn ngữ nào được lưu sẵn. */
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Ngôn ngữ giao diện", () => {
  test("mở app lần đầu là tiếng Anh", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("tab", { name: /^Songs · / })).toBeVisible();
    await expect(page.getByPlaceholder("Search titles…")).toBeVisible();
    await expect(page.getByRole("button", { name: "Play", exact: true })).toBeVisible();
    // Dữ liệu bài hát cũng sang tiếng Anh.
    await expect(page.locator(SONG_ROW).first()).toContainText("French");
  });

  test("bấm nút ngôn ngữ để đổi EN → VI → FR, và app nhớ lựa chọn", async ({ page }) => {
    await page.goto("/");
    const nut = page.locator("button[data-lang]");
    await expect(nut).toHaveText("EN");

    await nut.click();
    await expect(page.locator("html")).toHaveAttribute("lang", "vi");
    await expect(page.getByRole("tab", { name: /^Bài hát · / })).toBeVisible();

    await nut.click();
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    await expect(page.getByRole("tab", { name: /^Chansons · / })).toBeVisible();

    await page.reload();
    await expect(page.locator("button[data-lang]")).toHaveText("FR");
  });

  test("tìm bằng tiếng Anh vẫn ra bài", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Search the collection").fill("french");
    await expect(page.locator(`[data-library-list] > [data-row] > ${SONG_ROW}`).first()).toBeVisible();
  });

  test("màn hình nghe bằng tiếng Anh: tên phần và nút", async ({ page }) => {
    await page.goto("/");
    await page.locator('[data-song-id="the-lamp-still-burns"]').click();
    await expect(page.getByRole("tab", { name: "Lyrics", exact: true })).toBeVisible();
    await expect(page.locator(".lyric-stage")).toContainText("VERSE 1", { ignoreCase: true });
    await expect(page.getByRole("button", { name: "Add to favourites" })).toBeVisible();
  });

  test("trang giới thiệu cũng mặc định tiếng Anh", async ({ page }) => {
    await page.goto(`http://127.0.0.1:${Number(process.env.PORT ?? 4173) + 1}/`);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("h1")).toContainText("Songs that tell stories");
  });
});
