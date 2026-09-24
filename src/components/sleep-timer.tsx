import { useEffect, useRef, useState } from "react";
import { Moon } from "lucide-react";
import {
  usePlayer,
  SLEEP_TIMER_MIN_MINUTES,
  SLEEP_TIMER_MAX_MINUTES,
} from "@/lib/player-store";
import { cn } from "@/lib/utils";

function formatRemaining(ms: number): string {
  const totalSec = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Nút hẹn giờ tắt nhạc — chọn 5–60 phút, tự tạm dừng khi hết giờ */
export function SleepTimerButton() {
  const [open, setOpen] = useState(false);
  const sleepMinutes = usePlayer((s) => s.sleepMinutes);
  const sleepEndsAt = usePlayer((s) => s.sleepEndsAt);
  const setSleepMinutes = usePlayer((s) => s.setSleepMinutes);
  const startSleepTimer = usePlayer((s) => s.startSleepTimer);
  const cancelSleepTimer = usePlayer((s) => s.cancelSleepTimer);

  const active = sleepEndsAt != null;

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [active]);

  const remainingMs = active ? sleepEndsAt - now : 0;

  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Hẹn giờ tắt nhạc"
        aria-expanded={open}
        className={cn(
          "flex size-11 items-center justify-center rounded-full border transition-colors active:scale-95",
          active
            ? "border-accent bg-accent-soft text-accent"
            : "border-line bg-paper text-muted hover:text-ink",
        )}
      >
        <Moon className={cn("size-4", active && "fill-current")} />
      </button>

      {open ? (
        <div className="absolute right-0 bottom-full z-30 mb-2 w-64 rounded-[16px] border border-line bg-surface p-4 shadow-song">
          <p className="font-sans text-xs font-semibold text-ink">Hẹn giờ tắt nhạc</p>

          {active ? (
            <>
              <p className="mt-2 font-display text-2xl tabular-nums text-ink">
                {formatRemaining(remainingMs)}
              </p>
              <button
                type="button"
                onClick={cancelSleepTimer}
                className="mt-3 w-full rounded-full bg-accent px-3 py-2 font-sans text-sm font-semibold text-white transition-transform active:scale-[0.98]"
              >
                Huỷ hẹn giờ
              </button>
            </>
          ) : (
            <>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-sans text-xs text-muted">
                  {SLEEP_TIMER_MIN_MINUTES} phút
                </span>
                <span className="font-sans text-sm font-semibold tabular-nums text-ink">
                  {sleepMinutes} phút
                </span>
                <span className="font-sans text-xs text-muted">
                  {SLEEP_TIMER_MAX_MINUTES} phút
                </span>
              </div>
              <input
                type="range"
                min={SLEEP_TIMER_MIN_MINUTES}
                max={SLEEP_TIMER_MAX_MINUTES}
                step={5}
                value={sleepMinutes}
                onChange={(e) => setSleepMinutes(Number(e.target.value))}
                className="mt-2 w-full accent-[var(--accent)]"
                aria-label="Số phút hẹn giờ"
              />
              <button
                type="button"
                onClick={startSleepTimer}
                className="mt-3 w-full rounded-full border border-line bg-paper px-3 py-2 font-sans text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent active:scale-[0.98]"
              >
                Bắt đầu
              </button>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
