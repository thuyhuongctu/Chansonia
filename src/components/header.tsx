import { Library, User, AlignLeft, Music2, ChevronLeft } from "lucide-react";
import { ARTIST } from "@/lib/artist";
import { usePlayer, useSong } from "@/lib/player-store";
import type { AppView, ViewMode } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function AppHeader({ paper }: { paper: boolean }) {
  const view = usePlayer((s) => s.view);
  const setView = usePlayer((s) => s.setView);
  const mode = usePlayer((s) => s.mode);
  const setMode = usePlayer((s) => s.setMode);
  const song = useSong();

  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex shrink-0 flex-wrap items-center justify-between gap-3 border-b px-4 py-3 sm:px-6",
        paper ? "border-edge-paper bg-paper" : "border-edge bg-ink/85 backdrop-blur-xl",
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        {view === "player" ? (
          <button
            type="button"
            onClick={() => setView("library")}
            aria-label="Quay lại danh sách"
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-full transition-colors",
              paper ? "text-ink-muted hover:bg-paper-2" : "text-fg-muted hover:bg-fg/10",
            )}
          >
            <ChevronLeft className="size-5" />
          </button>
        ) : null}

        <div className="min-w-0">
          <p
            className={cn(
              "truncate font-display text-base leading-tight font-medium",
              paper ? "text-ink-fg" : "text-fg",
            )}
          >
            {view === "player" ? song.title : ARTIST.name}
          </p>
          <p
            className={cn(
              "truncate font-sans text-xs",
              paper ? "text-ink-muted" : "text-fg-muted",
            )}
          >
            {view === "player" ? song.subtitle : ARTIST.tagline}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {view === "player" ? (
          <div
            className={cn("flex rounded-lg p-1", paper ? "bg-paper-2" : "bg-ink-3")}
            role="tablist"
            aria-label="Chế độ xem"
          >
            <Tab id="karaoke" label="Lời" icon={AlignLeft} active={mode === "karaoke"}
                 paper={paper} onClick={() => setMode("karaoke" as ViewMode)} />
            <Tab id="sheet" label="Nốt" icon={Music2} active={mode === "sheet"}
                 paper={paper} onClick={() => setMode("sheet" as ViewMode)} />
          </div>
        ) : (
          <div
            className={cn("flex rounded-lg p-1", paper ? "bg-paper-2" : "bg-ink-3")}
            role="tablist"
            aria-label="Điều hướng"
          >
            <Tab id="library" label="Album" icon={Library} active={view === "library"}
                 paper={paper} onClick={() => setView("library" as AppView)} />
            <Tab id="artist" label="Nghệ sĩ" icon={User} active={view === "artist"}
                 paper={paper} onClick={() => setView("artist" as AppView)} />
          </div>
        )}
      </div>
    </header>
  );
}

function Tab({
  id, label, icon: Icon, active, paper, onClick,
}: {
  id: string;
  label: string;
  icon: typeof Music2;
  active: boolean;
  paper: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      id={`tab-${id}`}
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "flex h-10 items-center gap-1.5 rounded-md px-3 font-sans text-sm font-medium transition-colors duration-150",
        active && paper && "bg-paper text-ink-fg shadow-sm",
        active && !paper && "bg-ink-2 text-fg",
        !active && paper && "text-ink-muted hover:text-ink-fg",
        !active && !paper && "text-fg-muted hover:text-fg",
      )}
    >
      <Icon className="size-3.5" />
      {label}
    </button>
  );
}
