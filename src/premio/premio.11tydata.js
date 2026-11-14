// Gli articoli del Premio mantengono gli stessi indirizzi del vecchio sito WordPress:
// /anno/mese/giorno/titolo/
export default {
  eleventyComputed: {
    layout: (data) => (data.solo_anteprima ? false : "layouts/articolo.njk"),
    permalink: (data) => {
      // Edizione annunciata senza articolo: compare solo come anteprima nella pagina del Premio
      if (data.solo_anteprima) return false;
      const d = new Date(data.page.date);
      const p = (n) => String(n).padStart(2, "0");
      return `/${d.getUTCFullYear()}/${p(d.getUTCMonth() + 1)}/${p(d.getUTCDate())}/${data.page.fileSlug}/`;
    },
  },
};
