/* Synchronous local theme bootstrap: runs before page CSS to prevent colour flash. */
(function () {
  "use strict";
  var KEY = "rbsb_site_theme_v1";
  var DEFAULTS = { primary:"#14243A", accent:"#C5A46D", background:"#FAF8F3", surface:"#FFFFFF", text:"#273444", muted:"#667085", border:"#E7E2D8", siteName:"EVENTWALE" };
  function validHex(v) { return typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v); }
  function apply(theme) {
    theme = theme && typeof theme === "object" ? theme : {};
    var map = {primary:"--primary", accent:"--accent", background:"--page-bg", surface:"--surface", text:"--text", muted:"--muted", border:"--border"};
    Object.keys(map).forEach(function (key) {
      document.documentElement.style.setProperty(map[key], validHex(theme[key]) ? theme[key] : DEFAULTS[key]);
    });
  }
  try {
    var raw = localStorage.getItem(KEY);
    if (raw) { var parsed = JSON.parse(raw); apply(parsed); window.__RBSB_CACHED_THEME__ = parsed; }
    else { apply(DEFAULTS); }
  } catch (_) { apply(DEFAULTS); }
  window.__RBSB_APPLY_THEME_CACHE__ = function (theme) {
    try { localStorage.setItem(KEY, JSON.stringify(theme)); } catch (_) {}
    apply(theme);
  };
})();
