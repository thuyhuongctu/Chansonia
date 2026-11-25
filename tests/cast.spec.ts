import { expect, test } from "@playwright/test";
import { openApp } from "./helpers";

test.describe("Phát trên loa hoặc TV", () => {
  test("không có thiết bị thì không hiện nút", async ({ page }) => {
    await openApp(page);
    await expect(page.getByRole("button", { name: "Phát trên loa hoặc TV" })).toHaveCount(0);
  });

  test("có thiết bị thì hiện nút, bấm là mở bảng chọn thiết bị", async ({ page }) => {
    await page.addInitScript(() => {
      const w = window as unknown as { __prompted: number };
      w.__prompted = 0;
      Object.defineProperty(HTMLMediaElement.prototype, "remote", {
        configurable: true,
        get() {
          return {
            watchAvailability: async (cb: (v: boolean) => void) => {
              cb(true);
              return 1;
            },
            prompt: async () => {
              w.__prompted++;
            },
          };
        },
      });
    });
    await openApp(page);
    await page.getByRole("button", { name: "Phát trên loa hoặc TV" }).click();
    await expect.poll(() => page.evaluate(() => (window as unknown as { __prompted: number }).__prompted)).toBe(1);
  });
});
