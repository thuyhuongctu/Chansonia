/*
 * Service worker của Chansonia — để ứng dụng mở được khi không có mạng và
 * cài lên màn hình chính như một app.
 *
 * Nguyên tắc:
 *  - Trang (điều hướng): ưu tiên mạng, mất mạng thì lấy bản đã lưu.
 *  - Tệp tĩnh cùng nguồn (JS, CSS, ảnh, phông): lấy bản đã lưu trước cho
 *    nhanh, đồng thời tải bản mới về để dành cho lần sau.
 *  - Tệp nhạc và các yêu cầu tải từng đoạn (Range): để nguyên cho trình
 *    duyệt lo, không đụng vào — nếu không sẽ hỏng thao tác tua.
 *
 * Tên kho lưu có kèm số thứ tự; đổi số này là mọi máy sẽ dọn kho cũ.
 */

/* Tăng số này lên khi muốn mọi máy dọn sạch kho cũ và lưu lại từ đầu.
   Không liên quan tới số phiên bản của ứng dụng: tệp JS/CSS đã có mã băm
   trong tên nên bản mới tự có khoá riêng, không bị lẫn với bản cũ. */
const CACHE = "chansonia-shell-1";

/* Bộ khung tối thiểu để mở được ứng dụng khi ngoại tuyến. Các tệp JS/CSS có
   mã băm trong tên nên không liệt kê ở đây — chúng được lưu dần khi dùng. */
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./favicon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

const AUDIO_EXT = /\.(mp3|m4a|aac|ogg|opus|wav|flac)$/i;

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      // Bỏ qua tệp nào tải hỏng, đừng để cả bước cài đặt thất bại theo.
      await Promise.allSettled(
        SHELL.map((url) => cache.add(new Request(url, { cache: "reload" }))),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.filter((n) => n.startsWith("chansonia-") && n !== CACHE).map((n) => caches.delete(n)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  if (req.method !== "GET") return;
  // Yêu cầu tải từng đoạn (tua nhạc) — để trình duyệt tự làm việc với máy chủ.
  if (req.headers.has("range")) return;

  let url;
  try {
    url = new URL(req.url);
  } catch {
    return;
  }

  if (url.origin !== self.location.origin) return;
  if (AUDIO_EXT.test(url.pathname)) return;

  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(CACHE);
          cache.put("./index.html", fresh.clone());
          return fresh;
        } catch {
          const cache = await caches.open(CACHE);
          return (
            (await cache.match("./index.html")) ||
            (await cache.match("./")) ||
            Response.error()
          );
        }
      })(),
    );
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const hit = await cache.match(req);
      if (hit) return hit;

      const res = await fetch(req);
      // Chỉ lưu bản trả về đầy đủ và hợp lệ của chính trang này.
      if (res && res.status === 200 && res.type === "basic") {
        cache.put(req, res.clone());
      }
      return res;
    })(),
  );
});
