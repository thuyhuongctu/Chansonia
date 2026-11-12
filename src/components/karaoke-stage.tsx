import { useEffect, useRef } from "react";
import { Heart, Repeat, Repeat1 } from "lucide-react";
import { formatTime, songMeta, songVersion } from "@/lib/catalog";
import { collectionOf } from "@/lib/library";
import { usePlayer, useSong, useUpNext } from "@/lib/player-store";
import { QueueButton, SongMenuButton } from "@/components/song-menu";
import { ScreenHeader } from "@/components/header";
import { Tilt } from "@/components/depth";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";

/**
 * Màn hình nghe — lời hát của bài đang phát.
 *
 *  - Chế độ "Lời" (karaoke): chỉ dòng đang hát được phóng to, chữ nào đã hát
 *    thì tô màu đất nung; dòng đã qua nhạt đi, dòng sắp tới hơi mờ. Dòng đang
 *    hát tự trôi vào giữa khung.
 *  - Chế độ "Trang lời": cả bài in đều nhau, không tô, không tự cuộn.
 *
 * Bấm vào dòng nào là nhạc nhảy tới dòng đó và phát luôn. Trên máy tính có
 * thêm cột trái: ảnh bìa, phong cách và danh sách các phần của bài.
 */
export function KaraokeStage() {
  const song = useSong();
  const { t, td } = useT();
  const mode = usePlayer((s) => s.mode);
  const setMode = usePlayer((s) => s.setMode);
  const lineIndex = usePlayer((s) => s.lineIndex);
  const wordIndex = usePlayer((s) => s.wordIndex);
  const currentMs = usePlayer((s) => s.currentMs);
  const playing = usePlayer((s) => s.playing);
  const seek = usePlayer((s) => s.seek);
  const play = usePlayer((s) => s.play);
  const versionIndex = usePlayer((s) => s.versionIndex);
  const setVersion = usePlayer((s) => s.setVersion);

  const version = songVersion(song, versionIndex);
  // Lời chỉ chạy theo nhạc ở bản khớp với nó; bản khác thì in lời đứng yên.
  const synced = Boolean(version.synced);
  const karaoke = mode === "karaoke" && synced;
  const started = playing || currentMs > 0;
  // Còn đang dạo nhạc thì chưa có dòng nào được hát.
  const active =
    karaoke &&
    started &&
    song.lines.length > 0 &&
    currentMs >= song.lines[0].startMs
      ? lineIndex
      : -1;

  const boxRef = useRef<HTMLDivElement>(null);

  // Dòng đang hát đổi thì cuộn mềm cho nó vào giữa khung.
  useEffect(() => {
    if (active < 0) return;
    const box = boxRef.current;
    const el = box?.querySelector<HTMLElement>('[data-state="active"]');
    if (!box || !el) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    // Chờ một khung hình để cỡ chữ mới của dòng kịp áp dụng rồi mới đo.
    const id = requestAnimationFrame(() => {
      const b = box.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      box.scrollTo({
        top: box.scrollTop + (r.top - b.top) - (b.height - r.height) / 2,
        behavior: reduce ? "auto" : "smooth",
      });
    });
    return () => cancelAnimationFrame(id);
  }, [active, song.id]);

  // Đổi bài thì về đầu khung lời.
  useEffect(() => {
    boxRef.current?.scrollTo({ top: 0 });
  }, [song.id]);

  const col = collectionOf(song.id);
  const sectionLabel = new Map(
    song.sections.map((sec) => [
      song.lines.find((l) => l.sectionId === sec.id)?.id,
      td(sec.label),
    ])
  );

  return (
    <div className="view-enter flex min-h-0 flex-1 flex-col">
      <ScreenHeader
        title={song.title}
        subtitle={version.label ? `${col.name} · ${td(version.label)}` : col.name}
      >
        <div
          className="flex rounded-full border border-line bg-surface p-[3px]"
          role="tablist"
          aria-label={t("Cách xem lời")}
        >
          {(
            [
              ["karaoke", t("Lời")],
              ["sheet", t("Trang lời")],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={mode === id}
              onClick={() => setMode(id)}
              className={cn(
                "press h-11 rounded-full px-3 font-sans text-[13px] font-medium",
                mode === id
                  ? "bg-accent text-on-accent"
                  : "text-muted hover:text-ink"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </ScreenHeader>

      <div className="flex shrink-0 items-center gap-2 border-b border-line px-4 py-2 lg:px-6">
        {song.versions && song.versions.length > 1 ? (
          <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto" role="group" aria-label={t("Phiên bản")}>
            {song.versions.map((v, i) => (
              <button
                key={v.label}
                type="button"
                aria-pressed={i === versionIndex}
                onClick={() => void setVersion(i)}
                className={cn(
                  "press h-11 shrink-0 rounded-full border px-3.5 font-sans text-[13px] font-semibold",
                  i === versionIndex
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-line bg-surface text-muted hover:text-ink",
                )}
              >
                {td(v.label)}
                {v.durationMs ? (
                  <span className="ml-1.5 hidden font-normal tabular-nums opacity-70 sm:inline">
                    {formatTime(v.durationMs)}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex-1" />
        )}
        <SongActions />
      </div>

      <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 lg:grid lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-8 lg:px-6">
        <SongAside />

        <div
          ref={boxRef}
          className="lyric-stage min-h-0 flex-1 overflow-y-auto px-6 py-5 font-display lg:px-2"
          data-mode={mode}
        >
          {song.lines.length > 0 && !synced ? (
            <div className="py-16 text-center" data-unsynced>
              <p className="font-display text-xl font-semibold text-ink">
                {song.title}
              </p>
              <p className="mx-auto mt-2 max-w-sm font-sans text-sm leading-relaxed text-muted">
                {t("Lời của bản «{a}» chưa có trong ứng dụng. Lời chạy theo nhạc có ở bản «{b}».", {
                  a: td(version.label),
                  b: td(song.versions?.find((v) => v.synced)?.label ?? ""),
                })}
              </p>
            </div>
          ) : song.lines.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-display text-xl font-semibold text-ink">
                {song.title}
              </p>
              <p className="mx-auto mt-2 max-w-sm font-sans text-sm leading-relaxed text-muted">
                {t("Lời bài này chưa có trong ứng dụng. Vẫn nghe và hẹn giờ tắt nhạc được như thường.")}
              </p>
              <UpNext />
            </div>
          ) : (
            <div className="mx-auto max-w-2xl pb-[40vh] lg:pt-[12vh]">
              {song.lines.map((line, i) => {
                const label = sectionLabel.get(line.id);
                const isActive = i === active;
                const state = !karaoke
                  ? "sheet"
                  : isActive
                  ? "active"
                  : active >= 0 && i < active
                  ? "past"
                  : "upcoming";
                return (
                  <div key={line.id}>
                    {label ? (
                      <p className="mt-3.5 mb-2 font-sans text-[11px] font-bold tracking-[0.18em] text-accent uppercase">
                        {label}
                      </p>
                    ) : null}
                    <button
                      type="button"
                      data-state={state}
                      data-line={i}
                      onClick={() => {
                        seek(line.startMs + 1);
                        if (!playing) void play();
                      }}
                      className="lyric-line block w-full py-2.5 text-left"
                    >
                      {line.words.map((w, wi) => (
                        // Dấu cách thật giữa các chữ để khi sao chép hoặc đọc
                        // bằng trình đọc màn hình, các chữ không dính liền nhau.
                        <span key={wi}>
                          <span
                            data-sung={
                              isActive && wi <= wordIndex ? "" : undefined
                            }
                          >
                            {w.text}
                          </span>{" "}
                        </span>
                      ))}
                    </button>
                  </div>
                );
              })}
              <UpNext />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Cột trái trên máy tính: ảnh bìa, phong cách và các phần của bài */
function SongAside() {
  const song = useSong();
  const { t, td } = useT();
  const currentMs = usePlayer((s) => s.currentMs);
  const seekSection = usePlayer((s) => s.seekSection);

  const current = [...song.sections]
    .reverse()
    .find((s) => currentMs >= s.startMs)?.id;

  return (
    <aside className="hidden min-h-0 flex-col overflow-y-auto py-6 lg:flex">
      <Tilt className="aspect-square w-full shrink-0 overflow-hidden rounded-2xl border border-line bg-sunk shadow-song">
        {song.coverSrc ? (
          <img
            src={song.coverSrc}
            alt=""
            className="size-full object-cover object-[50%_15%]"
          />
        ) : (
          <span className="flex size-full items-center justify-center font-display text-6xl font-semibold text-subtle">
            {String(song.trackNo).padStart(2, "0")}
          </span>
        )}
      </Tilt>
      <p className="mt-4 font-sans text-xs text-muted">{td(songMeta(song))}</p>
      {song.style ? (
        <p className="mt-2 font-sans text-xs leading-relaxed text-muted">
          <span className="font-semibold text-ink">{t("Phong cách: ")}</span>
          {song.style}
        </p>
      ) : null}

      {song.sections.length ? (
        <>
          <p className="mt-6 font-sans text-[11px] font-bold tracking-[0.18em] text-muted uppercase">
            {t("Các phần")}
          </p>
          <div className="mt-2 flex flex-col gap-1">
            {song.sections.map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => seekSection(sec.id)}
                className={cn(
                  "press flex h-10 items-center justify-between rounded-xl px-3 font-sans text-sm",
                  current === sec.id
                    ? "bg-accent-soft font-semibold text-accent"
                    : "text-ink hover:bg-sunk"
                )}
              >
                <span>{td(sec.label)}</span>
                <span className="text-xs tabular-nums text-subtle">
                  {formatTime(sec.startMs)}
                </span>
              </button>
            ))}
          </div>
        </>
      ) : null}
    </aside>
  );
}

/** Yêu thích · lặp lại · chia sẻ — các nút của bài đang nghe */
function SongActions() {
  const song = useSong();
  const { t } = useT();
  const liked = usePlayer((s) => s.favorites.includes(s.songId));
  const toggleFavorite = usePlayer((s) => s.toggleFavorite);
  const repeat = usePlayer((s) => s.repeat);
  const cycleRepeat = usePlayer((s) => s.cycleRepeat);
  const repeatLabel =
    t(repeat === "one" ? "Lặp lại một bài" : repeat === "all" ? "Lặp lại cả danh sách" : "Không lặp lại");
  const btn = "press flex size-11 shrink-0 items-center justify-center rounded-full border";
  const off = "border-line bg-surface text-muted hover:text-ink";
  const on = "border-accent bg-accent-soft text-accent";

  return (
    <div className="relative flex shrink-0 gap-1.5">
      <button
        type="button"
        onClick={() => toggleFavorite(song.id)}
        aria-pressed={liked}
        aria-label={liked ? t("Bỏ khỏi Yêu thích") : t("Thêm vào Yêu thích")}
        title={`${liked ? t("Bỏ khỏi Yêu thích") : t("Thêm vào Yêu thích")} (L)`}
        className={cn(btn, liked ? on : off)}
      >
        <Heart className={cn("size-4", liked && "fill-current")} />
      </button>
      <button
        type="button"
        onClick={cycleRepeat}
        aria-label={repeatLabel}
        title={repeatLabel}
        data-repeat={repeat}
        className={cn(btn, repeat === "off" ? off : on)}
      >
        {repeat === "one" ? <Repeat1 className="size-4" /> : <Repeat className="size-4" />}
      </button>
      <QueueButton className={off} />
      <SongMenuButton song={song} className={cn(btn, off)} />
    </div>
  );
}

/** "Tiếp theo: …" — bấm để chuyển ngay sang bài đó */
function UpNext() {
  const { t } = useT();
  const next = useUpNext();
  const goNext = usePlayer((s) => s.next);
  if (!next) return null;
  return (
    <button
      type="button"
      onClick={() => void goNext()}
      data-up-next
      className="press mx-auto mt-10 flex max-w-sm items-center gap-3 rounded-2xl border border-line bg-surface/80 p-2.5 pr-4 text-left shadow-song backdrop-blur-sm"
    >
      <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-sunk font-display text-[13px] font-semibold text-subtle">
        {next.coverSrc ? (
          <img src={next.coverSrc} alt="" className="size-full object-cover object-[50%_15%]" />
        ) : (
          String(next.trackNo).padStart(2, "0")
        )}
      </span>
      <span className="min-w-0">
        <span className="block font-sans text-[10px] font-bold tracking-[0.18em] text-accent uppercase">
          {t("Tiếp theo")}
        </span>
        <span className="block truncate font-display text-[15px] font-semibold text-ink">{next.title}</span>
      </span>
    </button>
  );
}
