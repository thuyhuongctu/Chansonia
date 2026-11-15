import { create } from "zustand";

/** Bật / tắt việc đọc dòng đang hát cho trình đọc màn hình. Lưu trong máy. */
const KEY = "chansonia-announce-lines";

function read(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export const useAnnounce = create<{ on: boolean; toggle: () => void }>((set, get) => ({
  on: read(),
  toggle: () => {
    const on = !get().on;
    set({ on });
    try {
      localStorage.setItem(KEY, on ? "1" : "0");
    } catch {
      /* bỏ qua */
    }
  },
}));
