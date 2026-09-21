import { useEffect, useState } from "react";

/**
 * Chủ đề sáng/tối — giống nút "Sáng · Tối" của trang songbook trên web.
 *
 * "auto" nghĩa là theo cài đặt của máy. Khi người dùng tự chọn, lựa chọn được
 * ghi vào localStorage và đặt vào thuộc tính data-theme của thẻ <html>; toàn bộ
 * bảng màu trong styles.css đổi theo thuộc tính đó.
 */

export type Theme = "auto" | "light" | "dark";

const KEY = "chansonia-theme";

export function readTheme(): Theme {
  try {
    const v = localStorage.getItem(KEY);
    if (v === "light" || v === "dark") return v;
  } catch {
    /* localStorage bị chặn (chế độ riêng tư) — dùng mặc định */
  }
  return "auto";
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "auto") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);
}

/** Màu nền hiện hành, để đồng bộ thanh trạng thái của điện thoại */
function syncThemeColor() {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!meta) return;
  const paper = getComputedStyle(document.documentElement)
    .getPropertyValue("--paper")
    .trim();
  if (paper) meta.content = paper;
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(readTheme);

  useEffect(() => {
    applyTheme(theme);
    syncThemeColor();
  }, [theme]);

  useEffect(() => {
    if (theme !== "auto") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => syncThemeColor();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  function setTheme(next: Theme) {
    setThemeState(next);
    try {
      if (next === "auto") localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, next);
    } catch {
      /* không ghi được thì vẫn đổi trong phiên này */
    }
  }

  /** Chủ đề đang thực sự hiển thị (tính cả "auto") */
  const resolved: "light" | "dark" =
    theme === "auto"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  return { theme, resolved, setTheme };
}
