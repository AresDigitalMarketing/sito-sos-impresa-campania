// Pagine fisse: l'indirizzo è il nome del file (uguale a quello del vecchio sito)
// e ogni pagina mostra in fondo i documenti della sua sezione.
const sezioni = {
  "chi-siamo": "Associazione",
  convenzioniantiracket: "Convenzione Antiracket",
  "patto-antiracket": "Patto Antiracket",
  legislazione: "Legislazione",
  pubblicazioni: "Pubblicazioni",
  "osservatorio-antiusura": "Osservatorio Antiusura",
  "relazioni-annuali-comitato-solidarieta": "Relazioni Comitato Solidarietà",
};

export default {
  layout: "layouts/pagina.njk",
  permalink: "/{{ page.fileSlug }}/",
  eleventyComputed: {
    documenti_categoria: (data) => sezioni[data.page.fileSlug],
  },
};
