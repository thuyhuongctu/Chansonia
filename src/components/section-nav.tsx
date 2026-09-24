import { usePlayer, useSong } from "@/lib/player-store";
import { cn } from "@/lib/utils";

/** Dải phần bài hát — viên thuốc bo tròn, phần đang hát tô màu đất nung. */
export function SectionNav() {
  const song = useSong();
  const currentMs = usePlayer((s) => s.currentMs);
  const seekSection = usePlayer((s) => s.seekSection);

  return (
    <nav
      className="flex shrink-0 gap-2 overflow-x-auto border-b border-line bg-paper px-4 py-2 sm:px-6"
      aria-label="Phần bài hát"
    >
      {song.sections.map((sec) => {
        const active =
          currentMs >= sec.startMs &&
          (song.sections.find((s) => s.startMs > sec.startMs)?.startMs ??
            song.durationMs) > currentMs;
        return (
          <button
            key={sec.id}
            type="button"
            onClick={() => seekSection(sec.id)}
            className={cn(
              "press h-9 shrink-0 rounded-full border px-3.5 font-sans text-xs font-medium",
              active
                ? "border-accent bg-accent text-white"
                : "border-line bg-surface text-muted hover:text-ink",
            )}
          >
            {sec.label}
          </button>
        );
      })}
    </nav>
  );
}
