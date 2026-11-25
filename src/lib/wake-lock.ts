import { useEffect } from "react";

type Sentinel = { release: () => Promise<void> };
type WakeLockApi = { request: (type: "screen") => Promise<Sentinel> };

/**
 * Giữ màn hình sáng trong khi `on` là true (ví dụ đang phát nhạc ở màn hình
 * lời). Trình duyệt tự nhả khoá khi người dùng chuyển tab, nên quay lại thì
 * xin lại. Máy không hỗ trợ thì bỏ qua lặng lẽ.
 */
export function useWakeLock(on: boolean) {
  useEffect(() => {
    const api = (navigator as Navigator & { wakeLock?: WakeLockApi }).wakeLock;
    if (!on || !api) return;
    let lock: Sentinel | null = null;
    let alive = true;
    const acquire = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const l = await api.request("screen");
        if (alive) lock = l;
        else void l.release();
      } catch {
        /* pin yếu hoặc trình duyệt từ chối — không sao */
      }
    };
    const onVisible = () => void acquire();
    void acquire();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      alive = false;
      document.removeEventListener("visibilitychange", onVisible);
      void lock?.release().catch(() => {});
    };
  }, [on]);
}
