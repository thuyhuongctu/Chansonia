/**
 * Trang giới thiệu Chansonia — chữ ba thứ tiếng, số liệu và danh sách lấy
 * thẳng từ thư viện của app (src/lib/library.ts) nên không bao giờ lệch nhau.
 */
import "./style.css";
import mapSvg from "@/assets/ban-do-viet-nam.svg?raw";
import { COLLECTIONS, TOTAL_SONGS, TOTAL_VIDEOS, type Collection } from "@/lib/library";
import { LANGS, T, type Lang } from "./i18n";

const APP = "./app/";
const KEY = "chansonia-site-lang";

/** Ảnh của app nằm trong thư mục app/; địa chỉ đầy đủ (https) giữ nguyên */
const asset = (src: string) => (/^https?:/.test(src) ? src : APP + src);

const COLLECTION_ART: Record<Collection["id"], string> = {
  huong: asset("art/music-cover-ba-cong-con.webp"),
  bizon: "https://bizonland.com/assets/covers/ben-phu-sa-3d.webp",
  maida: "https://jemappellehuong.com/assets/img/maida-film-poster.webp",
};

/* ── Logo (khúc sông chữ C, mặt trời mọc ở cửa sông) ─────────────────── */

function logoSvg(size: number, rising: boolean): string {
  const id = Math.random().toString(36).slice(2, 8);
  return `<svg width="${size}" height="${size}" viewBox="${rising ? "0 0 88 88" : "-17 -17 122 122"}" aria-hidden="true">
  <defs><clipPath id="s${id}"><rect x="-40" y="-40" width="170" height="84"/></clipPath>
  <filter id="g${id}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="5.5"/></filter></defs>
  ${rising ? "" : '<rect x="-17" y="-17" width="122" height="122" rx="30.5" fill="#120e0b"/>'}
  <path d="M75.113 75.113 A44 44 0 1 1 75.113 12.887 L65.213 22.787 A30 30 0 1 0 65.213 65.213 Z" fill="#79b3a6"/>
  <g clip-path="url(#s${id})"><g class="${rising ? "logo-sun" : ""}">
    <path d="M34 46 A22 22 0 0 1 78 46 Z" fill="rgba(224,128,85,.75)" filter="url(#g${id})"/>
    <path d="M36 44 A20 20 0 0 1 76 44 Z" fill="#ffd9a0"/></g></g>
  <rect x="28" y="44" width="60" height="4" rx="2" fill="#e08055"/>
  <rect x="42" y="53" width="28" height="4" rx="2" fill="#e08055"/></svg>`;
}

document.querySelectorAll<HTMLElement>("[data-logo]").forEach((el) => {
  el.innerHTML = logoSvg(Number(el.dataset.logo), el.hasAttribute("data-rising"));
});
document.querySelectorAll<HTMLElement>("[data-map]").forEach((el) => (el.innerHTML = mapSvg));

/* ── Ngôn ngữ ─────────────────────────────────────────────────────────── */

/** Khoá ngôn ngữ dùng chung với app: chọn ở đây thì mở app cũng đúng thứ tiếng ấy */
const APP_KEY = "chansonia-lang";

/** Mặc định tiếng Anh; có lựa chọn đã lưu thì theo lựa chọn đó */
function initialLang(): Lang {
  try {
    const saved = (localStorage.getItem(KEY) ?? localStorage.getItem(APP_KEY)) as Lang | null;
    if (saved && LANGS.includes(saved)) return saved;
  } catch {
    /* không đọc được thì dùng mặc định */
  }
  return "en";
}

let lang: Lang = initialLang();
const t = (k: string) => T[lang][k] ?? T.vi[k] ?? k;

function render() {
  document.documentElement.lang = lang;
  document.title = t("meta.title");
  document.querySelector('meta[name="description"]')?.setAttribute("content", t("meta.desc"));
  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n!);
  });
  document.querySelectorAll<HTMLButtonElement>("[data-lang]").forEach((b) => {
    b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
  });
  renderStats();
  renderCollections();
  renderVideos();
}

document.querySelectorAll<HTMLButtonElement>("[data-lang]").forEach((b) =>
  b.addEventListener("click", () => {
    lang = b.dataset.lang as Lang;
    try {
      localStorage.setItem(KEY, lang);
      localStorage.setItem(APP_KEY, lang);
    } catch {
      /* bỏ qua */
    }
    render();
  }),
);

/* ── Số liệu, bộ sưu tập, MV ──────────────────────────────────────────── */

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** "1 video" / "8 videos": dùng khoá ".one" khi đúng một (tiếng Việt không đổi) */
const count = (n: number, key: string) => `${n} ${esc(t(n === 1 && T[lang][`${key}.one`] ? `${key}.one` : key))}`;

function renderStats() {
  const items: [number, string][] = [
    [TOTAL_SONGS, "stat.songs"],
    [TOTAL_VIDEOS, "stat.videos"],
    [COLLECTIONS.length, "stat.collections"],
    [3, "stat.langs"],
  ];
  document.querySelector("[data-stats]")!.innerHTML = items
    .map(([n, k]) => `<div><dt>${esc(t(k))}</dt><dd>${n}</dd></div>`)
    .join("");
}

function renderCollections() {
  document.querySelector("[data-collections]")!.innerHTML = COLLECTIONS.map(
    (c) => `
    <a class="card tilt reveal" data-tilt href="${APP}" style="--c:${c.color === "var(--accent)" ? "#c45c3a" : c.color === "var(--accent-2)" ? "#3f6f68" : c.color}">
      <div class="card-art" data-fit="${c.id === "maida" ? "contain" : "cover"}"><img src="${COLLECTION_ART[c.id]}" alt="" loading="lazy" /></div>
      <div class="card-body">
        <p class="card-count">${count(c.songs.length, "col.songs")} · ${count(c.videos.length, "col.videos")}</p>
        <h3>${esc(c.name)}</h3>
        <p>${esc(t(`col.${c.id}.desc`))}</p>
        <span class="card-link">${esc(t("col.open"))}</span>
      </div>
    </a>`,
  ).join("");
  observeReveals();
  bindTilt();
}

function renderVideos() {
  const vids = COLLECTIONS.flatMap((c) => c.videos.map((v) => ({ ...v, col: c.name })));
  document.querySelector("[data-videos]")!.innerHTML = vids
    .map((v) => {
      const href = v.youtube
        ? `https://www.youtube.com/watch?v=${v.youtube}`
        : v.playlist
          ? `https://www.youtube.com/playlist?list=${v.playlist}`
          : v.mp4 ?? APP;
      const poster = v.poster
        ? asset(v.poster)
        : v.youtube
          ? `https://i.ytimg.com/vi/${v.youtube}/hqdefault.jpg`
          : "";
      return `
      <a class="video reveal" href="${esc(href)}" target="_blank" rel="noopener">
        <span class="video-thumb" style="background-image:url('${esc(poster)}')"><span class="play" aria-hidden="true">▶</span></span>
        <span class="video-title">${esc(v.title)}</span>
        <span class="video-meta">${esc(v.col)}${v.duration ? ` · ${esc(v.duration)}` : ""}</span>
      </a>`;
    })
    .join("");
  observeReveals();
}

/* ── Chuyển động: hiện dần khi cuộn tới, nghiêng 3D theo con trỏ ──────── */

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = window.matchMedia("(pointer: fine)").matches;

const io =
  "IntersectionObserver" in window && !reduce
    ? new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io?.unobserve(e.target);
            }
          }),
        { rootMargin: "0px 0px -8% 0px" },
      )
    : null;

function observeReveals() {
  document.querySelectorAll(".reveal:not(.in)").forEach((el) => {
    if (io) io.observe(el);
    else el.classList.add("in");
  });
}

function bindTilt() {
  if (!fine || reduce) return;
  document.querySelectorAll<HTMLElement>("[data-tilt]:not([data-tilt-bound])").forEach((el) => {
    el.dataset.tiltBound = "";
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty("--ry", `${(x * 12).toFixed(2)}deg`);
      el.style.setProperty("--rx", `${(-y * 12).toFixed(2)}deg`);
      el.style.setProperty("--gx", `${((x + 0.5) * 100).toFixed(1)}%`);
      el.style.setProperty("--gy", `${((y + 0.5) * 100).toFixed(1)}%`);
      el.dataset.tilting = "";
    });
    el.addEventListener("pointerleave", () => {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
      delete el.dataset.tilting;
    });
  });
}

/* ── Chép mẫu trích dẫn ───────────────────────────────────────────────── */

document.querySelectorAll<HTMLButtonElement>("[data-copy]").forEach((b) =>
  b.addEventListener("click", async () => {
    const text = document.getElementById(b.dataset.copy!)?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      b.textContent = t("cite.copied");
      setTimeout(() => (b.textContent = t("cite.copy")), 1600);
    } catch {
      /* trình duyệt chặn bộ nhớ tạm — người dùng vẫn bôi đen chép tay được */
    }
  }),
);

/* ── Thanh điều hướng đổ bóng khi đã cuộn ─────────────────────────────── */

const nav = document.querySelector<HTMLElement>("[data-nav]")!;
const onScroll = () => nav.toggleAttribute("data-scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

document.querySelectorAll(".section h2, .section .section-lead, .feature, .artist, .cite-box").forEach((el) =>
  el.classList.add("reveal"),
);

render();
bindTilt();
observeReveals();
