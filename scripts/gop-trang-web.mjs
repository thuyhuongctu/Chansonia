/*
 * Ghép bản web hoàn chỉnh để đưa lên GitHub Pages:
 *
 *   dist-site/app/              app nghe nhạc (dựng từ src/, tức thư mục dist/)
 *   dist-site/index.html        địa chỉ gốc: chuyển thẳng vào app, mở màn hình
 *                               «Giới thiệu» (…/app/?gioi-thieu). Trang giới
 *                               thiệu riêng trước đây nay nằm trong app.
 *   dist-site/chinh-sach.html   chính sách quyền riêng tư (cho Google Play)
 *   dist-site/sw.js             gỡ service worker cũ từng đăng ký ở thư mục gốc
 *
 * Chạy sau `vite build` (gói sẵn trong `npm run build:site`).
 */
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const app = join(ROOT, "dist");
const site = join(ROOT, "dist-site");

if (!existsSync(join(app, "index.html"))) {
  console.error(`Thiếu ${app}/index.html — hãy dựng app trước (vite build).`);
  process.exit(1);
}

rmSync(site, { recursive: true, force: true });
mkdirSync(site, { recursive: true });
cpSync(app, join(site, "app"), { recursive: true });
cpSync(join(app, "chinh-sach.html"), join(site, "chinh-sach.html"));

const DOI = "10.5281/zenodo.22172794";
writeFileSync(
  join(site, "index.html"),
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Chansonia: songs, lyrics and films by Je m'appelle Hương</title>
    <meta name="description" content="Chansonia: listen to Je m'appelle Hương, BizOnland, M-AIDA and history-game songs with word-by-word lyrics, watch the music videos, install it as an app." />
    <meta name="theme-color" content="#17130f" />
    <link rel="icon" type="image/svg+xml" href="./app/favicon.svg" />
    <meta name="citation_title" content="Chansonia" />
    <meta name="citation_author" content="Đỗ, Thùy Hương" />
    <meta name="citation_publication_date" content="2026" />
    <meta name="citation_doi" content="${DOI}" />
    <link rel="cite-as" href="https://doi.org/${DOI}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Chansonia · Je m'appelle Hương" />
    <meta property="og:image" content="./app/art/music-cover-ba-cong-con.webp" />
    <link rel="canonical" href="./app/" />
    <meta http-equiv="refresh" content="0; url=./app/?gioi-thieu" />
    <script>
      // Giữ lại ?bai=… hoặc #… của đường link cũ khi chuyển vào app.
      var q = location.search ? location.search + "&gioi-thieu" : "?gioi-thieu";
      location.replace("./app/" + q + location.hash);
    </script>
  </head>
  <body>
    <p><a href="./app/?gioi-thieu">Chansonia</a></p>
  </body>
</html>
`,
);

writeFileSync(
  join(site, "sw.js"),
  `/* Gỡ service worker cũ từng đăng ký ở thư mục gốc; app có service worker riêng trong app/. */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(self.registration.unregister());
});
`,
);

console.log("Đã ghép: dist-site/app/ (app) + dist-site/index.html (chuyển vào app)");
