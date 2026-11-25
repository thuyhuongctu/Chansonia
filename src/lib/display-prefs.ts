import { create } from "zustand";

/**
 * Tuỳ chỉnh hiển thị lời hát: cỡ chữ và giữ màn hình sáng khi đang nghe.
 * Lưu trên máy người nghe.
 */
export const LYRIC_SCALES = [0.85, 1, 1.2, 1.4] as const;
export type LyricScale = (typeof LYRIC_SCALES)[number];

const KEY = "chansonia-display";

type Saved = { lyricScale: LyricScale; keepAwake: boolean };

function load(): Saved {
  const fallback: Saved = { lyricScale: 1, keepAwake: true };
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "null") as Partial<Saved> | null;
    return {
      lyricScale: LYRIC_SCALES.includes(v?.lyricScale as LyricScale) ? (v!.lyricScale as LyricScale) : 1,
      keepAwake: typeof v?.keepAwake === "boolean" ? v.keepAwake : true,
    };
  } catch {
    return fallback;
  }
}

function save(s: Saved) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* localStorage bị chặn — chỉ giữ trong phiên này */
  }
}

type State = Saved & {
  setLyricScale: (v: LyricScale) => void;
  setKeepAwake: (v: boolean) => void;
};

export const useDisplay = create<State>((set, get) => ({
  ...load(),
  setLyricScale: (lyricScale) => {
    set({ lyricScale });
    save({ lyricScale, keepAwake: get().keepAwake });
  },
  setKeepAwake: (keepAwake) => {
    set({ keepAwake });
    save({ lyricScale: get().lyricScale, keepAwake });
  },
}));
