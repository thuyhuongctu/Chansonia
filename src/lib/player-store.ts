import { create } from "zustand";
import {
  findLineIndex,
  findWordIndex,
  songVersion,
  type Song,
  type ViewMode,
  type AppView,
} from "@/lib/catalog";
import {
  ALL_SONGS,
  COLLECTIONS,
  SONG_INDEX,
  collectionOf,
  type CollectionId,
} from "@/lib/library";
import * as engine from "@/lib/audio-engine";
import { resolveAudio } from "@/lib/audio-source";

export type PlayOrder = "sequential" | "shuffle";
export type LibraryTab = "songs" | "videos" | "favorites" | "mine";
/** Lặp lại: tắt · cả bộ sưu tập · một bài */
export type RepeatMode = "off" | "all" | "one";

const FAV_KEY = "chansonia-favorites";
const VOL_KEY = "chansonia-volume";
const QUEUE_KEY = "chansonia-queue";
const LISTS_KEY = "chansonia-playlists";
const RECENT_KEY = "chansonia-recent";
const PLAYS_KEY = "chansonia-plays";
const RATE_KEY = "chansonia-rate";

/** Các mức tốc độ phát */
export const RATES = [0.75, 1, 1.25, 1.5] as const;
/** Số bài giữ trong mục «Nghe gần đây» */
const RECENT_MAX = 20;

export type Playlist = { id: string; name: string; songs: string[] };

function readJson<T>(key: string, fallback: T): T {
  try {
    const v = JSON.parse(localStorage.getItem(key) ?? "null");
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* không ghi được thì giữ trong phiên này */
  }
}

const knownIds = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((id): id is string => typeof id === "string" && Boolean(SONG_INDEX[id])) : [];

function readPlaylists(): Playlist[] {
  const v = readJson<unknown>(LISTS_KEY, []);
  if (!Array.isArray(v)) return [];
  return v
    .filter((p) => p && typeof p.id === "string" && typeof p.name === "string")
    .map((p) => ({ id: p.id, name: p.name.slice(0, 60), songs: knownIds(p.songs) }));
}

function readPlays(): Record<string, number> {
  const v = readJson<Record<string, unknown>>(PLAYS_KEY, {});
  const out: Record<string, number> = {};
  if (v && typeof v === "object")
    for (const [id, n] of Object.entries(v)) if (SONG_INDEX[id] && Number(n) > 0) out[id] = Math.floor(Number(n));
  return out;
}

function readRate(): number {
  const r = Number(readJson<unknown>(RATE_KEY, 1));
  return (RATES as readonly number[]).includes(r) ? r : 1;
}

function readVolume(): number {
  try {
    const v = Number(localStorage.getItem(VOL_KEY));
    return Number.isFinite(v) && v > 0 && v <= 1 ? v : 1;
  } catch {
    return 1;
  }
}

function readFavorites(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(FAV_KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((id) => typeof id === "string" && SONG_INDEX[id]) : [];
  } catch {
    return [];
  }
}

/** Bài được mở thẳng từ đường link chia sẻ (…?bai=ma-bai) */
function songFromLink(): string | null {
  try {
    const id = new URLSearchParams(location.search).get("bai");
    return id && SONG_INDEX[id] ? id : null;
  } catch {
    return null;
  }
}

/** Đường link chia sẻ một bài: mở app là vào thẳng bài ấy */
export function shareLink(songId: string): string {
  const url = new URL(location.href);
  url.search = "";
  url.hash = "";
  url.searchParams.set("bai", songId);
  return url.toString();
}

/** Các mức hẹn giờ tắt nhạc, tính bằng phút */
export const SLEEP_PRESETS = [5, 15, 30, 45, 60] as const;
export const SLEEP_TIMER_DEFAULT_MINUTES = 30;

/** Nơi lưu bài đang nghe và vị trí, để mở lại app là nghe tiếp được */
const SAVE_KEY = "chansonia-player";

type PlayerState = {
  view: AppView;
  songId: string;
  /** Phiên bản đang nghe của bài (0 = bản chính) */
  versionIndex: number;
  mode: ViewMode;
  playing: boolean;
  /** Đang tải tệp nhạc (mạng chậm) hoặc tệp không tải được */
  status: "idle" | "loading" | "error";
  /** Âm lượng 0–1 và tắt tiếng */
  volume: number;
  muted: boolean;
  /** Hẹn giờ kiểu "hết bài này thì dừng" */
  stopAfterSong: boolean;
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
  repeat: RepeatMode;
  /** Mã các bài được đánh dấu yêu thích, mới nhất trước */
  favorites: string[];
  /** Các bài còn lại trong lượt xáo trộn hiện tại (không lặp lại cho tới khi hết vòng) */
  shuffleBag: string[];
  /** Lịch sử các bài đã phát, dùng để lùi bài khi đang ở chế độ ngẫu nhiên */
  history: string[];

  /** Hàng chờ: các bài người nghe tự xếp, phát trước bài kế trong bộ sưu tập */
  queue: string[];
  /** Playlist người nghe tự tạo */
  playlists: Playlist[];
  /** Nghe gần đây, mới nhất trước */
  recent: string[];
  /** Số lần đã phát mỗi bài */
  plays: Record<string, number>;
  /** Tốc độ phát */
  rate: number;

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
  /** Đổi sang phiên bản khác của bài đang mở, phát lại từ đầu */
  setVersion: (i: number) => Promise<void>;
  setMode: (m: ViewMode) => void;
  setPlayOrder: (order: PlayOrder) => void;
  cycleRepeat: () => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  setStopAfterSong: (on: boolean) => void;
  toggleFavorite: (id: string) => void;
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

  /** Chen bài vào đầu hàng chờ */
  playNext: (id: string) => void;
  /** Thêm bài vào cuối hàng chờ */
  addToQueue: (id: string) => void;
  removeFromQueue: (index: number) => void;
  moveInQueue: (from: number, to: number) => void;
  clearQueue: () => void;
  /** Phát tất cả bài của một bộ sưu tập (theo thứ tự, hoặc ngẫu nhiên nếu đang bật) */
  playCollection: (id: CollectionId) => Promise<void>;
  /** Phát một danh sách: bài đầu phát ngay, các bài sau vào hàng chờ */
  playList: (ids: string[]) => Promise<void>;
  createPlaylist: (name: string) => string;
  renamePlaylist: (id: string, name: string) => void;
  deletePlaylist: (id: string) => void;
  /** Thêm bài vào playlist; trả về false nếu bài đã có sẵn */
  addToPlaylist: (playlistId: string, songId: string) => boolean;
  removeFromPlaylist: (playlistId: string, songId: string) => void;
  clearRecent: () => void;
  setRate: (r: number) => void;
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
function restore(): { songId: string; version: number; ms: number } {
  try {
    const raw = JSON.parse(localStorage.getItem(SAVE_KEY) ?? "null");
    if (raw && typeof raw.songId === "string" && SONG_INDEX[raw.songId]) {
      const count = SONG_INDEX[raw.songId].versions?.length ?? 1;
      const version = Math.min(Math.max(0, Number(raw.version) || 0), count - 1);
      return { songId: raw.songId, version, ms: Math.max(0, Number(raw.ms) || 0) };
    }
  } catch {
    /* localStorage bị chặn hoặc hỏng — bắt đầu từ đầu */
  }
  return { songId: ALL_SONGS[0].id, version: 0, ms: 0 };
}

let lastSaved = 0;
function save(state: { songId: string; versionIndex: number }, ms: number, force = false) {
  const now = Date.now();
  if (!force && now - lastSaved < 2000) return;
  lastSaved = now;
  try {
    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify({ songId: state.songId, version: state.versionIndex, ms: Math.round(ms) }),
    );
  } catch {
    /* không ghi được thì thôi */
  }
}

const linked = songFromLink();
const saved = linked ? { songId: linked, version: 0, ms: 0 } : restore();
if (linked) {
  // Bỏ ?bai=… khỏi thanh địa chỉ để tải lại trang không mở lại bài cũ.
  try {
    const url = new URL(location.href);
    url.searchParams.delete("bai");
    history.replaceState(null, "", url.toString());
  } catch {
    /* bỏ qua */
  }
}
const savedSong = songOf(saved.songId);
const savedVersion = songVersion(savedSong, saved.version);
const savedMs = Math.min(saved.ms, savedVersion.durationMs || saved.ms);

/** Dòng và chữ đang hát — chỉ khi phiên bản này khớp với lời đồng bộ */
function indices(song: Song, version: number, ms: number) {
  const lines = songVersion(song, version).synced ? song.lines : [];
  const lineIndex = findLineIndex(lines, ms);
  const line = lines[lineIndex];
  return { lineIndex, wordIndex: line ? findWordIndex(line, ms) : 0 };
}

export const usePlayer = create<PlayerState>((set, get) => ({
  view: linked ? "player" : "library",
  songId: savedSong.id,
  versionIndex: saved.version,
  mode: "karaoke",
  playing: false,
  status: "idle",
  volume: readVolume(),
  muted: false,
  stopAfterSong: false,
  currentMs: savedMs,
  durationMs: savedVersion.durationMs,
  ...indices(savedSong, saved.version, savedMs),

  collectionId: collectionOf(savedSong.id).id,
  libraryTab: "songs",
  query: "",
  video: null,

  playOrder: "sequential",
  repeat: "off",
  favorites: readFavorites(),
  shuffleBag: [],
  history: [],

  sleepMinutes: SLEEP_TIMER_DEFAULT_MINUTES,
  sleepEndsAt: null,

  queue: knownIds(readJson(QUEUE_KEY, [])),
  playlists: readPlaylists(),
  recent: knownIds(readJson(RECENT_KEY, [])).slice(0, RECENT_MAX),
  plays: readPlays(),
  rate: readRate(),

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
      versionIndex: 0,
      status: "idle",
      playing: false,
      currentMs: 0,
      durationMs: songVersion(song, 0).durationMs,
      lineIndex: 0,
      wordIndex: 0,
      ...(sameCollection ? {} : { shuffleBag: [], history: [] }),
    });
    save(get(), 0, true);
    const recent = [song.id, ...get().recent.filter((x) => x !== song.id)].slice(0, RECENT_MAX);
    const plays = { ...get().plays, [song.id]: (get().plays[song.id] ?? 0) + 1 };
    set({ recent, plays });
    writeJson(RECENT_KEY, recent);
    writeJson(PLAYS_KEY, plays);
    await get().play();
  },

  setVersion: async (i) => {
    const song = songOf(get().songId);
    if (i === get().versionIndex || !song.versions?.[i]) return;
    engine.pause();
    cancelAnimationFrame(raf);
    set({
      versionIndex: i,
      status: "idle",
      playing: false,
      currentMs: 0,
      durationMs: song.versions[i].durationMs,
      lineIndex: 0,
      wordIndex: 0,
    });
    save(get(), 0, true);
    await get().play();
  },

  setMode: (mode) => set({ mode }),

  setVolume: (v) => {
    const volume = Math.min(1, Math.max(0, v));
    engine.setVolume(volume);
    set({ volume, muted: volume === 0 });
    try {
      localStorage.setItem(VOL_KEY, String(volume));
    } catch {
      /* bỏ qua */
    }
  },

  toggleMute: () => {
    const muted = !get().muted;
    engine.setVolume(muted ? 0 : get().volume || 1);
    set({ muted, ...(get().volume === 0 && !muted ? { volume: 1 } : {}) });
  },

  setStopAfterSong: (stopAfterSong) => set({ stopAfterSong }),

  cycleRepeat: () => {
    const order: RepeatMode[] = ["off", "all", "one"];
    set({ repeat: order[(order.indexOf(get().repeat) + 1) % order.length] });
  },

  toggleFavorite: (id) => {
    const has = get().favorites.includes(id);
    const favorites = has ? get().favorites.filter((x) => x !== id) : [id, ...get().favorites];
    set({ favorites });
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
    } catch {
      /* không ghi được thì giữ trong phiên này */
    }
  },

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
    const version = songVersion(song, get().versionIndex);
    const fresh = engine.setTrack(resolveAudio(version.audioSrc));
    // Tệp vừa mở mà đã có vị trí (mở lại app, hoặc tua khi chưa phát) — nhảy tới đó.
    if (fresh && get().currentMs > 0) engine.seek(get().currentMs);
    engine.setVolume(get().muted ? 0 : get().volume);
    engine.setRate(get().rate);
    engine.onStatus((st) => {
      if (st === "error") {
        engine.pause();
        cancelAnimationFrame(raf);
        set({ playing: false, status: "error" });
      } else if (st === "loading") {
        if (get().playing) set({ status: "loading" });
      } else if (get().status !== "error") {
        set({ status: "idle" });
      }
    });
    engine.onEnded(() => {
      set({ playing: false });
      cancelAnimationFrame(raf);
      save(get(), 0, true);
      // Hẹn giờ "hết bài này": dừng hẳn, không sang bài sau.
      if (get().stopAfterSong) {
        set({ stopAfterSong: false });
        get().seek(0);
        return;
      }
      const { repeat, playOrder, songId } = get();
      if (repeat === "one") {
        get().seek(0);
        void get().play();
        return;
      }
      // Không lặp và đang phát lần lượt: hết bài cuối của bộ sưu tập thì dừng.
      const list = siblings(songId);
      if (
        get().queue.length === 0 &&
        repeat === "off" &&
        playOrder === "sequential" &&
        list.indexOf(songId) === list.length - 1
      ) {
        get().seek(0);
        return;
      }
      void get().next();
    });
    // Báo "đang phát" ngay để nút đổi liền tay; nếu không phát được thì lùi lại.
    set({ playing: true, status: "loading" });
    startClock(get);
    const result = await engine.play();
    if (result === "ok" && !engine.isPaused()) {
      set({ status: "idle" });
      return;
    }
    if (result === "ok") return; // người dùng đã tạm dừng trong lúc chờ tải
    cancelAnimationFrame(raf);
    set({ playing: false, status: result === "error" ? "error" : "idle" });
  },

  pause: () => {
    engine.pause();
    set({ playing: false, status: get().status === "loading" ? "idle" : get().status });
    cancelAnimationFrame(raf);
    save(get(), get().currentMs, true);
  },

  toggle: () => {
    if (get().playing) get().pause();
    else void get().play();
  },

  seek: (ms) => {
    const song = songOf(get().songId);
    const version = songVersion(song, get().versionIndex);
    const limit = get().durationMs || version.durationMs || Number.POSITIVE_INFINITY;
    const at = Math.max(0, Math.min(ms, limit));
    engine.setTrack(resolveAudio(version.audioSrc));
    engine.seek(at);
    set({ currentMs: at, ...indices(song, get().versionIndex, at) });
    save(get(), at, true);
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

    // Hàng chờ đi trước: bài người nghe tự xếp phát trước bài kế trong bộ sưu tập.
    const [queued, ...rest] = get().queue;
    if (queued) {
      set({ history, queue: rest });
      writeJson(QUEUE_KEY, rest);
      await get().playSong(queued);
      return;
    }

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
    const v = get().versionIndex;
    const ms = engine.nowMs();
    // Bản có lời đồng bộ thì giữ đúng độ dài ghi trong tệp bài (lời tính theo
    // số đó); bản khác thì tin độ dài thật của tệp nhạc.
    const known = songVersion(song, v).synced ? songVersion(song, v).durationMs : 0;
    const durationMs = known || engine.durationMs() || songVersion(song, v).durationMs || get().durationMs;
    set({ currentMs: ms, durationMs, ...indices(song, v, ms) });
    save(get(), ms);
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

  playNext: (id) => {
    const queue = [id, ...get().queue];
    set({ queue });
    writeJson(QUEUE_KEY, queue);
  },

  addToQueue: (id) => {
    const queue = [...get().queue, id];
    set({ queue });
    writeJson(QUEUE_KEY, queue);
  },

  removeFromQueue: (index) => {
    const queue = get().queue.filter((_, i) => i !== index);
    set({ queue });
    writeJson(QUEUE_KEY, queue);
  },

  moveInQueue: (from, to) => {
    const queue = get().queue.slice();
    if (from < 0 || from >= queue.length || to < 0 || to >= queue.length) return;
    const [x] = queue.splice(from, 1);
    queue.splice(to, 0, x);
    set({ queue });
    writeJson(QUEUE_KEY, queue);
  },

  clearQueue: () => {
    set({ queue: [] });
    writeJson(QUEUE_KEY, []);
  },

  playCollection: async (id) => {
    const list = COLLECTIONS.find((c) => c.id === id)?.songs.map((s) => s.id) ?? [];
    if (!list.length) return;
    const first = get().playOrder === "shuffle" ? list[Math.floor(Math.random() * list.length)] : list[0];
    set({ view: "player", collectionId: id });
    await get().playSong(first);
    // Túi xáo trộn mới cho cả bộ sưu tập, trừ bài vừa phát
    if (get().playOrder === "shuffle") set({ shuffleBag: shuffle(list.filter((x) => x !== first)), history: [] });
  },

  playList: async (ids) => {
    const list = ids.filter((id) => SONG_INDEX[id]);
    if (!list.length) return;
    const [first, ...rest] = list;
    set({ queue: rest, view: "player" });
    writeJson(QUEUE_KEY, rest);
    await get().playSong(first);
  },

  createPlaylist: (name) => {
    const id = `pl-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
    const playlists = [...get().playlists, { id, name: name.trim().slice(0, 60) || "Playlist", songs: [] }];
    set({ playlists });
    writeJson(LISTS_KEY, playlists);
    return id;
  },

  renamePlaylist: (id, name) => {
    const clean = name.trim().slice(0, 60);
    if (!clean) return;
    const playlists = get().playlists.map((p) => (p.id === id ? { ...p, name: clean } : p));
    set({ playlists });
    writeJson(LISTS_KEY, playlists);
  },

  deletePlaylist: (id) => {
    const playlists = get().playlists.filter((p) => p.id !== id);
    set({ playlists });
    writeJson(LISTS_KEY, playlists);
  },

  addToPlaylist: (playlistId, songId) => {
    const pl = get().playlists.find((p) => p.id === playlistId);
    if (!pl || pl.songs.includes(songId)) return false;
    const playlists = get().playlists.map((p) =>
      p.id === playlistId ? { ...p, songs: [...p.songs, songId] } : p,
    );
    set({ playlists });
    writeJson(LISTS_KEY, playlists);
    return true;
  },

  removeFromPlaylist: (playlistId, songId) => {
    const playlists = get().playlists.map((p) =>
      p.id === playlistId ? { ...p, songs: p.songs.filter((x) => x !== songId) } : p,
    );
    set({ playlists });
    writeJson(LISTS_KEY, playlists);
  },

  clearRecent: () => {
    set({ recent: [], plays: {} });
    writeJson(RECENT_KEY, []);
    writeJson(PLAYS_KEY, {});
  },

  setRate: (r) => {
    const rate = (RATES as readonly number[]).includes(r) ? r : 1;
    engine.setRate(rate);
    set({ rate });
    writeJson(RATE_KEY, rate);
  },
}));

export function useSong(): Song {
  const id = usePlayer((s) => s.songId);
  return songOf(id);
}

/**
 * Bài sẽ phát tiếp theo: bài kế trong bộ sưu tập (phát lần lượt), bài đầu
 * túi xáo trộn (ngẫu nhiên), null khi đang lặp một bài hoặc đã là bài cuối
 * mà không lặp.
 */
export function useUpNext(): Song | null {
  const songId = usePlayer((s) => s.songId);
  const playOrder = usePlayer((s) => s.playOrder);
  const repeat = usePlayer((s) => s.repeat);
  const bag = usePlayer((s) => s.shuffleBag);
  const queued = usePlayer((s) => s.queue[0]);
  if (repeat === "one") return null;
  if (queued) return songOf(queued);
  const list = siblings(songId);
  if (playOrder === "shuffle") {
    const id = bag.find((x) => list.includes(x) && x !== songId);
    return id ? songOf(id) : null;
  }
  const i = list.indexOf(songId);
  if (i === list.length - 1 && repeat === "off") return null;
  return songOf(list[(i + 1) % list.length]);
}
