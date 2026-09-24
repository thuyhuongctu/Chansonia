import { useEffect, useRef } from "react";
import { Play } from "lucide-react";
import { usePlayer, useSong } from "@/lib/player-store";
import { Cover } from "@/components/cover";
import { PictureStrip } from "@/components/picture-strip";
import { ARTIST } from "@/lib/artist";
import { PAGE_COVER } from "@/lib/art";
import { cn } from "@/lib/utils";

function formatDuration(ms: number): string {
  const total = Math.round(ms / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

/**
 * Màn hình bài hát. Khi chưa phát: một thẻ bài hát đầy đủ như trên trang
 * songbook — ảnh bìa, dòng Style, câu ký tên, ảnh đất sét minh hoạ. Khi đang
 * phát: lời chạy theo nhạc, chữ đang hát tô màu đất nung.
 */
export function KaraokeStage() {
  const song = useSong();
  const lineIndex = usePlayer((s) => s.lineIndex);
  const wordIndex = usePlayer((s) => s.wordIndex);
  const playing = usePlayer((s) => s.playing);
  const currentMs = usePlayer((s) => s.currentMs);
  const play = usePlayer((s) => s.play);
  const seek = usePlayer((s) => s.seek);
  const scroller = useRef<HTMLDivElement>(null);
  const started = playing || currentMs > 80;
  const lines = song.lines;
  const sections = song.sections;
  const vocalOn = currentMs >= (lines[0]?.startMs ?? 0);

  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const el = root.querySelector<HTMLElement>(`[data-line="${lineIndex}"]`);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({
      block: "center",
      behavior: reduce ? "auto" : "smooth",
    });
  }, [lineIndex, song.id]);

  return (
    <div className="relative flex min-h-[28rem] flex-1 flex-col overflow-hidden bg-paper">
      {!started ? (
        <div className="relative min-h-0 flex-1 overflow-y-auto">
          <div
            className="pagewash"
            aria-hidden
            style={{ backgroundImage: `url(${PAGE_COVER.src})` }}
          />

          <div className="relative z-10 mx-auto w-full max-w-3xl px-5 py-8 sm:px-8">
            <article className="song-card">
              <div className="grid grid-cols-1 items-center gap-5 p-5 sm:grid-cols-[130px_1fr] sm:p-6">
                <Cover
                  accent={song.accent}
                  trackNo={song.trackNo}
                  src={song.coverSrc}
                  alt={song.title}
                  size="md"
                  className="mx-auto sm:mx-0"
                />

                <div className="text-center sm:text-left">
                  <p className="font-sans text-[0.66rem] font-bold tracking-[0.2em] text-accent uppercase">
                    Track {String(song.trackNo).padStart(2, "0")} · {ARTIST.name}
                  </p>
                  <h1 className="mt-1.5 font-display text-[clamp(1.5rem,5vw,2rem)] leading-tight font-bold text-ink">
                    {song.title}
                  </h1>
                  <p className="mt-1 font-sans text-sm text-muted">{song.subtitle}</p>
                  <p className="mt-2 font-sans text-xs text-subtle">
                    {song.language} · {sections.length} phần ·{" "}
                    {formatDuration(song.durationMs)}
                  </p>
                </div>
              </div>

              {song.style ? (
                <div className="border-t border-line px-5 py-4 sm:px-6">
                  <p className="font-sans text-xs leading-relaxed text-muted">
                    <span className="font-semibold text-ink">Style:</span> {song.style}
                  </p>
                  {song.signature ? (
                    <p className="signature mt-3 font-display text-base leading-snug text-ink">
                      {song.signature}
                    </p>
                  ) : null}
                </div>
              ) : null}

              <div className="flex flex-wrap items-center gap-3 border-t border-line px-5 py-4 sm:px-6">
                <button
                  type="button"
                  onClick={() => void play()}
                  className="inline-flex h-12 items-center gap-2.5 rounded-full bg-accent px-6 font-sans text-base font-semibold text-white shadow-song transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  <Play className="size-4 fill-current" />
                  Phát bài hát
                </button>
                {song.note ? (
                  <p className="font-sans text-xs text-muted">{song.note}</p>
                ) : null}
              </div>

              {song.pictures?.length ? (
                <div className="border-t border-line px-5 py-5 sm:px-6">
                  <PictureStrip pictures={song.pictures} />
                </div>
              ) : null}
            </article>
          </div>
        </div>
      ) : (
        <div
          ref={scroller}
          className="lyric-stage min-h-0 flex-1 overflow-y-auto px-4 py-14 sm:px-8"
        >
          <div className="mx-auto flex max-w-2xl flex-col gap-5 sm:gap-7">
            {!vocalOn ? (
              <p className="text-center font-sans text-xs font-bold tracking-[0.2em] text-accent uppercase">
                Dạo nhạc
              </p>
            ) : null}
            {lines.map((line, i) => {
              const dist = i - lineIndex;
              const active = i === lineIndex && vocalOn;
              const past = i < lineIndex;
              const sec = sections.find((s) => s.id === line.sectionId);
              const showLabel =
                i === 0 || lines[i - 1]?.sectionId !== line.sectionId;
              return (
                <div key={line.id} data-line={i} className="scroll-mt-24">
                  {line.cue ? (
                    <p className="mb-1 font-sans text-xs text-muted italic">{line.cue}</p>
                  ) : null}
                  {showLabel && sec ? (
                    <p className="mt-4 mb-3 font-sans text-xs font-bold tracking-[0.18em] text-accent uppercase">
                      {sec.label}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => seek(line.startMs)}
                    className={cn(
                      "w-full text-left font-display transition-[color,opacity] duration-300 ease-out",
                      line.role === "title"
                        ? "text-2xl font-semibold sm:text-3xl"
                        : "text-lg sm:text-2xl",
                      line.role === "whisper" && "italic",
                      active && "text-ink",
                      past && "text-subtle",
                      !active && !past && dist <= 2 && "text-muted",
                      !active && !past && dist > 2 && "text-subtle",
                    )}
                  >
                    {line.words.map((w, wi) => {
                      const on = active && wi === wordIndex && started;
                      const sung = active && wi < wordIndex && started;
                      return (
                        <span
                          key={`${line.id}-w${wi}`}
                          className={cn(
                            "mr-[0.28em] inline-block transition-colors duration-150",
                            on && "text-accent",
                            sung && "text-ink",
                          )}
                        >
                          {w.text}
                        </span>
                      );
                    })}
                  </button>
                </div>
              );
            })}

            {song.pictures?.length ? (
              <PictureStrip pictures={song.pictures} className="mt-8" />
            ) : null}
            <div className="h-24" />
          </div>
        </div>
      )}
    </div>
  );
}
