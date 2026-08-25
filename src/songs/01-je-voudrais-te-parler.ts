import type { RawSong } from "@/lib/catalog";

export const song: RawSong = {
  id: "je-voudrais-te-parler",
  trackNo: 1,
  title: "Je voudrais te parler",
  subtitle: "Parler à mon père, moi aussi",
  language: "Tiếng Pháp",
  note: "Người trưởng thành lên tiếng · Mong manh",
  accent: "#4b7bec",
  audioSrc: "audio/track01.mp3",
  durationMs: 170952,
  sections: [
    {
      id: "couplet1",
      label: "Khổ 1",
      startMs: 6838,
      lines: [
        "Je voudrais poser mes mains, arrêter d'écrire un peu,",
        "je voudrais dormir sans compter les heures.",
        "Je voudrais qu'on me demande comment je vais,",
        "et pouvoir répondre autre chose que «ça va».",
        "Je voudrais qu'on regarde mon visage",
        "sans y chercher ce qui ne va pas.",
        "Je voudrais qu'on sache que si je suis fatiguée,",
        "c'est parce que j'ai porté, pas parce que j'ai cédé.",
      ],
    },
    {
      id: "refrain",
      label: "Điệp khúc",
      startMs: 104888,
      lines: [
        "Je voudrais te parler, à toi,",
        "te dire ce que personne ne voit.",
        "Je m'appelle Hương — tu m'as donné ce nom,",
        "et je le porte encore, même quand tout est trop lourd.",
        "Je voudrais te parler, une nuit,",
        "juste une nuit, et puis dormir.",
      ],
    },
  ],
};
