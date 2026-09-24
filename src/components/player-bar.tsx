import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Pause, Play, Shuffle, SkipBack, SkipForward } from "lucide-react";
import { usePlayer, useSong } from "@/lib/player-store";
import { SleepTimerButton } from "@/components/sleep-timer";
import { Cover } from "@/components/cover";
import { cn, formatTime } from "@/lib/utils";

/**
 * Thanh điều khiển — nút tròn màu đất nung trên nền giấy, viền mảnh.
 * Thanh tiến độ kéo được bằng ngón tay hoặc chuột; kéo tới đâu số giờ đổi
 * tới đó, buông tay mới thực sự nhảy tới chỗ ấy.
 */
export function PlayerBar() {
  const song = useSong();
  const playing = usePlayer((s) => s.playing);
  const playOrder = usePlayer((s) => s.playOrder);
  const setPlayOrder = usePlayer((s) => s.setPlayOrder);
  const view = usePlayer((s) => s.view);
  const setView = usePlayer((s) => s.setView);
  const play = usePlayer((s) => s.play);
  const pause = usePlayer((s) => s.pause);
  const next = usePlayer((s) => s.next);
  const prev = usePlayer((s) => s.prev);
  const shuffling = playOrder === "shuffle";
  const barRef = useRef<HTMLDivElement>(null);

  // Ghi chiều cao thật của thanh phát vào --player-h để những thứ nổi phía
  // trên nó (biểu tượng Hương AI) luôn nằm đúng bên trên, không bị che.
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const set = () =>
      document.documentElement.style.setProperty(
        "--player-h",
        `${Math.round(el.getBoundingClientRect().height)}px`,
      );
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={barRef}
      className="pb-safe sticky bottom-0 z-20 flex shrink-0 flex-col border-t border-line bg-surface/95 backdrop-blur-md"
    >
      <Scrubber />

      <div className="flex items-center gap-2 px-4 pb-3 sm:gap-3 sm:px-6">
        <button
          type="button"
          onClick={() => setView("player")}
          disabled={view === "player"}
          aria-label={`Mở màn hình bài ${song.title}`}
          className="press flex min-w-0 items-center gap-2.5 rounded-xl text-left disabled:cursor-default"
        >
          <Cover
            accent={song.accent}
            trackNo={song.trackNo}
            src={song.coverSrc}
            alt=""
            size="sm"
          />
          <span className="hidden min-w-0 sm:block">
            <span className="block truncate font-display text-sm font-semibold text-ink">
              {song.title}
            </span>
            <span className="block truncate font-sans text-xs text-muted">
              {song.subtitle}
            </span>
          </span>
        </button>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <IconButton
            label={
              shuffling
                ? "Đang phát ngẫu nhiên — chuyển sang phát theo thứ tự"
                : "Đang phát theo thứ tự — chuyển sang phát ngẫu nhiên"
            }
            onClick={() => setPlayOrder(shuffling ? "sequential" : "shuffle")}
            pressed={shuffling}
            className="hidden sm:flex"
          >
            <Shuffle className="size-4" />
          </IconButton>

          <IconButton label="Về đầu bài, hoặc bài trước nếu vừa mới phát" onClick={() => void prev()}>
            <SkipBack className="size-4 fill-current" />
          </IconButton>

          <button
            type="button"
            onClick={() => (playing ? pause() : void play())}
            className="press press-lg flex size-13 items-center justify-center rounded-full bg-accent text-white shadow-song"
            aria-label={playing ? "Tạm dừng" : "Phát"}
          >
            {playing ? (
              <Pause className="size-5 fill-current" />
            ) : (
              <Play className="size-5 translate-x-px fill-current" />
            )}
          </button>

          <IconButton label="Bài sau" onClick={() => void next()}>
            <SkipForward className="size-4 fill-current" />
          </IconButton>

          <SleepTimerButton />
        </div>
      </div>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  pressed,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  pressed?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      className={cn(
        "press flex size-11 items-center justify-center rounded-full border",
        pressed
          ? "border-accent bg-accent-soft text-accent"
          : "border-line bg-paper text-muted hover:text-ink",
        className,
      )}
    >
      {children}
    </button>
  );
}

/** Thanh tiến độ — kéo được, có nút tròn hiện ra khi rê chuột hoặc khi kéo. */
function Scrubber() {
  const song = useSong();
  const currentMs = usePlayer((s) => s.currentMs);
  const seek = usePlayer((s) => s.seek);
  const railRef = useRef<HTMLDivElement>(null);
  const [dragMs, setDragMs] = useState<number | null>(null);
  const dragging = dragMs !== null;

  const shownMs = dragMs ?? currentMs;
  const ratio = song.durationMs > 0 ? shownMs / song.durationMs : 0;
  const pct = Math.min(100, Math.max(0, ratio * 100));

  const msAtPointer = useCallback(
    (clientX: number) => {
      const rail = railRef.current;
      if (!rail) return 0;
      const rect = rail.getBoundingClientRect();
      const r = (clientX - rect.left) / rect.width;
      return Math.min(song.durationMs, Math.max(0, r * song.durationMs));
    },
    [song.durationMs],
  );

  // Kéo tiếp tục cả khi ngón tay ra ngoài thanh, và buông ở bất kỳ đâu cũng nhận.
  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => setDragMs(msAtPointer(e.clientX));
    const onUp = (e: PointerEvent) => {
      seek(msAtPointer(e.clientX));
      setDragMs(null);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragging, msAtPointer, seek]);

  const nudge = (deltaMs: number) =>
    seek(Math.min(song.durationMs, Math.max(0, currentMs + deltaMs)));

  return (
    <div className="px-4 pt-2.5 sm:px-6">
      <div
        className="scrub"
        data-dragging={dragging}
        onPointerDown={(e) => {
          e.preventDefault();
          setDragMs(msAtPointer(e.clientX));
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") nudge(5000);
          else if (e.key === "ArrowLeft") nudge(-5000);
          else if (e.key === "Home") seek(0);
          else if (e.key === "End") seek(song.durationMs);
          else return;
          e.preventDefault();
        }}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={Math.round(song.durationMs / 1000)}
        aria-valuenow={Math.round(shownMs / 1000)}
        aria-valuetext={`${formatTime(shownMs)} trên ${formatTime(song.durationMs)}`}
        aria-label="Tiến độ bài hát"
        tabIndex={0}
      >
        <div ref={railRef} className="scrub-track">
          <div
            className={cn("scrub-fill", !dragging && "transition-[width] duration-100")}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="scrub-thumb" style={{ left: `${pct}%` }} aria-hidden />
      </div>

      <div className="mt-1 flex justify-between font-sans text-[0.68rem] tabular-nums text-subtle">
        <span>{formatTime(shownMs)}</span>
        <span>{formatTime(song.durationMs)}</span>
      </div>
    </div>
  );
}
