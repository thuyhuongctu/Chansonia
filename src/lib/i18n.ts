import { create } from "zustand";

/**
 * Ngôn ngữ giao diện: tiếng Anh (mặc định) · tiếng Việt · tiếng Pháp.
 *
 * Cách dùng: viết chữ tiếng Việt như cũ rồi bọc trong t(), ví dụ
 * t("Bài hát") hoặc t("Hẹn {n} phút", { n: 30 }). Bảng TABLE bên dưới cho
 * bản tiếng Anh và tiếng Pháp; chữ nào chưa có trong bảng thì giữ nguyên
 * tiếng Việt. Dữ liệu bài hát (dòng phụ, tên phần, phiên bản…) dịch bằng
 * trData(), tách theo dấu " · " rồi dịch từng mảnh.
 */

export type Lang = "en" | "vi" | "fr";
export const LANGS: Lang[] = ["en", "vi", "fr"];
export const LANG_NAMES: Record<Lang, string> = { en: "English", vi: "Tiếng Việt", fr: "Français" };
/** Định dạng ngày giờ theo ngôn ngữ giao diện */
export const LOCALE: Record<Lang, string> = { en: "en-GB", vi: "vi-VN", fr: "fr-FR" };

/**
 * Khoá lưu ngôn ngữ đã chọn, dùng chung với trang giới thiệu. Đổi tên từ
 * "chansonia-lang" khi chuyển mặc định sang tiếng Anh: lựa chọn cũ (lưu từ hồi
 * mặc định là tiếng Việt) không còn giữ người nghe ở tiếng Việt nữa.
 */
export const LANG_KEY = "chansonia-ui-lang";
const KEY = LANG_KEY;

function readLang(): Lang {
  try {
    const v = localStorage.getItem(KEY) as Lang | null;
    if (v && LANGS.includes(v)) return v;
  } catch {
    /* bỏ qua */
  }
  return "en";
}

export const useLang = create<{ lang: Lang; setLang: (l: Lang) => void }>((set) => ({
  lang: readLang(),
  setLang: (lang) => {
    set({ lang });
    try {
      localStorage.setItem(KEY, lang);
    } catch {
      /* bỏ qua */
    }
  },
}));

type Row = { en: string; fr: string };

/* ── Giao diện ───────────────────────────────────────────────────────── */

const UI: Record<string, Row> = {
  // Thanh đầu trang
  "bài hát và phim": { en: "songs and films", fr: "chansons et films" },
  "Nghệ sĩ": { en: "Artist", fr: "Artiste" },
  "Chuyển sang nền sáng": { en: "Switch to light mode", fr: "Passer en mode clair" },
  "Chuyển sang nền tối": { en: "Switch to dark mode", fr: "Passer en mode sombre" },
  "Nền sáng": { en: "Light", fr: "Clair" },
  "Nền tối": { en: "Dark", fr: "Sombre" },
  "Quay lại": { en: "Back", fr: "Retour" },
  "Ngôn ngữ": { en: "Language", fr: "Langue" },
  // Đồng hồ
  "Việt Nam": { en: "Vietnam", fr: "Viêt Nam" },
  "Pháp": { en: "France", fr: "France" },
  "Giờ Việt Nam và Pháp (lệch {n} giờ)": {
    en: "Time in Vietnam and France ({n} hours apart)",
    fr: "Heure au Viêt Nam et en France ({n} h d'écart)",
  },
  "Cờ Việt Nam": { en: "Flag of Vietnam", fr: "Drapeau du Viêt Nam" },
  "Cờ Pháp": { en: "Flag of France", fr: "Drapeau de la France" },
  // Thư viện
  "Bộ sưu tập": { en: "Collections", fr: "Collections" },
  "Tìm tên bài…": { en: "Search titles…", fr: "Chercher un titre…" },
  "Tìm trong bộ sưu tập": { en: "Search the collection", fr: "Chercher dans la collection" },
  "Xoá từ khoá": { en: "Clear search", fr: "Effacer la recherche" },
  "Loại nội dung": { en: "Content type", fr: "Type de contenu" },
  "Bài hát · {n}": { en: "Songs · {n}", fr: "Chansons · {n}" },
  "Video · {n}": { en: "Videos · {n}", fr: "Clips · {n}" },
  "Yêu thích · {n}": { en: "Favourites · {n}", fr: "Favoris · {n}" },
  "Ở bộ sưu tập khác": { en: "In other collections", fr: "Dans les autres collections" },
  "Ở bộ sưu tập khác · {n}": { en: "In other collections · {n}", fr: "Dans les autres collections · {n}" },
  "Không có gì khớp.": { en: "Nothing matches.", fr: "Aucun résultat." },
  "Chưa có video.": { en: "No videos yet.", fr: "Pas encore de clip." },
  "Chưa có bài hát.": { en: "No songs yet.", fr: "Pas encore de chanson." },
  "Chưa có bài yêu thích. Bấm ♥ ở màn hình nghe để thêm.": {
    en: "No favourites yet. Tap ♥ on the player screen to add one.",
    fr: "Pas encore de favori. Touchez ♥ dans le lecteur pour en ajouter.",
  },
  "Xem lại tất cả": { en: "Show everything", fr: "Tout afficher" },
  "Phát ngẫu nhiên": { en: "Shuffle", fr: "Lecture aléatoire" },
  "Ngẫu nhiên": { en: "Shuffle", fr: "Aléatoire" },
  "{s} bài hát · {v} video": { en: "{s} songs · {v} videos", fr: "{s} chansons · {v} clips" },
  "Phát từ đầu": { en: "Play from start", fr: "Tout écouter" },
  "Phát tất cả": { en: "Play all", fr: "Tout lire" },
  "Phát tất cả bài yêu thích": { en: "Play all favourites", fr: "Lire tous les favoris" },
  "2 phiên bản": { en: "2 versions", fr: "2 versions" },
  "Đang phát": { en: "Now playing", fr: "En lecture" },
  "Tạm dừng": { en: "Pause", fr: "Pause" },
  "Đã tạm dừng": { en: "Paused", fr: "En pause" },
  // Màn hình nghe
  "Cách xem lời": { en: "Lyrics view", fr: "Affichage des paroles" },
  "Lời": { en: "Lyrics", fr: "Paroles" },
  "Trang lời": { en: "Sheet", fr: "Feuillet" },
  "Phiên bản": { en: "Versions", fr: "Versions" },
  "Lời của bản «{a}» chưa có trong ứng dụng. Lời chạy theo nhạc có ở bản «{b}».": {
    en: "Lyrics for the «{a}» version aren't in the app yet. Synced lyrics are on the «{b}» version.",
    fr: "Les paroles de la version «{a}» ne sont pas encore dans l'app. Les paroles synchronisées sont sur la version «{b}».",
  },
  "Lời bài này chưa có trong ứng dụng. Vẫn nghe và hẹn giờ tắt nhạc được như thường.": {
    en: "Lyrics for this song aren't in the app yet. Playback and the sleep timer work as usual.",
    fr: "Les paroles de cette chanson ne sont pas encore dans l'app. La lecture et la minuterie fonctionnent normalement.",
  },
  "Phong cách: ": { en: "Style: ", fr: "Style : " },
  "Các phần": { en: "Sections", fr: "Parties" },
  "Tiếp theo": { en: "Up next", fr: "À suivre" },
  "Đã chép đường link của bài": { en: "Link copied", fr: "Lien copié" },
  "Không chia sẻ được": { en: "Couldn't share", fr: "Partage impossible" },
  "Lặp lại một bài": { en: "Repeat one", fr: "Répéter le titre" },
  "Lặp lại cả danh sách": { en: "Repeat all", fr: "Tout répéter" },
  "Không lặp lại": { en: "Repeat off", fr: "Sans répétition" },
  "Thêm vào Yêu thích": { en: "Add to favourites", fr: "Ajouter aux favoris" },
  "Bỏ khỏi Yêu thích": { en: "Remove from favourites", fr: "Retirer des favoris" },
  "Chia sẻ bài này": { en: "Share this song", fr: "Partager cette chanson" },
  // Thanh phát
  "Phát": { en: "Play", fr: "Lecture" },
  "Bài trước": { en: "Previous", fr: "Précédent" },
  "Bài sau": { en: "Next", fr: "Suivant" },
  "Mở lời bài {t}": { en: "Open lyrics for {t}", fr: "Ouvrir les paroles de {t}" },
  "hẹn giờ {t}": { en: "sleep {t}", fr: "veille {t}" },
  "dừng sau bài này": { en: "stops after this song", fr: "arrêt après ce titre" },
  "Không tải được bài này. Kiểm tra mạng rồi bấm phát lại": {
    en: "Couldn't load this song. Check your connection and press play again",
    fr: "Impossible de charger ce titre. Vérifiez la connexion puis relancez",
  },
  "Tiến độ bài hát": { en: "Song progress", fr: "Progression" },
  "{a} trên {b}": { en: "{a} of {b}", fr: "{a} sur {b}" },
  "Bật tiếng (M)": { en: "Unmute (M)", fr: "Réactiver le son (M)" },
  "Tắt tiếng (M)": { en: "Mute (M)", fr: "Couper le son (M)" },
  "Âm lượng": { en: "Volume", fr: "Volume" },
  // Hẹn giờ
  "Hẹn giờ tắt nhạc": { en: "Sleep timer", fr: "Minuterie de sommeil" },
  "Nhạc sẽ tạm dừng sau {t}.": { en: "Playback pauses in {t}.", fr: "La lecture s'arrête dans {t}." },
  "Nhạc sẽ tạm dừng khi hết giờ.": {
    en: "Playback pauses when the time is up.",
    fr: "La lecture s'arrête à la fin du temps.",
  },
  "Số phút": { en: "Minutes", fr: "Minutes" },
  "{n} phút": { en: "{n} minutes", fr: "{n} minutes" },
  "phút": { en: "minutes", fr: "minutes" },
  "Dừng khi hết bài này": { en: "Stop after this song", fr: "Arrêter après ce titre" },
  "Huỷ hẹn giờ": { en: "Cancel timer", fr: "Annuler la minuterie" },
  "Hẹn {n} phút": { en: "Start {n} min timer", fr: "Lancer {n} min" },
  // Video
  "Video": { en: "Videos", fr: "Clips" },
  "Video khác": { en: "More videos", fr: "Autres clips" },
  "Bấm để phát · tải từ YouTube": { en: "Tap to play · loads from YouTube", fr: "Touchez pour lire · depuis YouTube" },
  "Phát video {t} từ YouTube": { en: "Play {t} from YouTube", fr: "Lire {t} depuis YouTube" },
  // Nghệ sĩ
  "Bài hát": { en: "Songs", fr: "Chansons" },
  "Ảnh": { en: "Photos", fr: "Photos" },
  // Hàng chờ, playlist, của tôi
  "Bài đã có trong «{n}»": { en: "Already in «{n}»", fr: "Déjà dans «{n}»" },
  "Bấm lần nữa để xoá": { en: "Tap again to delete", fr: "Touchez encore pour supprimer" },
  "Bỏ khỏi hàng chờ": { en: "Remove from queue", fr: "Retirer de la file" },
  "Bỏ «{s}» khỏi playlist": { en: "Remove «{s}» from playlist", fr: "Retirer «{s}» de la playlist" },
  "Chưa có playlist nào. Đặt tên rồi bấm Tạo.": { en: "No playlists yet. Type a name and tap Create.", fr: "Aucune playlist. Saisissez un nom puis touchez Créer." },
  "Chưa nghe bài nào.": { en: "Nothing played yet.", fr: "Rien écouté pour l'instant." },
  "Của tôi": { en: "Mine", fr: "Ma musique" },
  "Hàng chờ trống. Bấm ⋯ ở một bài để chọn «Phát tiếp theo» hoặc «Thêm vào hàng chờ».": { en: "The queue is empty. Tap ⋯ on a song and choose «Play next» or «Add to queue».", fr: "La file est vide. Touchez ⋯ sur une chanson puis «Lire ensuite» ou «Ajouter à la file»." },
  "Hàng chờ · {n} bài": { en: "Queue · {n} songs", fr: "File d'attente · {n} titres" },
  "Hàng chờ": { en: "Queue", fr: "File d'attente" },
  "Làm mới trang": { en: "Refresh", fr: "Actualiser" },
  "Nghe gần đây": { en: "Recently played", fr: "Écoutés récemment" },
  "Nghe nhiều nhất": { en: "Most played", fr: "Les plus écoutés" },
  "Nghe vài bài là danh sách này tự có.": { en: "Play a few songs and this list fills itself.", fr: "Écoutez quelques titres et cette liste se remplira." },
  "Phát playlist": { en: "Play playlist", fr: "Lire la playlist" },
  "Phát tiếp theo": { en: "Play next", fr: "Lire ensuite" },
  "Playlist còn trống. Bấm ⋯ ở một bài rồi chọn «Thêm vào playlist».": { en: "This playlist is empty. Tap ⋯ on a song and choose «Add to playlist».", fr: "Playlist vide. Touchez ⋯ sur une chanson puis «Ajouter à une playlist»." },
  "Playlist của tôi": { en: "My playlists", fr: "Mes playlists" },
  "Sau đó, từ {c}": { en: "Then, from {c}", fr: "Ensuite, depuis {c}" },
  "Sẽ phát tiếp theo": { en: "Playing next", fr: "Lu ensuite" },
  "Thao tác cho «{t}»": { en: "Options for «{t}»", fr: "Options pour «{t}»" },
  "Thêm thao tác cho «{t}»": { en: "More options for «{t}»", fr: "Plus d'options pour «{t}»" },
  "Thêm vào hàng chờ": { en: "Add to queue", fr: "Ajouter à la file" },
  "Thêm vào playlist": { en: "Add to playlist", fr: "Ajouter à une playlist" },
  "Tiếp theo trong hàng chờ · {n}": { en: "Next in queue · {n}", fr: "Ensuite dans la file · {n}" },
  "Tên playlist mới": { en: "New playlist name", fr: "Nom de la nouvelle playlist" },
  "Tên playlist": { en: "Playlist name", fr: "Nom de la playlist" },
  "Tạo": { en: "Create", fr: "Créer" },
  "Tốc độ phát": { en: "Playback speed", fr: "Vitesse de lecture" },
  "Xoá hàng chờ": { en: "Clear queue", fr: "Vider la file" },
  "Xoá lịch sử": { en: "Clear history", fr: "Effacer l'historique" },
  "Xoá playlist": { en: "Delete playlist", fr: "Supprimer la playlist" },
  "{n} bài": { en: "{n} songs", fr: "{n} titres" },
  "{n} lần": { en: "{n}×", fr: "{n}×" },
  "Đã bỏ khỏi Yêu thích": { en: "Removed from Favourites", fr: "Retiré des favoris" },
  "Đã thêm vào Yêu thích": { en: "Added to Favourites", fr: "Ajouté aux favoris" },
  "Đã thêm vào hàng chờ": { en: "Added to queue", fr: "Ajouté à la file" },
  "Đã thêm vào «{n}»": { en: "Added to «{n}»", fr: "Ajouté à «{n}»" },
  "Đã xoá lịch sử nghe": { en: "Listening history cleared", fr: "Historique effacé" },
  "Đã xoá playlist «{n}»": { en: "Deleted playlist «{n}»", fr: "Playlist «{n}» supprimée" },
  "Đóng": { en: "Close", fr: "Fermer" },
  "Đưa lên": { en: "Move up", fr: "Monter" },
  "Đưa xuống": { en: "Move down", fr: "Descendre" },
  "Đổi tên playlist": { en: "Rename playlist", fr: "Renommer la playlist" },
  "Xem ảnh {n}": { en: "View photo {n}", fr: "Voir la photo {n}" },
  "Ảnh trước": { en: "Previous photo", fr: "Photo précédente" },
  "Ảnh sau": { en: "Next photo", fr: "Photo suivante" },
  "Đóng ảnh": { en: "Close photo", fr: "Fermer la photo" },
  "Mọi quyền được bảo lưu.": { en: "All rights reserved.", fr: "Tous droits réservés." },
  "Phần mềm và tác phẩm độc quyền, không phát hành mã nguồn mở.": {
    en: "Proprietary software and works, not released as open source.",
    fr: "Logiciel et œuvres propriétaires, non publiés en open source.",
  },
  "Je m'appelle Hương là nghệ danh của Đỗ Thùy Hương, giảng viên, nhà nghiên cứu và người viết bài hát từ đồng bằng sông Cửu Long. Hương viết bằng tiếng Việt, tiếng Anh và tiếng Pháp, về gia đình, ký ức và những dòng sông.": {
    en: "Je m'appelle Hương is the stage name of Đỗ Thùy Hương, lecturer, researcher and songwriter from the Mekong Delta. She writes in Vietnamese, English and French, about family, memory and rivers.",
    fr: "Je m'appelle Hương est le nom de scène de Đỗ Thùy Hương, enseignante-chercheuse et autrice-compositrice du delta du Mékong. Elle écrit en vietnamien, en anglais et en français, sur la famille, la mémoire et les fleuves.",
  },
  "«La lampe, le fleuve et les couleurs» là mini song-cycle sáu chương về sự vắng mặt, sự trưởng thành và những giấc mơ thay hình đổi dạng, viết trong bảy ngày, từ 07 đến 13/8/2026, quanh ngọn đèn còn cháy, dòng sông chở đêm đi và hộp màu của một cô bé từng muốn làm họa sĩ.": {
    en: "«La lampe, le fleuve et les couleurs» is a six-chapter mini song-cycle about absence, growing up and dreams that change their shape, written in seven days, 7–13 August 2026, around a lamp still burning, a river carrying the night away and the colour box of a girl who once wanted to be a painter.",
    fr: "«La lampe, le fleuve et les couleurs» est un mini cycle de chansons en six chapitres sur l'absence, le fait de grandir et les rêves qui changent de forme, écrit en sept jours, du 7 au 13 août 2026, autour d'une lampe qui brûle encore, d'un fleuve qui emporte la nuit et de la boîte de couleurs d'une fillette qui voulait devenir peintre.",
  },
  "Chansonia gom các bài hát ấy cùng nhạc BizOnland, phim M-AIDA và nhạc của hai game «Vân Đồn Đệ Nhất Thương Cảng», «Bắc Hải Đảo» về một nơi: nghe với lời chạy theo nhạc, xem MV, và trích dẫn được bằng mã DOI. Hai mươi sáu năm sau, cô bé ấy vẽ tiếp giấc mơ của mình, lần này bằng những dòng code.": {
    en: "Chansonia brings those songs together with BizOnland's music, the M-AIDA films and the music of two games, «Van Don – Vietnam’s First Trading Port» and «Bac Hai Dao – Pirates of the Gulf of Tonkin»: listen with lyrics that follow the music, watch the videos, and cite it all through a DOI. Twenty-six years later, that girl paints the same dream, this time in lines of code.",
    fr: "Chansonia réunit ces chansons, la musique de BizOnland, les films M-AIDA et la musique de deux jeux, «Vân Đồn – premier port de commerce du Viêt Nam» et «Bắc Hải Đảo – Pirates du golfe du Tonkin» : écouter avec des paroles qui suivent la musique, regarder les clips, et tout citer grâce à un DOI. Vingt-six ans plus tard, la fillette peint le même rêve, cette fois en lignes de code.",
  },
};

/* ── Dữ liệu bài hát: dịch từng mảnh ngăn bởi " · " ─────────────────── */

const DATA: Record<string, Row> = {
  // Bộ sưu tập
  "Album «La lampe, le fleuve et les couleurs» và một đĩa đơn": {
    en: "The album «La lampe, le fleuve et les couleurs» and a single",
    fr: "L'album «La lampe, le fleuve et les couleurs» et un single",
  },
  "Bài hát của các game mô phỏng kinh doanh": {
    en: "Songs from the business-simulation games",
    fr: "Chansons des jeux de simulation d'entreprise",
  },
  "Nhạc nền của M-AIDA 8.0": { en: "The score of M-AIDA 8.0", fr: "La musique de M-AIDA 8.0" },
  "Nhạc của game Vân Đồn Đệ Nhất Thương Cảng": {
    en: "Music from the game Van Don – Vietnam’s First Trading Port",
    fr: "Musique du jeu Vân Đồn – premier port de commerce du Viêt Nam",
  },
  "Bài hát của game": { en: "Game song", fr: "Chanson du jeu" },
  // Ngôn ngữ
  "Tiếng Việt": { en: "Vietnamese", fr: "Vietnamien" },
  "Tiếng Anh": { en: "English", fr: "Anglais" },
  "Tiếng Pháp": { en: "French", fr: "Français" },
  "tiếng Anh": { en: "English", fr: "anglais" },
  Việt: { en: "Vietnamese", fr: "vietnamien" },
  Anh: { en: "English", fr: "anglais" },
  Pháp: { en: "French", fr: "français" },
  // Dòng phụ
  "Bài chủ đề": { en: "Title track", fr: "Titre phare" },
  "Bài tặng thêm": { en: "Bonus", fr: "Bonus" },
  "viết thêm sau album": { en: "written after the album", fr: "écrite après l'album" },
  "Đĩa đơn": { en: "Single", fr: "Single" },
  "Bài hát chính": { en: "Main song", fr: "Chanson principale" },
  "Bài hát chính đầu tiên": { en: "The first main song", fr: "La première chanson principale" },
  "Bản thu có lời": { en: "Vocal recording", fr: "Version chantée" },
  "Nhạc chủ đề game": { en: "Game theme", fr: "Thème du jeu" },
  "Song ca tiếng Việt": { en: "Vietnamese duet", fr: "Duo en vietnamien" },
  "Nhạc chủ đề Hộ Chiếu Thương Hiệu": { en: "Brand Passport theme", fr: "Thème de Passeport de Marque" },
  "Anthem đội chơi": { en: "Team anthem", fr: "Hymne d'équipe" },
  Anthem: { en: "Anthem", fr: "Hymne" },
  "Nhạc nền Bến Phù Sa": { en: "Bến Phù Sa soundtrack", fr: "Bande-son de Bến Phù Sa" },
  "Tổ khúc Hộ Chiếu Thương Hiệu": { en: "Brand Passport suite", fr: "Suite Passeport de Marque" },
  "Phần III": { en: "Part III", fr: "Partie III" },
  "Nhạc nền Hộ Chiếu Sầu Riêng": { en: "Durian Passport soundtrack", fr: "Bande-son de Passeport Durian" },
  "Hộ Chiếu Thương Hiệu": { en: "Brand Passport", fr: "Passeport de Marque" },
  "Không lời": { en: "Instrumental", fr: "Instrumental" },
  // Video
  "MV hoạt hình 3D": { en: "3D animated music video", fr: "Clip en animation 3D" },
  "MV thế giới thu nhỏ 3D": { en: "3D miniature-world music video", fr: "Clip en monde miniature 3D" },
  "Bến Phù Sa (tranh vẽ)": { en: "Bến Phù Sa (hand-drawn)", fr: "Bến Phù Sa (dessiné à la main)" },
  "Bến Phù Sa (hoạt hình 3D)": { en: "Bến Phù Sa (3D animation)", fr: "Bến Phù Sa (animation 3D)" },
  MV: { en: "Music video", fr: "Clip" },
  // Phiên bản
  "Bản gốc": { en: "Original", fr: "Originale" },
  "Bản phối OR": { en: "OR mix", fr: "Mix OR" },
  "Bản v2": { en: "Take 2", fr: "Version 2" },
  "Bản 2026": { en: "2026 version", fr: "Version 2026" },
  "Bản thu 2024": { en: "2024 recording", fr: "Enregistrement 2024" },
  "Bản dài": { en: "Long version", fr: "Version longue" },
  "Bản ngắn": { en: "Short version", fr: "Version courte" },
  "Bản chính": { en: "Main version", fr: "Version principale" },
  "Bản đầy đủ": { en: "Full version", fr: "Version complète" },
  // Phần của bài
  "Điệp khúc": { en: "Chorus", fr: "Refrain" },
  "Điệp khúc cuối": { en: "Final chorus", fr: "Dernier refrain" },
  "Tiền điệp khúc": { en: "Pre-chorus", fr: "Pré-refrain" },
  "Nhạc dạo giữa": { en: "Interlude", fr: "Interlude" },
  "Nhạc của game Bắc Hải Đảo, Hải Tặc Vịnh Bắc Bộ": {
    en: "Music from the game Bac Hai Dao – Pirates of the Gulf of Tonkin",
    fr: "La musique du jeu Bắc Hải Đảo – Pirates du golfe du Tonkin",
  },
  "Lyric video": { en: "Lyric video", fr: "Clip de paroles" },
  "Câu cuối": { en: "Final line", fr: "Dernière phrase" },
  "Nhạc kết": { en: "Instrumental outro", fr: "Final instrumental" },
  "Chuyển khúc": { en: "Bridge", fr: "Pont" },
  "Cầu nối": { en: "Bridge", fr: "Pont" },
  "Đoạn nói": { en: "Spoken", fr: "Parlé" },
  "Mở đầu": { en: "Opening", fr: "Ouverture" },
  "Dạo đầu": { en: "Intro", fr: "Intro" },
  Kết: { en: "Outro", fr: "Final" },
  tiếp: { en: "cont.", fr: "suite" },
  Lời: { en: "Lyrics", fr: "Paroles" },
  "Cao trào": { en: "Climax", fr: "Apogée" },
};

/** Mẫu có số: "Khổ 2" → "Verse 2", "Điệp khúc 2" → "Chorus 2", "Dẫn 2" → "Lead-in 2" */
const PATTERNS: [RegExp, Row][] = [
  [/^Khổ (\d+)$/, { en: "Verse $1", fr: "Couplet $1" }],
  [/^Điệp khúc (\d+)$/, { en: "Chorus $1", fr: "Refrain $1" }],
  [/^Dẫn(?: (\d+))?$/, { en: "Lead-in $1", fr: "Amorce $1" }],
];

function fill(s: string, vars?: Record<string, string | number>): string {
  if (!vars) return s;
  return s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

/** Dịch một chữ giao diện (viết bằng tiếng Việt) sang ngôn ngữ đang chọn */
export function translate(lang: Lang, vi: string, vars?: Record<string, string | number>): string {
  const row = UI[vi];
  const text = lang === "vi" || !row ? vi : row[lang];
  return fill(text, vars);
}

function piece(lang: "en" | "fr", s: string): string {
  const row = DATA[s] ?? UI[s];
  if (row) return row[lang];
  for (const [re, r] of PATTERNS) {
    if (re.test(s)) return s.replace(re, r[lang]).trim();
  }
  return s;
}

/** Dịch chữ trong dữ liệu (dòng phụ, tên phần, phiên bản…), từng mảnh một */
export function translateData(lang: Lang, vi: string): string {
  if (lang === "vi" || !vi) return vi;
  const whole = DATA[vi];
  if (whole) return whole[lang];
  return vi
    .split(" · ")
    .map((p) => piece(lang, p))
    .join(" · ");
}

/** Hook: t() cho chữ giao diện, td() cho chữ trong dữ liệu, kèm ngôn ngữ đang chọn */
export function useT() {
  const lang = useLang((s) => s.lang);
  return {
    lang,
    t: (vi: string, vars?: Record<string, string | number>) => translate(lang, vi, vars),
    td: (vi: string) => translateData(lang, vi),
  };
}
