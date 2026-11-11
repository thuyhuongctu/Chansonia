import { useCallback, useRef } from "react";
import type { HTMLAttributes, PointerEvent as ReactPointerEvent } from "react";
import mapSvg from "@/assets/ban-do-viet-nam.svg?raw";
import { cn } from "@/lib/utils";

const canTilt = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Khối nghiêng 3D theo con trỏ: rê chuột tới đâu, khối ngả về phía đó như
 * một tấm thẻ cầm trên tay. Chỉ chạy với chuột thật (không chạy trên màn
 * cảm ứng) và tắt khi máy đặt "giảm chuyển động".
 */
export function Tilt({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !canTilt()) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--ry", `${(x * 14).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${(-y * 14).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${((y + 0.5) * 100).toFixed(1)}%`);
    el.dataset.tilting = "true";
  }, []);

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    delete el.dataset.tilting;
  }, []);

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn("tilt", className)}
      {...rest}
    >
      {children}
    </div>
  );
}

/**
 * Bản đồ Việt Nam (có Hoàng Sa, Trường Sa) chìm dưới nền trang, trôi chậm
 * trong không gian 3D. Chỉ để trang trí: không bấm được, trình đọc màn hình
 * bỏ qua.
 */
export function MapBackdrop() {
  return (
    <div className="map-backdrop" aria-hidden>
      <div className="map-backdrop-inner" dangerouslySetInnerHTML={{ __html: mapSvg }} />
    </div>
  );
}
