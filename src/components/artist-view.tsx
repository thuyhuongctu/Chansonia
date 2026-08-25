import { Mail, ExternalLink } from "lucide-react";
import { ARTIST, ALBUM, COPYRIGHT_LINE, LICENSE_NOTE } from "@/lib/artist";
import { SONGS, TOTAL_DURATION_MS, formatTime } from "@/lib/catalog";

export function ArtistView() {
  const initials = ARTIST.realName
    .split(/\s+/)
    .slice(-2)
    .map((w) => w[0])
    .join("");

  return (
    <div className="hero-grain relative min-h-0 flex-1 overflow-y-auto">
      <div className="hero-aurora" aria-hidden>
        <span /><span /><span /><span />
      </div>
      <div className="hero-veil" aria-hidden />

      <div className="relative z-10 mx-auto w-full max-w-3xl px-5 pt-12 pb-28 sm:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="relative size-28 overflow-hidden rounded-full border border-fg/15 bg-ink-3">
            <img
              src={ARTIST.portrait}
              alt={ARTIST.name}
              className="size-full object-cover"
              onError={(e) => {
                const el = e.currentTarget;
                el.style.display = "none";
                const f = el.nextElementSibling as HTMLElement | null;
                if (f) f.style.display = "flex";
              }}
            />
            <span
              className="absolute inset-0 hidden items-center justify-center font-display text-3xl text-fg-muted"
              aria-hidden
            >
              {initials}
            </span>
          </div>

          <h1 className="hero-title mt-6 font-display text-4xl leading-tight font-medium tracking-[-0.02em] sm:text-5xl">
            {ARTIST.name}
          </h1>
          <p className="mt-2 font-sans text-sm text-fg-muted">{ARTIST.realName}</p>
          <p className="mt-1 font-sans text-xs tracking-[0.16em] text-fg-subtle uppercase">
            {ARTIST.tagline}
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4">
          {ARTIST.bio.map((para, i) => (
            <p key={i} className="font-sans text-[0.95rem] leading-relaxed text-fg-muted">
              {para}
            </p>
          ))}
        </div>

        {/* ── Số liệu album ── */}
        <dl className="mt-10 grid grid-cols-3 gap-3">
          {[
            { k: "Bài hát", v: String(SONGS.length) },
            { k: "Thời lượng", v: formatTime(TOTAL_DURATION_MS) },
            { k: "Chương", v: String(ALBUM.chapters) },
          ].map((x) => (
            <div key={x.k} className="rounded-2xl border border-edge px-4 py-4 text-center">
              <dt className="font-sans text-[0.6rem] tracking-[0.18em] text-fg-subtle uppercase">
                {x.k}
              </dt>
              <dd className="mt-1.5 font-display text-2xl font-medium text-fg">{x.v}</dd>
            </div>
          ))}
        </dl>

        {/* ── Liên kết ── */}
        {ARTIST.links.length ? (
          <section className="mt-10">
            <h2 className="font-sans text-[0.65rem] font-medium tracking-[0.24em] text-fg-muted uppercase">
              Liên kết
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {ARTIST.links.map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 rounded-full border border-edge px-4 py-2 font-sans text-xs text-fg-muted transition-colors hover:border-fg/30 hover:text-fg"
                >
                  {l.label}
                  <ExternalLink className="size-3" />
                </a>
              ))}
            </div>
          </section>
        ) : null}

        {ARTIST.contactEmail ? (
          <a
            href={`mailto:${ARTIST.contactEmail}`}
            className="mt-8 inline-flex items-center gap-2 font-sans text-xs text-fg-muted transition-colors hover:text-fg"
          >
            <Mail className="size-3.5" />
            {ARTIST.contactEmail}
          </a>
        ) : null}

        <footer className="mt-14 border-t border-edge pt-6">
          <p className="font-sans text-[0.7rem] text-fg-subtle">{COPYRIGHT_LINE}</p>
          <p className="mt-1 font-sans text-[0.7rem] text-fg-subtle">{LICENSE_NOTE}</p>
        </footer>
      </div>
    </div>
  );
}
