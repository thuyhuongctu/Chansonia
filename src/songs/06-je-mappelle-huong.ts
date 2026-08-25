import type { RawSong } from "@/lib/catalog";

export const song: RawSong = {
  id: "je-mappelle-huong",
  trackNo: 6,
  title: "Je m'appelle Hương",
  subtitle: "Là où mon enfance respire encore",
  language: "Tiếng Pháp",
  note: "Hợp nhất mọi phiên bản · Trở về, bình yên",
  accent: "#e879b9",
  audioSrc: "audio/je-mappelle-huong.mp3",
  durationMs: 373512,
  sections: [
    {
      id: "couplet1",
      label: "Khổ 1",
      startMs: 14940,
      lines: [
        "J'avais peut-être six ans, un petit monde entre mes mains,",
        "des crayons, quelques couleurs, et tout le ciel au bout du chemin.",
        "Papa marchait près de moi sur les petites routes du village.",
        "Sa main tenait la mienne, et je croyais connaître tous les voyages.",
        "Quand mes pas devenaient trop courts, il me prenait sur ses épaules.",
        "Le monde semblait plus grand, mais je n'avais peur de rien là-haut.",
        "Il m'emmenait dessiner, un concours, une feuille blanche, un soleil.",
        "Et moi, je disais simplement : «Quand je serai grande, je serai peintre.»",
        "C'était un rêve minuscule, grand comme une boîte de couleurs.",
      ],
    },
    {
      id: "prerefrain",
      label: "Chuyển khúc",
      startMs: 207086,
      lines: [
        "Je ne savais pas encore que certaines routes se séparent sans prévenir.",
        "Que certaines mains quittent les nôtres sans avoir choisi de partir.",
      ],
    },
    {
      id: "refrain",
      label: "Điệp khúc",
      startMs: 252508,
      lines: [
        "Je m'appelle Hương. Je porte encore ce nom comme je portais mes couleurs.",
        "Papa, quelque part dans le temps, je marche encore sur notre chemin.",
        "La maison est loin, le fleuve continue,",
        "et quelque chose de cette enfant respire toujours en moi.",
        "Elle est encore là, je le sais.",
        "La petite fille aux crayons de couleur n'est jamais vraiment partie.",
      ],
    },
  ],
};
