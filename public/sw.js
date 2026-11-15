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
 *  - Trừ bài người nghe đã bấm «Tải về nghe offline» (src/lib/offline.ts):
 *    tệp của bài đó nằm trọn trong kho «chansonia-offline», nên trả thẳng từ
 *    máy, tự cắt đúng đoạn trình duyệt xin (trả mã 206) để tua vẫn được.
 *
 * Tên kho lưu có kèm số thứ tự; đổi số này là mọi máy sẽ dọn kho cũ.
 */

/* Tăng số này lên khi muốn mọi máy dọn sạch kho cũ và lưu lại từ đầu.
   Không liên quan tới số phiên bản của ứng dụng: tệp JS/CSS đã có mã băm
   trong tên nên bản mới tự có khoá riêng, không bị lẫn với bản cũ. */
const CACHE = "chansonia-shell-5";

/* Kho bài tải về — tên cố định, không dọn khi đổi phiên bản. */
const OFFLINE = "chansonia-offline";

/* Bộ khung tối thiểu để mở được ứng dụng khi ngoại tuyến. Các tệp JS/CSS có
   mã băm trong tên nên không liệt kê ở đây — chúng được lưu dần khi dùng. */
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./favicon.svg",
  "./share-card.png",
  "./icons/favicon-32.png",
  "./icons/favicon-96.png",
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
        names
          .filter((n) => n.startsWith("chansonia-") && n !== CACHE && n !== OFFLINE)
          .map((n) => caches.delete(n)),
      );
      await self.clients.claim();
    })(),
  );
});

/* ── Bài đã tải về ─────────────────────────────────────────────────── */

/* Danh sách địa chỉ đã cất, giữ trong bộ nhớ để quyết định ngay (đồng bộ)
   có cần chặn yêu cầu hay không. Service worker bị tắt rồi bật lại thì danh
   sách đọc lại từ kho; trong lúc chờ đọc, yêu cầu tệp nhạc vẫn được chờ. */
let offlineUrls = null;
let offlineLoading = null;

function loadOffline() {
  offlineLoading = caches
    .open(OFFLINE)
    .then((c) => c.keys())
    .then((keys) => {
      offlineUrls = new Set(keys.map((r) => r.url));
    })
    .catch(() => {
      offlineUrls = new Set();
    });
  return offlineLoading;
}
loadOffline();

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "offline-changed") event.waitUntil(loadOffline());
});

/** Trả tệp đã cất; trình duyệt xin một đoạn (Range) thì cắt đúng đoạn đó. */
async function serveOffline(req, url) {
  const cache = await caches.open(OFFLINE);
  const hit = await cache.match(url);
  if (!hit) return fetch(req);
  const type = hit.headers.get("content-type") || "application/octet-stream";
  const blob = await hit.blob();
  const size = blob.size;
  const range = req.headers.get("range");
  if (!range) {
    return new Response(blob, {
      status: 200,
      headers: { "Content-Type": type, "Content-Length": String(size), "Accept-Ranges": "bytes" },
    });
  }
  const m = /bytes=(\d*)-(\d*)/.exec(range);
  let start = 0;
  let end = size - 1;
  if (m && m[1] === "" && m[2] !== "") {
    start = Math.max(0, size - Number(m[2]));
  } else if (m) {
    start = Number(m[1] || 0);
    if (m[2] !== "") end = Math.min(Number(m[2]), size - 1);
  }
  if (start >= size || start > end) {
    return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
  }
  return new Response(blob.slice(start, end + 1), {
    status: 206,
    headers: {
      "Content-Type": type,
      "Content-Length": String(end - start + 1),
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Accept-Ranges": "bytes",
    },
  });
}

self.addEventListener("fetch", (event) => {
  const req = event.request;

  if (req.method !== "GET") return;

  // Bài đã tải về: trả từ máy, kể cả tệp ở trang khác và yêu cầu tải từng đoạn.
  {
    const url = req.url.split("#")[0];
    if (offlineUrls ? offlineUrls.has(url) : AUDIO_EXT.test(new URL(url).pathname)) {
      event.respondWith(
        (async () => {
          if (!offlineUrls) await offlineLoading;
          if (!offlineUrls.has(url)) return fetch(req);
          return serveOffline(req, url);
        })(),
      );
      return;
    }
  }
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
