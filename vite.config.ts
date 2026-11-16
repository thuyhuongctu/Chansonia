import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";
import { writeSharePages } from "./scripts/trang-chia-se";

export default defineConfig({
  // Đường dẫn tương đối: bản dựng chạy được khi mở trực tiếp từ đĩa CD/USB
  // (giao thức file://), không bắt buộc phải có máy chủ web.
  base: "./",
  plugins: [
    react(),
    tailwindcss(),
    {
      // Trang chia sẻ riêng cho từng video (v/…) và bài hát (b/…): xem scripts/trang-chia-se.ts
      name: "trang-chia-se",
      apply: "build",
      async closeBundle() {
        const root = fileURLToPath(new URL(".", import.meta.url));
        const n = await writeSharePages(root, fileURLToPath(new URL("./dist", import.meta.url)));
        this.info?.(`trang chia sẻ: ${n}`);
      },
    },
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
