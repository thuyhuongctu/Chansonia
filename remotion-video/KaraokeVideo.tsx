import {
  AbsoluteFill,
  Audio,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SONG_BY_ID, findLineIndex, findWordIndex } from "@/lib/catalog";

export const FPS = 30;

export function msToFrames(ms: number, fps = FPS): number {
  return Math.ceil((ms / 1000) * fps);
}

export type KaraokeVideoProps = { songId: string };

export function KaraokeVideo({ songId }: KaraokeVideoProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const song = SONG_BY_ID[songId];
  const ms = (frame / fps) * 1000;

  const lineIndex = findLineIndex(song.lines, ms);
  const line = song.lines[lineIndex];
  const wordIndex = line ? findWordIndex(line, ms) : 0;
  const prevLine = song.lines[lineIndex - 1];
  const nextLine = song.lines[lineIndex + 1];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0b0b10",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        padding: 80,
      }}
    >
      <Audio src={staticFile(song.audioSrc)} />

      <div
        style={{
          textAlign: "center",
          color: "#6b6b78",
          fontSize: 34,
          marginBottom: 24,
          opacity: 0.7,
        }}
      >
        {prevLine ? prevLine.words.map((w) => w.text).join(" ") : ""}
      </div>

      <div style={{ textAlign: "center", fontSize: 56, fontWeight: 600, lineHeight: 1.3 }}>
        {line?.words.map((w, i) => (
          <span
            key={`${line.id}-${i}`}
            style={{
              color: i <= wordIndex ? song.accent : "#f4f4f6",
              marginRight: "0.3em",
            }}
          >
            {w.text}
          </span>
        ))}
      </div>

      <div
        style={{
          textAlign: "center",
          color: "#6b6b78",
          fontSize: 34,
          marginTop: 24,
          opacity: 0.7,
        }}
      >
        {nextLine ? nextLine.words.map((w) => w.text).join(" ") : ""}
      </div>
    </AbsoluteFill>
  );
}
