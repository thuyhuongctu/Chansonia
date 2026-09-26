/**
 * Kiểm tra public/audio/ đang là bản thu thật hay là tệp im lặng do máy tạo.
 *
 *   node scripts/kiem-tra-nhac.mjs
 *
 * Vì sao cần: bản thu là tài sản riêng nên không nằm trong kho mã. Máy nào chưa
 * có bản thu mà chạy `npm test` (hoặc `npm run test:serve`) thì
 * tests/make-silent-audio.mjs sẽ tạo sẵn tệp im lặng đúng tên, đúng độ dài để
 * bộ kiểm thử có gì mà phát. Nhìn thư mục thì thấy đủ bảy tệp, dung lượng cũng
 * đúng cỡ vài MB — y như thật. Đóng gói bản offline lúc đó sẽ ra một ứng dụng
 * hiện đủ lời hát nhưng KHÔNG CÓ TIẾNG. Đây là chỗ để phát hiện trước khi nộp.
 *
 * Cách nhận ra: tệp im lặng gồm đúng một khung MPEG 417 byte lặp đi lặp lại,
 * còn bản thu thật thì mỗi khung một khác.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const THU_MUC = "public/audio";
const KHUNG = 417; // 144 × 128000 ÷ 44100, lấy phần nguyên — xem tests/make-silent-audio.mjs

/** @returns {number} số khung khác nhau, dừng đếm ở `toiDa` cho nhanh */
function demKhungKhacNhau(bytes, toiDa = 5) {
  const thay = new Set();
  for (let i = 0; i + KHUNG <= bytes.length && thay.size < toiDa; i += KHUNG) {
    thay.add(bytes.subarray(i, i + KHUNG).toString("latin1"));
  }
  return thay.size;
}

const tep = readdirSync(THU_MUC).filter((t) => t.endsWith(".mp3")).sort();
if (tep.length === 0) {
  console.error(`Không có tệp .mp3 nào trong ${THU_MUC}/.`);
  process.exit(1);
}

const imLang = [];
for (const ten of tep) {
  const bytes = readFileSync(join(THU_MUC, ten));
  const khung = demKhungKhacNhau(bytes);
  const that = khung > 1;
  if (!that) imLang.push(ten);
  const mb = (bytes.length / 1024 / 1024).toFixed(1).padStart(5);
  console.log(`${that ? "thật     " : "IM LẶNG  "} ${mb} MB  ${ten}`);
}

if (imLang.length > 0) {
  console.error(
    `\n${imLang.length}/${tep.length} tệp là tệp im lặng do máy tạo, không phải bản thu.\n` +
      `Chép bản thu thật vào ${THU_MUC}/ (ghi đè), hoặc đóng gói bản trực tuyến.`,
  );
  process.exit(1);
}

console.log(`\nCả ${tep.length} tệp đều là bản thu thật.`);
