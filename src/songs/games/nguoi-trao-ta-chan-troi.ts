import type { RawSong } from "@/lib/catalog";

/**
 * Bài hát chung của hai game «Vân Đồn» (Vân Đồn 3D) và «Bắc Hải Đảo».
 *
 * Tệp nhạc nằm ở repo trò chơi (thuyhuongctu/Vietnamese-History-Games, assets/nhac/) và phát thẳng từ
 * GitHub Pages của repo đó.
 *
 * MỐC THỜI GIAN: lấy từ lyric video của bài (THUYHUONG-DIGITAL, mv/nguoi-trao-chan-troi/): Demucs tách giọng,
 * Whisper nghe từng khúc 20 giây, khớp với lời gốc; 60/62 câu có mốc từ Whisper, hai câu đặt tay theo nhịp các
 * câu bên cạnh. Lời chạy lệch ở phần nào thì sửa `startMs` của đúng phần đó.
 */
export const song: RawSong = {
  id: "nguoi-trao-ta-chan-troi",
  trackNo: 1,
  title: "Người trao ta chân trời",
  subtitle: "Those Who Gave Us the Horizon",
  language: "Tiếng Việt",
  meta: "Bài hát chung của hai game · Tiếng Việt",
  accent: "#3a6f7d",
  coverSrc:
    "https://thuyhuongctu.github.io/Vietnamese-History-Games/van-don-3d/assets/ben-hoang-hon.jpg",
  style:
    "Hùng ca biển cả · sáo trúc, đàn tranh, đàn bầu, trống trầm, dàn dây và hợp xướng · sóng biển mở đầu và khép lại",
  audioSrc:
    "https://thuyhuongctu.github.io/Vietnamese-History-Games/assets/nhac/nguoi-trao-ta-chan-troi.mp3",
  durationMs: 330000,
  sections: [
    { id: "intro", label: "Dạo đầu", startMs: 0, lines: [] },
    {
      id: "verse1",
      label: "Khổ 1",
      startMs: 39400,
      lines: [
        "Gió mở lối, cánh buồm lên",
        "Bờ xa lùi sau màn sương sớm",
        "Một bàn tay ghì tay lái",
        "Một bàn tay níu lấy bàn tay",
        "Chưa biết hết đường phía trước",
        "Chỉ biết không để bạn một mình",
        "Qua một đêm trời nổi sóng",
        "Càng thương hơn hai tiếng yên bình",
      ],
    },
    {
      id: "pre1",
      label: "Tiền điệp khúc",
      startMs: 66800,
      lines: [
        "Có những người ta chưa từng gặp",
        "Mà công lao ở khắp quanh mình",
        "Trong bến nước, trong từng mái ngói",
        "Trong ngày mai ta sống thanh bình",
      ],
    },
    {
      id: "chorus1",
      label: "Điệp khúc",
      startMs: 83700,
      lines: [
        "Người trao ta một chân trời",
        "Đã đi qua bao mùa giông bão",
        "Để hôm nay ta đứng nơi này",
        "Nghe sóng vỗ mà lòng không sợ hãi",
        "Người trao ta một quê nhà",
        "Bằng tuổi xanh, bằng đời ở lại",
        "Ta mang ơn không chỉ bằng lời",
        "Cùng giữ lấy chân trời cho ngày mai",
      ],
    },
    { id: "interlude", label: "Nhạc dạo giữa", startMs: 114400, lines: [] },
    {
      id: "verse2",
      label: "Khổ 2",
      startMs: 136000,
      lines: [
        "Ta đọc chậm từng dòng chữ",
        "Tên người xưa, năm tháng xa rồi",
        "Bỗng nghe tiếng buồm trong gió",
        "Như người còn đứng giữa trùng khơi",
        "Không phải ai về tới bến",
        "Không phải tên nào cũng được ghi",
        "Nhưng biển vẫn còn kể mãi",
        "Chuyện bao người đã sống, đã đi",
      ],
    },
    {
      id: "pre2",
      label: "Tiền điệp khúc",
      startMs: 166300,
      lines: [
        "Vân Đồn còn vang tiếng sóng",
        "Bắc Hải Đảo gọi buồm ra khơi",
        "Hai câu chuyện cùng nhắc nhớ",
        "Một quê hương, bao thế hệ người",
      ],
    },
    {
      id: "chorus2",
      label: "Điệp khúc 2",
      startMs: 183400,
      lines: [
        "Người trao ta một chân trời",
        "Đã đi qua bao mùa giông bão",
        "Để hôm nay ta đứng nơi này",
        "Nghe sóng vỗ mà lòng không sợ hãi",
        "Người trao ta một quê nhà",
        "Bằng tuổi xanh, bằng đời ở lại",
        "Ta mang ơn không chỉ bằng lời",
        "Cùng giữ lấy chân trời cho ngày mai",
      ],
    },
    {
      id: "bridge",
      label: "Cầu nối",
      startMs: 211900,
      lines: [
        "Có một thời ta chưa từng sống",
        "Có những người ta chẳng biết tên",
        "Mà mỗi sáng nhìn ra phía biển",
        "Lại thấy mình mang một niềm ơn",
      ],
    },
    {
      id: "build",
      label: "Cao trào",
      startMs: 228200,
      lines: [
        "Không để chuyện xưa thành quên lãng",
        "Không để tình người hóa xa xôi",
        "Từ nơi bàn tay người buông xuống",
        "Bàn tay ta tiếp lấy cuộc đời",
      ],
    },
    {
      id: "final-chorus",
      label: "Điệp khúc cuối",
      startMs: 244700,
      lines: [
        "Người trao ta một chân trời",
        "Đã đi qua bao mùa giông bão",
        "Để hôm nay ta đứng nơi này",
        "Nghe sóng vỗ mà lòng không sợ hãi",
        "Người trao ta một quê nhà",
        "Bằng tuổi xanh, bằng đời ở lại",
        "Ta mang ơn không chỉ bằng lời",
        "Cùng giữ lấy chân trời cho ngày mai",
      ],
    },
    {
      id: "outro",
      label: "Kết",
      startMs: 275200,
      lines: [
        "Mai có người nhìn ra biển rộng",
        "Thấy cánh buồm đi giữa trời xanh",
        "Xin còn nhớ người trao chân trời ấy",
        "Để hôm nay ta được lớn lên",
      ],
    },
    {
      id: "final-vocal",
      label: "Câu cuối",
      startMs: 293800,
      endMs: 305500,
      lines: [
        "Người trao ta một chân trời…",
        "Ta giữ cho người đến sau…",
      ],
    },
    { id: "fade", label: "Nhạc kết", startMs: 305500, endMs: 330000, lines: [] },
  ],
};
