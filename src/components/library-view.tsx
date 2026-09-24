import { Play, Star } from "lucide-react";
import { SONGS, TOTAL_DURATION_MS, formatTime } from "@/lib/catalog";
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
import { cn } from "@/lib/utils";

/**
 * Trang album — dựng theo đúng mạch của trang songbook trên web: tiêu đề trang
 * kèm gạch màu, ảnh bìa lớn, thẻ giới thiệu album với ảnh Hương AI và các
 * mô-típ, rồi từng bài hát là một thẻ giấy có ảnh bìa, dòng Style và câu ký tên.
 */
export function LibraryView() {
  const openSong = usePlayer((s) => s.openSong);
  const playSong = usePlayer((s) => s.playSong);
  const songId = usePlayer((s) => s.songId);
  const playing = usePlayer((s) => s.playing);

  return (
    <div className="relative min-h-0 flex-1 overflow-y-auto bg-paper">
      <div
        className="pagewash"
        aria-hidden
        style={{ backgroundImage: `url(${PAGE_COVER.src})` }}
      />

      <div className="relative z-10 mx-auto w-full max-w-3xl px-5 pt-10 pb-32 sm:px-8">
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
        <figure className="mt-6">
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

          <div className="song-card mt-4">
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
                className="inline-flex h-11 items-center gap-2.5 rounded-full bg-accent px-5 font-sans text-sm font-semibold text-white shadow-song transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <Play className="size-4 fill-current" />
                Phát từ đầu
              </button>
              <p className="font-sans text-xs text-muted">
                {SONGS.length} bài · {formatTime(TOTAL_DURATION_MS)} · sáng tác{" "}
                {ALBUM.composedFrom}–{ALBUM.composedTo}
              </p>
            </div>
          </div>
        </section>

        {/* ── Danh sách bài hát ── */}
        <section className="mt-10">
          <SectionHead title="Các bài hát · Les chansons" />

          <ul className="mt-4 flex flex-col gap-4">
            {SONGS.map((s) => {
              const active = s.id === songId;
              return (
                <li key={s.id}>
                  <article
                    className={cn(
                      "song-card song-card-hover",
                      active && "border-accent",
                    )}
                  >
                    <button
                      type="button"
                      data-song-id={s.id}
                      onClick={() => openSong(s.id)}
                      onDoubleClick={() => void playSong(s.id)}
                      className="grid w-full grid-cols-1 items-center gap-4 p-5 text-left sm:grid-cols-[104px_1fr] sm:gap-5"
                    >
                      <Cover
                        accent={s.accent}
                        trackNo={s.trackNo}
                        src={s.coverSrc}
                        alt={s.title}
                        size="md"
                        className="mx-auto sm:mx-0 sm:size-[104px]"
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

                        {s.signature ? (
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
                          "inline-flex h-9 items-center gap-2 rounded-full px-4 font-sans text-xs font-semibold transition-colors",
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
        </section>

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
  );
}
