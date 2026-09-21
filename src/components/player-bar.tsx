import { Pause, Play, Shuffle, SkipBack } from "lucide-react";
import { usePlayer, useSong } from "@/lib/player-store";
import { SleepTimerButton } from "@/components/sleep-timer";
import { cn, formatTime } from "@/lib/utils";

/** Thanh điều khiển — nút tròn màu đất nung trên nền giấy, viền mảnh. */
export function PlayerBar() {
  const song = useSong();
  const playing = usePlayer((s) => s.playing);
  const currentMs = usePlayer((s) => s.currentMs);
  const playOrder = usePlayer((s) => s.playOrder);
  const setPlayOrder = usePlayer((s) => s.setPlayOrder);
  const play = usePlayer((s) => s.play);
  const pause = usePlayer((s) => s.pause);
  const seek = usePlayer((s) => s.seek);
  const progress = song.durationMs > 0 ? currentMs / song.durationMs : 0;
  const shuffling = playOrder === "shuffle";

  return (
    <div className="sticky bottom-0 z-20 flex shrink-0 flex-col border-t border-line bg-surface">
      <div className="px-4 pt-3 sm:px-6">
        <div
          className="relative h-2.5 cursor-pointer overflow-hidden rounded-full bg-sunk"
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
            className="absolute inset-y-0 left-0 rounded-full bg-accent transition-[width] duration-100"
            style={{ width: `${Math.min(100, progress * 100)}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-4 sm:px-6">
        <button
          type="button"
          onClick={() => setPlayOrder(shuffling ? "sequential" : "shuffle")}
          aria-pressed={shuffling}
          className={cn(
            "flex size-11 items-center justify-center rounded-full border transition-colors active:scale-95",
            shuffling
              ? "border-accent bg-accent-soft text-accent"
              : "border-line bg-paper text-muted hover:text-ink",
          )}
          aria-label={
            shuffling
              ? "Đang phát ngẫu nhiên — chuyển sang phát theo thứ tự"
              : "Đang phát theo thứ tự — chuyển sang phát ngẫu nhiên"
          }
        >
          <Shuffle className="size-4" />
        </button>

        <button
          type="button"
          onClick={() => seek(0)}
          className="flex size-11 items-center justify-center rounded-full border border-line bg-paper text-muted transition-colors hover:text-ink active:scale-95"
          aria-label="Về đầu"
        >
          <SkipBack className="size-4" />
        </button>

        <button
          type="button"
          onClick={() => (playing ? pause() : void play())}
          className="flex size-13 items-center justify-center rounded-full bg-accent text-white shadow-song transition-transform active:scale-95"
          aria-label={playing ? "Tạm dừng" : "Phát"}
        >
          {playing ? (
            <Pause className="size-5 fill-current" />
          ) : (
            <Play className="size-5 fill-current" />
          )}
        </button>

        <div className="ml-auto flex items-center gap-2">
          <span className="font-sans text-xs tabular-nums text-muted">
            {formatTime(currentMs)} / {formatTime(song.durationMs)}
          </span>
          <SleepTimerButton />
        </div>
      </div>
    </div>
  );
}
