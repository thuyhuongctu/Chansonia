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
            <Flag id={p.id} />
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

/**
 * Cờ vẽ bằng SVG (tỉ lệ 3:2) thay vì emoji: emoji cờ không hiện trên
 * Windows, chỉ ra hai chữ cái.
 */
function Flag({ id }: { id: "vn" | "fr" }) {
  return (
    <svg
      viewBox="0 0 30 20"
      width="27"
      height="18"
      role="img"
      aria-label={id === "vn" ? "Cờ Việt Nam" : "Cờ Pháp"}
      data-flag={id}
      className="shrink-0 overflow-hidden rounded-[3px] shadow-[0_0_0_1px_rgba(0,0,0,0.12)]"
    >
      {id === "vn" ? (
        <>
          <rect width="30" height="20" fill="#DA251D" />
          <polygon points="15.00,4.00 16.35,8.15 20.71,8.15 17.18,10.71 18.53,14.85 15.00,12.29 11.47,14.85 12.82,10.71 9.29,8.15 13.65,8.15" fill="#FFFF00" />
        </>
      ) : (
        <>
          <rect width="10" height="20" fill="#0055A4" />
          <rect x="10" width="10" height="20" fill="#FFFFFF" />
          <rect x="20" width="10" height="20" fill="#EF4135" />
        </>
      )}
    </svg>
  );
}
