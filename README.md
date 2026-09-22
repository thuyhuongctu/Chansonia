# Chansonia

A lyrics-synchronised music player for the album
**«La lampe, le fleuve et les couleurs»** — a six-track mini song-cycle by
**Je m'appelle Hương** (Đỗ Thùy Hương), written between 7 and 13 August 2026.

One codebase, multiple targets:

- **Web** — live at **[thuyhuongctu.github.io/Chansonia](https://thuyhuongctu.github.io/Chansonia/)**,
  redeployed automatically on every push to `main`.
- **Android** — packaged with Capacitor, submitted to Google Play as an `.aab`.
- **iOS** — Capacitor project scaffolded under `ios/`, ready to open in Xcode
  and submit via TestFlight/App Store once signed with an Apple Developer
  account. See [docs/app-store-todo.md](docs/app-store-todo.md).

> **This is proprietary software.** It is published here for the author's own
> use and record. No open-source licence is granted — see [LICENSE](LICENSE).

A Vietnamese version of this document is at [README.vi.md](README.vi.md).

---

## The album

| # | Title | Language | Length |
|---|---|---|---|
| 1 | Je voudrais te parler | French | 2:51 |
| 2 | La lampe brûle encore | Vietnamese · French | 5:13 |
| 3 | The Lamp Still Burns | English | 2:04 |
| 4 | 26 Năm Sau *(title track)* | Vietnamese | 5:03 |
| 5 | A Father's Song to His Little Girl | English | 5:17 |
| 6 | Je m'appelle Hương | French · Vietnamese | 6:14 |

Total running time 26:42.

> *Some dreams don't disappear. They change their brush.*

---

## What the app does

- Plays each track with its lyrics scrolling **line by line**, highlighting the
  line currently being sung.
- Groups lyrics into named sections (verse, refrain, bridge…) with a section
  navigator, so any part of a song can be jumped to directly.
- Shows the full lyric sheet of a track as a static page for reading.
- Carries an artist page with the album's epigraph, recurring motifs and links.
- Auto-advances to the next track, either in album order or shuffled.
- Sleep timer: pauses playback automatically after 5–60 minutes.
- Claymorphism ("3D đất sét") visual design across the whole app.
- A decorative "Hương AI" mascot badge that tilts toward the pointer.
- Optional karaoke lyric video export via Remotion — see
  [`remotion-video/`](remotion-video).

No account, no login, no analytics, no advertising, no tracking of any kind —
the app has no backend and no server-side state at all (see
[Security](#security) below).

---

## Running locally

```bash
npm install
npm run dev          # http://localhost:5173
```

To hear audio while developing, drop the six mp3 files into `public/audio/`.
The exact filenames are listed in [`public/audio/README.md`](public/audio/README.md).
Without them the app still runs and displays every lyric — only playback is silent.

---

## Two ways to package

A single environment variable, `VITE_AUDIO_BASE`, selects where the audio
comes from. Nothing else changes between the two builds.

### Offline build — audio bundled inside the app

```bash
# copy the six mp3 files into public/audio/ first
npm run build
```

Roughly **44 MB**. Plays with no network connection.

### Streaming build — audio fetched from a server

```bash
VITE_AUDIO_BASE=https://thuyhuongctu.github.io/JESUISHUONG_WEBSITE_2026/assets/audio npm run build
```

Roughly **8 MB**. Requires a connection during playback, and does not need the
mp3 files present at build time.

Point `VITE_AUDIO_BASE` at a different host to move the audio elsewhere — no
source change needed, just rebuild.

> Audio served from a public static host can be downloaded directly by URL,
> outside the app. Choose the offline build, or a host with access control, if
> the recordings need to stay restricted.

---

## Deploying the web app

`.github/workflows/deploy-pages.yml` builds the streaming variant and
publishes `dist/` to GitHub Pages on every push to `main`, via the official
`actions/deploy-pages` flow. GitHub Pages must be enabled once, under repo
Settings → Pages → Source: "GitHub Actions" — after that, pushing to `main`
is the only step needed to update the live site.

To trigger a deploy manually, run the workflow from the Actions tab
("Deploy web app to GitHub Pages" → Run workflow).

---

## Building for Android

```bash
npm run build                       # or the streaming variant above
npx cap sync android
cd android
./gradlew bundleRelease             # -> app/build/outputs/bundle/release/app-release.aab
./gradlew assembleRelease           # -> app/build/outputs/apk/release/app-release.apk
```

| | |
|---|---|
| Application ID | `com.jemappellehuong.songbook` |
| Version | 1.0.0 (versionCode 1) |
| min / target SDK | 24 / 36 |

Release builds are signed from `android/upload-keystore.jks` with credentials in
`android/keystore.properties`. **Neither file is in this repository** — both are
excluded by `.gitignore` and must be kept privately. Losing the keystore means
losing the ability to publish updates under this application ID.

Building for Android requires the Android SDK (platform 36, build-tools
36.0.0) — installed automatically by Android Studio, or via `sdkmanager` on a
headless machine, with `android/local.properties` pointing `sdk.dir` at it.
`local.properties` is machine-specific and excluded by `.gitignore`.

Google Play submission steps are written up in
[docs/huong-dan-phat-hanh.md](docs/huong-dan-phat-hanh.md) (Vietnamese).

---

## Building for iOS

```bash
npm run build
npx cap sync ios
npx cap open ios
```

Open `ios/App/App.xcworkspace` in Xcode (not the bare `.xcodeproj`), select an
Apple Developer Team under Signing & Capabilities, confirm the Bundle
Identifier is `com.jemappellehuong.songbook`, then archive with
`Any iOS Device (arm64)`, validate, and upload via the Organizer. Signing and
submitting requires macOS and an Apple Developer account — this can't be done
from a Linux environment.

Full checklist in [docs/app-store-todo.md](docs/app-store-todo.md).

---

## Adding or editing a song

Each track is one file under `src/songs/`. The full procedure is in
[`src/songs/README.md`](src/songs/README.md); in short:

1. Create `src/songs/07-title.ts` from an existing file as a template.
2. Set `audioSrc: "audio/filename.mp3"` — always relative. `resolveAudio()`
   rewrites it to an absolute URL when building in streaming mode.
3. Register the file in `src/lib/catalog.ts`.

`durationMs` must match the mp3 exactly, or the lyrics will drift out of sync.

---

## Layout

```
src/
  lib/
    artist.ts        artist and album metadata, copyright line
    catalog.ts       assembles songs, derives per-line timing
    audio-source.ts  offline / streaming switch
    player-store.ts  player state (Zustand)
  songs/             one file per track: lyrics and timings
  components/        user interface
public/
  audio/             mp3 files (never committed)
  brand/             portrait, mascot image
android/             Capacitor project (Android)
ios/                 Capacitor project (iOS)
remotion-video/      karaoke lyric video composition (optional export)
docs/                release checklists (Android, iOS)
```

Built with Vite 6, React 19, TypeScript 5.7, Tailwind CSS 4, Zustand 5 and
Capacitor 8.

---

## Security

This is a static, client-only app: there is no backend, no database, no
accounts and no login. Every visitor gets a read-only copy of the same
build served from GitHub Pages.

- **Nothing a visitor does can change the live site.** Preferences (shuffle,
  sleep timer, theme) are stored with `zustand/persist` in that visitor's own
  browser (`localStorage`) — private to their device, never sent anywhere,
  and invisible to other visitors.
- **No write access is granted to anyone but the repository owner.** Only
  `thuyhuongctu` has push/merge rights; third-party GitHub Apps (ImgBot,
  ecc-tools, CodeRabbit) can only leave comments or open pull requests from
  their own branch — nothing they do reaches `main` without the owner
  reviewing and merging it by hand.
- **No secrets are stored in this repository.** The Android signing keystore
  (`android/upload-keystore.jks`, `android/keystore.properties`) is excluded
  by `.gitignore` and kept only on the machine that builds releases — see
  [Building for Android](#building-for-android).
- Recommended, optional hardening on GitHub: enable **Settings → Branches →
  branch protection on `main`** (require a pull request before merging) as a
  second line of defence, and review **Settings → Integrations → GitHub
  Apps** periodically to revoke any automation no longer wanted.

---

## Copyright

© 2026 Đỗ Thùy Hương. All rights reserved.

The software, the lyrics, the music, the recordings and the album and artist
names are all proprietary. They are not released under any open-source licence.
Third-party libraries retain their own licences; their presence does not make
this work open source.

Enquiries about use: thuyhuongctu@gmail.com
