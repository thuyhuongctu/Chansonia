import { cn } from "@/lib/utils";

/**
 * Ảnh bìa của bài hát — bo góc 12–16px, viền mảnh và bóng mềm như thẻ bài hát
 * trên trang songbook. Có `src` thì hiển thị ảnh thật; không có thì sinh ảnh
 * gradient từ màu chủ đạo (accent) kèm số thứ tự bài.
 */
export function Cover({
  accent,
  trackNo,
  src,
  alt,
  size = "md",
  className,
}: {
  accent: string;
  trackNo: number;
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dim = { sm: "size-12", md: "size-[104px] sm:size-[130px]", lg: "size-40" }[size];
  const num = { sm: "text-sm", md: "text-2xl", lg: "text-4xl" }[size];
  const radius = size === "sm" ? "rounded-[10px]" : "rounded-xl";

  if (src) {
    return (
      <div
        className={cn(
          "relative shrink-0 overflow-hidden border border-line shadow-song",
          radius,
          dim,
          className,
        )}
      >
        <img
          src={src}
          alt={alt ?? ""}
          className="size-full object-cover object-[50%_12%]"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden border border-line shadow-song",
        radius,
        dim,
        className,
      )}
      style={{
        background: `radial-gradient(circle at 26% 20%, ${accent}, transparent 64%),
                     radial-gradient(circle at 78% 82%, ${accent}44, transparent 60%),
                     linear-gradient(150deg, var(--sunk), var(--surface))`,
      }}
      aria-hidden
    >
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center font-display font-semibold text-ink/70",
          num,
        )}
      >
        {String(trackNo).padStart(2, "0")}
      </span>
    </div>
  );
}
