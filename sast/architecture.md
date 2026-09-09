# Architecture: Chansonia

## Technology Stack

| Category | Details |
|---|---|
| Languages | TypeScript, TSX |
| Frameworks | React 19, Vite 6, Tailwind CSS 4, Zustand 5 (client state), Capacitor 8 (Android wrapper) |
| Databases | None |
| Auth mechanism | None — no accounts, no login, no sessions |
| Infrastructure | GitHub Actions (`.github/workflows/deploy-pages.yml`) builds and deploys the static site to GitHub Pages. Android build via Gradle/Capacitor, distributed as a signed `.aab`/`.apk` outside this repo. |
| External services | Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`, via `<link>` in `index.html`). Optionally a second, unrelated GitHub Pages site (`thuyhuongctu.github.io/JESUISHUONG_WEBSITE_2026`) as a static audio CDN, selected at **build time** via the `VITE_AUDIO_BASE` env var. |

## Architecture Overview

Chansonia is a **fully static, client-only single-page app** — a lyrics-synchronised music player for one artist's album. There is no backend, no API server, and no database anywhere in this repository. The entire application is:

1. Compiled at build time from TypeScript source (`src/`) into static HTML/CSS/JS (`dist/`).
2. Served as static files — either from GitHub Pages (web) or bundled into an Android APK/AAB via Capacitor (mobile), which just loads the same static `dist/` output into a WebView.
3. Rendered entirely in the visitor's own browser/WebView. All "data" (song lyrics, timing, artist bio, album metadata) is hardcoded TypeScript in `src/songs/*.ts`, `src/lib/artist.ts`, `src/lib/catalog.ts` — authored by the developer, compiled into the bundle, never fetched from a remote API or database at runtime.

The only genuine runtime network activity is fetching static `.mp3` audio files, either bundled locally (`public/audio/`, offline build) or from a fixed, hardcoded CDN URL baked in at build time (streaming build).

Main modules:
- `src/lib/catalog.ts` — compiles raw per-song data into timed lyric lines/words.
- `src/lib/player-store.ts` — Zustand store; playback state, play-order (shuffle/sequential), sleep timer.
- `src/lib/audio-engine.ts` — thin wrapper around `HTMLAudioElement`.
- `src/lib/audio-source.ts` — resolves `audioSrc` to a local or CDN URL based on `VITE_AUDIO_BASE`.
- `src/components/*` — presentation only (library list, karaoke stage, player bar, sleep timer popover, artist page).

## Data Flow

There is no user-supplied input anywhere in this application — no forms, no query-string parameters read by the app, no comments, no accounts, no file uploads, no search. The only "input" a visitor provides is UI interaction (clicking play/pause/shuffle/seek/sleep-timer-minutes), which only ever reads/writes in-memory Zustand state and native `<audio>`/`<input type="range">` element state. Nothing is persisted to a server, cookie, or `localStorage`/`sessionStorage` (none of the code uses browser storage APIs).

At build time, a repo maintainer sets `VITE_AUDIO_BASE` (a trusted, hardcoded value in `.github/workflows/deploy-pages.yml`) which is compiled into the JS bundle. This is a build-time configuration value, not user input.

## Entry Points

| Entry Point | Type | Auth Required | Description |
|---|---|---|---|
| `index.html` / `src/main.tsx` | Static SPA entry | No | The only entry point. No routes, no server endpoints. |

No HTTP routes, GraphQL schema, gRPC services, CLI commands beyond the build tooling, WebSocket handlers, scheduled jobs, or message consumers exist in this repository.

## Trust Boundaries

- **Build-time → published bundle**: the maintainer's GitHub Actions workflow builds `dist/` and publishes it publicly. Everything in the compiled bundle (all source, including any string literals) is visible to anyone who opens DevTools — see the Sensitive Data Inventory below.
- **Published bundle → visitor's browser**: the app runs entirely client-side; a malicious visitor can only affect their own browser session (there is no shared state or backend to attack on behalf of other users).
- **App → audio CDN**: the app fetches `.mp3` files by a fixed, developer-chosen URL (never influenced by the visitor) from either the same origin or a second GitHub Pages site the same author controls.

## Sensitive Data Inventory

| Data Type | Where Stored | How Accessed | Protection |
|---|---|---|---|
| Android release signing key | `android/upload-keystore.jks` + `android/keystore.properties` | Local filesystem only | Excluded via `.gitignore`; never committed. Confirmed absent from the repository and build output. |
| Audio recordings (`.mp3`) | `public/audio/` (offline build) or external CDN (streaming build) | Publicly downloadable by URL once deployed — by design (this is a public player) | README explicitly documents this trade-off and recommends the offline build or an access-controlled host if recordings must stay restricted. Not a code vulnerability. |
| No credentials, API keys, tokens, or PII of any kind exist in the source tree. | — | — | — |
