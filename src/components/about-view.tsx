import { useState, type ReactNode } from "react";
import { ArrowUpRight, Check, Copy, Play } from "lucide-react";
import { T } from "@/lib/about-text";
import { ARTIST } from "@/lib/artist";
import { useLang } from "@/lib/i18n";
import { COLLECTIONS, TOTAL_SONGS, TOTAL_VIDEOS, type Collection } from "@/lib/library";
import { usePlayer } from "@/lib/player-store";
import { LangButton, ScreenHeader } from "@/components/header";
import { Tilt } from "@/components/depth";
import { cn } from "@/lib/utils";

/** Ảnh của từng bộ sưu tập trên thẻ (bộ nào có `art` riêng thì dùng ảnh đó) */
const CARD_ART: Partial<Record<Collection["id"], string>> = {
  bizon: "https://bizonland.com/assets/covers/ben-phu-sa-3d.webp",
  maida: "https://jemappellehuong.com/assets/img/maida-film-poster.webp",
};

const APA =
  "Đỗ, T. H. (2026). Chansonia [Computer software]. Zenodo. https://doi.org/10.5281/zenodo.22172794";
const BIBTEX = `@software{do_2026_chansonia,
  author    = {Đỗ, Thùy Hương},
  title     = {Chansonia},
  year      = {2026},
  publisher = {Zenodo},
  doi       = {10.5281/zenodo.22172794},
  url       = {https://doi.org/10.5281/zenodo.22172794}
}`;

/** Chữ của màn hình giới thiệu theo ngôn ngữ đang chọn */
function useA() {
  const lang = useLang((s) => s.lang);
  const a = (k: string) => T[lang][k] ?? T.vi[k] ?? k;
  /** "1 video" / "8 videos": dùng khoá ".one" khi đúng một */
  const count = (n: number, k: string) => `${n} ${a(n === 1 && T[lang][`${k}.one`] ? `${k}.one` : k)}`;
  return { a, count };
}

/**
 * Màn hình «Giới thiệu» — trước là trang giới thiệu riêng ở địa chỉ gốc, nay
 * gộp vào app: lời mở đầu và số liệu, các bộ sưu tập, tính năng, MV, nghệ sĩ
 * và mẫu trích dẫn. Mở lần đầu dùng app, khi vào từ địa chỉ gốc, hoặc bấm
 * logo ở đầu thư viện.
 */
export function AboutView() {
  const { a } = useA();
  const setView = usePlayer((s) => s.setView);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="view-enter flex min-h-0 flex-1 flex-col" data-about>
      <ScreenHeader title="Chansonia" subtitle={a("hero.kicker")}>
        <LangButton />
      </ScreenHeader>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-5 pb-10">
          {/* ── Mở đầu ── */}
          <section className="pt-6">
            <p className="font-sans text-[11px] font-bold tracking-[0.18em] text-accent uppercase">
              {a("hero.kicker")}
            </p>
            <h1 className="mt-2 font-display text-[28px] leading-[1.15] font-semibold text-ink sm:text-4xl">
              {a("hero.title")}
            </h1>
            <p className="mt-3 font-sans text-[15px] leading-relaxed text-muted">{a("hero.lead")}</p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => setView("library")}
                className="press flex h-12 items-center gap-2 rounded-full bg-accent px-6 font-sans text-[15px] font-semibold text-on-accent shadow-song"
              >
                <Play className="size-4 fill-current" />
                {a("hero.listen")}
              </button>
              <button
                type="button"
                onClick={() => scrollTo("about-videos")}
                className="press h-12 rounded-full border border-line bg-surface px-6 font-sans text-[15px] font-semibold text-ink"
              >
                {a("hero.watch")}
              </button>
            </div>
            <Stats />
            <a
              href={`https://doi.org/${ARTIST.doi}`}
              target="_blank"
              rel="noreferrer noopener"
              className="press mt-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2 font-sans text-xs text-ink"
            >
              <span className="rounded-md bg-accent-2 px-1.5 py-0.5 text-[10px] font-bold tracking-[0.14em] text-paper">
                DOI
              </span>
              <span className="tabular-nums">{ARTIST.doi}</span>
            </a>
          </section>

          <Collections />
          <Features />
          <Videos />
          <ArtistBlock />
          <Cite />

          <footer className="mt-10 border-t border-line pt-5 text-center">
            <p className="font-sans text-[0.7rem] text-subtle">{a("foot.rights")}</p>
            <p className="mt-1 font-sans text-[0.7rem] text-subtle">{a("foot.license")}</p>
          </footer>
        </div>
      </div>
    </div>
  );
}

function Stats() {
  const { a } = useA();
  const items: [number, string][] = [
    [TOTAL_SONGS, "stat.songs"],
    [TOTAL_VIDEOS, "stat.videos"],
    [COLLECTIONS.length, "stat.collections"],
    [3, "stat.langs"],
  ];
  return (
    <dl className="mt-6 grid grid-cols-4 gap-2" data-stats>
      {items.map(([n, k]) => (
        <div key={k} className="rounded-2xl border border-line bg-surface px-2 py-3 text-center">
          <dd className="font-display text-[22px] leading-none font-semibold text-ink">{n}</dd>
          <dt className="mt-1.5 font-sans text-[10px] text-muted">{a(k)}</dt>
        </div>
      ))}
    </dl>
  );
}

function Section({
  id,
  kicker,
  title,
  lead,
  children,
}: {
  id: string;
  kicker: string;
  title?: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mt-12 scroll-mt-4" aria-label={kicker}>
      <p className="font-sans text-[11px] font-bold tracking-[0.18em] text-accent uppercase">{kicker}</p>
      {title ? (
        <h2 className="mt-1.5 font-display text-[23px] leading-tight font-semibold text-ink">{title}</h2>
      ) : null}
      {lead ? <p className="mt-2 font-sans text-sm leading-relaxed text-muted">{lead}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Collections() {
  const { a, count } = useA();
  const setCollection = usePlayer((s) => s.setCollection);
  const setTab = usePlayer((s) => s.setLibraryTab);
  const setView = usePlayer((s) => s.setView);
  return (
    <Section id="about-collections" kicker={a("col.kicker")} title={a("col.title")} lead={a("col.lead")}>
      <div className="grid gap-3 sm:grid-cols-2">
        {COLLECTIONS.map((c) => {
          const art = c.art ?? CARD_ART[c.id];
          return (
            <button
              key={c.id}
              type="button"
              data-about-collection={c.id}
              onClick={() => {
                setCollection(c.id);
                setTab("songs");
                setView("library");
              }}
              className="press flex items-stretch gap-3.5 overflow-hidden rounded-2xl border border-line bg-surface p-2.5 text-left shadow-song"
            >
              <span className="size-24 shrink-0 overflow-hidden rounded-xl bg-sunk">
                {art ? (
                  <img
                    src={art}
                    alt=""
                    loading="lazy"
                    className={cn("size-full", c.id === "maida" ? "object-contain" : "object-cover")}
                  />
                ) : null}
              </span>
              <span className="flex min-w-0 flex-1 flex-col py-0.5">
                <span className="font-sans text-[10px] font-bold tracking-[0.14em] uppercase" style={{ color: c.color }}>
                  {count(c.songs.length, "col.songs")} · {count(c.videos.length, "col.videos")}
                </span>
                <span className="mt-1 font-display text-base leading-tight font-semibold text-ink">{c.name}</span>
                <span className="mt-1 line-clamp-3 font-sans text-xs leading-snug text-muted">{a(`col.${c.id}.desc`)}</span>
              </span>
            </button>
          );
        })}
      </div>
    </Section>
  );
}

function Features() {
  const { a } = useA();
  const items: [string, string | null, string][] = [
    ["karaoke", "shots/karaoke.webp", "50% 30%"],
    ["versions", "shots/versions.webp", "50% 0%"],
    ["sleep", "shots/sleep.webp", "50% 100%"],
    ["offline", null, ""],
  ];
  return (
    <Section id="about-features" kicker={a("feat.kicker")} title={a("feat.title")}>
      <div className="grid grid-cols-2 gap-3">
        {items.map(([k, shot, pos]) => (
          <article key={k} className="flex flex-col rounded-2xl border border-line bg-surface p-3">
            {shot ? (
              <Tilt className="aspect-[4/5] w-full overflow-hidden rounded-xl border border-line bg-sunk">
                <img src={shot} alt="" loading="lazy" className="size-full object-cover" style={{ objectPosition: pos }} />
              </Tilt>
            ) : (
              <div className="flex aspect-[4/5] w-full items-center justify-center rounded-xl bg-accent-soft font-display text-5xl text-accent">
                ⤓
              </div>
            )}
            <h3 className="mt-3 font-display text-[15px] leading-tight font-semibold text-ink">{a(`feat.${k}.t`)}</h3>
            <p className="mt-1 font-sans text-xs leading-snug text-muted">{a(`feat.${k}.d`)}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

function Videos() {
  const { a } = useA();
  const openVideo = usePlayer((s) => s.openVideo);
  const vids = COLLECTIONS.flatMap((c) => c.videos.map((v) => ({ ...v, col: c })));
  return (
    <Section id="about-videos" kicker={a("vid.kicker")} title={a("vid.title")} lead={a("vid.lead")}>
      <div className="grid grid-cols-2 gap-3" data-about-videos>
        {vids.map((v) => {
          const poster = v.poster ?? (v.youtube ? `https://i.ytimg.com/vi/${v.youtube}/hqdefault.jpg` : "");
          return (
            <button
              key={`${v.col.id}-${v.id}`}
              type="button"
              onClick={() => openVideo(v.col.id, v.id)}
              className="press text-left"
            >
              <span
                className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-line bg-sunk bg-cover bg-center"
                style={poster ? { backgroundImage: `url('${poster}')` } : undefined}
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-black/55 text-white" aria-hidden>
                  <Play className="size-4 fill-current" />
                </span>
              </span>
              <span className="mt-1.5 line-clamp-2 block font-sans text-[13px] leading-snug font-semibold text-ink">{v.title}</span>
              <span className="block truncate font-sans text-[11px] text-muted">
                {v.col.name}
                {v.duration ? ` · ${v.duration}` : ""}
              </span>
            </button>
          );
        })}
      </div>
    </Section>
  );
}

function ArtistBlock() {
  const { a } = useA();
  const setView = usePlayer((s) => s.setView);
  return (
    <Section id="about-artist" kicker={a("art.kicker")}>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Tilt className="aspect-[4/5] w-full shrink-0 overflow-hidden rounded-2xl border border-line bg-sunk shadow-song sm:w-56">
          <img src="art/huong-vuon-hoa.webp" alt={ARTIST.name} loading="lazy" className="size-full object-cover object-[50%_30%]" />
        </Tilt>
        <div className="min-w-0">
          <h2 className="font-display text-[23px] leading-tight font-semibold text-ink">{ARTIST.name}</h2>
          <p className="mt-0.5 font-sans text-[13px] text-muted">
            {ARTIST.realName} · {a("art.role")}
          </p>
          {["art.p1", "art.p2", "art.p3"].map((k) => (
            <p key={k} className="mt-3 font-sans text-sm leading-relaxed text-muted">
              {a(k)}
            </p>
          ))}
          <button
            type="button"
            onClick={() => setView("artist")}
            className="press mt-4 flex h-11 items-center gap-1.5 rounded-full border border-line bg-surface px-4 font-sans text-sm font-semibold text-ink"
          >
            {a("nav.artist")}
            <ArrowUpRight className="size-4" />
          </button>
        </div>
      </div>
    </Section>
  );
}

function Cite() {
  const { a } = useA();
  return (
    <Section id="about-cite" kicker={a("cite.kicker")} title={a("cite.title")} lead={a("cite.lead")}>
      <div className="flex flex-col gap-3">
        <CiteBox label="APA" text={APA} />
        <CiteBox label="BibTeX" text={BIBTEX} />
      </div>
    </Section>
  );
}

function CiteBox({ label, text }: { label: string; text: string }) {
  const { a } = useA();
  const [done, setDone] = useState(false);
  return (
    <figure className="rounded-2xl border border-line bg-surface p-3.5" data-cite={label}>
      <figcaption className="flex items-center justify-between font-sans text-xs font-bold tracking-[0.12em] text-muted uppercase">
        {label}
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(text);
              setDone(true);
              setTimeout(() => setDone(false), 1600);
            } catch {
              /* trình duyệt chặn bộ nhớ tạm, người dùng vẫn bôi đen chép tay được */
            }
          }}
          className="press flex h-9 items-center gap-1.5 rounded-full border border-line px-3 font-sans text-xs font-semibold tracking-normal text-ink normal-case"
        >
          {done ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {done ? a("cite.copied") : a("cite.copy")}
        </button>
      </figcaption>
      <pre className="mt-2.5 overflow-x-auto font-mono text-[11.5px] leading-relaxed whitespace-pre-wrap text-ink">{text}</pre>
    </figure>
  );
}
