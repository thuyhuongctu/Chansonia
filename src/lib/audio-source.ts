/**
 * Nguồn tệp âm thanh.
 *
 * Có hai cách đóng gói ứng dụng:
 *
 *  1. BẢN OFFLINE (mặc định) — nhạc nằm trong thư mục public/audio và được
 *     đóng gói vào app. App nặng khoảng 44 MB nhưng chạy không cần mạng.
 *
 *         npm run build
 *
 *  2. BẢN TRỰC TUYẾN — nhạc tải từ máy chủ, app chỉ khoảng 3 MB.
 *     Cần có mạng khi phát.
 *
 *         VITE_AUDIO_BASE=https://thuyhuongctu.github.io/JESUISHUONG_WEBSITE_2026/assets/audio npm run build
 *
 * Trong tệp bài hát, `audioSrc` luôn ghi dạng "audio/ten-bai.mp3".
 * Hàm dưới đây tự đổi sang địa chỉ đầy đủ khi bật chế độ trực tuyến.
 */

const BASE = (import.meta.env.VITE_AUDIO_BASE ?? "").replace(/\/+$/, "");

export const IS_STREAMING = BASE.length > 0;

export function resolveAudio(src: string): string {
  if (!IS_STREAMING) return src;
  const file = src.replace(/^.*\//, "");
  return `${BASE}/${file}`;
}
