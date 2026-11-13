import { ArrowUpRight, Globe } from "lucide-react";
import type { Collection } from "@/lib/library";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Link tới trang của dự án gốc và mã DOI của bộ sưu tập */
export function CollectionLinks({
  col,
  className,
  withAlbums = false,
}: {
  col: Collection;
  className?: string;
  /** Thêm link của từng album (ở thư viện thì link album đã nằm ở tiêu đề album) */
  withAlbums?: boolean;
}) {
  const { t } = useT();
  const pill =
    "press inline-flex h-9 max-w-full items-center gap-1.5 rounded-full border border-line bg-surface px-3 font-sans text-xs text-ink hover:border-accent";
  return (
    <div className={cn("flex flex-wrap gap-2", className)} data-collection-links={col.id}>
      {col.link ? (
        <a href={col.link.url} target="_blank" rel="noreferrer noopener" className={pill} data-collection-link>
          <Globe className="size-3.5 shrink-0 text-muted" aria-hidden />
          <span className="truncate">{t(col.link.label)}</span>
          <ArrowUpRight className="size-3.5 shrink-0 text-muted" aria-hidden />
        </a>
      ) : null}
      {(withAlbums ? col.albums ?? [] : []).map((al) =>
        al.link ? (
          <a key={al.id} href={al.link.url} target="_blank" rel="noreferrer noopener" className={pill} data-album-link={al.id}>
            <span className="truncate">{t(al.link.label)}</span>
            <ArrowUpRight className="size-3.5 shrink-0 text-muted" aria-hidden />
          </a>
        ) : null,
      )}
      <a
        href={`https://doi.org/${col.doi}`}
        target="_blank"
        rel="noreferrer noopener"
        className={pill}
        data-collection-doi
        aria-label={`DOI ${col.doi}`}
      >
        <span className="rounded-md bg-accent-2 px-1.5 py-0.5 text-[10px] font-bold tracking-[0.14em] text-paper">DOI</span>
        <span className="tabular-nums">{col.doi}</span>
      </a>
    </div>
  );
}
