import type { ReactNode } from "react";
import { ChevronLeft, Moon, Sun } from "lucide-react";
import { ARTIST } from "@/lib/artist";
import { usePlayer } from "@/lib/player-store";
import { useTheme } from "@/lib/theme";
import { Logo } from "@/components/logo";
import { WorldClock } from "@/components/world-clock";
import { LANGS, LANG_NAMES, useLang, useT } from "@/lib/i18n";

/**
 * Thanh đầu trang của thư viện: ô logo, tên app, nút mở trang nghệ sĩ (ảnh
 * chân dung) và nút đổi nền sáng/tối.
 */
export function LibraryHeader() {
  const setView = usePlayer((s) => s.setView);
  const { t } = useT();

  return (
    <header className="pt-safe mx-auto flex w-full max-w-6xl shrink-0 flex-col gap-2 px-4 pb-2.5 lg:flex-row lg:items-center lg:gap-6 lg:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <span className="logo-3d shrink-0 overflow-hidden rounded-[10px]">
          <Logo size={36} />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-base leading-tight font-semibold text-ink">
            Chansonia
          </h1>
          <p className="truncate font-sans text-[11px] text-muted">
            {ARTIST.name} · {t("bài hát và phim")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setView("artist")}
          aria-label={t("Nghệ sĩ")}
          title={t("Nghệ sĩ")}
          className="press size-11 shrink-0 rounded-full border border-line bg-surface bg-cover bg-center"
          style={{ backgroundImage: `url(${ARTIST.portrait})` }}
        />
        <LangButton />
        <ThemeButton />
      </div>
      <div className="lg:w-[420px] lg:shrink-0">
        <WorldClock />
      </div>
    </header>
  );
}

/**
 * Nút đổi ngôn ngữ — tròn 44px, ghi mã ngôn ngữ đang dùng (EN · VI · FR);
 * bấm là chuyển sang ngôn ngữ kế tiếp.
 */
export function LangButton() {
  const lang = useLang((s) => s.lang);
  const setLang = useLang((s) => s.setLang);
  const { t } = useT();
  const next = LANGS[(LANGS.indexOf(lang) + 1) % LANGS.length];
  return (
    <button
      type="button"
      onClick={() => setLang(next)}
      aria-label={`${t("Ngôn ngữ")}: ${LANG_NAMES[lang]} → ${LANG_NAMES[next]}`}
      title={`${t("Ngôn ngữ")}: ${LANG_NAMES[lang]}`}
      data-lang={lang}
      className="press flex size-11 shrink-0 items-center justify-center rounded-full border border-line bg-surface font-sans text-[12px] font-bold tracking-[0.06em] text-muted hover:text-ink"
    >
      {lang.toUpperCase()}
    </button>
  );
}

/** Nút đổi nền sáng/tối — tròn 44px, hình mặt trăng (đang sáng) hoặc mặt trời (đang tối) */
export function ThemeButton() {
  const { resolved, setTheme } = useTheme();
  const { t } = useT();
  const dark = resolved === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? t("Chuyển sang nền sáng") : t("Chuyển sang nền tối")}
      title={dark ? t("Nền sáng") : t("Nền tối")}
      className="press flex size-11 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-muted hover:text-ink"
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}

/**
 * Thanh đầu trang của các màn hình con (lời bài hát, video, nghệ sĩ): nút
 * quay lại, tên màn hình, dòng phụ và chỗ cho nút riêng ở bên phải.
 */
export function ScreenHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  const setView = usePlayer((s) => s.setView);
  const { t } = useT();
  return (
    <header className="pt-safe flex shrink-0 items-center gap-1.5 border-b border-line px-3 pb-2.5 lg:px-5">
      <button
        type="button"
        onClick={() => setView("library")}
        aria-label={t("Quay lại")}
        title={t("Quay lại")}
        className="press flex size-11 shrink-0 items-center justify-center rounded-full text-muted hover:bg-sunk hover:text-ink"
      >
        <ChevronLeft className="size-5" />
      </button>
      <div className="min-w-0 flex-1">
        <p
          className="truncate font-display text-[15px] leading-tight font-semibold text-ink"
          data-screen-title
        >
          {title}
        </p>
        {subtitle ? (
          <p className="truncate font-sans text-[11px] text-muted">
            {subtitle}
          </p>
        ) : null}
      </div>
      {children}
    </header>
  );
}
