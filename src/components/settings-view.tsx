import type { ReactNode } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { RefreshButton, ScreenHeader } from "@/components/header";
import { WorldClock } from "@/components/world-clock";
import { LANGS, LANG_NAMES, useLang, useT } from "@/lib/i18n";
import { useTheme, type Theme } from "@/lib/theme";
import { LYRIC_SCALES, useDisplay } from "@/lib/display-prefs";
import { cn } from "@/lib/utils";

/**
 * Màn hình «Cài đặt»: gom các nút từng nằm chật trên thanh đầu trang (ngôn
 * ngữ, nền sáng/tối, đồng hồ hai nước, làm mới) vào một chỗ, như cách các app
 * nhạc quốc tế đặt phần tuỳ chỉnh sau một nút bánh răng.
 */
export function SettingsView() {
  const { t } = useT();
  return (
    <section className="flex min-h-0 flex-1 flex-col" data-settings>
      <ScreenHeader title={t("Cài đặt")} subtitle="Chansonia" />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 pt-5 pb-40 lg:px-6">
          <Group title={t("Ngôn ngữ")}>
            <LanguagePicker />
          </Group>
          <Group title={t("Giao diện")}>
            <ThemePicker />
          </Group>
          <Group title={t("Lời bài hát")}>
            <LyricSizePicker />
            <KeepAwakeSwitch />
          </Group>
          <Group title={t("Giờ Việt Nam và giờ Pháp")}>
            <WorldClock />
          </Group>
          <Group title={t("Ứng dụng")}>
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-4 py-3">
              <div className="min-w-0">
                <p className="font-sans text-sm font-semibold text-ink">{t("Làm mới trang")}</p>
                <p className="font-sans text-xs text-muted">{t("Tải bản mới nhất, giữ bài đang nghe")}</p>
              </div>
              <RefreshButton />
            </div>
          </Group>
        </div>
      </div>
    </section>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="px-1 font-sans text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">
        {title}
      </h2>
      {children}
    </div>
  );
}

/** Ô chọn có các nút nằm liền nhau, nút đang chọn tô màu nhấn */
function Segmented({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      role="group"
      aria-label={label}
      className="grid auto-cols-fr grid-flow-col gap-1 rounded-2xl border border-line bg-sunk p-1"
    >
      {children}
    </div>
  );
}

function Option({
  active,
  onClick,
  children,
  ...rest
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
} & { "aria-label"?: string } & Record<`data-${string}`, string>) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`press flex min-h-11 items-center justify-center gap-1.5 rounded-xl px-2 font-sans text-sm font-semibold ${
        active ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"
      }`}
      {...rest}
    >
      {children}
    </button>
  );
}

function LanguagePicker() {
  const lang = useLang((s) => s.lang);
  const setLang = useLang((s) => s.setLang);
  const { t } = useT();
  return (
    <Segmented label={t("Ngôn ngữ")}>
      {LANGS.map((l) => (
        <Option key={l} active={l === lang} onClick={() => setLang(l)} data-lang-option={l}>
          {LANG_NAMES[l]}
        </Option>
      ))}
    </Segmented>
  );
}

function ThemePicker() {
  const { theme, setTheme } = useTheme();
  const { t } = useT();
  const items: [Theme, string, ReactNode][] = [
    ["light", t("Nền sáng"), <Sun key="s" className="size-4" aria-hidden />],
    ["dark", t("Nền tối"), <Moon key="m" className="size-4" aria-hidden />],
    ["auto", t("Theo máy"), <Monitor key="a" className="size-4" aria-hidden />],
  ];
  return (
    <Segmented label={t("Giao diện")}>
      {items.map(([value, label, icon]) => (
        <Option key={value} active={theme === value} onClick={() => setTheme(value)} data-theme-option={value}>
          {icon}
          {label}
        </Option>
      ))}
    </Segmented>
  );
}

const SIZE_NAMES = ["Nhỏ", "Vừa", "Lớn", "Rất lớn"] as const;

function LyricSizePicker() {
  const scale = useDisplay((s) => s.lyricScale);
  const setScale = useDisplay((s) => s.setLyricScale);
  const { t } = useT();
  return (
    <>
      <Segmented label={t("Cỡ chữ lời hát")}>
        {LYRIC_SCALES.map((v, i) => (
          <Option
            key={v}
            active={v === scale}
            onClick={() => setScale(v)}
            data-lyric-size={String(v)}
            aria-label={t(SIZE_NAMES[i])}
          >
            <span className="font-display leading-none" style={{ fontSize: `${14 * v}px` }} aria-hidden>
              Aa
            </span>
          </Option>
        ))}
      </Segmented>
      <p
        className="rounded-2xl border border-line bg-surface px-4 py-3 font-display font-semibold text-ink"
        style={{ fontSize: `${19 * scale}px`, lineHeight: 1.28 }}
        data-lyric-preview
      >
        Je voudrais te parler
      </p>
    </>
  );
}

function KeepAwakeSwitch() {
  const on = useDisplay((s) => s.keepAwake);
  const setOn = useDisplay((s) => s.setKeepAwake);
  const { t } = useT();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setOn(!on)}
      data-keep-awake
      className="press flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-4 py-3 text-left"
    >
      <span className="min-w-0">
        <span className="block font-sans text-sm font-semibold text-ink">{t("Giữ màn hình sáng")}</span>
        <span className="block font-sans text-xs text-muted">{t("Màn hình không tự tắt khi đang nghe và xem lời")}</span>
      </span>
      <span
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full transition-colors",
          on ? "bg-accent" : "bg-sunk ring-1 ring-line",
        )}
        aria-hidden
      >
        <span
          className={cn(
            "absolute top-1 size-5 rounded-full bg-white shadow transition-[left]",
            on ? "left-6" : "left-1",
          )}
        />
      </span>
    </button>
  );
}
