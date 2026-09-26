#!/usr/bin/env bash
#
# Đóng gói ứng dụng Android thành tệp .aab để nộp lên CH Play.
#
#   scripts/dong-goi-android.sh            # bản offline (mặc định, nhạc nằm trong app)
#   scripts/dong-goi-android.sh truc-tuyen # bản trực tuyến (nhạc tải từ máy chủ)
#
# Cần JDK 21 và Android SDK (platform 36, build-tools 36.0.0), cùng tệp
# android/local.properties trỏ tới SDK. Xem README.vi.md mục «Đóng gói Android».
#
set -euo pipefail

cd "$(dirname "$0")/.."
GOC=$(pwd)

BAN=${1:-offline}
NGUON_NHAC=${VITE_AUDIO_BASE:-https://thuyhuongctu.github.io/JESUISHUONG_WEBSITE_2026/assets/audio}

case "$BAN" in
  offline|truc-tuyen) ;;
  *) echo "Chỉ nhận 'offline' hoặc 'truc-tuyen', không phải '$BAN'." >&2; exit 2 ;;
esac

# ---------------------------------------------------------------- khoá ký ----
# Không có khoá thì Gradle vẫn chạy nhưng cho ra tệp CHƯA KÝ, mà tệp chưa ký thì
# CH Play từ chối. Nói trước ngay từ đầu để đỡ chờ hết một lượt build mới biết.
if [[ -f android/keystore.properties ]]; then
  echo "Khoá ký: có android/keystore.properties — tệp .aab sẽ được ký."
else
  echo "CẢNH BÁO: không thấy android/keystore.properties."
  echo "          Tệp .aab sẽ CHƯA KÝ, đủ để kiểm tra đóng gói nhưng CH Play"
  echo "          không nhận. Muốn nộp thì build lại trên máy có khoá."
fi

# --------------------------------------------------------------- bản web -----
echo
echo "== Dựng bản web ($BAN) =="
rm -rf dist

if [[ "$BAN" == offline ]]; then
  # Bản offline gói nhạc vào trong app, nên phải chắc rằng đó là bản thu thật —
  # không phải tệp im lặng mà bộ kiểm thử để lại (xem scripts/kiem-tra-nhac.mjs).
  echo "Nhạc: kiểm tra public/audio/ ..."
  if ! node scripts/kiem-tra-nhac.mjs; then
    echo >&2
    echo "Dừng lại: bản offline mà gói nhạc như thế thì ứng dụng không có tiếng." >&2
    echo "Muốn đóng gói bản nhạc tải từ máy chủ thì chạy: $0 truc-tuyen" >&2
    exit 1
  fi
  npm run build
else
  echo "Nhạc: tải từ $NGUON_NHAC"
  VITE_AUDIO_BASE="$NGUON_NHAC" npm run build
  # Vite chép nguyên thư mục public/ sang dist/, nên nếu máy đang giữ bản thu thì
  # bản «trực tuyến» vẫn vô tình gói kèm mấy chục MB nhạc không ai dùng tới. Xoá đi.
  if compgen -G "dist/audio/*.mp3" > /dev/null; then
    echo "Bỏ nhạc khỏi dist/ (bản trực tuyến không cần gói kèm)."
    rm -f dist/audio/*.mp3
  fi
fi

echo "Bản web: $(du -sh dist | cut -f1)"

# ------------------------------------------------------------ gói Android ----
echo
echo "== Chép sang dự án Android =="
npx cap sync android

echo
echo "== Gradle bundleRelease =="
(cd android && ./gradlew bundleRelease)

# ----------------------------------------------------------------- kết quả ---
AAB="$GOC/android/app/build/outputs/bundle/release/app-release.aab"
[[ -f "$AAB" ]] || { echo "Không thấy $AAB." >&2; exit 1; }

# Tệp .aab đã ký có chữ ký trong META-INF; chưa ký thì không có.
if unzip -l "$AAB" 2>/dev/null | grep -qE 'META-INF/.*\.(RSA|DSA|EC)$'; then
  TINH_TRANG="đã ký — nộp lên CH Play được"
else
  TINH_TRANG="CHƯA KÝ — CH Play không nhận"
fi

PHIEN_BAN=$(grep -oE 'versionName "[^"]+"' android/app/build.gradle | cut -d'"' -f2)
MA_PHIEN_BAN=$(grep -oE 'versionCode [0-9]+' android/app/build.gradle | awk '{print $2}')

echo
echo "== Xong =="
echo "Tệp       : $AAB"
echo "Kích thước: $(du -h "$AAB" | cut -f1)"
echo "Phiên bản : $PHIEN_BAN (versionCode $MA_PHIEN_BAN), bản $BAN"
echo "Tình trạng: $TINH_TRANG"
