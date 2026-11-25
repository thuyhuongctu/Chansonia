import { expect, test } from "@playwright/test";
import { openApp, openFirstSong } from "./helpers";

test.describe("Giao diện quốc tế: bàn điều khiển lớn ở màn hình nghe", () => {
  test("điện thoại: màn hình nghe có giờ hai đầu, nút phát to, nút ngẫu nhiên; về thư viện thì thu lại", async ({ page }, info) => {
    test.skip(info.project.name === "máy tính", "máy tính giữ thanh phát ba cột");
    await openApp(page);
    const bar = page.locator("[data-player-bar]");
    await expect(bar).not.toHaveAttribute("data-full", /.*/);
    await openFirstSong(page);
    await expect(bar).toHaveAttribute("data-full", "true");
    await expect(page.locator("[data-full-time]")).toBeVisible();
    await expect(bar.getByRole("button", { name: "Phát ngẫu nhiên" })).toBeVisible();
    const big = await bar.getByRole("button", { name: /^(Tạm dừng|Phát)$/ }).boundingBox();
    expect(big!.width).toBeGreaterThanOrEqual(60);
    await page.getByRole("button", { name: "Quay lại" }).click();
    await expect(bar).not.toHaveAttribute("data-full", /.*/);
  });
});
