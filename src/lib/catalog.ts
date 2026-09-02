/**
 * Danh mục bài hát — biên dịch dữ liệu thô thành cấu trúc có mốc thời gian
 * cho từng dòng và từng chữ, phục vụ hiển thị lời đồng bộ (karaoke).
 *
 * THÊM BÀI MỚI: xem hướng dẫn tại src/songs/README.md
 */

import { song as s01 } from "@/songs/01-je-voudrais-te-parler";
import { song as s02 } from "@/songs/02-la-lampe-brule-encore";
import { song as s03 } from "@/songs/03-the-lamp-still-burns";
import { song as s04 } from "@/songs/04-26-nam-sau";
import { song as s05 } from "@/songs/05-a-fathers-song";
import { song as s06 } from "@/songs/06-je-mappelle-huong";

/* ── Kiểu dữ liệu thô (do người viết nhập tay) ───────────────────────── */

export type RawLine = string | { text: string; role?: LineRole; cue?: string };

export type RawSection = {
  id: string;
  label: string;
  /** Mốc bắt đầu của phần này trong bản thu, tính bằng mili-giây */
  startMs: number;
  /** Mốc kết thúc — bỏ trống thì lấy startMs của phần kế tiếp */
  endMs?: number;
  lines: RawLine[];
};

export type RawSong = {
  id: string;
  trackNo: number;
  title: string;
  subtitle: string;
  language: string;
  /** Ghi chú ngắn về chủ đề/cảm xúc, hiện ở màn hình danh sách */
  note?: string;
  /** Màu chủ đạo của bài, dùng cho ảnh bìa và điểm nhấn giao diện */
  accent: string;
  /** Ảnh bìa riêng của bài (tuỳ chọn) — không có thì dùng ảnh gradient sinh từ accent */
  coverSrc?: string;
  /** Đánh dấu bài hát chủ đề của album */
  titleTrack?: boolean;
  audioSrc: string;
  durationMs: number;
  sections: RawSection[];
};

/* ── Kiểu đã biên dịch (ứng dụng dùng) ───────────────────────────────── */

export type LineRole = "title" | "whisper" | "normal";
export type ViewMode = "karaoke" | "sheet";
export type AppView = "library" | "player" | "artist";

export type LyricWord = { text: string; startMs: number; endMs: number };

export type LyricLine = {
  id: string;
  sectionId: string;
  role?: LineRole;
  cue?: string;
  startMs: number;
  endMs: number;
  words: LyricWord[];
};

export type Section = { id: string; label: string; startMs: number };
export type Note = { id: string; pitch: number; startMs: number; durationMs: number };

export type Song = Omit<RawSong, "sections"> & {
  lines: LyricLine[];
  sections: Section[];
  notes: Note[];
  vocalStartMs: number;
};

/* ── Biên dịch ───────────────────────────────────────────────────────── */

const lineText = (l: RawLine) => (typeof l === "string" ? l : l.text);
const lineRole = (l: RawLine) => (typeof l === "string" ? undefined : l.role);
const lineCue = (l: RawLine) => (typeof l === "string" ? undefined : l.cue);

function splitWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

function compile(raw: RawSong): Song {
  const lines: LyricLine[] = [];
  const sections: Section[] = [];
  const notes: Note[] = [];
  const motif = [4, 6, 7, 9, 7, 6, 4, 2];
  let idx = 0;

  for (let si = 0; si < raw.sections.length; si++) {
    const sec = raw.sections[si];
    const start = sec.startMs;
    const end =
      sec.endMs ?? raw.sections[si + 1]?.startMs ?? Math.max(start + 1000, raw.durationMs);
    const span = Math.max(1000, end - start);

    sections.push({ id: sec.id, label: sec.label, startMs: start });

    // chia thời lượng của phần theo độ dài từng dòng
    const weights = sec.lines.map((l) => {
      const text = lineText(l);
      return Math.max(1, lineRole(l) === "title" ? text.length * 0.8 : text.length);
    });
    const total = weights.reduce((a, b) => a + b, 0) || 1;

    let cursor = start;
    for (let li = 0; li < sec.lines.length; li++) {
      const item = sec.lines[li];
      const text = lineText(item);
      const remaining = end - cursor;
      const rest = sec.lines.length - li - 1;
      const dur =
        li === sec.lines.length - 1
          ? Math.max(700, remaining)
          : Math.min(
              (weights[li] / total) * span,
              Math.max(700, remaining - rest * 700),
            );

      const raws = splitWords(text);
      const per = dur / Math.max(1, raws.length);
      const words: LyricWord[] = raws.map((w, i) => ({
        text: w,
        startMs: cursor + i * per,
        endMs: cursor + (i + 1) * per,
      }));

      lines.push({
        id: `L${idx}`,
        sectionId: sec.id,
        role: lineRole(item),
        cue: lineCue(item),
        startMs: cursor,
        endMs: cursor + dur,
        words,
      });

      words.forEach((w, i) =>
        notes.push({
          id: `N${idx}-${i}`,
          pitch: motif[i % motif.length],
          startMs: w.startMs,
          durationMs: Math.max(160, w.endMs - w.startMs - 30),
        }),
      );

      cursor += dur;
      idx += 1;
    }
  }

  const { sections: _drop, ...meta } = raw;
  return { ...meta, lines, sections, notes, vocalStartMs: raw.sections[0]?.startMs ?? 0 };
}

/* ── Danh mục ────────────────────────────────────────────────────────── */

const RAW: RawSong[] = [s01, s02, s03, s04, s05, s06];

export const SONGS: Song[] = RAW.slice()
  .sort((a, b) => a.trackNo - b.trackNo)
  .map(compile);

export const SONG_BY_ID: Record<string, Song> = Object.fromEntries(
  SONGS.map((s) => [s.id, s]),
);

export const TOTAL_DURATION_MS = SONGS.reduce((a, s) => a + s.durationMs, 0);

/* ── Tra cứu theo thời gian phát ─────────────────────────────────────── */

export function findLineIndex(lines: LyricLine[], ms: number): number {
  if (!lines.length) return 0;
  if (ms < lines[0].startMs) return 0;
  for (let i = lines.length - 1; i >= 0; i--) if (ms >= lines[i].startMs) return i;
  return 0;
}

export function findWordIndex(line: LyricLine, ms: number): number {
  if (!line.words.length) return 0;
  for (let i = line.words.length - 1; i >= 0; i--) if (ms >= line.words[i].startMs) return i;
  return 0;
}

export function formatTime(ms: number): string {
  const t = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
}
