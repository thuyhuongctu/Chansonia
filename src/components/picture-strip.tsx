import type { Picture } from "@/lib/art";
import { cn } from "@/lib/utils";

/**
 * Dải ảnh đất sét minh hoạ — dựng theo đúng cách trang songbook trên web bày
 * ảnh: ảnh thu vừa khung (không cắt xén), bo góc, viền mảnh, chú thích nhỏ
 * bên dưới. Một ảnh thì trải rộng; nhiều ảnh thì xếp hai cột, ảnh lẻ cuối
 * cùng chiếm trọn hàng.
 */
export function PictureStrip({
  pictures,
  className,
}: {
  pictures: Picture[];
  className?: string;
}) {
  if (!pictures.length) return null;

  if (pictures.length === 1) {
    return (
      <figure className={cn("songpic", className)}>
        <img src={pictures[0].src} alt={pictures[0].alt} loading="lazy" />
        {pictures[0].caption ? (
          <figcaption className="mt-2 font-sans text-xs leading-relaxed text-muted">
            {pictures[0].caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  const odd = pictures.length % 2 === 1;

  return (
    <div className={cn("picrow grid grid-cols-1 gap-3 sm:grid-cols-2", className)}>
      {pictures.map((pic, i) => (
        <figure
          key={pic.src + i}
          className={cn(
            "m-0",
            odd && i === pictures.length - 1 && "sm:col-span-2",
          )}
        >
          <img src={pic.src} alt={pic.alt} loading="lazy" />
          {pic.caption ? (
            <figcaption className="mt-1.5 font-sans text-[0.72rem] leading-relaxed text-muted">
              {pic.caption}
            </figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  );
}
