import { AppHeader } from "@/components/header";
import { HuongAiMascot } from "@/components/huong-ai-mascot";
import { LibraryView } from "@/components/library-view";
import { ArtistView } from "@/components/artist-view";
import { KaraokeStage } from "@/components/karaoke-stage";
import { PlayerBar } from "@/components/player-bar";
import { ScrollingStaff } from "@/components/staff";
import { SectionNav } from "@/components/section-nav";
import { SheetView } from "@/components/sheet-view";
import { usePlayer } from "@/lib/player-store";

export default function App() {
  const view = usePlayer((s) => s.view);
  const mode = usePlayer((s) => s.mode);
  const playing = usePlayer((s) => s.playing);
  const currentMs = usePlayer((s) => s.currentMs);

  const inPlayer = view === "player";
  const started = playing || currentMs > 80;

  // Khung ứng dụng cao đúng bằng màn hình và KHÔNG để cả trang cuộn: có vậy
  // phần giữa mới tự cuộn bên trong, ô tìm kiếm mới dính lại được khi cuộn,
  // và lời hát mới tự trôi theo nhạc. Để cả trang cuộn thì mọi thứ "dính"
  // bên trong đều trôi mất.
  return (
    <div
      data-view={view}
      data-mode={mode}
      className="flex h-full h-dvh w-full flex-col overflow-hidden bg-paper font-sans text-ink"
    >
      <AppHeader />

      {inPlayer ? (
        <>
          {mode === "sheet" || started ? <SectionNav /> : null}
          {mode === "karaoke" && started ? <ScrollingStaff /> : null}
          {mode === "karaoke" ? <KaraokeStage /> : <SheetView />}
        </>
      ) : view === "artist" ? (
        <ArtistView />
      ) : (
        <LibraryView />
      )}

      <PlayerBar />
      <HuongAiMascot />
    </div>
  );
}
