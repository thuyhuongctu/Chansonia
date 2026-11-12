import { useEffect } from "react";
import { ARTIST } from "@/lib/artist";
import { songVersion } from "@/lib/catalog";
import { collectionOf } from "@/lib/library";
import { usePlayer, useSong } from "@/lib/player-store";

/** Địa chỉ đầy đủ của ảnh (Media Session cần URL tuyệt đối) */
const abs = (src: string) => new URL(src, location.href).toString();

/**
 * Điều khiển nhạc từ bên ngoài app:
 *  - Màn hình khoá, thanh thông báo, nút trên tai nghe và đồng hồ thông minh
 *    (Media Session API): tên bài, ảnh bìa, phát/dừng, bài trước/sau, tua.
 *  - Phím tắt trên máy tính: Space phát/dừng · ←/→ tua 5 giây ·
 *    N bài sau · P bài trước · L yêu thích · M tắt/bật tiếng.
 */
export function useMediaControls() {
  const song = useSong();
  const versionIndex = usePlayer((s) => s.versionIndex);
  const playing = usePlayer((s) => s.playing);

  // Tên bài và ảnh bìa
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    const version = songVersion(song, versionIndex);
    const art = song.coverSrc ?? "icons/icon-512.png";
    navigator.mediaSession.metadata = new MediaMetadata({
      title: version.label ? `${song.title} (${version.label})` : song.title,
      artist: ARTIST.name,
      album: collectionOf(song.id).name,
      artwork: [{ src: abs(art), sizes: "512x512" }],
    });
  }, [song, versionIndex]);

  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.playbackState = playing ? "playing" : "paused";
    }
  }, [playing]);

  // Nút bấm từ bên ngoài
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    const s = () => usePlayer.getState();
    const handlers: [MediaSessionAction, MediaSessionActionHandler][] = [
      ["play", () => void s().play()],
      ["pause", () => s().pause()],
      ["previoustrack", () => void s().prev()],
      ["nexttrack", () => void s().next()],
      ["seekbackward", (d) => s().seek(s().currentMs - (d.seekOffset ?? 10) * 1000)],
      ["seekforward", (d) => s().seek(s().currentMs + (d.seekOffset ?? 10) * 1000)],
      ["seekto", (d) => d.seekTime != null && s().seek(d.seekTime * 1000)],
    ];
    for (const [action, fn] of handlers) {
      try {
        navigator.mediaSession.setActionHandler(action, fn);
      } catch {
        /* trình duyệt không hỗ trợ thao tác này */
      }
    }
    return () => {
      for (const [action] of handlers) {
        try {
          navigator.mediaSession.setActionHandler(action, null);
        } catch {
          /* bỏ qua */
        }
      }
    };
  }, []);

  // Vị trí trên thanh tiến độ của màn hình khoá — cập nhật mỗi 5 giây
  useEffect(() => {
    if (!("mediaSession" in navigator) || !navigator.mediaSession.setPositionState) return;
    const update = () => {
      const { durationMs, currentMs } = usePlayer.getState();
      if (!durationMs) return;
      try {
        navigator.mediaSession.setPositionState({
          duration: durationMs / 1000,
          position: Math.min(currentMs, durationMs) / 1000,
          playbackRate: 1,
        });
      } catch {
        /* bỏ qua */
      }
    };
    update();
    if (!playing) return;
    const id = window.setInterval(update, 5000);
    return () => clearInterval(id);
  }, [playing, song.id, versionIndex]);

  // Phím tắt
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      if (el?.closest("input, textarea, select, [contenteditable], [role='slider'], [role='dialog']")) return;
      const st = usePlayer.getState();
      switch (e.key) {
        case " ":
          // Đang đứng trên một nút thì để Space bấm nút đó.
          if (el?.closest("button, a")) return;
          st.toggle();
          break;
        case "ArrowRight":
          st.seek(st.currentMs + 5000);
          break;
        case "ArrowLeft":
          st.seek(st.currentMs - 5000);
          break;
        case "n":
        case "N":
          void st.next();
          break;
        case "p":
        case "P":
          void st.prev();
          break;
        case "l":
        case "L":
          st.toggleFavorite(st.songId);
          break;
        case "m":
        case "M":
          st.toggleMute();
          break;
        default:
          return;
      }
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
