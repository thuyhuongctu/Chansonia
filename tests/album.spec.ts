import { expect, test } from "@playwright/test";
import { openApp, scrollPane, SONG_CARD, songCount } from "./helpers";

test.describe("Trang album", () => {
  test("mở lên là thấy đủ tên album và danh sách bài", async ({ page }) => {
    const errors = await openApp(page);

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "La lampe, le fleuve et les couleurs",
    );

    // Album có sáu bài; con số này đổi thì bài kiểm thử phải đổi theo.
    expect(await songCount(page)).toBe(6);

    // Mỗi thẻ đều ghi rõ số thứ tự bài.
    const tracks = await page.locator(`${SONG_CARD} p:has-text("Track")`).allInnerTexts();
    expect(tracks.length).toBe(6);
    // Trang in hoa bằng CSS, nên so không phân biệt hoa thường.
    expect(tracks[0].toLowerCase()).toContain("track 01");

    expect(errors).toEqual([]);
  });

  test("ảnh bìa từng bài tải về được, không có ảnh hỏng", async ({ page }) => {
    await openApp(page);

    // Cuộn hết danh sách để ảnh tải nốt (ảnh chỉ tải khi sắp vào tầm nhìn).
    await scrollPane(page, 4000);
    await page.waitForLoadState("networkidle");

    const covers = page.locator(`${SONG_CARD} img`);
    const total = await covers.count();
    expect(total).toBeGreaterThanOrEqual(6);

    for (let i = 0; i < total; i += 1) {
      const img = covers.nth(i);
      const src = await img.getAttribute("src");
      const ok = await img.evaluate(
        (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
      );
      expect(ok, `ảnh hỏng: ${src}`).toBe(true);
    }
  });

  test("chuyển được sang trang nghệ sĩ rồi quay lại album", async ({ page }) => {
    await openApp(page);

    await page.getByRole("tab", { name: "Nghệ sĩ", exact: true }).click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Hương");
    await expect(page.locator(SONG_CARD)).toHaveCount(0);

    await page.getByRole("tab", { name: "Album", exact: true }).click();
    await expect(page.locator(SONG_CARD).first()).toBeVisible();
  });

  test("đổi được giữa nền sáng và nền tối", async ({ page }) => {
    await openApp(page);

    const paper = () =>
      page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    const sang = await paper();

    await page.getByRole("button", { name: /Chuyển sang nền tối/ }).click();
    await expect
      .poll(paper, { message: "nền phải đổi màu khi bật nền tối" })
      .not.toBe(sang);

    await page.getByRole("button", { name: /Chuyển sang nền sáng/ }).click();
    await expect.poll(paper).toBe(sang);
  });
});
