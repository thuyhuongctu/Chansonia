import { useSong, usePlayer } from "@/lib/player-store";

const STAFF_H = 72;
const NOTE_R = 5;

export function ScrollingStaff() {
  const song = useSong();
  const currentMs = usePlayer((s) => s.currentMs);
  const notes = song.notes;
  const windowMs = 8000;
  const visible = notes.filter(
    (n) => n.startMs > currentMs - 500 && n.startMs < currentMs + windowMs,
  );

  return (
    <div className="relative h-[88px] shrink-0 overflow-hidden border-b border-edge bg-ink-2 px-4">
      <svg
        viewBox={`0 0 800 ${STAFF_H + 16}`}
        className="h-full w-full"
        preserveAspectRatio="none"
        aria-hidden
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1="40"
            x2="800"
            y1={12 + i * 12}
            y2={12 + i * 12}
            stroke="var(--color-staff)"
            strokeWidth="1"
          />
        ))}
        {/* Treble clef hint */}
        <text
          x="8"
          y="48"
          fill="var(--color-coral-bright)"
          fontSize="28"
          fontFamily="serif"
          opacity="0.7"
        >
          𝄞
        </text>
        {/* Playhead */}
        <line
          className="staff-playhead"
          x1="120"
          x2="120"
          y1="4"
          y2={STAFF_H + 12}
          stroke="var(--color-coral)"
          strokeWidth="2"
          opacity="0.85"
        />
        {visible.map((n) => {
          const x = 120 + ((n.startMs - currentMs) / windowMs) * 680;
          const y = 60 - n.pitch * 6;
          const active = currentMs >= n.startMs && currentMs < n.startMs + n.durationMs;
          return (
            <ellipse
              key={n.id}
              className="staff-note"
              cx={x}
              cy={y}
              rx={NOTE_R + 1}
              ry={NOTE_R}
              fill={active ? "var(--color-coral-bright)" : "var(--color-fg-muted)"}
              opacity={active ? 1 : 0.55}
            />
          );
        })}
      </svg>
    </div>
  );
}

export function MiniStaff({
  startMs,
  endMs,
  paper,
}: {
  startMs: number;
  endMs: number;
  paper?: boolean;
}) {
  const song = useSong();
  const notes = song.notes.filter((n) => n.startMs >= startMs && n.startMs < endMs);
  const span = Math.max(1, endMs - startMs);

  return (
    <svg
      viewBox="0 0 320 48"
      className="mb-3 h-10 w-full max-w-md"
      aria-hidden
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1="0"
          x2="320"
          y1={6 + i * 8}
          y2={6 + i * 8}
          stroke={paper ? "var(--color-edge-paper)" : "var(--color-staff)"}
          strokeWidth="1"
        />
      ))}
      {notes.slice(0, 16).map((n) => {
        const x = ((n.startMs - startMs) / span) * 300 + 10;
        const y = 38 - n.pitch * 4;
        return (
          <ellipse
            key={n.id}
            cx={x}
            cy={y}
            rx="4"
            ry="3.2"
            fill={paper ? "var(--color-ink-fg)" : "var(--color-coral)"}
          />
        );
      })}
    </svg>
  );
}
