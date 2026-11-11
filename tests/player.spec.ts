import { expect, test } from "@playwright/test";
import {
  activeLyricIndex,
  elapsedSeconds,
  nowPlayingTitle,
  openApp,
  openFirstSong,
  scrubber,
  SONG_ROW,
  songTitleInHeader,
  waitForLyrics,
  waitForPlayback,
} from "./helpers";

test.describe("Nghe nhạc", () => {
  test("bấm vào một bài là mở màn hình lời và phát luôn", async ({ page }) => {
    await openApp(page);
    await openFirstSong(page);

    expect(await songTitleInHeader(page)).toBe("Je voudrais te parler");
    await expect(page.getByRole("tab", { name: "Lời", exact: true })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  test("hết đoạn dạo nhạc thì đúng một dòng sáng lên, chữ đã hát được tô màu", async ({
    page,
  }) => {
    await openApp(page);
    await openFirstSong(page);
    await waitForLyrics(page);

    const active = page.locator('.lyric-line[data-state="active"]');
    await expect(active).toBeVisible();
    await expect(active.locator("[data-sung]").first()).toBeVisible();

    // Dòng đang hát to hơn hẳn các dòng khác.
    const size = (sel: string) =>
      page.locator(sel).first().evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    await expect
      .poll(() => size('.lyric-line[data-state="active"]'))
      .toBeGreaterThan(await size('.lyric-line[data-state="upcoming"]'));
  });

  test("bấm vào một dòng lời là nhảy tới đúng chỗ đó và dòng ấy vào giữa khung", async ({
    page,
  }) => {
    await openApp(page);
    await openFirstSong(page);
    await waitForLyrics(page);

    // Tạm dừng trước, để dòng đang hát không tự đổi trong lúc đang kiểm.
    await page.getByRole("button", { name: "Tạm dừng" }).click();

    // Chọn một dòng gần cuối bài, để khung lời buộc phải cuộn xuống.
    const dich = (await page.locator(".lyric-line").count()) - 2;
    await page.locator(`.lyric-line[data-line="${dich}"]`).click();
    await expect.poll(() => activeLyricIndex(page), { timeout: 15_000 }).toBe(dich);
    await page.getByRole("button", { name: "Tạm dừng" }).click();

    await expect(page.locator('.lyric-line[data-state="active"]')).toBeInViewport();
    await expect
      .poll(() => page.locator(".lyric-stage").evaluate((e) => e.scrollTop))
      .toBeGreaterThan(0);
  });

  test("dòng lời đang hát tự chuyển xuống dòng sau", async ({ page }) => {
    await openApp(page);
    await openFirstSong(page);
    await waitForLyrics(page);

    const dau = await activeLyricIndex(page);
    await expect.poll(() => activeLyricIndex(page), { timeout: 40_000 }).toBeGreaterThan(dau);
  });

  test("chế độ Trang lời in cả bài đều nhau, không tô dòng nào", async ({ page }) => {
    await openApp(page);
    await openFirstSong(page);

    await page.getByRole("tab", { name: "Trang lời" }).click();
    await expect(page.locator('.lyric-line[data-state="active"]')).toHaveCount(0);
    const all = await page.locator(".lyric-line").count();
    await expect(page.locator('.lyric-line[data-state="sheet"]')).toHaveCount(all);
  });

  test("tạm dừng thì đồng hồ đứng lại, phát tiếp thì chạy tiếp", async ({ page }) => {
    await openApp(page);
    await openFirstSong(page);

    await page.getByRole("button", { name: "Tạm dừng" }).click();
    const dung = await elapsedSeconds(page);
    await page.waitForTimeout(2500);
    expect(Math.abs((await elapsedSeconds(page)) - dung)).toBeLessThanOrEqual(1);

    await page.getByRole("button", { name: "Phát", exact: true }).click();
    await expect.poll(() => elapsedSeconds(page), { timeout: 20_000 }).toBeGreaterThan(dung);
  });

  test("nút bài sau chuyển sang bài kế tiếp trong bộ sưu tập", async ({ page }) => {
    await openApp(page);
    await openFirstSong(page);

    await page.getByRole("button", { name: "Bài sau" }).click();
    await expect.poll(() => songTitleInHeader(page), { timeout: 15_000 }).toBe(
      "La lampe brûle encore",
    );
    // Vẫn ở màn hình lời, không bị văng về danh sách.
    await expect(page.getByRole("button", { name: "Quay lại" })).toBeVisible();
  });

  test("bài trước: mới phát thì lùi bài, nghe quá 3 giây thì về đầu bài", async ({ page }) => {
    await openApp(page);
    await page.locator(SONG_ROW).nth(1).click();
    await waitForPlayback(page);

    await scrubber(page).focus();
    await scrubber(page).press("ArrowRight");
    await scrubber(page).press("ArrowRight");
    await expect.poll(() => elapsedSeconds(page)).toBeGreaterThan(5);

    await page.getByRole("button", { name: "Bài trước" }).click();
    await expect.poll(() => elapsedSeconds(page)).toBeLessThanOrEqual(2);
    expect(await nowPlayingTitle(page)).toBe("La lampe brûle encore");

    await page.getByRole("button", { name: "Bài trước" }).click();
    await expect.poll(() => nowPlayingTitle(page)).toBe("Je voudrais te parler");
  });

  test("quay lại danh sách vẫn giữ nguyên bài đang nghe", async ({ page }) => {
    await openApp(page);
    await openFirstSong(page);

    await page.getByRole("button", { name: "Quay lại" }).click();
    await expect(page.locator(SONG_ROW).first()).toBeVisible();

    await expect(page.getByRole("button", { name: "Tạm dừng" })).toBeVisible();
    const current = page.locator(`${SONG_ROW}[aria-current="true"]`);
    await expect(current).toHaveCount(1);
    await expect(current).toContainText("Đang phát");
  });

  test("bài chưa có lời thì báo rõ, vẫn hiện thanh phát", async ({ page }) => {
    await openApp(page);
    // Chỉ cần mở màn hình, không cần mạng để tải nhạc trực tuyến.
    await page.evaluate(() => {
      HTMLMediaElement.prototype.play = () => Promise.resolve();
    });
    await page.locator('[data-song-id="nha-van-sang-den"]').click();
    await expect(page.getByText("Lời bài này chưa có trong ứng dụng.", { exact: false })).toBeVisible();
    await expect(scrubber(page)).toBeVisible();
  });

  test("bài có hai phiên bản thì chuyển qua lại được", async ({ page }) => {
    await openApp(page);
    await expect(page.locator('[data-song-id="a-fathers-song"]')).toContainText("2 phiên bản");
    await page.locator('[data-song-id="a-fathers-song"]').click();
    await waitForPlayback(page);

    const phienBan = page.getByRole("group", { name: "Phiên bản" });
    await expect(phienBan.getByRole("button", { name: /English/ })).toHaveAttribute("aria-pressed", "true");

    // Bản tiếng Việt phát trực tuyến; ở đây chỉ kiểm giao diện, không cần mạng.
    await page.evaluate(() => {
      HTMLMediaElement.prototype.play = () => Promise.resolve();
    });
    await phienBan.getByRole("button", { name: /Tiếng Việt/ }).click();
    await expect(phienBan.getByRole("button", { name: /Tiếng Việt/ })).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("header")).toContainText("Tiếng Việt");
    // Bản này chưa có lời: báo rõ, không in nhầm lời của bản kia.
    await expect(page.locator("[data-unsynced]")).toBeVisible();
    await expect(page.locator(".lyric-line")).toHaveCount(0);

    await phienBan.getByRole("button", { name: /English/ }).click();
    await expect(page.locator("[data-unsynced]")).toHaveCount(0);
    await expect(page.locator(".lyric-line").first()).toBeVisible();
  });

  test("mở lại app thì nghe tiếp đúng bài, đúng chỗ", async ({ page }) => {
    await openApp(page);
    await page.locator(SONG_ROW).nth(2).click();
    await waitForPlayback(page);

    await scrubber(page).focus();
    for (let i = 0; i < 8; i += 1) await scrubber(page).press("ArrowRight");
    await page.getByRole("button", { name: "Tạm dừng" }).click();
    const truoc = await elapsedSeconds(page);
    expect(truoc).toBeGreaterThanOrEqual(35);

    await page.reload();
    await expect(page.locator("[data-now-title]")).toHaveText("The Lamp Still Burns");
    expect(Math.abs((await elapsedSeconds(page)) - truoc)).toBeLessThanOrEqual(2);
  });
});
