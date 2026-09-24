import { Mail, ExternalLink } from "lucide-react";
import { ARTIST, ALBUM, COPYRIGHT_LINE, LICENSE_NOTE } from "@/lib/artist";
import { SONGS, TOTAL_DURATION_MS, formatTime } from "@/lib/catalog";
import {
  ALBUM_PORTRAIT,
  DEDICATION,
  OUTSIDE_PICTURES,
  PAGE_COVER,
  SONGBOOK_URL,
  WORDMARK,
} from "@/lib/art";
import { PictureStrip } from "@/components/picture-strip";
import { SectionHead } from "@/components/section-head";

/** Trang nghệ sĩ — chữ ký thương hiệu LR, chân dung, tiểu sử và liên kết. */
export function ArtistView() {
  const initials = ARTIST.realName
    .split(/\s+/)
    .slice(-2)
    .map((w) => w[0])
    .join("");

  return (
    <div className="view-enter relative min-h-0 flex-1 overflow-y-auto bg-paper">
      <div
        className="pagewash"
        aria-hidden
        style={{ backgroundImage: `url(${PAGE_COVER.src})` }}
      />

      <div className="relative z-10 mx-auto w-full max-w-2xl px-5 pt-10 pb-32 sm:px-8">
        <div className="flex flex-col items-center text-center">
          <img
            src={WORDMARK}
            alt="Je m'appelle Hương · Lecturer & Researcher"
            className="w-full max-w-[280px]"
          />

          <div className="relative mt-6 size-32 overflow-hidden rounded-full border border-line bg-sunk shadow-song">
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
          </div>

          <h1 className="mt-5 font-display text-[clamp(1.7rem,5vw,2.3rem)] leading-tight font-semibold text-ink">
            {ARTIST.name}
          </h1>
          <p className="mt-1 font-sans text-sm text-muted">{ARTIST.realName}</p>
          <p className="mt-1 font-sans text-[0.68rem] font-bold tracking-[0.18em] text-accent uppercase">
            {ARTIST.tagline}
          </p>
          <span className="title-rule" aria-hidden />
        </div>

        <div className="song-card mt-8 p-5 sm:p-6">
          <div className="flex flex-col gap-3">
            {ARTIST.bio.map((para, i) => (
              <p key={i} className="font-sans text-[0.95rem] leading-relaxed text-muted">
                {para}
              </p>
            ))}
          </div>
          <PictureStrip pictures={[ALBUM_PORTRAIT]} className="mt-5" />
        </div>

        {/* ── Số liệu album ── */}
        <dl className="mt-6 grid grid-cols-3 gap-3">
          {[
            { k: "Bài hát", v: String(SONGS.length) },
            { k: "Thời lượng", v: formatTime(TOTAL_DURATION_MS) },
            { k: "Chương", v: String(ALBUM.chapters) },
          ].map((x) => (
            <div
              key={x.k}
              className="rounded-[16px] border border-line bg-surface px-4 py-4 text-center shadow-song"
            >
              <dt className="font-sans text-[0.6rem] font-bold tracking-[0.18em] text-muted uppercase">
                {x.k}
              </dt>
              <dd className="mt-1.5 font-display text-2xl font-semibold text-ink">{x.v}</dd>
            </div>
          ))}
        </dl>

        {/* ── Liên kết ── */}
        {ARTIST.links.length ? (
          <section className="mt-9">
            <SectionHead title="Liên kết · Links" />
            <div className="mt-4 flex flex-wrap gap-2">
              {ARTIST.links.map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 font-sans text-xs text-muted shadow-song transition-colors hover:border-accent hover:text-accent"
                >
                  {l.label}
                  <ExternalLink className="size-3" />
                </a>
              ))}
            </div>
          </section>
        ) : null}

        {/* ── Thế giới hình ảnh ── */}
        <section className="mt-9">
          <SectionHead title="Thế giới đất sét · The clay world" />
          <div className="song-card mt-4 p-5 sm:p-6">
            <p className="font-sans text-sm leading-relaxed text-muted">
              Toàn bộ hình ảnh trong ứng dụng lấy từ trang songbook cá nhân — cùng một
              thế giới đất sét: ngọn đèn, dòng sông, con thuyền và hộp màu.
            </p>
            <PictureStrip pictures={OUTSIDE_PICTURES} className="mt-4" />
            <a
              href={SONGBOOK_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-4 inline-flex items-center gap-2 font-sans text-xs text-accent underline-offset-4 hover:underline"
            >
              Mở trang songbook trên web
              <ExternalLink className="size-3" />
            </a>
          </div>
        </section>

        {/* ── Lời đề tặng ── */}
        <section className="mt-8 rounded-[16px] border border-line bg-accent-soft/60 px-5 py-4">
          <p className="font-display text-base text-ink">
            <span aria-hidden className="mr-2">
              {DEDICATION.icon}
            </span>
            {DEDICATION.quote}
          </p>
          <p className="mt-2 font-sans text-xs leading-relaxed text-muted">{DEDICATION.vi}</p>
        </section>

        {ARTIST.contactEmail ? (
          <a
            href={`mailto:${ARTIST.contactEmail}`}
            className="mt-7 inline-flex items-center gap-2 font-sans text-xs text-muted transition-colors hover:text-accent"
          >
            <Mail className="size-3.5" />
            {ARTIST.contactEmail}
          </a>
        ) : null}

        <footer className="mt-10 border-t border-line pt-6">
          <p className="font-sans text-[0.7rem] text-subtle">{COPYRIGHT_LINE}</p>
          <p className="mt-1 font-sans text-[0.7rem] text-subtle">{LICENSE_NOTE}</p>
        </footer>
      </div>
    </div>
  );
}
