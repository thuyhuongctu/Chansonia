import { cn } from "@/lib/utils";

/** Ảnh bìa sinh từ màu chủ đạo của bài — không cần tệp ảnh riêng cho từng track. */
export function Cover({
  accent,
  trackNo,
  size = "md",
  className,
}: {
  accent: string;
  trackNo: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dim = { sm: "size-12", md: "size-16", lg: "size-28" }[size];
  const num = { sm: "text-sm", md: "text-lg", lg: "text-3xl" }[size];
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-xl",
        dim,
        className,
      )}
      style={{
        background: `radial-gradient(circle at 28% 22%, ${accent}, transparent 62%),
                     radial-gradient(circle at 78% 82%, ${accent}55, transparent 58%),
                     linear-gradient(148deg, #12141d, #070810)`,
      }}
      aria-hidden
    >
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center font-display font-medium text-fg/85",
          num,
        )}
      >
        {String(trackNo).padStart(2, "0")}
      </span>
    </div>
  );
}
