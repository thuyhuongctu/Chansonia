import { useEffect, useState, type ReactNode } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Mail, X } from "lucide-react";
import { ARTIST, ARTIST_PHOTOS, COPYRIGHT_HOLDER, COPYRIGHT_YEAR, LICENSE_NOTE } from "@/lib/artist";
import { useT } from "@/lib/i18n";
import { COLLECTIONS, TOTAL_SONGS, TOTAL_VIDEOS } from "@/lib/library";
import { ScreenHeader } from "@/components/header";
import { usePlayer } from "@/lib/player-store";
import { Tilt } from "@/components/depth";

/** Trang nghệ sĩ — chân dung, số liệu thư viện, tiểu sử, DOI và các liên kết. */
export function ArtistView() {
  const { t } = useT();
  const setView = usePlayer((s) => s.setView);
  const initials = ARTIST.realName
    .split(/\s+/)
    .slice(-2)
    .map((w) => w[0])
    .join("");

  const stats = [
    { k: t("Bài hát"), v: TOTAL_SONGS },
    { k: t("Video"), v: TOTAL_VIDEOS },
    { k: t("Bộ sưu tập"), v: COLLECTIONS.length },
  ];

  return (
    <div className="view-enter flex min-h-0 flex-1 flex-col">
      <ScreenHeader title={t("Nghệ sĩ")} />
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

          <PhotoStrip />

          <div className="mt-3.5 flex flex-col gap-2.5 rounded-2xl border border-line bg-surface p-[18px] text-left shadow-song">
            {ARTIST.bio.map((para, i) => (
              <p
                key={i}
                className="font-sans text-sm leading-relaxed text-muted"
              >
                {t(para)}
              </p>
            ))}
          </div>

          <div className="mt-3.5 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setView("about")}
              className="press flex h-12 items-center gap-2 rounded-full border border-accent bg-accent-soft px-4 text-left font-sans text-[13px] font-semibold text-accent"
            >
              {t("Giới thiệu Chansonia")}
              <ArrowUpRight className="ml-auto size-4 shrink-0" aria-hidden />
            </button>
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
              © {COPYRIGHT_YEAR} {COPYRIGHT_HOLDER}. {t("Mọi quyền được bảo lưu.")}
            </p>
            <p className="mt-1 font-sans text-[0.7rem] text-subtle">
              {t(LICENSE_NOTE)}
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

/** Mục «Ảnh»: dải ảnh cuộn ngang, chạm vào một ảnh để xem lớn */
function PhotoStrip() {
  const { t } = useT();
  const [open, setOpen] = useState<number | null>(null);
  const n = ARTIST_PHOTOS.length;

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      else if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % n));
      else if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + n) % n));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, n]);

  return (
    <section className="mt-5 text-left" aria-label={t("Ảnh")} data-photos>
      <h3 className="px-0.5 font-sans text-[10px] font-bold tracking-[0.18em] text-muted uppercase">
        {t("Ảnh")} · {n}
      </h3>
      <div className="no-scrollbar -mx-5 mt-2 flex snap-x gap-2.5 overflow-x-auto px-5 pb-1">
        {ARTIST_PHOTOS.map((ph, i) => (
          <button
            key={ph.src}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={t("Xem ảnh {n}").replace("{n}", String(i + 1))}
            className="press h-48 w-32 shrink-0 snap-start overflow-hidden rounded-2xl border border-line bg-sunk shadow-song"
          >
            <img src={ph.src} alt={ph.alt} loading="lazy" className="size-full object-cover object-[50%_25%]" />
          </button>
        ))}
      </div>

      {open !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={ARTIST_PHOTOS[open].alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpen(null)}
        >
          <img
            src={ARTIST_PHOTOS[open].src}
            alt={ARTIST_PHOTOS[open].alt}
            className="max-h-full max-w-full rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            aria-label={t("Đóng ảnh")}
            onClick={() => setOpen(null)}
            className="press absolute top-4 right-4 flex size-11 items-center justify-center rounded-full bg-white/15 text-white"
          >
            <X className="size-5" />
          </button>
          <button
            type="button"
            aria-label={t("Ảnh trước")}
            onClick={(e) => {
              e.stopPropagation();
              setOpen((open - 1 + n) % n);
            }}
            className="press absolute left-3 flex size-11 items-center justify-center rounded-full bg-white/15 text-white"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label={t("Ảnh sau")}
            onClick={(e) => {
              e.stopPropagation();
              setOpen((open + 1) % n);
            }}
            className="press absolute right-3 flex size-11 items-center justify-center rounded-full bg-white/15 text-white"
          >
            <ChevronRight className="size-5" />
          </button>
          <p className="absolute bottom-5 font-sans text-xs text-white/80 tabular-nums">
            {open + 1} / {n}
          </p>
        </div>
      ) : null}
    </section>
  );
}
