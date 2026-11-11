# Audio directory

This directory is **intentionally empty** in the repository.

## Why there are no mp3 files here

The seven recordings of «La lampe, le fleuve et les couleurs» are not committed.
They are excluded by `.gitignore` (`public/audio/*.mp3`).

Two reasons:

1. **Size.** The seven files total roughly 45 MB — enough to make every clone and
   every fetch of this repository slow, for files that change far less often
   than the code.
2. **Control.** The recordings are proprietary (see `LICENSE`). Keeping them out
   of version control keeps distribution a deliberate act rather than a
   side effect of sharing the source.

## Expected files

Copy the seven files here, under exactly these names:

| File | Track | Length | `durationMs` |
|---|---|---|---|
| `track01.mp3` | Je voudrais te parler | 2:51 | 170952 |
| `track02-den-van-con-sang.mp3` | La lampe brûle encore | 5:13 | 313416 |
| `track03.mp3` | The Lamp Still Burns | 2:04 | 124272 |
| `track04-26-nam-sau-v2.mp3` | 26 Năm Sau | 5:03 | 303024 |
| `track05-father-song-v2.mp3` | A Father's Song to His Little Girl | 5:17 | 317472 |
| `je-mappelle-huong.mp3` | Je m'appelle Hương | 6:14 | 373512 |
| `track07-le-ciel.mp3` | Le ciel que tu n'as jamais quitté *(bonus)* | 5:53 | 353560 |

The `durationMs` column must match the `durationMs` field in the corresponding
file under `src/songs/`. Lyric timing is derived from that number, so a mismatch
makes the lines drift out of sync with the singing.

Then:

```bash
npm install
npm run dev
```

Without these files the app still runs and shows every lyric — pressing **Play**
is simply silent.

## When they are not needed

The streaming build fetches audio from a server instead, so this directory can
stay empty:

```bash
VITE_AUDIO_BASE=https://jemappellehuong.com/assets/audio npm run build
```

See the root `README.md` for the difference between the two builds.

**One catch for the streaming build:** it only plays what is actually on that
server (the songbook site, `jemappellehuong.com/assets/audio/`). A file there
may carry a different name from the one in `public/audio/` — the bonus track is
`track07-le-ciel.mp3` here and `le-ciel-que-tu-nas-jamais-quitte.mp3` on the
server. Such renames are listed in `SERVER_NAME` in `src/lib/audio-source.ts`.