import type { RawSong } from "@/lib/catalog";

/**
 * Bài hát của game «Vân Đồn Đệ Nhất Thương Cảng» (Vân Đồn 3D).
 *
 * Tệp nhạc nằm ở repo trò chơi (thuyhuongctu/ThuyHuong_Digital-2026-Games,
 * van-don-3d/assets/nhac/) và phát thẳng từ GitHub Pages của repo đó.
 *
 * MỐC THỜI GIAN: dò từ chính bản thu — nhận dạng giọng hát (Whisper) cho đầu
 * mỗi câu, cộng với độ to của phần giọng ở giữa so với nhạc hai bên để tìm chỗ
 * nhạc dạo xen giữa. Lời chạy lệch ở phần nào thì sửa `startMs` của đúng phần
 * đó; các dòng bên trong tự giãn theo độ dài chữ.
 */
export const song: RawSong = {
  id: "van-don-tieng-vong-non-song",
  trackNo: 1,
  title: "Vân Đồn – Tiếng vọng non sông",
  subtitle: "Nơi những con sóng còn ghi nhớ",
  language: "Tiếng Việt",
  meta: "Bài hát của game · Tiếng Việt",
  accent: "#2f6f8f",
  coverSrc:
    "https://thuyhuongctu.github.io/ThuyHuong_Digital-2026-Games/van-don-3d/assets/ben-cang-van-don.jpg",
  style:
    "Hùng ca dân tộc · sáo trúc, đàn bầu, trống trầm, dàn dây và hợp xướng · sóng biển mở đầu và khép lại",
  audioSrc:
    "https://thuyhuongctu.github.io/ThuyHuong_Digital-2026-Games/van-don-3d/assets/nhac/van-don-tieng-vong-non-song.mp3",
  durationMs: 317232,
  sections: [
    { id: "intro", label: "Dạo đầu", startMs: 0, lines: [] },
    {
      id: "verse1",
      label: "Khổ 1",
      startMs: 42300,
      lines: [
        "Bình minh lên trên muôn trùng sóng",
        "Cánh buồm căng giữa nước trời xa",
        "Có người đi từ miền làng nhỏ",
        "Mang trong tim hình bóng quê nhà",
        "Một bờ tre, một lời ru mẹ",
        "Một dòng sông thương nhớ khôn nguôi",
        "Nghe non nước gọi, người đứng dậy",
        "Gác tình riêng, đi giữ quê hương",
      ],
    },
    {
      id: "pre1",
      label: "Tiền điệp khúc",
      startMs: 70000,
      lines: [
        "Nghe tiếng trống vang qua cửa biển",
        "Nghe lời thề hòa giữa trùng khơi",
        "Dẫu năm tháng phủ mờ dấu cũ",
        "Chí khí cha ông sáng muôn đời",
      ],
    },
    {
      id: "chorus1",
      label: "Điệp khúc",
      startMs: 91500,
      endMs: 117800,
      lines: [
        "Vân Đồn ơi, vang lời sông núi",
        "Lớp lớp người gìn giữ biển trời",
        "Bao người đã qua thời lửa khói",
        "Cho quê hương rạng ánh ban mai",
        "Xin khắc ghi công người đi trước",
        "Giữ trong tim từng tấc đất này",
        "Từ trang sử, ta nghe lời nhắc",
        "Giữ non sông bằng cả đôi tay",
      ],
    },
    { id: "interlude", label: "Nhạc dạo giữa", startMs: 117800, lines: [] },
    {
      id: "verse2",
      label: "Khổ 2",
      startMs: 145500,
      lines: [
        "Có tên người lưu trong trang sách",
        "Có bao người chẳng rõ tuổi tên",
        "Gửi thanh xuân vào lòng biển biếc",
        "Cho quê nhà yên giấc đêm đêm",
        "Nay ta bước qua miền dấu tích",
        "Nghe chuyện xưa gần lại bên mình",
        "Lật trang sử, càng thêm thấu hiểu",
        "Bao hy sinh mới có thanh bình",
      ],
    },
    {
      id: "pre2",
      label: "Tiền điệp khúc",
      startMs: 171000,
      lines: [
        "Nghe tiếng trống vang qua cửa biển",
        "Nghe lời thề hòa giữa trùng khơi",
        "Dẫu năm tháng phủ mờ dấu cũ",
        "Chí khí cha ông sáng muôn đời",
      ],
    },
    {
      id: "chorus2",
      label: "Điệp khúc 2",
      startMs: 192600,
      lines: [
        "Vân Đồn ơi, vang lời sông núi",
        "Lớp lớp người gìn giữ biển trời",
        "Bao người đã qua thời lửa khói",
        "Cho quê hương rạng ánh ban mai",
        "Xin khắc ghi công người đi trước",
        "Giữ trong tim từng tấc đất này",
        "Từ trang sử, ta nghe lời nhắc",
        "Giữ non sông bằng cả đôi tay",
      ],
    },
    {
      id: "bridge",
      label: "Cầu nối",
      startMs: 219700,
      lines: [
        "Xin tri ân người nơi chiến trận",
        "Cả những người ở lại quê nhà",
        "Càng hiểu những hy sinh thầm lặng",
        "Càng nâng niu cuộc sống quanh ta",
      ],
    },
    {
      id: "build",
      label: "Cao trào",
      startMs: 233100,
      lines: ["Từng con sóng mang lời nhắn gửi", "Người hôm nay tiếp bước người xưa"],
    },
    {
      id: "final-chorus",
      label: "Điệp khúc cuối",
      startMs: 244900,
      lines: [
        "Vân Đồn ơi, vang lời sông núi",
        "Lớp lớp người gìn giữ biển trời",
        "Bao người đã qua thời lửa khói",
        "Cho quê hương rạng ánh ban mai",
        "Xin khắc ghi công người đi trước",
        "Giữ trong tim từng tấc đất này",
        "Từ trang sử, ta nghe lời nhắc",
        "Giữ non sông bằng cả đôi tay",
      ],
    },
    {
      id: "outro",
      label: "Kết",
      startMs: 271700,
      lines: [
        "Vân Đồn ơi, ngàn năm sóng hát",
        "Chuyện cha ông truyền tới hôm nay",
        "Ta tiếp bước bằng lòng son sắt",
        "Giữ quê hương, dựng xây từng ngày",
      ],
    },
    {
      id: "final-vocal",
      label: "Câu cuối",
      startMs: 288300,
      endMs: 296500,
      lines: ["Vân Đồn ơi…", "Vọng tiếng non sông…"],
    },
    { id: "fade", label: "Nhạc kết", startMs: 296500, endMs: 317232, lines: [] },
  ],
};
