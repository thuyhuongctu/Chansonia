import { Pause, Play, SkipBack } from "lucide-react";
import { usePlayer, useSong } from "@/lib/player-store";
import { cn, formatTime } from "@/lib/utils";

export function PlayerBar({ paper }: { paper: boolean }) {
  const song = useSong();
  const playing = usePlayer((s) => s.playing);
  const currentMs = usePlayer((s) => s.currentMs);
  const play = usePlayer((s) => s.play);
  const pause = usePlayer((s) => s.pause);
  const seek = usePlayer((s) => s.seek);
  const progress = song.durationMs > 0 ? currentMs / song.durationMs : 0;

  return (
    <div
      className={cn(
        "sticky bottom-0 z-20 flex shrink-0 flex-col border-t",
        paper ? "border-edge-paper bg-paper" : "border-edge bg-ink",
      )}
    >
      <div className="px-4 pt-2 sm:px-6">
        <div
          className={cn(
            "relative h-1.5 cursor-pointer overflow-hidden rounded-full",
            paper ? "bg-paper-2" : "bg-ink-3",
          )}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            seek(ratio * song.durationMs);
          }}
          role="slider"
          aria-valuemin={0}
          aria-valuemax={song.durationMs}
          aria-valuenow={currentMs}
          aria-label="Tiến độ"
          tabIndex={0}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-coral transition-[width] duration-100"
            style={{ width: `${Math.min(100, progress * 100)}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={() => seek(0)}
          className={cn(
            "flex size-11 items-center justify-center rounded-lg transition-colors",
            paper
              ? "text-ink-muted hover:bg-paper-2 hover:text-ink-fg"
              : "text-fg-muted hover:bg-ink-3 hover:text-fg",
          )}
          aria-label="Về đầu"
        >
          <SkipBack className="size-4" />
        </button>

        <button
          type="button"
          onClick={() => (playing ? pause() : void play())}
          className={cn(
            "flex size-12 items-center justify-center rounded-full transition-transform active:scale-95",
            paper ? "bg-ink-fg text-paper" : "bg-fg text-ink",
          )}
          aria-label={playing ? "Tạm dừng" : "Phát"}
        >
          {playing ? (
            <Pause className="size-5 fill-current" />
          ) : (
            <Play className="size-5 fill-current" />
          )}
        </button>

        <div
          className={cn(
            "ml-auto font-sans text-xs tabular-nums",
            paper ? "text-ink-muted" : "text-fg-muted",
          )}
        >
          {formatTime(currentMs)} / {formatTime(song.durationMs)}
        </div>
      </div>
    </div>
  );
}
