# Hướng dẫn đưa ứng dụng lên CH Play

Tài liệu này ghi lại những việc **chỉ chủ tài khoản làm được** — phần kỹ thuật
đã xong, tệp `.aab` đã ký sẵn.

---

## 1. Thông tin ứng dụng đã cố định

| Mục | Giá trị |
|---|---|
| Tên hiển thị | Je m'appelle Hương |
| Package name | `com.jemappellehuong.songbook` |
| Phiên bản | 1.0.0 (versionCode 1) |
| minSdk / targetSdk | 24 / 36 |
| Kích thước `.aab` | ~7,8 MB (bản trực tuyến) |

**Package name không đổi được sau khi đã phát hành.** Nếu muốn tên khác thì phải
đổi ngay bây giờ, trước lần nộp đầu tiên.

---

## 2. Khoá ký

| Mục | Giá trị |
|---|---|
| Tệp | `android/upload-keystore.jks` |
| Alias | `upload` |
| Mật khẩu | ghi trong `android/keystore.properties` |
| Chủ thể | CN=Do Thuy Huong, O=Personal Music Project, L=Can Tho, C=VN |
| SHA-256 | `7B:72:DB:B7:FE:38:8C:8C:7E:3C:EE:55:12:EE:30:B5:E7:2E:3D:07:8B:FE:84:3E:85:E7:D5:8C:E5:F6:50:9E` |

Sao lưu tệp `.jks` ra ít nhất hai nơi (ổ cứng ngoài + Drive riêng). Mất khoá thì
không cập nhật được ứng dụng nữa, phải phát hành lại dưới package name khác.

Khi tạo ứng dụng trên Play Console nên bật **Play App Signing**: Google giữ khoá
phát hành, tệp `.jks` này chỉ còn là khoá tải lên — mất thì xin cấp lại được.

---

## 3. Các bước trên Play Console

1. **Tài khoản nhà phát triển** — 25 USD, trả một lần, xác minh danh tính
   (CMND/CCCD hoặc hộ chiếu). Thường mất 1–3 ngày.
2. **Create app** — chọn: App, Free, ngôn ngữ mặc định Tiếng Việt.
3. **Nộp `.aab`** ở Production hoặc Internal testing.
4. **Store listing** — cần chuẩn bị:
   - Mô tả ngắn (≤ 80 ký tự) và mô tả đầy đủ (≤ 4000 ký tự).
   - Icon 512×512 PNG.
   - Feature graphic 1024×500 PNG.
   - Ít nhất 2 ảnh chụp màn hình điện thoại.
5. **Content rating** — bảng câu hỏi, ứng dụng nghe nhạc thường được xếp
   "Everyone / 3+".
6. **Data safety** — khai báo ứng dụng thu thập dữ liệu gì. Ứng dụng này
   **không thu thập gì**: không tài khoản, không phân tích, không quảng cáo.
   Bản trực tuyến có tải tệp nhạc từ máy chủ — đó là truy cập mạng thông thường,
   không phải thu thập dữ liệu người dùng.
7. **Privacy policy URL** — Play bắt buộc có, kể cả khi không thu thập gì.
   Đăng một trang tĩnh trên GitHub Pages là đủ; nội dung mẫu ở mục 4.
8. **Target audience** — chọn 18+ nếu không muốn vướng các quy định dành cho
   ứng dụng hướng tới trẻ em.

---

## 4. Nội dung mẫu cho trang chính sách quyền riêng tư

> **Chính sách quyền riêng tư — Je m'appelle Hương**
>
> Cập nhật: [ngày].
>
> Ứng dụng «Je m'appelle Hương» không thu thập, không lưu trữ và không chia sẻ
> bất kỳ thông tin cá nhân nào của người dùng. Ứng dụng không yêu cầu đăng ký
> tài khoản, không sử dụng công cụ phân tích và không hiển thị quảng cáo.
>
> Ứng dụng kết nối mạng với mục đích duy nhất là tải tệp âm thanh của album từ
> máy chủ [địa chỉ]. Yêu cầu này không kèm theo thông tin định danh người dùng.
>
> Liên hệ: thuyhuongctu@gmail.com

---

## 5. Chuẩn bị nội dung mô tả

Gợi ý mô tả ngắn (74 ký tự):

> Album «La lampe, le fleuve et les couleurs» — nghe nhạc kèm lời từng dòng.

Gợi ý mở đầu mô tả đầy đủ:

> Sáu bài hát của «La lampe, le fleuve et les couleurs», một mini song-cycle
> viết trong tuần lễ tháng 8/2026. Ứng dụng hiển thị lời hát chạy theo nhạc
> từng dòng, kèm trang giới thiệu về album và người sáng tác.

---

## 6. Việc cần làm trước khi nộp

- [ ] Quyết định dùng bản offline (44 MB) hay bản trực tuyến (8 MB).
- [ ] Nếu chọn bản trực tuyến: kiểm tra 6 tệp mp3 vẫn truy cập được ở
      `VITE_AUDIO_BASE`, và cân nhắc rằng nhạc khi đó ai cũng tải trực tiếp được.
- [ ] Tạo icon 512×512 và feature graphic 1024×500.
- [ ] Đăng trang chính sách quyền riêng tư, lấy URL.
- [ ] Sao lưu `upload-keystore.jks`.
