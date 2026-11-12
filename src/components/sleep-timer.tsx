import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Moon } from "lucide-react";
import { usePlayer, SLEEP_PRESETS } from "@/lib/player-store";
import { cn, formatTime } from "@/lib/utils";
import { useT } from "@/lib/i18n";

/** Thời gian còn lại của hẹn giờ tắt nhạc (ms), null khi chưa hẹn. Cập nhật mỗi giây. */
export function useSleepRemaining(): number | null {
  const endsAt = usePlayer((s) => s.sleepEndsAt);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (endsAt == null) return;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [endsAt]);
  return endsAt == null ? null : Math.max(0, endsAt - now);
}

/**
 * Nút hẹn giờ tắt nhạc — tròn 44px, không bao giờ đổi bề rộng. Đang hẹn thì
 * nền nhạt, viền và biểu tượng màu đất nung. Bấm vào mở tấm chọn giờ từ dưới
 * lên.
 */
export function SleepTimerButton() {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const active = usePlayer((s) => s.sleepEndsAt != null || s.stopAfterSong);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("Hẹn giờ tắt nhạc")}
        aria-haspopup="dialog"
        aria-expanded={open}
        data-active={active || undefined}
        className={cn(
          "press flex size-11 shrink-0 items-center justify-center rounded-full border",
          active
            ? "border-accent bg-accent-soft text-accent"
            : "border-line bg-paper text-muted hover:text-ink",
        )}
      >
        <Moon className={cn("size-4", active && "fill-current")} />
      </button>
      {open ? createPortal(<SleepSheet onClose={() => setOpen(false)} />, document.body) : null}
    </>
  );
}

/** Tấm chọn giờ trượt lên từ cạnh dưới: 5 / 15 / 30 / 45 / 60 phút */
function SleepSheet({ onClose }: { onClose: () => void }) {
  const { t } = useT();
  const sleepMinutes = usePlayer((s) => s.sleepMinutes);
  const setSleepMinutes = usePlayer((s) => s.setSleepMinutes);
  const startSleepTimer = usePlayer((s) => s.startSleepTimer);
  const cancelSleepTimer = usePlayer((s) => s.cancelSleepTimer);
  const stopAfterSong = usePlayer((s) => s.stopAfterSong);
  const setStopAfterSong = usePlayer((s) => s.setStopAfterSong);
  const remaining = useSleepRemaining();
  const active = remaining != null;
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    sheetRef.current?.querySelector<HTMLElement>("button[aria-pressed='true'], button")?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center">
      <div className="sheet-scrim absolute inset-0" onClick={onClose} aria-hidden />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sleep-title"
        className="sheet pb-safe-sheet relative w-full max-w-md rounded-t-3xl bg-surface px-5 pt-2.5 shadow-lift"
      >
        <div className="mx-auto mb-3.5 h-1 w-10 rounded-full bg-line" aria-hidden />
        <h2 id="sleep-title" className="font-display text-[19px] font-semibold text-ink">
          {t("Hẹn giờ tắt nhạc")}
        </h2>
        <p className="mt-0.5 font-sans text-[13px] text-muted">
          {active
            ? t("Nhạc sẽ tạm dừng sau {t}.", { t: formatTime(remaining) })
            : t("Nhạc sẽ tạm dừng khi hết giờ.")}
        </p>

        <div className="mt-4 grid grid-cols-5 gap-2" role="group" aria-label={t("Số phút")}>
          {SLEEP_PRESETS.map((n) => {
            const on = n === sleepMinutes;
            return (
              <button
                key={n}
                type="button"
                aria-pressed={on}
                aria-label={t("{n} phút", { n })}
                onClick={() => setSleepMinutes(n)}
                className={cn(
                  "press h-12 rounded-xl border font-sans text-[15px] font-semibold tabular-nums",
                  on ? "border-accent bg-accent text-on-accent" : "border-line bg-paper text-ink",
                )}
              >
                {n}
              </button>
            );
          })}
        </div>
        <p className="mt-1.5 text-center font-sans text-[11px] text-subtle">{t("phút")}</p>

        <button
          type="button"
          aria-pressed={stopAfterSong}
          onClick={() => setStopAfterSong(!stopAfterSong)}
          className={cn(
            "press mt-3 flex h-12 w-full items-center justify-between rounded-xl border px-4 font-sans text-sm",
            stopAfterSong ? "border-accent bg-accent-soft text-accent" : "border-line bg-paper text-ink",
          )}
        >
          <span className="font-semibold">{t("Dừng khi hết bài này")}</span>
          <span
            aria-hidden
            className={cn(
              "relative h-6 w-10 rounded-full transition-colors",
              stopAfterSong ? "bg-accent" : "bg-line",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 size-5 rounded-full bg-surface shadow-song transition-[left]",
                stopAfterSong ? "left-[18px]" : "left-0.5",
              )}
            />
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (active) cancelSleepTimer();
            else startSleepTimer();
            onClose();
          }}
          className="press mt-3.5 h-12 w-full rounded-full bg-accent font-sans text-[15px] font-semibold text-on-accent"
        >
          {active ? t("Huỷ hẹn giờ") : t("Hẹn {n} phút", { n: sleepMinutes })}
        </button>
      </div>
    </div>
  );
}
