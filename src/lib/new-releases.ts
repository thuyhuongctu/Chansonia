/**
 * Bài và video mới phát hành: mã → ngày đưa vào app (YYYY-MM-DD).
 * Thêm bài mới thì ghi thêm một dòng ở đây; nhãn «Mới» tự tắt sau
 * NEW_DAYS ngày, không cần gỡ tay.
 */
export const NEW_RELEASES: Record<string, string> = {
  // Bài hát
  "bizon-fijord-moonlight": "2026-11-20",
  "nhanh-xuan-ben-cua-so": "2026-11-18",
  "we-create-tomorrow": "2026-11-16",
  "chung-ta-cung-di": "2026-11-16",
  "trong-toi-co-mot-nuoc-nam": "2026-11-14",
  // Video
  "bizon-mv-southern-horizons": "2026-11-23",
  "trong-toi-co-mot-nuoc-nam-demo": "2026-11-20",
  "nhanh-xuan-ben-cua-so-mv": "2026-11-18",
};

/** Số ngày một bài còn mang nhãn «Mới» */
export const NEW_DAYS = 30;

const DAY = 86_400_000;

/** Bài (hay video) này còn trong hạn «Mới» không */
export function isNew(id: string, now: number = Date.now()): boolean {
  const d = NEW_RELEASES[id];
  if (!d) return false;
  const age = now - Date.parse(`${d}T00:00:00+07:00`);
  return age >= 0 && age < NEW_DAYS * DAY;
}

/** Các mã còn «Mới», mới nhất trước */
export function newIds(now: number = Date.now()): string[] {
  return Object.keys(NEW_RELEASES)
    .filter((id) => isNew(id, now))
    .sort((a, b) => NEW_RELEASES[b].localeCompare(NEW_RELEASES[a]));
}
