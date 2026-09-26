# Cách thêm một bài hát

Mỗi bài là **một tệp** trong thư mục này. Ba bước:

## 1. Chép tệp mp3

```
public/audio/ten-bai-hat.mp3
```

## 2. Tạo tệp bài hát

Chép `01-bai-mau-mot.ts` thành tệp mới rồi sửa nội dung:

```ts
import type { RawSong } from "@/lib/catalog";

export const song: RawSong = {
  id: "ten-bai-hat",              // không dấu, không khoảng trắng
  title: "TÊN BÀI HÁT",
  subtitle: "Album · 2026",
  audioSrc: "audio/ten-bai-hat.mp3",
  durationMs: 214000,             // độ dài thật của mp3, tính bằng mili-giây
  accent: "#c45c3a",              // màu chủ đạo của bài, dùng khi không có ảnh bìa
  coverSrc: "art/ten-anh.webp",   // ảnh bìa (tuỳ chọn), đặt trong public/art
  style: "Thể loại · BPM · nhạc cụ",   // dòng "Style:" như trang songbook
  signature: "«Câu hát đại diện.»",    // in nghiêng dưới phần mô tả
  pictures: [                     // ảnh đất sét minh hoạ (tuỳ chọn)
    { src: "art/ten-anh.webp", alt: "Mô tả ảnh", caption: "Chú thích" },
  ],
  sections: [
    {
      id: "verse1",
      label: "Khổ 1",
      startMs: 12000,             // giây bắt đầu phần này × 1000
      lines: [
        "Dòng lời thứ nhất",
        "Dòng lời thứ hai",
        { text: "DÒNG NHẤN MẠNH", role: "title" },
      ],
    },
  ],
};
```

## 3. Đăng ký bài vào danh mục

Mở `src/lib/catalog.ts`, thêm hai dòng theo mẫu đã có sẵn ở đó.

---

## Lấy độ dài mp3 chính xác

```bash
node scripts/song-duration.mjs public/audio/ten-bai-hat.mp3
```

Lệnh này in ra số mili-giây, chép thẳng vào `durationMs`.

## Canh thời gian lời

Chỉ cần điền `startMs` cho **từng phần** (Intro, Khổ 1, Điệp khúc…).
Thời điểm từng dòng và từng chữ được tính tự động theo độ dài văn bản,
chia đều trong khung thời gian của phần đó.

Muốn khớp chính xác hơn thì chia nhỏ phần ra, hoặc điền `endMs` cho phần.
Bài 07 chia nhỏ tới 17 phần chính vì vậy: phần càng ngắn thì lời càng bám sát.

Không biết phần nào bắt đầu ở giây nào thì cứ nghe rồi ghi lại. Cách khác là
nhìn vào chính bản thu: tách phần âm thanh nằm giữa (chỗ giọng hát ngồi), lọc
lấy dải tần giọng người rồi tìm những quãng im — ranh giới giữa các phần hiện
ra khá rõ. Dù bằng cách nào, nghe lại một lượt vẫn là bước cuối cùng.

## Ảnh minh hoạ

- `public/art/` — hình đất sét chép từ trang songbook.
- `public/photo/` — ảnh chụp thật.

Ảnh bìa (`coverSrc`) bị cắt vuông nên hãy dùng ảnh đã cắt sẵn quanh chủ thể.
Ảnh trong `pictures` thì hiện nguyên khung, không cắt: xếp hai cột, ảnh lẻ
cuối cùng chiếm trọn hàng — nên để ảnh ngang ở vị trí cuối cho cân.
