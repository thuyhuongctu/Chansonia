import type { RawSong } from "@/lib/catalog";

export const song: RawSong = {
  id: "26-nam-sau",
  trackNo: 4,
  title: "26 Năm Sau",
  subtitle: "Bài hát chủ đề của album",
  language: "Tiếng Việt",
  note: "Hồi sinh, ngộ ra · Hộp màu, màn hình, code",
  accent: "#c45c3a",
  coverSrc: "art/huong_songbook_hero.jpg",
  style:
    "Cyber-orchestral Pop · 116 BPM · dàn dây lớn, synth neon, bass điện ảnh trầm sâu",
  signature:
    "«26 năm sau, em thấy mình trong những dòng code. / I found the light, I found the way.»",
  pictures: [
    {
      src: "art/hoi-thi-be-kheo-tay.webp",
      alt: "Hình đất sét: em bé sáu tuổi mặc váy vàng đứng trước phông hội thi «Bé khéo tay» tỉnh Cần Thơ",
      caption: "Em bé sáu tuổi — hội thi «Bé khéo tay» tỉnh Cần Thơ, năm học 1999–2000.",
    },
    {
      src: "art/26-nam-sau-dong-code.webp",
      alt: "Người lớn ngồi trước màn hình máy tính hiện đồ thị, đèn bàn sáng trong đêm",
      caption: "Hai mươi sáu năm sau — vẫn đôi tay ấy, nay vẽ bằng những dòng code.",
    },
    {
      src: "art/26-nam-sau-ben-song-poster.webp",
      alt: "Hình đất sét: người lớn bế đứa trẻ sáu tuổi bên bờ sông lúc trời sập tối",
      caption:
        "«26 năm sau» — người lớn cầm lại chính mình hồi sáu tuổi, bên sông lúc trời sập tối.",
    },
  ],
  titleTrack: true,
  audioSrc: "audio/track04-26-nam-sau-v2.mp3",
  durationMs: 303024,
  sections: [
    {
      id: "loibaihatv2",
      label: "Lời",
      startMs: 12120,
      lines: [
        "26 năm sau, ngọn đèn xưa vẫn sáng",
        "Em đi qua những dòng sông, qua những cánh rừng",
        "Tìm lại hộp màu đã cũ, tìm lại giấc mơ xưa",
        "Nhưng lần này, em vẽ bằng những dòng code xanh.",
        "I found the light, I found the way",
        "26 năm, một vòng tròn khép lại",
        "Je m'appelle Hương, và em đã trở về",
        "Với mặt trời thêu trên ngực áo, và trái tim hồng.",
      ],
    },
  ],
};
