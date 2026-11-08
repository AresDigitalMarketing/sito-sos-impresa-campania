// Configurazione del generatore del sito (Eleventy).
// I contenuti si modificano dal pannello /admin: questo file non va toccato.

const fmtData = new Intl.DateTimeFormat("it-IT", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Rome",
});

function perData(a, b) {
  return b.date - a.date;
}

export default function (eleventyConfig) {
  // File copiati così come sono
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/uploads": "uploads" });
  // I file del vecchio sito restano agli stessi indirizzi: i link già in giro continuano a funzionare
  eleventyConfig.addPassthroughCopy({ "src/wp-content": "wp-content" });
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });
  eleventyConfig.addPassthroughCopy({ "src/_headers": "_headers" });
  eleventyConfig.addPassthroughCopy({
    "node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2":
      "assets/fonts/archivo.woff2",
  });
  eleventyConfig.ignores.add("src/admin/**");

  // Raccolte di contenuti
  const raccolta = (cartella) => (api) =>
    api.getFilteredByGlob(`src/${cartella}/*.md`).sort(perData);
  eleventyConfig.addCollection("notizie", raccolta("notizie"));
  eleventyConfig.addCollection("comunicati", raccolta("comunicati"));
  eleventyConfig.addCollection("video", raccolta("video"));
  eleventyConfig.addCollection("documenti", raccolta("documenti"));

  eleventyConfig.addGlobalData("anno", () => new Date().getFullYear());
  // Numero di versione: obbliga il browser a scaricare stile e script aggiornati dopo ogni modifica
  const versione = Date.now().toString(36);
  eleventyConfig.addGlobalData("versione", () => versione);

  // Filtri usati nei modelli
  eleventyConfig.addFilter("dataIt", (d) => (d ? fmtData.format(new Date(d)) : ""));
  eleventyConfig.addFilter("dataIso", (d) => (d ? new Date(d).toISOString().slice(0, 10) : ""));
  eleventyConfig.addFilter("primi", (arr, n) => (arr || []).slice(0, n));
  eleventyConfig.addFilter("perCategoria", (arr, cat) =>
    (arr || []).filter((x) => x.data.categoria === cat)
  );
  eleventyConfig.addFilter("youtubeId", (url) => {
    if (!url) return "";
    const m = String(url).match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
    return m ? m[1] : "";
  });
  eleventyConfig.addFilter("isPdf", (f) => /\.pdf($|\?)/i.test(f || ""));
  eleventyConfig.addFilter("estensione", (f) => {
    const m = String(f || "").match(/\.([a-z0-9]+)($|\?)/i);
    return m ? m[1].toUpperCase() : "FILE";
  });

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
