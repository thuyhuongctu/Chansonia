import { LibraryHeader } from "@/components/header";
import { LibraryView } from "@/components/library-view";
import { ArtistView } from "@/components/artist-view";
import { KaraokeStage } from "@/components/karaoke-stage";
import { VideoView } from "@/components/video-view";
import { PlayerBar } from "@/components/player-bar";
import { Splash } from "@/components/splash";
import { usePlayer } from "@/lib/player-store";

export default function App() {
  const view = usePlayer((s) => s.view);
  const mode = usePlayer((s) => s.mode);

  // Khung ứng dụng cao đúng bằng màn hình và KHÔNG để cả trang cuộn: có vậy
  // danh sách và khung lời mới tự cuộn bên trong, còn thanh phát luôn nằm ở
  // đáy màn hình.
  return (
    <div
      data-view={view}
      data-mode={mode}
      className="flex h-full h-dvh w-full flex-col overflow-hidden bg-paper font-sans text-ink"
    >
      {view === "player" ? (
        <KaraokeStage />
      ) : view === "video" ? (
        <VideoView />
      ) : view === "artist" ? (
        <ArtistView />
      ) : (
        <>
          <LibraryHeader />
          <LibraryView />
        </>
      )}

      <PlayerBar />
      <Splash />
    </div>
  );
}
