# Chansonia — Chuẩn bị phát hành App Store

Repository này đã được thêm **Capacitor iOS** tại thư mục `ios/`, đồng bộ web assets từ `dist/`, cập nhật cấu hình iOS và sinh bộ icon/splash iOS từ `assets/`.

## Trạng thái đã hoàn thành

- Đã thêm dependency `@capacitor/ios` cùng phiên bản Capacitor hiện tại.
- Đã tạo native project `ios/App/App.xcodeproj` và workspace tương ứng.
- Đã chạy `npm run build` và `npx cap sync ios`.
- Đã tạo icon App Store và splash screen iOS từ bộ tài sản thương hiệu hiện có.
- Đã đặt `ios.contentInset` ở chế độ `automatic` để nội dung tôn trọng vùng an toàn trên iPhone.
- App ID hiện tại: `com.jemappellehuong.songbook`.

## Các bước hoàn tất trên máy Mac

1. Cài Xcode mới nhất tương thích với phiên bản iOS mục tiêu, đăng nhập Apple ID có quyền sử dụng Apple Developer Program, sau đó cài CocoaPods nếu Xcode yêu cầu.
2. Chạy `npm install`, `npm run build` và `npx cap sync ios` trong thư mục dự án.
3. Mở `ios/App/App.xcworkspace` bằng Xcode, không mở riêng `.xcodeproj` nếu workspace đã tồn tại.
4. Trong target `App` → `Signing & Capabilities`, chọn Team Apple Developer, kiểm tra Bundle Identifier `com.jemappellehuong.songbook`, bật automatic signing và xử lý các cảnh báo provisioning nếu có.
5. Trong target `App` → `General`, kiểm tra tên hiển thị `Je m'appelle Hương`, phiên bản marketing `1.0.0`, build number `1`, icon và launch screen.
6. Tạo một app record mới trong [App Store Connect](https://appstoreconnect.apple.com/), dùng Bundle ID tương ứng, điền mô tả, từ khóa, URL hỗ trợ, URL chính sách riêng tư, phân loại nội dung, thông tin bản quyền và ảnh chụp màn hình iPhone.
7. Chọn một simulator hoặc thiết bị thật để kiểm tra: mở app, phát từng bài, đổi bài, cuộn lời, kiểm tra khi bật chế độ im lặng, xoay màn hình và các kích thước iPhone có notch.
8. Chọn `Any iOS Device (arm64)` → `Product` → `Archive`, chạy validation, rồi upload build lên App Store Connect bằng Organizer.
9. Phân phối qua TestFlight trước. Chỉ gửi review khi đã kiểm tra luồng phát nhạc, link website cá nhân, quyền riêng tư và metadata.

## Điều còn cần chủ tài khoản cung cấp

Việc ký và gửi build lên App Store **không thể hoàn tất chỉ trong môi trường Linux hiện tại**, vì cần Xcode, chứng chỉ ký và tài khoản Apple Developer. Cần bổ sung URL chính sách riêng tư và URL hỗ trợ chính thức nếu App Store Connect yêu cầu; hiện liên kết website cá nhân của tác giả đang dùng là `https://thuyhuongctu.github.io/JESUISHUONG_WEBSITE_2026/`.

## Lệnh phát hành nhanh

```bash
npm install
npm run build
npx cap sync ios
npx cap open ios
```

Không commit các tệp chứng chỉ, provisioning profile, private key hoặc mật khẩu signing vào repository. Các cảnh báo bảo mật từ `npm audit` cần được rà soát trên máy phát hành trước khi gửi bản production.
