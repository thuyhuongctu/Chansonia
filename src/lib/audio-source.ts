/**
 * Nguồn tệp âm thanh.
 *
 * Có hai cách đóng gói ứng dụng:
 *
 *  1. BẢN OFFLINE (mặc định) — nhạc nằm trong thư mục public/audio và được
 *     đóng gói vào app. App nặng khoảng 40 MB nhưng chạy không cần mạng.
 *
 *         npm run build
 *
 *  2. BẢN TRỰC TUYẾN — nhạc tải từ máy chủ, app chỉ khoảng 2,3 MB (bản web).
 *     Cần có mạng khi phát.
 *
 *         VITE_AUDIO_BASE=https://jemappellehuong.com/assets/audio npm run build
 *
 * Trong tệp bài hát của album, `audioSrc` ghi dạng "audio/ten-bai.mp3".
 * Hàm dưới đây tự đổi sang địa chỉ đầy đủ khi bật chế độ trực tuyến. Bài nào
 * đã ghi sẵn địa chỉ đầy đủ (https://…, như nhạc BizOn và M-AIDA) thì giữ
 * nguyên.
 */

const BASE = (import.meta.env.VITE_AUDIO_BASE ?? "").replace(/\/+$/, "");

export const IS_STREAMING = BASE.length > 0;

/** Tệp trong app mang tên khác với tệp trên máy chủ nhạc */
const SERVER_NAME: Record<string, string> = {
  "track07-le-ciel.mp3": "le-ciel-que-tu-nas-jamais-quitte.mp3",
};

export function resolveAudio(src: string): string {
  if (/^https?:\/\//.test(src)) return src;
  if (!IS_STREAMING) return src;
  const file = src.replace(/^.*\//, "");
  return `${BASE}/${SERVER_NAME[file] ?? file}`;
}
