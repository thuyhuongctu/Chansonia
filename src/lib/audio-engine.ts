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

export type PlayResult = "ok" | "blocked" | "error";

/**
 * Phát; trả về "blocked" khi trình duyệt chặn tự phát (cần người bấm),
 * "error" khi tệp không tải được (mất mạng, máy chủ lỗi, tệp hỏng).
 */
export async function play(): Promise<PlayResult> {
  const a = ensure();
  try {
    await a.play();
    return "ok";
  } catch (e) {
    if ((e as DOMException)?.name === "NotAllowedError") return "blocked";
    // Bị ngắt vì đổi bài hay tạm dừng giữa chừng thì không phải lỗi.
    if ((e as DOMException)?.name === "AbortError") return "ok";
    return a.error ? "error" : "blocked";
  }
}

export type AudioStatus = "loading" | "ready" | "error";

/** Báo trạng thái tải của tệp đang mở: đang tải / sẵn sàng / lỗi */
export function onStatus(cb: (s: AudioStatus) => void) {
  const a = ensure();
  a.onwaiting = () => cb("loading");
  a.onplaying = () => cb("ready");
  a.oncanplay = () => cb("ready");
  a.onerror = () => cb("error");
}

export function setVolume(v: number) {
  ensure().volume = Math.min(1, Math.max(0, v));
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
