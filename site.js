(function () {
  var P = window.PRODUCT; if (!P) return;
  var av = P.variants.filter(function (v) { return v.stock > 0; }); var min = Math.min.apply(null, (av.length ? av : P.variants).map(function (v) { return v.price; }));
  document.querySelectorAll("[data-from-price]").forEach(function (e) { e.textContent = String(min); });
})();
