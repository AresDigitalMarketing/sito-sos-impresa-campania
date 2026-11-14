// Gli articoli del Premio hanno indirizzi del tipo /premio-cavaliere-prima-edizione/,
// ricavati dal campo «Edizione» (es. «3ª edizione» → terza).
// I vecchi indirizzi del sito WordPress (/anno/mese/giorno/titolo/) sono reindirizzati in src/_redirects.
const ordinali = ["", "prima", "seconda", "terza", "quarta", "quinta", "sesta", "settima", "ottava", "nona", "decima",
  "undicesima", "dodicesima", "tredicesima", "quattordicesima", "quindicesima", "sedicesima", "diciassettesima",
  "diciottesima", "diciannovesima", "ventesima"];

export default {
  eleventyComputed: {
    layout: (data) => (data.solo_anteprima ? false : "layouts/articolo.njk"),
    permalink: (data) => {
      // Edizione annunciata senza articolo: compare solo come anteprima nella pagina del Premio
      if (data.solo_anteprima) return false;
      const n = parseInt(String(data.edizione || ""), 10);
      if (ordinali[n]) return `/premio-cavaliere-${ordinali[n]}-edizione/`;
      return `/premio-cavaliere/${data.page.fileSlug}/`;
    },
  },
};
