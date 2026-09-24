import { useSong } from "@/lib/player-store";
import { Cover } from "@/components/cover";
import { MiniStaff } from "@/components/staff";
import { PictureStrip } from "@/components/picture-strip";
import { SEAL } from "@/lib/art";
import { ARTIST } from "@/lib/artist";

/**
 * Trang lời in — một trang songbook thật sự: triện tròn, tiêu đề chữ serif,
 * gạch màu, rồi từng phần bài hát kèm khuông nhạc nhỏ và ảnh đất sét khép lại.
 */
export function SheetView() {
  const song = useSong();
  const lines = song.lines;
  const sections = song.sections;

  return (
    <div className="flex-1 overflow-y-auto bg-paper px-4 py-10 text-ink sm:px-8">
      <div className="mx-auto max-w-2xl">
        <header className="mb-10 text-center">
          <img src={SEAL} alt="" aria-hidden className="mx-auto size-14 rounded-full" />

          <Cover
            accent={song.accent}
            trackNo={song.trackNo}
            src={song.coverSrc}
            alt={song.title}
            size="lg"
            className="mx-auto mt-5"
          />

          <p className="mt-4 font-sans text-[0.68rem] font-bold tracking-[0.2em] text-accent uppercase">
            {ARTIST.name} · Track {String(song.trackNo).padStart(2, "0")}
          </p>
          <h1 className="mt-2 font-display text-[clamp(1.6rem,5vw,2.3rem)] font-semibold text-ink">
            {song.title}
          </h1>
          <p className="mt-2 font-sans text-sm text-muted">
            {song.subtitle} · {song.language}
          </p>
          {song.signature ? (
            <p className="mx-auto mt-4 max-w-md font-display text-sm leading-snug text-muted italic">
              {song.signature}
            </p>
          ) : null}
          <span className="title-rule" aria-hidden />
        </header>

        {sections.map((sec) => {
          const secLines = lines.filter((l) => l.sectionId === sec.id);
          if (!secLines.length) return null;
          const start = secLines[0].startMs;
          const end = secLines[secLines.length - 1].endMs;
          return (
            <section key={sec.id} className="mb-9">
              <p className="mb-3 font-sans text-xs font-bold tracking-[0.18em] text-accent uppercase">
                {sec.label}
              </p>
              <MiniStaff startMs={start} endMs={end} />
              <div className="space-y-2.5">
                {secLines.map((line) => (
                  <p key={line.id} className="font-display text-lg leading-relaxed">
                    {line.words.map((w) => w.text).join(" ")}
                  </p>
                ))}
              </div>
            </section>
          );
        })}

        {song.pictures?.length ? (
          <div className="mt-10 border-t border-line pt-7">
            <PictureStrip pictures={song.pictures} />
          </div>
        ) : null}

        <div className="h-20" />
      </div>
    </div>
  );
}
