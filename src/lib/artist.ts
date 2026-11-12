/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  HỒ SƠ NGHỆ SĨ VÀ ALBUM — SỬA TỆP NÀY ĐỂ ĐỔI THÔNG TIN DỰ ÁN        ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

export type SocialLink = { label: string; url: string };

export const ARTIST = {
  name: "Je m'appelle Hương",
  realName: "Đỗ Thùy Hương",
  tagline: "Lecturer & Researcher · Songwriter",

  bio: [
    "Một mini song-cycle gồm 6 chương về sự vắng mặt, sự trưởng thành, và những giấc mơ thay hình đổi dạng.",
    "Album được sáng tác trong bảy ngày, từ 07 đến 13 tháng 8 năm 2026, xoay quanh hình ảnh ngọn đèn còn cháy, dòng sông chở đêm đi, và chiếc hộp màu của một cô bé từng muốn trở thành họa sĩ.",
    "Hai mươi sáu năm sau, cô bé ấy vẽ tiếp giấc mơ của mình — lần này bằng những dòng code.",
  ],

  /** DOI của phần mềm Chansonia trên Zenodo (concept DOI — trỏ tới bản mới nhất) */
  doi: "10.5281/zenodo.22172794",

  links: [
    { label: "GitHub · thuyhuongctu/Chansonia", url: "https://github.com/thuyhuongctu/Chansonia" },
    { label: "Songbook", url: "https://thuyhuongctu.github.io/Je-mappelle-Huong/music.html" },
    { label: "ORCID · 0000-0002-7711-2487", url: "https://orcid.org/0000-0002-7711-2487" },
  ] as SocialLink[],

  contactEmail: "thuyhuongctu@gmail.com",
  /** Chân dung (cắt riêng khuôn mặt từ tờ thiết kế nhân vật brand/artist.jpg) */
  portrait: "brand/artist-face.jpg",
} as const;

export const ALBUM = {
  title: "La lampe, le fleuve et les couleurs",
  subtitle: "Songbook «Je m'appelle Hương»",
  kind: "Mini song-cycle · EP",
  chapters: 6,

  /** Mô tả album, viết như trên trang songbook */
  blurb: {
    vi: "Một mini song-cycle / EP gồm 6 bài hát về sự vắng mặt, sự trưởng thành, và những giấc mơ thay hình đổi dạng.",
    en: "A six-song mini song-cycle / EP about absence, growing up, and dreams that change their shape.",
  },

  /** Dòng tóm tắt số bản thu, như phần mở đầu của trang nhạc */
  recordingsNote: "Sáu bài chính · 25 bản thu · sáng tác 07–13/08/2026.",
  composedFrom: "07/08/2026",
  composedTo: "13/08/2026",

  /** Câu đề từ của album, hiển thị ở màn hình chờ */
  epigraph: {
    vi: "Có những ước mơ không biến mất. Chúng chỉ đổi cây cọ.",
    fr: "Certains rêves ne disparaissent pas. Ils changent seulement de pinceau.",
    en: "Some dreams don't disappear. They change their brush.",
  },

  /** Các mô-típ xuyên suốt album */
  motifs: [
    { icon: "🏮", label: "ngọn đèn", fr: "la lampe" },
    { icon: "🌊", label: "dòng sông", fr: "le fleuve" },
    { icon: "🛶", label: "con thuyền", fr: "la barque" },
    { icon: "🚣", label: "hai mái chèo", fr: "les deux rames" },
    { icon: "🪑", label: "chiếc ghế trống", fr: "la chaise vide" },
    { icon: "👧", label: "cô bé", fr: "la petite fille" },
    { icon: "🎨", label: "hộp màu", fr: "la boîte de couleurs" },
    { icon: "💻", label: "code · pixels", fr: "interfaces" },
    { icon: "🏝️", label: "hòn đảo ngọt", fr: "l'île douce" },
  ],
} as const;

export const COPYRIGHT_YEAR = 2026;
export const COPYRIGHT_HOLDER = "Đỗ Thùy Hương";
export const COPYRIGHT_LINE = `© ${COPYRIGHT_YEAR} ${COPYRIGHT_HOLDER}. Mọi quyền được bảo lưu.`;
export const LICENSE_NOTE = "Phần mềm và tác phẩm độc quyền — không phát hành mã nguồn mở.";

/** Ảnh của nghệ sĩ — hiện ở mục «Ảnh» trên trang Nghệ sĩ, chạm để xem lớn */
export const ARTIST_PHOTOS: { src: string; alt: string }[] = [
  { src: "art/huong-guitar-sofa.webp", alt: "Hương cười, ôm đàn guitar giữa hai người bạn trên ghế sofa" },
  { src: "art/huong-vuon-hoa.webp", alt: "Hương ngồi trên ghế đá giữa vườn hoa, bướm bay quanh" },
  { src: "art/huong-guitar-cuoi.webp", alt: "Hương ôm đàn guitar, cười trên ghế sofa trước kệ sách" },
  { src: "art/huong-guitar-hat.webp", alt: "Hương nhắm mắt đàn hát, bạn bè vỗ tay" },
  { src: "art/huong-guitar-ban-be.webp", alt: "Hương đàn guitar cho hai người bạn nghe trong phòng khách" },
];
