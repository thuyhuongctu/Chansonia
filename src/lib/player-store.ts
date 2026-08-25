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

type PlayerState = {
  view: AppView;
  songId: string;
  mode: ViewMode;
  playing: boolean;
  currentMs: number;
  lineIndex: number;
  wordIndex: number;

  setView: (v: AppView) => void;
  openSong: (id: string) => void;
  playSong: (id: string) => Promise<void>;
  setMode: (m: ViewMode) => void;
  play: () => Promise<void>;
  pause: () => void;
  toggle: () => void;
  seek: (ms: number) => void;
  seekSection: (sectionId: string) => void;
  next: () => Promise<void>;
  prev: () => Promise<void>;
  tick: () => void;
};

let raf = 0;

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
    const i = SONGS.findIndex((s) => s.id === get().songId);
    await get().playSong(SONGS[(i + 1) % SONGS.length].id);
  },

  prev: async () => {
    // trong 3 giây đầu thì lùi bài, sau đó về đầu bài hiện tại
    if (get().currentMs > 3000) return get().seek(0);
    const i = SONGS.findIndex((s) => s.id === get().songId);
    await get().playSong(SONGS[(i - 1 + SONGS.length) % SONGS.length].id);
  },

  tick: () => {
    const song = SONG_BY_ID[get().songId];
    const ms = engine.nowMs();
    const lineIndex = findLineIndex(song.lines, ms);
    const line = song.lines[lineIndex];
    set({ currentMs: ms, lineIndex, wordIndex: line ? findWordIndex(line, ms) : 0 });
  },
}));

export function useSong(): Song {
  const id = usePlayer((s) => s.songId);
  return SONG_BY_ID[id] ?? SONGS[0];
}
