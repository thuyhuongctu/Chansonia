# Je m'appelle Hương — Songbook

Ứng dụng nghe nhạc kèm lời cho album **«La lampe, le fleuve et les couleurs»**
(mini song-cycle · EP, 6 bài, sáng tác 07–13/08/2026).

Chạy được ở nhiều nơi từ cùng một mã nguồn:

- **Web** — đang chạy tại **[thuyhuongctu.github.io/Chansonia](https://thuyhuongctu.github.io/Chansonia/)**,
  tự động triển khai lại mỗi khi push vào nhánh `main` (xem mục 3).
- **Android** — đóng gói bằng Capacitor, nộp lên CH Play dưới dạng `.aab`.
- **iOS** — dự án Capacitor đã được tạo tại `ios/`, sẵn sàng mở bằng Xcode và gửi qua TestFlight/App Store sau khi cấu hình Apple Developer.

Xem quy trình chi tiết tại [docs/app-store-todo.md](docs/app-store-todo.md).

---

## 1. Chạy thử trên máy

```bash
npm install
npm run dev          # mở http://localhost:5173
```

Muốn nghe nhạc khi chạy thử thì chép 6 tệp mp3 vào `public/audio/`
(xem `public/audio/README.md` để biết tên tệp chính xác).

---

## 2. Hai cách đóng gói

Ứng dụng có công tắc `VITE_AUDIO_BASE` để chọn nguồn nhạc.

### 2.1 Bản OFFLINE — nhạc nằm trong app

```bash
# chép 6 tệp mp3 vào public/audio/ trước
npm run build
```

- App khoảng **40 MB** (≈ 2,3 MB phần ứng dụng + ≈ 37 MB nhạc), phát không cần mạng.
- Dùng khi muốn người nghe không phụ thuộc đường truyền.

### 2.2 Bản TRỰC TUYẾN — nhạc tải từ máy chủ

```bash
VITE_AUDIO_BASE=https://thuyhuongctu.github.io/JESUISHUONG_WEBSITE_2026/assets/audio npm run build
```

- App khoảng **2,3 MB** (đã gồm ảnh), cần mạng khi phát.
- Không cần chép mp3 vào `public/audio/`.
- Đây là bản đang được đóng gói sẵn kèm theo.

Đổi `VITE_AUDIO_BASE` sang địa chỉ khác nếu sau này chuyển nhạc sang máy chủ
khác — không phải sửa mã nguồn, chỉ đổi biến môi trường rồi build lại.

---

## 3. Triển khai bản web

`.github/workflows/deploy-pages.yml` tự động build bản trực tuyến và đưa
`dist/` lên GitHub Pages mỗi khi push vào `main`. Chỉ cần bật một lần ở
Settings → Pages → Source: "GitHub Actions" trên GitHub — sau đó push vào
`main` là đủ để cập nhật trang đang chạy.

Muốn chạy tay: vào tab Actions → "Deploy web app to GitHub Pages" → Run workflow.

---

## 4. Đóng gói Android

```bash
npm run build                       # hoặc bản trực tuyến ở mục 2.2
npx cap sync android                # chép dist/ vào dự án Android
cd android
./gradlew bundleRelease             # -> app/build/outputs/bundle/release/app-release.aab
./gradlew assembleRelease           # -> app/build/outputs/apk/release/app-release.apk
./gradlew assembleDebug             # -> app/build/outputs/apk/debug/app-debug.apk
```

- `.aab` là tệp nộp lên CH Play.
- `.apk` release để cài thử trực tiếp lên điện thoại (`adb install -r app-release.apk`).
- `.apk` debug đã được ký bằng khoá debug của máy, cài thẳng lên điện thoại được
  ngay mà không cần đụng tới khoá ký chính thức.

Nếu máy build **không có** `android/keystore.properties`, lệnh release vẫn chạy
nhưng cho ra tệp **chưa ký** (`app-release.aab`, `app-release-unsigned.apk`):
đủ để kiểm tra việc đóng gói, chưa nộp lên CH Play được. Muốn nộp thì ký lại
bằng khoá thật, hoặc build trên máy có sẵn khoá.

Xem chi tiết nộp CH Play tại [docs/huong-dan-phat-hanh.md](docs/huong-dan-phat-hanh.md).

Khoá ký nằm ở `android/upload-keystore.jks`, mật khẩu ghi trong
`android/keystore.properties`. **Hai tệp này không được đưa lên kho công khai**
(`.gitignore` đã chặn sẵn) và cũng **không được làm mất** — mất khoá là mất
quyền cập nhật ứng dụng trên CH Play.

Cần JDK 21 và Android SDK (platform 36, build-tools 36.0.0) để build — Android
Studio tự cài sẵn, hoặc trên máy không có giao diện thì dùng bộ công cụ dòng lệnh:

```bash
sdkmanager --licenses
sdkmanager "platform-tools" "platforms;android-36" "build-tools;36.0.0"
echo "sdk.dir=$ANDROID_HOME" > android/local.properties
```

Tệp `local.properties` phụ thuộc từng máy nên đã bị `.gitignore` chặn.

### Một lần đóng gói cho ra những gì

| Tệp | Dung lượng | Ghi chú |
|---|---|---|
| `dist/` (bản trực tuyến) | ≈ 2,3 MB | bản web, cũng là bản đưa lên GitHub Pages |
| `app-release.aab` | ≈ 9,6 MB | tệp nộp CH Play; chưa ký nếu máy không có khoá |
| `app-release-unsigned.apk` | ≈ 9,8 MB | cùng bản build, dạng APK |
| `app-debug.apk` | ≈ 11,2 MB | ký bằng khoá debug, cài thử được ngay |

Phiên bản 1.1.0 (versionCode 2). APK nặng hơn bản web vì mang theo phần chạy
Capacitor và trọn bộ ảnh splash cho mọi mật độ màn hình.

---

## 5. Đóng gói iOS và App Store

```bash
npm install
npm run build
npx cap sync ios
npx cap open ios
```

Mở `ios/App/App.xcworkspace` bằng Xcode, chọn Team Apple Developer trong Signing & Capabilities, kiểm tra Bundle Identifier `com.jemappellehuong.songbook`, archive với `Any iOS Device (arm64)`, validate và upload bằng Organizer. Phần ký và gửi build cần thực hiện trên macOS với tài khoản Apple Developer; môi trường Linux không thể tạo archive iOS production.

Xem checklist đầy đủ tại [docs/app-store-todo.md](docs/app-store-todo.md).

---

## 6. Thêm hoặc sửa bài hát

Xem `src/songs/README.md`. Tóm tắt ba bước:

1. Tạo tệp `src/songs/07-ten-bai.ts` theo mẫu.
2. Khai báo `audioSrc: "audio/ten-tep.mp3"` — luôn viết dạng tương đối,
   hàm `resolveAudio()` tự đổi sang địa chỉ đầy đủ khi build bản trực tuyến.
3. Thêm tệp vào danh sách trong `src/lib/catalog.ts`.

Thời lượng (`durationMs`) phải khớp với tệp mp3, nếu lệch thì lời chạy sai nhịp.

Mỗi bài còn có thể khai báo các trường như trang songbook: `coverSrc` (ảnh bìa),
`style` (dòng *Style:* — thể loại, BPM, nhạc cụ), `signature` (câu hát đại diện,
in nghiêng) và `pictures` (ảnh đất sét kèm chú thích). Ảnh để trong
`public/art/`, liệt kê ở `src/lib/art.ts`.

---

## 6b. Hình ảnh và giao diện

Toàn bộ hình trong ứng dụng lấy từ trang songbook cá nhân
[`Je-mappelle-Huong/music.html`](https://thuyhuongctu.github.io/Je-mappelle-Huong/music.html)
và được đóng gói sẵn trong `public/art/` nên mở offline vẫn thấy đủ. Mỗi bài
mang **đúng những khung hình của bài đó trên trang, đúng thứ tự và đúng lời chú
thích** — kể cả khung hình mở đầu các đoạn phim ngắn. Giao diện
dùng đúng bộ màu của trang đó: giấy `#f6f1e7`, đất nung `#c45c3a`, xanh sông
`#3f6f68`, tiêu đề chữ serif, thẻ giấy bo 16px có viền mảnh và bóng mềm; kèm
bản nền tối theo cài đặt máy hoặc nút Sáng/Tối ở đầu trang.

---

## 6c. Tìm kiếm, chuyển động và cài lên máy

**Tìm kiếm** ở trang album tìm cả trong lời hát và **bỏ qua dấu tiếng Việt** —
gõ `den` ra *đèn*, gõ `huong` ra *Hương*. Câu lời khớp được trích ngay trong thẻ
bài hát. Cạnh ô tìm kiếm là bộ lọc theo ngôn ngữ (Việt · Pháp · Anh).

**Thanh tiến độ kéo được** bằng ngón tay hoặc chuột, có nút tròn; phím mũi tên
trái/phải tua 5 giây. Thanh phát có thêm nút bài trước / bài sau và ảnh bìa nhỏ.

**Chuyển động**: trang hiện mờ dần, các thẻ nổi lên lần lượt, nút lún xuống khi
bấm, dòng lời đang hát nhô lên còn dòng ở xa mờ đi. Tất cả tự tắt khi máy đặt
chế độ giảm chuyển động.

**Cài lên máy như một ứng dụng (PWA)**: mở bản web trên điện thoại rồi chọn
*Thêm vào màn hình chính*. App có biểu tượng riêng, mở toàn màn hình và **chạy
được cả khi mất mạng**.

| Tệp | Việc |
| --- | --- |
| `public/manifest.webmanifest` | tên, biểu tượng, màu nền, mở toàn màn hình |
| `public/sw.js` | service worker: lưu sẵn khung ứng dụng và tệp tĩnh |
| `public/icons/` | biểu tượng 192/512 px, bản maskable và bản cho iPhone |

Vài điều cần nhớ trước khi sửa:

- Service worker chỉ chạy ở bản dựng thật, mở qua `https:` (hoặc `localhost`).
  Mở thẳng `dist/index.html` từ đĩa và bản Android/iOS đều bỏ qua.
- **Tệp nhạc không bao giờ được lưu vào bộ nhớ đệm** — tệp rất nặng, và các yêu
  cầu tải từng đoạn (thao tác tua) phải đi thẳng tới máy chủ.
- Trang ưu tiên mạng (đăng bản mới là thấy ngay), tệp tĩnh ưu tiên bản đã lưu.
  Đổi số trong `CACHE` ở `public/sw.js` là mọi máy dọn kho cũ, lưu lại từ đầu.
- Biểu tượng sinh từ `public/art/lr-seal-round.webp` bằng `sharp`; đổi dấu triện
  thì sinh lại.

---

## 7. Cấu trúc

```
src/
  lib/
    artist.ts        thông tin nghệ sĩ, album, dòng bản quyền
    catalog.ts       gom các bài, tính mốc thời gian cho từng dòng lời
    audio-source.ts  công tắc offline / trực tuyến
    player-store.ts  trạng thái trình phát (Zustand)
    art.ts           kho ảnh đất sét dùng chung (đường dẫn trong public/art)
    theme.ts         chuyển nền sáng/tối, giống nút Sáng·Tối của trang web
  songs/             mỗi bài một tệp: lời, mốc thời gian, ảnh, dòng Style
  components/        giao diện
public/
  audio/             mp3 (không commit)
  art/               ảnh đất sét chép từ trang songbook
  brand/             ảnh chân dung, ảnh linh vật
  icons/             biểu tượng để cài lên màn hình chính
  manifest.webmanifest  khai báo ứng dụng cài được (PWA)
  sw.js              service worker: mở được khi mất mạng
android/             dự án Capacitor (Android)
ios/                 dự án Capacitor (iOS)
remotion-video/      video lời bài hát (Remotion, tuỳ chọn xuất video)
docs/                checklist phát hành (Android, iOS)
```

---

## 8. Bảo mật

Đây là app tĩnh, chạy hoàn toàn phía trình duyệt — **không có máy chủ, không
có cơ sở dữ liệu, không tài khoản, không đăng nhập**. Mọi người ghé trang đều
chỉ nhận đúng một bản dựng như nhau từ GitHub Pages, chỉ đọc.

- **Không ai ghé trang có thể sửa được nội dung trang chung.** Các tuỳ chọn cá
  nhân (phát ngẫu nhiên, hẹn giờ ngủ, giao diện sáng/tối) được lưu bằng
  `zustand/persist` ngay trên trình duyệt của người đó (`localStorage`) — chỉ
  riêng máy họ, không gửi đi đâu cả, người khác không thấy được.
- **Không ai ngoài chủ repo có quyền ghi.** Chỉ tài khoản `thuyhuongctu` có
  quyền push/merge; các GitHub App bên thứ ba (ImgBot, ecc-tools, CodeRabbit)
  chỉ có thể bình luận hoặc mở pull request từ nhánh riêng của họ — không có
  gì vào được `main` nếu chủ repo không tự tay duyệt và gộp.
- **Không có thông tin bí mật nào nằm trong repo.** Khoá ký Android
  (`android/upload-keystore.jks`, `android/keystore.properties`) đã bị
  `.gitignore` chặn, chỉ giữ trên máy dùng để build bản phát hành.
- Khuyến nghị thêm (tuỳ chọn) trên GitHub: bật **Settings → Branches →
  branch protection** cho nhánh `main` (bắt buộc phải qua pull request mới
  được gộp) để có thêm một lớp phòng vệ, và thỉnh thoảng kiểm tra lại
  **Settings → Integrations → GitHub Apps** để thu hồi quyền của app nào
  không còn cần dùng.

---

## 9. Lưu trữ trên Zenodo

Mỗi bản phát hành (release) trên GitHub đều được Zenodo lưu lại và cấp một DOI.
Khi trích dẫn, dùng **concept DOI** — địa chỉ này luôn trỏ tới bản mới nhất:

| | |
|---|---|
| Concept DOI (mọi phiên bản) | [10.5281/zenodo.22172794](https://doi.org/10.5281/zenodo.22172794) |
| Bản v.1.0 (30/08/2026) | [10.5281/zenodo.22172795](https://doi.org/10.5281/zenodo.22172795) |

Thông tin trích dẫn nằm ở hai tệp tại gốc kho: [`CITATION.cff`](CITATION.cff)
— GitHub đọc tệp này để hiện nút "Cite this repository" — và
[`.zenodo.json`](.zenodo.json), Zenodo đọc tại đúng commit được gắn thẻ, nhờ
vậy tên, tác giả, ORCID, từ khoá và chế độ truy cập *restricted* được đặt sẵn,
không phải sửa tay trên trang Zenodo.

### Phát hành một phiên bản mới

**Không cần tạo kho mới** — phiên bản mới nằm trong cùng một bản ghi Zenodo:

1. Gộp phần việc vào nhánh `main`.
2. Nâng số phiên bản ở `package.json`, `android/app/build.gradle`
   (cả `versionCode` **và** `versionName`), `ios/App/App.xcodeproj`
   (`MARKETING_VERSION`), `.zenodo.json` và `CITATION.cff`.
3. Tạo release mới trên GitHub kèm thẻ mới (`v1.1.0`, …).

Zenodo nhận release qua webhook GitHub rồi thêm một phiên bản mới vào cùng
concept DOI. Webhook bật riêng cho từng kho tại
[zenodo.org/account/settings/github](https://zenodo.org/account/settings/github)
— chỉ chủ tài khoản bật được, và chỉ những release tạo **sau** khi bật mới
được lưu.

Chế độ truy cập trên Zenodo là **restricted**, đúng với giấy phép độc quyền:
bản ghi và phần mô tả thì công khai, còn tệp thì tác giả cấp khi có người xin.

---

## 10. Bản quyền

© 2026 Đỗ Thùy Hương. Giữ toàn bộ quyền — xem `LICENSE`.

Phần mềm, phần lời, bản ghi âm và tên album/nghệ sĩ đều thuộc sở hữu độc quyền,
không phát hành theo giấy phép mã nguồn mở.
