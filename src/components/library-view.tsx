import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Play, Search, Shuffle, Star, X } from "lucide-react";
import { SONGS, TOTAL_DURATION_MS, formatTime } from "@/lib/catalog";
import type { Song } from "@/lib/catalog";
import { ALBUM, ARTIST } from "@/lib/artist";
import {
  ALBUM_PORTRAIT,
  MOTIF_PICTURE,
  OUTSIDE_PICTURES,
  PAGE_COVER,
  DEDICATION,
} from "@/lib/art";
import { usePlayer } from "@/lib/player-store";
import { Cover } from "@/components/cover";
import { PictureStrip } from "@/components/picture-strip";
import { SectionHead } from "@/components/section-head";
import { cn, normalizeVi } from "@/lib/utils";

/** Bộ lọc theo ngôn ngữ — khớp theo một phần chuỗi ngôn ngữ của bài hát. */
const FILTERS = [
  { id: "all", label: "Tất cả" },
  { id: "Việt", label: "Tiếng Việt" },
  { id: "Pháp", label: "Tiếng Pháp" },
  { id: "Anh", label: "Tiếng Anh" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

/** Gộp sẵn phần chữ có thể tìm kiếm của mỗi bài, kể cả toàn bộ lời hát. */
const SEARCH_INDEX: Record<string, string> = Object.fromEntries(
  SONGS.map((s) => [
    s.id,
    normalizeVi(
      [
        s.title,
        s.subtitle,
        s.language,
        s.style ?? "",
        s.signature ?? "",
        s.note ?? "",
        s.lines.map((l) => l.words.map((w) => w.text).join(" ")).join("\n"),
      ].join("\n"),
    ),
  ]),
);

/** Dòng lời đầu tiên khớp với từ khoá — để hiện ngay trong thẻ bài hát. */
function matchingLyric(song: Song, needle: string): string | null {
  if (!needle) return null;
  for (const line of song.lines) {
    const text = line.words.map((w) => w.text).join(" ");
    if (normalizeVi(text).includes(needle)) return text;
  }
  return null;
}

/**
 * Trang album — dựng theo đúng mạch của trang songbook trên web: tiêu đề trang
 * kèm gạch màu, ảnh bìa lớn, thẻ giới thiệu album với ảnh Hương AI và các
 * mô-típ, rồi từng bài hát là một thẻ giấy có ảnh bìa, dòng Style và câu ký tên.
 */
export function LibraryView() {
  const openSong = usePlayer((s) => s.openSong);
  const playSong = usePlayer((s) => s.playSong);
  const setPlayOrder = usePlayer((s) => s.setPlayOrder);
  const songId = usePlayer((s) => s.songId);
  const playing = usePlayer((s) => s.playing);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");

  const needle = normalizeVi(query.trim());

  const shown = useMemo(
    () =>
      SONGS.filter((s) => {
        if (filter !== "all" && !s.language.includes(filter)) return false;
        if (!needle) return true;
        return SEARCH_INDEX[s.id]?.includes(needle);
      }),
    [needle, filter],
  );

  const filtering = needle !== "" || filter !== "all";

  const playRandom = () => {
    const pick = SONGS[Math.floor(Math.random() * SONGS.length)];
    setPlayOrder("shuffle");
    void playSong(pick.id);
  };

  return (
    <div className="view-enter relative min-h-0 flex-1 overflow-y-auto bg-paper">
      <div
        className="pagewash"
        aria-hidden
        style={{ backgroundImage: `url(${PAGE_COVER.src})` }}
      />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 pt-10 pb-32 sm:px-8">
        <div className="mx-auto w-full max-w-3xl">
          {/* ── Đầu trang ── */}
          <header className="text-center">
            <p className="font-sans text-[0.7rem] font-bold tracking-[0.22em] text-accent uppercase">
              Kho nhạc cá nhân · Personal music
            </p>
            <h1 className="mt-2 font-display text-[clamp(1.8rem,6vw,2.6rem)] leading-tight font-semibold text-ink">
              {ALBUM.title}
            </h1>
            <p className="mt-2 font-sans text-sm text-muted">{ALBUM.recordingsNote}</p>
            <span className="title-rule" aria-hidden />
          </header>

          {/* ── Ảnh chủ đề của trang ── */}
          <figure className="rise-in mt-6">
            <img
              src={PAGE_COVER.src}
              alt={PAGE_COVER.alt}
              className="block w-full rounded-[18px] border border-line shadow-song"
            />
            <figcaption className="mt-2 px-1 font-sans text-xs leading-relaxed text-muted">
              {PAGE_COVER.caption}
            </figcaption>
          </figure>

          {/* ── Thẻ giới thiệu album ── */}
          <section className="mt-9">
            <SectionHead title={`Album «${ARTIST.name}»`} />

            <div className="song-card rise-in mt-4" style={{ "--i": 1 } as CSSProperties}>
              <div className="grid grid-cols-1 items-center gap-5 p-5 sm:grid-cols-[130px_1fr] sm:p-6">
                <img
                  src={ALBUM_PORTRAIT.src}
                  alt={ALBUM_PORTRAIT.alt}
                  className="mx-auto size-[130px] rounded-xl border border-line object-cover object-[50%_8%] shadow-song sm:mx-0"
                />
                <div className="text-center sm:text-left">
                  <p className="font-display text-xl font-bold text-ink">{ALBUM.title}</p>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-muted">
                    {ALBUM.blurb.vi}
                  </p>
                  <p className="mt-1 font-sans text-xs leading-relaxed text-subtle italic">
                    {ALBUM.blurb.en}
                  </p>
                </div>
              </div>

              <div className="border-t border-line px-5 py-4 sm:px-6">
                <p className="font-display text-base leading-snug text-ink italic">
                  {ALBUM.epigraph.vi}
                </p>
                <p className="mt-1 font-sans text-xs text-muted italic">
                  {ALBUM.epigraph.fr}
                </p>
                <p className="mt-3 font-sans text-xs text-accent">
                  Signature: «Je m'appelle Hương.»
                </p>
              </div>

              <div className="border-t border-line px-5 py-4 sm:px-6">
                <p className="font-sans text-[0.68rem] font-bold tracking-[0.18em] text-muted uppercase">
                  Mô-típ xuyên suốt · le fil rouge
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ALBUM.motifs.map((m) => (
                    <span
                      key={m.label}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1 font-sans text-xs text-muted"
                    >
                      <span aria-hidden>{m.icon}</span>
                      {m.label}
                      <span className="text-subtle">· {m.fr}</span>
                    </span>
                  ))}
                </div>
                <PictureStrip pictures={[MOTIF_PICTURE]} className="mt-4" />
              </div>

              <div className="flex flex-wrap items-center gap-3 border-t border-line px-5 py-4 sm:px-6">
                <button
                  type="button"
                  onClick={() => void playSong(SONGS[0].id)}
                  className="press inline-flex h-11 items-center gap-2.5 rounded-full bg-accent px-5 font-sans text-sm font-semibold text-white shadow-song"
                >
                  <Play className="size-4 fill-current" />
                  Phát từ đầu
                </button>
                <button
                  type="button"
                  onClick={playRandom}
                  className="press inline-flex h-11 items-center gap-2 rounded-full border border-line bg-paper px-5 font-sans text-sm font-semibold text-ink hover:border-accent hover:text-accent"
                >
                  <Shuffle className="size-4" />
                  Ngẫu nhiên
                </button>
                <p className="font-sans text-xs text-muted">
                  {SONGS.length} bài · {formatTime(TOTAL_DURATION_MS)} · sáng tác{" "}
                  {ALBUM.composedFrom}–{ALBUM.composedTo}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* ── Danh sách bài hát ── */}
        <section className="mt-10">
          <div className="mx-auto w-full max-w-3xl">
            <SectionHead title="Các bài hát · Les chansons" />
          </div>

          {/* Tìm kiếm và lọc — dính lại khi cuộn để luôn trong tầm tay */}
          {/* Khung giữa tự cuộn bên trong (xem App.tsx), mà nó đã bắt đầu
              ngay dưới thanh đầu trang, nên dính vào đỉnh khung là vừa. */}
          <div className="sticky top-0 z-10 -mx-5 mt-4 bg-paper/92 px-5 py-3 backdrop-blur-md sm:-mx-8 sm:px-8">
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-subtle"
                  aria-hidden
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm theo tên bài hoặc lời hát…"
                  aria-label="Tìm bài hát"
                  className="h-11 w-full rounded-full border border-line bg-surface pr-10 pl-10 font-sans text-sm text-ink shadow-song outline-none transition-colors placeholder:text-subtle focus:border-accent"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Xoá từ khoá"
                    className="press absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:text-ink"
                  >
                    <X className="size-4" />
                  </button>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-2">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilter(f.id)}
                    aria-pressed={filter === f.id}
                    className={cn(
                      "press h-9 rounded-full border px-3.5 font-sans text-xs font-medium",
                      filter === f.id
                        ? "border-accent bg-accent text-white"
                        : "border-line bg-surface text-muted hover:text-ink",
                    )}
                  >
                    {f.label}
                  </button>
                ))}
                {filtering ? (
                  <span className="ml-auto self-center font-sans text-xs text-muted">
                    {shown.length}/{SONGS.length} bài
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {shown.length === 0 ? (
            <div className="song-card mx-auto mt-4 max-w-3xl px-5 py-10 text-center">
              <p className="font-display text-lg text-ink">Không có bài nào khớp</p>
              <p className="mt-2 font-sans text-sm text-muted">
                Thử từ khoá khác, hoặc bỏ bộ lọc ngôn ngữ.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                }}
                className="press mt-4 inline-flex h-10 items-center rounded-full border border-line bg-paper px-4 font-sans text-sm font-semibold text-ink hover:border-accent hover:text-accent"
              >
                Xem lại tất cả
              </button>
            </div>
          ) : (
            <ul className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {shown.map((s, idx) => {
                const active = s.id === songId;
                const lyric = matchingLyric(s, needle);
                return (
                  <li
                    key={s.id}
                    className="rise-in"
                    style={{ "--i": idx } as CSSProperties}
                  >
                    <article
                      className={cn(
                        "song-card song-card-hover flex h-full flex-col",
                        active && "border-accent",
                      )}
                    >
                      <button
                        type="button"
                        data-song-id={s.id}
                        onClick={() => openSong(s.id)}
                        onDoubleClick={() => void playSong(s.id)}
                        className="grid w-full flex-1 grid-cols-[104px_1fr] items-start gap-4 p-5 text-left sm:grid-cols-[130px_1fr] sm:gap-5"
                      >
                        <Cover
                          accent={s.accent}
                          trackNo={s.trackNo}
                          src={s.coverSrc}
                          alt={s.title}
                          size="md"
                        />

                        <div className="min-w-0">
                          <p className="font-sans text-[0.66rem] font-bold tracking-[0.18em] text-accent uppercase">
                            Track {String(s.trackNo).padStart(2, "0")}
                            {s.titleTrack ? " · bài chủ đề" : ""}
                          </p>

                          <div className="mt-1 flex flex-wrap items-baseline gap-2">
                            <h3 className="font-display text-xl leading-snug font-bold text-ink">
                              {s.title}
                            </h3>
                            {s.titleTrack ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 font-sans text-[0.6rem] font-bold tracking-wide text-accent uppercase">
                                <Star className="size-2.5 fill-current" />
                                Main track
                              </span>
                            ) : null}
                          </div>

                          <p className="mt-0.5 font-sans text-sm text-muted">{s.subtitle}</p>

                          <p className="mt-2 font-sans text-xs leading-relaxed text-muted">
                            <span className="font-semibold text-ink">Style:</span> {s.style}
                          </p>

                          {lyric ? (
                            <p className="mt-3 rounded-lg bg-accent-soft/60 px-3 py-2 font-display text-sm leading-snug text-ink italic">
                              …{lyric}…
                            </p>
                          ) : s.signature ? (
                            <p className="signature mt-3 font-display text-sm leading-snug text-ink">
                              {s.signature}
                            </p>
                          ) : null}

                          <p className="mt-3 font-sans text-xs text-subtle">
                            {s.language} · {formatTime(s.durationMs)} · {s.sections.length} phần
                          </p>
                        </div>
                      </button>

                      <div className="flex items-center gap-3 border-t border-line px-5 py-3">
                        <button
                          type="button"
                          onClick={() => void playSong(s.id)}
                          className={cn(
                            "press inline-flex h-9 items-center gap-2 rounded-full px-4 font-sans text-xs font-semibold",
                            active && playing
                              ? "bg-accent text-white"
                              : "border border-line bg-paper text-ink hover:border-accent hover:text-accent",
                          )}
                        >
                          <Play className="size-3 fill-current" />
                          {active && playing ? "Đang phát" : "Nghe bài này"}
                        </button>
                        <button
                          type="button"
                          onClick={() => openSong(s.id)}
                          className="font-sans text-xs text-muted underline-offset-4 hover:text-accent hover:underline"
                        >
                          Xem lời
                        </button>
                        {s.note ? (
                          <span className="ml-auto hidden font-sans text-xs text-subtle sm:block">
                            {s.note}
                          </span>
                        ) : null}
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <div className="mx-auto w-full max-w-3xl">
          {/* ── Ngoài album ── */}
          <section className="mt-10">
            <SectionHead title="Ngoài album · Outside the album" />
            <div className="song-card mt-4 p-5 sm:p-6">
              <p className="font-sans text-sm leading-relaxed text-muted">
                Thế giới hình ảnh đi cùng songbook: bìa «Mekong Sunfire · Rise With The
                River», những khung hình đất sét của «Je m'appelle Hương and the World».
              </p>
              <PictureStrip pictures={OUTSIDE_PICTURES} className="mt-4" />
            </div>
          </section>

          {/* ── Lời đề tặng ── */}
          <section className="mt-8 rounded-[16px] border border-line bg-accent-soft/60 px-5 py-4">
            <p className="font-display text-base text-ink">
              <span aria-hidden className="mr-2">
                {DEDICATION.icon}
              </span>
              {DEDICATION.quote}
            </p>
            <p className="mt-2 font-sans text-xs leading-relaxed text-muted">
              {DEDICATION.vi}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
