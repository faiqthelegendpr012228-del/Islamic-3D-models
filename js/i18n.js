/* =====================================================================
   i18n.js  —  English / العربية switch for the whole site
   ---------------------------------------------------------------------
   • The choice is saved in the browser; switching reloads the page.
   • In Arabic: the exhibit texts come from content-ar.js, reference
     names/lessons from references-ar.js, and every other label on the
     screen is translated live from the dictionary in ui-ar.js.
   • The page turns right-to-left (dir="rtl").
   ===================================================================== */
(function () {
  "use strict";
  const KEY = "signs-systems-lang";
  let lang = "en";
  try { lang = localStorage.getItem(KEY) === "ar" ? "ar" : "en"; } catch (e) { /* ignore */ }
  const url = new URLSearchParams(location.search).get("lang");
  if (url === "ar" || url === "en") lang = url;

  const I18N = {
    get lang() { return lang; },
    set(l) {
      try { localStorage.setItem(KEY, l); } catch (e) { /* ignore */ }
      const u = new URL(location.href); u.searchParams.delete("lang");
      location.href = u.toString();     // reload in the new language (wallet, passport etc. are kept)
      setTimeout(() => location.reload(), 50);
    },
    t: (en) => (lang === "ar" ? translate(en) : en)
  };
  window.I18N = I18N;

  // ---------- 1. swap the exhibit content (before anything is drawn) ----------
  if (lang === "ar") {
    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";
    const AR = window.TOPICS_AR || {};
    (window.TOPICS || []).forEach((t) => {
      const a = AR[t.id]; if (!a) return;
      ["title", "subtitle", "category", "howTo"].forEach((k) => { if (a[k]) t[k] = a[k]; });
      Object.keys(t.info).forEach((k) => { if (a.info && a.info[k]) Object.assign(t.info[k], a.info[k]); });
      (a.realLife || []).forEach((r, i) => { if (t.realLife[i]) Object.assign(t.realLife[i], r); });
      (a.quiz || []).forEach((q, i) => { if (t.quiz[i]) Object.assign(t.quiz[i], { q: q.q, options: q.options, explain: q.explain }); });
    });
    const RA = window.REFERENCES_AR || {};
    Object.keys(window.REFERENCES || {}).forEach((id) => {
      const r = window.REFERENCES[id], a = RA[id];
      if (a) { r.refEn = r.ref; r.ref = a.ref; r.lessonEn = r.lesson; r.lesson = a.lesson; }
    });
  }

  // ---------- 2. live label translator ----------
  const D = window.UI_AR || {};
  const PATTERNS = window.UI_AR_PATTERNS || [];
  const SYM = /^([^A-Za-z0-9؀-ۿ(“"'«]*)([\s\S]*?)([^A-Za-z0-9؀-ۿ)”"'»%.!?]*)$/;
  const UNIT = [
    [/^([\d,.]+(?:[–-][\d,.]+)?) km$/, "$1 كم"],
    [/^([\d,.]+(?:[–-][\d,.]+)?) m$/, "$1 م"],
    [/^([+−-]?)AED ([\d,.]+)$/, "$1$2 درهم"]
  ];
  function core(s) {
    if (D[s] !== undefined) return D[s];
    for (const [re, rep] of UNIT) if (re.test(s)) return s.replace(re, rep);
    for (const [re, fn] of PATTERNS) { const m = s.match(re); if (m) return typeof fn === "function" ? fn(m, translate) : s.replace(re, fn); }
    return null;
  }
  function translate(text) {
    const raw = String(text);
    const s = raw.trim();
    if (!s || !/[A-Za-z]/.test(s)) return raw;
    let out = core(s);
    if (out === null) {                         // strip emoji / arrows around the words
      const m = s.match(SYM);
      if (m && (m[1] || m[3])) { const c = core(m[2].trim()); if (c !== null) out = m[1] + c + m[3]; }
    }
    if (out === null && s.includes(" · ")) {    // "Atmosphere · Scientific Miracles", "Lanternfish · 500 m"
      const parts = s.split(" · ").map((p) => { const t = translate(p); return t; });
      if (parts.some((p, i) => p !== s.split(" · ")[i])) out = parts.join(" · ");
    }
    if (out === null) return raw;
    return raw.replace(s, out);
  }

  const SKIP = "script, style, .arabic, [lang='ar']:not(html), .no-tr, #vb-caption, .cert-name, .member-chip, .credit-card h3, code";
  function translateTree(root) {
    if (lang !== "ar" || !root) return;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.parentElement && n.parentElement.closest(SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT)
    });
    const nodes = []; while (w.nextNode()) nodes.push(w.currentNode);
    nodes.forEach((n) => {
      if (!/[A-Za-z]/.test(n.nodeValue)) return;
      const t = translate(n.nodeValue);
      if (t !== n.nodeValue) n.nodeValue = t;
    });
    if (root.querySelectorAll) root.querySelectorAll("[placeholder],[title]").forEach((el) => {
      if (el.placeholder && /[A-Za-z]/.test(el.placeholder)) el.placeholder = translate(el.placeholder);
      if (el.title && /[A-Za-z]/.test(el.title)) el.title = translate(el.title);
    });
  }
  I18N.translateTree = translateTree;

  // ---------- 3. language switch buttons ----------
  function addSwitches() {
    const label = lang === "ar" ? "🌐 English" : "🌐 العربية";
    // fixed pill on the homepage and start screen
    const pill = document.createElement("button");
    pill.id = "lang-pill"; pill.className = "no-tr"; pill.textContent = label;
    pill.onclick = () => I18N.set(lang === "ar" ? "en" : "ar");
    document.body.appendChild(pill);
    // a button at the end of the exhibit top bar
    const tb = document.getElementById("topbar");
    if (tb) {
      const b = document.createElement("button");
      b.className = "nav-btn lang-btn no-tr"; b.textContent = label;
      b.onclick = () => I18N.set(lang === "ar" ? "en" : "ar");
      tb.appendChild(b);
    }
  }

  function boot() {
    addSwitches();
    if (lang !== "ar") return;
    document.body.classList.add("rtl");
    translateTree(document.body);
    document.title = "دلائل وأنظمة · متحف تفاعلي للتربية الإسلامية";
    let queued = new Set(), timer = null;
    const obs = new MutationObserver((muts) => {
      muts.forEach((m) => {
        if (m.type === "characterData") queued.add(m.target.parentElement);
        else m.addedNodes.forEach((n) => queued.add(n.nodeType === 3 ? n.parentElement : n));
      });
      clearTimeout(timer);
      timer = setTimeout(() => {
        obs.disconnect();
        queued.forEach((n) => n && n.isConnected && translateTree(n));
        queued = new Set();
        obs.observe(document.body, { childList: true, subtree: true, characterData: true });
      }, 0);
    });
    obs.observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
