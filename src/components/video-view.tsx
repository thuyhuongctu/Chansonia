import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { COLLECTION_BY_ID, type Video } from "@/lib/library";
import { usePlayer } from "@/lib/player-store";
import { ScreenHeader } from "@/components/header";
import { useT } from "@/lib/i18n";

/**
 * Màn hình video — khung 16:9, tên và dòng phụ, rồi danh sách "Video khác"
 * cùng bộ sưu tập. Mở video là nhạc tạm dừng; bấm phát nhạc lại thì video
 * dừng, để hai thứ không chồng tiếng lên nhau.
 *
 * Video MP4 phát thẳng trong app. Video YouTube chỉ tải trình phát khi người
 * xem bấm vào ảnh bìa (dùng youtube-nocookie.com).
 */
export function VideoView() {
  const { t, td } = useT();
  const sel = usePlayer((s) => s.video);
  const openVideo = usePlayer((s) => s.openVideo);

  const col = COLLECTION_BY_ID[sel?.collectionId ?? "huong"];
  const video = col.videos.find((v) => v.id === sel?.id) ?? col.videos[0];
  const more = col.videos.filter((v) => v.id !== video?.id);

  if (!video) return null;

  return (
    <div className="view-enter flex min-h-0 flex-1 flex-col">
      <ScreenHeader title={td(video.title)} subtitle={`${col.name} · ${t("Video")}`} />
      <div className="min-h-0 flex-1 overflow-y-auto p-4 lg:px-6">
        <div className="mx-auto max-w-3xl">
          <Frame key={video.id} video={video} />
          <h2 className="mt-4 font-display text-[22px] leading-tight font-semibold text-ink">
            {td(video.title)}
          </h2>
          <p className="mt-1 font-sans text-[13px] text-muted">
            {[td(video.meta), video.duration].filter(Boolean).join(" · ")}
          </p>

          {more.length ? (
            <>
              <p className="mt-6 mb-0.5 font-sans text-[11px] font-bold tracking-[0.18em] text-muted uppercase">
                {t("Video khác")}
              </p>
              {more.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => openVideo(col.id, v.id)}
                  data-video-id={v.id}
                  className="row flex min-h-12 w-full items-center justify-between gap-3 border-b border-line py-2 text-left"
                >
                  <span className="font-display text-[15px] leading-tight font-bold text-ink">
                    {td(v.title)}
                  </span>
                  <span className="shrink-0 font-sans text-xs text-subtle tabular-nums">
                    {v.duration ?? ""}
                  </span>
                </button>
              ))}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Frame({ video }: { video: Video }) {
  const { t, td } = useT();
  const pauseMusic = usePlayer((s) => s.pause);
  const musicPlaying = usePlayer((s) => s.playing);
  const ref = useRef<HTMLVideoElement>(null);
  const [embed, setEmbed] = useState(false);

  // Nhạc được bật lại từ thanh phát thì dừng video.
  useEffect(() => {
    if (musicPlaying) {
      ref.current?.pause();
      setEmbed(false);
    }
  }, [musicPlaying]);

  const box = "relative aspect-video w-full overflow-hidden rounded-[14px] bg-[#120e0b]";

  if (video.mp4) {
    return (
      <div className={box}>
        <video
          ref={ref}
          src={video.mp4}
          poster={video.poster}
          controls
          playsInline
          preload="metadata"
          onPlay={() => pauseMusic()}
          className="size-full object-contain"
        />
      </div>
    );
  }

  const src = video.playlist
    ? `https://www.youtube-nocookie.com/embed/videoseries?list=${video.playlist}&autoplay=1`
    : `https://www.youtube-nocookie.com/embed/${video.youtube}?autoplay=1&rel=0`;

  if (embed) {
    return (
      <div className={box}>
        <iframe
          src={src}
          title={video.title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="size-full border-0"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        pauseMusic();
        setEmbed(true);
      }}
      aria-label={t("Phát video {t} từ YouTube", { t: td(video.title) })}
      className={`${box} press flex flex-col items-center justify-center gap-2.5 bg-cover bg-center`}
      style={video.poster ? { backgroundImage: `url(${video.poster})` } : undefined}
    >
      <span className="flex size-14 items-center justify-center rounded-full bg-[#e08055] text-[#17130f] shadow-song">
        <Play className="size-6 translate-x-px fill-current" />
      </span>
      <span className="rounded-full bg-black/55 px-2.5 py-1 font-sans text-xs text-[#efe6d8]">
        {t("Bấm để phát · tải từ YouTube")}
      </span>
    </button>
  );
}
