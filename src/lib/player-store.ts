import { create } from "zustand";
import {
  findLineIndex,
  findWordIndex,
  type Song,
  type ViewMode,
  type AppView,
} from "@/lib/catalog";
import {
  ALL_SONGS,
  SONG_INDEX,
  collectionOf,
  type CollectionId,
} from "@/lib/library";
import * as engine from "@/lib/audio-engine";
import { resolveAudio } from "@/lib/audio-source";

export type PlayOrder = "sequential" | "shuffle";
export type LibraryTab = "songs" | "videos";

/** Các mức hẹn giờ tắt nhạc, tính bằng phút */
export const SLEEP_PRESETS = [5, 15, 30, 45, 60] as const;
export const SLEEP_TIMER_DEFAULT_MINUTES = 30;

/** Nơi lưu bài đang nghe và vị trí, để mở lại app là nghe tiếp được */
const SAVE_KEY = "chansonia-player";

type PlayerState = {
  view: AppView;
  songId: string;
  mode: ViewMode;
  playing: boolean;
  currentMs: number;
  /** Độ dài bài đang mở (ms) — lấy từ danh mục, chưa có thì đọc từ tệp nhạc */
  durationMs: number;
  lineIndex: number;
  wordIndex: number;

  /* ── Thư viện ── */
  collectionId: CollectionId;
  libraryTab: LibraryTab;
  query: string;
  /** Video đang mở: bộ sưu tập + mã video */
  video: { collectionId: CollectionId; id: string } | null;

  /** "sequential" = lần lượt trong bộ sưu tập, "shuffle" = ngẫu nhiên trong bộ sưu tập */
  playOrder: PlayOrder;
  /** Các bài còn lại trong lượt xáo trộn hiện tại (không lặp lại cho tới khi hết vòng) */
  shuffleBag: string[];
  /** Lịch sử các bài đã phát, dùng để lùi bài khi đang ở chế độ ngẫu nhiên */
  history: string[];

  /** Số phút đã chọn cho hẹn giờ tắt nhạc */
  sleepMinutes: number;
  /** Thời điểm (epoch ms) hẹn giờ sẽ tắt nhạc — null nghĩa là chưa bật */
  sleepEndsAt: number | null;

  setView: (v: AppView) => void;
  setCollection: (id: CollectionId) => void;
  setLibraryTab: (tab: LibraryTab) => void;
  setQuery: (q: string) => void;
  openVideo: (collectionId: CollectionId, id: string) => void;
  /** Mở màn hình lời của một bài; bài khác bài đang nghe thì phát luôn */
  openSong: (id: string) => Promise<void>;
  playSong: (id: string) => Promise<void>;
  setMode: (m: ViewMode) => void;
  setPlayOrder: (order: PlayOrder) => void;
  play: () => Promise<void>;
  pause: () => void;
  toggle: () => void;
  seek: (ms: number) => void;
  seekSection: (sectionId: string) => void;
  next: () => Promise<void>;
  prev: () => Promise<void>;
  tick: () => void;
  setSleepMinutes: (minutes: number) => void;
  startSleepTimer: () => void;
  cancelSleepTimer: () => void;
};

let raf = 0;
let sleepTimeout = 0;

/** Xáo trộn Fisher–Yates, không đổi mảng gốc */
function shuffle<T>(items: T[]): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function startClock(get: () => PlayerState) {
  cancelAnimationFrame(raf);
  const loop = () => {
    get().tick();
    if (get().playing) raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
}

function songOf(id: string): Song {
  return SONG_INDEX[id] ?? ALL_SONGS[0];
}

/** Các bài cùng bộ sưu tập với bài này, theo thứ tự trong danh sách */
function siblings(id: string): string[] {
  return collectionOf(id).songs.map((s) => s.id);
}

/** Đọc bài và vị trí đã lưu lần trước */
function restore(): { songId: string; ms: number } {
  try {
    const raw = JSON.parse(localStorage.getItem(SAVE_KEY) ?? "null");
    if (raw && typeof raw.songId === "string" && SONG_INDEX[raw.songId]) {
      return { songId: raw.songId, ms: Math.max(0, Number(raw.ms) || 0) };
    }
  } catch {
    /* localStorage bị chặn hoặc hỏng — bắt đầu từ đầu */
  }
  return { songId: ALL_SONGS[0].id, ms: 0 };
}

let lastSaved = 0;
function save(songId: string, ms: number, force = false) {
  const now = Date.now();
  if (!force && now - lastSaved < 2000) return;
  lastSaved = now;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ songId, ms: Math.round(ms) }));
  } catch {
    /* không ghi được thì thôi */
  }
}

const saved = restore();
const savedSong = songOf(saved.songId);
const savedMs = Math.min(saved.ms, savedSong.durationMs || saved.ms);

function indices(song: Song, ms: number) {
  const lineIndex = findLineIndex(song.lines, ms);
  const line = song.lines[lineIndex];
  return { lineIndex, wordIndex: line ? findWordIndex(line, ms) : 0 };
}

export const usePlayer = create<PlayerState>((set, get) => ({
  view: "library",
  songId: savedSong.id,
  mode: "karaoke",
  playing: false,
  currentMs: savedMs,
  durationMs: savedSong.durationMs,
  ...indices(savedSong, savedMs),

  collectionId: collectionOf(savedSong.id).id,
  libraryTab: "songs",
  query: "",
  video: null,

  playOrder: "sequential",
  shuffleBag: [],
  history: [],

  sleepMinutes: SLEEP_TIMER_DEFAULT_MINUTES,
  sleepEndsAt: null,

  setView: (view) => set({ view }),

  setCollection: (collectionId) => set({ collectionId, query: "" }),

  setLibraryTab: (libraryTab) => set({ libraryTab }),

  setQuery: (query) => set({ query }),

  openVideo: (collectionId, id) => {
    get().pause();
    set({ view: "video", video: { collectionId, id } });
  },

  openSong: async (id) => {
    if (id === get().songId) {
      set({ view: "player" });
      if (!get().playing) await get().play();
      return;
    }
    set({ view: "player" });
    await get().playSong(id);
  },

  playSong: async (id) => {
    const song = songOf(id);
    engine.pause();
    cancelAnimationFrame(raf);
    // Đổi sang bộ sưu tập khác thì túi xáo trộn cũ không còn đúng nữa.
    const sameCollection = collectionOf(id).id === collectionOf(get().songId).id;
    set({
      songId: song.id,
      playing: false,
      currentMs: 0,
      durationMs: song.durationMs,
      lineIndex: 0,
      wordIndex: 0,
      ...(sameCollection ? {} : { shuffleBag: [], history: [] }),
    });
    save(song.id, 0, true);
    await get().play();
  },

  setMode: (mode) => set({ mode }),

  setPlayOrder: (order) => {
    if (order === "shuffle") {
      const rest = siblings(get().songId).filter((id) => id !== get().songId);
      set({ playOrder: order, shuffleBag: shuffle(rest) });
    } else {
      set({ playOrder: order, shuffleBag: [] });
    }
  },

  play: async () => {
    const song = songOf(get().songId);
    const fresh = engine.setTrack(resolveAudio(song.audioSrc));
    // Tệp vừa mở mà đã có vị trí (mở lại app, hoặc tua khi chưa phát) — nhảy tới đó.
    if (fresh && get().currentMs > 0) engine.seek(get().currentMs);
    engine.onEnded(() => {
      set({ playing: false });
      cancelAnimationFrame(raf);
      save(get().songId, 0, true);
      void get().next();
    });
    await engine.play();
    set({ playing: true });
    startClock(get);
  },

  pause: () => {
    engine.pause();
    set({ playing: false });
    cancelAnimationFrame(raf);
    save(get().songId, get().currentMs, true);
  },

  toggle: () => {
    if (get().playing) get().pause();
    else void get().play();
  },

  seek: (ms) => {
    const song = songOf(get().songId);
    const limit = get().durationMs || song.durationMs || Number.POSITIVE_INFINITY;
    const at = Math.max(0, Math.min(ms, limit));
    engine.setTrack(resolveAudio(song.audioSrc));
    engine.seek(at);
    set({ currentMs: at, ...indices(song, at) });
    save(song.id, at, true);
  },

  seekSection: (sectionId) => {
    const song = songOf(get().songId);
    const sec = song.sections.find((s) => s.id === sectionId);
    if (sec) get().seek(sec.startMs);
  },

  next: async () => {
    const currentId = get().songId;
    const list = siblings(currentId);
    const history = [...get().history, currentId].slice(-list.length);

    if (get().playOrder === "sequential" || list.length < 2) {
      const i = list.indexOf(currentId);
      set({ history });
      await get().playSong(list[(i + 1) % list.length]);
      return;
    }

    // Chế độ ngẫu nhiên: rút bài tiếp theo từ "túi" xáo trộn, hết túi thì xáo lại
    // cả bộ sưu tập (trừ bài hiện tại) để không lặp lại trước khi hết vòng.
    let bag = get().shuffleBag.filter((id) => list.includes(id) && id !== currentId);
    if (bag.length === 0) bag = shuffle(list.filter((id) => id !== currentId));
    const [nextId, ...remaining] = bag;
    set({ shuffleBag: remaining, history });
    await get().playSong(nextId);
  },

  prev: async () => {
    // quá 3 giây thì về đầu bài, còn không thì lùi bài
    if (get().currentMs > 3000) return get().seek(0);

    const list = siblings(get().songId);
    if (get().playOrder === "sequential") {
      const i = list.indexOf(get().songId);
      await get().playSong(list[(i - 1 + list.length) % list.length]);
      return;
    }

    // Chế độ ngẫu nhiên: lùi lại theo lịch sử đã phát
    const history = get().history;
    if (history.length === 0) return get().seek(0);
    const prevId = history[history.length - 1];
    set({ history: history.slice(0, -1) });
    await get().playSong(prevId);
  },

  tick: () => {
    const song = songOf(get().songId);
    const ms = engine.nowMs();
    const durationMs = song.durationMs || engine.durationMs() || get().durationMs;
    set({ currentMs: ms, durationMs, ...indices(song, ms) });
    save(song.id, ms);
  },

  setSleepMinutes: (minutes) => set({ sleepMinutes: Math.max(1, Math.round(minutes)) }),

  startSleepTimer: () => {
    clearTimeout(sleepTimeout);
    const ms = get().sleepMinutes * 60_000;
    sleepTimeout = window.setTimeout(() => {
      get().pause();
      set({ sleepEndsAt: null });
    }, ms);
    set({ sleepEndsAt: Date.now() + ms });
  },

  cancelSleepTimer: () => {
    clearTimeout(sleepTimeout);
    set({ sleepEndsAt: null });
  },
}));

export function useSong(): Song {
  const id = usePlayer((s) => s.songId);
  return songOf(id);
}
