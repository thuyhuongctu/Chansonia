import type { Song } from "@/lib/catalog";
import { collectionOf } from "@/lib/library";

/**
 * Xuất lời có mốc thời gian theo định dạng LRC — định dạng chữ thường mà phần
 * lớn trình phát nhạc (VLC, foobar2000, Poweramp, AIMP…) và công cụ làm phụ
 * đề đọc được. Mỗi dòng: [phút:giây.phần trăm giây] lời.
 *
 * Mốc lấy từ bản thu khớp lời (bản mặc định của bài). Cuối bài thêm một dòng
 * trống ở mốc kết thúc dòng cuối để trình phát xoá lời khỏi màn hình.
 */

export function lrcTime(ms: number): string {
  const cs = Math.max(0, Math.round(ms / 10));
  const m = Math.floor(cs / 6000);
  const s = Math.floor((cs % 6000) / 100);
  const c = cs % 100;
  return `[${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(c).padStart(2, "0")}]`;
}

/** Bỏ ký tự xuống dòng và dấu ngoặc vuông lẫn trong thẻ đầu tệp */
const tag = (v: string) => v.replace(/[\r\n[\]]+/g, " ").trim();

export function hasLrc(song: Song): boolean {
  return song.lines.length > 0;
}

export function buildLrc(song: Song): string {
  const out: string[] = [];
  out.push(`[ti:${tag(song.title)}]`);
  out.push(`[al:${tag(collectionOf(song.id).name)}]`);
  if (song.durationMs > 0) {
    const sec = Math.round(song.durationMs / 1000);
    out.push(`[length:${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}]`);
  }
  out.push("[re:Chansonia]");
  out.push("");
  for (const line of song.lines) {
    const text = line.words.map((w) => w.text).join(" ").trim();
    out.push(`${lrcTime(line.startMs)}${text}`);
  }
  const last = song.lines[song.lines.length - 1];
  if (last && last.endMs > last.startMs) out.push(lrcTime(last.endMs));
  return out.join("\n") + "\n";
}

/** Tên tệp an toàn trên mọi hệ điều hành: bỏ dấu, chỉ giữ chữ, số và gạch nối */
export function lrcFileName(song: Song): string {
  const base = song.title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  return `${base || song.id}.lrc`;
}

/** Tải tệp .lrc về máy */
export function downloadLrc(song: Song) {
  const blob = new Blob([buildLrc(song)], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = lrcFileName(song);
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
