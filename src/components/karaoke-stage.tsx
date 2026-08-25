import { useEffect, useRef } from "react";
import { Play } from "lucide-react";
import { usePlayer, useSong } from "@/lib/player-store";
import { Cover } from "@/components/cover";
import { ARTIST } from "@/lib/artist";
import { cn } from "@/lib/utils";

function formatDuration(ms: number): string {
  const total = Math.round(ms / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

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
    <div className="relative flex min-h-[28rem] flex-1 flex-col overflow-hidden">
      {!started ? (
        <div className="hero-grain relative flex flex-1 flex-col items-center justify-center overflow-hidden px-5 py-10 sm:px-8">
          <div className="hero-aurora" aria-hidden>
            <span /><span /><span /><span />
          </div>
          <div className="hero-veil" aria-hidden />

          <div className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center">
            <Cover accent={song.accent} trackNo={song.trackNo} size="lg" />

            <p className="mt-6 font-sans text-[0.65rem] font-medium tracking-[0.28em] text-fg-muted uppercase">
              {ARTIST.name} · {song.language}
            </p>

            <h1 className="hero-title mt-4 font-display text-[2.5rem] leading-[1.04] font-medium tracking-[-0.03em] sm:text-6xl">
              {song.title}
            </h1>

            <p className="mt-4 max-w-xl font-sans text-base leading-relaxed text-fg-muted sm:text-lg">
              {song.subtitle}
            </p>

            <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row">
              <button
                type="button"
                onClick={() => void play()}
                className="inline-flex h-13 items-center gap-2.5 rounded-full bg-fg px-7 py-3.5 font-sans text-base font-medium text-ink transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_40px_-6px_rgba(255,255,255,0.35)] active:scale-[0.97]"
              >
                <Play className="size-4 fill-current" />
                Phát bài hát
              </button>
              <p className="font-sans text-xs tracking-wide text-fg-subtle">
                {sections.length} phần · {formatDuration(song.durationMs)}
              </p>
            </div>

            {song.note ? (
              <p className="mt-8 max-w-md font-sans text-xs leading-relaxed text-fg-subtle">
                {song.note}
              </p>
            ) : null}
          </div>
        </div>
      ) : (
        <div
          ref={scroller}
          className="lyric-stage min-h-0 flex-1 overflow-y-auto px-4 py-16 sm:px-8"
        >
          <div className="mx-auto flex max-w-3xl flex-col gap-6 sm:gap-8">
            {!vocalOn ? (
              <p className="text-center font-sans text-xs font-medium tracking-[0.2em] text-coral-bright uppercase">
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
                    <p className="mb-1 font-sans text-xs italic text-fg-muted">{line.cue}</p>
                  ) : null}
                  {showLabel && sec ? (
                    <p className="mb-3 font-sans text-xs font-medium tracking-[0.18em] text-fg-subtle uppercase">
                      {sec.label}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => seek(line.startMs)}
                    className={cn(
                      "w-full text-left font-display transition-[color,opacity,transform] duration-300 ease-out",
                      line.role === "title"
                        ? "text-2xl font-medium sm:text-3xl"
                        : "text-lg sm:text-2xl",
                      line.role === "whisper" && "italic",
                      active && "text-fg",
                      past && "text-fg-subtle",
                      !active && !past && dist <= 2 && "text-fg-muted",
                      !active && !past && dist > 2 && "text-fg-subtle",
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
                            on && "text-coral-bright",
                            sung && "text-fg",
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
            <div className="h-32" />
          </div>
        </div>
      )}
    </div>
  );
}
