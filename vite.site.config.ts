import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

/**
 * Trang giới thiệu (thư mục site/). Dựng ra dist-site/, rồi
 * scripts/gop-trang-web.mjs chép app (dist/) vào dist-site/app/.
 *
 *     npm run build:site
 */
export default defineConfig({
  root: fileURLToPath(new URL("./site", import.meta.url)),
  base: "./",
  publicDir: "public",
  build: {
    outDir: fileURLToPath(new URL("./dist-site", import.meta.url)),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
