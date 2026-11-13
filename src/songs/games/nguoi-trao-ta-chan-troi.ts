import type { RawSong } from "@/lib/catalog";

/*
 * Bài hát chung của hai trò chơi lịch sử. Lời nhắc đích danh cả hai:
 * «Vân Đồn còn vang tiếng sóng / Bắc Hải Đảo gọi buồm ra khơi», nên nó không
 * thuộc riêng bộ nào mà đứng thành một bộ thứ ba.
 *
 * MỐC THỜI GIAN: chỉ có BA, và cả ba đều đo được, không có con số nào đoán.
 * Đo theo đúng cách README của thư mục này chỉ: tách kênh giữa trừ kênh bên,
 * lọc 250-3000 Hz, cửa sổ 0,5 giây, rồi tìm chỗ giọng vào và ra.
 *
 *   0 ms        mở đầu, chưa có giọng
 *   38 500 ms   giọng vào lần đầu
 *   303 000 ms  giọng dứt, còn nhạc kết
 *
 * Phép dò ấy chỉ ra thêm 14 đoạn rời rạc ở giữa, nhưng chúng không ứng
 * một-một với 14 phần trong lời, nên KHÔNG chia nhỏ theo chúng: ghép bừa là
 * lấy nhiễu dựng thành câu chuyện. Hệ quả là cả phần lời nằm trong một khối
 * 264 giây và `compile()` sẽ rải đều các dòng trong khoảng ấy - đúng đại thể,
 * lệch dần ở từng dòng.
 *
 * Muốn lời bám sát thì chia `loi` thành từng phần như bài 05 và 07, điền
 * `startMs` cho mỗi phần sau khi nghe một lượt. README gọi đó là bước cuối
 * cùng, và nó cần tai người.
 */

export const song: RawSong = {
  id: "nguoi-trao-ta-chan-troi",
  trackNo: 1,
  title: "Người trao ta chân trời",
  subtitle: "Nơi những con sóng còn ghi nhớ",
  language: "Tiếng Việt",
  note: "Bài chung của hai trò chơi lịch sử · Biết ơn người đi trước",
  accent: "#3f6f68",
  coverSrc: "art/nguoi-trao-ta-chan-troi.webp",
  style:
    "Hùng ca dân tộc · giọng nam cao, hát liền hơi, phát âm rõ · sáo trúc và đàn bầu giữ mô-típ trên nền đàn tranh, trống lễ trầm, dàn dây rộng và kèn đồng tiết chế · nhịp 4/4 đều, 96 BPM · hợp xướng chỉ đáp ở điệp khúc cuối",
  signature: "«Người trao ta một chân trời / Ta giữ cho người đến sau.»",
  audioSrc: "audio/nguoi-trao-ta-chan-troi.mp3",
  durationMs: 330000,
  sections: [
    {
      id: "modau",
      label: "Mở đầu",
      startMs: 0,
      lines: [],
    },
    {
      id: "loi",
      label: "Lời bài hát",
      startMs: 38500,
      lines: [
        "Gió mở lối, cánh buồm lên",
        "Bờ xa lùi sau màn sương sớm",
        "Một bàn tay ghì tay lái",
        "Một bàn tay níu lấy bàn tay",
        "Chưa biết hết đường phía trước",
        "Chỉ biết không để bạn một mình",
        "Qua một đêm trời nổi sóng",
        "Càng thương hơn hai tiếng yên bình",
        "Có những người ta chưa từng gặp",
        "Mà công lao ở khắp quanh mình",
        "Trong bến nước, trong từng mái ngói",
        "Trong ngày mai ta sống thanh bình",
        { text: "Người trao ta một chân trời", role: "title" },
        "Đã đi qua bao mùa giông bão",
        "Để hôm nay ta đứng nơi này",
        "Nghe sóng vỗ mà lòng không sợ hãi",
        "Người trao ta một quê nhà",
        "Bằng tuổi xanh, bằng đời ở lại",
        "Ta mang ơn không chỉ bằng lời",
        "Cùng giữ lấy chân trời cho ngày mai",
        "Ta đọc chậm từng dòng chữ",
        "Tên người xưa, năm tháng xa rồi",
        "Bỗng nghe tiếng buồm trong gió",
        "Như người còn đứng giữa trùng khơi",
        "Không phải ai về tới bến",
        "Không phải tên nào cũng được ghi",
        "Nhưng biển vẫn còn kể mãi",
        "Chuyện bao người đã sống, đã đi",
        "Vân Đồn còn vang tiếng sóng",
        "Bắc Hải Đảo gọi buồm ra khơi",
        "Hai câu chuyện cùng nhắc nhớ",
        "Một quê hương, bao thế hệ người",
        { text: "Người trao ta một chân trời", role: "title" },
        "Đã đi qua bao mùa giông bão",
        "Để hôm nay ta đứng nơi này",
        "Nghe sóng vỗ mà lòng không sợ hãi",
        "Người trao ta một quê nhà",
        "Bằng tuổi xanh, bằng đời ở lại",
        "Ta mang ơn không chỉ bằng lời",
        "Cùng giữ lấy chân trời cho ngày mai",
        "Có một thời ta chưa từng sống",
        "Có những người ta chẳng biết tên",
        "Mà mỗi sáng nhìn ra phía biển",
        "Lại thấy mình mang một niềm ơn",
        "Không để chuyện xưa thành quên lãng",
        "Không để tình người hóa xa xôi",
        "Từ nơi bàn tay người buông xuống",
        "Bàn tay ta tiếp lấy cuộc đời",
        { text: "Người trao ta một chân trời", role: "title" },
        "Đã đi qua bao mùa giông bão",
        "Để hôm nay ta đứng nơi này",
        "Nghe sóng vỗ mà lòng không sợ hãi",
        "Người trao ta một quê nhà",
        "Bằng tuổi xanh, bằng đời ở lại",
        "Ta mang ơn không chỉ bằng lời",
        "Cùng giữ lấy chân trời cho ngày mai",
        "Mai có người nhìn ra biển rộng",
        "Thấy cánh buồm đi giữa trời xanh",
        "Xin còn nhớ người trao chân trời ấy",
        "Để hôm nay ta được lớn lên",
        "Người trao ta một chân trời…",
        "Ta giữ cho người đến sau…",
      ],
    },
    {
      id: "nhacket",
      label: "Nhạc kết",
      startMs: 303000,
      lines: [],
    },
  ],
};
