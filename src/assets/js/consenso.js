/* Banner cookie + Google Consent Mode v2 + Pixel di Meta – SOS Impresa Campania
   Categorie: tecnici (sempre attivi), statistiche (Google Analytics tramite Tag Manager),
   marketing (Meta Pixel e tag pubblicitari in Tag Manager). La scelta resta salvata nel browser per 6 mesi.
   Gli ID di Tag Manager e Pixel si cambiano dal pannello: Impostazioni → Dati dell'associazione e contatti. */
(function () {
  var KEY = 'sos_consent_v1', MAX_AGE = 1000 * 60 * 60 * 24 * 180;
  var CFG = window.SITO_TRACCIAMENTO || {};

  function read() {
    try { var c = JSON.parse(localStorage.getItem(KEY)); if (c && Date.now() - c.t < MAX_AGE) return c; } catch (e) {}
    return null;
  }
  function save(stats, mkt) {
    var c = { s: !!stats, m: !!mkt, t: Date.now() };
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {}
    apply(c, true);
  }

  /* Pixel di Meta: si carica solo con il consenso marketing */
  var pixelPronto = false;
  function caricaPixel() {
    if (pixelPronto || !CFG.pixel) return;
    pixelPronto = true;
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s) }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('consent', 'grant');
    fbq('init', CFG.pixel);
    fbq('track', 'PageView');
  }

  function apply(c, fresh) {
    window.gtag && gtag('consent', 'update', {
      analytics_storage: c.s ? 'granted' : 'denied',
      ad_storage: c.m ? 'granted' : 'denied',
      ad_user_data: c.m ? 'granted' : 'denied',
      ad_personalization: c.m ? 'granted' : 'denied'
    });
    if (c.m) caricaPixel(); else if (window.fbq) fbq('consent', 'revoke');
    if (fresh) (window.dataLayer = window.dataLayer || []).push({ event: 'consenso_aggiornato', consenso_statistiche: c.s, consenso_marketing: c.m });
  }

  /* Eventi utili per le conversioni: telefono, email, download dei documenti */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
    var h = a.getAttribute('href') || '', dl = (window.dataLayer = window.dataLayer || []);
    if (h.indexOf('tel:') === 0) {
      dl.push({ event: 'click_telefono', numero: h.slice(4) });
      window.fbq && fbq('track', 'Contact', { metodo: 'telefono' });
    } else if (h.indexOf('mailto:') === 0) {
      dl.push({ event: 'click_email', email: h.slice(7).split('?')[0] });
      window.fbq && fbq('track', 'Contact', { metodo: 'email' });
    } else if (/\.pdf($|\?)/i.test(h)) {
      var nome = h.split('/').pop().split('?')[0];
      dl.push({ event: 'download_documento', documento: nome });
      window.fbq && fbq('trackCustom', 'DownloadDocumento', { documento: nome });
    }
  }, true);

  function show(openDetails) {
    if (document.querySelector('.ck')) return;
    var c = read() || { s: false, m: false };
    var d = document.createElement('div'); d.className = 'ck' + (openDetails ? ' more' : ''); d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', 'Preferenze cookie');
    d.innerHTML = '<button class="ck-x" aria-label="Chiudi e rifiuta i cookie non necessari">×</button>'
      + '<h2>Cookie e privacy</h2>'
      + '<p>Usiamo cookie tecnici necessari al funzionamento del sito e, solo con il tuo consenso, cookie statistici e di marketing (Google, Meta) per misurare le visite e le campagne di sensibilizzazione. Dettagli nella <a href="/cookie-policy/">cookie policy</a>.</p>'
      + '<div class="ck-opts">'
      + '<label><input type="checkbox" checked disabled><span><b>Tecnici</b> – sempre attivi, servono al funzionamento del sito.</span></label>'
      + '<label><input type="checkbox" id="ck-s"' + (c.s ? ' checked' : '') + '><span><b>Statistiche</b> – Google Analytics, per capire come viene usato il sito.</span></label>'
      + '<label><input type="checkbox" id="ck-m"' + (c.m ? ' checked' : '') + '><span><b>Marketing</b> – Meta e Google, per misurare e migliorare le campagne.</span></label>'
      + '</div>'
      + '<div class="ck-btns"><button class="ck-no">Rifiuta</button><button class="ck-more">Personalizza</button><button class="ck-ok">Accetta tutti</button></div>';
    document.body.appendChild(d);
    function close() { d.remove(); }
    d.querySelector('.ck-x').onclick = d.querySelector('.ck-no').onclick = function () { save(false, false); close(); };
    d.querySelector('.ck-ok').onclick = function () { save(true, true); close(); };
    var more = d.querySelector('.ck-more');
    function setMore() { more.textContent = d.classList.contains('more') ? 'Salva scelte' : 'Personalizza'; }
    setMore();
    more.onclick = function () {
      if (!d.classList.contains('more')) { d.classList.add('more'); setMore(); return; }
      save(d.querySelector('#ck-s').checked, d.querySelector('#ck-m').checked); close();
    };
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-cookie-prefs]'); if (a) { e.preventDefault(); show(true); }
  });

  var salvato = read();
  if (salvato) { if (salvato.m) caricaPixel(); return; }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { show(false); });
  else show(false);
})();
