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
export function SleepTimerButton({ paper }: { paper: boolean }) {
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
          "flex size-11 items-center justify-center rounded-clay-sm transition-all active:scale-95",
          active
            ? paper
              ? "bg-paper-2 text-coral shadow-clay-paper-inset"
              : "bg-ink-3 text-coral shadow-clay-inset"
            : paper
              ? "bg-paper text-ink-muted shadow-clay-paper-sm hover:text-ink-fg"
              : "bg-ink text-fg-muted shadow-clay-sm hover:text-fg",
        )}
      >
        <Moon className={cn("size-4", active && "fill-current")} />
      </button>

      {open ? (
        <div
          className={cn(
            "absolute bottom-full right-0 z-30 mb-2 w-64 rounded-clay p-4",
            paper ? "bg-paper shadow-clay-paper" : "bg-ink-2 shadow-clay",
          )}
        >
          <p
            className={cn(
              "font-sans text-xs font-medium",
              paper ? "text-ink-fg" : "text-fg",
            )}
          >
            Hẹn giờ tắt nhạc
          </p>

          {active ? (
            <>
              <p
                className={cn(
                  "mt-2 font-sans text-2xl tabular-nums",
                  paper ? "text-ink-fg" : "text-fg",
                )}
              >
                {formatRemaining(remainingMs)}
              </p>
              <button
                type="button"
                onClick={cancelSleepTimer}
                className={cn(
                  "mt-3 w-full rounded-clay-sm bg-coral px-3 py-2 font-sans text-sm font-medium text-white transition-all active:scale-[0.98]",
                  paper ? "shadow-clay-paper-sm" : "shadow-clay-sm",
                )}
              >
                Huỷ hẹn giờ
              </button>
            </>
          ) : (
            <>
              <div className="mt-3 flex items-center justify-between">
                <span
                  className={cn(
                    "font-sans text-xs",
                    paper ? "text-ink-muted" : "text-fg-muted",
                  )}
                >
                  {SLEEP_TIMER_MIN_MINUTES} phút
                </span>
                <span
                  className={cn(
                    "font-sans text-sm font-medium tabular-nums",
                    paper ? "text-ink-fg" : "text-fg",
                  )}
                >
                  {sleepMinutes} phút
                </span>
                <span
                  className={cn(
                    "font-sans text-xs",
                    paper ? "text-ink-muted" : "text-fg-muted",
                  )}
                >
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
                className="mt-2 w-full accent-coral"
                aria-label="Số phút hẹn giờ"
              />
              <button
                type="button"
                onClick={startSleepTimer}
                className={cn(
                  "mt-3 w-full rounded-clay-sm px-3 py-2 font-sans text-sm font-medium transition-all active:scale-[0.98]",
                  paper ? "bg-ink-fg text-paper shadow-clay-paper-sm" : "bg-fg text-ink shadow-clay-sm",
                )}
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
