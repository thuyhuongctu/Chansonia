import type { Song } from "@/lib/catalog";
import { collectionOf } from "@/lib/library";
import { translateLine } from "@/lib/translations";

/**
 * Ảnh «câu hát» để đăng mạng xã hội: khổ 1080×1350 (4:5, vừa Instagram và
 * Facebook), nền là ảnh bìa của bài phủ một lớp tối, giữa là câu hát và lời
 * dịch tiếng Anh, dưới là tên bài, bộ sưu tập và địa chỉ app.
 */
const W = 1080;
const H = 1350;
const PAD = 96;
const SITE = "chansonia.jemappellehuong.com";

/** Câu hát dùng cho ảnh: câu đang hát nếu bài đang phát tới lời, không thì câu đầu */
export function pickLine(song: Song, lineIndex: number, currentMs: number): string {
  const lines = song.lines;
  if (!lines.length) return song.title;
  const started = currentMs >= lines[0].startMs;
  const line = started && lineIndex >= 0 ? lines[lineIndex] : lines[0];
  return (line ?? lines[0]).words.map((w) => w.text).join(" ");
}

function cssVar(name: string, fallback: string): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/** Ngắt dòng theo bề rộng; chữ quá dài thì thu nhỏ cỡ chữ cho vừa số dòng tối đa */
function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(next).width > maxWidth && cur) {
      lines.push(cur);
      cur = w;
    } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
}

function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  font: (px: number) => string,
  start: number,
  min: number,
  maxLines: number,
  maxWidth: number,
): { lines: string[]; size: number } {
  for (let px = start; px >= min; px -= 4) {
    ctx.font = font(px);
    const lines = wrap(ctx, text, maxWidth);
    if (lines.length <= maxLines) return { lines, size: px };
  }
  ctx.font = font(min);
  return { lines: wrap(ctx, text, maxWidth).slice(0, maxLines), size: min };
}

function draw(ctx: CanvasRenderingContext2D, song: Song, line: string, img: HTMLImageElement | null) {
  const display = cssVar("--font-display", "Georgia, serif");
  const sans = cssVar("--font-sans", "system-ui, sans-serif");
  const accent = song.accent || "#c45c3a";

  // Nền: ảnh bìa phủ kín khung, hoặc dải màu của bài khi không có ảnh
  ctx.fillStyle = "#1d1712";
  ctx.fillRect(0, 0, W, H);
  if (img) {
    const s = Math.max(W / img.width, H / img.height);
    const w = img.width * s;
    const h = img.height * s;
    ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
  } else {
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, accent);
    g.addColorStop(1, "#1d1712");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }
  const shade = ctx.createLinearGradient(0, 0, 0, H);
  shade.addColorStop(0, "rgba(16,12,9,0.55)");
  shade.addColorStop(0.45, "rgba(16,12,9,0.72)");
  shade.addColorStop(1, "rgba(16,12,9,0.9)");
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, W, H);

  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "rgba(255,255,255,0.78)";
  ctx.font = `700 26px ${sans}`;
  ctx.fillText("CHANSONIA", PAD, PAD + 20);

  // Câu hát
  const maxW = W - PAD * 2;
  const quote = fitText(ctx, `“${line}”`, (px) => `600 ${px}px ${display}`, 76, 44, 6, maxW);
  const tr = translateLine(line);
  ctx.font = `italic 400 34px ${sans}`;
  const trLines = tr ? wrap(ctx, tr, maxW).slice(0, 4) : [];
  const quoteH = quote.lines.length * quote.size * 1.22;
  const trH = trLines.length ? 36 + trLines.length * 34 * 1.35 : 0;
  let y = Math.max(PAD + 120, (H - quoteH - trH) / 2 - 40) + quote.size;

  ctx.fillStyle = "#ffffff";
  ctx.font = `600 ${quote.size}px ${display}`;
  for (const l of quote.lines) {
    ctx.fillText(l, PAD, y);
    y += quote.size * 1.22;
  }
  if (trLines.length) {
    y += 36 - quote.size * 0.22;
    ctx.fillStyle = "rgba(255,255,255,0.72)";
    ctx.font = `italic 400 34px ${sans}`;
    for (const l of trLines) {
      ctx.fillText(l, PAD, y);
      y += 34 * 1.35;
    }
  }

  // Chân ảnh: vạch màu, tên bài, bộ sưu tập, địa chỉ app
  const baseY = H - PAD;
  ctx.fillStyle = accent;
  ctx.fillRect(PAD, baseY - 150, 72, 6);
  ctx.fillStyle = "#ffffff";
  const title = fitText(ctx, song.title, (px) => `700 ${px}px ${display}`, 44, 30, 1, maxW);
  ctx.font = `700 ${title.size}px ${display}`;
  ctx.fillText(title.lines[0], PAD, baseY - 88);
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = `400 28px ${sans}`;
  ctx.fillText(`Je m'appelle Hương · ${collectionOf(song.id).name}`, PAD, baseY - 44);
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = `600 24px ${sans}`;
  ctx.fillText(SITE, PAD, baseY);
}

function toBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob"))), "image/png");
    } catch (e) {
      reject(e);
    }
  });
}

/** Vẽ ảnh câu hát; ảnh bìa ở trang khác không cho đọc (CORS) thì dùng nền màu */
export async function makeQuoteCard(song: Song, line: string): Promise<Blob> {
  await document.fonts?.ready;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const img = song.coverSrc ? await loadImage(song.coverSrc) : null;
  draw(ctx, song, line, img);
  try {
    return await toBlob(canvas);
  } catch {
    draw(ctx, song, line, null);
    return toBlob(canvas);
  }
}

/** Gửi ảnh qua bảng chia sẻ của máy; máy không gửi được tệp thì tải ảnh về */
export async function shareQuoteCard(song: Song, line: string): Promise<"shared" | "downloaded"> {
  const blob = await makeQuoteCard(song, line);
  const file = new File([blob], `${song.id}-chansonia.png`, { type: "image/png" });
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (nav.share && nav.canShare?.({ files: [file] })) {
    await nav.share({ files: [file], title: song.title });
    return "shared";
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
  return "downloaded";
}
