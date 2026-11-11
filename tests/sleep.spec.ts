import { expect, test } from "@playwright/test";
import { openApp } from "./helpers";

test.describe("Hẹn giờ tắt nhạc", () => {
  test("chọn số phút, bắt đầu, rồi huỷ", async ({ page }) => {
    await openApp(page);
    const nut = page.getByRole("button", { name: "Hẹn giờ tắt nhạc" });
    const nho = await nut.boundingBox();

    await nut.click();
    const tam = page.getByRole("dialog", { name: "Hẹn giờ tắt nhạc" });
    await expect(tam).toBeVisible();
    await expect(tam.getByRole("button", { name: "30 phút", exact: true })).toHaveAttribute("aria-pressed", "true");

    await tam.getByRole("button", { name: "15 phút", exact: true }).click();
    await tam.getByRole("button", { name: "Hẹn 15 phút" }).click();
    await expect(tam).toHaveCount(0);

    await expect(nut).toHaveAttribute("data-active", "true");
    // Nút không đổi bề rộng khi đang hẹn giờ.
    expect((await nut.boundingBox())!.width).toBeCloseTo(nho!.width, 0);

    await nut.click();
    await page.getByRole("button", { name: "Huỷ hẹn giờ" }).click();
    await expect(nut).not.toHaveAttribute("data-active", "true");
  });

  test("bấm ra ngoài hoặc phím Esc thì đóng tấm hẹn giờ", async ({ page }) => {
    await openApp(page);
    const nut = page.getByRole("button", { name: "Hẹn giờ tắt nhạc" });

    await nut.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);

    await nut.click();
    await page.mouse.click(20, 20);
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("hết giờ thì nhạc tạm dừng", async ({ page }) => {
    await page.clock.install();
    await openApp(page);
    await page.getByRole("button", { name: "Phát", exact: true }).click();
    await expect(page.getByRole("button", { name: "Tạm dừng" })).toBeVisible();

    await page.getByRole("button", { name: "Hẹn giờ tắt nhạc" }).click();
    await page.getByRole("button", { name: "5 phút", exact: true }).click();
    await page.getByRole("button", { name: "Hẹn 5 phút" }).click();

    await page.clock.fastForward("05:01");
    await expect(page.getByRole("button", { name: "Phát", exact: true })).toBeVisible();
  });
});
