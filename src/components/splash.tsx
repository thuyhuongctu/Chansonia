import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";

/**
 * Màn hình chào lúc mở app: mặt trời mọc lên khỏi mặt sông, chữ "Chansonia"
 * hiện dần, rồi cả màn hình mờ đi sau 2,2 giây và biến mất hẳn ở 2,8 giây.
 *
 * Không bấm được (pointer-events: none) nên không bao giờ chặn tay người dùng.
 * Máy đặt "giảm chuyển động" thì hiện luôn khung hình cuối rồi mờ đi.
 */
export function Splash() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setGone(true), 2800);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;

  return (
    <div className="splash" aria-hidden data-splash>
      <Logo size={176} tile={false} rising title="" />
      <p className="splash-word font-display">Chansonia</p>
    </div>
  );
}
