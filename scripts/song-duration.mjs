/*
 * Đo độ dài thật của một tệp nhạc, in ra số mili-giây để chép thẳng vào
 * `durationMs` trong tệp bài hát.
 *
 *     node scripts/song-duration.mjs public/audio/track07-le-ciel.mp3
 *
 * Con số này phải khớp với bản thu: lời hát được canh theo nó, lệch một chút
 * là cả bài chạy sai nhịp.
 *
 * Cách đo: nhờ chính trình duyệt Chromium (đã có sẵn cùng Playwright) giải mã
 * tệp rồi hỏi lại độ dài — đúng bằng con số mà ứng dụng sẽ thấy khi phát.
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright";

const file = process.argv[2];
if (!file) {
  console.error("Thiếu đường dẫn. Ví dụ:\n  node scripts/song-duration.mjs public/audio/track07-le-ciel.mp3");
  process.exit(1);
}
const path = resolve(file);
if (!existsSync(path)) {
  console.error(`Không thấy tệp: ${path}`);
  process.exit(1);
}

const bytes = readFileSync(path);
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const seconds = await page.evaluate(async (data) => {
    const buf = new Uint8Array(data).buffer;
    const ctx = new OfflineAudioContext(1, 1, 44100);
    return (await ctx.decodeAudioData(buf)).duration;
  }, Array.from(bytes));

  const ms = Math.round(seconds * 1000);
  const m = Math.floor(ms / 60000);
  const s = Math.round((ms % 60000) / 1000);
  console.log(`${ms}   (${m}:${String(s).padStart(2, "0")})`);
} finally {
  await browser.close();
}
