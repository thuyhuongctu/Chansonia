/*
 * Ghép bản web hoàn chỉnh để đưa lên GitHub Pages:
 *
 *   dist-site/         trang giới thiệu (dựng từ site/)
 *   dist-site/app/     app nghe nhạc (dựng từ src/, tức thư mục dist/)
 *
 * Chạy sau `vite build` và `vite build -c vite.site.config.ts`
 * (gói sẵn trong `npm run build:site`).
 */
import { cpSync, existsSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const app = join(ROOT, "dist");
const site = join(ROOT, "dist-site");

for (const dir of [app, site]) {
  if (!existsSync(join(dir, "index.html"))) {
    console.error(`Thiếu ${dir}/index.html — hãy dựng app và trang giới thiệu trước.`);
    process.exit(1);
  }
}

rmSync(join(site, "app"), { recursive: true, force: true });
cpSync(app, join(site, "app"), { recursive: true });
// Trang chính sách quyền riêng tư của bản Google Play cũng có ở địa chỉ gốc (dist-site/chinh-sach.html).
cpSync(join(app, "chinh-sach.html"), join(site, "chinh-sach.html"));
console.log("Đã ghép: dist-site/ (giới thiệu) + dist-site/app/ (app nghe nhạc)");
