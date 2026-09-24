import { Library, User, AlignLeft, Music2, ChevronLeft, Sun, Moon } from "lucide-react";
import { ARTIST } from "@/lib/artist";
import { SEAL } from "@/lib/art";
import { usePlayer, useSong } from "@/lib/player-store";
import { useTheme } from "@/lib/theme";
import type { AppView, ViewMode } from "@/lib/catalog";
import { cn } from "@/lib/utils";

/**
 * Thanh đầu trang — mang dấu triện tròn "LR" của trang cá nhân sang ứng dụng,
 * kèm nút đổi chủ đề Sáng/Tối giống nút ở góc phải trang songbook.
 */
export function AppHeader() {
  const view = usePlayer((s) => s.view);
  const setView = usePlayer((s) => s.setView);
  const mode = usePlayer((s) => s.mode);
  const setMode = usePlayer((s) => s.setMode);
  const song = useSong();
  const { resolved, setTheme } = useTheme();

  return (
    <header
      className="sticky top-0 z-20 flex shrink-0 items-center justify-between gap-2 border-b border-line bg-paper/95 px-4 py-2.5 backdrop-blur-md sm:gap-3 sm:px-6 sm:py-3"
    >
      <div className="flex min-w-0 items-center gap-3">
        {view === "player" ? (
          <button
            type="button"
            onClick={() => setView("library")}
            aria-label="Quay lại danh sách"
            className="press flex size-9 shrink-0 items-center justify-center rounded-full text-muted hover:bg-sunk hover:text-ink"
          >
            <ChevronLeft className="size-5" />
          </button>
        ) : (
          <img
            src={SEAL}
            alt=""
            aria-hidden
            className="size-10 shrink-0 rounded-full"
          />
        )}

        <div className="min-w-0">
          <p className="truncate font-display text-base leading-tight font-semibold text-ink">
            {view === "player" ? song.title : ARTIST.name}
          </p>
          <p className="truncate font-sans text-xs text-muted">
            {view === "player" ? song.subtitle : ARTIST.tagline}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        {view === "player" ? (
          <div
            className="flex rounded-full border border-line bg-surface p-1 shadow-song"
            role="tablist"
            aria-label="Chế độ xem"
          >
            <Tab id="karaoke" label="Lời" icon={AlignLeft} active={mode === "karaoke"}
                 onClick={() => setMode("karaoke" as ViewMode)} />
            <Tab id="sheet" label="Nốt" icon={Music2} active={mode === "sheet"}
                 onClick={() => setMode("sheet" as ViewMode)} />
          </div>
        ) : (
          <div
            className="flex rounded-full border border-line bg-surface p-1 shadow-song"
            role="tablist"
            aria-label="Điều hướng"
          >
            <Tab id="library" label="Album" icon={Library} active={view === "library"}
                 onClick={() => setView("library" as AppView)} />
            <Tab id="artist" label="Nghệ sĩ" icon={User} active={view === "artist"}
                 onClick={() => setView("artist" as AppView)} />
          </div>
        )}

        <button
          type="button"
          onClick={() => setTheme(resolved === "dark" ? "light" : "dark")}
          aria-label={resolved === "dark" ? "Chuyển sang nền sáng" : "Chuyển sang nền tối"}
          title={resolved === "dark" ? "Sáng" : "Tối"}
          className="press flex h-9 items-center gap-1.5 rounded-full border border-line bg-surface px-3 font-sans text-xs text-muted shadow-song hover:text-ink"
        >
          {resolved === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
          <span className="hidden sm:inline">{resolved === "dark" ? "Sáng" : "Tối"}</span>
        </button>
      </div>
    </header>
  );
}

function Tab({
  id, label, icon: Icon, active, onClick,
}: {
  id: string;
  label: string;
  icon: typeof Music2;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      id={`tab-${id}`}
      role="tab"
      aria-selected={active}
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "press flex h-8 items-center gap-1.5 rounded-full px-2.5 font-sans text-sm font-medium sm:px-3",
        active ? "bg-accent text-white" : "text-muted hover:text-ink",
      )}
    >
      <Icon className="size-4 sm:size-3.5" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
