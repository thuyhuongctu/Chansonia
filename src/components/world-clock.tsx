import { useEffect, useState } from "react";

/**
 * Đồng hồ hai nơi: giờ và ngày ở Việt Nam (Asia/Ho_Chi_Minh) và ở Pháp
 * (Europe/Paris). Pháp tự đổi giờ mùa hè / mùa đông theo trình duyệt.
 */
const PLACES = [
  { id: "vn", label: "Việt Nam", zone: "Asia/Ho_Chi_Minh", locale: "vi-VN" },
  { id: "fr", label: "Pháp", zone: "Europe/Paris", locale: "fr-FR" },
] as const;

function useNow(stepMs = 1000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), stepMs);
    return () => clearInterval(id);
  }, [stepMs]);
  return now;
}

/** Chênh lệch giờ giữa Việt Nam và Pháp lúc này (5 giờ mùa hè, 6 giờ mùa đông) */
function offsetHours(now: Date): number {
  const hourIn = (zone: string) => {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: zone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(now);
    const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
    return Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"));
  };
  return Math.round((hourIn("Asia/Ho_Chi_Minh") - hourIn("Europe/Paris")) / 3_600_000);
}

export function WorldClock() {
  const now = useNow();
  const diff = offsetHours(now);

  return (
    <div className="flex gap-1.5" role="group" aria-label={`Giờ Việt Nam và Pháp (lệch ${diff} giờ)`}>
      {PLACES.map((p) => {
        const time = new Intl.DateTimeFormat("vi-VN", {
          timeZone: p.zone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hourCycle: "h23",
        }).format(now);
        const date = new Intl.DateTimeFormat(p.locale, {
          timeZone: p.zone,
          weekday: "short",
          day: "2-digit",
          month: "2-digit",
        }).format(now);
        const year = new Intl.DateTimeFormat(p.locale, { timeZone: p.zone, year: "numeric" }).format(now);
        return (
          <div
            key={p.id}
            data-clock={p.id}
            className="clock-card flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-line bg-surface/80 px-2.5 py-1.5 backdrop-blur-sm"
          >
            <span className="font-sans text-[10px] font-bold tracking-[0.14em] text-accent-2 uppercase">
              {p.id}
            </span>
            <span className="min-w-0">
              <span className="block font-display text-[15px] leading-tight font-semibold text-ink tabular-nums">
                <time dateTime={now.toISOString()}>{time}</time>
              </span>
              <span className="block truncate font-sans text-[10.5px] leading-tight text-muted">
                {p.label} · {date}
                <span className="hidden sm:inline">/{year}</span>
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
