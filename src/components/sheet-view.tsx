import { useSong } from "@/lib/player-store";
import { Cover } from "@/components/cover";
import { MiniStaff } from "@/components/staff";

export function SheetView() {
  const song = useSong();
  const lines = song.lines;
  const sections = song.sections;

  return (
    <div className="flex-1 overflow-y-auto bg-paper px-4 py-10 text-ink-fg sm:px-8">
      <div className="mx-auto max-w-2xl">
        <header className="mb-10 border-b border-edge-paper pb-6 text-center">
          <Cover accent={song.accent} trackNo={song.trackNo} size="lg" className="mx-auto" />
          <p className="mt-4 font-sans text-xs font-medium tracking-[0.2em] text-ink-muted uppercase">
            School of Economics · Cần Thơ University
          </p>
          <h1 className="mt-2 font-display text-4xl font-medium text-ink-fg">
            {song.title}
          </h1>
          <p className="mt-2 font-sans text-sm text-ink-muted">
            {song.subtitle} · Sol trưởng · 4/4
          </p>
        </header>

        {sections.map((sec) => {
          const secLines = lines.filter((l) => l.sectionId === sec.id);
          if (!secLines.length) return null;
          const start = secLines[0].startMs;
          const end = secLines[secLines.length - 1].endMs;
          return (
            <section key={sec.id} className="mb-10">
              <p className="mb-3 font-sans text-xs font-medium tracking-[0.18em] text-ink-muted uppercase">
                {sec.label}
              </p>
              <MiniStaff startMs={start} endMs={end} paper />
              <div className="space-y-3">
                {secLines.map((line) => (
                  <p key={line.id} className="font-display text-lg leading-relaxed">
                    {line.words.map((w) => w.text).join(" ")}
                  </p>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
