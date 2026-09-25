import type { RawSong } from "@/lib/catalog";

/**
 * Bài bonus của album — người con gái lớn lên thành người đàn bà ở ngoài đời,
 * nhưng trong mắt vẫn giữ một khoảng trời tuổi nhỏ. Người hát đứng ngoài
 * khoảng trời ấy, không bước vào, chỉ ngồi ở bậc thềm mà đợi.
 *
 * MỐC THỜI GIAN: các mốc `startMs` dưới đây được dò từ chính bản thu — tách
 * phần âm thanh nằm giữa (nơi giọng hát ngồi), lọc lấy dải tần giọng người,
 * rồi tìm chỗ ngắt câu và chỗ nhạc đổi. Nếu nghe thấy lời chạy sớm hoặc trễ
 * ở phần nào, chỉ cần sửa `startMs` của đúng phần đó; các dòng bên trong tự
 * giãn theo độ dài chữ.
 */
export const song: RawSong = {
  id: "le-ciel-que-tu-nas-jamais-quitte",
  trackNo: 7,
  title: "Le ciel que tu n'as jamais quitté",
  subtitle: "La fille aux grands yeux couleur d'eau",
  language: "Tiếng Pháp",
  note: "Bài bonus · Người lớn bên ngoài, đứa trẻ bên trong",
  accent: "#4f7fa8",
  coverSrc: "photo/huong-mat-mau-nuoc.webp",
  style:
    "Ballad Pháp · khoảng 126 BPM · đoạn giữa bỏ nhạc, chỉ còn lời nói thì thầm",
  signature: "«Je regarde seulement le ciel que tu n'as jamais quitté.»",
  pictures: [
    {
      src: "photo/huong-da-thanh-nguoi-lon.webp",
      alt: "Hương đứng trước phòng máy, mỉm cười, phía sau là đồng nghiệp và những màn hình biểu đồ",
      caption: "«Dehors, tu es devenue femme» — ở ngoài đời, em đã thành người lớn.",
    },
    {
      src: "photo/huong-dua-tre-mo-mong.webp",
      alt: "Hương mặc áo lông có tai gấu, ngồi trước màn hình lúc khuya, ánh đèn bàn vàng ấm",
      caption: "«Je vois une enfant un peu rêveuse» — khuya rồi, sau lớp áo người lớn vẫn là một đứa trẻ.",
    },
    {
      src: "photo/huong-tieng-cuoi-khong-tuoi.webp",
      alt: "Hương trong áo khoác lông trắng có mũ, đang cười, ánh màn hình nhiều màu hắt lên mặt",
      caption: "«Parfois ton rire revient sans âge» — tiếng cười trở về, không tuổi.",
    },
    {
      src: "photo/huong-ben-khung-cua-so.webp",
      alt: "Hương đứng vẽ trước giá vẽ bên khung cửa sổ đầy nắng, tay cầm cọ",
      caption: "«Je resterai devant ta fenêtre» — đứng bên khung cửa sổ, không bước vào.",
    },
    {
      src: "art/bac-them-nhin-ra-bien.webp",
      alt: "Hình đất sét: bậc thềm trước cửa nhà nhìn ra mặt biển lúc sớm mai",
      caption: "«Il reste une marche devant ta demeure» — bậc thềm trước cửa, chỗ người hát ngồi đợi.",
    },
  ],
  audioSrc: "audio/track07-le-ciel.mp3",
  durationMs: 353560,
  sections: [
    {
      id: "intro",
      label: "Mở đầu",
      startMs: 16800,
      lines: [
        "La fille aux grands yeux couleur d'eau,",
        "Regarde le monde un peu plus haut.",
        "Dehors, tu es devenue femme,",
        "Mais dans tes yeux dort encore une âme",
        "Qui garde un ciel d'enfance, tout bleu.",
      ],
    },
    {
      id: "verse1a",
      label: "Khổ 1",
      startMs: 42500,
      lines: [
        "Tu as traversé des années immenses,",
        "Appris à tenir face aux changements.",
        "Tu ramasses en silence les absences,",
        "Les morceaux tombés avec le temps.",
      ],
    },
    {
      id: "verse1b",
      label: "Khổ 1 · tiếp",
      startMs: 57400,
      lines: [
        "Tu ne racontes jamais les vieux soirs,",
        "Le toit, les arbres, l'ombre sur le chemin.",
        "Mais quand le vent se remet à te voir,",
        "Tes yeux cherchent quelque chose au loin.",
      ],
    },
    {
      id: "prechorus1",
      label: "Dẫn",
      startMs: 74100,
      lines: [
        "Je ne demande pas ce que tu perds,",
        "Je ne prononce pas les mots blessés.",
        "Il y a des silences sur cette terre",
        "Qu'on aime mieux ne pas réveiller.",
      ],
    },
    {
      id: "chorus1",
      label: "Điệp khúc",
      startMs: 92900,
      lines: [
        "Grandis, avance et vis encore,",
        "Garde pour toi ton ciel, ton trésor.",
        "Je n'entrerai pas dans ton enfance,",
        "Je ne fermerai pas cette distance.",
        "Et si la route fatigue ton cœur,",
        "Il reste une marche devant ta demeure.",
        "Je serai là, là où tu me vois,",
        "Mais pas plus près que tu ne le voudras.",
      ],
    },
    {
      id: "verse2a",
      label: "Khổ 2",
      startMs: 120000,
      lines: [
        "La fille aux grands yeux couleur d'eau,",
        "Garde un printemps caché sous sa peau.",
        "Quand les autres comptent les jours, les heures,",
        "Toi, tu crois encore à la lumière.",
      ],
    },
    {
      id: "verse2b",
      label: "Khổ 2 · tiếp",
      startMs: 143000,
      lines: [
        "Parfois ton rire revient sans âge,",
        "Puis le vent te rend silencieuse.",
        "Et derrière ton visage de femme sage,",
        "Je vois une enfant un peu rêveuse.",
      ],
    },
    {
      id: "prechorus2",
      label: "Dẫn 2",
      startMs: 166000,
      lines: [
        "Je ne veux pas prendre la place",
        "D'un ciel absent depuis longtemps.",
        "Je ne veux pas que ma main efface",
        "Ce que tu protèges doucement.",
      ],
    },
    {
      id: "chorus2",
      label: "Điệp khúc 2",
      startMs: 181000,
      lines: [
        "Grandis, avance et vis encore,",
        "Ne change pas pour moi, je t'implore.",
        "Je veux te voir comme tu es,",
        "Femme et enfant, libre à jamais.",
        "Et si tu cherches un peu de silence,",
        "Sans devoir donner d'explication,",
        "Je resterai devant ta fenêtre,",
        "Pour te laisser prendre ta direction.",
      ],
    },
    {
      id: "bridge1",
      label: "Đoạn nói",
      startMs: 209000,
      lines: [
        { text: "Je m'appelle Hương...", role: "whisper" },
        { text: "Je crois que je comprends.", role: "whisper" },
      ],
    },
    {
      id: "bridge2",
      label: "Đoạn nói · 2",
      startMs: 218000,
      lines: [
        { text: "Il y a des lieux", role: "whisper" },
        { text: "que l'on emporte en soi", role: "whisper" },
        { text: "même après avoir quitté l'enfance.", role: "whisper" },
        { text: "Ce n'est pas de la faiblesse.", role: "whisper" },
      ],
    },
    {
      id: "bridge3",
      label: "Đoạn nói · 3",
      startMs: 231000,
      lines: [
        { text: "C'est juste un endroit", role: "whisper" },
        { text: "où certaines choses sont si belles", role: "whisper" },
        { text: "qu'on ne veut pas les perdre", role: "whisper" },
        { text: "en devenant adulte.", role: "whisper" },
        { text: "Je ne veux pas t'en éloigner.", role: "whisper" },
      ],
    },
    {
      id: "bridge4",
      label: "Đoạn nói · 4",
      startMs: 246000,
      lines: [
        { text: "Je voudrais seulement que,", role: "whisper" },
        { text: "le jour où tu ouvriras la porte,", role: "whisper" },
        { text: "je puisse entrer doucement.", role: "whisper" },
        { text: "Sans promesse trop grande.", role: "whisper" },
        { text: "Sans faire de bruit.", role: "whisper" },
        { text: "Avec un peu de paix,", role: "whisper" },
        { text: "pour m'asseoir près de toi", role: "whisper" },
        { text: "et regarder le soir tomber.", role: "whisper" },
      ],
    },
    {
      id: "finalchorus1",
      label: "Điệp khúc cuối",
      startMs: 262000,
      lines: [
        "Grandis, avance et vis encore,",
        "Garde ton petit ciel, ton trésor.",
        "Si le monde fatigue tes épaules,",
        "N'oublie pas l'enfant qui s'envole.",
        "Je ne veux pas que tu deviennes",
        "Quelqu'un que ton cœur ne connaît pas.",
        "Je reste au bord de ton ancienne maison,",
        "Et c'est toi qui choisiras la saison.",
      ],
    },
    {
      id: "finalchorus2",
      label: "Điệp khúc cuối · tiếp",
      startMs: 293000,
      lines: [
        "Grandis, avance et vis encore,",
        "Même si le temps t'appelle dehors.",
        "Si un jour tu te retournes vers moi,",
        "Je serai là, tout doucement, sans voix.",
      ],
    },
    {
      id: "outro1",
      label: "Kết",
      startMs: 307000,
      lines: [
        { text: "La fille aux grands yeux couleur d'eau...", role: "title" },
        { text: "Dehors, tu es devenue femme.", role: "whisper" },
        { text: "Mais quelque part,", role: "whisper" },
        { text: "dans un après-midi ancien,", role: "whisper" },
        { text: "tu es encore toi.", role: "whisper" },
      ],
    },
    {
      id: "outro2",
      label: "Kết · tiếp",
      startMs: 328000,
      lines: [
        { text: "Je m'appelle Hương...", role: "whisper" },
        { text: "Et je suis là.", role: "whisper" },
        { text: "Je n'entre pas.", role: "whisper" },
        { text: "Je regarde seulement", role: "whisper" },
        { text: "le ciel", role: "whisper" },
        { text: "que tu n'as jamais quitté.", role: "title" },
      ],
    },
  ],
};
