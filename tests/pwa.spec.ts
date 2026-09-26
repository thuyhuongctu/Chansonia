import { expect, test } from "@playwright/test";
import { openApp, playSong, scrollPane, SONG_CARD, SONG_COUNT } from "./helpers";

/** Chờ service worker cài xong và bắt đầu trông coi trang. */
async function serviceWorkerSan(page: import("@playwright/test").Page) {
  await page.evaluate(async () => {
    const reg = await navigator.serviceWorker.ready;
    if (!reg.active) await new Promise((r) => setTimeout(r, 500));
  });
}

test.describe("Cài lên máy như một app", () => {
  test("có tờ khai manifest đầy đủ để trình duyệt mời cài", async ({ page }) => {
    await openApp(page);

    const link = page.locator('link[rel="manifest"]');
    await expect(link).toHaveCount(1);

    const manifest = await page.evaluate(async () => {
      const href =
        document.querySelector<HTMLLinkElement>('link[rel="manifest"]')?.href ?? "";
      const res = await fetch(href);
      return { ok: res.ok, json: await res.json() };
    });

    expect(manifest.ok).toBe(true);
    expect(manifest.json.short_name).toBe("Chansonia");
    expect(manifest.json.display).toBe("standalone");
    expect(manifest.json.start_url).toBeTruthy();

    const sizes = manifest.json.icons.map((i: { sizes: string }) => i.sizes);
    expect(sizes).toContain("192x192");
    expect(sizes).toContain("512x512");
    expect(
      manifest.json.icons.some((i: { purpose?: string }) => i.purpose === "maskable"),
      "phải có ít nhất một biểu tượng dạng maskable cho màn hình chính Android",
    ).toBe(true);
  });

  test("biểu tượng trong manifest tải về được thật", async ({ page, request }) => {
    await openApp(page);
    const icons: string[] = await page.evaluate(async () => {
      const href =
        document.querySelector<HTMLLinkElement>('link[rel="manifest"]')?.href ?? "";
      const j = await (await fetch(href)).json();
      return j.icons.map((i: { src: string }) => new URL(i.src, href).href);
    });

    for (const url of icons) {
      const res = await request.get(url);
      expect(res.status(), `không tải được biểu tượng ${url}`).toBe(200);
      expect(res.headers()["content-type"]).toContain("image");
    }
  });

  test("service worker được đăng ký và lưu sẵn bộ khung", async ({ page }) => {
    await openApp(page);
    await serviceWorkerSan(page);

    const sw = await page.evaluate(async () => {
      const regs = await navigator.serviceWorker.getRegistrations();
      return { so: regs.length, pham_vi: regs[0]?.scope ?? null, song: !!regs[0]?.active };
    });
    expect(sw.so).toBeGreaterThan(0);
    expect(sw.song).toBe(true);

    const kho = await page.evaluate(() => caches.keys());
    expect(kho.some((n) => n.startsWith("chansonia-"))).toBe(true);
  });

  test("không bao giờ lưu tệp nhạc vào kho — để tua nhạc không hỏng", async ({ page }) => {
    await openApp(page);
    await serviceWorkerSan(page);

    // Nghe thử một chút cho trình duyệt tải nhạc về.
    await page.locator("[data-song-id]").first().click();
    await playSong(page);
    await page.waitForTimeout(2000);

    const daLuu: string[] = await page.evaluate(async () => {
      const ten = (await caches.keys()).filter((n) => n.startsWith("chansonia-"));
      const out: string[] = [];
      for (const n of ten) {
        const c = await caches.open(n);
        for (const req of await c.keys()) out.push(req.url);
      }
      return out;
    });

    expect(daLuu.filter((u) => /\.(mp3|m4a|aac|ogg|opus|wav|flac)(\?|$)/i.test(u))).toEqual(
      [],
    );
  });

  test("mất mạng vẫn mở được ứng dụng", async ({ page, context }) => {
    await openApp(page);
    await serviceWorkerSan(page);

    // Cuộn qua danh sách để service worker kịp lưu ảnh và tệp tĩnh.
    await scrollPane(page, 4000);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(800);

    await context.setOffline(true);
    try {
      await page.reload({ waitUntil: "domcontentloaded" });

      await expect(page.getByRole("heading", { level: 1 })).toContainText(
        "La lampe, le fleuve et les couleurs",
      );
      await expect(page.locator(SONG_CARD)).toHaveCount(SONG_COUNT);
      await expect(page.getByRole("slider", { name: "Tiến độ bài hát" })).toBeVisible();
    } finally {
      await context.setOffline(false);
    }
  });
});
