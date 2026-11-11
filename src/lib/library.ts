/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  THƯ VIỆN — BA BỘ SƯU TẬP: Je m'appelle Hương · BizOn · M-AIDA        ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * Mỗi bộ sưu tập có hai danh sách: Bài hát và Video.
 *
 *  - Album «La lampe, le fleuve et les couleurs» (7 bài, có lời chạy theo
 *    nhạc) lấy từ src/songs/*.ts — nhạc nằm trong app (public/audio).
 *  - Các bài còn lại chưa có lời đồng bộ. Nhạc và video phát trực tuyến từ
 *    trang gốc của từng dự án, nên cần có mạng:
 *      · trang songbook:  jemappellehuong.com
 *      · trang BizOn:     bizonland.com  (danh mục: js/music-data.js của
 *                         kho thuyhuongctu/BizOn)
 *
 * THÊM BÀI: thêm một dòng vào danh sách của bộ sưu tập bên dưới. Bài có lời
 * đồng bộ thì làm theo src/songs/README.md rồi đưa vào ALBUM.
 */

import { compile, SONGS, type RawSong, type Song } from "@/lib/catalog";

export type CollectionId = "huong" | "bizon" | "maida";

export type Video = {
  id: string;
  title: string;
  /** Dòng phụ: loại video, bài liên quan… */
  meta: string;
  /** Độ dài in sẵn, ví dụ "1:30" */
  duration?: string;
  /** Tệp MP4 phát thẳng trong app */
  mp4?: string;
  /** Mã video YouTube */
  youtube?: string;
  /** Mã danh sách phát YouTube */
  playlist?: string;
  /** Ảnh bìa hiện trước khi phát */
  poster?: string;
};

export type Collection = {
  id: CollectionId;
  /** Tên ngắn trên nút chọn bộ sưu tập */
  short: string;
  name: string;
  desc: string;
  /** Màu của bộ sưu tập — nền nút đang chọn */
  color: string;
  /** Ảnh lớn ở cột trái trên máy tính (tuỳ chọn) */
  art?: string;
  songs: Song[];
  videos: Video[];
};

const SONGBOOK = "https://jemappellehuong.com/assets";
const BIZON = "https://bizonland.com/assets";

/** Đổi "5:13" thành mili-giây; không có thì 0 (app tự đọc độ dài khi phát) */
function ms(label?: string): number {
  if (!label) return 0;
  const [m, s] = label.split(":").map(Number);
  return (m * 60 + s) * 1000;
}

/** Một bài chưa có lời đồng bộ, phát trực tuyến */
function extra(
  id: string,
  trackNo: number,
  title: string,
  meta: string,
  audioSrc: string,
  duration?: string,
  more: Partial<RawSong> = {},
): Song {
  return compile({
    id,
    trackNo,
    title,
    subtitle: meta,
    meta,
    language: "",
    accent: "#8c8073",
    audioSrc,
    durationMs: ms(duration),
    sections: [],
    ...more,
  });
}

/* ── Je m'appelle Hương ──────────────────────────────────────────────── */

const HUONG: Collection = {
  id: "huong",
  short: "Hương",
  name: "Je m'appelle Hương",
  desc: "Album «La lampe, le fleuve et les couleurs» và một đĩa đơn",
  color: "var(--accent)",
  art: "art/music-cover-ba-cong-con.webp",
  songs: [
    ...SONGS,
    extra(
      "nha-van-sang-den",
      8,
      "Nhà vẫn sáng đèn",
      "Tiếng Việt · viết thêm sau album",
      `${SONGBOOK}/audio/nha-van-sang-den.mp3`,
      "7:19",
      { coverSrc: "art/ba-cong-con-tren-vai.webp", accent: "#3f6f68" },
    ),
    extra(
      "returning-to-shore",
      9,
      "Returning to Shore · Trở về bờ",
      "Đĩa đơn · 8 bản thu",
      `${SONGBOOK}/audio/tro-ve-bo-4.mp3`,
      undefined,
      { accent: "#3f6f68" },
    ),
  ],
  videos: [
    {
      id: "ba-va-con-duong-lang",
      title: "Ba và con đường làng",
      meta: "Hoạt hình đất sét · Track 01",
      mp4: `${SONGBOOK}/video/ba-va-con-duong-lang.mp4`,
      poster: "art/music-cover-ba-cong-con.webp",
    },
    {
      id: "den-dau-ben-song",
      title: "Đèn dầu bên sông",
      meta: "Hoạt hình đất sét · Track 03",
      mp4: `${SONGBOOK}/video/den-dau-ben-song.mp4`,
      poster: "art/den-dau-ben-song-poster.webp",
    },
    {
      id: "26-nam-sau-ben-song",
      title: "26 năm sau bên sông",
      meta: "Hoạt hình đất sét · Track 04",
      mp4: `${SONGBOOK}/video/26-nam-sau-ben-song.mp4`,
      poster: "art/26-nam-sau-ben-song-poster.webp",
    },
    {
      id: "ba-goi-con-ve",
      title: "Ba gọi con về",
      meta: "Phim ngắn · Track 05",
      duration: "0:10",
      mp4: `${SONGBOOK}/video/ba-goi-con-ve.mp4`,
      poster: "art/ba-goi-con-ve-poster.webp",
    },
    {
      id: "nha-van-sang-den-mv",
      title: "Nhà vẫn sáng đèn",
      meta: "MV · YouTube",
      duration: "7:19",
      youtube: "Hr70nStSOMs",
      poster: "art/ba-cong-con-tren-vai.webp",
    },
  ],
};

/* ── BizOn ───────────────────────────────────────────────────────────── */

const bz = (
  id: string,
  n: number,
  title: string,
  meta: string,
  file: string,
  duration?: string,
) => extra(`bizon-${id}`, n, title, meta, `${BIZON}/audio/${file}.mp3`, duration);

const BIZON_COLLECTION: Collection = {
  id: "bizon",
  short: "BizOn",
  name: "BizOn",
  desc: "Bài hát và trailer của các game mô phỏng kinh doanh",
  color: "var(--accent-2)",
  songs: [
    bz("lesprit-du-mekong", 1, "BizOn – L’Esprit du Mékong", "Bài hát chính · Pháp · Anh · Việt", "bizon-lesprit-du-mekong", "5:13"),
    bz("huong-on-return", 2, "Hương on Return", "2 bản thu", "huong-on-return"),
    bz("golden-silt", 3, "Journey on the Golden Silt", "Nhạc nền Bến Phù Sa · 6 bản thu", "golden-silt-journey-ben-phu-sa", "4:18"),
    bz("sans-frontieres", 4, "Je m'appelle Hương sans frontières", "Hộ Chiếu Thương Hiệu · 8 bản thu", "huong-sans-frontieres", "2:39"),
    bz("ben-phu-sa", 5, "Bến Phù Sa", "Song ca tiếng Việt", "bai-hat-ben-phu-sa", "5:49"),
    bz("doi-phu-sa", 6, "Đội Phù Sa", "Anthem đội chơi · 4 bản thu", "doi-phu-sa"),
    bz("brand-passport", 7, "Brand Passport", "Nhạc chủ đề · 8 bản thu", "brand-passport", "2:52"),
    bz("ho-chieu-to-khuc", 8, "Brand Passport · tổ khúc ba phần", "13 bản thu", "ho-chieu-p1-tu-dong-mekong", "3:56"),
    bz("bat-nghiep", 9, "Bật Nghiệp", "Nhạc chủ đề game · 9 bản thu", "bat-nghiep-co-loi", "3:23"),
    bz("viet-nam-trong-tim", 10, "Việt Nam Trong Tim", "Tiếng Việt", "viet-nam-trong-tim", "2:36"),
    bz("vua-du-de-bay-cao", 11, "Vừa Đủ Để Bay Cao", "Bản thu có lời", "vua-du-de-bay-cao"),
    bz("and-the-world-say-hello", 12, "And The World Say Hello!", "Bản thu có lời", "and-the-world-say-hello"),
    bz("mekong-compass", 13, "Mekong Compass", "Bản thu có lời", "mekong-compass"),
    bz("theme", 14, "BizOn Theme", "Không lời", "bizon-theme"),
    bz("huong-ngot-phu-sa", 15, "Hương Ngọt Phù Sa", "Nhạc nền Hộ Chiếu Sầu Riêng", "huong-ngot-phu-sa", "6:54"),
    bz("huong-ngot-que-minh", 16, "Hương Ngọt Quê Mình", "Nhạc nền Hộ Chiếu Sầu Riêng", "huong-ngot-que-minh", "7:22"),
    bz("durian-passport", 17, "Durian Passport", "Anthem · tiếng Anh", "durian-passport", "5:48"),
  ],
  videos: [
    {
      id: "bizon-playlist",
      title: "BizOn Songs – From the Mekong",
      meta: "Danh sách phát YouTube · 12 video",
      playlist: "PLXC5_d2VSkr4",
    },
    {
      id: "bizon-ben-phu-sa-ve-tay",
      title: "Bến Phù Sa (tranh vẽ)",
      meta: "MV · YouTube",
      duration: "6:28",
      youtube: "ynmGb3GqUdU",
      poster: `${BIZON}/video/mv-ben-phu-sa-tranh-ve-poster.webp`,
    },
    {
      id: "bizon-ben-phu-sa-3d",
      title: "Bến Phù Sa (hoạt hình 3D)",
      meta: "MV · YouTube",
      duration: "6:11",
      youtube: "LoIQxNs9ROo",
      poster: `${BIZON}/video/mv-ben-phu-sa-chuyen-dong-poster.webp`,
    },
    {
      id: "bizon-intro",
      title: "Giới thiệu BizOn",
      meta: "Giới thiệu",
      duration: "1:03",
      mp4: `${BIZON}/video/bizon-intro-vi-v4.mp4`,
      poster: `${BIZON}/video/bizon-intro-en-v3-poster.webp`,
    },
    {
      id: "bizon-bat-nghiep-trailer",
      title: "Bật Nghiệp",
      meta: "Trailer",
      duration: "1:30",
      mp4: `${BIZON}/video/bizon-trailer-v5-720p.mp4`,
      poster: `${BIZON}/video/bizon-trailer-poster.webp`,
    },
    {
      id: "bizon-ben-phu-sa-trailer",
      title: "Bến Phù Sa",
      meta: "Trailer",
      duration: "1:30",
      mp4: `${BIZON}/video/ben-phu-sa-trailer-v2-720p.mp4`,
      poster: `${BIZON}/video/ben-phu-sa-trailer-poster.webp`,
    },
    {
      id: "bizon-ho-chieu-trailer",
      title: "Hộ Chiếu Thương Hiệu",
      meta: "Trailer",
      duration: "1:30",
      mp4: `${BIZON}/video/bp-trailer-v2-720p.mp4`,
      poster: `${BIZON}/video/bp-trailer-poster.webp`,
    },
    {
      id: "bizon-sau-rieng-trailer",
      title: "Hộ Chiếu Sầu Riêng",
      meta: "Trailer",
      duration: "1:40",
      mp4: `${BIZON}/video/srp-trailer-720p.mp4`,
      poster: `${BIZON}/video/srp-trailer-poster.webp`,
    },
    {
      id: "bizon-gravity-lab-trailer",
      title: "Gravity Lab",
      meta: "Trailer",
      duration: "1:00",
      mp4: `${BIZON}/video/gravity-lab-trailer-720p.mp4`,
    },
  ],
};

/* ── M-AIDA ──────────────────────────────────────────────────────────── */

const MAIDA: Collection = {
  id: "maida",
  short: "M-AIDA",
  name: "M-AIDA",
  desc: "Nhạc nền của M-AIDA 8.0 và phim mở đầu",
  color: "#946a1f",
  songs: [
    extra(
      "maida-heartbeat",
      1,
      "The Heartbeat of M-AIDA",
      "Anh · Pháp · Việt",
      `${SONGBOOK}/audio/maida-heartbeat-of-maida.mp3`,
      "5:06",
    ),
    extra(
      "maida-preuves",
      2,
      "M-AIDA · Que les preuves décident",
      "Anh · Pháp · Việt",
      `${SONGBOOK}/audio/maida-que-les-preuves-decident.mp3`,
      "4:22",
    ),
  ],
  videos: [
    {
      id: "maida-film",
      title: "Phim mở đầu M-AIDA",
      meta: "Giới thiệu",
      duration: "1:07",
      mp4: `${SONGBOOK}/video/maida-film.mp4`,
      poster: `${SONGBOOK}/img/maida-film-poster.webp`,
    },
  ],
};

/* ── Tra cứu ─────────────────────────────────────────────────────────── */

export const COLLECTIONS: Collection[] = [HUONG, BIZON_COLLECTION, MAIDA];

export const COLLECTION_BY_ID = Object.fromEntries(
  COLLECTIONS.map((c) => [c.id, c]),
) as Record<CollectionId, Collection>;

export const ALL_SONGS: Song[] = COLLECTIONS.flatMap((c) => c.songs);

export const SONG_INDEX: Record<string, Song> = Object.fromEntries(
  ALL_SONGS.map((s) => [s.id, s]),
);

const COLLECTION_OF_SONG: Record<string, CollectionId> = Object.fromEntries(
  COLLECTIONS.flatMap((c) => c.songs.map((s) => [s.id, c.id] as const)),
);

/** Bộ sưu tập chứa bài này */
export function collectionOf(songId: string): Collection {
  return COLLECTION_BY_ID[COLLECTION_OF_SONG[songId] ?? "huong"];
}

export const TOTAL_SONGS = ALL_SONGS.length;
export const TOTAL_VIDEOS = COLLECTIONS.reduce((n, c) => n + c.videos.length, 0);
