/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Địa chỉ gốc của thư mục nhạc khi phát trực tuyến. Bỏ trống = đóng gói offline. */
  readonly VITE_AUDIO_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
