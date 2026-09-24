/*
 * Tạo tệp nhạc câm để chạy kiểm thử.
 *
 * Bản thu thật là tài sản riêng, không đưa lên kho mã (xem .gitignore), nên
 * máy chạy kiểm thử tự động sẽ không có tệp nào trong public/audio. Không có
 * tệp nhạc thì trình duyệt không phát được, phần kiểm thử "phát nhạc" và
 * "kéo thanh tiến độ" sẽ hỏng oan.
 *
 * Tệp này sinh ra một bản MP3 im lặng đúng bằng độ dài ghi trong từng bài,
 * CHỈ KHI tệp thật chưa có. Máy của Hương đã có bản thu thì không đụng tới.
 *
 *     node tests/make-silent-audio.mjs
 */

import { mkdirSync, existsSync, writeFileSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const AUDIO_DIR = join(ROOT, "public", "audio");

/* Một khung MP3 im lặng: MPEG-1 Layer III, 128 kbit/s, 44,1 kHz.
   Bốn byte đầu là phần đầu khung, phần còn lại để trống — trình duyệt đọc ra
   đúng 1152 mẫu im lặng. Độ dài khung phải đúng 417 byte
   (144 × 128000 ÷ 44100, lấy phần nguyên); lệch một byte là trình duyệt
   không đọc nổi tệp. */
const FRAME_BYTES = 417;
const SAMPLES_PER_FRAME = 1152;
const SAMPLE_RATE = 44100;

function silentMp3(durationMs) {
  /* Thêm 2% khung dự phòng: trình duyệt đoán độ dài theo cỡ tệp nên hay
     ngắn hơn một chút, mà nhạc ngắn hơn lời thì lời hát đứt giữa chừng. */
  const frames = Math.max(
    1,
    Math.ceil((durationMs / 1000) * (SAMPLE_RATE / SAMPLES_PER_FRAME) * 1.02),
  );
  const frame = Buffer.alloc(FRAME_BYTES);
  frame[0] = 0xff;
  frame[1] = 0xfb;
  frame[2] = 0x90;
  frame[3] = 0x64;
  return Buffer.concat(Array.from({ length: frames }, () => frame));
}

/* Đọc audioSrc và durationMs thẳng từ các tệp bài hát — không cần dịch TypeScript. */
function songs() {
  const dir = join(ROOT, "src", "songs");
  const out = [];
  for (const name of readdirSync(dir).filter((f) => f.endsWith(".ts")).sort()) {
    const text = readFileSync(join(dir, name), "utf8");
    const src = text.match(/audioSrc:\s*"([^"]+)"/)?.[1];
    const ms = Number(text.match(/durationMs:\s*(\d+)/)?.[1]);
    if (src && Number.isFinite(ms)) out.push({ file: src.replace(/^.*\//, ""), ms });
  }
  return out;
}

mkdirSync(AUDIO_DIR, { recursive: true });

const made = [];
for (const { file, ms } of songs()) {
  const path = join(AUDIO_DIR, file);
  if (existsSync(path)) continue;
  writeFileSync(path, silentMp3(ms));
  made.push(`${file} (${Math.round(ms / 1000)}s)`);
}

console.log(
  made.length
    ? `Đã tạo ${made.length} tệp nhạc câm để kiểm thử: ${made.join(", ")}`
    : "Đã có đủ tệp nhạc, không tạo thêm tệp câm nào.",
);
