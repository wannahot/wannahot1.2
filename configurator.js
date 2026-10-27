(function () {
  var P = window.PRODUCT; if (!P) return;
  var $ = function (s) { return document.querySelector(s); };
  var fmt = function (n) { return n.toLocaleString("pl-PL") + " zł"; };
  var okUrl = function (u) { return /^https:\/\/([a-z0-9-]+\.)?allegro\.pl\//i.test((u || "").trim()); };
  var cta = $("#cfg-cta"), mcta = $("[data-mbar-cta]"), price = $("[data-price]"), mprice = $("[data-mbar-price]"), status = $("[data-status]");
  var img = $(".slide.s1 img"), defaultSrc = img && img.getAttribute("src");

  function selected() {
    var s = {};
    ["size", "finish", "type"].forEach(function (k) { var c = document.querySelector('input[name="' + k + '"]:checked'); s[k] = c ? c.value : null; });
    return s;
  }
  function setCta(a, label, href, enabled, external) {
    if (!a) return;
    a.textContent = label;
    a.setAttribute("aria-disabled", enabled ? "false" : "true");
    if (enabled) { a.href = href; } else { a.removeAttribute("href"); }
    if (external) { a.target = "_blank"; a.rel = "noopener"; } else { a.removeAttribute("target"); a.removeAttribute("rel"); }
  }
  function update() {
    var s = selected(), complete = s.size && s.finish && s.type;
    var matches = P.variants.filter(function (v) { return (!s.size || v.size === s.size) && (!s.finish || v.finish === s.finish) && (!s.type || v.type === s.type); });
    var v = complete ? matches[0] : null;
    if (img) { img.src = (v && v.image) ? v.image : defaultSrc; }
    var priceText, msg, tone = "";
    if (!complete) {
      var pool = matches.filter(function (m) { return m.stock > 0; }); if (!pool.length) pool = matches;
      priceText = "od " + fmt(Math.min.apply(null, pool.map(function (m) { return m.price; })));
      msg = "Wybierz wielkość, wykończenie i typ, aby zobaczyć dokładną cenę.";
      setCta(cta, "Wybierz konfigurację", "#", false, false);
      setCta(mcta, "Skonfiguruj", "#konfigurator", true, false);
    } else {
      priceText = fmt(v.price);
      if (v.stock <= 0) {
        msg = "Obecnie niedostępny. Wybierz inną konfigurację."; tone = "bad";
        setCta(cta, "Obecnie niedostępny", "#", false, false); setCta(mcta, "Niedostępny", "#", false, false);
      } else if (!okUrl(v.allegroUrl)) {
        msg = "Oferta tej konfiguracji na Allegro będzie wkrótce dostępna."; tone = "warn";
        setCta(cta, "Oferta wkrótce", "#", false, false); setCta(mcta, "Oferta wkrótce", "#", false, false);
      } else {
        msg = "Dostępny"; tone = "ok";
        setCta(cta, "Kup na Allegro", v.allegroUrl, true, true); setCta(mcta, "Kup na Allegro", v.allegroUrl, true, true);
      }
    }
    price.textContent = priceText; if (mprice) mprice.textContent = priceText;
    status.textContent = msg; status.setAttribute("data-tone", tone);
    document.documentElement.setAttribute("data-variant", v ? v.id : "");
  }
  document.querySelectorAll('.cfg-opts input').forEach(function (i) { i.addEventListener("change", update); });
  [cta, mcta].forEach(function (a) { if (a) a.addEventListener("click", function (e) { if (a.getAttribute("aria-disabled") === "true") e.preventDefault(); }); });
  update();
})();
