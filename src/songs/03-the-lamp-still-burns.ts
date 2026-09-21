import type { RawSong } from "@/lib/catalog";

export const song: RawSong = {
  id: "the-lamp-still-burns",
  trackNo: 3,
  title: "The Lamp Still Burns",
  subtitle: "A third-person embrace",
  language: "Tiếng Anh",
  note: "Góc nhìn thứ ba · An ủi, cho phép nghỉ",
  accent: "#3f6f68",
  coverSrc: "art/dem-nghi-ngoi.webp",
  style:
    "Cinematic electro-pop / nocturnal trance-folk · 118 BPM · trôi về phía trước như dòng sông, mỏi mệt nhưng bền bỉ",
  signature: "«The lamp still burns. / Tu peux dormir.»",
  pictures: [
    {
      src: "art/dem-nghi-ngoi.webp",
      alt: "Chân dung trong ánh đèn đêm dịu, gương mặt thư thái sau một ngày dài",
      caption: "«Tu peux dormir» — trạm nghỉ của bài hát: đặt gánh nặng xuống một đêm.",
    },
  ],
  audioSrc: "audio/track03.mp3",
  durationMs: 124272,
  sections: [
    {
      id: "verse1en",
      label: "Khổ 1",
      startMs: 4970,
      lines: [
        "Another night, another line of code,",
        "another river carrying the load.",
        "You built a world so others learn to try —",
        "who built a place for you to lay yours down?",
      ],
    },
    {
      id: "chorus",
      label: "Điệp khúc",
      startMs: 59903,
      lines: [
        "The lamp still burns, the lamp still burns,",
        "low and amber while the whole boat turns.",
        "You're not behind, you're only tired tonight —",
        "even the river rests before first light.",
      ],
    },
  ],
};
