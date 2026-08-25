import { AppHeader } from "@/components/header";
import { LibraryView } from "@/components/library-view";
import { ArtistView } from "@/components/artist-view";
import { KaraokeStage } from "@/components/karaoke-stage";
import { PlayerBar } from "@/components/player-bar";
import { ScrollingStaff } from "@/components/staff";
import { SectionNav } from "@/components/section-nav";
import { SheetView } from "@/components/sheet-view";
import { usePlayer } from "@/lib/player-store";
import { cn } from "@/lib/utils";

export default function App() {
  const view = usePlayer((s) => s.view);
  const mode = usePlayer((s) => s.mode);
  const playing = usePlayer((s) => s.playing);
  const currentMs = usePlayer((s) => s.currentMs);

  const inPlayer = view === "player";
  const paper = inPlayer && mode === "sheet";
  const started = playing || currentMs > 80;

  return (
    <div
      data-view={view}
      data-mode={mode}
      className={cn(
        "flex min-h-full min-h-dvh w-full flex-1 flex-col font-sans",
        paper ? "bg-paper text-ink-fg" : "bg-ink text-fg",
      )}
    >
      <AppHeader paper={paper} />

      {inPlayer ? (
        <>
          {mode === "sheet" || started ? <SectionNav paper={paper} /> : null}
          {mode === "karaoke" && started ? <ScrollingStaff /> : null}
          {mode === "karaoke" ? <KaraokeStage /> : <SheetView />}
        </>
      ) : view === "artist" ? (
        <ArtistView />
      ) : (
        <LibraryView />
      )}

      <PlayerBar paper={paper} />
    </div>
  );
}
