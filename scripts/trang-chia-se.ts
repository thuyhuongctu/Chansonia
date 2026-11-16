/**
 * Trang chia sẻ riêng cho từng video và từng bài hát.
 *
 * Zalo, Facebook, Messenger tạo ô xem trước bằng cách đọc thẻ og:… của trang
 * được dán vào. App là một trang duy nhất nên mọi đường link đều ra cùng một
 * ô «Chansonia». Vì vậy lúc dựng app, mỗi video có một trang nhỏ
 * `v/<mã-video>/` và mỗi bài có `b/<mã-bài>/`, mang tên, mô tả và ảnh của
 * chính nó; người bấm vào thì được chuyển ngay vào app (`?video=` / `?bai=`).
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { build } from "esbuild";

/** Địa chỉ công khai của app — ảnh og:image phải là địa chỉ đầy đủ */
export const PUBLIC_APP = "https://chansonia.jemappellehuong.com/app/";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const abs = (src: string | undefined, fallback: string) =>
  !src ? fallback : /^https?:\/\//.test(src) ? src : PUBLIC_APP + src.replace(/^\.?\//, "");

function page(o: {
  title: string;
  desc: string;
  path: string;
  image: string;
  target: string;
  type: string;
  youtube?: string;
}) {
  const t = esc(o.title);
  const d = esc(o.desc);
  const url = esc(PUBLIC_APP + o.path);
  const img = esc(o.image);
  const go = esc(o.target);
  const video = o.youtube
    ? `
    <meta property="og:video" content="https://www.youtube.com/embed/${o.youtube}" />
    <meta property="og:video:secure_url" content="https://www.youtube.com/embed/${o.youtube}" />
    <meta property="og:video:type" content="text/html" />
    <meta property="og:video:width" content="1280" />
    <meta property="og:video:height" content="720" />`
    : "";
  return `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${t} · Chansonia</title>
    <meta name="description" content="${d}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="${o.type}" />
    <meta property="og:site_name" content="Chansonia" />
    <meta property="og:title" content="${t}" />
    <meta property="og:description" content="${d}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${img}" />
    <meta property="og:image:alt" content="${t}" />${video}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${t}" />
    <meta name="twitter:description" content="${d}" />
    <meta name="twitter:image" content="${img}" />
    <meta http-equiv="refresh" content="0; url=${go}" />
    <script>location.replace(${JSON.stringify(o.target)} + location.hash);</script>
  </head>
  <body>
    <p><a href="${go}">${t} · Chansonia</a></p>
  </body>
</html>
`;
}

/**
 * Ảnh bìa trong app là WebP; ô xem trước của Zalo chưa chắc đọc được WebP nên
 * đổi sang JPG cạnh trang chia sẻ. Không có thư viện sharp thì giữ nguyên ảnh gốc.
 */
async function jpegCover(src: string | undefined, outDir: string, dir: string): Promise<boolean> {
  if (!src || /^https?:\/\//.test(src) || !/\.webp$/i.test(src)) return false;
  const file = join(outDir, src);
  if (!existsSync(file)) return false;
  try {
    const sharp = (await import("sharp")).default;
    await sharp(file).resize(1200, 1200, { fit: "inside" }).jpeg({ quality: 82 }).toFile(join(dir, "cover.jpg"));
    return true;
  } catch {
    return false;
  }
}

type Lib = typeof import("../src/lib/library");

/** Đọc danh mục trong src/lib/library.ts bằng esbuild (không cần trình duyệt) */
async function loadLibrary(root: string): Promise<Lib> {
  const out = await build({
    entryPoints: [join(root, "src/lib/library.ts")],
    bundle: true,
    format: "esm",
    platform: "node",
    write: false,
    logLevel: "error",
    alias: { "@": join(root, "src") },
    define: { "import.meta.env": "{}" },
  });
  const code = out.outputFiles[0].text;
  return import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
}

export async function writeSharePages(root: string, outDir: string) {
  const { COLLECTIONS } = await loadLibrary(root);
  const fallback = PUBLIC_APP + "og-image.png";
  let n = 0;
  for (const col of COLLECTIONS) {
    for (const v of col.videos) {
      const dir = join(outDir, "v", v.id);
      mkdirSync(dir, { recursive: true });
      // Ảnh JPG của YouTube: ứng dụng nhắn tin nào cũng đọc được (WebP thì không chắc).
      const image = v.youtube ? `https://i.ytimg.com/vi/${v.youtube}/hqdefault.jpg` : abs(v.poster, fallback);
      writeFileSync(
        join(dir, "index.html"),
        page({
          title: v.title,
          desc: `${v.meta} · ${col.name}`,
          path: `v/${v.id}/`,
          image,
          target: `../../?video=${encodeURIComponent(v.id)}`,
          type: "video.other",
          youtube: v.youtube,
        }),
      );
      n++;
    }
    for (const s of col.songs) {
      const dir = join(outDir, "b", s.id);
      mkdirSync(dir, { recursive: true });
      const cover = await jpegCover(s.coverSrc, outDir, dir);
      writeFileSync(
        join(dir, "index.html"),
        page({
          title: s.title,
          desc: [s.subtitle, col.name].filter(Boolean).join(" · "),
          path: `b/${s.id}/`,
          image: cover ? PUBLIC_APP + `b/${s.id}/cover.jpg` : abs(s.coverSrc, fallback),
          target: `../../?bai=${encodeURIComponent(s.id)}`,
          type: "music.song",
        }),
      );
      n++;
    }
  }
  return n;
}
