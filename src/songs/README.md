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
  accent: "#4b7bec",              // màu chủ đạo của bài, dùng cho ảnh bìa
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
