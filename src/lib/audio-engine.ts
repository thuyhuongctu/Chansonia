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

export function setTrack(src: string, _durationMs?: number) {
  const a = ensure();
  if (currentSrc === src && a.src) return;
  currentSrc = src;
  a.src = src;
  a.load();
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

export function isPaused(): boolean {
  return ensure().paused;
}

export function onEnded(cb: () => void) {
  const a = ensure();
  a.onended = cb;
}
