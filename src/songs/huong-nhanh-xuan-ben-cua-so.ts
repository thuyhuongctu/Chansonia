import type { RawSong } from "@/lib/catalog";

/**
 * «Nhành xuân bên cửa sổ» — lời giã biệt khi vườn vẫn còn xanh. Bốn mùa xuân
 * bên ô cửa lớp học, rồi khép cửa nhẹ như lần mở cửa, gửi lại nhành xuân cho
 * người đến sau. Hát tiếng Việt, ba cặp câu cuối hát tiếng Pháp.
 *
 * Bài nằm ngoài album «La lampe, le fleuve et les couleurs» nên KHÔNG khai
 * trong RAW của catalog.ts; library.ts tự biên dịch rồi xếp sau «Trở về bờ».
 *
 * MỐC THỜI GIAN: lấy từ loi_thoi_gian.json của MV cùng tên (kho
 * THUYHUONG-DIGITAL, mv/nhanh-xuan-ben-cua-so) — Demucs tách giọng, Whisper
 * dò mốc, chín câu sửa tay kể cả bốn câu tiếng Pháp. Mỗi phần ở đây gói đúng
 * bốn câu (hai câu với phần cuối) và khai cả `endMs`, để khoảng nhạc dạo giữa
 * các phần không bị chia cho câu hát. Lời chạy lệch ở đâu thì sửa `startMs`
 * / `endMs` của đúng phần đó.
 *
 * Tệp nhạc phát từ jemappellehuong.com như các bài ngoài album khác.
 */
export const song: RawSong = {
  id: "nhanh-xuan-ben-cua-so",
  trackNo: 10,
  title: "Nhành xuân bên cửa sổ",
  subtitle: "A Spring Branch by the Window",
  language: "Tiếng Việt · Tiếng Pháp",
  meta: "Tiếng Việt · Tiếng Pháp · Đĩa đơn",
  note: "Giã biệt khi vườn vẫn xanh · Bốn mùa xuân bên ô cửa lớp học",
  accent: "#b8842c",
  coverSrc: "photo/nhanh-xuan-ben-cua-so.webp",
  style:
    "Valse piano trữ tình · nhịp 3/4 · piano dạ, cello, dây thính phòng, accordion thoáng qua",
  signature: "«Xin gửi lại nhành xuân bên cửa sổ / Một khoảng trời từng che mát đời nhau.»",
  pictures: [
    {
      src: "photo/nhanh-xuan-tren-bau-cua.webp",
      alt: "Nhành đào đặt trên bậu cửa sổ gỗ, bên cạnh tách trà và mảnh giấy viết tay, chim sẻ đậu ngoài vườn",
      caption: "«Xin gửi lại nhành xuân bên cửa sổ» — để lại trên bậu cửa cho người đến sau.",
    },
    {
      src: "photo/nhanh-xuan-ben-o-cua.webp",
      alt: "Hương mặc áo dài trắng tựa ô cửa gỗ của ngôi trường tường vàng, ngoài vườn hoa nở",
      caption: "«Rồi khép cửa, nhẹ như lần mở cửa» — ô cửa của bốn mùa xuân.",
    },
    {
      src: "photo/nhanh-xuan-hien-nha-dem.webp",
      alt: "Hương mặc áo len đứng dưới hiên nhà gỗ lúc đêm, bên ngọn đèn dầu",
      caption: "«Khép đôi cánh dưới hiên nhà lặng gió» — ngoài kia đông, trong lòng đã xuân.",
    },
  ],
  audioSrc: "https://jemappellehuong.com/assets/audio/nhanh-xuan-ben-cua-so.mp3",
  durationMs: 319872,
  sections: [
    {
      id: "verse1a",
      label: "Khổ 1",
      startMs: 17200,
      endMs: 33420,
      lines: [
        "Ngày tôi đến, nắng vừa hong cửa nhỏ",
        "Một nhành xuân nghiêng xuống phía vai gầy",
        "Tôi đem tiếng lòng mình gieo rất khẽ",
        "Giữa khu vườn chưa thuộc một tên cây",
      ],
    },
    {
      id: "verse1b",
      label: "Khổ 1 · tiếp",
      startMs: 33420,
      endMs: 50460,
      lines: [
        "Bốn lần gió trở về qua ô cửa",
        "Phấn trên tay còn trắng một miền chiều",
        "Có những hạt âm thầm xanh dưới đất",
        "Có lời chào chưa nói đã thân yêu",
      ],
    },
    {
      id: "verse2a",
      label: "Khổ 2",
      startMs: 52960,
      endMs: 68900,
      lines: [
        "Hoa vẫn nở bên thềm như thuở ấy",
        "Trời vẫn xanh qua kẽ lá dịu dàng",
        "Chỉ đôi cánh nghe mùa đang trở giấc",
        "Biết chân trời vừa chớm một mùa sang",
      ],
    },
    {
      id: "verse2b",
      label: "Khổ 2 · tiếp",
      startMs: 69180,
      endMs: 87380,
      lines: [
        "Tôi đứng lại thêm một chiều nắng mỏng",
        "Nghe tiếng cười còn cuối dãy hành lang",
        "Rồi khép cửa, nhẹ như lần mở cửa",
        "Để trong phòng nguyên một vệt nắng vàng",
      ],
    },
    {
      id: "chorusa",
      label: "Điệp khúc",
      startMs: 89560,
      endMs: 105160,
      lines: [
        "Xin gửi lại nhành xuân bên cửa sổ",
        "Một khoảng trời từng che mát đời nhau",
        "Cánh chim nhỏ mang theo mùa nắng cũ",
        "Khẽ nghiêng mình qua bóng lá lao xao",
      ],
    },
    {
      id: "chorusb",
      label: "Điệp khúc · tiếp",
      startMs: 105740,
      endMs: 123580,
      lines: [
        "Có mái hiên đi qua thành thương nhớ",
        "Chẳng là nơi nương cánh suốt mùa đông",
        "Tôi đi kiếm một ngọn đèn còn thức",
        "Để bàn tay thôi lạnh giữa mênh mông",
      ],
    },
    {
      id: "verse3a",
      label: "Khổ 3",
      startMs: 157200,
      endMs: 174100,
      lines: [
        "Mai ai đến, xin cứ ngồi bên cửa",
        "Nắng vẫn về trên chiếc ghế tôi quen",
        "Trang vở mở, một bàn tay nắn nót",
        "Viết tiếp mùa xanh dưới một ngọn đèn",
      ],
    },
    {
      id: "verse3b",
      label: "Khổ 3 · tiếp",
      startMs: 174100,
      endMs: 189780,
      lines: [
        "Còn tôi giữ chút hương thầm trong áo",
        "Từ nhành hoa nép cạnh cửa hôm nào",
        "Qua miền gió, nếu đôi lần ngoảnh lại",
        "Chỉ để nhìn thềm cũ nắng xôn xao",
      ],
    },
    {
      id: "bridge",
      label: "Cầu nối",
      startMs: 193060,
      endMs: 211000,
      lines: [
        "Đâu phải đợi hoa tàn mới giã biệt",
        "Có chuyến đi khi vườn vẫn xanh tươi",
        "Chim giữ lại tiếng mùa xuân trong ngực",
        "Qua mùa đông còn hát được đôi lời",
      ],
    },
    {
      id: "finalchorusa",
      label: "Điệp khúc cuối",
      startMs: 212980,
      endMs: 228700,
      lines: [
        "Xin gửi lại nhành xuân bên cửa sổ",
        "Một khoảng trời từng che mát đời nhau",
        "Cánh chim nhỏ mang theo mùa nắng cũ",
        "Khẽ nghiêng mình qua bóng lá lao xao",
      ],
    },
    {
      id: "finalchorusb",
      label: "Điệp khúc cuối · tiếp",
      startMs: 229600,
      endMs: 246880,
      lines: [
        "Có mái hiên đi qua thành thương nhớ",
        "Chẳng là nơi nương cánh suốt mùa đông",
        "Tôi đi kiếm một ngọn đèn còn thức",
        "Một hiên nhà cho đôi cánh thong dong",
      ],
    },
    {
      id: "outro",
      label: "Kết",
      startMs: 248920,
      endMs: 266180,
      lines: [
        "Hoa bên thềm, xin cứ hồn nhiên nở",
        "Trời phía này vẫn biếc phía trời xa",
        "Một cánh nhỏ nghiêng qua mùa gió trở",
        "Mang chút xuân về sưởi ấm mái nhà",
      ],
    },
    {
      id: "signaturea",
      label: "Lời ký tên",
      startMs: 267800,
      endMs: 275600,
      lines: [
        "Je m’appelle Hương...",
        "Je garde un peu de printemps en moi",
      ],
    },
    {
      id: "signatureb",
      label: "Lời ký tên · tiếp",
      startMs: 276600,
      endMs: 284460,
      lines: [
        "Dẫu mai này qua bao mùa lá đổ",
        "Vẫn mang theo hơi nắng của ngày đầu",
      ],
    },
    {
      id: "signaturec",
      label: "Lời ký tên · tiếp",
      startMs: 284500,
      endMs: 295200,
      lines: [
        "Bonsoir, l’hiver...",
        "Ici, je suis enfin chez moi",
      ],
    },
    {
      id: "finale",
      label: "Câu cuối",
      startMs: 295640,
      endMs: 306280,
      lines: [
        "Khép đôi cánh dưới hiên nhà lặng gió",
        "Ngoài kia đông... trong lòng đã xuân rồi.",
      ],
    },
  ],
};
