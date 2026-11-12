import { useMemo } from "react";
import { ArrowUpRight, Play, Search, Shuffle, X } from "lucide-react";
import { ARTIST } from "@/lib/artist";
import { Tilt } from "@/components/depth";
import { formatTime, songMeta, type Song } from "@/lib/catalog";
import {
  COLLECTIONS,
  COLLECTION_BY_ID,
  SONG_INDEX,
  collectionOf,
  type Collection,
  type Video,
} from "@/lib/library";
import { usePlayer } from "@/lib/player-store";
import { cn, normalizeVi } from "@/lib/utils";

/** Phần chữ tìm được của mỗi bài: tên, dòng phụ và cả lời hát (nếu có). */
const SONG_TEXT = new Map<string, string>(
  COLLECTIONS.flatMap((c) =>
    c.songs.map((s) => [
      s.id,
      normalizeVi(
        [
          s.title,
          songMeta(s),
          s.subtitle,
          s.lines.map((l) => l.words.map((w) => w.text).join(" ")).join("\n"),
        ].join("\n")
      ),
    ])
  )
);

const videoText = (v: Video) => normalizeVi(`${v.title}\n${v.meta}`);

/**
 * Thư viện — ba bộ sưu tập (La maison de Madam Hương · BizOnland · M-AIDA), mỗi bộ có Bài hát và
 * Video. Trên điện thoại là một cột: nút chọn bộ sưu tập, tên bộ, ô tìm kiếm,
 * công tắc Bài hát/Video rồi danh sách. Trên máy tính thêm cột trái 360px giới
 * thiệu bộ sưu tập.
 */
export function LibraryView() {
  const collectionId = usePlayer((s) => s.collectionId);
  const tab = usePlayer((s) => s.libraryTab);
  const query = usePlayer((s) => s.query);
  const setQuery = usePlayer((s) => s.setQuery);
  const setTab = usePlayer((s) => s.setLibraryTab);
  const favorites = usePlayer((s) => s.favorites);

  const col = COLLECTION_BY_ID[collectionId];
  const needle = normalizeVi(query.trim());

  const songs = useMemo(
    () =>
      col.songs
        .map((song, index) => ({ song, index }))
        .filter(
          ({ song }) =>
            !needle || (SONG_TEXT.get(song.id) ?? "").includes(needle)
        ),
    [col, needle]
  );
  const videos = useMemo(
    () => col.videos.filter((v) => !needle || videoText(v).includes(needle)),
    [col, needle]
  );

  // Đang tìm thì cho thấy cả bài khớp ở hai bộ sưu tập còn lại.
  const elsewhere = useMemo(
    () =>
      !needle
        ? []
        : COLLECTIONS.filter((c) => c.id !== col.id).flatMap((c) =>
            c.songs
              .map((song, index) => ({ song, index }))
              .filter(({ song }) => (SONG_TEXT.get(song.id) ?? "").includes(needle)),
          ),
    [col, needle],
  );

  // Yêu thích: gom từ cả ba bộ sưu tập, bài đánh dấu gần nhất lên đầu.
  const liked = useMemo(
    () =>
      favorites
        .map((id) => SONG_INDEX[id])
        .filter(Boolean)
        .filter((song) => !needle || (SONG_TEXT.get(song.id) ?? "").includes(needle))
        .map((song) => ({ song, index: collectionOf(song.id).songs.indexOf(song) })),
    [favorites, needle],
  );

  const empty =
    tab === "songs" ? songs.length === 0 && elsewhere.length === 0 : tab === "videos" ? videos.length === 0 : liked.length === 0;

  return (
    <div className="view-enter mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col lg:grid lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-8 lg:px-6 lg:pb-4">
      <CollectionPanel col={col} />

      <section className="flex min-h-0 flex-1 flex-col" aria-label={col.name}>
        <CollectionTabs />

        <div className="flex items-center gap-3 px-4 pt-3 lg:hidden">
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-xl leading-tight font-semibold text-ink">
              {col.name}
            </h2>
            <p className="mt-0.5 font-sans text-xs text-muted">{col.desc}</p>
          </div>
          <ShuffleToggle />
        </div>

        <div className="flex flex-col gap-2 px-4 pt-2.5 lg:px-0">
          <label className="flex h-11 items-center gap-2.5 rounded-full border border-line bg-surface px-3.5 focus-within:border-accent">
            <Search className="size-4 shrink-0 text-subtle" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm tên bài…"
              aria-label="Tìm trong bộ sưu tập"
              className="min-w-0 flex-1 bg-transparent font-sans text-sm text-ink outline-none placeholder:text-subtle"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Xoá từ khoá"
                className="press -mr-1.5 flex size-8 items-center justify-center rounded-full text-subtle hover:text-ink"
              >
                <X className="size-4" />
              </button>
            ) : null}
          </label>

          <div
            className="flex rounded-full border border-line bg-surface p-[3px]"
            role="tablist"
            aria-label="Loại nội dung"
          >
            {(
              [
                ["songs", `Bài hát · ${col.songs.length}`],
                ["videos", `Video · ${col.videos.length}`],
                ["favorites", `♥ ${favorites.length}`],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                aria-label={id === "favorites" ? `Yêu thích · ${favorites.length}` : undefined}
                onClick={() => setTab(id)}
                className={cn(
                  "press h-11 flex-1 rounded-full font-sans text-[13px] font-semibold",
                  tab === id ? "bg-ink text-paper" : "text-muted hover:text-ink"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div
          className="min-h-0 flex-1 overflow-y-auto px-4 pt-1 pb-2 lg:px-0"
          data-library-list
        >
          {tab === "songs"
            ? (
                <>
                  {songs.map(({ song, index }) => (
                    <SongRow key={song.id} song={song} index={index} />
                  ))}
                  {elsewhere.length ? (
                    <section aria-label="Ở bộ sưu tập khác" data-elsewhere>
                      <p className="mt-5 mb-1 font-sans text-[11px] font-bold tracking-[0.18em] text-muted uppercase">
                        Ở bộ sưu tập khác · {elsewhere.length}
                      </p>
                      {elsewhere.map(({ song, index }) => (
                        <SongRow key={song.id} song={song} index={index} showCollection />
                      ))}
                    </section>
                  ) : null}
                </>
              )
            : tab === "favorites"
              ? liked.map(({ song, index }) => (
                  <SongRow key={song.id} song={song} index={index} showCollection />
                ))
              : videos.map((v) => (
                <VideoRow key={v.id} video={v} collectionId={col.id} />
              ))}

          {empty ? (
            <div className="py-8 text-center">
              <p className="font-display text-base text-muted">
                {query
                  ? "Không có gì khớp."
                  : tab === "videos"
                    ? "Chưa có video."
                    : tab === "favorites"
                      ? "Chưa có bài yêu thích. Bấm ♥ ở màn hình nghe để thêm."
                      : "Chưa có bài hát."}
              </p>
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="press mt-3 rounded-full border border-line bg-surface px-4 py-2 font-sans text-xs font-semibold text-ink"
                >
                  Xem lại tất cả
                </button>
              ) : null}
            </div>
          ) : null}

          <DoiLink />
        </div>
      </section>
    </div>
  );
}

/** Ba nút chọn bộ sưu tập — nút đang chọn tô màu riêng của bộ đó */
function CollectionTabs() {
  const collectionId = usePlayer((s) => s.collectionId);
  const setCollection = usePlayer((s) => s.setCollection);
  return (
    <div
      className="flex gap-1.5 px-4 lg:px-0 lg:pt-1"
      role="tablist"
      aria-label="Bộ sưu tập"
    >
      {COLLECTIONS.map((c) => {
        const on = c.id === collectionId;
        return (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => setCollection(c.id)}
            className={cn(
              "press min-h-11 flex-1 rounded-xl border px-1.5 py-1 font-sans text-[13px] leading-tight font-semibold",
              on
                ? "text-white"
                : "border-line bg-surface text-muted hover:text-ink"
            )}
            style={
              on ? { background: c.color, borderColor: c.color } : undefined
            }
          >
            {c.short}
          </button>
        );
      })}
    </div>
  );
}

/** Nút phát ngẫu nhiên — bật thì bài kế tiếp là một bài bất kỳ khác trong bộ sưu tập */
function ShuffleToggle({ withLabel = false }: { withLabel?: boolean }) {
  const playOrder = usePlayer((s) => s.playOrder);
  const setPlayOrder = usePlayer((s) => s.setPlayOrder);
  const on = playOrder === "shuffle";
  return (
    <button
      type="button"
      onClick={() => setPlayOrder(on ? "sequential" : "shuffle")}
      aria-pressed={on}
      aria-label="Phát ngẫu nhiên"
      title="Phát ngẫu nhiên"
      className={cn(
        "press flex h-11 shrink-0 items-center justify-center gap-2 rounded-full border font-sans text-sm font-semibold",
        withLabel ? "px-4" : "w-11",
        on
          ? "border-accent bg-accent-soft text-accent"
          : "border-line bg-surface text-muted hover:text-ink"
      )}
    >
      <Shuffle className="size-4" />
      {withLabel ? <span>Ngẫu nhiên</span> : null}
    </button>
  );
}

/** Cột trái trên máy tính: ảnh, tên và mô tả bộ sưu tập, nút phát từ đầu */
function CollectionPanel({ col }: { col: Collection }) {
  const playSong = usePlayer((s) => s.playSong);
  const setView = usePlayer((s) => s.setView);
  return (
    <aside className="hidden min-h-0 flex-col overflow-y-auto pt-1 lg:flex">
      <Tilt
        className="relative aspect-[4/3.4] w-full overflow-hidden rounded-2xl border border-line shadow-song"
        style={{
          background: col.art
            ? undefined
            : `radial-gradient(circle at 30% 25%, color-mix(in srgb, ${col.color} 70%, transparent), transparent 65%), linear-gradient(160deg, var(--sunk), var(--surface))`,
        }}
      >
        {col.art ? (
          <img src={col.art} alt="" className="size-full object-cover" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center font-display text-5xl font-semibold text-ink/70">
            {col.short}
          </span>
        )}
      </Tilt>
      <p
        className="mt-5 font-sans text-[11px] font-bold tracking-[0.18em] uppercase"
        style={{ color: col.color }}
      >
        {col.songs.length} bài hát · {col.videos.length} video
      </p>
      <h2 className="mt-1.5 font-display text-[28px] leading-tight font-semibold text-ink">
        {col.name}
      </h2>
      <p className="mt-1.5 font-sans text-sm text-muted">{col.desc}</p>
      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={() => {
            setView("player");
            void playSong(col.songs[0].id);
          }}
          className="press flex h-11 items-center gap-2 rounded-full bg-accent px-5 font-sans text-sm font-semibold text-white shadow-song"
        >
          <Play className="size-4 fill-current" />
          Phát từ đầu
        </button>
        <ShuffleToggle withLabel />
      </div>
    </aside>
  );
}

function SongRow({
  song,
  index,
  showCollection = false,
}: {
  song: Song;
  index: number;
  showCollection?: boolean;
}) {
  const liked = usePlayer((s) => s.favorites.includes(song.id));
  const songId = usePlayer((s) => s.songId);
  const playing = usePlayer((s) => s.playing);
  const openSong = usePlayer((s) => s.openSong);
  const active = song.id === songId;
  const meta =
    (showCollection ? `${collectionOf(song.id).name} · ` : "") +
    songMeta(song) +
    (song.versions && song.versions.length > 1 ? " · 2 phiên bản" : "") +
    (liked && !showCollection ? " · ♥" : "");

  return (
    <button
      type="button"
      onClick={() => void openSong(song.id)}
      data-song-id={song.id}
      data-current={active || undefined}
      aria-current={active ? "true" : undefined}
      className="row grid w-full grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3 border-b border-line py-2 text-left"
    >
      <Thumb
        src={song.coverSrc}
        badge={String(index + 1).padStart(2, "0")}
        active={active}
      />
      <span className="min-w-0">
        <span className="block truncate font-display text-[15px] leading-tight font-bold text-ink">
          {song.title}
        </span>
        <span
          className={cn(
            "block truncate font-sans text-xs",
            active ? "text-accent" : "text-muted"
          )}
        >
          {active ? (playing ? "Đang phát · " : "Tạm dừng · ") : ""}
          {meta}
        </span>
      </span>
      <span className="font-sans text-xs text-subtle tabular-nums">
        {song.durationMs ? formatTime(song.durationMs) : ""}
      </span>
    </button>
  );
}

function VideoRow({
  video,
  collectionId,
}: {
  video: Video;
  collectionId: Collection["id"];
}) {
  const openVideo = usePlayer((s) => s.openVideo);
  return (
    <button
      type="button"
      onClick={() => openVideo(collectionId, video.id)}
      data-video-id={video.id}
      className="row grid w-full grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3 border-b border-line py-2 text-left"
    >
      <Thumb src={video.poster} badge="▶" />
      <span className="min-w-0">
        <span className="block truncate font-display text-[15px] leading-tight font-bold text-ink">
          {video.title}
        </span>
        <span className="block truncate font-sans text-xs text-muted">
          {video.meta}
        </span>
      </span>
      <span className="font-sans text-xs text-subtle tabular-nums">
        {video.duration ?? ""}
      </span>
    </button>
  );
}

/** Ô ảnh 44×44 — ảnh bìa, hoặc số thứ tự bài trên nền lõm khi chưa có ảnh */
function Thumb({
  src,
  badge,
  active,
}: {
  src?: string;
  badge: string;
  active?: boolean;
}) {
  return (
    <span
      className={cn(
        "flex size-11 items-center justify-center overflow-hidden rounded-[10px] border bg-sunk font-display text-[13px] font-semibold text-subtle",
        active ? "border-accent" : "border-line"
      )}
    >
      {src ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          className="size-full object-cover object-[50%_15%]"
        />
      ) : (
        badge
      )}
    </span>
  );
}

/** Mã DOI của Chansonia trên Zenodo — để trích dẫn ứng dụng */
function DoiLink() {
  return (
    <a
      href={`https://doi.org/${ARTIST.doi}`}
      target="_blank"
      rel="noreferrer noopener"
      data-doi
      className="press mt-4 mb-2 flex items-center justify-center gap-2 rounded-full py-2 font-sans text-xs text-muted hover:text-ink"
    >
      <span className="rounded-md bg-accent-2 px-1.5 py-0.5 text-[10px] font-bold tracking-[0.14em] text-paper">
        DOI
      </span>
      <span className="tabular-nums">{ARTIST.doi}</span>
      <ArrowUpRight className="size-3.5" aria-hidden />
    </a>
  );
}
