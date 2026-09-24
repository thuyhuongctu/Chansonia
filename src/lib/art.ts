/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  KHO ẢNH ĐẤT SÉT — lấy từ trang songbook cá nhân                     ║
 * ║  thuyhuongctu.github.io/Je-mappelle-Huong/music.html                 ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * Ảnh nằm trong public/art nên được đóng gói cùng ứng dụng: mở offline vẫn
 * thấy đủ hình. Đường dẫn ghi dạng tương đối ("art/…") để bản dựng chạy được
 * cả khi mở trực tiếp từ đĩa/USB (giao thức file://).
 */

export type Picture = {
  src: string;
  /** Mô tả ảnh cho trình đọc màn hình */
  alt: string;
  /** Chú thích hiện dưới ảnh */
  caption?: string;
};

const p = (file: string) => `art/${file}`;

/** Dấu triện tròn "LR" và chữ ký thương hiệu của trang cá nhân */
export const SEAL = p("lr-seal-round.webp");
export const WORDMARK = p("lr-je-mappelle-huong.webp");

/** Ảnh chủ đề của cả trang nhạc: ba cõng con trên đường làng lúc hoàng hôn */
export const PAGE_COVER: Picture = {
  src: p("music-cover-ba-cong-con.webp"),
  alt: "Hình đất sét: người cha cõng con gái trên vai đi trên con đường làng lúc hoàng hôn, phía xa là dòng sông và những mái nhà lá",
  caption:
    "Ba cõng con trên đường làng lúc hoàng hôn — khung hình mở đầu của cả album.",
};

/** Ảnh bìa album: Hương AI trong áo dài trắng, một đoá sen trên tay */
export const ALBUM_PORTRAIT: Picture = {
  src: p("huong-ai-sen.webp"),
  alt: "Hình đất sét: Hương AI trong áo dài trắng, một đoá sen trên tay",
};

/** Ba mô-típ của album đứng cạnh nhau trong một khung hình */
export const MOTIF_PICTURE: Picture = {
  src: p("ghe-trong-con-thuyen-ngon-den.webp"),
  alt: "Hình đất sét: Hương trong áo dài trắng đứng cạnh một chiếc ghế nhỏ bỏ trống, dưới chân là ngọn đèn dầu đang cháy, phía sau là con thuyền giấy trôi trên những lượn sóng đất sét",
  caption:
    "Ba mô-típ của album trong một khung hình: ngọn đèn, con thuyền, và chiếc ghế trống.",
};

/** Ảnh cho mục "Ngoài album" — thế giới đồng hành của songbook */
export const OUTSIDE_PICTURES: Picture[] = [
  {
    src: p("bac-them-nhin-ra-bien.webp"),
    alt: "Hình đất sét: bậc thềm trước cửa nhà nhìn ra mặt biển lúc sớm mai",
    caption:
      "«Il reste une marche devant ta demeure» — khung hình của bài bonus «Le ciel que tu n'as jamais quitté», chưa có trong album.",
  },
  {
    src: p("mekong-sunfire-cover.webp"),
    alt: "Bìa bài hát: Hương trong áo dài trắng bên bờ sông lúc nắng chiều, đang xếp những tượng đất sét nhỏ vào thùng gỗ",
    caption: "Bìa của «Mekong Sunfire · Rise With The River».",
  },
  {
    src: p("huong-nghe-nhac-ngoi.webp"),
    alt: "Hình đất sét: Hương ngồi trên chiếc ghế dài, nhắm mắt nghe nhạc qua tai nghe, quanh người là nốt nhạc và cánh hoa",
    caption: "Nghe lại album một mình, khi ngày đã dài.",
  },
  {
    src: p("co-viet-tren-bien.webp"),
    alt: "Hương trong áo dài trắng cầm lá cờ đỏ sao vàng trên mặt biển lúc bình minh, phía sau là những chiếc thuyền đánh cá",
    caption: "Lá cờ trên mặt biển lúc bình minh.",
  },
  {
    src: p("ban-do-the-gioi-dat-set.webp"),
    alt: "Bản đồ thế giới bằng đất sét: các lục địa nhiều màu, thắng cảnh nổi lên, cờ đỏ và thuyền nhỏ trên mặt biển",
    caption: "Bản đồ thế giới bằng đất sét — «Je m'appelle Hương and the World».",
  },
];

/** Lời đề tặng ở cuối trang nhạc */
export const DEDICATION = {
  icon: "🪷",
  quote: "«Je m'appelle Hương — tu m'as donné ce nom.»",
  vi: "Bài hát nằm trong mạch sáng tác cá nhân cùng «Je m'appelle Hương and the World», nơi cái tên cha mẹ đặt trở thành ngọn đèn dẫn đường cho hành trình học thuật.",
} as const;

/** Địa chỉ trang songbook gốc trên web */
export const SONGBOOK_URL =
  "https://thuyhuongctu.github.io/Je-mappelle-Huong/music.html";
