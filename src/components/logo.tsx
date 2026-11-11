import { useId } from "react";

/**
 * Logo Chansonia (phương án 6b): khúc sông Mekong uốn thành chữ C, mặt trời
 * mọc ở cửa sông nơi chữ C mở ra.
 *
 * Hình dựng trên một ô vuông 88 đơn vị:
 *  - Vòng sông: vành tròn bán kính ngoài 44, trong 30, màu xanh ngọc, phủ 270°
 *    bắt đầu từ góc 135° (tính theo chiều kim đồng hồ từ 12 giờ) — chỗ hở quay
 *    sang phải.
 *  - Mặt trời: nửa hình tròn rộng 40, cao 20, đáy nằm trên đường chân trời
 *    y = 44, kèm quầng sáng ấm.
 *  - Đường chân trời (x 28–88) và vệt phản chiếu (x 42–70) màu đất nung.
 *
 * `tile` đặt logo lên ô nền tối bo góc 25% — ô này giữ nguyên màu tối ở cả
 * nền sáng lẫn nền tối. `rising` bật hiệu ứng mặt trời mọc của màn hình chào.
 */
export function Logo({
  size = 36,
  tile = true,
  rising = false,
  className,
  title = "Chansonia",
}: {
  size?: number;
  tile?: boolean;
  rising?: boolean;
  className?: string;
  title?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const clip = `sky-${uid}`;
  const glow = `glow-${uid}`;
  const view = tile ? "-17 -17 122 122" : "0 0 88 88";

  return (
    <svg
      width={size}
      height={size}
      viewBox={view}
      role="img"
      aria-label={title}
      className={className}
      data-rising={rising || undefined}
    >
      <defs>
        {/* Chỉ phần trên mặt nước mới thấy được mặt trời và quầng sáng */}
        <clipPath id={clip}>
          <rect x="-40" y="-40" width="170" height="84" />
        </clipPath>
        <filter id={glow} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5.5" />
        </filter>
      </defs>

      {tile ? <rect x="-17" y="-17" width="122" height="122" rx="30.5" fill="#120e0b" /> : null}

      {/* Khúc sông chữ C */}
      <path
        d="M75.113 75.113 A44 44 0 1 1 75.113 12.887 L65.213 22.787 A30 30 0 1 0 65.213 65.213 Z"
        fill="#79b3a6"
      />

      {/* Mặt trời và quầng sáng, cắt ở đường chân trời */}
      <g clipPath={`url(#${clip})`}>
        <g className={rising ? "logo-sun" : undefined}>
          <path d="M34 46 A22 22 0 0 1 78 46 Z" fill="rgba(224,128,85,.75)" filter={`url(#${glow})`} />
          <path d="M36 44 A20 20 0 0 1 76 44 Z" fill="#ffd9a0" />
        </g>
      </g>

      {/* Đường chân trời và vệt phản chiếu */}
      <rect x="28" y="44" width="60" height="4" rx="2" fill="#e08055" />
      <rect
        x="42"
        y="53"
        width="28"
        height="4"
        rx="2"
        fill="#e08055"
        className={rising ? "logo-reflection" : undefined}
      />
    </svg>
  );
}
