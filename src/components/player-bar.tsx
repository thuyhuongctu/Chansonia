import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  LoaderCircle,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import { collectionOf } from "@/lib/library";
import { usePlayer, useSong } from "@/lib/player-store";
import { SleepTimerButton, useSleepRemaining } from "@/components/sleep-timer";
import { cn, formatTime } from "@/lib/utils";
import { useT } from "@/lib/i18n";

/**
 * Thanh phát — luôn nằm ở đáy mọi màn hình.
 *
 * Điện thoại: thanh tiến độ ở trên; dưới là [ảnh + tên bài + giờ] (bấm vào để
 * mở màn hình lời) · Lùi · Phát/Dừng · Tới · Hẹn giờ.
 * Máy tính: ba cột 300 / phần giữa / 300 — bài đang nghe, thanh tiến độ kèm
 * giờ hai bên, rồi các nút điều khiển.
 */
export function PlayerBar() {
  const song = useSong();
  const playing = usePlayer((s) => s.playing);
  const currentMs = usePlayer((s) => s.currentMs);
  const durationMs = usePlayer((s) => s.durationMs);
  const view = usePlayer((s) => s.view);
  const setView = usePlayer((s) => s.setView);
  const play = usePlayer((s) => s.play);
  const pause = usePlayer((s) => s.pause);
  const next = usePlayer((s) => s.next);
  const prev = usePlayer((s) => s.prev);
  const playOrder = usePlayer((s) => s.playOrder);
  const setPlayOrder = usePlayer((s) => s.setPlayOrder);
  const repeat = usePlayer((s) => s.repeat);
  const cycleRepeat = usePlayer((s) => s.cycleRepeat);
  const sleepLeft = useSleepRemaining();
  const { t } = useT();
  const barRef = useRef<HTMLDivElement>(null);

  // Ghi chiều cao thật của thanh phát vào --player-h, cho những thứ cần nằm
  // ngay phía trên nó.
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

  const timeText =
    `${formatTime(currentMs)} / ${durationMs ? formatTime(durationMs) : "–:––"}` +
    (sleepLeft != null ? ` · ${t("hẹn giờ {t}", { t: formatTime(sleepLeft) })}` : "");
  const shuffling = playOrder === "shuffle";
  const status = usePlayer((s) => s.status);
  const stopAfterSong = usePlayer((s) => s.stopAfterSong);
  const errorText = t("Không tải được bài này. Kiểm tra mạng rồi bấm phát lại");

  return (
    <div
      ref={barRef}
      className="pb-safe-bar relative z-20 shrink-0 border-t border-line bg-surface px-4 pt-1.5 lg:px-6 lg:pt-2.5"
      data-player-bar
    >
      {status === "error" ? (
        <p
          role="alert"
          data-audio-error
          className="absolute inset-x-0 bottom-full border-t border-accent/30 bg-accent-soft px-4 py-2 text-center font-sans text-xs font-medium text-accent"
        >
          {errorText}
        </p>
      ) : null}
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 [grid-template-areas:'scrub_scrub'_'info_ctrl'] lg:grid-cols-[280px_minmax(0,1fr)_470px] lg:gap-x-6 lg:[grid-template-areas:'info_scrub_ctrl']">
        <div className="[grid-area:scrub]">
          <Scrubber />
        </div>

        <button
          type="button"
          onClick={() => setView("player")}
          disabled={view === "player"}
          aria-label={t("Mở lời bài {t}", { t: song.title })}
          className="press mt-0.5 flex min-w-0 items-center gap-2.5 text-left [grid-area:info] disabled:cursor-default lg:mt-0"
        >
          <span className="size-11 shrink-0 overflow-hidden rounded-[10px] border border-line bg-sunk">
            {song.coverSrc ? (
              <img src={song.coverSrc} alt="" className="size-full object-cover object-[50%_15%]" />
            ) : null}
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-sm leading-tight font-semibold text-ink" data-now-title>
              {song.title}
            </span>
            <span className="block truncate font-sans text-[11px] text-subtle tabular-nums lg:hidden" data-time>
              {timeText}
              {stopAfterSong ? ` · ${t("dừng sau bài này")}` : ""}
            </span>
            <span className="hidden truncate font-sans text-[11px] text-subtle lg:block">
              {collectionOf(song.id).name}
              {sleepLeft != null ? ` · ${t("hẹn giờ {t}", { t: formatTime(sleepLeft) })}` : ""}
            </span>
          </span>
        </button>

        <div className="mt-0.5 flex items-center gap-2 [grid-area:ctrl] lg:mt-0 lg:justify-end">
          <IconButton
            label={t("Phát ngẫu nhiên")}
            onClick={() => setPlayOrder(shuffling ? "sequential" : "shuffle")}
            pressed={shuffling}
            className="hidden lg:flex"
          >
            <Shuffle className="size-4" />
          </IconButton>

          <IconButton
            label={t(repeat === "one" ? "Lặp lại một bài" : repeat === "all" ? "Lặp lại cả danh sách" : "Không lặp lại")}
            onClick={cycleRepeat}
            pressed={repeat !== "off"}
            className="hidden lg:flex"
          >
            {repeat === "one" ? <Repeat1 className="size-4" /> : <Repeat className="size-4" />}
          </IconButton>

          <IconButton label={t("Bài trước")} onClick={() => void prev()}>
            <SkipBack className="size-4 fill-current" />
          </IconButton>

          <button
            type="button"
            onClick={() => (playing ? pause() : void play())}
            className="press press-lg flex size-13 shrink-0 items-center justify-center rounded-full bg-accent text-on-accent shadow-song"
            aria-label={playing ? t("Tạm dừng") : t("Phát")}
          >
            {playing && status === "loading" ? (
              <LoaderCircle className="size-5 animate-spin" aria-hidden data-loading />
            ) : playing ? (
              <Pause className="size-5 fill-current" />
            ) : (
              <Play className="size-5 translate-x-px fill-current" />
            )}
          </button>

          <IconButton label={t("Bài sau")} onClick={() => void next()}>
            <SkipForward className="size-4 fill-current" />
          </IconButton>

          <VolumeControl />
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
      title={label}
      aria-pressed={pressed}
      className={cn(
        "press flex size-11 shrink-0 items-center justify-center rounded-full border",
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

/**
 * Thanh tiến độ — kéo bằng ngón tay hoặc chuột; kéo tới đâu số giờ đổi tới
 * đó, buông tay mới thực sự nhảy tới chỗ ấy. Dùng được cả bàn phím.
 */
function Scrubber() {
  const { t } = useT();
  const durationMs = usePlayer((s) => s.durationMs);
  const currentMs = usePlayer((s) => s.currentMs);
  const seek = usePlayer((s) => s.seek);
  const railRef = useRef<HTMLDivElement>(null);
  const [dragMs, setDragMs] = useState<number | null>(null);
  const dragging = dragMs !== null;

  const shownMs = dragMs ?? currentMs;
  const ratio = durationMs > 0 ? shownMs / durationMs : 0;
  const pct = Math.min(100, Math.max(0, ratio * 100));

  const msAtPointer = useCallback(
    (clientX: number) => {
      const rail = railRef.current;
      if (!rail || !durationMs) return 0;
      const rect = rail.getBoundingClientRect();
      const r = (clientX - rect.left) / rect.width;
      return Math.min(durationMs, Math.max(0, r * durationMs));
    },
    [durationMs],
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
    seek(Math.min(durationMs || Infinity, Math.max(0, currentMs + deltaMs)));

  return (
    <div className="flex items-center gap-3">
      <span className="hidden w-10 text-right font-sans text-[11px] text-subtle tabular-nums lg:block">
        {formatTime(shownMs)}
      </span>
      <div
        className="scrub flex-1"
        data-dragging={dragging}
        onPointerDown={(e) => {
          e.preventDefault();
          setDragMs(msAtPointer(e.clientX));
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") nudge(5000);
          else if (e.key === "ArrowLeft") nudge(-5000);
          else if (e.key === "Home") seek(0);
          else if (e.key === "End") seek(durationMs);
          else return;
          e.preventDefault();
        }}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={Math.round(durationMs / 1000)}
        aria-valuenow={Math.round(shownMs / 1000)}
        aria-valuetext={t("{a} trên {b}", { a: formatTime(shownMs), b: formatTime(durationMs) })}
        aria-label={t("Tiến độ bài hát")}
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
      <span className="hidden w-10 font-sans text-[11px] text-subtle tabular-nums lg:block">
        {durationMs ? formatTime(durationMs) : "–:––"}
      </span>
    </div>
  );
}

/** Âm lượng (chỉ trên máy tính — điện thoại dùng nút âm lượng của máy) */
function VolumeControl() {
  const { t } = useT();
  const volume = usePlayer((s) => s.volume);
  const muted = usePlayer((s) => s.muted);
  const setVolume = usePlayer((s) => s.setVolume);
  const toggleMute = usePlayer((s) => s.toggleMute);
  const level = muted ? 0 : volume;
  const Icon = level === 0 ? VolumeX : level < 0.5 ? Volume1 : Volume2;
  return (
    <div className="group hidden items-center gap-1 lg:flex">
      <IconButton label={muted ? t("Bật tiếng (M)") : t("Tắt tiếng (M)")} onClick={toggleMute} pressed={muted}>
        <Icon className="size-4" />
      </IconButton>
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={level}
        onChange={(e) => setVolume(Number(e.target.value))}
        aria-label={t("Âm lượng")}
        className="volume w-20 accent-[var(--accent)]"
      />
    </div>
  );
}
