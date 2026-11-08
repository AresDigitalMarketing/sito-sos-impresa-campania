// Piccoli comportamenti del sito: galleria a tutto schermo, video, pulsanti di condivisione.
(function () {
  // Condivisione: usa l'indirizzo reale della pagina
  var url = encodeURIComponent(location.href);
  var titolo = encodeURIComponent(document.title);
  document.querySelectorAll("[data-condividi]").forEach(function (a) {
    var tipo = a.getAttribute("data-condividi");
    if (tipo === "facebook") a.href = "https://www.facebook.com/sharer/sharer.php?u=" + url;
    if (tipo === "whatsapp") a.href = "https://wa.me/?text=" + titolo + "%20" + url;
    if (tipo === "email") a.href = "mailto:?subject=" + titolo + "&body=" + url;
  });

  // Video YouTube: si caricano solo al clic (più veloce e rispettoso della privacy)
  document.querySelectorAll("[data-youtube]").forEach(function (b) {
    b.addEventListener("click", function () {
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + b.getAttribute("data-youtube") + "?autoplay=1";
      f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      f.title = b.getAttribute("aria-label") || "Video";
      b.replaceWith(f);
    });
  });

  // Galleria fotografica a tutto schermo
  var gallerie = document.querySelectorAll("[data-galleria]");
  if (!gallerie.length || typeof HTMLDialogElement === "undefined") return;
  var d = document.createElement("dialog");
  d.className = "lightbox";
  d.setAttribute("aria-label", "Foto a tutto schermo");
  d.innerHTML =
    '<div class="lightbox-dentro"><img alt=""><div class="lightbox-comandi">' +
    '<button type="button" data-az="prec">← Precedente</button>' +
    '<span data-conta></span>' +
    '<button type="button" data-az="succ">Successiva →</button>' +
    '<button type="button" class="chiudi" data-az="chiudi">Chiudi</button></div></div>';
  document.body.appendChild(d);
  var img = d.querySelector("img"), conta = d.querySelector("[data-conta]");
  var elenco = [], i = 0;
  function mostra(n) {
    i = (n + elenco.length) % elenco.length;
    img.src = elenco[i].getAttribute("data-src");
    img.alt = elenco[i].querySelector("img") ? elenco[i].querySelector("img").alt : "";
    conta.textContent = (i + 1) + " / " + elenco.length;
  }
  gallerie.forEach(function (g) {
    var bottoni = Array.prototype.slice.call(g.querySelectorAll("[data-src]"));
    bottoni.forEach(function (b, n) {
      b.addEventListener("click", function () { elenco = bottoni; mostra(n); d.showModal(); });
    });
  });
  d.addEventListener("click", function (e) {
    var az = e.target.getAttribute && e.target.getAttribute("data-az");
    if (az === "prec") mostra(i - 1);
    else if (az === "succ") mostra(i + 1);
    else if (az === "chiudi" || e.target === d || e.target.classList.contains("lightbox-dentro")) d.close();
  });
  d.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") mostra(i - 1);
    if (e.key === "ArrowRight") mostra(i + 1);
  });
})();
