import { create } from "zustand";
import type { Song } from "@/lib/catalog";
import { resolveAudio } from "@/lib/audio-source";
import { SONG_INDEX } from "@/lib/library";

/**
 * Tải bài về máy để nghe khi không có mạng.
 *
 * Tệp nhạc (mọi phiên bản của bài) và ảnh bìa đặt ở trang khác được tải trọn
 * vẹn rồi cất vào kho «chansonia-offline» của trình duyệt. Service worker
 * (public/sw.js) thấy tệp có trong kho này thì trả thẳng từ máy, kể cả khi
 * trình duyệt xin từng đoạn để tua — không cần mạng.
 *
 * Tên kho này KHÔNG đổi theo số phiên bản của service worker, để cập nhật app
 * không xoá mất bài người nghe đã tải.
 */

export const OFFLINE_CACHE = "chansonia-offline";
const KEY = "chansonia-offline-songs";

/** Trình duyệt có làm được việc này không: cần kho Cache và service worker */
export function offlineSupported(): boolean {
  return typeof window !== "undefined" && "caches" in window && "serviceWorker" in navigator && window.isSecureContext;
}

/** Địa chỉ đầy đủ của các tệp cần cất cho một bài */
export function offlineUrls(song: Song): string[] {
  const audio = (song.versions?.length ? song.versions : [{ audioSrc: song.audioSrc }]).map((v) =>
    new URL(resolveAudio(v.audioSrc), location.href).href,
  );
  // Ảnh bìa cùng trang đã được service worker lưu khi xem; chỉ cần tải ảnh ở trang khác.
  const cover = song.coverSrc && /^https?:\/\//.test(song.coverSrc) ? [song.coverSrc] : [];
  return [...new Set([...audio, ...cover])];
}

function readIds(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((id) => typeof id === "string" && SONG_INDEX[id]) : [];
  } catch {
    return [];
  }
}

function writeIds(ids: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* bỏ qua */
  }
}

/** Báo service worker đọc lại danh sách tệp đã cất */
function notifyWorker() {
  navigator.serviceWorker?.controller?.postMessage({ type: "offline-changed" });
}

type OfflineState = {
  /** Bài đã tải xong, mới nhất trước */
  ids: string[];
  /** Bài đang tải */
  busy: string[];
  download: (id: string) => Promise<boolean>;
  remove: (id: string) => Promise<void>;
  /** Đối chiếu danh sách với kho thật (người dùng có thể đã xoá dữ liệu trang) */
  verify: () => Promise<void>;
};

export const useOffline = create<OfflineState>((set, get) => ({
  ids: readIds(),
  busy: [],

  download: async (id) => {
    const song = SONG_INDEX[id];
    if (!song || !offlineSupported() || get().busy.includes(id)) return false;
    set({ busy: [...get().busy, id] });
    try {
      // Xin trình duyệt đừng tự dọn kho này khi máy sắp đầy.
      await navigator.storage?.persist?.().catch(() => false);
      const cache = await caches.open(OFFLINE_CACHE);
      for (const url of offlineUrls(song)) {
        const res = await fetch(url, { mode: "cors", cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        await cache.put(url, res);
      }
      const ids = [id, ...get().ids.filter((x) => x !== id)];
      writeIds(ids);
      set({ ids });
      notifyWorker();
      return true;
    } catch {
      return false;
    } finally {
      set({ busy: get().busy.filter((x) => x !== id) });
    }
  },

  remove: async (id) => {
    const song = SONG_INDEX[id];
    const ids = get().ids.filter((x) => x !== id);
    writeIds(ids);
    set({ ids });
    if (!song || !offlineSupported()) return;
    const cache = await caches.open(OFFLINE_CACHE);
    // Tệp dùng chung với bài khác vẫn đang lưu thì giữ lại.
    const keep = new Set(ids.flatMap((x) => (SONG_INDEX[x] ? offlineUrls(SONG_INDEX[x]) : [])));
    await Promise.all(offlineUrls(song).filter((u) => !keep.has(u)).map((u) => cache.delete(u)));
    notifyWorker();
  },

  verify: async () => {
    if (!offlineSupported() || !get().ids.length) return;
    try {
      const cache = await caches.open(OFFLINE_CACHE);
      const have = new Set((await cache.keys()).map((r) => r.url));
      const ids = get().ids.filter((id) => offlineUrls(SONG_INDEX[id]).every((u) => have.has(u)));
      if (ids.length !== get().ids.length) {
        writeIds(ids);
        set({ ids });
      }
    } catch {
      /* bỏ qua */
    }
  },
}));
