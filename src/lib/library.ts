/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  THƯ VIỆN — các bộ sưu tập: Hương · BizOnland · M-AIDA · nhạc game    ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * Mỗi bộ sưu tập có hai danh sách: Bài hát và Video. Mục Video chỉ nhận
 * video là trọn một bài hát (MV, danh sách phát MV) — không đưa clip ngắn,
 * trailer hay phim giới thiệu vào đây.
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

import { compile, SONGS, type RawSong, type Song, type SongVersion } from "@/lib/catalog";
import { song as vanDonSong } from "@/songs/games/van-don-tieng-vong-non-song";
import { song as bacHaiSong } from "@/songs/games/bac-hai-dao-theo-canh-buom-que-huong";

export type CollectionId = "huong" | "bizon" | "maida" | "vandon" | "bachai";

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

/** Phiên bản phát trực tuyến: [tên, địa chỉ, độ dài] */
type Alt = [label: string, src: string, duration?: string];

const alt = ([label, audioSrc, duration]: Alt): SongVersion => ({
  label,
  audioSrc,
  durationMs: ms(duration),
});

/**
 * Gắn hai phiên bản cho một bài của album: bản trong app (có lời đồng bộ) và
 * một bản khác trên trang songbook.
 */
function albumVersions(song: Song, mainLabel: string, other: Alt): Song {
  return {
    ...song,
    versions: [
      { label: mainLabel, audioSrc: song.audioSrc, durationMs: song.durationMs, synced: true },
      alt(other),
    ],
  };
}

/** Bài phát trực tuyến có hai phiên bản; bản đầu là bản mặc định */
function twoVersions(versions: [Alt, Alt]): Partial<RawSong> {
  return { versions: versions.map(alt), audioSrc: versions[0][1] };
}

const sb = (file: string) => `${SONGBOOK}/audio/${file}`;
const ALT: Record<string, [string, Alt]> = {
  "je-voudrais-te-parler": ["Bản gốc", ["Bản phối OR", sb("track01-or.mp3"), "5:07"]],
  "la-lampe-brule-encore": ["Bản gốc", ["Bản v2", sb("track02-v2.mp3"), "5:40"]],
  "the-lamp-still-burns": ["Bản gốc", ["Bản v2", sb("track03-v2.mp3"), "1:59"]],
  "26-nam-sau": ["Bản 2026", ["Bản thu 2024", sb("track04-hai-muoi-sau-nam-sau.mp3"), "5:24"]],
  "a-fathers-song": ["English", ["Tiếng Việt", sb("track05-father-song-vi.mp3"), "5:52"]],
  "je-mappelle-huong": ["Bản dài", ["Bản ngắn", sb("track05.mp3"), "5:03"]],
  "le-ciel-que-tu-nas-jamais-quitte": [
    "Bản chính",
    ["Le ciel que tu gardes", sb("le-ciel-que-tu-gardes.mp3"), "5:54"],
  ],
};

/* ── Je m'appelle Hương ──────────────────────────────────────────────── */

const HUONG: Collection = {
  id: "huong",
  short: "La maison de Madam Hương",
  name: "La maison de Madam Hương",
  desc: "Album «La lampe, le fleuve et les couleurs» và một đĩa đơn",
  color: "var(--accent)",
  art: "art/music-cover-ba-cong-con.webp",
  songs: [
    ...SONGS.map((song) => {
      const a = ALT[song.id];
      return a ? albumVersions(song, a[0], a[1]) : song;
    }),
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
      "Đĩa đơn · Việt · Anh",
      sb("tro-ve-bo-4.mp3"),
      "4:16",
      {
        accent: "#3f6f68",
        ...twoVersions([
          ["Tiếng Việt", sb("tro-ve-bo-4.mp3"), "4:16"],
          ["English", sb("tro-ve-bo-5.mp3"), "3:58"],
        ]),
      },
    ),
  ],
  videos: [
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

const bza = (file: string) => `${BIZON}/audio/${file}.mp3`;

const bz = (
  id: string,
  n: number,
  title: string,
  meta: string,
  file: string,
  duration?: string,
  versions?: [Alt, Alt],
) =>
  extra(
    `bizon-${id}`,
    n,
    title,
    meta,
    bza(file),
    duration,
    versions ? twoVersions(versions) : {},
  );

const BIZON_COLLECTION: Collection = {
  id: "bizon",
  short: "BizOnland",
  name: "BizOnland",
  desc: "Bài hát của các game mô phỏng kinh doanh",
  color: "var(--accent-2)",
  songs: [
    bz("lesprit-du-mekong", 1, "BizOn – L’Esprit du Mékong", "Bài hát chính · Pháp · Anh · Việt", "bizon-lesprit-du-mekong", "5:13"),
    bz("huong-on-return", 2, "Hương on Return", "Bài hát chính đầu tiên", "huong-on-return", "2:30", [
      ["Bản gốc", bza("huong-on-return"), "2:30"],
      ["Remix", bza("huong-on-return-remix"), "2:29"],
    ]),
    bz("golden-silt", 3, "Journey on the Golden Silt", "Nhạc nền Bến Phù Sa · Anh · Pháp · Việt", "golden-silt-journey-ben-phu-sa", "4:18", [
      ["Bản đầy đủ", bza("golden-silt-journey-ben-phu-sa"), "4:18"],
      ["Bản gốc", bza("journey-golden-silt"), "3:00"],
    ]),
    bz("sans-frontieres", 4, "Je m'appelle Hương sans frontières", "Hộ Chiếu Thương Hiệu · Việt · Anh", "huong-and-the-world", "2:05", [
      ["Tiếng Việt", bza("huong-and-the-world"), "2:05"],
      ["English", bza("huong-and-the-world-en"), "2:13"],
    ]),
    bz("ben-phu-sa", 5, "Bến Phù Sa", "Song ca tiếng Việt", "bai-hat-ben-phu-sa", "5:49"),
    bz("doi-phu-sa", 6, "Đội Phù Sa", "Anthem đội chơi", "doi-phu-sa", "3:07", [
      ["Bản gốc", bza("doi-phu-sa"), "3:07"],
      ["Remix", bza("doi-phu-sa-remix"), "3:01"],
    ]),
    bz("brand-passport", 7, "Brand Passport", "Nhạc chủ đề Hộ Chiếu Thương Hiệu", "brand-passport", "2:52", [
      ["Brand Passport", bza("brand-passport"), "2:52"],
      ["English · Stamps Beyond Borders", bza("stamps-beyond-borders"), "3:03"],
    ]),
    bz("ho-chieu-to-khuc", 8, "Việt Nam ra thế giới", "Tổ khúc Hộ Chiếu Thương Hiệu · Phần III", "ho-chieu-p3-viet-nam-ra-the-gioi", "5:09", [
      ["Tiếng Việt", bza("ho-chieu-p3-viet-nam-ra-the-gioi"), "5:09"],
      ["English", bza("ho-chieu-p3-en-remix2"), "5:33"],
    ]),
    bz("bat-nghiep", 9, "Bật Nghiệp", "Nhạc chủ đề game", "bat-nghiep-co-loi", "3:23", [
      ["Tiếng Việt", bza("bat-nghiep-co-loi"), "3:23"],
      ["Anh · Việt · Mekong Sunfire", bza("bat-nghiep-mekong-sunfire-1"), "4:26"],
    ]),
    bz("viet-nam-trong-tim", 10, "Việt Nam Trong Tim", "Tiếng Việt", "viet-nam-trong-tim", "2:36"),
    bz("vua-du-de-bay-cao", 11, "Vừa Đủ Để Bay Cao", "Bản thu có lời", "vua-du-de-bay-cao", "3:22"),
    bz("and-the-world-say-hello", 12, "And The World Say Hello!", "Bản thu có lời", "and-the-world-say-hello", "2:23"),
    bz("mekong-compass", 13, "Mekong Compass", "Bản thu có lời", "mekong-compass", "2:48"),
    bz("theme", 14, "BizOn Theme", "Không lời", "bizon-theme", "3:01"),
    bz("huong-ngot-phu-sa", 15, "Hương Ngọt Phù Sa", "Nhạc nền Hộ Chiếu Sầu Riêng", "huong-ngot-phu-sa", "6:54"),
    bz("huong-ngot-que-minh", 16, "Hương Ngọt Quê Mình", "Nhạc nền Hộ Chiếu Sầu Riêng", "huong-ngot-que-minh", "7:22"),
    bz("durian-passport", 17, "Durian Passport", "Anthem · tiếng Anh", "durian-passport", "5:48"),
  ],
  videos: [
    {
      id: "bizon-mv-lesprit",
      title: "BizOn – L’Esprit du Mékong",
      meta: "MV · YouTube",
      duration: "5:17",
      youtube: "ANzsAz6Nmyo",
      poster: `https://i.ytimg.com/vi/ANzsAz6Nmyo/hqdefault.jpg`,
    },
    {
      id: "bizon-mv-mekong-sunfire",
      title: "Mekong Sunfire",
      meta: "MV · YouTube",
      duration: "3:45",
      youtube: "TjZU6_upFao",
      poster: `https://i.ytimg.com/vi/TjZU6_upFao/hqdefault.jpg`,
    },
    {
      id: "bizon-mv-thap-den",
      title: "Thắp đèn bên sông",
      meta: "MV · YouTube",
      duration: "5:06",
      youtube: "9zsvwnhBMgQ",
      poster: `https://i.ytimg.com/vi/9zsvwnhBMgQ/hqdefault.jpg`,
    },
    {
      id: "bizon-ben-phu-sa-ve-tay",
      title: "Bến Phù Sa (tranh vẽ)",
      meta: "MV · YouTube",
      duration: "6:28",
      youtube: "ynmGb3GqUdU",
      poster: `https://i.ytimg.com/vi/ynmGb3GqUdU/hqdefault.jpg`,
    },
    {
      id: "bizon-ben-phu-sa-3d",
      title: "Bến Phù Sa (hoạt hình 3D)",
      meta: "MV hoạt hình 3D · YouTube",
      duration: "6:11",
      youtube: "LoIQxNs9ROo",
      poster: `https://i.ytimg.com/vi/LoIQxNs9ROo/hqdefault.jpg`,
    },
    {
      id: "bizon-mv-huong-ngot-phu-sa",
      title: "Hương Ngọt Phù Sa",
      meta: "MV · YouTube",
      duration: "7:04",
      youtube: "6FgAuEhTZqw",
      poster: `https://i.ytimg.com/vi/6FgAuEhTZqw/hqdefault.jpg`,
    },
    {
      id: "bizon-mv-durian-passport",
      title: "Durian Passport",
      meta: "Lyric video 3D · YouTube",
      duration: "5:49",
      youtube: "4Y07yX8BARU",
      poster: `https://i.ytimg.com/vi/4Y07yX8BARU/hqdefault.jpg`,
    },
    {
      id: "bizon-mv-vietnam-to-the-world",
      title: "Brand Passport – Vietnam to the World",
      meta: "MV thế giới thu nhỏ 3D · YouTube",
      duration: "5:34",
      youtube: "Huf5fw858iQ",
      poster: `https://i.ytimg.com/vi/Huf5fw858iQ/hqdefault.jpg`,
    },
  ],
};

/* ── M-AIDA ──────────────────────────────────────────────────────────── */

const MAIDA: Collection = {
  id: "maida",
  short: "M-AIDA",
  name: "M-AIDA",
  desc: "Nhạc nền của M-AIDA 8.0",
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
  videos: [],
};

/* ── Tra cứu ─────────────────────────────────────────────────────────── */

/* ── Vân Đồn 3D ──────────────────────────────────────────────────────── */
/* Nhạc của game «Vân Đồn Đệ Nhất Thương Cảng» (repo ThuyHuong_Digital-2026-Games).
   Tệp nhạc và ảnh phát thẳng từ GitHub Pages của repo game. */

const GAMES = "https://thuyhuongctu.github.io/ThuyHuong_Digital-2026-Games/van-don-3d/assets";

const VANDON: Collection = {
  id: "vandon",
  short: "Van Don – Vietnam’s First Trading Port",
  name: "Van Don – Vietnam’s First Trading Port",
  desc: "Nhạc của game Vân Đồn Đệ Nhất Thương Cảng",
  color: "#2f6f8f",
  art: `${GAMES}/ben-cang-van-don.jpg`,
  songs: [compile(vanDonSong)],
  videos: [],
};

/* ── Bắc Hải Đảo ─────────────────────────────────────────────────────── */
/* Nhạc của game «Bắc Hải Đảo — Hải Tặc Vịnh Bắc Bộ», cùng repo game với Vân Đồn. */

const BACHAI_NHAC = "https://thuyhuongctu.github.io/ThuyHuong_Digital-2026-Games/bac-hai-dao/assets/nhac";

const BACHAI: Collection = {
  id: "bachai",
  short: "Bac Hai Dao – Pirates of the Gulf of Tonkin",
  name: "Bac Hai Dao – Pirates of the Gulf of Tonkin",
  desc: "Nhạc của game Bắc Hải Đảo, Hải Tặc Vịnh Bắc Bộ",
  color: "#3d6b7a",
  art: `${BACHAI_NHAC}/bac-hai-dao-bia.jpg`,
  songs: [compile(bacHaiSong)],
  videos: [
    {
      id: "bac-hai-dao-lyric-video",
      title: "Bắc Hải Đảo – Theo cánh buồm quê hương",
      meta: "Lyric video",
      duration: "5:48",
      mp4: `${BACHAI_NHAC}/bac-hai-dao-theo-canh-buom-que-huong.mp4`,
      poster: `${BACHAI_NHAC}/bac-hai-dao-bia.jpg`,
    },
  ],
};

export const COLLECTIONS: Collection[] = [HUONG, BIZON_COLLECTION, MAIDA, VANDON, BACHAI];

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
