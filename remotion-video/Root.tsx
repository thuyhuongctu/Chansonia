import { Composition } from "remotion";
import { SONGS } from "@/lib/catalog";
import { FPS, KaraokeVideo, msToFrames } from "./KaraokeVideo";

export function RemotionRoot() {
  return (
    <>
      {SONGS.map((song) => (
        <Composition
          key={song.id}
          id={song.id}
          component={KaraokeVideo}
          durationInFrames={msToFrames(song.durationMs)}
          fps={FPS}
          width={1080}
          height={1920}
          defaultProps={{ songId: song.id }}
        />
      ))}
    </>
  );
}
