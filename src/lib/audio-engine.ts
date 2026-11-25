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

/* Âm lượng thật = âm lượng người nghe chọn × hệ số «mờ dần» khi chuyển bài */
let userVolume = 1;
let fade = 1;

function applyVolume() {
  ensure().volume = Math.min(1, Math.max(0, userVolume * fade));
}

export function setVolume(v: number) {
  userVolume = Math.min(1, Math.max(0, v));
  applyVolume();
}

/** Hệ số mờ dần 0–1: nhỏ dần ở cuối bài, to dần ở đầu bài tự chuyển tới */
export function setFade(f: number) {
  const next = Math.min(1, Math.max(0, f));
  if (next === fade || (Math.abs(next - fade) < 0.01 && next !== 1)) return;
  fade = next;
  applyVolume();
}

/* Tải trước bài kế tiếp để khi chuyển bài không phải chờ */
let preloader: HTMLAudioElement | null = null;
let preloaded = "";

export function preload(src: string) {
  if (!src || src === preloaded || src === currentSrc) return;
  preloaded = src;
  if (!preloader) {
    preloader = new Audio();
    preloader.preload = "auto";
    preloader.muted = true;
  }
  preloader.src = src;
  preloader.load();
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

/** Tốc độ phát (0.5–2); giữ cả khi đổi sang tệp khác */
export function setRate(r: number) {
  const a = ensure();
  a.defaultPlaybackRate = r;
  a.playbackRate = r;
  // Giữ cao độ giọng hát khi nghe nhanh/chậm
  a.preservesPitch = true;
}

/* ── Phát lên loa, TV (Chromecast qua Remote Playback API, AirPlay trên Safari) ── */

type RemoteMedia = HTMLAudioElement & {
  remote?: {
    watchAvailability: (cb: (available: boolean) => void) => Promise<number>;
    prompt: () => Promise<void>;
  };
  webkitShowPlaybackTargetPicker?: () => void;
};

/** Theo dõi có thiết bị phát nào quanh đây không; trả về hàm huỷ theo dõi */
export function watchCast(cb: (available: boolean) => void): () => void {
  const a = ensure() as RemoteMedia;
  let alive = true;
  if (a.remote?.watchAvailability) {
    a.remote.watchAvailability((v) => alive && cb(v)).catch(() => alive && cb(false));
  } else if (typeof a.webkitShowPlaybackTargetPicker === "function") {
    const on = (e: Event) => {
      const ev = e as Event & { availability?: string };
      if (alive) cb(ev.availability === "available");
    };
    a.addEventListener("webkitplaybacktargetavailabilitychanged", on);
    return () => {
      alive = false;
      a.removeEventListener("webkitplaybacktargetavailabilitychanged", on);
    };
  } else cb(false);
  return () => {
    alive = false;
  };
}

/** Mở bảng chọn thiết bị phát của trình duyệt */
export async function promptCast(): Promise<void> {
  const a = ensure() as RemoteMedia;
  if (a.remote?.prompt) await a.remote.prompt();
  else a.webkitShowPlaybackTargetPicker?.();
}
