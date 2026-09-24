import { defineConfig, devices } from "@playwright/test";

/**
 * Bộ kiểm thử tự động — mở ứng dụng bằng trình duyệt thật rồi bấm, gõ, kéo
 * đúng như người dùng, để mỗi lần sửa mã đều biết ngay có làm hỏng gì không.
 *
 *     npm test              chạy toàn bộ
 *     npm run test:ui       chạy có giao diện, xem lại từng bước
 *     npm run test:report   mở bản báo cáo lần chạy gần nhất
 *
 * Máy chủ thử nghiệm là bản dựng thật (`vite preview`) chứ không phải bản
 * đang phát triển: service worker chỉ bật ở bản dựng, mà phần "cài lên máy"
 * và "mất mạng vẫn mở được" thì phải có nó mới thử được.
 */

/* Địa chỉ ghi rõ 127.0.0.1 ở cả hai đầu: máy chủ thử nghiệm gắn vào đúng địa
   chỉ này (xem script test:serve), Playwright cũng gõ cửa đúng địa chỉ này.
   Để "localhost" thì có máy phân giải ra IPv6 ::1, có máy ra IPv4 — hai bên
   trỏ hai nơi khác nhau và Playwright chờ mãi không thấy máy chủ đâu. */
const PORT = Number(process.env.PORT ?? 4173);
const BASE_URL = `http://127.0.0.1:${PORT}`;

/* Máy nào đã có sẵn trình duyệt Chromium ở chỗ khác thì chỉ đường bằng
   biến môi trường CHROMIUM_PATH, khỏi phải tải về lần nữa. */
const executablePath = process.env.CHROMIUM_PATH || undefined;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"], ["html", { open: "never" }]],
  timeout: 45_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: process.env.CI ? "retain-on-failure" : "off",
    launchOptions: {
      executablePath,
      // Cho phép nhạc tự phát: máy chạy kiểm thử không có ai bấm nút thật.
      args: ["--autoplay-policy=no-user-gesture-required"],
    },
  },

  /* Chạy hai lần: khổ điện thoại và khổ máy tính — bố cục khác nhau hẳn,
     lưới bài hát một cột hay hai cột, tên bài ẩn hay hiện. */
  projects: [
    {
      name: "điện thoại",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 420, height: 880 },
        hasTouch: true,
      },
    },
    {
      name: "máy tính",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } },
    },
  ],

  webServer: {
    command: "npm run test:serve",
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
