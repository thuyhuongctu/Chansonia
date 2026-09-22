# Chansonia

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.22172794.svg)](https://doi.org/10.5281/zenodo.22172794)

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
- Looks and reads like the songbook page of the author's own site: warm clay
  palette, serif headings, paper cards, and the same clay artwork for every
  track — light or dark, following the device (or the Sáng/Tối switch).
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

Roughly **40 MB** (≈ 2.3 MB of app, ≈ 37 MB of recordings). Plays with no
network connection.

### Streaming build — audio fetched from a server

```bash
VITE_AUDIO_BASE=https://thuyhuongctu.github.io/JESUISHUONG_WEBSITE_2026/assets/audio npm run build
```

Roughly **2.3 MB**, artwork included. Requires a connection during playback,
and does not need the mp3 files present at build time. This is the variant
GitHub Pages deploys, and the one used for the packaged builds below.

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
npx cap sync android                # copies dist/ into the native project
cd android
./gradlew bundleRelease             # -> app/build/outputs/bundle/release/app-release.aab
./gradlew assembleRelease           # -> app/build/outputs/apk/release/app-release.apk
./gradlew assembleDebug             # -> app/build/outputs/apk/debug/app-debug.apk
```

The debug APK is signed with the local debug key and installs straight onto a
phone (`adb install -r app-debug.apk`) — handy for checking a build without
touching the upload keystore.

| | |
|---|---|
| Application ID | `com.jemappellehuong.songbook` |
| Version | 1.1.0 (versionCode 2) |
| min / target SDK | 24 / 36 |

Release builds are signed from `android/upload-keystore.jks` with credentials in
`android/keystore.properties`. **Neither file is in this repository** — both are
excluded by `.gitignore` and must be kept privately. Losing the keystore means
losing the ability to publish updates under this application ID.

Without `keystore.properties` the release task still runs, but produces an
**unsigned** `app-release.aab` / `app-release-unsigned.apk`: good enough to
verify that packaging works, not uploadable to Google Play. Sign it afterwards
with the real keystore, or rebuild on a machine that has it.

Building for Android requires JDK 21 and the Android SDK (platform 36,
build-tools 36.0.0) — installed automatically by Android Studio, or on a
headless machine with the command line tools:

```bash
sdkmanager --licenses
sdkmanager "platform-tools" "platforms;android-36" "build-tools;36.0.0"
echo "sdk.dir=$ANDROID_HOME" > android/local.properties
```

`local.properties` is machine-specific and excluded by `.gitignore`.

### What a packaging run produces

| Artefact | Size | Notes |
|---|---|---|
| `dist/` (streaming) | ≈ 2.3 MB | web bundle, also what GitHub Pages serves |
| `app-release.aab` | ≈ 9.6 MB | Play upload format; unsigned unless the keystore is present |
| `app-release-unsigned.apk` | ≈ 9.8 MB | same build as a raw APK |
| `app-debug.apk` | ≈ 11.2 MB | debug-signed, installable for testing |

Version 1.1.0 (versionCode 2). The APK is larger than the web bundle because it
carries the Capacitor runtime and the full set of splash-screen densities.

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

A track may also carry the songbook fields: `coverSrc` (cover art),
`style` (the *Style:* line — genre, BPM, instrumentation), `signature` (the
representative line, shown in italics) and `pictures` (clay illustrations with
captions). Artwork files live in `public/art/` and are listed in
`src/lib/art.ts`.

---

## Artwork and interface

Every image in the app comes from the songbook page of the author's site,
[`Je-mappelle-Huong/music.html`](https://thuyhuongctu.github.io/Je-mappelle-Huong/music.html),
and is bundled under `public/art/` so the app stays fully offline. The
interface uses the same design tokens as that page — paper `#f6f1e7`,
terracotta `#c45c3a`, river teal `#3f6f68`, serif headings, 16px paper cards
with a thin rule and a soft shadow — with a dark variant that follows the
system setting or the Sáng/Tối button in the header.

---

## Layout

```
src/
  lib/
    artist.ts        artist and album metadata, copyright line
    catalog.ts       assembles songs, derives per-line timing
    audio-source.ts  offline / streaming switch
    player-store.ts  player state (Zustand)
    art.ts           clay artwork used across the app (paths under public/art)
    theme.ts         light / dark switch, mirrors the website's Sáng·Tối button
  songs/             one file per track: lyrics, timings, artwork, style note
  components/        user interface
public/
  audio/             mp3 files (never committed)
  art/               clay artwork copied from the songbook page
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

## Archived on Zenodo

Every GitHub release of this repository is archived on Zenodo, which mints a
DOI for it. Cite the **concept DOI** — it always resolves to the newest
version:

| | |
|---|---|
| Concept DOI (all versions) | [10.5281/zenodo.22172794](https://doi.org/10.5281/zenodo.22172794) |
| v.1.0 (30 Aug 2026) | [10.5281/zenodo.22172795](https://doi.org/10.5281/zenodo.22172795) |

Citation metadata lives in two files at the repository root:
[`CITATION.cff`](CITATION.cff) — which GitHub reads for its "Cite this
repository" button — and [`.zenodo.json`](.zenodo.json), which Zenodo reads at
the tagged commit, so title, author, ORCID, keywords and the *restricted*
access condition are set without editing anything by hand.

### Publishing a new version

No new repository is needed — a new version belongs to the same Zenodo record:

1. Merge the work into `main`.
2. Bump the version in `package.json`, `android/app/build.gradle`
   (`versionCode` **and** `versionName`), `ios/App/App.xcodeproj`
   (`MARKETING_VERSION`), `.zenodo.json` and `CITATION.cff`.
3. Draft a GitHub release with a new tag (`v1.1.0`, …).

Zenodo picks the release up through its GitHub webhook and adds a new version
under the same concept DOI. The webhook is switched on per repository at
[zenodo.org/account/settings/github](https://zenodo.org/account/settings/github)
— only the account owner can do that, and only releases created *after* it is
switched on are archived.

Access on Zenodo is **restricted**, matching the licence below: the record and
its metadata are public, the files are released by the author on request.

---

## Copyright

© 2026 Đỗ Thùy Hương. All rights reserved.

The software, the lyrics, the music, the recordings and the album and artist
names are all proprietary. They are not released under any open-source licence.
Third-party libraries retain their own licences; their presence does not make
this work open source.

Enquiries about use: thuyhuongctu@gmail.com
