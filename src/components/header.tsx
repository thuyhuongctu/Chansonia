import type { ReactNode } from "react";
import { ChevronLeft, Moon, Sun } from "lucide-react";
import { ARTIST } from "@/lib/artist";
import { usePlayer } from "@/lib/player-store";
import { useTheme } from "@/lib/theme";
import { Logo } from "@/components/logo";
import { WorldClock } from "@/components/world-clock";

/**
 * Thanh đầu trang của thư viện: ô logo, tên app, nút mở trang nghệ sĩ (ảnh
 * chân dung) và nút đổi nền sáng/tối.
 */
export function LibraryHeader() {
  const setView = usePlayer((s) => s.setView);

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
            {ARTIST.name} · bài hát và phim
          </p>
        </div>
        <button
          type="button"
          onClick={() => setView("artist")}
          aria-label="Nghệ sĩ"
          title="Nghệ sĩ"
          className="press size-11 shrink-0 rounded-full border border-line bg-surface bg-cover bg-center"
          style={{ backgroundImage: `url(${ARTIST.portrait})` }}
        />
        <ThemeButton />
      </div>
      <div className="lg:w-[420px] lg:shrink-0">
        <WorldClock />
      </div>
    </header>
  );
}

/** Nút đổi nền sáng/tối — tròn 44px, hình mặt trăng (đang sáng) hoặc mặt trời (đang tối) */
export function ThemeButton() {
  const { resolved, setTheme } = useTheme();
  const dark = resolved === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Chuyển sang nền sáng" : "Chuyển sang nền tối"}
      title={dark ? "Nền sáng" : "Nền tối"}
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
  return (
    <header className="pt-safe flex shrink-0 items-center gap-1.5 border-b border-line px-3 pb-2.5 lg:px-5">
      <button
        type="button"
        onClick={() => setView("library")}
        aria-label="Quay lại"
        title="Quay lại"
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
