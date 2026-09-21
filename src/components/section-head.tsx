/**
 * Đầu mục có vạch kẻ kéo dài hết hàng — đúng kiểu .shead của trang songbook.
 */
export function SectionHead({ title }: { title: string }) {
  return (
    <div className="shead">
      <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
      <span className="shead-line" aria-hidden />
    </div>
  );
}
