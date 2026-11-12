import { expect, test } from "@playwright/test";
import { SONG_ROW } from "./helpers";

const PORT = Number(process.env.PORT ?? 4173);
/** Địa chỉ gốc của trang web: chuyển thẳng vào app, mở màn hình «Giới thiệu». */
const ROOT = `http://127.0.0.1:${PORT + 1}/`;

/** Giao diện mặc định: không lưu sẵn ngôn ngữ nào (chỉ đánh dấu đã xem Giới thiệu). */
test.use({
  storageState: {
    cookies: [],
    origins: [`http://127.0.0.1:${PORT}`, `http://127.0.0.1:${PORT + 1}`].map((origin) => ({
      origin,
      localStorage: [{ name: "chansonia-about-seen", value: "1" }],
    })),
  },
});

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

  test("vào từ địa chỉ gốc là màn hình Giới thiệu bằng tiếng Anh", async ({ page }) => {
    await page.goto(ROOT);
    await expect(page).toHaveURL(/\/app\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("[data-about] h1")).toContainText("Songs that tell stories");
  });

  test("lựa chọn tiếng Việt lưu từ bản cũ không còn giữ app ở tiếng Việt", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("chansonia-lang", "vi");
      localStorage.setItem("chansonia-site-lang", "vi");
    });
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("màn hình Giới thiệu không có dấu gạch dài ở cả ba thứ tiếng", async ({ page }) => {
    for (const lang of ["en", "vi", "fr"]) {
      await page.addInitScript((l) => localStorage.setItem("chansonia-ui-lang", l), lang);
      await page.goto("/?gioi-thieu");
      await expect(page.locator("html")).toHaveAttribute("lang", lang);
      const text = await page.locator("[data-about]").innerText();
      expect(text.includes("—"), lang).toBe(false);
    }
  });
});

test.describe("Lần đầu mở app", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("là màn hình Giới thiệu bằng tiếng Anh, lần sau vào thẳng thư viện", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("[data-about]")).toBeVisible();
    await page.getByRole("button", { name: "Listen now" }).click();
    await expect(page.getByRole("tab", { name: /^Songs · / })).toBeVisible();
    await page.reload();
    await expect(page.getByRole("tab", { name: /^Songs · / })).toBeVisible();
    await expect(page.locator("[data-about]")).toHaveCount(0);
  });
});
