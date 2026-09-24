import { useEffect, useRef, useState } from "react";

/**
 * Linh vật "Hương AI" — dùng ảnh nhân vật có sẵn trong kho ảnh thương hiệu
 * (thuyhuongctu/Je-mappelle-Huong, assets/img/pro_aodai.webp), không vẽ mới.
 * Đầu nghiêng nhẹ theo hướng con trỏ (chỉ khi có chuột thật), nảy lên khi bấm —
 * lấy cảm hứng từ page-mascot nhưng tự dựng bằng một ảnh tĩnh thay vì bộ
 * sprite-sheet AI.
 */
export function HuongAiMascot() {
  const ref = useRef<HTMLButtonElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    function onMove(e: PointerEvent) {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const dead = 220;
      if (dist < dead) {
        setTilt({ rx: 0, ry: 0 });
        return;
      }
      const angle = Math.atan2(dy, dx);
      const max = 10;
      setTilt({
        rx: Math.max(-max, Math.min(max, -Math.sin(angle) * max)),
        ry: Math.max(-max, Math.min(max, Math.cos(angle) * max)),
      });
    }
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  function poke() {
    setBounce(true);
    window.setTimeout(() => setBounce(false), 500);
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={poke}
      aria-label="Hương AI"
      title="Hương AI"
      className="press fixed right-3 z-30 flex size-14 items-center justify-center rounded-full border border-line bg-surface shadow-song sm:right-6"
      style={{
        bottom: "calc(var(--player-h, 7rem) + 14px)",
        transform: bounce
          ? "scale(1.14) rotate(-4deg)"
          : `rotate(${tilt.ry * 0.4}deg) translate(${tilt.ry * 0.5}px, ${tilt.rx * 0.5}px)`,
      }}
    >
      <img
        src="brand/huong-ai.webp"
        alt=""
        aria-hidden
        className="size-full rounded-full object-cover object-top"
      />
    </button>
  );
}
