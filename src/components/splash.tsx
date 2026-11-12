import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";

/**
 * Màn hình chào lúc mở app: mặt trời mọc lên khỏi mặt sông, chữ "Chansonia"
 * hiện dần, rồi cả màn hình mờ đi sau 2,2 giây và biến mất hẳn ở 2,8 giây.
 * Mỗi lượt mở app chỉ hiện một lần.
 *
 * Không bấm được (pointer-events: none) nên không bao giờ chặn tay người dùng.
 * Máy đặt "giảm chuyển động" thì hiện luôn khung hình cuối rồi mờ đi.
 */
const SEEN = "chansonia-splash-seen";

/** Đã xem màn hình chào trong lượt mở app này chưa (đóng tab mở lại thì xem lại) */
function seenThisSession(): boolean {
  try {
    if (sessionStorage.getItem(SEEN)) return true;
    sessionStorage.setItem(SEEN, "1");
  } catch {
    /* không có sessionStorage thì cứ hiện */
  }
  return false;
}

export function Splash() {
  // Chỉ hiện một lần mỗi lượt mở: chuyển trang hay tải lại thì không chờ nữa.
  const [gone, setGone] = useState(seenThisSession);

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
