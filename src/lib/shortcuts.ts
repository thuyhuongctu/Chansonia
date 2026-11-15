import { useEffect } from "react";
import { usePlayer } from "@/lib/player-store";
import { SONG_INDEX } from "@/lib/library";

/**
 * Phím tắt dùng chung cho cả ứng dụng (máy tính, bàn phím rời).
 *
 *   Dấu cách / K   phát · tạm dừng
 *   ← / →          lùi · tới 5 giây
 *   Shift + ← / →  về đầu phần trước · sang phần sau
 *   P / N          bài trước · bài sau
 *   M              tắt · bật tiếng
 *   L              thêm · bỏ Yêu thích
 *
 * Không bắt phím khi đang gõ chữ, khi đang đứng trên một nút (dấu cách đã có
 * việc của nó) hay trên thanh tua (thanh tua tự lo phím mũi tên), và khi có
 * phím Ctrl / Cmd / Alt đi kèm để khỏi tranh phím tắt của trình duyệt.
 */
export const SHORTCUTS: [keys: string, action: string][] = [
  ["Space · K", "Phát · tạm dừng"],
  ["← →", "Lùi · tới 5 giây"],
  ["Shift + ← →", "Phần trước · phần sau"],
  ["P · N", "Bài trước · bài sau"],
  ["M", "Tắt · bật tiếng"],
  ["L", "Thêm · bỏ Yêu thích"],
];

const STEP_MS = 5000;
/** Đã vào phần hiện tại quá chừng này thì «phần trước» quay về đầu phần hiện tại */
const RESTART_MS = 2000;

function ignored(e: KeyboardEvent): boolean {
  if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return true;
  const el = e.target as HTMLElement | null;
  if (!el || !(el instanceof HTMLElement)) return false;
  if (el.isContentEditable) return true;
  if (el.closest('input, textarea, select, [role="slider"], [role="dialog"]')) return true;
  // Trên nút bấm, dấu cách và Enter là để bấm nút đó.
  if (e.key === " " && el.closest("button, a, [role='tab']")) return true;
  // Trong nhóm tab hay danh sách chọn, phím mũi tên là để di chuyển giữa các mục.
  if (e.key.startsWith("Arrow") && el.closest('[role="tablist"], [role="radiogroup"], [role="listbox"], [role="menu"]'))
    return true;
  return false;
}

/** Mốc bắt đầu các phần có tên của bài đang phát, tăng dần */
function sectionStarts(): number[] {
  const { songId } = usePlayer.getState();
  const song = SONG_INDEX[songId];
  if (!song) return [];
  return song.sections.filter((s) => s.label).map((s) => s.startMs).sort((a, b) => a - b);
}

export function jumpSection(dir: 1 | -1) {
  const p = usePlayer.getState();
  const starts = sectionStarts();
  if (!starts.length) return;
  const now = p.currentMs;
  if (dir > 0) {
    const next = starts.find((ms) => ms > now + 250);
    if (next !== undefined) p.seek(next);
    return;
  }
  const passed = starts.filter((ms) => ms <= now);
  const cur = passed.length ? passed[passed.length - 1] : 0;
  const target = now - cur > RESTART_MS || passed.length < 2 ? cur : passed[passed.length - 2];
  p.seek(target);
}

export function useShortcuts() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (ignored(e)) return;
      const p = usePlayer.getState();
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      switch (k) {
        case " ":
        case "k":
          p.toggle();
          break;
        case "ArrowLeft":
          if (e.shiftKey) jumpSection(-1);
          else p.seek(p.currentMs - STEP_MS);
          break;
        case "ArrowRight":
          if (e.shiftKey) jumpSection(1);
          else p.seek(p.currentMs + STEP_MS);
          break;
        case "n":
          void p.next();
          break;
        case "p":
          void p.prev();
          break;
        case "m":
          p.toggleMute();
          break;
        case "l":
          p.toggleFavorite(p.songId);
          break;
        default:
          return;
      }
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
