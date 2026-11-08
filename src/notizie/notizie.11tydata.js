// Le notizie mantengono gli stessi indirizzi del vecchio sito WordPress:
// /anno/mese/giorno/titolo/
export default {
  layout: "layouts/articolo.njk",
  eleventyComputed: {
    permalink: (data) => {
      const d = new Date(data.page.date);
      const p = (n) => String(n).padStart(2, "0");
      return `/${d.getUTCFullYear()}/${p(d.getUTCMonth() + 1)}/${p(d.getUTCDate())}/${data.page.fileSlug}/`;
    },
  },
};
