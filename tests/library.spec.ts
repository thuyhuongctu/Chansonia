import { expect, test } from "@playwright/test";
import {
  collectionTab,
  COUNTS,
  openApp,
  scrollPane,
  SONG_COUNT,
  SONG_ROW,
  songCount,
  VIDEO_ROW,
} from "./helpers";

test.describe("Thư viện", () => {
  test("mở lên là thấy ba bộ sưu tập và danh sách bài của Hương", async ({ page }) => {
    const errors = await openApp(page);

    for (const name of ["La maison de Madam Hương", "BizOnland", "M-AIDA", "Vietnamese History Game Portal"] as const) {
      await expect(collectionTab(page, name)).toBeVisible();
    }
    await expect(collectionTab(page, "La maison de Madam Hương")).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tab", { name: `Bài hát · ${SONG_COUNT}` })).toBeVisible();
    expect(await songCount(page)).toBe(SONG_COUNT);
    await expect(page.locator(SONG_ROW).first()).toContainText("Je voudrais te parler");
    // Mã DOI của Zenodo có ngay ở trang chính.
    await expect(page.locator("[data-doi]")).toHaveAttribute(
      "href",
      "https://doi.org/10.5281/zenodo.22172794",
    );

    expect(errors).toEqual([]);
  });

  test("có đồng hồ giờ Việt Nam và giờ Pháp, kèm ngày", async ({ page }) => {
    await page.clock.setFixedTime(new Date("2026-11-11T22:30:00Z"));
    await openApp(page);
    // Mùa đông: Việt Nam UTC+7, Pháp UTC+1.
    await expect(page.locator('[data-clock="vn"]')).toContainText("05:30:00");
    await expect(page.locator('[data-clock="vn"]')).toContainText("12/11");
    await expect(page.locator('[data-clock="fr"]')).toContainText("23:30:00");
    await expect(page.locator('[data-clock="fr"]')).toContainText("11/11");
    await expect(page.locator('[data-clock="vn"]').getByRole("img", { name: "Cờ Việt Nam" })).toBeVisible();
    await expect(page.locator('[data-clock="fr"]').getByRole("img", { name: "Cờ Pháp" })).toBeVisible();
  });

  test("bản đồ Việt Nam chìm dưới nền, không chặn tay bấm", async ({ page }) => {
    await openApp(page);
    const map = page.locator(".map-backdrop");
    await expect(map).toHaveAttribute("aria-hidden", "true");
    await expect(map.locator("svg")).toContainText("Hoàng Sa");
    await expect(map.locator("svg")).toContainText("Trường Sa");
    expect(await map.evaluate((el) => getComputedStyle(el).pointerEvents)).toBe("none");
  });

  test("màn hình chào hiện lúc mở app rồi tự tắt", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("[data-splash]")).toHaveCount(1);
    await expect(page.locator("[data-splash]")).toHaveCount(0, { timeout: 6000 });
  });

  test("ảnh bìa trong danh sách tải về được, không có ảnh hỏng", async ({ page }) => {
    await openApp(page);
    await scrollPane(page, 4000);
    await page.waitForLoadState("networkidle");

    const covers = page.locator(`${SONG_ROW} img`);
    const total = await covers.count();
    expect(total).toBeGreaterThanOrEqual(7);
    for (let i = 0; i < total; i += 1) {
      const img = covers.nth(i);
      await img.scrollIntoViewIfNeeded();
      await expect
        .poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0), {
          message: `ảnh hỏng: ${await img.getAttribute("src")}`,
        })
        .toBe(true);
    }
  });

  test("đổi bộ sưu tập thì đổi cả danh sách bài và số đếm", async ({ page }) => {
    await openApp(page);

    await collectionTab(page, "BizOnland").click();
    await expect(collectionTab(page, "BizOnland")).toHaveAttribute("aria-selected", "true");
    await expect(page.locator(SONG_ROW)).toHaveCount(COUNTS.bizon.songs);
    await expect(page.getByRole("tab", { name: `Video · ${COUNTS.bizon.videos}` })).toBeVisible();

    await collectionTab(page, "M-AIDA").click();
    await expect(page.locator(SONG_ROW)).toHaveCount(COUNTS.maida.songs);
    // Bộ chưa có video thì nói rõ, không để trống trơn.
    await page.getByRole("tab", { name: "Video · 0" }).click();
    await expect(page.getByText("Chưa có video.")).toBeVisible();
    await page.getByRole("tab", { name: /^Bài hát ·/ }).click();

    await collectionTab(page, "La maison de Madam Hương").click();
    await expect(page.locator(SONG_ROW)).toHaveCount(COUNTS.huong.songs);
  });

  test("tab Video liệt kê video, mở một video rồi quay lại", async ({ page }) => {
    await openApp(page);
    await collectionTab(page, "BizOnland").click();
    await page.getByRole("tab", { name: /^Video ·/ }).click();
    await expect(page.locator(VIDEO_ROW)).toHaveCount(COUNTS.bizon.videos);

    const title = (await page.locator(`${VIDEO_ROW} span.font-bold`).first().textContent())!;
    await page.locator(VIDEO_ROW).first().click();

    await expect(page.locator("[data-screen-title]")).toHaveText(title);
    await expect(page.getByText("Video khác")).toBeVisible();
    await expect(page.locator(VIDEO_ROW)).toHaveCount(COUNTS.bizon.videos - 1);

    await page.getByRole("button", { name: "Quay lại" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Chansonia" })).toBeVisible();
  });

  test("mở video thì nhạc đang phát tạm dừng", async ({ page }) => {
    await openApp(page);
    await page.getByRole("button", { name: "Phát", exact: true }).click();
    await expect(page.getByRole("button", { name: "Tạm dừng" })).toBeVisible();

    await page.getByRole("tab", { name: /^Video ·/ }).click();
    await page.locator(VIDEO_ROW).first().click();
    await expect(page.getByRole("button", { name: "Phát", exact: true })).toBeVisible();
  });

  test("trang nghệ sĩ có số liệu, DOI và liên kết", async ({ page }) => {
    await openApp(page);

    await page.getByRole("button", { name: "Nghệ sĩ" }).click();
    await expect(page.getByRole("heading", { name: "Je m'appelle Hương" })).toBeVisible();

    const total = COUNTS.huong.songs + COUNTS.bizon.songs + COUNTS.maida.songs + COUNTS.suviet.songs;
    await expect(page.locator("dl")).toContainText(String(total));
    await expect(page.getByRole("link", { name: /10\.5281\/zenodo\.22172794/ })).toHaveAttribute(
      "href",
      "https://doi.org/10.5281/zenodo.22172794",
    );
    await expect(page.getByRole("link", { name: /GitHub/ })).toHaveAttribute(
      "href",
      "https://github.com/thuyhuongctu/Chansonia",
    );

    await page.getByRole("button", { name: "Quay lại" }).click();
    await expect(page.locator(SONG_ROW).first()).toBeVisible();
  });

  test("mục Ảnh ở trang nghệ sĩ mở ảnh lớn, chuyển ảnh và đóng được", async ({ page }) => {
    await openApp(page);
    await page.getByRole("button", { name: "Nghệ sĩ" }).click();

    const thumbs = page.locator("[data-photos] button");
    await expect(thumbs).toHaveCount(5);
    for (const img of await page.locator("[data-photos] img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
    }

    await thumbs.first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toContainText("1 / 5");
    await page.getByRole("button", { name: "Ảnh sau" }).click();
    await expect(dialog).toContainText("2 / 5");
    await page.keyboard.press("ArrowLeft");
    await expect(dialog).toContainText("1 / 5");
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
  });

  test("đổi được giữa nền sáng và nền tối", async ({ page }) => {
    await openApp(page);

    const paper = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    const sang = await paper();

    await page.getByRole("button", { name: /Chuyển sang nền tối/ }).click();
    await expect.poll(paper, { message: "nền phải đổi màu khi bật nền tối" }).not.toBe(sang);

    await page.getByRole("button", { name: /Chuyển sang nền sáng/ }).click();
    await expect.poll(paper).toBe(sang);
  });

  test("bộ sưu tập Vân Đồn 3D có bài hát của game, lời chạy theo từng phần", async ({ page }) => {
    await openApp(page);
    // Nhạc phát trực tuyến; ở đây chỉ kiểm giao diện, không cần mạng.
    await page.evaluate(() => {
      HTMLMediaElement.prototype.play = () => Promise.resolve();
    });
    await collectionTab(page, "Vietnamese History Game Portal").click();
    await expect(page.locator(SONG_ROW)).toHaveCount(COUNTS.suviet.songs);
    // Mỗi game một album, một album cho bài chung của hai game, một cho bài của cổng game
    await expect(page.locator("[data-album]")).toHaveText([
      /Van Don – Vietnam’s First Trading Port/,
      /Bac Hai Dao – Pirates of the Gulf of Tonkin/,
      /Van Don & Bac Hai Dao – A Shared Song/,
      /Vietnamese History Game Portal – Portal Song/,
    ]);
    await page.locator('[data-song-id="van-don-tieng-vong-non-song"]').click();

    await expect(page.locator("[data-screen-title]")).toHaveText("Vân Đồn – Tiếng vọng non sông");
    const stage = page.locator(".lyric-stage");
    await expect(stage).toContainText("Bình minh lên trên muôn trùng sóng");
    await expect(stage).toContainText("Tiền điệp khúc", { ignoreCase: true });
    await expect(stage).toContainText("Vọng tiếng non sông");
  });

  test("bộ sưu tập game: bài Bắc Hải Đảo (mp3) và lyric video Vân Đồn trên YouTube", async ({ page }) => {
    await openApp(page);
    await page.evaluate(() => {
      HTMLMediaElement.prototype.play = () => Promise.resolve();
    });
    await collectionTab(page, "Vietnamese History Game Portal").click();
    await page.getByRole("tab", { name: `Video · ${COUNTS.suviet.videos}` }).click();
    await expect(page.locator('[data-video-id="van-don-lyric-video"]')).toContainText("Vân Đồn – Tiếng vọng non sông");
    await page.getByRole("tab", { name: /^Bài hát ·/ }).click();
    await page.locator('[data-song-id="bac-hai-dao-theo-canh-buom-que-huong"]').click();

    await expect(page.locator("[data-screen-title]")).toHaveText("Bắc Hải Đảo – Theo cánh buồm quê hương");
    const stage = page.locator(".lyric-stage");
    await expect(stage).toContainText("Gió đưa buồm qua cửa biển xa");
    await expect(stage).toContainText("Bắc Hải Đảo, căng buồm đón gió");
    await expect(stage).toContainText("Lại theo người về giữa bình yên");
  });

  test("bài «Trong tôi có một nước Nam» của cổng game có lời chạy theo nhạc, kể cả đoạn tiếng Pháp", async ({ page }) => {
    await openApp(page);
    await page.evaluate(() => {
      HTMLMediaElement.prototype.play = () => Promise.resolve();
    });
    await collectionTab(page, "Vietnamese History Game Portal").click();
    await expect(page.locator("[data-album]").last()).toContainText("Portal Song");
    await page.locator('[data-song-id="trong-toi-co-mot-nuoc-nam"]').click();
    await expect(page.locator("[data-screen-title]")).toHaveText("Trong tôi có một nước Nam");
    const stage = page.locator(".lyric-stage");
    await expect(stage).toContainText("Tôi sinh ra khi tiếng bom đã lặng");
    await expect(stage).toContainText("Je suis née dans la paix");
    await expect(stage).toContainText("Lời tiếng Pháp", { ignoreCase: true });
  });
});
