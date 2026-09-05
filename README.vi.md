# Je m'appelle Hương — Songbook

Ứng dụng nghe nhạc kèm lời cho album **«La lampe, le fleuve et les couleurs»**
(mini song-cycle · EP, 6 bài, sáng tác 07–13/08/2026).

Chạy được ở hai nơi từ cùng một mã nguồn:

- **Web** — mở bằng trình duyệt, hoặc đưa lên GitHub Pages / Netlify / Vercel.
- **Android** — đóng gói bằng Capacitor, nộp lên CH Play dưới dạng `.aab`.

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

- App khoảng **44 MB**, phát nhạc không cần mạng.
- Dùng khi muốn người nghe không phụ thuộc đường truyền.

### 2.2 Bản TRỰC TUYẾN — nhạc tải từ máy chủ

```bash
VITE_AUDIO_BASE=https://thuyhuongctu.github.io/JESUISHUONG_WEBSITE_2026/assets/audio npm run build
```

- App khoảng **8 MB**, cần mạng khi phát.
- Không cần chép mp3 vào `public/audio/`.
- Đây là bản đang được đóng gói sẵn kèm theo.

Đổi `VITE_AUDIO_BASE` sang địa chỉ khác nếu sau này chuyển nhạc sang máy chủ
khác — không phải sửa mã nguồn, chỉ đổi biến môi trường rồi build lại.

### 2.3 Đưa lên GitHub Pages tự động

`.github/workflows/deploy-pages.yml` tự build bản trực tuyến và đưa lên GitHub
Pages mỗi khi có commit mới vào nhánh `main`. Cần bật một lần: vào
**Settings → Pages** của repo, chọn **Source** là **GitHub Actions**. Sau đó
địa chỉ live là `https://<owner>.github.io/<repo>/`, không cần build/upload
tay nữa.

---

## 3. Đóng gói Android

```bash
npm run build                       # hoặc bản trực tuyến ở mục 2.2
npx cap sync android
cd android
./gradlew bundleRelease             # -> app/build/outputs/bundle/release/app-release.aab
./gradlew assembleRelease           # -> app/build/outputs/apk/release/app-release.apk
```

- `.aab` là tệp nộp lên CH Play.
- `.apk` để cài thử trực tiếp lên điện thoại (`adb install -r app-release.apk`).

Khoá ký nằm ở `android/upload-keystore.jks`, mật khẩu ghi trong
`android/keystore.properties`. **Hai tệp này không được đưa lên kho công khai**
(`.gitignore` đã chặn sẵn) và cũng **không được làm mất** — mất khoá là mất
quyền cập nhật ứng dụng trên CH Play.

---

## 4. Thêm hoặc sửa bài hát

Xem `src/songs/README.md`. Tóm tắt ba bước:

1. Tạo tệp `src/songs/07-ten-bai.ts` theo mẫu.
2. Khai báo `audioSrc: "audio/ten-tep.mp3"` — luôn viết dạng tương đối,
   hàm `resolveAudio()` tự đổi sang địa chỉ đầy đủ khi build bản trực tuyến.
3. Thêm tệp vào danh sách trong `src/lib/catalog.ts`.

Thời lượng (`durationMs`) phải khớp với tệp mp3, nếu lệch thì lời chạy sai nhịp.

---

## 5. Cấu trúc

```
src/
  lib/
    artist.ts        thông tin nghệ sĩ, album, dòng bản quyền
    catalog.ts       gom các bài, tính mốc thời gian cho từng dòng lời
    audio-source.ts  công tắc offline / trực tuyến
    player-store.ts  trạng thái trình phát (Zustand)
  songs/             mỗi bài một tệp: lời + mốc thời gian
  components/        giao diện
public/
  audio/             mp3 (không commit)
  brand/artist.jpg   ảnh chân dung
android/             dự án Capacitor
```

---

## 6. Bản quyền

© 2026 Đỗ Thùy Hương. Giữ toàn bộ quyền — xem `LICENSE`.

Phần mềm, phần lời, bản ghi âm và tên album/nghệ sĩ đều thuộc sở hữu độc quyền,
không phát hành theo giấy phép mã nguồn mở.
