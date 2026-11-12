/*
 * Trước đây app nghe nhạc nằm ở thư mục gốc và đăng ký service worker tại
 * đây. Nay thư mục gốc là trang giới thiệu, còn app chuyển sang app/ (có
 * service worker riêng). Tệp này chỉ để gỡ bản đăng ký cũ ở thư mục gốc,
 * không lưu gì cả.
 */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(self.registration.unregister());
});
