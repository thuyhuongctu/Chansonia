/** Thin HTMLAudioElement wrapper for reliable MP3 playback */

let audio: HTMLAudioElement | null = null;
let currentSrc = "";

function ensure(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio();
    audio.preload = "auto";
    // Keep element attached for iOS / some mobile browsers
    audio.style.display = "none";
    document.body.appendChild(audio);
  }
  return audio;
}

/** Đặt bài; trả về true nếu thật sự đổi sang tệp mới */
export function setTrack(src: string): boolean {
  const a = ensure();
  if (currentSrc === src && a.src) return false;
  currentSrc = src;
  a.src = src;
  a.load();
  return true;
}

export function play() {
  const a = ensure();
  return a.play().catch(() => {
    /* autoplay may be blocked until user gesture */
  });
}

export function pause() {
  ensure().pause();
}

export function seek(ms: number) {
  const a = ensure();
  a.currentTime = Math.max(0, ms / 1000);
}

export function nowMs(): number {
  return (ensure().currentTime || 0) * 1000;
}

/** Độ dài tệp đang mở (ms); 0 khi trình duyệt chưa đọc được */
export function durationMs(): number {
  const d = ensure().duration;
  return Number.isFinite(d) && d > 0 ? d * 1000 : 0;
}

export function isPaused(): boolean {
  return ensure().paused;
}

export function onEnded(cb: () => void) {
  const a = ensure();
  a.onended = cb;
}
