import { create } from "zustand";
import {
  SONGS,
  SONG_BY_ID,
  findLineIndex,
  findWordIndex,
  type Song,
  type ViewMode,
  type AppView,
} from "@/lib/catalog";
import * as engine from "@/lib/audio-engine";
import { resolveAudio } from "@/lib/audio-source";

export type PlayOrder = "sequential" | "shuffle";

/** Giới hạn cho phép của hẹn giờ tắt nhạc, tính bằng phút */
export const SLEEP_TIMER_MIN_MINUTES = 5;
export const SLEEP_TIMER_MAX_MINUTES = 60;
export const SLEEP_TIMER_DEFAULT_MINUTES = 30;

type PlayerState = {
  view: AppView;
  songId: string;
  mode: ViewMode;
  playing: boolean;
  currentMs: number;
  lineIndex: number;
  wordIndex: number;

  /** "sequential" = phát lần lượt theo thứ tự album, "shuffle" = phát ngẫu nhiên */
  playOrder: PlayOrder;
  /** Các bài còn lại trong lượt xáo trộn hiện tại (không lặp lại cho tới khi hết vòng) */
  shuffleBag: string[];
  /** Lịch sử các bài đã phát, dùng để lùi bài khi đang ở chế độ ngẫu nhiên */
  history: string[];

  /** Số phút đã chọn cho hẹn giờ tắt nhạc (5–60) */
  sleepMinutes: number;
  /** Thời điểm (epoch ms) hẹn giờ sẽ tắt nhạc — null nghĩa là chưa bật */
  sleepEndsAt: number | null;

  setView: (v: AppView) => void;
  openSong: (id: string) => void;
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

function clampSleepMinutes(minutes: number): number {
  return Math.min(
    SLEEP_TIMER_MAX_MINUTES,
    Math.max(SLEEP_TIMER_MIN_MINUTES, Math.round(minutes)),
  );
}

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

function load(id: string) {
  const song = SONG_BY_ID[id] ?? SONGS[0];
  engine.pause();
  engine.setTrack(resolveAudio(song.audioSrc), song.durationMs);
  return song;
}

export const usePlayer = create<PlayerState>((set, get) => ({
  view: "library",
  songId: SONGS[0].id,
  mode: "karaoke",
  playing: false,
  currentMs: 0,
  lineIndex: 0,
  wordIndex: 0,

  playOrder: "sequential",
  shuffleBag: [],
  history: [],

  sleepMinutes: SLEEP_TIMER_DEFAULT_MINUTES,
  sleepEndsAt: null,

  setView: (view) => set({ view }),

  openSong: (id) => {
    load(id);
    cancelAnimationFrame(raf);
    set({ view: "player", songId: id, playing: false, currentMs: 0, lineIndex: 0, wordIndex: 0 });
  },

  playSong: async (id) => {
    get().openSong(id);
    await get().play();
  },

  setMode: (mode) => set({ mode }),

  setPlayOrder: (order) => {
    if (order === "shuffle") {
      const rest = SONGS.map((s) => s.id).filter((id) => id !== get().songId);
      set({ playOrder: order, shuffleBag: shuffle(rest) });
    } else {
      set({ playOrder: order, shuffleBag: [] });
    }
  },

  play: async () => {
    const song = SONG_BY_ID[get().songId];
    engine.setTrack(resolveAudio(song.audioSrc), song.durationMs);
    engine.onEnded(() => {
      set({ playing: false });
      cancelAnimationFrame(raf);
      void get().next();
    });
    await engine.play();
    set({ playing: true, view: "player" });
    startClock(get);
  },

  pause: () => {
    engine.pause();
    set({ playing: false });
    cancelAnimationFrame(raf);
  },

  toggle: () => {
    if (get().playing) get().pause();
    else void get().play();
  },

  seek: (ms) => {
    const song = SONG_BY_ID[get().songId];
    const at = Math.max(0, Math.min(ms, song.durationMs));
    engine.seek(at);
    const lineIndex = findLineIndex(song.lines, at);
    const line = song.lines[lineIndex];
    set({ currentMs: at, lineIndex, wordIndex: line ? findWordIndex(line, at) : 0 });
  },

  seekSection: (sectionId) => {
    const song = SONG_BY_ID[get().songId];
    const sec = song.sections.find((s) => s.id === sectionId);
    if (sec) get().seek(sec.startMs);
  },

  next: async () => {
    const currentId = get().songId;
    const history = [...get().history, currentId].slice(-SONGS.length);

    if (get().playOrder === "sequential") {
      const i = SONGS.findIndex((s) => s.id === currentId);
      set({ history });
      await get().playSong(SONGS[(i + 1) % SONGS.length].id);
      return;
    }

    // Chế độ ngẫu nhiên: rút bài tiếp theo từ "túi" xáo trộn, hết túi thì xáo lại
    // toàn bộ album (trừ bài hiện tại) để không lặp lại trước khi hết vòng.
    let bag = get().shuffleBag;
    if (bag.length === 0) {
      const rest = SONGS.map((s) => s.id).filter((id) => id !== currentId);
      bag = shuffle(rest.length > 0 ? rest : SONGS.map((s) => s.id));
    }
    const [nextId, ...remaining] = bag;
    set({ shuffleBag: remaining, history });
    await get().playSong(nextId);
  },

  prev: async () => {
    // trong 3 giây đầu thì lùi bài, sau đó về đầu bài hiện tại
    if (get().currentMs > 3000) return get().seek(0);

    if (get().playOrder === "sequential") {
      const i = SONGS.findIndex((s) => s.id === get().songId);
      await get().playSong(SONGS[(i - 1 + SONGS.length) % SONGS.length].id);
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
    const song = SONG_BY_ID[get().songId];
    const ms = engine.nowMs();
    const lineIndex = findLineIndex(song.lines, ms);
    const line = song.lines[lineIndex];
    set({ currentMs: ms, lineIndex, wordIndex: line ? findWordIndex(line, ms) : 0 });
  },

  setSleepMinutes: (minutes) => set({ sleepMinutes: clampSleepMinutes(minutes) }),

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
  return SONG_BY_ID[id] ?? SONGS[0];
}
