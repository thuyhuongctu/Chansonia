import type { RawSong } from "@/lib/catalog";

export const song: RawSong = {
  id: "26-nam-sau",
  trackNo: 4,
  title: "26 Năm Sau",
  subtitle: "Bài hát chủ đề của album",
  language: "Tiếng Việt",
  note: "Hồi sinh, ngộ ra · Hộp màu, màn hình, code",
  accent: "#a78bfa",
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
