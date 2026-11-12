/**
 * Nội dung chữ của trang giới thiệu, ba thứ tiếng: Việt · Anh · Pháp.
 * Sửa câu chữ ở đây; bố cục nằm trong index.html, kiểu dáng trong style.css.
 */

export type Lang = "vi" | "en" | "fr";
export const LANGS: Lang[] = ["vi", "en", "fr"];

type Dict = Record<string, string>;

export const T: Record<Lang, Dict> = {
  vi: {
    "meta.title": "Chansonia — bài hát, lời ca và phim của Je m'appelle Hương",
    "meta.desc":
      "Chansonia: nghe bài hát của Je m'appelle Hương, BizOnland và M-AIDA với lời chạy theo nhạc, xem MV, cài như một app. Phần mềm có DOI trên Zenodo.",
    "nav.collections": "Bộ sưu tập",
    "nav.features": "Tính năng",
    "nav.videos": "MV",
    "nav.artist": "Nghệ sĩ",
    "nav.cite": "Trích dẫn",
    "nav.open": "Mở app",
    "hero.kicker": "Từ đồng bằng sông Cửu Long",
    "hero.title": "Những bài hát kể chuyện — nghe, đọc lời, và xem phim trong một app.",
    "hero.lead":
      "Chansonia gom các sáng tác của Je m'appelle Hương — album «La lampe, le fleuve et les couleurs», nhạc của các game BizOnland và nhạc nền M-AIDA — với lời chạy theo từng chữ, hai phiên bản Việt · Anh và MV đầy đủ.",
    "hero.listen": "Nghe ngay",
    "hero.watch": "Xem MV",
    "stat.songs": "bài hát",
    "stat.videos": "MV",
    "stat.collections": "bộ sưu tập",
    "stat.langs": "ngôn ngữ",
    "col.kicker": "Bốn bộ sưu tập",
    "col.title": "Một thư viện, bốn câu chuyện",
    "col.lead":
      "Mỗi bộ sưu tập có danh sách Bài hát và MV riêng. Bấm vào để mở thẳng trong app.",
    "col.huong.desc":
      "Album «La lampe, le fleuve et les couleurs» — mini song-cycle về sự vắng mặt, sự trưởng thành và giấc mơ đổi cây cọ — cùng hai đĩa đơn.",
    "col.bizon.desc":
      "Bài hát của các game mô phỏng kinh doanh: Bến Phù Sa, Bật Nghiệp, Hộ Chiếu Thương Hiệu, Hộ Chiếu Sầu Riêng.",
    "col.maida.desc": "Nhạc nền của M-AIDA 8.0, phần mềm nghiên cứu dữ liệu.",
    "col.vandon.desc": "Nhạc của game «Vân Đồn Đệ Nhất Thương Cảng»: bản hùng ca «Vân Đồn – Tiếng vọng non sông», có lời chạy theo nhạc.",
    "col.songs": "bài",
    "col.videos": "MV",
    "col.open": "Mở bộ sưu tập →",
    "feat.kicker": "Tính năng",
    "feat.title": "Nghe kỹ hơn, không chỉ bấm phát",
    "feat.karaoke.t": "Lời chạy theo từng chữ",
    "feat.karaoke.d":
      "Dòng đang hát phóng to giữa màn hình, chữ đã hát đổi màu. Chạm vào một dòng để nghe lại đúng chỗ đó.",
    "feat.versions.t": "Hai phiên bản mỗi bài",
    "feat.versions.d":
      "Chọn giữa bản tiếng Việt và tiếng Anh, hoặc bản gốc và bản phối — ngay trong màn hình nghe.",
    "feat.sleep.t": "Hẹn giờ tắt nhạc",
    "feat.sleep.d": "5, 15, 30, 45 hay 60 phút — nhạc tự dừng khi bạn đã ngủ.",
    "feat.offline.t": "Cài như một app",
    "feat.offline.d":
      "Thêm vào màn hình chính, mở được cả khi mất mạng. Có bản Android, nền sáng và nền tối.",
    "vid.kicker": "MV",
    "vid.title": "Xem phim",
    "vid.lead": "Các MV đầy đủ trên YouTube — phát thẳng từ app hoặc mở tại đây.",
    "art.kicker": "Nghệ sĩ",
    "art.role": "Giảng viên & Nhà nghiên cứu · Người viết bài hát",
    "art.p1":
      "Je m'appelle Hương là nghệ danh của Đỗ Thùy Hương — giảng viên, nhà nghiên cứu và người viết bài hát từ đồng bằng sông Cửu Long. Hương viết bằng tiếng Việt, tiếng Anh và tiếng Pháp, về gia đình, ký ức và những dòng sông.",
    "art.p2":
      "«La lampe, le fleuve et les couleurs» là mini song-cycle sáu chương về sự vắng mặt, sự trưởng thành và những giấc mơ thay hình đổi dạng — viết trong bảy ngày, từ 07 đến 13/8/2026, quanh ngọn đèn còn cháy, dòng sông chở đêm đi và hộp màu của một cô bé từng muốn làm họa sĩ.",
    "art.p3":
      "Chansonia gom các bài hát ấy cùng nhạc BizOnland, phim M-AIDA và bài hát của game «Vân Đồn Đệ Nhất Thương Cảng» về một nơi: nghe với lời chạy theo nhạc, xem MV, và trích dẫn được bằng mã DOI. Hai mươi sáu năm sau, cô bé ấy vẽ tiếp giấc mơ của mình — lần này bằng những dòng code.",
    "cite.kicker": "Trích dẫn",
    "cite.title": "Dùng Chansonia trong nghiên cứu hay bài giảng?",
    "cite.lead":
      "Chansonia được lưu trữ trên Zenodo với mã DOI cố định. Hãy trích dẫn theo mẫu dưới đây.",
    "cite.copy": "Chép",
    "cite.copied": "Đã chép",
    "foot.rights": "© 2026 Đỗ Thùy Hương. Mọi quyền được bảo lưu.",
    "foot.license": "Phần mềm và tác phẩm độc quyền — không phát hành mã nguồn mở.",
  },

  en: {
    "meta.title": "Chansonia — songs, lyrics and films by Je m'appelle Hương",
    "meta.desc":
      "Chansonia: listen to Je m'appelle Hương, BizOnland and M-AIDA songs with word-by-word lyrics, watch the music videos, install it as an app. Software archived on Zenodo with a DOI.",
    "nav.collections": "Collections",
    "nav.features": "Features",
    "nav.videos": "Videos",
    "nav.artist": "Artist",
    "nav.cite": "Cite",
    "nav.open": "Open the app",
    "hero.kicker": "From the Mekong Delta",
    "hero.title": "Songs that tell stories — listen, read along, and watch, in one app.",
    "hero.lead":
      "Chansonia brings together the work of Je m'appelle Hương — the album «La lampe, le fleuve et les couleurs», the soundtracks of the BizOnland games and the M-AIDA score — with word-by-word lyrics, Vietnamese and English versions, and full music videos.",
    "hero.listen": "Listen now",
    "hero.watch": "Watch the videos",
    "stat.songs": "songs",
    "stat.videos": "music videos",
    "stat.collections": "collections",
    "stat.langs": "languages",
    "col.kicker": "Four collections",
    "col.title": "One library, four stories",
    "col.lead": "Each collection has its own songs and music videos. Open one straight in the app.",
    "col.huong.desc":
      "The album «La lampe, le fleuve et les couleurs» — a mini song-cycle about absence, growing up and dreams that change their brush — plus two singles.",
    "col.bizon.desc":
      "Songs from the business-simulation games: Bến Phù Sa, Bật Nghiệp, Brand Passport and Durian Passport.",
    "col.maida.desc": "The score of M-AIDA 8.0, a research data platform.",
    "col.vandon.desc": "Music from the game «Van Don – Vietnam’s First Trading Port»: the anthem «Vân Đồn – Tiếng vọng non sông», with synced lyrics.",
    "col.songs": "songs",
    "col.songs.one": "song",
    "col.videos": "videos",
    "col.videos.one": "video",
    "col.open": "Open collection →",
    "feat.kicker": "Features",
    "feat.title": "Made for listening closely",
    "feat.karaoke.t": "Lyrics, word by word",
    "feat.karaoke.d":
      "The line being sung grows in the middle of the screen and fills with colour as each word is sung. Tap any line to jump there.",
    "feat.versions.t": "Two versions of every song",
    "feat.versions.d":
      "Switch between the Vietnamese and English recordings, or the original and a remix, right from the player.",
    "feat.sleep.t": "Sleep timer",
    "feat.sleep.d": "5, 15, 30, 45 or 60 minutes — the music stops once you have drifted off.",
    "feat.offline.t": "Install it like an app",
    "feat.offline.d":
      "Add it to your home screen and open it even offline. On Android too, in light and dark.",
    "vid.kicker": "Videos",
    "vid.title": "Watch",
    "vid.lead": "Full music videos on YouTube — play them in the app or open them here.",
    "art.kicker": "Artist",
    "art.role": "Lecturer & Researcher · Songwriter",
    "art.p1":
      "Je m'appelle Hương is the stage name of Đỗ Thùy Hương — lecturer, researcher and songwriter from the Mekong Delta. She writes in Vietnamese, English and French, about family, memory and rivers.",
    "art.p2":
      "«La lampe, le fleuve et les couleurs» is a six-chapter mini song-cycle about absence, growing up and dreams that change their shape — written in seven days, 7–13 August 2026, around a lamp still burning, a river carrying the night away and the colour box of a girl who once wanted to be a painter.",
    "art.p3":
      "Chansonia brings those songs together with BizOnland's music, the M-AIDA films and the song of the game «Van Don – Vietnam’s First Trading Port»: listen with lyrics that follow the music, watch the videos, and cite it all through a DOI. Twenty-six years later, that girl paints the same dream — this time in lines of code.",
    "cite.kicker": "Cite",
    "cite.title": "Using Chansonia in research or teaching?",
    "cite.lead": "Chansonia is archived on Zenodo with a permanent DOI. Please cite it as below.",
    "cite.copy": "Copy",
    "cite.copied": "Copied",
    "foot.rights": "© 2026 Đỗ Thùy Hương. All rights reserved.",
    "foot.license": "Proprietary software and works — not released as open source.",
  },

  fr: {
    "meta.title": "Chansonia — chansons, paroles et films de Je m'appelle Hương",
    "meta.desc":
      "Chansonia : écoutez les chansons de Je m'appelle Hương, BizOnland et M-AIDA avec les paroles mot à mot, regardez les clips, installez-la comme une app. Logiciel archivé sur Zenodo avec un DOI.",
    "nav.collections": "Collections",
    "nav.features": "Fonctions",
    "nav.videos": "Clips",
    "nav.artist": "Artiste",
    "nav.cite": "Citer",
    "nav.open": "Ouvrir l'app",
    "hero.kicker": "Depuis le delta du Mékong",
    "hero.title": "Des chansons qui racontent — écouter, lire, regarder, dans une seule app.",
    "hero.lead":
      "Chansonia réunit l'œuvre de Je m'appelle Hương — l'album «La lampe, le fleuve et les couleurs», les bandes-son des jeux BizOnland et la musique de M-AIDA — avec les paroles mot à mot, des versions vietnamienne et anglaise, et les clips complets.",
    "hero.listen": "Écouter",
    "hero.watch": "Voir les clips",
    "stat.songs": "chansons",
    "stat.videos": "clips",
    "stat.collections": "collections",
    "stat.langs": "langues",
    "col.kicker": "Quatre collections",
    "col.title": "Une bibliothèque, quatre histoires",
    "col.lead": "Chaque collection a ses chansons et ses clips. Ouvrez-la directement dans l'app.",
    "col.huong.desc":
      "L'album «La lampe, le fleuve et les couleurs» — un mini cycle de chansons sur l'absence, le fait de grandir et les rêves qui changent de pinceau — et deux singles.",
    "col.bizon.desc":
      "Les chansons des jeux de simulation d'entreprise : Bến Phù Sa, Bật Nghiệp, Passeport de Marque, Passeport Durian.",
    "col.maida.desc": "La musique de M-AIDA 8.0, une plateforme de données de recherche.",
    "col.vandon.desc": "La musique du jeu «Vân Đồn – premier port de commerce du Viêt Nam» : l'hymne «Vân Đồn – Tiếng vọng non sông», avec paroles synchronisées.",
    "col.songs": "chansons",
    "col.songs.one": "chanson",
    "col.videos": "clips",
    "col.videos.one": "clip",
    "col.open": "Ouvrir la collection →",
    "feat.kicker": "Fonctions",
    "feat.title": "Pensée pour écouter vraiment",
    "feat.karaoke.t": "Les paroles, mot à mot",
    "feat.karaoke.d":
      "La ligne chantée grandit au centre de l'écran et se colore mot après mot. Touchez une ligne pour y revenir.",
    "feat.versions.t": "Deux versions de chaque chanson",
    "feat.versions.d":
      "Passez de l'enregistrement vietnamien à l'anglais, ou de l'original au remix, depuis le lecteur.",
    "feat.sleep.t": "Minuterie de sommeil",
    "feat.sleep.d": "5, 15, 30, 45 ou 60 minutes — la musique s'arrête quand vous dormez.",
    "feat.offline.t": "S'installe comme une app",
    "feat.offline.d":
      "Ajoutez-la à l'écran d'accueil, ouvrez-la même hors ligne. Aussi sur Android, en clair et en sombre.",
    "vid.kicker": "Clips",
    "vid.title": "Regarder",
    "vid.lead": "Les clips complets sur YouTube — à lancer dans l'app ou ici.",
    "art.kicker": "Artiste",
    "art.role": "Enseignante-chercheuse · Autrice-compositrice",
    "art.p1":
      "Je m'appelle Hương est le nom de scène de Đỗ Thùy Hương — enseignante-chercheuse et autrice-compositrice du delta du Mékong. Elle écrit en vietnamien, en anglais et en français, sur la famille, la mémoire et les fleuves.",
    "art.p2":
      "«La lampe, le fleuve et les couleurs» est un mini cycle de chansons en six chapitres sur l'absence, le fait de grandir et les rêves qui changent de forme — écrit en sept jours, du 7 au 13 août 2026, autour d'une lampe qui brûle encore, d'un fleuve qui emporte la nuit et de la boîte de couleurs d'une fillette qui voulait devenir peintre.",
    "art.p3":
      "Chansonia réunit ces chansons, la musique de BizOnland, les films M-AIDA et la chanson du jeu «Vân Đồn – premier port de commerce du Viêt Nam» : écouter avec des paroles qui suivent la musique, regarder les clips, et tout citer grâce à un DOI. Vingt-six ans plus tard, la fillette peint le même rêve — cette fois en lignes de code.",
    "cite.kicker": "Citer",
    "cite.title": "Vous utilisez Chansonia en recherche ou en cours ?",
    "cite.lead": "Chansonia est archivée sur Zenodo avec un DOI pérenne. Merci de la citer ainsi.",
    "cite.copy": "Copier",
    "cite.copied": "Copié",
    "foot.rights": "© 2026 Đỗ Thùy Hương. Tous droits réservés.",
    "foot.license": "Logiciel et œuvres propriétaires — non publiés en open source.",
  },
};
