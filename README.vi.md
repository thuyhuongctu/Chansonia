<div align="center">

<img src="public/icons/icon-192.png" width="96" height="96" alt="Logo Chansonia" />

# Chansonia

**Những bài hát kể chuyện. Nghe, đọc lời và xem phim trong một app.**

Ứng dụng nghe nhạc có lời chạy theo nhạc cho các bài hát của **Je m'appelle Hương**
(Đỗ Thùy Hương): album *«La lampe, le fleuve et les couleurs»*, BizOnland, M-AIDA và nhạc
của hai game lịch sử Việt Nam.

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.22172794.svg)](https://doi.org/10.5281/zenodo.22172794)
[![Kiểm thử](https://github.com/thuyhuongctu/Chansonia/actions/workflows/test.yml/badge.svg)](https://github.com/thuyhuongctu/Chansonia/actions/workflows/test.yml)
[![Triển khai](https://github.com/thuyhuongctu/Chansonia/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/thuyhuongctu/Chansonia/actions/workflows/deploy-pages.yml)
![Giấy phép: độc quyền](https://img.shields.io/badge/gi%E1%BA%A5y%20ph%C3%A9p-%C4%91%E1%BB%99c%20quy%E1%BB%81n-c45c3a)
![Giao diện: EN · VI · FR](https://img.shields.io/badge/giao%20di%E1%BB%87n-EN%20%C2%B7%20VI%20%C2%B7%20FR-3f6f68)

**[Mở app](https://thuyhuongctu.github.io/Chansonia/app/)** ·
[English](README.md) ·
[Trích dẫn](#trích-dẫn) ·
[Phát triển](#phát-triển)

</div>

---

## Tóm tắt

| | |
|---|---|
| **Web** | [thuyhuongctu.github.io/Chansonia/app/](https://thuyhuongctu.github.io/Chansonia/app/). Địa chỉ gốc chuyển thẳng vào app và mở màn hình **Giới thiệu**. Tự triển khai lại mỗi lần đẩy lên `main`. |
| **Android** | Dự án Capacitor trong `android/`, nộp lên Google Play dạng `.aab` (`com.jemappellehuong.songbook`, v1.2.0). |
| **iOS** | Dự án Capacitor trong `ios/`, sẵn sàng mở bằng Xcode, gửi TestFlight và App Store. |
| **Thư viện** | 4 bộ sưu tập · 31 bài · 12 video |
| **Giao diện** | Mặc định tiếng Anh, chuyển tiếng Việt và tiếng Pháp bằng một nút |
| **Quyền riêng tư** | Không tài khoản, không máy chủ, không thống kê, không theo dõi |

> [!IMPORTANT]
> **Phần mềm độc quyền.** Công bố để tác giả sử dụng và lưu trữ. Không cấp giấy phép mã nguồn
> mở. Xem [LICENSE](LICENSE) và mục [Bản quyền](#bản-quyền).

---

## Mục lục

- [Thư viện](#thư-viện)
- [Tính năng](#tính-năng)
- [Phát triển](#phát-triển)
- [Kiểm thử](#kiểm-thử)
- [Đóng gói và phát hành](#đóng-gói-và-phát-hành)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Thêm bài hát](#thêm-bài-hát)
- [Quyền riêng tư và bảo mật](#quyền-riêng-tư-và-bảo-mật)
- [Trích dẫn](#trích-dẫn)
- [Bản quyền](#bản-quyền)

---

## Thư viện

| Bộ sưu tập | Bài | Video | Có lời chạy | Trang gốc | DOI |
|---|:-:|:-:|:-:|---|---|
| **La maison de Madam Hương** | 9 | 1 | 7 | [jemappellehuong.com](https://jemappellehuong.com/) | [10.5281/zenodo.22003853](https://doi.org/10.5281/zenodo.22003853) |
| **BizOnland** | 17 | 8 | | [bizonland.com](https://bizonland.com/) | [10.5281/zenodo.23325489](https://doi.org/10.5281/zenodo.23325489) |
| **M-AIDA** | 2 | | | | [10.5281/zenodo.21850575](https://doi.org/10.5281/zenodo.21850575) |
| **Vietnamese History Game Portal** | 3 | 3 | 3 | [Vietnamese-History-Games](https://thuyhuongctu.github.io/Vietnamese-History-Games/) | [10.5281/zenodo.21850564](https://doi.org/10.5281/zenodo.21850564) |

Bộ sưu tập **Vietnamese History Game Portal** (Cổng Trò Chơi Sử Việt) chia theo album, mỗi game
một album, có link vào chơi: *Van Don – Vietnam’s First Trading Port*, *Bac Hai Dao – Pirates of
the Gulf of Tonkin*, và bài chung của hai game *Người trao ta chân trời*.

Bộ sưu tập, bài hát và video khai báo trong [`src/lib/library.ts`](src/lib/library.ts). Bài của
album phát từ app; các bài khác, nhạc game và phim phát trực tuyến từ trang của tác giả, từ
GitHub Pages của repo game và từ YouTube.

<details>
<summary><b>Album «La lampe, le fleuve et les couleurs»</b> (7 bài, 32:35)</summary>

| # | Tên bài | Ngôn ngữ | Độ dài |
|---|---|---|---|
| 1 | Je voudrais te parler | Tiếng Pháp | 2:51 |
| 2 | La lampe brûle encore | Việt · Pháp | 5:13 |
| 3 | The Lamp Still Burns | Tiếng Anh | 2:04 |
| 4 | 26 Năm Sau *(bài chủ đề)* | Tiếng Việt | 5:03 |
| 5 | A Father's Song to His Little Girl | Tiếng Anh | 5:17 |
| 6 | Je m'appelle Hương | Pháp · Việt | 6:14 |
| 7 | Le ciel que tu n'as jamais quitté *(bài tặng thêm)* | Tiếng Pháp | 5:53 |

Mini song-cycle sáu chương (cùng một bài tặng thêm), sáng tác từ 07 đến 13/8/2026.

> *Có những ước mơ không biến mất. Chúng chỉ đổi cây cọ.*

</details>

---

## Tính năng

### Nghe

- **Lời chạy theo nhạc**: dòng đang hát phóng to và trôi vào giữa, chữ đã hát đổi màu đất nung.
  Chạm vào dòng nào là nhạc nhảy tới đó. Chế độ *Trang lời* in cả bài.
- **Hai phiên bản mỗi bài** khi có (tiếng Việt và tiếng Anh, hoặc bản gốc và bản phối).
- **Phát tất cả** một bộ sưu tập hoặc bài yêu thích, **ngẫu nhiên**, **lặp lại** (tắt, cả danh
  sách, một bài), **thanh tiến độ kéo được** và tua bằng bàn phím.
- **Tốc độ phát** 0.75× đến 1.5×, giữ cao độ giọng, app nhớ lựa chọn.
- **Hẹn giờ tắt nhạc** (5 đến 60 phút, hoặc *dừng khi hết bài này*).
- **Điều khiển ở màn hình khoá và tai nghe** (Media Session).

### Sắp xếp

- **Hàng chờ**: menu ⋯ ở mỗi bài có *Phát tiếp theo* và *Thêm vào hàng chờ*; đổi thứ tự, bỏ bớt
  hoặc xoá hàng chờ ngay ở màn hình nghe. *Bài sau* luôn lấy từ hàng chờ trước.
- **Yêu thích** (♥) gom từ mọi bộ sưu tập.
- Mục **Của tôi**: **playlist** tự tạo (tạo, đổi tên, xoá, phát), **nghe nhiều nhất** và **nghe
  gần đây**. Mọi thứ lưu ngay trong máy.
- **Tìm kiếm** theo tên bài và lời, không cần gõ dấu (`den` ra *đèn*), kèm kết quả ở bộ sưu tập khác.
- **Chia sẻ** bài: bảng chia sẻ của máy, hoặc link (`…/app/?bai=ma-bai`) mở thẳng vào bài đó.

### Khám phá

- Màn hình **Giới thiệu**: trước là trang web riêng, nay nằm trong app. Có các bộ sưu tập kèm link
  và DOI, tính năng, MV, nghệ sĩ, mẫu trích dẫn (APA, BibTeX) có nút chép. Tự mở lần đầu dùng app,
  khi vào từ địa chỉ gốc, và bất cứ lúc nào bằng logo.
- Trang **Nghệ sĩ** có bộ ảnh, số liệu thư viện và các link.
- **MV** phát ngay trong app; video YouTube chỉ tải khi bấm vào.

### Dễ chịu

- **Mặc định tiếng Anh**, chuyển tiếng Việt và tiếng Pháp bằng một nút; app nhớ lựa chọn.
- **Nền sáng và nền tối** theo máy, có nút đổi tay.
- **Đồng hồ Việt Nam và Pháp** có cờ ở đầu app.
- **Cài như app** (PWA): toàn màn hình, mở được khi mất mạng, có nút làm mới cho bản cài không có
  thanh địa chỉ.
- Mọi hiệu ứng chuyển động tắt khi máy yêu cầu giảm chuyển động.

---

## Phát triển

```bash
npm install
npm run dev
```

Máy chủ chạy thử ở <http://localhost:5173>.

Muốn nghe album khi chạy thử thì chép 7 tệp mp3 vào `public/audio/` (tên tệp trong
[`public/audio/README.md`](public/audio/README.md)). Thiếu tệp thì app vẫn chạy và hiện đủ lời,
chỉ không phát được nhạc album.

| Lệnh | Việc làm |
|---|---|
| `npm run dev` | Chạy thử, tự tải lại khi sửa mã |
| `npm run build` | Kiểm tra kiểu và dựng app vào `dist/` |
| `npm run build:site` | Dựng app rồi ghép bản GitHub Pages vào `dist-site/` |
| `npm test` | Bộ kiểm thử Playwright, khổ điện thoại và máy tính |
| `npm run test:ui` | Xem từng bước kiểm thử |
| `npm run test:report` | Mở báo cáo lần chạy gần nhất |

**Công nghệ:** Vite 6 · React 19 · TypeScript 5.7 · Tailwind CSS 4 · Zustand 5 · Capacitor 8 ·
Playwright · lucide-react.

---

## Kiểm thử

Bộ kiểm thử Playwright mở bản dựng thật trong trình duyệt thật, ở khổ điện thoại và máy tính:
chạm, gõ, kéo thanh tiến độ, ngắt mạng, để giao diện hỏng bị phát hiện trước khi phát hành.
**161 bài kiểm thử** chạy mỗi lần đẩy mã và mỗi PR ([`test.yml`](.github/workflows/test.yml)); báo
cáo HTML giữ hai tuần.

```bash
npx playwright install --with-deps chromium   # chỉ lần đầu
npm test
```

| Tệp | Kiểm tra |
|---|---|
| `library` | bộ sưu tập và số lượng, album, màn hình chào, ảnh bìa, video, trang nghệ sĩ và bộ ảnh, nền sáng/tối |
| `player` | phát nhạc, tô lời, chạm để tua, trang lời, bài trước/sau, nghe tiếp sau khi tải lại |
| `advanced` | hàng chờ, playlist, mục *Của tôi*, tốc độ phát, nút làm mới, *Phát tất cả* |
| `features` | yêu thích, lặp lại, chia sẻ, Media Session, phím tắt |
| `about` | màn hình Giới thiệu, chuyển hướng từ địa chỉ gốc, link và DOI, chép trích dẫn |
| `search` | tìm không dấu, tìm theo lời, khi không có kết quả, bộ sưu tập khác |
| `i18n` | mặc định tiếng Anh, đổi ngôn ngữ, không còn dấu gạch dài |
| `sleep` · `scrubber` · `motion` · `pwa` | hẹn giờ, thanh tiến độ, giảm chuyển động, cài đặt và chạy offline |

Bản thu không có trong repo, nên [`tests/make-silent-audio.mjs`](tests/make-silent-audio.mjs) tạo
tệp mp3 im lặng đúng độ dài cho bài nào còn thiếu. Tệp này không bao giờ ghi đè bản thu thật.

---

## Đóng gói và phát hành

<details>
<summary><b>Web (GitHub Pages)</b></summary>

[`deploy-pages.yml`](.github/workflows/deploy-pages.yml) chạy `npm run build:site` mỗi lần đẩy lên
`main` rồi đăng `dist-site/`:

| Đường dẫn | Nội dung |
|---|---|
| `app/` | app (bản phát trực tuyến, nhạc lấy từ `jemappellehuong.com`) |
| `index.html` | chuyển vào `app/?gioi-thieu`, giữ nguyên link `?bai=…` cũ |
| `chinh-sach.html` | chính sách quyền riêng tư (cho Google Play) |
| `sw.js` | gỡ service worker cũ từng đăng ký ở thư mục gốc |

Cần bật Pages một lần (Settings → Pages → Source: *GitHub Actions*). Cũng có thể chạy triển khai
bằng tay ở tab Actions.

</details>

<details>
<summary><b>Nhạc trong app hay phát trực tuyến</b></summary>

Một biến `VITE_AUDIO_BASE` quyết định nhạc album lấy từ đâu.

| Bản dựng | Lệnh | Dung lượng | Cần mạng |
|---|---|---|---|
| Offline | `npm run build` (mp3 trong `public/audio/`) | ≈ 37 MB | Không |
| Trực tuyến | `VITE_AUDIO_BASE=https://jemappellehuong.com/assets/audio npm run build` | ≈ 3,3 MB | Có |

Kiểm tra `public/audio/` bằng `node scripts/kiem-tra-nhac.mjs`: dựng bản offline trên tệp im lặng
của bộ kiểm thử thì app chỉ hiện lời mà không phát được. Script đóng gói từ chối chạy tiếp trên
tệp giả.

> [!NOTE]
> Nhạc đặt trên host tĩnh công khai có thể tải trực tiếp qua đường link. Dùng bản offline, hoặc host
> có kiểm soát truy cập, nếu cần giữ bản thu riêng tư.

</details>

<details>
<summary><b>Cài như app (PWA)</b></summary>

| Tệp | Vai trò |
|---|---|
| `public/manifest.webmanifest` | tên, biểu tượng, màu, `display: standalone` |
| `public/sw.js` | service worker: khung app và tệp tĩnh |
| `public/icons/` | biểu tượng 192/512 px, maskable và Apple touch |

- Service worker chỉ đăng ký ở bản dựng chạy qua `https:` hoặc `localhost`; bản Android/iOS bỏ qua.
- **Service worker không lưu nhạc**, để yêu cầu tua (range request) tới thẳng máy chủ.
- Trang lấy mạng trước, tệp tĩnh lấy bộ nhớ trước. Tăng `CACHE` trong `public/sw.js` để mọi máy
  tải lại từ đầu.

</details>

<details>
<summary><b>Android</b></summary>

```bash
scripts/dong-goi-android.sh            # bản offline, nhạc nằm trong app
scripts/dong-goi-android.sh truc-tuyen # bản phát trực tuyến
```

Script dựng bản web, chép vào `android/`, tạo `.aab` và báo đã ký hay chưa. Làm tay:

```bash
npm run build
npx cap sync android
cd android && ./gradlew bundleRelease
```

| | |
|---|---|
| Application ID | `com.jemappellehuong.songbook` |
| Phiên bản | 1.2.0 (versionCode 3) |
| SDK tối thiểu / đích | 24 / 36 |
| Công cụ | JDK 21, Android SDK platform 36, build-tools 36.0.0 |

Bản phát hành được ký bằng `android/upload-keystore.jks` và `android/keystore.properties`. **Hai tệp
này không có trong repo.** Thiếu chúng thì vẫn dựng được, nhưng ra bản chưa ký. Các bước nộp lên
cửa hàng: [docs/huong-dan-phat-hanh.md](docs/huong-dan-phat-hanh.md).

</details>

<details>
<summary><b>iOS</b></summary>

```bash
npm run build
npx cap sync ios
npx cap open ios
```

Mở `ios/App/App.xcworkspace`, chọn team Apple Developer, giữ bundle ID
`com.jemappellehuong.songbook`, archive cho *Any iOS Device (arm64)* rồi tải lên từ Organizer. Cần
máy Mac và tài khoản Apple Developer. Danh sách việc: [docs/app-store-todo.md](docs/app-store-todo.md).

</details>

---

## Cấu trúc thư mục

```
src/
  App.tsx              các màn hình: thư viện, nghe, video, nghệ sĩ, giới thiệu
  components/          giao diện (thư viện, màn hình lời, thanh phát, menu bài,
                       hàng chờ, mục Của tôi, Giới thiệu, nghệ sĩ, hẹn giờ…)
  lib/
    library.ts         bộ sưu tập, album, bài, video, link và DOI
    catalog.ts         mô hình bài hát; chia phần thành dòng và chữ có mốc giờ
    player-store.ts    trạng thái phát (Zustand): hàng chờ, playlist, lịch sử, tốc độ…
    audio-engine.ts    lớp bọc HTMLAudioElement
    audio-source.ts    chuyển giữa nhạc trong app và phát trực tuyến
    i18n.ts            bản dịch giao diện và dữ liệu bài (EN · VI · FR)
    about-text.ts      chữ của màn hình Giới thiệu (EN · VI · FR)
    artist.ts          nghệ sĩ, album, bộ ảnh, dòng bản quyền
    media-controls.ts  điều khiển ở màn hình khoá (Media Session)
  songs/               mỗi bài một tệp: lời, mốc giờ, ảnh, phong cách
    games/             bài hát của các game lịch sử
public/                ảnh, biểu tượng, manifest, service worker
scripts/               đóng gói, ghép GitHub Pages, kiểm tra nhạc
tests/                 bộ kiểm thử Playwright
android/  ios/         dự án Capacitor
remotion-video/        xuất video lời bài hát (tuỳ chọn)
docs/                  hướng dẫn phát hành
```

---

## Thêm bài hát

Mỗi bài là một `RawSong` trong tệp riêng ở `src/songs/` (xem [`src/songs/README.md`](src/songs/README.md)):

1. Chép một tệp bài có sẵn, đặt `id`, `title`, `audioSrc`, `durationMs` và `sections`.
2. Mỗi phần có `startMs`; các dòng trong phần tự chia theo độ dài chữ. Phần dài thì tách đôi, hoặc
   đặt `endMs` ở chỗ ca sĩ nghỉ.
3. Đưa bài vào một bộ sưu tập trong [`src/lib/library.ts`](src/lib/library.ts), thêm bản dịch cho chữ
   giao diện mới vào [`src/lib/i18n.ts`](src/lib/i18n.ts).
4. Sửa `COUNTS` trong [`tests/helpers.ts`](tests/helpers.ts) rồi chạy `npm test`.

> [!TIP]
> `durationMs` phải khớp đúng bản thu, nếu không lời sẽ lệch dần. Video chỉ cần thêm một mục vào
> danh sách `videos` của bộ sưu tập (mã `youtube` hoặc link `mp4`, tên, ảnh xem trước).

---

## Quyền riêng tư và bảo mật

Chansonia là app tĩnh, chạy hoàn toàn trên máy người dùng: không máy chủ, không cơ sở dữ liệu,
không tài khoản, không đăng nhập.

- **Lựa chọn nằm trong máy.** Ngôn ngữ, nền, yêu thích, playlist, hàng chờ, lịch sử và tốc độ phát
  lưu trong `localStorage` của trình duyệt. Không gửi đi đâu.
- **Không thống kê, quảng cáo hay theo dõi.** Chỉ kết nối YouTube khi bấm vào video.
- **Không có bí mật trong repo.** Keystore Android và tệp thuộc tính của nó bị `.gitignore` loại ra,
  chỉ nằm trên máy dựng bản phát hành.
- **Chỉ chủ repo được thay đổi `main`.** Ứng dụng bên thứ ba chỉ bình luận hoặc mở PR.

Nên bật trên GitHub: bảo vệ nhánh `main`, và định kỳ rà các GitHub App đã cài.

---

## Trích dẫn

Mỗi bản phát hành trên GitHub được lưu trữ trên Zenodo. Hãy trích dẫn **concept DOI**, luôn trỏ tới
bản mới nhất: **[10.5281/zenodo.22172794](https://doi.org/10.5281/zenodo.22172794)**.

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

Thông tin trích dẫn nằm trong [`CITATION.cff`](CITATION.cff) (nút *Cite this repository* của GitHub)
và [`.zenodo.json`](.zenodo.json) (Zenodo đọc tại commit được gắn thẻ). Quyền truy cập trên Zenodo là
**hạn chế**: bản ghi công khai, tệp được tác giả cấp khi có yêu cầu.

<details>
<summary><b>Phát hành phiên bản mới</b></summary>

1. Gộp thay đổi vào `main`.
2. Tăng số phiên bản trong `package.json`, `android/app/build.gradle` (`versionCode` và
   `versionName`), `ios/App/App.xcodeproj` (`MARKETING_VERSION`), `.zenodo.json` và `CITATION.cff`.
3. Tạo bản phát hành GitHub với thẻ mới.

Zenodo nhận bản phát hành qua webhook GitHub và thêm phiên bản mới dưới cùng concept DOI.

</details>

---

## Bản quyền

© 2026 Đỗ Thùy Hương. Mọi quyền được bảo lưu.

Phần mềm, lời, nhạc, bản thu, hình ảnh, tên album và tên nghệ sĩ đều là tài sản độc quyền, không
phát hành theo bất kỳ giấy phép mã nguồn mở nào. Thư viện bên thứ ba giữ giấy phép riêng của chúng.

Liên hệ: thuyhuongctu@gmail.com
