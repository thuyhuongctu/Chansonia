import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

/*
 * Đăng ký service worker để ứng dụng mở được khi mất mạng và cài lên màn hình
 * chính. Chỉ chạy ở bản dựng thật và khi mở qua http(s) — mở thẳng từ đĩa
 * (file://) hoặc trong bản Android/iOS đóng gói thì bỏ qua.
 */
const TREN_MAY_NHA = ["localhost", "127.0.0.1", "[::1]", "::1"].includes(
  location.hostname,
);

if (
  import.meta.env.PROD &&
  "serviceWorker" in navigator &&
  (location.protocol === "https:" || TREN_MAY_NHA)
) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      /* Không đăng ký được thì ứng dụng vẫn chạy bình thường. */
    });
  });
}
