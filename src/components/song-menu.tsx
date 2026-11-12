import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { create } from "zustand";
import {
  ArrowDown,
  ArrowUp,
  Gauge,
  Heart,
  ListEnd,
  ListMusic,
  ListPlus,
  ListStart,
  MoreHorizontal,
  Plus,
  Share2,
  X,
} from "lucide-react";
import type { Song } from "@/lib/catalog";
import { SONG_INDEX, collectionOf } from "@/lib/library";
import { RATES, shareLink, usePlayer, useUpNext } from "@/lib/player-store";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";

/* ── Thông báo nhỏ ở cạnh dưới ("Đã thêm vào hàng chờ") ─────────────── */

const useToast = create<{ text: string | null; at: number }>(() => ({ text: null, at: 0 }));

export function toast(text: string) {
  useToast.setState({ text, at: Date.now() });
}

export function Toaster() {
  const { text, at } = useToast();
  useEffect(() => {
    if (!text) return;
    const id = window.setTimeout(() => useToast.setState({ text: null }), 2200);
    return () => clearTimeout(id);
  }, [text, at]);
  if (!text) return null;
  return (
    <p
      role="status"
      data-toast
      className="pointer-events-none fixed bottom-28 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-4 py-2.5 font-sans text-[13px] whitespace-nowrap text-paper shadow-lift"
    >
      {text}
    </p>
  );
}

/** Chia sẻ một bài: bảng chia sẻ của máy, hoặc chép đường link */
export async function shareSong(song: Song, t: (k: string) => string) {
  const url = shareLink(song.id);
  try {
    if (navigator.share) {
      await navigator.share({ title: song.title, text: `${song.title} · Chansonia`, url });
      return;
    }
    await navigator.clipboard.writeText(url);
    toast(t("Đã chép đường link của bài"));
  } catch (e) {
    if ((e as Error)?.name !== "AbortError") toast(t("Không chia sẻ được"));
  }
}

/* ── Tấm trượt lên từ cạnh dưới ─────────────────────────────────────── */

export function Sheet({
  title,
  subtitle,
  onClose,
  children,
  label,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    ref.current?.querySelector<HTMLElement>("button")?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-40 flex items-end justify-center">
      <div className="sheet-scrim absolute inset-0" onClick={onClose} aria-hidden />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className="sheet pb-safe-sheet relative flex max-h-[85dvh] w-full max-w-md flex-col rounded-t-3xl bg-surface px-5 pt-2.5 shadow-lift"
      >
        <div className="mx-auto mb-3 h-1 w-10 shrink-0 rounded-full bg-line" aria-hidden />
        <div className="flex shrink-0 items-start gap-3">
          <div className="min-w-0 flex-1">
            <h2 className="truncate font-display text-[19px] font-semibold text-ink">{title}</h2>
            {subtitle ? <p className="mt-0.5 truncate font-sans text-[13px] text-muted">{subtitle}</p> : null}
          </div>
          <CloseButton onClose={onClose} />
        </div>
        <div className="-mx-5 mt-3 min-h-0 overflow-y-auto px-5 pb-1">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

function CloseButton({ onClose }: { onClose: () => void }) {
  const { t } = useT();
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label={t("Đóng")}
      className="press -mt-1 -mr-2 flex size-11 shrink-0 items-center justify-center rounded-full text-muted hover:text-ink"
    >
      <X className="size-5" />
    </button>
  );
}

function MenuItem({
  icon,
  children,
  onClick,
  pressed,
}: {
  icon: ReactNode;
  children: ReactNode;
  onClick: () => void;
  pressed?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className="press flex h-12 w-full items-center gap-3.5 rounded-xl px-2 text-left font-sans text-[15px] text-ink hover:bg-sunk"
    >
      <span className={cn("flex size-5 items-center justify-center", pressed ? "text-accent" : "text-muted")}>{icon}</span>
      {children}
    </button>
  );
}

/* ── Menu "⋯" của một bài ───────────────────────────────────────────── */

export function SongMenuButton({ song, className }: { song: Song; className?: string }) {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("Thêm thao tác cho «{t}»", { t: song.title })}
        aria-haspopup="dialog"
        data-song-menu={song.id}
        className={cn(
          "press flex size-11 shrink-0 items-center justify-center rounded-full text-muted hover:text-ink",
          className,
        )}
      >
        <MoreHorizontal className="size-5" />
      </button>
      {open ? <SongMenu song={song} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

function SongMenu({ song, onClose }: { song: Song; onClose: () => void }) {
  const { t } = useT();
  const [page, setPage] = useState<"main" | "playlists">("main");
  const liked = usePlayer((s) => s.favorites.includes(song.id));
  const isCurrent = usePlayer((s) => s.songId === song.id);
  const rate = usePlayer((s) => s.rate);
  const p = usePlayer.getState();

  const done = (msg: string) => {
    toast(msg);
    onClose();
  };

  return (
    <Sheet
      label={t("Thao tác cho «{t}»", { t: song.title })}
      title={song.title}
      subtitle={collectionOf(song.id).name}
      onClose={onClose}
    >
      {page === "main" ? (
        <div className="flex flex-col">
          <MenuItem icon={<ListStart className="size-5" />} onClick={() => { p.playNext(song.id); done(t("Sẽ phát tiếp theo")); }}>
            {t("Phát tiếp theo")}
          </MenuItem>
          <MenuItem icon={<ListEnd className="size-5" />} onClick={() => { p.addToQueue(song.id); done(t("Đã thêm vào hàng chờ")); }}>
            {t("Thêm vào hàng chờ")}
          </MenuItem>
          <MenuItem icon={<ListPlus className="size-5" />} onClick={() => setPage("playlists")}>
            {t("Thêm vào playlist")}
          </MenuItem>
          <MenuItem
            icon={<Heart className={cn("size-5", liked && "fill-current")} />}
            pressed={liked}
            onClick={() => {
              p.toggleFavorite(song.id);
              done(liked ? t("Đã bỏ khỏi Yêu thích") : t("Đã thêm vào Yêu thích"));
            }}
          >
            {liked ? t("Bỏ khỏi Yêu thích") : t("Thêm vào Yêu thích")}
          </MenuItem>
          <MenuItem icon={<Share2 className="size-5" />} onClick={() => { onClose(); void shareSong(song, t); }}>
            {t("Chia sẻ bài này")}
          </MenuItem>

          {isCurrent ? (
            <div className="mt-2 border-t border-line pt-3" data-rate>
              <p className="flex items-center gap-2 px-2 font-sans text-[11px] font-bold tracking-[0.18em] text-muted uppercase">
                <Gauge className="size-4" aria-hidden />
                {t("Tốc độ phát")}
              </p>
              <div className="mt-2 grid grid-cols-4 gap-2" role="group" aria-label={t("Tốc độ phát")}>
                {RATES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    aria-pressed={r === rate}
                    onClick={() => p.setRate(r)}
                    className={cn(
                      "press h-11 rounded-xl border font-sans text-sm font-semibold tabular-nums",
                      r === rate ? "border-accent bg-accent text-on-accent" : "border-line bg-paper text-ink",
                    )}
                  >
                    {r}×
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <PlaylistPicker songId={song.id} onDone={done} />
      )}
    </Sheet>
  );
}

/** Chọn playlist để thêm bài, hoặc tạo playlist mới ngay tại chỗ */
function PlaylistPicker({ songId, onDone }: { songId: string; onDone: (msg: string) => void }) {
  const { t } = useT();
  const playlists = usePlayer((s) => s.playlists);
  const [name, setName] = useState("");
  const p = usePlayer.getState();

  const add = (id: string, plName: string) => {
    const added = usePlayer.getState().addToPlaylist(id, songId);
    onDone(added ? t("Đã thêm vào «{n}»", { n: plName }) : t("Bài đã có trong «{n}»", { n: plName }));
  };

  return (
    <div className="flex flex-col" data-playlist-picker>
      <form
        className="mb-2 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const clean = name.trim();
          if (!clean) return;
          add(p.createPlaylist(clean), clean);
        }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
          placeholder={t("Tên playlist mới")}
          aria-label={t("Tên playlist mới")}
          className="h-11 min-w-0 flex-1 rounded-full border border-line bg-paper px-4 font-sans text-sm text-ink outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="press flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-accent px-4 font-sans text-sm font-semibold text-on-accent disabled:opacity-40"
        >
          <Plus className="size-4" />
          {t("Tạo")}
        </button>
      </form>
      {playlists.map((pl) => (
        <MenuItem key={pl.id} icon={<ListMusic className="size-5" />} onClick={() => add(pl.id, pl.name)}>
          <span className="min-w-0 flex-1 truncate">{pl.name}</span>
          <span className="font-sans text-xs text-subtle tabular-nums">{t("{n} bài", { n: pl.songs.length })}</span>
        </MenuItem>
      ))}
      {playlists.length === 0 ? (
        <p className="px-2 py-3 font-sans text-[13px] text-muted">{t("Chưa có playlist nào. Đặt tên rồi bấm Tạo.")}</p>
      ) : null}
    </div>
  );
}

/* ── Hàng chờ ───────────────────────────────────────────────────────── */

export function QueueButton({ className }: { className?: string }) {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const count = usePlayer((s) => s.queue.length);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={count ? t("Hàng chờ · {n} bài", { n: count }) : t("Hàng chờ")}
        title={t("Hàng chờ")}
        aria-haspopup="dialog"
        data-queue-button
        className={cn("press relative flex size-11 shrink-0 items-center justify-center rounded-full border", className)}
      >
        <ListMusic className="size-4" />
        {count ? (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 font-sans text-[10px] font-bold text-on-accent tabular-nums">
            {count}
          </span>
        ) : null}
      </button>
      {open ? <QueueSheet onClose={() => setOpen(false)} /> : null}
    </>
  );
}

function QueueSheet({ onClose }: { onClose: () => void }) {
  const { t } = useT();
  const songId = usePlayer((s) => s.songId);
  const queue = usePlayer((s) => s.queue);
  const p = usePlayer.getState();
  const upNext = useUpNext();
  const current = SONG_INDEX[songId];
  const fromCollection = queue.length === 0 ? upNext : null;
  const iconBtn = "press flex size-10 shrink-0 items-center justify-center rounded-full text-muted hover:text-ink disabled:opacity-30";

  return (
    <Sheet label={t("Hàng chờ")} title={t("Hàng chờ")} onClose={onClose}>
      <p className="font-sans text-[11px] font-bold tracking-[0.18em] text-accent uppercase">{t("Đang phát")}</p>
      {current ? <QueueRow song={current} /> : null}

      <div className="mt-4 flex items-center justify-between">
        <p className="font-sans text-[11px] font-bold tracking-[0.18em] text-muted uppercase">
          {t("Tiếp theo trong hàng chờ · {n}", { n: queue.length })}
        </p>
        {queue.length ? (
          <button
            type="button"
            onClick={() => p.clearQueue()}
            className="press rounded-full px-2 py-1 font-sans text-xs font-semibold text-accent"
          >
            {t("Xoá hàng chờ")}
          </button>
        ) : null}
      </div>
      <ol data-queue>
        {queue.map((id, i) => {
          const song = SONG_INDEX[id];
          if (!song) return null;
          return (
            <li key={`${id}-${i}`} className="flex items-center gap-1">
              <QueueRow song={song} onPlay={() => { p.removeFromQueue(i); void p.playSong(id); }} />
              <button type="button" className={iconBtn} disabled={i === 0} onClick={() => p.moveInQueue(i, i - 1)} aria-label={t("Đưa lên")}>
                <ArrowUp className="size-4" />
              </button>
              <button type="button" className={iconBtn} disabled={i === queue.length - 1} onClick={() => p.moveInQueue(i, i + 1)} aria-label={t("Đưa xuống")}>
                <ArrowDown className="size-4" />
              </button>
              <button type="button" className={iconBtn} onClick={() => p.removeFromQueue(i)} aria-label={t("Bỏ khỏi hàng chờ")}>
                <X className="size-4" />
              </button>
            </li>
          );
        })}
      </ol>
      {queue.length === 0 ? (
        <p className="py-2 font-sans text-[13px] text-muted">
          {t("Hàng chờ trống. Bấm ⋯ ở một bài để chọn «Phát tiếp theo» hoặc «Thêm vào hàng chờ».")}
        </p>
      ) : null}

      {fromCollection ? (
        <>
          <p className="mt-4 font-sans text-[11px] font-bold tracking-[0.18em] text-muted uppercase">
            {t("Sau đó, từ {c}", { c: collectionOf(fromCollection.id).name })}
          </p>
          <QueueRow song={fromCollection} />
        </>
      ) : null}
    </Sheet>
  );
}

function QueueRow({ song, onPlay }: { song: Song; onPlay?: () => void }) {
  const inner = (
    <>
      <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-[9px] border border-line bg-sunk font-display text-xs text-subtle">
        {song.coverSrc ? <img src={song.coverSrc} alt="" className="size-full object-cover object-[50%_15%]" /> : "♪"}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-display text-[15px] font-bold text-ink">{song.title}</span>
        <span className="block truncate font-sans text-xs text-muted">{collectionOf(song.id).name}</span>
      </span>
    </>
  );
  return onPlay ? (
    <button type="button" onClick={onPlay} className="press flex min-w-0 flex-1 items-center gap-3 py-1.5 text-left">
      {inner}
    </button>
  ) : (
    <div className="flex min-w-0 flex-1 items-center gap-3 py-1.5">{inner}</div>
  );
}
