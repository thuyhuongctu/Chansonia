import { LibraryHeader } from "@/components/header";
import { LibraryView } from "@/components/library-view";
import { ArtistView } from "@/components/artist-view";
import { AboutView } from "@/components/about-view";
import { SettingsView } from "@/components/settings-view";
import { KaraokeStage } from "@/components/karaoke-stage";
import { VideoView } from "@/components/video-view";
import { PlayerBar } from "@/components/player-bar";
import { Splash } from "@/components/splash";
import { Toaster } from "@/components/song-menu";
import { MapBackdrop } from "@/components/depth";
import { usePlayer } from "@/lib/player-store";
import { useMediaControls } from "@/lib/media-controls";
import { useShortcuts } from "@/lib/shortcuts";
import { useOffline } from "@/lib/offline";
import { useLang } from "@/lib/i18n";
import { useEffect } from "react";

export default function App() {
  const view = usePlayer((s) => s.view);
  const mode = usePlayer((s) => s.mode);
  useMediaControls();
  useShortcuts();
  // Người dùng có thể đã xoá dữ liệu trang: đối chiếu danh sách bài tải về với kho thật.
  useEffect(() => {
    void useOffline.getState().verify();
  }, []);
  const lang = useLang((s) => s.lang);
  // Báo ngôn ngữ của trang cho trình đọc màn hình và công cụ dịch.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Khung ứng dụng cao đúng bằng màn hình và KHÔNG để cả trang cuộn: có vậy
  // danh sách và khung lời mới tự cuộn bên trong, còn thanh phát luôn nằm ở
  // đáy màn hình.
  return (
    <div
      data-view={view}
      data-mode={mode}
      className="relative isolate flex h-full h-dvh w-full flex-col overflow-hidden bg-paper font-sans text-ink"
    >
      <MapBackdrop />
      {view === "player" ? (
        <KaraokeStage />
      ) : view === "video" ? (
        <VideoView />
      ) : view === "artist" ? (
        <ArtistView />
      ) : view === "about" ? (
        <AboutView />
      ) : view === "settings" ? (
        <SettingsView />
      ) : (
        <>
          <LibraryHeader />
          <LibraryView />
        </>
      )}

      <PlayerBar />
      <Toaster />
      <Splash />
    </div>
  );
}
