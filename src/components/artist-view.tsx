import type { ReactNode } from "react";
import { ArrowUpRight, Mail } from "lucide-react";
import { ARTIST, COPYRIGHT_LINE, LICENSE_NOTE } from "@/lib/artist";
import { COLLECTIONS, TOTAL_SONGS, TOTAL_VIDEOS } from "@/lib/library";
import { ScreenHeader } from "@/components/header";
import { Tilt } from "@/components/depth";

/** Trang nghệ sĩ — chân dung, số liệu thư viện, tiểu sử, DOI và các liên kết. */
export function ArtistView() {
  const initials = ARTIST.realName
    .split(/\s+/)
    .slice(-2)
    .map((w) => w[0])
    .join("");

  const stats = [
    { k: "Bài hát", v: TOTAL_SONGS },
    { k: "Video", v: TOTAL_VIDEOS },
    { k: "Bộ sưu tập", v: COLLECTIONS.length },
  ];

  return (
    <div className="view-enter flex min-h-0 flex-1 flex-col">
      <ScreenHeader title="Nghệ sĩ" />
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        <div className="mx-auto max-w-xl text-center">
          <Tilt className="relative mx-auto size-28 overflow-hidden rounded-full border border-line bg-sunk shadow-song">
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
              className="absolute inset-0 hidden items-center justify-center font-display text-3xl text-muted"
              aria-hidden
            >
              {initials}
            </span>
          </Tilt>

          <h2 className="mt-3.5 font-display text-[26px] leading-tight font-semibold text-ink">
            {ARTIST.name}
          </h2>
          <p className="mt-0.5 font-sans text-sm text-muted">
            {ARTIST.realName}
          </p>
          <p className="mt-1.5 font-sans text-[10px] font-bold tracking-[0.18em] text-accent uppercase">
            {ARTIST.tagline}
          </p>

          <dl className="mt-5 grid grid-cols-3 gap-2.5">
            {stats.map((x) => (
              <div
                key={x.k}
                className="rounded-2xl border border-line bg-surface px-1 py-3"
              >
                <dt className="font-sans text-[9px] font-bold tracking-[0.18em] text-muted uppercase">
                  {x.k}
                </dt>
                <dd className="mt-1 font-display text-[22px] font-semibold text-ink">
                  {x.v}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-3.5 flex flex-col gap-2.5 rounded-2xl border border-line bg-surface p-[18px] text-left shadow-song">
            {ARTIST.bio.map((para, i) => (
              <p
                key={i}
                className="font-sans text-sm leading-relaxed text-muted"
              >
                {para}
              </p>
            ))}
          </div>

          <div className="mt-3.5 flex flex-col gap-2">
            <LinkPill href={`https://doi.org/${ARTIST.doi}`}>
              <span className="font-sans text-[10px] font-bold tracking-[0.14em] text-accent-2">
                DOI
              </span>
              {ARTIST.doi}
            </LinkPill>
            {ARTIST.links.map((l) => (
              <LinkPill key={l.url} href={l.url}>
                {l.label}
              </LinkPill>
            ))}
          </div>

          {ARTIST.contactEmail ? (
            <a
              href={`mailto:${ARTIST.contactEmail}`}
              className="mt-6 inline-flex items-center gap-2 font-sans text-xs text-muted transition-colors hover:text-accent"
            >
              <Mail className="size-3.5" />
              {ARTIST.contactEmail}
            </a>
          ) : null}

          <footer className="mt-6 border-t border-line pt-5 pb-4">
            <p className="font-sans text-[0.7rem] text-subtle">
              {COPYRIGHT_LINE}
            </p>
            <p className="mt-1 font-sans text-[0.7rem] text-subtle">
              {LICENSE_NOTE}
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

function LinkPill({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="press flex h-12 items-center gap-2 rounded-full border border-line bg-surface px-4 text-left font-sans text-[13px] text-ink hover:border-accent"
    >
      {children}
      <ArrowUpRight
        className="ml-auto size-4 shrink-0 text-muted"
        aria-hidden
      />
    </a>
  );
}
