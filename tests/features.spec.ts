import { expect, test } from "@playwright/test";
import { openApp, openFirstSong, SONG_ROW, songTitleInHeader } from "./helpers";

test.describe("Chức năng như các app nhạc", () => {
  test("thêm vào Yêu thích, xem lại ở mục ♥, và vẫn còn sau khi mở lại app", async ({ page }) => {
    await openApp(page);
    await expect(page.getByRole("tab", { name: "Yêu thích · 0" })).toBeVisible();

    await openFirstSong(page);
    await page.getByRole("button", { name: "Thêm vào Yêu thích" }).click();
    await expect(page.getByRole("button", { name: "Bỏ khỏi Yêu thích" })).toHaveAttribute("aria-pressed", "true");

    await page.getByRole("button", { name: "Quay lại" }).click();
    await page.getByRole("tab", { name: "Yêu thích · 1" }).click();
    await expect(page.locator(SONG_ROW)).toHaveCount(1);
    await expect(page.locator(SONG_ROW)).toContainText("Je voudrais te parler");

    await page.reload();
    await expect(page.getByRole("tab", { name: "Yêu thích · 1" })).toBeVisible();
  });

  test("nút lặp lại đổi vòng: tắt → cả danh sách → một bài", async ({ page }) => {
    await openApp(page);
    await openFirstSong(page);
    const nut = page.locator("[data-repeat]");
    await expect(nut).toHaveAttribute("data-repeat", "off");
    await nut.click();
    await expect(nut).toHaveAttribute("data-repeat", "all");
    await nut.click();
    await expect(nut).toHaveAttribute("data-repeat", "one");
    await nut.click();
    await expect(nut).toHaveAttribute("data-repeat", "off");
  });

  test("đường link chia sẻ mở thẳng vào đúng bài", async ({ page }) => {
    await page.goto("/?bai=the-lamp-still-burns");
    await expect.poll(() => songTitleInHeader(page)).toBe("The Lamp Still Burns");
    // Mở xong thì bỏ ?bai=… khỏi thanh địa chỉ.
    await expect(page).not.toHaveURL(/bai=/);
  });

  test("nút chia sẻ chép đường link khi máy không có bảng chia sẻ", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "share", { value: undefined, configurable: true });
    });
    await openApp(page);
    await openFirstSong(page);
    await page.getByRole("button", { name: "Chia sẻ bài này" }).click();
    await expect(page.getByRole("status")).toHaveText("Đã chép đường link của bài");
    const link = await page.evaluate(() => navigator.clipboard.readText());
    expect(link).toMatch(/\?bai=je-voudrais-te-parler$/);
  });

  test("màn hình khoá và tai nghe nhận đúng tên bài", async ({ page }) => {
    await openApp(page);
    await openFirstSong(page);
    const meta = await page.evaluate(() => ({
      title: navigator.mediaSession.metadata?.title,
      artist: navigator.mediaSession.metadata?.artist,
      state: navigator.mediaSession.playbackState,
    }));
    expect(meta.title).toContain("Je voudrais te parler");
    expect(meta.artist).toBe("Je m'appelle Hương");
    expect(meta.state).toBe("playing");
  });

  test("phím tắt: Space phát/dừng, L yêu thích", async ({ page }) => {
    await openApp(page);
    await page.locator("body").click({ position: { x: 5, y: 5 } });
    await page.keyboard.press("Space");
    await expect(page.getByRole("button", { name: "Tạm dừng" })).toBeVisible();
    await page.locator("body").click({ position: { x: 5, y: 5 } });
    await page.keyboard.press("Space");
    await expect(page.getByRole("button", { name: "Phát", exact: true })).toBeVisible();

    await page.keyboard.press("l");
    await expect(page.getByRole("tab", { name: "Yêu thích · 1" })).toBeVisible();
  });
});

test.describe("Nâng cấp sau khi rà soát", () => {
  test("bài không tải được thì báo rõ, không giả vờ đang phát", async ({ page }) => {
    await page.route(/bizonland\.com\/.*\.mp3/, (r) => r.fulfill({ status: 404, body: "" }));
    await openApp(page);
    await page.getByRole("tab", { name: "BizOnland", exact: true }).click();
    await page.locator(SONG_ROW).first().click();
    await expect(page.locator("[data-audio-error]")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("button", { name: "Phát", exact: true })).toBeVisible();
  });

  test("màn hình chào chỉ hiện lần đầu, tải lại trang thì vào thẳng", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("[data-splash]")).toHaveCount(1);
    await page.reload();
    await expect(page.locator(SONG_ROW).first()).toBeVisible();
    await expect(page.locator("[data-splash]")).toHaveCount(0);
  });

  test("tìm kiếm cho thấy cả bài ở bộ sưu tập khác", async ({ page }) => {
    await openApp(page);
    await page.getByLabel("Tìm trong bộ sưu tập").fill("durian");
    const khac = page.locator("[data-elsewhere]");
    await expect(khac).toContainText("Ở bộ sưu tập khác");
    await expect(khac.locator(SONG_ROW)).toContainText(["Durian Passport"]);
  });

  test("màn hình nghe gợi ý bài tiếp theo, bấm là chuyển", async ({ page }) => {
    await openApp(page);
    await openFirstSong(page);
    const tiep = page.locator("[data-up-next]");
    await expect(tiep).toContainText("La lampe brûle encore");
    await tiep.click();
    await expect.poll(() => songTitleInHeader(page)).toBe("La lampe brûle encore");
  });

  test("hẹn giờ «Dừng khi hết bài này»", async ({ page }) => {
    await openApp(page);
    await page.getByRole("button", { name: "Hẹn giờ tắt nhạc" }).click();
    const nut = page.getByRole("button", { name: "Dừng khi hết bài này" });
    await nut.click();
    await expect(nut).toHaveAttribute("aria-pressed", "true");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Hẹn giờ tắt nhạc" })).toHaveAttribute(
      "data-active",
      "true",
    );
  });
});

test.describe("Âm lượng (máy tính)", () => {
  test("kéo âm lượng và tắt tiếng bằng phím M", async ({ page }, info) => {
    test.skip(info.project.name !== "máy tính", "điện thoại dùng nút âm lượng của máy");
    await openApp(page);
    await page.getByLabel("Âm lượng").fill("0.3");
    expect(await page.evaluate(() => document.querySelector("audio")?.volume ?? 1)).toBeCloseTo(0.3, 1);

    await page.locator("body").click({ position: { x: 5, y: 5 } });
    await page.keyboard.press("m");
    await expect(page.getByRole("button", { name: "Bật tiếng (M)" })).toBeVisible();
    expect(await page.evaluate(() => document.querySelector("audio")?.volume)).toBe(0);
  });
});
