import { Play, Star } from "lucide-react";
import { SONGS, TOTAL_DURATION_MS, formatTime } from "@/lib/catalog";
import { ALBUM } from "@/lib/artist";
import { usePlayer } from "@/lib/player-store";
import { Cover } from "@/components/cover";
import { cn } from "@/lib/utils";

export function LibraryView() {
  const openSong = usePlayer((s) => s.openSong);
  const playSong = usePlayer((s) => s.playSong);
  const songId = usePlayer((s) => s.songId);
  const playing = usePlayer((s) => s.playing);

  return (
    <div className="hero-grain relative min-h-0 flex-1 overflow-y-auto">
      <div className="hero-aurora" aria-hidden>
        <span /><span /><span /><span />
      </div>
      <div className="hero-veil" aria-hidden />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-5 pt-12 pb-28 sm:px-8">
        {/* ── Đầu album ── */}
        <p className="font-sans text-[0.65rem] font-medium tracking-[0.28em] text-fg-muted uppercase">
          {ALBUM.kind} · {ALBUM.chapters} chương
        </p>
        <h1 className="hero-title mt-4 font-display text-[2.5rem] leading-[1.05] font-medium tracking-[-0.03em] sm:text-6xl">
          {ALBUM.title}
        </h1>
        <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-fg-muted">
          {ALBUM.subtitle}
        </p>

        <figure className="mt-8 border-l-2 border-fg/20 pl-5">
          <blockquote className="font-display text-lg leading-snug text-fg/90 italic sm:text-xl">
            “{ALBUM.epigraph.vi}”
          </blockquote>
          <figcaption className="mt-2 font-sans text-xs text-fg-subtle">
            {ALBUM.epigraph.fr}
          </figcaption>
        </figure>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => void playSong(SONGS[0].id)}
            className="inline-flex h-12 items-center gap-2.5 rounded-full bg-fg px-6 font-sans text-sm font-medium text-ink transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_36px_-6px_rgba(255,255,255,0.35)] active:scale-[0.97]"
          >
            <Play className="size-4 fill-current" />
            Phát từ đầu
          </button>
          <p className="font-sans text-xs text-fg-subtle">
            {SONGS.length} bài · {formatTime(TOTAL_DURATION_MS)} · sáng tác{" "}
            {ALBUM.composedFrom}–{ALBUM.composedTo}
          </p>
        </div>

        {/* ── Danh sách bài ── */}
        <ul className="mt-12 flex flex-col gap-1.5">
          {SONGS.map((s) => {
            const active = s.id === songId;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  data-song-id={s.id}
                  onClick={() => openSong(s.id)}
                  onDoubleClick={() => void playSong(s.id)}
                  className={cn(
                    "group flex w-full items-center gap-4 rounded-2xl border p-3 text-left transition-colors duration-150",
                    active
                      ? "border-fg/25 bg-fg/[0.07]"
                      : "border-transparent hover:border-edge hover:bg-fg/[0.04]",
                  )}
                >
                  <Cover accent={s.accent} trackNo={s.trackNo} src={s.coverSrc} alt={s.title} />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-display text-base font-medium text-fg sm:text-lg">
                        {s.title}
                      </p>
                      {s.titleTrack ? (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-fg/10 px-2 py-0.5 font-sans text-[0.6rem] font-medium tracking-wide text-fg-muted uppercase">
                          <Star className="size-2.5 fill-current" />
                          Chủ đề
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 truncate font-sans text-xs text-fg-muted">
                      {s.subtitle}
                    </p>
                    {s.note ? (
                      <p className="mt-1 hidden truncate font-sans text-[0.7rem] text-fg-subtle sm:block">
                        {s.note}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span className="hidden font-sans text-[0.7rem] tracking-wide text-fg-subtle sm:block">
                      {s.language}
                    </span>
                    <span className="font-sans text-xs tabular-nums text-fg-muted">
                      {formatTime(s.durationMs)}
                    </span>
                    <span
                      className={cn(
                        "flex size-9 items-center justify-center rounded-full transition-all duration-150",
                        active && playing
                          ? "bg-fg text-ink"
                          : "bg-fg/10 text-fg opacity-0 group-hover:opacity-100",
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        void playSong(s.id);
                      }}
                    >
                      <Play className="size-3.5 fill-current" />
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        {/* ── Mô-típ xuyên suốt ── */}
        <section className="mt-14">
          <h2 className="font-sans text-[0.65rem] font-medium tracking-[0.24em] text-fg-muted uppercase">
            Mô-típ xuyên suốt · le fil rouge
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {ALBUM.motifs.map((m) => (
              <span
                key={m.label}
                className="inline-flex items-center gap-2 rounded-full border border-edge px-3 py-1.5 font-sans text-xs text-fg-muted"
              >
                <span aria-hidden>{m.icon}</span>
                {m.label}
                <span className="text-fg-subtle">· {m.fr}</span>
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
