<div align="center">

<img src="public/icons/icon-192.png" width="96" height="96" alt="Chansonia logo" />

# Chansonia

**Songs that tell stories. Listen, read along and watch, in one app.**

A lyrics-synchronised music player for the songs of **Je m'appelle Hương** (Đỗ Thùy Hương):
the album *«La lampe, le fleuve et les couleurs»*, BizOnland, M-AIDA and the music of two
Vietnamese history games.

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.22172794.svg)](https://doi.org/10.5281/zenodo.22172794)
[![Tests](https://github.com/thuyhuongctu/Chansonia/actions/workflows/test.yml/badge.svg)](https://github.com/thuyhuongctu/Chansonia/actions/workflows/test.yml)
[![Deploy](https://github.com/thuyhuongctu/Chansonia/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/thuyhuongctu/Chansonia/actions/workflows/deploy-pages.yml)
![Licence: proprietary](https://img.shields.io/badge/licence-proprietary-c45c3a)
![Languages: EN · VI · FR](https://img.shields.io/badge/UI-EN%20%C2%B7%20VI%20%C2%B7%20FR-3f6f68)

**[Open the app](https://thuyhuongctu.github.io/Chansonia/app/)** ·
[Tiếng Việt](README.vi.md) ·
[Cite](#cite) ·
[Develop](#develop)

</div>

---

## At a glance

| | |
|---|---|
| **Web** | [thuyhuongctu.github.io/Chansonia/app/](https://thuyhuongctu.github.io/Chansonia/app/). The root address forwards to the app and opens its **About** screen. Redeployed on every push to `main`. |
| **Android** | Capacitor project in `android/`, shipped to Google Play as an `.aab` (`com.jemappellehuong.songbook`, v1.2.0). |
| **iOS** | Capacitor project in `ios/`, ready for Xcode, TestFlight and the App Store. |
| **Library** | 4 collections · 31 songs · 13 videos |
| **Interface** | English by default, Vietnamese and French one tap away |
| **Privacy** | No account, no backend, no analytics, no tracking |

> [!IMPORTANT]
> **Proprietary software.** Published for the author's own use and record. No open-source
> licence is granted. See [LICENSE](LICENSE) and [Copyright](#copyright).

---

## Contents

- [The library](#the-library)
- [Features](#features)
- [Develop](#develop)
- [Tests](#tests)
- [Build and ship](#build-and-ship)
- [Project structure](#project-structure)
- [Adding a song](#adding-a-song)
- [Privacy and security](#privacy-and-security)
- [Cite](#cite)
- [Copyright](#copyright)

---

## The library

| Collection | Songs | Videos | Synced lyrics | Source | DOI |
|---|:-:|:-:|:-:|---|---|
| **La maison de Madam Hương** | 9 | 1 | 7 | [jemappellehuong.com](https://jemappellehuong.com/) | [10.5281/zenodo.22003853](https://doi.org/10.5281/zenodo.22003853) |
| **BizOnland** | 17 | 8 | | [bizonland.com](https://bizonland.com/) | [10.5281/zenodo.23325489](https://doi.org/10.5281/zenodo.23325489) |
| **M-AIDA** | 2 | | | | [10.5281/zenodo.21850575](https://doi.org/10.5281/zenodo.21850575) |
| **Vietnamese History Game Portal** | 3 | 4 | 3 | [Vietnamese-History-Games](https://thuyhuongctu.github.io/Vietnamese-History-Games/) | [10.5281/zenodo.21850564](https://doi.org/10.5281/zenodo.21850564) |

The **Vietnamese History Game Portal** collection is split into albums, one per game, each
with a link to play it: *Van Don – Vietnam’s First Trading Port*, *Bac Hai Dao – Pirates of
the Gulf of Tonkin*, and the song both games share, *Người trao ta chân trời*.

Collections, songs and videos are declared in [`src/lib/library.ts`](src/lib/library.ts).
Album tracks play from the app; the other songs, the game music and the films stream from
the author's sites, from the games' GitHub Pages and from YouTube.

<details>
<summary><b>The album «La lampe, le fleuve et les couleurs»</b> (7 tracks, 32:35)</summary>

| # | Title | Language | Length |
|---|---|---|---|
| 1 | Je voudrais te parler | French | 2:51 |
| 2 | La lampe brûle encore | Vietnamese · French | 5:13 |
| 3 | The Lamp Still Burns | English | 2:04 |
| 4 | 26 Năm Sau *(title track)* | Vietnamese | 5:03 |
| 5 | A Father's Song to His Little Girl | English | 5:17 |
| 6 | Je m'appelle Hương | French · Vietnamese | 6:14 |
| 7 | Le ciel que tu n'as jamais quitté *(bonus)* | French | 5:53 |

A six-chapter mini song-cycle (plus a bonus track) written between 7 and 13 August 2026.

> *Some dreams don't disappear. They change their brush.*

</details>

---

## Features

### Listen

- **Karaoke view**: the active line is enlarged and glides to the centre, its words fill with
  terracotta as they are sung. Tap any line to jump there. *Sheet* mode prints the whole lyric.
- **Two versions per song** where they exist (Vietnamese and English, or original and remix),
  switchable in the player.
- **Play all** for a collection or for your favourites, **shuffle**, **repeat** (off, all, one),
  and a **draggable progress bar** with keyboard seeking.
- **Playback speed** 0.75× to 1.5×, pitch kept, remembered.
- **Sleep timer** (5 to 60 minutes, or *stop after this song*).
- **Lock screen and headphone controls** through the Media Session API.

### Organise

- **Queue**: every song has a ⋯ menu with *Play next* and *Add to queue*; reorder, remove or
  clear the queue from the player. *Next* always takes the queue first.
- **Favourites** (♥) gathered across every collection.
- **Mine** tab: your own **playlists** (create, rename, delete, play), **Most played** and
  **Recently played**. Everything stays on the device.
- **Search** across titles and lyrics, accent-insensitive (`den` finds *đèn*), with matches from
  other collections shown underneath.
- **Share** a song: the system share sheet, or a copied link (`…/app/?bai=song-id`) that opens
  straight on that song.

### Discover

- **About** screen: the introduction that used to be a separate website, now inside the app.
  Collections with their links and DOIs, features, music videos, the artist and citation
  templates (APA, BibTeX) with a copy button. It opens on the first visit, from the root web
  address, and from the logo at any time.
- **Artist** page with a photo gallery, library statistics and links.
- **Music videos** play inside the app; YouTube embeds load only when tapped.

### Feel at home

- **English by default**, Vietnamese and French one tap away; the choice is remembered.
- **Light and dark** themes following the device, with a manual switch.
- **Vietnam and France clocks** with flags in the header.
- **Installs as an app** (PWA): full screen, offline shell, and a refresh button for the
  installed app that has no address bar.
- Every animation switches off when the device asks for reduced motion.

---

## Develop

```bash
npm install
npm run dev
```

The dev server runs at <http://localhost:5173>.

To hear the album while developing, put the seven mp3 files into `public/audio/` (names in
[`public/audio/README.md`](public/audio/README.md)). Without them the app still runs and shows
every lyric; only album playback is silent.

| Script | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Type-check and build the app into `dist/` |
| `npm run build:site` | Build, then assemble GitHub Pages in `dist-site/` |
| `npm test` | Playwright suite, phone and desktop widths |
| `npm run test:ui` | Step through the tests visually |
| `npm run test:report` | Open the report of the last run |

**Stack:** Vite 6 · React 19 · TypeScript 5.7 · Tailwind CSS 4 · Zustand 5 · Capacitor 8 ·
Playwright · lucide-react.

---

## Tests

A Playwright suite drives the real production build in a real browser, at phone and desktop
widths: it taps, types, drags the progress bar and pulls the network away, so a broken
interface is caught before release. **161 tests** run on every push and pull request
([`test.yml`](.github/workflows/test.yml)); the HTML report is kept for two weeks.

```bash
npx playwright install --with-deps chromium   # first run only
npm test
```

| Spec | Covers |
|---|---|
| `library` | collections and counts, albums, splash, artwork, videos, artist page and gallery, themes |
| `player` | playback, lyric highlighting, tap-to-seek, sheet mode, next/previous, resume after reload |
| `advanced` | queue, playlists, *Mine* tab, playback speed, refresh, *Play all* |
| `features` | favourites, repeat, sharing, Media Session, keyboard shortcuts |
| `about` | About screen, root redirect, collection links and DOIs, citation copy |
| `search` | accent-insensitive and lyric search, empty state, other collections |
| `i18n` | English default, language switching, no leftover dashes |
| `sleep` · `scrubber` · `motion` · `pwa` | sleep timer, progress bar, reduced motion, offline install |

The recordings are not in the repository, so [`tests/make-silent-audio.mjs`](tests/make-silent-audio.mjs)
writes silent mp3 files of the right length for any track that is missing. It never overwrites
a real recording.

---

## Build and ship

<details>
<summary><b>Web (GitHub Pages)</b></summary>

[`deploy-pages.yml`](.github/workflows/deploy-pages.yml) runs `npm run build:site` on every push
to `main` and publishes `dist-site/`:

| Path | Content |
|---|---|
| `app/` | the app (streaming build, audio from `jemappellehuong.com`) |
| `index.html` | forwards to `app/?gioi-thieu`, keeping `?bai=…` links working |
| `chinh-sach.html` | privacy policy (used by Google Play) |
| `sw.js` | removes the service worker an older root page registered |

Pages must be enabled once (Settings → Pages → Source: *GitHub Actions*). A deploy can also be
started by hand from the Actions tab.

</details>

<details>
<summary><b>Offline or streaming audio</b></summary>

One variable, `VITE_AUDIO_BASE`, decides where album audio comes from.

| Build | Command | Size | Needs network |
|---|---|---|---|
| Offline | `npm run build` (mp3 files in `public/audio/`) | ≈ 37 MB | No |
| Streaming | `VITE_AUDIO_BASE=https://jemappellehuong.com/assets/audio npm run build` | ≈ 3.3 MB | Yes |

Check what is really in `public/audio/` with `node scripts/kiem-tra-nhac.mjs`: an offline build
made over the silent test files would ship an app that shows lyrics and plays nothing. The
packaging script refuses to continue over placeholders.

> [!NOTE]
> Audio on a public static host can be downloaded directly by URL. Use the offline build, or a
> host with access control, if the recordings must stay restricted.

</details>

<details>
<summary><b>Installable web app (PWA)</b></summary>

| File | Role |
|---|---|
| `public/manifest.webmanifest` | name, icons, colours, `display: standalone` |
| `public/sw.js` | service worker: app shell and static files |
| `public/icons/` | 192/512 px, maskable and Apple touch icons |

- The service worker registers only in a production build over `https:` or `localhost`; the
  native builds skip it.
- **Audio is never cached by the service worker**, so range requests (seeking) reach the server.
- Pages are network-first, static files cache-first. Bump `CACHE` in `public/sw.js` to make
  every device start over.

</details>

<details>
<summary><b>Android</b></summary>

```bash
scripts/dong-goi-android.sh            # offline build, audio inside the app
scripts/dong-goi-android.sh truc-tuyen # streaming build
```

The script builds the web bundle, syncs it into `android/`, produces the `.aab` and says whether
it is signed. By hand:

```bash
npm run build
npx cap sync android
cd android && ./gradlew bundleRelease
```

| | |
|---|---|
| Application ID | `com.jemappellehuong.songbook` |
| Version | 1.2.0 (versionCode 3) |
| min / target SDK | 24 / 36 |
| Toolchain | JDK 21, Android SDK platform 36, build-tools 36.0.0 |

Release builds are signed from `android/upload-keystore.jks` with `android/keystore.properties`.
**Neither file is in the repository.** Without them the build still runs and produces an
unsigned bundle. Store submission steps: [docs/huong-dan-phat-hanh.md](docs/huong-dan-phat-hanh.md)
(Vietnamese).

</details>

<details>
<summary><b>iOS</b></summary>

```bash
npm run build
npx cap sync ios
npx cap open ios
```

Open `ios/App/App.xcworkspace`, choose an Apple Developer team, keep the bundle ID
`com.jemappellehuong.songbook`, archive for *Any iOS Device (arm64)* and upload from the
Organizer. Requires macOS and an Apple Developer account. Checklist:
[docs/app-store-todo.md](docs/app-store-todo.md).

</details>

---

## Project structure

```
src/
  App.tsx              views: library, player, video, artist, about
  components/          interface (library, karaoke stage, player bar, song menu,
                       queue, Mine tab, About screen, artist page, sleep timer…)
  lib/
    library.ts         collections, albums, songs, videos, links and DOIs
    catalog.ts         song model; turns sections into timed lines and words
    player-store.ts    player state (Zustand): queue, playlists, history, speed…
    audio-engine.ts    the HTMLAudioElement wrapper
    audio-source.ts    offline / streaming switch
    i18n.ts            interface and song-data translations (EN · VI · FR)
    about-text.ts      About screen text (EN · VI · FR)
    artist.ts          artist, album, photo gallery, copyright line
    media-controls.ts  lock-screen controls (Media Session)
  songs/               one file per song: lyrics, timings, artwork, style note
    games/             songs of the history games
public/                artwork, photos, icons, manifest, service worker
scripts/               packaging, Pages assembly, audio checks
tests/                 Playwright suite
android/  ios/         Capacitor projects
remotion-video/        optional karaoke lyric-video export
docs/                  release checklists
```

---

## Adding a song

Each song is a `RawSong` in its own file under `src/songs/` (see
[`src/songs/README.md`](src/songs/README.md)):

1. Copy an existing song file and set `id`, `title`, `audioSrc`, `durationMs` and `sections`.
2. Give each section a `startMs`; lines inside a section are spread by text length. Split a long
   section, or set `endMs`, where the singer pauses.
3. Register the song in a collection in [`src/lib/library.ts`](src/lib/library.ts), and add any
   new interface text to [`src/lib/i18n.ts`](src/lib/i18n.ts).
4. Update `COUNTS` in [`tests/helpers.ts`](tests/helpers.ts) and run `npm test`.

> [!TIP]
> `durationMs` must match the recording exactly, or the lyrics drift. A video only needs an
> entry in the collection's `videos` list (`youtube` id or `mp4` URL, title, poster).

---

## Privacy and security

Chansonia is a static, client-only app: no backend, no database, no account, no login.

- **Preferences stay on the device.** Language, theme, favourites, playlists, queue, history and
  playback speed live in the browser's `localStorage`. Nothing is sent anywhere.
- **No analytics, advertising or tracking.** YouTube is contacted only when a video is tapped.
- **No secrets in the repository.** The Android keystore and its properties are excluded by
  `.gitignore` and kept only on the release machine.
- **Only the owner can change `main`.** Third-party apps can comment or open pull requests,
  nothing more.

Recommended on GitHub: branch protection on `main`, and a periodic review of installed GitHub Apps.

---

## Cite

Every GitHub release is archived on Zenodo. Cite the **concept DOI**, which always resolves to
the newest version: **[10.5281/zenodo.22172794](https://doi.org/10.5281/zenodo.22172794)**.

```bibtex
@software{do_2026_chansonia,
  author    = {Đỗ, Thùy Hương},
  title     = {Chansonia},
  year      = {2026},
  publisher = {Zenodo},
  doi       = {10.5281/zenodo.22172794},
  url       = {https://doi.org/10.5281/zenodo.22172794}
}
```

Metadata lives in [`CITATION.cff`](CITATION.cff) (GitHub's *Cite this repository*) and
[`.zenodo.json`](.zenodo.json) (read by Zenodo at the tagged commit). Access on Zenodo is
**restricted**: the record is public, the files are released on request.

<details>
<summary><b>Publishing a new version</b></summary>

1. Merge the work into `main`.
2. Bump the version in `package.json`, `android/app/build.gradle` (`versionCode` and
   `versionName`), `ios/App/App.xcodeproj` (`MARKETING_VERSION`), `.zenodo.json` and
   `CITATION.cff`.
3. Draft a GitHub release with a new tag.

Zenodo picks up the release through its GitHub webhook and adds a version under the same
concept DOI.

</details>

---

## Copyright

© 2026 Đỗ Thùy Hương. All rights reserved.

The software, lyrics, music, recordings, artwork and the album and artist names are
proprietary and not released under any open-source licence. Third-party libraries keep their
own licences.

Enquiries: thuyhuongctu@gmail.com
