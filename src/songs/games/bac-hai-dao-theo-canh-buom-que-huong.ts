import type { RawSong } from "@/lib/catalog";

/**
 * Bài hát của game «Bắc Hải Đảo — Hải Tặc Vịnh Bắc Bộ»
 * (Bac Hai Dao – Pirates of the Gulf of Tonkin).
 *
 * Tệp nhạc, MV và ảnh bìa nằm ở repo trò chơi (thuyhuongctu/ThuyHuong_Digital-2026-Games,
 * bac-hai-dao/assets/nhac/) và phát thẳng từ GitHub Pages của repo đó.
 *
 * LỜI: chép từ lyric video của bài. MỐC THỜI GIAN: dò từ bản mp3 (bản thu khác
 * với bản trong video) bằng nhận dạng giọng hát (Whisper) cho đầu mỗi câu.
 * Lời chạy lệch ở phần nào thì sửa `startMs` của đúng phần đó.
 */
export const song: RawSong = {
  id: "bac-hai-dao-theo-canh-buom-que-huong",
  trackNo: 1,
  title: "Bắc Hải Đảo – Theo cánh buồm quê hương",
  subtitle: "Nơi những con sóng còn ghi nhớ",
  language: "Tiếng Việt",
  meta: "Bài hát của game · Tiếng Việt",
  accent: "#3d6b7a",
  coverSrc:
    "https://thuyhuongctu.github.io/ThuyHuong_Digital-2026-Games/bac-hai-dao/assets/nhac/bac-hai-dao-bia.jpg",
  style:
    "Nhạc giao hưởng biển cả lịch sử Việt Nam · giọng nam trung ấm, hợp xướng ở điệp khúc · sáo trúc, đàn bầu, đàn tranh, trống lễ, dàn dây · nhịp 6/8, 80 BPM",
  audioSrc:
    "https://thuyhuongctu.github.io/ThuyHuong_Digital-2026-Games/bac-hai-dao/assets/nhac/bac-hai-dao-theo-canh-buom-que-huong.mp3",
  durationMs: 346824,
  sections: [
    { id: "intro", label: "Dạo đầu", startMs: 0, lines: [] },
    {
      id: "verse1",
      label: "Khổ 1",
      startMs: 38300,
      lines: [
        "Trời vừa sáng, con thuyền rời bến",
        "Gió đưa buồm qua cửa biển xa",
        "Trong tay nải có lời mẹ dặn",
        "Trong tim người có bóng quê nhà",
      ],
    },
    {
      id: "verse1b",
      label: "",
      startMs: 54300,
      endMs: 68800,
      lines: [
        "Qua sóng bạc, nhìn nhau vững dạ",
        "Chung tay chèo qua những đêm dài",
        "Dẫu phía trước còn bao điều lạ",
        "Vẫn bên nhau đón ánh ban mai",
      ],
    },
    {
      id: "pre1",
      label: "Tiền điệp khúc",
      startMs: 70600,
      endMs: 86000,
      lines: [
        "Từng cơn gió căng đầy cánh vải",
        "Từng vì sao soi sáng đường xa",
        "Giữa biển rộng, nghe lòng nhắc mãi",
        "Sau lưng mình là cả quê nhà",
      ],
    },
    {
      id: "chorus1",
      label: "Điệp khúc",
      startMs: 87000,
      endMs: 102500,
      lines: [
        "Bắc Hải Đảo, căng buồm đón gió",
        "Mang quê hương theo mỗi cánh buồm",
        "Qua giông bão, chung lòng gìn giữ",
        "Đảo xa này nối với làng thôn",
              ],
    },
    {
      id: "chorus1b",
      label: "",
      startMs: 104000,
      endMs: 119500,
      lines: [
        "Bắc Hải Đảo, khắc ghi lời hẹn",
        "Dẫu xa xôi, lòng chẳng xa nhà",
        "Xin tiếp bước những người đi trước",
        "Giữ biển trời, gìn giữ quê ta",
      ],
    },
    { id: "interlude", label: "Nhạc dạo giữa", startMs: 120000, lines: [] },
    {
      id: "verse2",
      label: "Khổ 2",
      startMs: 141000,
      lines: [
        "Có người đã qua bao mùa gió",
        "Áo phai màu theo nắng ngoài khơi",
        "Có tên tuổi lưu trong trang sách",
        "Có công lao lặng giữa dòng đời",
        "Nay ta mở từng trang chuyện cũ",
        "Nghe người xưa như ở bên mình",
        "Mỗi dấu tích, một lời nhắn nhủ",
        "Bao nhọc nhằn mới có bình yên",
      ],
    },
    {
      id: "pre2",
      label: "Tiền điệp khúc",
      startMs: 170900,
      endMs: 186800,
      lines: [
        "Từng cơn gió căng đầy cánh vải",
        "Từng vì sao soi sáng đường xa",
        "Giữa biển rộng, nghe lòng nhắc mãi",
        "Sau lưng mình là cả quê nhà",
      ],
    },
    {
      id: "chorus2",
      label: "Điệp khúc 2",
      startMs: 187100,
      endMs: 202600,
      lines: [
        "Bắc Hải Đảo, căng buồm đón gió",
        "Mang quê hương theo mỗi cánh buồm",
        "Qua giông bão, chung lòng gìn giữ",
        "Đảo xa này nối với làng thôn",
              ],
    },
    {
      id: "chorus2b",
      label: "",
      startMs: 204100,
      endMs: 219900,
      lines: [
        "Bắc Hải Đảo, khắc ghi lời hẹn",
        "Dẫu xa xôi, lòng chẳng xa nhà",
        "Xin tiếp bước những người đi trước",
        "Giữ biển trời, gìn giữ quê ta",
      ],
    },
    {
      id: "bridge",
      label: "Cầu nối",
      startMs: 220500,
      endMs: 249800,
      lines: [
        "Giữ biển đảo từ điều bình dị",
        "Một bàn tay nâng đỡ bạn mình",
        "Một lời hứa mang theo từ bến",
        "Một tấm lòng gìn giữ niềm tin",
        "Mai trở lại bên thềm nhà nhỏ",
        "Kể người nghe chuyện những chuyến đi",
        "Để con trẻ thêm yêu biển đảo",
        "Hiểu công người gìn giữ từng khi",
      ],
    },
    {
      id: "bridge2",
      label: "Cao trào",
      startMs: 251100,
      lines: ["Nghe trong gió lời xưa vọng lại", "Cùng bên nhau, vững lái ra khơi"],
    },
    {
      id: "chorus3",
      label: "Điệp khúc cuối",
      startMs: 261900,
      endMs: 277900,
      lines: [
        "Bắc Hải Đảo, căng buồm đón gió",
        "Mang quê hương theo mỗi cánh buồm",
        "Qua giông bão, chung lòng gìn giữ",
        "Đảo xa này nối với làng thôn",
              ],
    },
    {
      id: "chorus3b",
      label: "",
      startMs: 278200,
      endMs: 293500,
      lines: [
        "Bắc Hải Đảo, khắc ghi lời hẹn",
        "Dẫu xa xôi, lòng chẳng xa nhà",
        "Xin tiếp bước những người đi trước",
        "Giữ biển trời, gìn giữ quê ta",
      ],
    },
    {
      id: "outro",
      label: "Kết",
      startMs: 297100,
      endMs: 312000,
      lines: [
        "Chiều êm xuống, con thuyền về bến",
        "Khói lam bay trên mái nhà quen",
        "Lời ru cũ theo người ra biển",
        "Lại theo người về giữa bình yên",
      ],
    },
    {
      id: "tag",
      label: "Câu cuối",
      startMs: 315500,
      endMs: 327000,
      lines: ["Bắc Hải Đảo…", "Mang quê hương theo mỗi cánh buồm…"],
    },
    { id: "outro-music", label: "Nhạc kết", startMs: 327000, lines: [] },
  ],
};
