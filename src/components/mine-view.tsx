import { useMemo, useState, type ReactNode } from "react";
import { create } from "zustand";
import { ChevronLeft, ListMusic, Pencil, Play, Plus, Trash2, X } from "lucide-react";
import { SONG_INDEX, collectionOf } from "@/lib/library";
import { usePlayer, type Playlist } from "@/lib/player-store";
import { SongRow } from "@/components/library-view";
import { toast } from "@/components/song-menu";
import { useT } from "@/lib/i18n";

/** Số bài hiện trong «Nghe gần đây» và «Nghe nhiều nhất» */
const SHOW = 5;

/** Playlist đang mở — giữ lại khi sang màn hình nghe rồi quay về */
const useOpenPlaylist = create<{ id: string | null }>(() => ({ id: null }));
const setOpenId = (id: string | null) => useOpenPlaylist.setState({ id });

const indexOf = (id: string) => collectionOf(id).songs.findIndex((s) => s.id === id);

/**
 * Mục «Của tôi»: nghe gần đây, nghe nhiều nhất và playlist tự tạo. Mọi thứ
 * lưu trong máy (localStorage), không có tài khoản.
 */
export function MineView() {
  const { t } = useT();
  const recent = usePlayer((s) => s.recent);
  const plays = usePlayer((s) => s.plays);
  const playlists = usePlayer((s) => s.playlists);
  const clearRecent = usePlayer((s) => s.clearRecent);
  const openId = useOpenPlaylist((s) => s.id);

  const top = useMemo(
    () =>
      Object.entries(plays)
        .filter(([id]) => SONG_INDEX[id])
        .sort((a, b) => b[1] - a[1])
        .slice(0, SHOW),
    [plays],
  );

  const open = playlists.find((p) => p.id === openId);
  if (open) return <PlaylistDetail pl={open} onBack={() => setOpenId(null)} />;

  return (
    <div data-mine>
      <Section title={t("Playlist của tôi")} label="playlists">
        <NewPlaylist onCreated={setOpenId} />
        {playlists.map((pl) => (
          <button
            key={pl.id}
            type="button"
            onClick={() => setOpenId(pl.id)}
            data-playlist={pl.id}
            className="row flex w-full items-center gap-3 border-b border-line py-2 text-left"
          >
            <PlaylistArt pl={pl} />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-display text-[15px] font-bold text-ink">{pl.name}</span>
              <span className="block font-sans text-xs text-muted">{t("{n} bài", { n: pl.songs.length })}</span>
            </span>
          </button>
        ))}
      </Section>

      <Section
        title={t("Nghe nhiều nhất")}
        label="top"
      >
        {top.length ? (
          top.map(([id, n]) => (
            <div key={id} className="relative">
              <SongRow song={SONG_INDEX[id]} index={indexOf(id)} showCollection />
              <span className="pointer-events-none absolute bottom-1.5 left-0 rounded-full bg-accent px-1.5 font-sans text-[10px] font-bold text-on-accent tabular-nums">
                {t("{n} lần", { n })}
              </span>
            </div>
          ))
        ) : (
          <Empty>{t("Nghe vài bài là danh sách này tự có.")}</Empty>
        )}
      </Section>

      <Section
        title={t("Nghe gần đây")}
        label="recent"
        action={
          recent.length ? (
            <button
              type="button"
              onClick={() => {
                clearRecent();
                toast(t("Đã xoá lịch sử nghe"));
              }}
              className="press rounded-full px-2 py-1 font-sans text-xs font-semibold text-accent"
            >
              {t("Xoá lịch sử")}
            </button>
          ) : null
        }
      >
        {recent.length ? (
          recent.slice(0, SHOW).map((id) => <SongRow key={id} song={SONG_INDEX[id]} index={indexOf(id)} showCollection />)
        ) : (
          <Empty>{t("Chưa nghe bài nào.")}</Empty>
        )}
      </Section>
    </div>
  );
}

function Section({
  title,
  label,
  action,
  children,
}: {
  title: string;
  label: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section aria-label={title} data-section={label} className="mt-4 first:mt-2">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="font-sans text-[11px] font-bold tracking-[0.18em] text-muted uppercase">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return <p className="py-2 font-sans text-[13px] text-muted">{children}</p>;
}

/** Ảnh playlist: bìa bài đầu tiên, chưa có bài thì biểu tượng */
function PlaylistArt({ pl, big = false }: { pl: Playlist; big?: boolean }) {
  const cover = pl.songs.map((id) => SONG_INDEX[id]?.coverSrc).find(Boolean);
  return (
    <span
      className={
        (big ? "size-20 rounded-2xl" : "size-11 rounded-[10px]") +
        " flex shrink-0 items-center justify-center overflow-hidden border border-line bg-sunk text-subtle"
      }
    >
      {cover ? (
        <img src={cover} alt="" className="size-full object-cover object-[50%_15%]" />
      ) : (
        <ListMusic className={big ? "size-7" : "size-5"} />
      )}
    </span>
  );
}

function NewPlaylist({ onCreated }: { onCreated: (id: string) => void }) {
  const { t } = useT();
  const create = usePlayer((s) => s.createPlaylist);
  const [name, setName] = useState("");
  return (
    <form
      className="mb-1 flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;
        const id = create(name);
        setName("");
        onCreated(id);
      }}
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={60}
        placeholder={t("Tên playlist mới")}
        aria-label={t("Tên playlist mới")}
        className="h-11 min-w-0 flex-1 rounded-full border border-line bg-surface px-4 font-sans text-sm text-ink outline-none focus:border-accent"
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
  );
}

function PlaylistDetail({ pl, onBack }: { pl: Playlist; onBack: () => void }) {
  const { t } = useT();
  const playList = usePlayer((s) => s.playList);
  const rename = usePlayer((s) => s.renamePlaylist);
  const remove = usePlayer((s) => s.deletePlaylist);
  const removeSong = usePlayer((s) => s.removeFromPlaylist);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(pl.name);
  const [confirm, setConfirm] = useState(false);
  const songs = pl.songs.filter((id) => SONG_INDEX[id]);
  const iconBtn =
    "press flex size-11 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-muted hover:text-ink";

  return (
    <div data-playlist-detail={pl.id} className="pt-1">
      <button
        type="button"
        onClick={onBack}
        className="press -ml-2 flex h-11 items-center gap-1 rounded-full px-2 font-sans text-sm font-semibold text-muted hover:text-ink"
      >
        <ChevronLeft className="size-4" />
        {t("Của tôi")}
      </button>

      <div className="mt-1 flex items-center gap-3.5">
        <PlaylistArt pl={pl} big />
        <div className="min-w-0 flex-1">
          {editing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                rename(pl.id, name);
                setEditing(false);
              }}
            >
              <input
                autoFocus
                value={name}
                maxLength={60}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => {
                  rename(pl.id, name);
                  setEditing(false);
                }}
                aria-label={t("Tên playlist")}
                className="h-11 w-full rounded-xl border border-accent bg-surface px-3 font-display text-lg font-semibold text-ink outline-none"
              />
            </form>
          ) : (
            <h3 className="truncate font-display text-[22px] leading-tight font-semibold text-ink">{pl.name}</h3>
          )}
          <p className="mt-0.5 font-sans text-xs text-muted">{t("{n} bài", { n: songs.length })}</p>
        </div>
      </div>

      <div className="mt-3.5 flex gap-2">
        <button
          type="button"
          disabled={!songs.length}
          onClick={() => void playList(songs)}
          className="press flex h-11 items-center gap-2 rounded-full bg-accent px-5 font-sans text-sm font-semibold text-on-accent shadow-song disabled:opacity-40"
        >
          <Play className="size-4 fill-current" />
          {t("Phát playlist")}
        </button>
        <button type="button" onClick={() => setEditing(true)} aria-label={t("Đổi tên playlist")} className={iconBtn}>
          <Pencil className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            if (!confirm) {
              setConfirm(true);
              return;
            }
            remove(pl.id);
            toast(t("Đã xoá playlist «{n}»", { n: pl.name }));
            onBack();
          }}
          aria-label={confirm ? t("Bấm lần nữa để xoá") : t("Xoá playlist")}
          className={confirm ? iconBtn + " w-auto! border-accent px-3 text-xs font-semibold text-accent" : iconBtn}
        >
          {confirm ? t("Bấm lần nữa để xoá") : <Trash2 className="size-4" />}
        </button>
      </div>

      <div className="mt-3">
        {songs.map((id) => (
          <div key={id} className="flex items-center gap-1">
            <div className="min-w-0 flex-1">
              <SongRow song={SONG_INDEX[id]} index={indexOf(id)} showCollection />
            </div>
            <button
              type="button"
              onClick={() => removeSong(pl.id, id)}
              aria-label={t("Bỏ «{s}» khỏi playlist", { s: SONG_INDEX[id].title })}
              className="press flex size-10 shrink-0 items-center justify-center rounded-full text-muted hover:text-ink"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
        {songs.length === 0 ? (
          <p className="py-4 font-sans text-[13px] text-muted">
            {t("Playlist còn trống. Bấm ⋯ ở một bài rồi chọn «Thêm vào playlist».")}
          </p>
        ) : null}
      </div>
    </div>
  );
}
